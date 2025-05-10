import { motion } from 'framer-motion';
import { TbWind, TbDroplet, TbTemperature, TbUvIndex, TbEye } from 'react-icons/tb';

function WeatherCard({ data, loading }) {
    if (!data) return null;

    const { location, current } = data;

    // Animated variants for card elements
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: { delay: custom * 0.1, duration: 0.5 }
        })
    };

    return (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-3xl"></div>

            {/* Loading indicator */}
            {loading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 relative z-10">
                {/* Location and temperature section */}
                <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                >
                    <div>
                        <motion.h2
                            className="text-3xl font-bold"
                            variants={cardVariants}
                            custom={1}
                        >
                            {location.name}
                        </motion.h2>
                        <motion.p
                            className="text-blue-100"
                            variants={cardVariants}
                            custom={2}
                        >
                            {location.region}, {location.country}
                        </motion.p>
                    </div>

                    <motion.div
                        className="flex items-end"
                        variants={cardVariants}
                        custom={3}
                    >
                        <span className="text-8xl font-bold text-white">{current.temp_c}</span>
                        <span className="text-5xl font-semibold ml-1 text-white">°C</span>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        custom={4}
                        className="flex items-center"
                    >
                        <img
                            src={current.condition.icon}
                            alt={current.condition.text}
                            className="w-16 h-16 object-contain"
                        />
                        <span className="text-xl ml-2">{current.condition.text}</span>
                    </motion.div>

                    <motion.div
                        className="text-blue-100"
                        variants={cardVariants}
                        custom={5}
                    >
                        <p>Feels like {current.feelslike_c}°C</p>
                        <p>Last updated: {current.last_updated}</p>
                    </motion.div>
                </motion.div>

                {/* Weather details section */}
                <motion.div
                    className="grid grid-cols-2 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    custom={6}
                >
                    <DetailCard
                        icon={<TbWind />}
                        title="Wind"
                        value={`${current.wind_kph} km/h`}
                        subtitle={current.wind_dir}
                    />
                    <DetailCard
                        icon={<TbDroplet />}
                        title="Humidity"
                        value={`${current.humidity}%`}
                        subtitle="Precipitation"
                    />
                    <DetailCard
                        icon={<TbTemperature />}
                        title="Pressure"
                        value={`${current.pressure_mb} mb`}
                        subtitle="Barometer"
                    />
                    <DetailCard
                        icon={<TbUvIndex />}
                        title="UV Index"
                        value={current.uv}
                        subtitle={getUvDescription(current.uv)}
                    />
                    <DetailCard
                        icon={<TbEye />}
                        title="Visibility"
                        value={`${current.vis_km} km`}
                        subtitle="Vision distance"
                    />
                    <DetailCard
                        icon={<TbDroplet />}
                        title="Precipitation"
                        value={`${current.precip_mm} mm`}
                        subtitle="Last hour"
                    />
                </motion.div>
            </div>
        </div>
    );
}

function DetailCard({ icon, title, value, subtitle }) {
    return (
        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-2xl mb-1 text-blue-200">
                {icon}
            </div>
            <div className="text-sm text-blue-100">{title}</div>
            <div className="font-bold text-xl">{value}</div>
            <div className="text-xs text-blue-200/70">{subtitle}</div>
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

export default WeatherCard;