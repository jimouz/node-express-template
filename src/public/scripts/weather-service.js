const WeatherService = {
    apiKey: null,
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",

    async init() {
        // Fetch API key from backend
        const res = await fetch("/api/weather-key");
        const data = await res.json();
        WeatherService.apiKey = data.key;
    },

    async getWeatherByCity(city) {
        if (!WeatherService.apiKey) {
            throw new Error("Service not initialized. Missing API key.");
        }
        const url = `${WeatherService.baseUrl}?q=${city}&units=metric&appid=${WeatherService.apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error("Weather API error");
        }
        return res.json();
    },

    async getWeatherByCoords(lat, lon) {
        if (!WeatherService.apiKey) {
            throw new Error("Service not initialized. Missing API key.");
        }
        const url = `${WeatherService.baseUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${WeatherService.apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error("Weather API error");
        }
        return res.json();
    }
};