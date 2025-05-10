import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TbChartLine, TbTemperature, TbDroplet, TbWind } from 'react-icons/tb';

function WeatherTrends({ forecast }) {
    const [chartData, setChartData] = useState(null);
    const [selectedMetric, setSelectedMetric] = useState('temperature');
    const svgRef = useRef(null);

    // Add a debug state to help troubleshoot
    const [debug, setDebug] = useState({
        dataPoints: 0,
        min: 0,
        max: 0
    });

    useEffect(() => {
        if (!forecast?.forecastday) {
            console.log("No forecast data available");
            return;
        }

        try {
            // Format data for charts with additional validation
            const extractHourlyData = () => {
                // Combine all hourly data from all forecast days
                const allHourlyData = forecast.forecastday.flatMap(day =>
                    (day.hour || []).map(hour => ({
                        time: new Date(hour.time).getHours(),
                        temp: parseFloat(hour.temp_c) || 0,
                        humidity: parseFloat(hour.humidity) || 0,
                        wind: parseFloat(hour.wind_kph) || 0,
                        timestamp: hour.time_epoch
                    }))
                );

                // Sort by timestamp
                allHourlyData.sort((a, b) => a.timestamp - b.timestamp);

                // Only take the next 24 hours
                return allHourlyData.slice(0, 24);
            };

            const processedData = extractHourlyData();
            console.log("Processed chart data:", processedData);
            setChartData(processedData);

            // Update debug info
            setDebug({
                dataPoints: processedData.length,
                min: Math.min(...processedData.map(d => d.temp)),
                max: Math.max(...processedData.map(d => d.temp))
            });
        } catch (error) {
            console.error("Error processing forecast data:", error);
        }
    }, [forecast]);

    // If data isn't available, show a placeholder
    if (!chartData || chartData.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-5 shadow-2xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <TbChartLine /> Weather Trends
                    </h2>
                </div>
                <div className="h-64 flex items-center justify-center text-blue-200">
                    <p>Weather trend data is loading or unavailable</p>
                </div>
            </motion.div>
        );
    }

    // Get min and max for current metric for scaling with safety checks
    const getRange = () => {
        try {
            const values = chartData.map(item => {
                if (selectedMetric === 'temperature') return item.temp;
                if (selectedMetric === 'humidity') return item.humidity;
                if (selectedMetric === 'wind') return item.wind;
                return 0;
            }).filter(val => !isNaN(val)); // Filter out any NaN values

            if (values.length === 0) return { min: 0, max: 100 }; // Fallback

            const min = Math.min(...values);
            const max = Math.max(...values);

            // Ensure we have a valid range even if min equals max
            if (min === max) {
                return {
                    min: min - 10,
                    max: max + 10
                };
            }

            // Add 10% padding
            return {
                min: min - (Math.abs(min) * 0.1),
                max: max + (Math.abs(max) * 0.1)
            };
        } catch (error) {
            console.error("Error calculating range:", error);
            return { min: 0, max: 100 }; // Fallback values
        }
    };

    const range = getRange();
    const chartHeight = 200;

    // Scale value to chart height with extra validation
    const scaleValue = (value) => {
        if (isNaN(value)) return chartHeight / 2; // Center if invalid
        if (range.max === range.min) return chartHeight / 2; // Avoid division by zero

        // Clamp value within range
        const clampedValue = Math.max(range.min, Math.min(range.max, value));
        return chartHeight - (((clampedValue - range.min) / (range.max - range.min)) * chartHeight);
    };

    // For debugging: create path data with detailed logging
    const createPathData = () => {
        try {
            if (!chartData || chartData.length === 0) return "";

            let pathData = `M 0 ${scaleValue(getValue(chartData[0]))}`;
            console.log(`Starting path at: M 0 ${scaleValue(getValue(chartData[0]))}`);

            chartData.slice(1).forEach((item, i) => {
                const value = getValue(item);
                const scaledValue = scaleValue(value);
                const pathSegment = ` L ${i + 1} ${scaledValue}`;
                console.log(`Point ${i + 1}: ${value} → ${scaledValue}`);
                pathData += pathSegment;
            });

            return pathData;
        } catch (error) {
            console.error("Error creating path data:", error);
            return "M 0 0";
        }
    };

    // Helper function to get current metric value
    const getValue = (item) => {
        if (selectedMetric === 'temperature') return item.temp;
        if (selectedMetric === 'humidity') return item.humidity;
        if (selectedMetric === 'wind') return item.wind;
        return 0;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-5 shadow-2xl"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <TbChartLine /> Weather Trends
                </h2>

                <div className="flex gap-2">
                    <MetricButton
                        active={selectedMetric === 'temperature'}
                        onClick={() => setSelectedMetric('temperature')}
                        icon={<TbTemperature />}
                        label="Temperature"
                        selectedMetric={selectedMetric}
                    />
                    <MetricButton
                        active={selectedMetric === 'humidity'}
                        onClick={() => setSelectedMetric('humidity')}
                        icon={<TbDroplet />}
                        label="Humidity"
                        selectedMetric={selectedMetric}
                    />
                    <MetricButton
                        active={selectedMetric === 'wind'}
                        onClick={() => setSelectedMetric('wind')}
                        icon={<TbWind />}
                        label="Wind"
                        selectedMetric={selectedMetric}
                    />
                </div>
            </div>

            <div className="relative h-64 overflow-hidden border border-white/10 rounded-xl">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-blue-200/70 p-2 bg-black/20">
                    <span>{Math.round(range.max)}{selectedMetric === 'temperature' ? '°C' : selectedMetric === 'humidity' ? '%' : ' km/h'}</span>
                    <span>{Math.round((range.max + range.min) / 2)}{selectedMetric === 'temperature' ? '°C' : selectedMetric === 'humidity' ? '%' : ' km/h'}</span>
                    <span>{Math.round(range.min)}{selectedMetric === 'temperature' ? '°C' : selectedMetric === 'humidity' ? '%' : ' km/h'}</span>
                </div>

                {/* Chart area */}
                <div className="absolute left-12 right-0 top-0 bottom-0 bg-black/10">
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        <div className="border-t border-white/10"></div>
                        <div className="border-t border-white/10"></div>
                        <div className="border-t border-white/10"></div>
                    </div>

                    {/* Chart line */}
                    <svg
                        className="absolute inset-0 w-full h-full"
                        ref={svgRef}
                        viewBox={`0 0 ${chartData.length - 1} ${chartHeight}`}
                        preserveAspectRatio="none"
                    >
                        {/* Line path with simpler, more direct approach */}
                        <path
                            d={`M 0 ${scaleValue(getValue(chartData[0]))} ${chartData.slice(1).map((item, i) =>
                                `L ${i + 1} ${scaleValue(getValue(item))}`).join(' ')}`}
                            fill="none"
                            stroke={selectedMetric === 'temperature' ? '#ec4899' : selectedMetric === 'humidity' ? '#3b82f6' : '#a855f7'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Gradient area under the line */}
                        <path
                            d={`M 0 ${scaleValue(getValue(chartData[0]))} ${chartData.slice(1).map((item, i) =>
                                `L ${i + 1} ${scaleValue(getValue(item))}`).join(' ')} L ${chartData.length - 1} ${chartHeight} L 0 ${chartHeight} Z`}
                            fill={`url(#gradient-${selectedMetric})`}
                            opacity="0.3"
                        />

                        {/* Gradient definitions */}
                        <defs>
                            <linearGradient id="gradient-temperature" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="gradient-humidity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="gradient-wind" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Data points */}
                        {chartData.map((item, i) => (
                            <circle
                                key={i}
                                cx={i}
                                cy={scaleValue(getValue(item))}
                                r="3"
                                fill={selectedMetric === 'temperature' ? '#ec4899' : selectedMetric === 'humidity' ? '#3b82f6' : '#a855f7'}
                            />
                        ))}
                    </svg>

                    {/* X-axis time labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-blue-200/70 px-2">
                        {chartData.filter((_, i) => i % 4 === 0).map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="h-2 border-l border-white/10"></div>
                                <span>{`${item.time}:00`}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Debug info - remove in production */}
            {/*
            <div className="mt-2 text-xs text-blue-200/50 p-2 border border-white/10 rounded">
                <p>Points: {debug.dataPoints} | Range: {Math.round(range.min)} to {Math.round(range.max)} | Metric: {selectedMetric}</p>
            </div>
            */}
        </motion.div>
    );
}

function MetricButton({ active, onClick, icon, label, selectedMetric }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${active
                ? selectedMetric === 'temperature'
                    ? 'bg-pink-500 text-white'
                    : selectedMetric === 'humidity'
                        ? 'bg-blue-500 text-white'
                        : 'bg-purple-500 text-white'
                : 'bg-white/10 text-blue-100 hover:bg-white/20'
                }`}
        >
            {icon}
            <span className="hidden md:inline">{label}</span>
        </button>
    );
}

export default WeatherTrends;