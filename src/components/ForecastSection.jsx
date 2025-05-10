import { motion } from 'framer-motion';
import { useState } from 'react';
import { TbClock, TbClockHour8 } from 'react-icons/tb';

function ForecastSection({ forecast, loading }) {
    const [showHourly, setShowHourly] = useState(true);

    if (!forecast) return null;

    const { forecastday } = forecast;
    const today = forecastday[0];

    const currentHour = new Date().getHours();
    // Filter hours that are still to come today
    const remainingHours = today.hour.filter(hour => {
        const hourTime = new Date(hour.time).getHours();
        return hourTime >= currentHour;
    });

    return (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl relative">
            {loading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold">Forecast</h2>

                <div className="flex items-center gap-3 bg-white/5 p-1 rounded-lg">
                    <button
                        onClick={() => setShowHourly(true)}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all ${showHourly
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                            : 'text-blue-100 hover:bg-white/5'
                            }`}
                    >
                        <TbClock />
                        <span>Hourly</span>
                    </button>
                    <button
                        onClick={() => setShowHourly(false)}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-all ${!showHourly
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                            : 'text-blue-100 hover:bg-white/5'
                            }`}
                    >
                        <TbClockHour8 />
                        <span>Day's Overview</span>
                    </button>
                </div>
            </div>

            {showHourly ? (
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                    <div className="flex gap-3 min-w-max">
                        {remainingHours.map((hour, idx) => (
                            <motion.div
                                key={hour.time}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center min-w-[100px]"
                            >
                                <span className="text-sm text-blue-100">
                                    {new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <img
                                    src={hour.condition.icon}
                                    alt={hour.condition.text}
                                    className="w-14 h-14 my-2"
                                />
                                <span className="font-bold text-xl">{Math.round(hour.temp_c)}°</span>
                                <span className="text-xs text-blue-200 text-center mt-1 line-clamp-1" title={hour.condition.text}>
                                    {hour.condition.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <DayOverviewCard
                        title="Morning"
                        icon={today.hour[8].condition.icon}
                        temp={Math.round(today.hour[8].temp_c)}
                        description={today.hour[8].condition.text}
                        detail={`Feels like ${Math.round(today.hour[8].feelslike_c)}°`}
                    />
                    <DayOverviewCard
                        title="Afternoon"
                        icon={today.hour[14].condition.icon}
                        temp={Math.round(today.hour[14].temp_c)}
                        description={today.hour[14].condition.text}
                        detail={`Feels like ${Math.round(today.hour[14].feelslike_c)}°`}
                    />
                    <DayOverviewCard
                        title="Evening"
                        icon={today.hour[20].condition.icon}
                        temp={Math.round(today.hour[20].temp_c)}
                        description={today.hour[20].condition.text}
                        detail={`Feels like ${Math.round(today.hour[20].feelslike_c)}°`}
                    />

                    <div className="sm:col-span-3 backdrop-blur-md bg-white/5 p-5 rounded-xl border border-white/10 mt-4">
                        <h3 className="text-lg font-semibold mb-3">Today's Overview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                            <SummaryItem
                                label="Min Temp"
                                value={`${Math.round(today.day.mintemp_c)}°C`}
                            />
                            <SummaryItem
                                label="Max Temp"
                                value={`${Math.round(today.day.maxtemp_c)}°C`}
                            />
                            <SummaryItem
                                label="Avg Humidity"
                                value={`${today.day.avghumidity}%`}
                            />
                            <SummaryItem
                                label="Chance of Rain"
                                value={`${today.day.daily_chance_of_rain}%`}
                            />
                            <SummaryItem
                                label="Sunrise"
                                value={today.astro.sunrise}
                            />
                            <SummaryItem
                                label="Sunset"
                                value={today.astro.sunset}
                            />
                            <SummaryItem
                                label="Max Wind"
                                value={`${today.day.maxwind_kph} km/h`}
                            />
                            <SummaryItem
                                label="Total Precip"
                                value={`${today.day.totalprecip_mm} mm`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DayOverviewCard({ title, icon, temp, description, detail }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-md bg-white/5 p-5 rounded-xl border border-white/10 flex flex-col items-center"
        >
            <h3 className="text-lg font-medium text-blue-100">{title}</h3>
            <img src={icon} alt={description} className="w-16 h-16 my-2" />
            <span className="text-3xl font-bold">{temp}°</span>
            <span className="text-sm text-center text-blue-100 mt-1">{description}</span>
            <span className="text-xs text-blue-200/70 mt-1">{detail}</span>
        </motion.div>
    );
}

function SummaryItem({ label, value }) {
    return (
        <div className="backdrop-blur-md bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="text-xs text-blue-200/70">{label}</div>
            <div className="font-semibold">{value}</div>
        </div>
    );
}

export default ForecastSection;