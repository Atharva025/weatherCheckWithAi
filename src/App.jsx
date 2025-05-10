import { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import ForecastSection from './components/ForecastSection';
import AiInsights from './components/AiInsights';
import Particles from './components/Particles';
import ErrorMessage from './components/ErrorMessage';
import WeatherAlerts from './components/WeatherAlerts';
import AdvancedStats from './components/AdvancedStats';
import useWeatherData from './utils/useWeatherData';
import { motion } from 'framer-motion';
import { TbSunHigh } from "react-icons/tb";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  // Remove darkMode state and always use light mode

  const {
    weather,
    forecast,
    insights,
    loading,
    error,
    fetchWeather,
    fetchWithGeolocation
  } = useWeatherData();

  useEffect(() => {
    fetchWithGeolocation();
    // Remove theme system preference listener
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchQuery(query);
      fetchWeather(query);
    }
  };

  const getBackgroundClass = () => {
    if (!weather) return 'from-blue-900 to-indigo-900';

    const condition = weather.current.condition.text.toLowerCase();
    const isDay = weather.current.is_day;

    // Always use light mode backgrounds
    if (isDay) {
      if (condition.includes('sunny') || condition.includes('clear'))
        return 'from-blue-500 to-cyan-400';
      if (condition.includes('rain') || condition.includes('drizzle'))
        return 'from-slate-600 to-slate-800';
      if (condition.includes('cloud'))
        return 'from-blue-400 to-slate-500';
      if (condition.includes('snow') || condition.includes('ice'))
        return 'from-slate-200 to-blue-300';
      if (condition.includes('fog') || condition.includes('mist'))
        return 'from-gray-400 to-slate-600';
      return 'from-blue-400 to-cyan-300';
    } else {
      if (condition.includes('clear'))
        return 'from-slate-900 to-blue-950';
      if (condition.includes('rain'))
        return 'from-slate-900 to-slate-800';
      if (condition.includes('cloud'))
        return 'from-slate-800 to-blue-900';
      return 'from-slate-900 to-blue-950';
    }
  };

  // Check if there are any weather alerts
  const hasAlerts = weather?.alerts?.alert?.length > 0;

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${getBackgroundClass()} text-white transition-colors duration-700`}>
      {/* Dynamic particles background - always use isDay value directly */}
      <Particles weatherCondition={weather?.current?.condition?.text} isDay={weather?.current?.is_day} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Fancy animated header */}
        <header className="mb-8 text-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center items-center gap-3"
          >
            <TbSunHigh className="text-5xl text-yellow-300" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
              CrazyWeather AI
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-lg text-blue-100"
          >
            Weather forecasts with AI-powered insights
          </motion.p>
        </header>

        {/* Search bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10"
        >
          <SearchBar
            onSearch={handleSearch}
            onLocationRequest={fetchWithGeolocation}
          />
        </motion.div>

        {/* Main content */}
        {error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="space-y-8">
            {/* Weather Alerts (if any) */}
            {hasAlerts && weather && (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <WeatherAlerts alerts={weather.alerts.alert} location={weather.location} />
              </motion.div>
            )}

            {/* Weather card */}
            {weather && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <WeatherCard
                  data={weather}
                  loading={loading}
                />
              </motion.div>
            )}

            {/* Forecast section */}
            {forecast && (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <ForecastSection forecast={forecast} loading={loading} />
              </motion.div>
            )}

            {/* Advanced Stats */}
            {weather && forecast && (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <AdvancedStats weather={weather} forecast={forecast} />
              </motion.div>
            )}

            {/* AI Insights */}
            {insights && (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <AiInsights insights={insights} loading={loading} />
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Remove ThemeToggle component */}

      {/* Footer */}
      <footer className="text-center p-4 text-blue-200/70 relative z-10 mt-10">
        <p>Powered by WeatherAPI and Google Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;