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

        // Function to get enhanced fallback response based on time of day
        const getEnhancedFallbackResponse = () => {
            // Default fallback responses structured by time of day
            if (hour >= 0 && hour < 5) {
                return {
                    // Essential category
                    summary: `It's ${formattedTime} in ${location.name}. While you're up late, the temperature is ${current.temp_c}°C with ${current.condition.text} conditions. Most people are asleep at this hour.`,
                    clothing: "Since it's late night, comfortable sleepwear is recommended. If you need to go outside, dress warmly with layers appropriate for the current temperature.",
                    activities: "It's quite late, so ideal activities include sleeping, light reading before bed, or meditation. If you must be up, keep activities quiet and relaxing.",
                    health: "Being awake at this hour may disrupt your circadian rhythm. Try to get back to sleep if possible. Keep blue light exposure minimal.",

                    // Lifestyle category
                    travel: "Travel is not recommended during these late night hours unless necessary. If you must travel, be extra cautious as visibility may be reduced.",
                    mood: "Late night wakefulness can affect mood and mental clarity tomorrow. Try to return to sleep if possible.",
                    foodSuggestions: "If you're hungry at this hour, opt for small, light snacks like herbal tea with honey or a small banana which can help induce sleep without disrupting digestion.",
                    sleepRecommendations: "For optimal sleep in current conditions, keep your bedroom between 18-20°C. Use a light blanket and keep windows closed to maintain temperature consistency.",

                    // Environment category
                    energy: "To conserve energy, ensure unnecessary lights and appliances are turned off while you sleep.",
                    smartHomeSettings: "Set your thermostat to 18-20°C for optimal sleeping conditions. If humidity is high, consider running a dehumidifier on low.",
                    outdoorTiming: "The optimal time for any outdoor activities would be after you've had proper rest, ideally after sunrise.",
                    context: `Late night temperatures of ${current.temp_c}°C are typical for this season in ${location.name}.`,

                    // Special category
                    localEvents: "Most local venues are closed at this hour. Check back during daytime for event recommendations.",
                    astronomicalEvents: "The night sky may offer stargazing opportunities if the weather is clear, though it's best to prioritize sleep at this hour.",
                    productivityInsights: "Cognitive function is significantly reduced at this hour. If you must work, focus on simple, routine tasks rather than creative or complex problem-solving.",
                    recreationalSpots: "Most recreational venues are closed at this hour. Plan your outdoor activities for daytime hours."
                };
            }

            // General fallback for other times
            return {
                // Essential category
                summary: `It's currently ${timeOfDay} (${formattedTime}) in ${location.name}. The temperature is ${current.temp_c}°C with ${current.condition.text} conditions.`,
                clothing: `Clothing appropriate for ${current.temp_c}°C and ${current.condition.text} conditions.`,
                activities: `Activities suitable for ${timeOfDay} in ${current.condition.text} weather.`,
                health: `Health considerations for ${timeOfDay} weather conditions.`,

                // Lifestyle category
                travel: `Travel recommendations for ${timeOfDay} in ${location.name}.`,
                mood: `Typical mood effects of ${current.condition.text} weather during ${timeOfDay}.`,
                foodSuggestions: `Food and beverage recommendations suitable for ${timeOfDay} in current weather conditions.`,
                sleepRecommendations: `Sleep environment recommendations for ${current.temp_c}°C and ${current.condition.text} conditions.`,

                // Environment category
                energy: `Energy tips for ${current.temp_c}°C weather during ${timeOfDay}.`,
                smartHomeSettings: `Smart home settings to optimize comfort and energy usage during ${timeOfDay} in current conditions.`,
                outdoorTiming: `The best time window for outdoor activities today based on forecast conditions.`,
                context: `Weather context for ${timeOfDay} in this season.`,

                // Special category
                localEvents: `Weather-appropriate local events for ${timeOfDay} in ${location.name}.`,
                astronomicalEvents: `Notable celestial events and visibility conditions for tonight.`,
                productivityInsights: `How the current weather conditions might affect your productivity during ${timeOfDay}.`,
                recreationalSpots: `Recreational areas that would be enjoyable in today's ${current.condition.text} conditions.`
            };
        };

        const prompt = `
      You are a helpful AI weather assistant. Based on the following weather data for ${location.name}, ${location.country}, 
      provide personalized insights and recommendations in JSON format organized into these categories:
      
      {
        /* Essential Category */
        "summary": "A friendly 2-3 sentence description of current conditions, temperatures, and any notable weather events",
        "clothing": "Specific clothing recommendations based on the temperature and conditions",
        "activities": "3-5 activity ideas that would be good for today's weather, or things to avoid",
        "health": "How current weather might affect health, including allergies, respiratory issues, UV exposure, etc.",
        
        /* Lifestyle Category */
        "travel": "Recommendations for travelers and commuters based on current conditions",
        "mood": "How the current weather might affect mood and well-being",
        "foodSuggestions": "3-4 meal ideas that would be particularly satisfying in today's weather, with consideration for the time of day",
        "sleepRecommendations": "Optimal bedroom settings based on tonight's forecast, including window positioning, temperature suggestions, and humidity considerations",
        
        /* Environment Category */
        "energy": "Tips for energy use or conservation based on the weather",
        "smartHomeSettings": "Recommendations for thermostat settings, window management, and other home environment optimizations based on today's forecast",
        "outdoorTiming": "If applicable, suggest the optimal time window today for outdoor activities based on temperature, precipitation probability, and comfort level",
        "context": "Put today's weather in seasonal context or compare to typical conditions",
        
        /* Special Category */
        "localEvents": "Weather-appropriate local events, festivals, or activities happening today in or near this location",
        "astronomicalEvents": "Notable celestial events visible from this location tonight if applicable, including viewing conditions",
        "productivityInsights": "How today's weather might affect concentration and energy levels, with tips to optimize work or study sessions",
        "recreationalSpots": "Recommended recreational areas, parks, or venues that would be particularly enjoyable in today's conditions",
        
        /* Alerts (Optional) */
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
      - Mood: Discuss how weather at this specific hour affects mood, energy levels, and productivity.
      - Activities: Only suggest activities appropriate for ${timeOfDay} at ${formattedTime}, considering that most people are ${hour >= 0 && hour < 5 ? "sleeping" : "awake"} at this hour.
      - SleepRecommendations: Provide specific bedroom temperature and humidity recommendations based on weather conditions.
      - FoodSuggestions: Suggest seasonal and weather-appropriate foods for the current time of day.
      - ProductivityInsights: How might the current conditions affect focus and energy during work/study.
      - SmartHomeSettings: Specific temperature, lighting, and window recommendations for optimal comfort and energy savings.
      - OutdoorTiming: Be precise about the best hours for outdoor activities if applicable.
      - AstronomicalEvents: Only include if there are visible celestial events in the current location tonight.
      - LocalEvents: Suggest events or activities happening in the area that would be appropriate for the current weather and time of day.
      - RecreationalSpots: Recommend specific parks, viewpoints, or recreational areas that would be enjoyable in the current weather conditions.
      
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
                return getEnhancedFallbackResponse();
            }
        } else {
            console.log("No JSON found in response, using fallback");
            return getEnhancedFallbackResponse();
        }
    } catch (error) {
        console.error("AI Response Generation Error:", error);
        // Get time-appropriate fallback response
        const localTimeObj = new Date(weatherData.location.localtime);
        const hour = localTimeObj.getHours();
        const minute = localTimeObj.getMinutes();

        // Enhanced default fallback with basic time awareness
        return {
            // Essential category
            summary: `It's currently ${hour}:${minute < 10 ? '0' + minute : minute} in ${weatherData.location.name} with a temperature of ${weatherData.current.temp_c}°C and ${weatherData.current.condition.text} conditions.`,
            clothing: "Weather-appropriate clothing recommendations unavailable.",
            activities: hour >= 0 && hour < 5 ? "It's late night hours - sleep is recommended." : "Weather-appropriate activity suggestions unavailable.",
            health: hour >= 0 && hour < 5 ? "During nighttime hours, maintaining a regular sleep schedule is important for health." : "Weather-related health insights unavailable.",

            // Lifestyle category
            travel: hour >= 0 && hour < 5 ? "Travel is not recommended during late night hours unless necessary." : "Travel recommendations unavailable.",
            mood: hour >= 0 && hour < 5 ? "Late night wakefulness may affect mood and energy levels tomorrow." : "Weather-related mood insights unavailable.",
            foodSuggestions: hour >= 0 && hour < 5 ? "Light snacks like herbal tea or a small piece of fruit are best if you're hungry at this hour." : "Food and meal suggestions unavailable.",
            sleepRecommendations: hour >= 19 || hour < 7 ? "Set your bedroom temperature to 18-20°C for optimal sleeping conditions." : "Sleep recommendations unavailable at this time.",

            // Environment category
            energy: hour >= 0 && hour < 5 ? "Ensure unnecessary lights and appliances are turned off while you sleep to conserve energy." : "Energy conservation tips unavailable.",
            smartHomeSettings: hour >= 0 && hour < 5 ? "Program your thermostat to maintain 18-20°C for optimal sleeping conditions." : "Smart home optimization suggestions unavailable.",
            outdoorTiming: hour >= 0 && hour < 5 ? "Outdoor activities not recommended during nighttime hours." : "Optimal outdoor timing information unavailable.",
            context: "Weather context currently unavailable.",

            // Special category
            localEvents: hour >= 0 && hour < 5 ? "Most local venues are closed at this hour. Check back during daytime for event recommendations." : "Local event recommendations unavailable.",
            astronomicalEvents: hour >= 19 || hour < 5 ? "Astronomical viewing conditions currently unavailable." : "No astronomical events information available for daylight hours.",
            productivityInsights: hour >= 0 && hour < 5 ? "Productivity is typically reduced during late night hours." : "Productivity insights unavailable.",
            recreationalSpots: hour >= 0 && hour < 5 ? "Most recreational venues are closed at this hour. Plan your outdoor activities for daytime hours." : "Recreational spot recommendations unavailable."
        };
    }
};