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

        // Determine time of day
        let timeOfDay = "day";
        if (hour < 6) timeOfDay = "early morning";
        else if (hour < 12) timeOfDay = "morning";
        else if (hour < 17) timeOfDay = "afternoon";
        else if (hour < 20) timeOfDay = "evening";
        else timeOfDay = "night";

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
      - Local Time: ${localTime} (${timeOfDay})
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
      
      IMPORTANT: It is currently ${timeOfDay} (${localTime}) in ${location.name}. Make all recommendations appropriate for this time of day.
      
      For each section:
      - Health: Discuss respiratory conditions, allergy impacts, UV protection needs, hydration advice, etc. Adjust based on time of day.
      - Travel: Consider road conditions, public transit impacts, time-of-day considerations, walking/cycling safety for current time.
      - Context: Compare to seasonal averages or recent trends for this time of day.
      - Energy: Tips on heating/cooling usage, natural ventilation opportunities based on current time.
      - Photography: Discuss current lighting conditions based on time of day, night photography tips if after sunset.
      - Mood: How this weather at this time of day typically affects mood based on research.
      - Activities: Suggest appropriate activities for ${timeOfDay} considering the weather conditions.
      
      Make all recommendations practical and specific to the current time of day (${timeOfDay}). 
      Write in a friendly, conversational tone while being informative.
      Greet the user appropriately based on the time of day in ${location.name}.
      Only include the "alerts" field if there are legitimate weather concerns.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            // Fallback if JSON parsing fails
            return {
                summary: "Weather insights currently unavailable.",
                clothing: "Clothing recommendations unavailable.",
                activities: "Activity suggestions unavailable.",
                health: "Health insights currently unavailable.",
                travel: "Travel recommendations currently unavailable.",
                context: "Weather context currently unavailable.",
                energy: "Energy tips currently unavailable.",
                photography: "Photography conditions currently unavailable.",
                mood: "Mood insights currently unavailable."
            };
        }
    } catch (error) {
        console.error("AI Response Generation Error:", error);
        return {
            summary: "Weather insights currently unavailable.",
            clothing: "Clothing recommendations unavailable.",
            activities: "Activity suggestions unavailable.",
            health: "Health insights currently unavailable.",
            travel: "Travel recommendations currently unavailable.",
            context: "Weather context currently unavailable.",
            energy: "Energy tips currently unavailable.",
            photography: "Photography conditions currently unavailable.",
            mood: "Mood insights currently unavailable."
        };
    }
};