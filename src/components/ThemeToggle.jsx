import { motion } from 'framer-motion';
import { TbSun, TbMoon, TbDeviceDesktop } from 'react-icons/tb';

function ThemeToggle({ darkMode, setDarkMode }) {
    // System preference detection
    const detectSystemPreference = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    // Use system preference
    const useSystemTheme = () => {
        const isDark = detectSystemPreference();
        setDarkMode(isDark);
        localStorage.setItem('theme', 'system');
    };

    // Toggle between light and dark
    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-full p-2 shadow-lg border border-white/20 flex items-center gap-1"
            >
                <ThemeButton
                    active={darkMode === false && localStorage.getItem('theme') !== 'system'}
                    onClick={() => {
                        setDarkMode(false);
                        localStorage.setItem('theme', 'light');
                    }}
                    icon={<TbSun />}
                    tooltip="Light mode"
                />
                <ThemeButton
                    active={darkMode === true && localStorage.getItem('theme') !== 'system'}
                    onClick={() => {
                        setDarkMode(true);
                        localStorage.setItem('theme', 'dark');
                    }}
                    icon={<TbMoon />}
                    tooltip="Dark mode"
                />
                <ThemeButton
                    active={localStorage.getItem('theme') === 'system'}
                    onClick={useSystemTheme}
                    icon={<TbDeviceDesktop />}
                    tooltip="System preference"
                />
            </motion.div>
        </div>
    );
}

function ThemeButton({ active, onClick, icon, tooltip }) {
    return (
        <div className="relative group">
            <button
                onClick={onClick}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${active
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-200 hover:bg-white/10'
                    }`}
            >
                {icon}
            </button>

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {tooltip}
                </div>
            </div>
        </div>
    );
}

export default ThemeToggle;