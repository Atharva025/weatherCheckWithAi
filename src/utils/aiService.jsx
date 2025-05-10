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
      
      For each section:
      - Health: Discuss respiratory conditions, allergy impacts, UV protection needs, hydration advice, etc.
      - Travel: Consider road conditions, public transit impacts, airport delays, walking/cycling conditions
      - Context: Compare to seasonal averages or recent trends
      - Energy: Tips on heating/cooling usage, natural ventilation opportunities, etc.
      - Photography: Discuss lighting conditions, visibility, scenic opportunities, best times for photos
      - Mood: How this weather typically affects mood based on research, seasonal affective considerations
      
      Make all recommendations practical and specific. Write in a friendly, conversational tone while being informative.
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