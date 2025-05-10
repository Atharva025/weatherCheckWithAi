import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TbBulb, TbHanger, TbActivity, TbAlertTriangle,
    TbHeart, TbCar, TbChartBar, TbBolt,
    TbCamera, TbMoodSmile, TbCategory, TbBed,
    TbSoup, TbBriefcase, TbSmartHome, TbClock,
    TbStars, TbChevronDown, TbChevronUp, TbDroplet,
    TbCalendarEvent, TbMountain, TbMapPin
} from 'react-icons/tb';

function AiInsights({ insights, loading }) {
    const [activeCategory, setActiveCategory] = useState('essential');
    const [expanded, setExpanded] = useState(true);

    if (!insights) return null;

    // Define our categories structure
    const categories = {
        essential: {
            label: 'Essential',
            icon: <TbCategory />,
            items: [
                { key: 'summary', title: 'Weather Summary', icon: <TbBulb className="text-yellow-300" /> },
                { key: 'clothing', title: 'What to Wear', icon: <TbHanger className="text-pink-300" /> },
                { key: 'activities', title: 'Recommended Activities', icon: <TbActivity className="text-green-300" /> },
                { key: 'health', title: 'Health & Wellness', icon: <TbHeart className="text-red-300" /> }
            ]
        },
        lifestyle: {
            label: 'Lifestyle',
            icon: <TbMoodSmile />,
            items: [
                { key: 'travel', title: 'Travel & Commute', icon: <TbCar className="text-blue-300" /> },
                { key: 'mood', title: 'Mood & Well-being', icon: <TbMoodSmile className="text-green-300" /> },
                { key: 'foodSuggestions', title: 'Food & Drinks', icon: <TbSoup className="text-orange-300" /> },
                { key: 'sleepRecommendations', title: 'Sleep Optimization', icon: <TbBed className="text-indigo-300" /> }
            ]
        },
        environment: {
            label: 'Environment',
            icon: <TbBolt />,
            items: [
                { key: 'energy', title: 'Energy Tips', icon: <TbBolt className="text-yellow-300" /> },
                { key: 'smartHomeSettings', title: 'Smart Home', icon: <TbSmartHome className="text-blue-300" /> },
                { key: 'outdoorTiming', title: 'Best Outdoor Times', icon: <TbClock className="text-green-300" /> },
                { key: 'context', title: 'Weather Context', icon: <TbChartBar className="text-purple-300" /> }
            ]
        },
        special: {
            label: 'Special',
            icon: <TbCamera />,
            items: [
                { key: 'localEvents', title: 'Local Events', icon: <TbCalendarEvent className="text-rose-300" /> },
                { key: 'astronomicalEvents', title: 'Astronomy', icon: <TbStars className="text-violet-300" /> },
                { key: 'productivityInsights', title: 'Productivity', icon: <TbBriefcase className="text-amber-300" /> },
                { key: 'recreationalSpots', title: 'Recreational Spots', icon: <TbMapPin className="text-emerald-300" /> }
            ]
        }
    };

    // Find active items that have content
    const activeItems = categories[activeCategory].items.filter(item => insights[item.key]);

    return (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl relative">
            {loading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <TbBulb className="text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold">AI Weather Insights</h2>
                </div>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-2 text-blue-300 hover:text-blue-100 transition-colors"
                >
                    {expanded ? <TbChevronUp /> : <TbChevronDown />}
                </button>
            </div>

            {expanded && (
                <>
                    {/* Category Navigation */}
                    <div className="flex overflow-x-auto pb-2 mb-5 gap-2 scrollbar-none">
                        {Object.entries(categories).map(([key, category]) => (
                            <button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className={`py-2 px-4 rounded-lg flex items-center gap-2 text-sm whitespace-nowrap transition-all ${activeCategory === key
                                    ? 'bg-blue-500/20 text-blue-100 shadow-md'
                                    : 'text-blue-300/70 hover:text-blue-200 hover:bg-white/5'
                                    }`}
                            >
                                {category.icon}
                                <span>{category.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {activeItems.length > 0 ? (
                                activeItems.map((item, index) => (
                                    <motion.div
                                        key={item.key}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10"
                                    >
                                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                                            {item.icon}
                                            {item.title}
                                        </h3>
                                        <p className="text-blue-100 leading-relaxed text-sm">{insights[item.key]}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-6 text-blue-200/60 italic">
                                    No insights available for this category
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Weather alerts - always at the bottom if present */}
                    {insights.alerts && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="backdrop-blur-md bg-red-500/20 rounded-xl p-4 border border-red-500/30 mt-4"
                        >
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-300">
                                <TbAlertTriangle className="text-red-300" />
                                Weather Alerts
                            </h3>
                            <p className="text-red-100 leading-relaxed text-sm">{insights.alerts}</p>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
}

// Add a small utility for no scrollbar showing on category navigation
const styles = document.createElement('style');
styles.textContent = `
    .scrollbar-none {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-none::-webkit-scrollbar {
        display: none;
    }
`;
document.head.appendChild(styles);

export default AiInsights;