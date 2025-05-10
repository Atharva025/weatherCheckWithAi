import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual Gemini API key
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY;

export const generateAiInsights = async (weatherData) => {
    try {
        // Initialize the Gemini model
        const genAI = new GoogleGenerativeAI(AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const { location, current, forecast } = weatherData;
        const dayForecast = forecast.forecastday[0].day;

        // Parse local time information
        const localTime = location.localtime;
        const localTimeObj = new Date(localTime);
        const hour = localTimeObj.getHours();
        const minute = localTimeObj.getMinutes();
        const formattedTime = `${hour}:${minute < 10 ? '0' + minute : minute}`;

        // More detailed time of day categorization
        let timeOfDay = "";
        let sleepContext = "";

        if (hour >= 0 && hour < 4) {
            timeOfDay = "late night";
            sleepContext = "sleep hours";
        } else if (hour >= 4 && hour < 6) {
            timeOfDay = "early morning";
            sleepContext = "early waking hours";
        } else if (hour >= 6 && hour < 9) {
            timeOfDay = "morning";
            sleepContext = "waking hours";
        } else if (hour >= 9 && hour < 12) {
            timeOfDay = "late morning";
            sleepContext = "active morning";
        } else if (hour >= 12 && hour < 14) {
            timeOfDay = "midday";
            sleepContext = "lunch time";
        } else if (hour >= 14 && hour < 17) {
            timeOfDay = "afternoon";
            sleepContext = "active afternoon";
        } else if (hour >= 17 && hour < 19) {
            timeOfDay = "early evening";
            sleepContext = "dinner time";
        } else if (hour >= 19 && hour < 22) {
            timeOfDay = "evening";
            sleepContext = "wind-down hours";
        } else {
            timeOfDay = "night";
            sleepContext = "pre-sleep hours";
        }

        // Function to get fallback response based on time of day
        const getFallbackResponse = () => {
            // Default fallback responses structured by time of day
            if (hour >= 0 && hour < 5) {
                return {
                    summary: `It's ${formattedTime} in ${location.name}. While you're up late, the temperature is ${current.temp_c}°C with ${current.condition.text} conditions. Most people are asleep at this hour.`,
                    clothing: "Since it's late night, comfortable sleepwear is recommended. If you need to go outside, dress warmly with layers appropriate for the current temperature.",
                    activities: "It's quite late, so ideal activities include sleeping, light reading before bed, or meditation. If you must be up, keep activities quiet and relaxing.",
                    health: "Being awake at this hour may disrupt your circadian rhythm. Try to get back to sleep if possible. Keep blue light exposure minimal.",
                    travel: "Travel is not recommended during these late night hours unless necessary. If you must travel, be extra cautious as visibility may be reduced.",
                    context: `Late night temperatures of ${current.temp_c}°C are typical for this season in ${location.name}.`,
                    energy: "To conserve energy, ensure unnecessary lights and appliances are turned off while you sleep.",
                    photography: "Night photography would be challenging now but could capture interesting city lights or moon effects if conditions are clear.",
                    mood: "Late night wakefulness can affect mood and mental clarity tomorrow. Try to return to sleep if possible."
                };
            }

            // Add more time-specific fallbacks here
            // This is a basic example that can be expanded with more detailed responses
            return {
                summary: `It's currently ${timeOfDay} (${formattedTime}) in ${location.name}. The temperature is ${current.temp_c}°C with ${current.condition.text} conditions.`,
                clothing: `Clothing appropriate for ${current.temp_c}°C and ${current.condition.text} conditions.`,
                activities: `Activities suitable for ${timeOfDay} in ${current.condition.text} weather.`,
                health: `Health considerations for ${timeOfDay} weather conditions.`,
                travel: `Travel recommendations for ${timeOfDay} in ${location.name}.`,
                context: `Weather context for ${timeOfDay} in this season.`,
                energy: `Energy tips for ${current.temp_c}°C weather during ${timeOfDay}.`,
                photography: `Photography conditions during ${timeOfDay} in ${current.condition.text} weather.`,
                mood: `Typical mood effects of ${current.condition.text} weather during ${timeOfDay}.`
            };
        };

        const prompt = `
      You are a helpful AI weather assistant. Based on the following weather data for ${location.name}, ${location.country}, 
      provide personalized insights and recommendations in JSON format with these fields: 
      {
        "summary": "A friendly 2-3 sentence description of current conditions, temperatures, and any notable weather events",
        "clothing": "Specific clothing recommendations based on the temperature and conditions",
        "activities": "3-5 activity ideas that would be good for today's weather, or things to avoid",
        "health": "How current weather might affect health, including allergies, respiratory issues, UV exposure, etc.",
        "travel": "Recommendations for travelers and commuters based on current conditions",
        "context": "Put today's weather in seasonal context or compare to typical conditions",
        "energy": "Tips for energy use or conservation based on the weather",
        "photography": "Insights about lighting conditions, visibility, and photography opportunities",
        "mood": "How the current weather might affect mood and well-being",
        "alerts": "Only include this field if there are any potential weather concerns or hazards to be aware of, otherwise omit"
      }
      
      Current Weather Data:
      - Local Time: ${localTime} (${timeOfDay}, ${sleepContext})
      - Temperature: ${current.temp_c}°C (feels like ${current.feelslike_c}°C)
      - Condition: ${current.condition.text}
      - Wind: ${current.wind_kph} km/h, ${current.wind_dir}
      - Humidity: ${current.humidity}%
      - UV Index: ${current.uv}
      - Precipitation: ${current.precip_mm} mm
      - Visibility: ${current.vis_km} km
      - Air Quality: ${current.air_quality?.pm2_5 ? `PM2.5: ${current.air_quality.pm2_5}` : 'Not available'}
      
      Forecast Data:
      - Max Temperature: ${dayForecast.maxtemp_c}°C
      - Min Temperature: ${dayForecast.mintemp_c}°C
      - Average Humidity: ${dayForecast.avghumidity}%
      - Total Precipitation: ${dayForecast.totalprecip_mm} mm
      - Chance of Rain: ${dayForecast.daily_chance_of_rain}%
      - UV Index: ${dayForecast.uv}
      - Sunrise: ${forecast.forecastday[0].astro.sunrise}
      - Sunset: ${forecast.forecastday[0].astro.sunset}
      
      CRITICAL: It is currently ${timeOfDay} (${formattedTime}) in ${location.name}, during typical ${sleepContext}. Your recommendations MUST reflect this specific time of day.
      
      Time-specific guidelines:
      - Between midnight and 4am: Focus on sleep recommendations, quiet activities if user is awake, and minimal outdoor activities.
      - Between 4am and 6am: Early rising recommendations, preparation for the day, and quiet activities.
      - Between 6am and 9am: Morning routines, breakfast ideas, and commute recommendations.
      - Between 9am and 12pm: Productive morning activities appropriate for the weather.
      - Between 12pm and 2pm: Lunch breaks, midday activities, and afternoon preparation.
      - Between 2pm and 5pm: Afternoon activities, school pickup considerations, errands.
      - Between 5pm and 7pm: Evening commute, dinner preparations, early evening activities.
      - Between 7pm and 10pm: Evening wind-down activities, relaxation recommendations, preparation for tomorrow.
      - Between 10pm and midnight: Pre-sleep activities, relaxation techniques, limited outdoor recommendations.
      
      For each section:
      - Health: Consider sleep impacts, seasonal health concerns, and time-appropriate health tips.
      - Travel: Provide specific guidance for this hour, including visibility, traffic patterns, and safety considerations.
      - Context: Compare conditions to what's expected at this specific hour and season.
      - Energy: Provide energy usage tips relevant to the specific hour of day.
      - Photography: Only suggest photography activities if appropriate for the time (e.g., no daytime photography tips at 2am).
      - Mood: Discuss how weather at this specific hour affects mood, energy levels, and productivity.
      - Activities: Only suggest activities appropriate for ${timeOfDay} at ${formattedTime}, considering that most people are ${hour >= 0 && hour < 5 ? "sleeping" : "awake"} at this hour.
      
      Make all recommendations practical and specific to the current time of day (${timeOfDay}). 
      Write in a friendly, conversational tone while being informative.
      Use time-appropriate greetings (e.g., "Good night" between 10pm-4am, "Good morning" between 5am-11am, etc.).
      Only include the "alerts" field if there are legitimate weather concerns.
      
      If the user is checking weather between midnight and 5am, acknowledge this is unusual and primarily provide sleep recommendations unless they're a shift worker or have another specific reason to be awake.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                console.error("JSON parsing error:", parseError);
                return getFallbackResponse();
            }
        } else {
            console.log("No JSON found in response, using fallback");
            return getFallbackResponse();
        }
    } catch (error) {
        console.error("AI Response Generation Error:", error);
        // Get time-appropriate fallback response
        const localTimeObj = new Date(weatherData.location.localtime);
        const hour = localTimeObj.getHours();
        const minute = localTimeObj.getMinutes();

        // Default fallback with basic time awareness
        return {
            summary: `It's currently ${hour}:${minute < 10 ? '0' + minute : minute} in ${weatherData.location.name} with a temperature of ${weatherData.current.temp_c}°C and ${weatherData.current.condition.text} conditions.`,
            clothing: "Weather-appropriate clothing recommendations unavailable.",
            activities: hour >= 0 && hour < 5 ? "It's late night hours - sleep is recommended." : "Weather-appropriate activity suggestions unavailable.",
            health: hour >= 0 && hour < 5 ? "During nighttime hours, maintaining a regular sleep schedule is important for health." : "Weather-related health insights unavailable.",
            travel: hour >= 0 && hour < 5 ? "Travel is not recommended during late night hours unless necessary." : "Travel recommendations unavailable.",
            context: "Weather context currently unavailable.",
            energy: "Energy conservation tips unavailable.",
            photography: hour >= 0 && hour < 5 ? "Night photography would require specialized equipment and techniques." : "Photography conditions unavailable.",
            mood: hour >= 0 && hour < 5 ? "Late night wakefulness may affect mood and energy levels tomorrow." : "Weather-related mood insights unavailable."
        };
    }
};