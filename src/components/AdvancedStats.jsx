import { useState } from 'react';
import { motion } from 'framer-motion';
import { TbChartBar, TbChevronDown, TbChevronUp, TbWind, TbDroplet, TbSun, TbLungs } from 'react-icons/tb';

function AdvancedStats({ weather, forecast, isExpanded = false }) {
    const [expanded, setExpanded] = useState(isExpanded);

    if (!weather || !forecast) return null;

    const { current } = weather;
    const dayForecast = forecast.forecastday[0].day;
    const airQuality = current.air_quality;

    const getAirQualityLabel = (aqi) => {
        // Using US EPA standard
        if (!aqi) return { label: 'Unknown', color: 'gray-500' };
        const usEpaIndex = aqi['us-epa-index'];

        switch (usEpaIndex) {
            case 1: return { label: 'Good', color: 'green-500' };
            case 2: return { label: 'Moderate', color: 'yellow-500' };
            case 3: return { label: 'Unhealthy for Sensitive Groups', color: 'orange-500' };
            case 4: return { label: 'Unhealthy', color: 'red-500' };
            case 5: return { label: 'Very Unhealthy', color: 'purple-500' };
            case 6: return { label: 'Hazardous', color: 'red-900' };
            default: return { label: 'Unknown', color: 'gray-500' };
        }
    };

    const airQualityInfo = getAirQualityLabel(airQuality);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-5 shadow-2xl overflow-hidden"
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between text-left"
            >
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <TbChartBar /> Advanced Weather Stats
                </h2>
                <span className="text-blue-200">
                    {expanded ? <TbChevronUp /> : <TbChevronDown />}
                </span>
            </button>

            {expanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-6"
                >
                    {/* Air Quality Section */}
                    <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <TbLungs className="text-blue-300" /> Air Quality
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <AirQualityCard
                                label="Air Quality Index"
                                value={airQuality?.['us-epa-index'] || 'N/A'}
                                description={airQualityInfo.label}
                                color={airQualityInfo.color}
                            />
                            <AirQualityCard
                                label="PM2.5"
                                value={airQuality?.pm2_5?.toFixed(1) || 'N/A'}
                                description="Fine particulate matter"
                            />
                            <AirQualityCard
                                label="PM10"
                                value={airQuality?.pm10?.toFixed(1) || 'N/A'}
                                description="Coarse particulate matter"
                            />
                            <AirQualityCard
                                label="Carbon Monoxide"
                                value={airQuality?.co?.toFixed(1) || 'N/A'}
                                description="CO levels"
                            />
                        </div>
                    </div>

                    {/* Sun & Moon Section */}
                    <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <TbSun className="text-yellow-300" /> Sun & Moon
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <StatsCard
                                label="Sunrise"
                                value={forecast.forecastday[0].astro.sunrise}
                            />
                            <StatsCard
                                label="Sunset"
                                value={forecast.forecastday[0].astro.sunset}
                            />
                            <StatsCard
                                label="Moonrise"
                                value={forecast.forecastday[0].astro.moonrise}
                            />
                            <StatsCard
                                label="Moonset"
                                value={forecast.forecastday[0].astro.moonset}
                            />
                            <StatsCard
                                label="Moon Phase"
                                value={forecast.forecastday[0].astro.moon_phase}
                            />
                            <StatsCard
                                label="Moon Illumination"
                                value={`${forecast.forecastday[0].astro.moon_illumination}%`}
                            />
                            <StatsCard
                                label="UV Index"
                                value={current.uv}
                                description={getUvDescription(current.uv)}
                            />
                            <StatsCard
                                label="Visibility"
                                value={`${current.vis_km} km`}
                            />
                        </div>
                    </div>

                    {/* Wind Details */}
                    <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <TbWind className="text-blue-300" /> Wind Details
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <StatsCard
                                label="Wind Speed"
                                value={`${current.wind_kph} km/h`}
                            />
                            <StatsCard
                                label="Wind Gusts"
                                value={`${current.gust_kph} km/h`}
                            />
                            <StatsCard
                                label="Wind Direction"
                                value={`${current.wind_degree}° ${current.wind_dir}`}
                            />
                            <StatsCard
                                label="Max Wind"
                                value={`${dayForecast.maxwind_kph} km/h`}
                            />
                        </div>
                    </div>

                    {/* Precipitation Details */}
                    <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <TbDroplet className="text-blue-300" /> Precipitation Details
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <StatsCard
                                label="Precipitation"
                                value={`${current.precip_mm} mm`}
                            />
                            <StatsCard
                                label="Humidity"
                                value={`${current.humidity}%`}
                            />
                            <StatsCard
                                label="Cloud Cover"
                                value={`${current.cloud}%`}
                            />
                            <StatsCard
                                label="Pressure"
                                value={`${current.pressure_mb} mb`}
                            />
                            <StatsCard
                                label="Total Precipitation"
                                value={`${dayForecast.totalprecip_mm} mm`}
                            />
                            <StatsCard
                                label="Chance of Rain"
                                value={`${dayForecast.daily_chance_of_rain}%`}
                            />
                            <StatsCard
                                label="Avg Humidity"
                                value={`${dayForecast.avghumidity}%`}
                            />
                            <StatsCard
                                label="Dewpoint"
                                value={`${current.dewpoint_c}°C`}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

function StatsCard({ label, value, description }) {
    return (
        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-xs text-blue-200/70 mb-1">{label}</div>
            <div className="font-semibold text-lg">{value}</div>
            {description && <div className="text-xs text-blue-300 mt-1">{description}</div>}
        </div>
    );
}

function AirQualityCard({ label, value, description, color }) {
    return (
        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-xs text-blue-200/70 mb-1">{label}</div>
            <div className="font-semibold text-lg">{value}</div>
            {description && (
                <div className={`text-xs text-${color || 'blue-300'} mt-1`}>
                    {description}
                </div>
            )}
        </div>
    );
}

function getUvDescription(uv) {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
}

export default AdvancedStats;