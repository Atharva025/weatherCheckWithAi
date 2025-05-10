import { motion } from 'framer-motion';
import {
    TbBulb, TbHanger, TbActivity, TbAlertTriangle,
    TbHeart, TbCar, TbChartBar, TbBolt,
    TbCamera, TbMoodSmile
} from 'react-icons/tb';

function AiInsights({ insights, loading }) {
    if (!insights) return null;

    const {
        summary, clothing, activities, alerts,
        health, travel, context, energy,
        photography, mood
    } = insights;

    // Define the grid layout based on available insights
    const hasExtendedInsights = health || travel || context || energy || photography || mood;

    return (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl relative">
            {loading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <TbBulb className="text-xl" />
                </div>
                <h2 className="text-2xl font-bold">AI Weather Insights</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Core insights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="backdrop-blur-md bg-white/5 rounded-xl p-5 border border-white/10"
                >
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TbBulb className="text-yellow-300" />
                        Weather Summary
                    </h3>
                    <p className="text-blue-100 leading-relaxed">{summary}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="backdrop-blur-md bg-white/5 rounded-xl p-5 border border-white/10"
                >
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TbHanger className="text-pink-300" />
                        What to Wear
                    </h3>
                    <p className="text-blue-100 leading-relaxed">{clothing}</p>
                </motion.div>

                {/* Extended insights */}
                {health && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="backdrop-blur-md bg-white/5 rounded-xl p-5 border border-white/10"
                    >
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <TbHeart className="text-red-300" />
                            Health & Wellness
                        </h3>
                        <p className="text-blue-100 leading-relaxed">{health}</p>
                    </motion.div>
                )}

                {travel && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="backdrop-blur-md bg-white/5 rounded-xl p-5 border border-white/10"
                    >
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <TbCar className="text-blue-300" />
                            Travel & Commute
                        </h3>
                        <p className="text-blue-100 leading-relaxed">{travel}</p>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className={`backdrop-blur-md bg-white/5 rounded-xl p-5 border border-white/10 ${hasExtendedInsights ? '' : 'md:col-span-2'}`}
                >
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TbActivity className="text-green-300" />
                        Recommended Activities
                    </h3>
                    <p className="text-blue-100 leading-relaxed">{activities}</p>
                </motion.div>

                {context && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="backdrop-blur-md bg-white/5 rounded-xl p-5 border border-white/10"
                    >
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <TbChartBar className="text-purple-300" />
                            Weather Context
                        </h3>
                        <p className="text-blue-100 leading-relaxed">{context}</p>
                    </motion.div>
                )}

                {energy && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.35 }}
                        className="backdrop-blur-md bg-white/5 rounded-xl p-5 border border-white/10"
                    >
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <TbBolt className="text-yellow-300" />
                            Energy Tips
                        </h3>
                        <p className="text-blue-100 leading-relaxed">{energy}</p>
                    </motion.div>
                )}


                {mood && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.45 }}
                        className="backdrop-blur-md bg-white/5 rounded-xl p-5 border border-white/10"
                    >
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <TbMoodSmile className="text-green-300" />
                            Mood & Well-being
                        </h3>
                        <p className="text-blue-100 leading-relaxed">{mood}</p>
                    </motion.div>
                )}

                {/* Weather alerts - always at the bottom and full width */}
                {alerts && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className="backdrop-blur-md bg-red-500/20 rounded-xl p-5 border border-red-500/30 md:col-span-2"
                    >
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-300">
                            <TbAlertTriangle className="text-red-300" />
                            Weather Alerts
                        </h3>
                        <p className="text-red-100 leading-relaxed">{alerts}</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default AiInsights;