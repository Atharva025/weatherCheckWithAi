import { useState } from 'react';
import axios from 'axios';
import { generateAiInsights } from './aiService';

// Weather API configuration
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL;

const useWeatherData = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch weather data with a search query
    const fetchWeather = async (searchQuery) => {
        if (!searchQuery?.trim()) {
            setError("Please enter a valid location");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Make API request with the query
            const response = await axios.get(WEATHER_API_URL, {
                params: {
                    key: WEATHER_API_KEY,
                    q: searchQuery,
                    days: 3,          // Get 3 days forecast for more context
                    aqi: 'yes',       // Include air quality data
                    alerts: 'yes'     // Include weather alerts if any
                }
            });

            // Extract data from response
            const data = response.data;

            // Update state with weather data
            setWeather(data);
            setForecast(data.forecast);

            // Generate AI insights based on the data
            try {
                const aiResponse = await generateAiInsights(data);
                setInsights(aiResponse);
            } catch (aiError) {
                console.error('Error generating AI insights:', aiError);
                // Set fallback insights if AI generation fails
                setInsights({
                    summary: `It's currently ${data.current.temp_c}°C and ${data.current.condition.text.toLowerCase()} in ${data.location.name}.`,
                    clothing: "Wear appropriate clothing for the current weather conditions.",
                    activities: "Plan your activities according to the current weather forecast."
                });
            }
        } catch (err) {
            console.error('Weather API Error:', err);
            // Handle different types of errors
            if (err.response?.status === 400) {
                setError('Location not found. Please try another city or location.');
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                setError('API key issue. Please try again later.');
            } else if (err.request) {
                setError('No response from weather service. Check your internet connection.');
            } else {
                setError('Failed to fetch weather data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch weather using user's geolocation
    const fetchWithGeolocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser. Please search for a city instead.');
            setLoading(false);
            return;
        }

        // Request user's position with proper error handling
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(`${latitude},${longitude}`);
            },
            // Error callback
            (err) => {
                console.error('Geolocation error:', err);
                let errorMessage;

                switch (err.code) {
                    case 1: // PERMISSION_DENIED
                        errorMessage = 'Location access denied. Please enable location services or search for a city.';
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        errorMessage = 'Location information is unavailable. Please search for a city instead.';
                        break;
                    case 3: // TIMEOUT
                        errorMessage = 'Location request timed out. Please search for a city instead.';
                        break;
                    default:
                        errorMessage = 'Unable to access your location. Please search for a city instead.';
                }

                setError(errorMessage);
                setLoading(false);
            },
            // Options - using explicit values instead of variables
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Return state and functions
    return {
        weather,
        forecast,
        insights,
        loading,
        error,
        fetchWeather,
        fetchWithGeolocation
    };
};

export default useWeatherData;