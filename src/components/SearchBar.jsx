import { useState } from 'react';
import { motion } from 'framer-motion';
import { TbSearch, TbMapPin, TbArrowRight } from 'react-icons/tb';

function SearchBar({ onSearch, onLocationRequest }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="p-2 backdrop-blur-md bg-white/10 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200 text-xl" />
                    <input
                        type="text"
                        placeholder="Search for a city or location..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 
                        focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/50 
                        text-white font-medium placeholder-blue-100 transition-all duration-300
                        shadow-inner shadow-white/5"
                    />
                </div>
                <div className="flex gap-2">
                    <motion.button
                        type="submit"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="py-4 px-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 flex justify-center items-center font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30"
                    >
                        <span className="mr-2">Search</span>
                        <TbArrowRight />
                    </motion.button>
                    <motion.button
                        type="button"
                        onClick={onLocationRequest}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="py-4 px-5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 flex justify-center items-center font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30"
                    >
                        <TbMapPin className="text-xl" />
                        <span className="ml-2 hidden sm:inline">Use My Location</span>
                    </motion.button>
                </div>
            </div>
        </form>
    );
}

export default SearchBar;