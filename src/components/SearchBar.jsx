import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbSearch, TbMapPin, TbArrowRight, TbHistory, TbX } from 'react-icons/tb';

function SearchBar({ onSearch, onLocationRequest }) {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const searchRef = useRef(null);

    // Load search history from localStorage
    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        if (query.trim()) {
            // Filter history based on user input
            const filteredHistory = history.filter(item =>
                item.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3); // Limit to 3 history matches

            // Add some common city suggestions if user has typed at least 2 characters
            let commonSuggestions = [];
            if (query.length >= 2) {
                const commonCities = [
                    "New York", "London", "Tokyo", "Paris", "Sydney",
                    "Beijing", "Dubai", "Mumbai", "Los Angeles", "Berlin",
                    "Toronto", "Singapore", "Barcelona", "Rome", "Amsterdam"
                ];

                commonSuggestions = commonCities
                    .filter(city => city.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 2); // Limit to 2 common city matches
            }

            // Combine history and common suggestions without duplicates
            const allSuggestions = [...new Set([...filteredHistory, ...commonSuggestions])].slice(0, 5);
            setSuggestions(allSuggestions);
            setShowSuggestions(allSuggestions.length > 0);
        } else {
            // When input is empty, show recent searches
            setSuggestions(history.slice(0, 5));
            setShowSuggestions(history.length > 0);
        }
    }, [query]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            // Save to search history
            saveTOSearchHistory(query);
            onSearch(query);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        saveTOSearchHistory(suggestion);
        onSearch(suggestion);
        setQuery(suggestion);
        setShowSuggestions(false);
    };

    const saveTOSearchHistory = (term) => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        // Remove if already exists
        const filteredHistory = history.filter(item =>
            item.toLowerCase() !== term.toLowerCase()
        );
        // Add to beginning of array and limit to 10 items
        const newHistory = [term, ...filteredHistory].slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        localStorage.setItem('searchHistory', JSON.stringify([]));
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative" ref={searchRef}>
            <div className="p-2 backdrop-blur-md bg-white/10 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200 text-xl" />
                    <input
                        type="text"
                        placeholder="Search for a city or location..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(suggestions.length > 0)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 
                        focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/50 
                        text-white font-semibold placeholder-blue-100/80 transition-all duration-300
                        shadow-inner shadow-white/10"
                    />
                </div>
                <div className="flex gap-2">
                    <motion.button
                        type="submit"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="py-4 px-5 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 flex justify-center items-center font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30"
                    >
                        <span className="mr-2">Search</span>
                        <TbArrowRight />
                    </motion.button>
                    <motion.button
                        type="button"
                        onClick={onLocationRequest}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="py-4 px-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 flex justify-center items-center font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/30"
                    >
                        <TbMapPin className="text-xl" />
                        <span className="ml-2 hidden sm:inline">Use My Location</span>
                    </motion.button>
                </div>
            </div>

            {/* Suggestions dropdown */}
            <AnimatePresence>
                {showSuggestions && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 mt-2 w-full left-0 right-0 backdrop-blur-md bg-white/15 rounded-xl border border-white/20 shadow-xl overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto py-2">
                            {suggestions.length > 0 && (
                                <div className="flex justify-between items-center px-4 py-2 text-xs text-blue-200 uppercase font-semibold">
                                    <span>{query ? 'Suggestions' : 'Recent Searches'}</span>
                                    {!query && (
                                        <button
                                            type="button"
                                            onClick={clearHistory}
                                            className="text-xs text-red-300 hover:text-red-100"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            )}

                            {suggestions.map((suggestion, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="flex items-center px-4 py-3 cursor-pointer hover:bg-white/10"
                                >
                                    <TbHistory className="mr-3 text-blue-300" />
                                    <span className="text-white font-medium">{suggestion}</span>
                                </motion.div>
                            ))}

                            {suggestions.length === 0 && (
                                <div className="px-4 py-3 text-blue-200 italic text-center">
                                    No recent searches
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}

export default SearchBar;