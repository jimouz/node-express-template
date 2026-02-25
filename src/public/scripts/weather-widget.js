const REFRESH_RATE_MINUTES = 15;
const refreshRate = REFRESH_RATE_MINUTES * 60 * 1000;

const WeatherWidget = {
    async init(defaultCity = "Athens") {
        try {
            await WeatherService.init();
            // Check for stored location
            const savedLocation = JSON.parse(localStorage.getItem("weatherLocation"));

            if (savedLocation) {
                // Use stored location
                await WeatherWidget.loadWeather(savedLocation);
            } else {
                // First time, ask geolocation
                WeatherWidget.detectLocation(defaultCity);
            }

            // Auto-refresh
            setInterval(async () => {
                const loc = JSON.parse(localStorage.getItem("weatherLocation"));
                if (loc) {
                    await WeatherWidget.loadWeather(loc);
                }
            }, refreshRate);
        } catch (err) {
            document.getElementById("weather-location").textContent =
                "Unable to load weather";
        }
    },

    detectLocation(defaultCity) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const location = {
                        type: "coords",
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude
                    };
                    localStorage.setItem("weatherLocation", JSON.stringify(location));
                    await WeatherWidget.loadWeather(location);
                },
                async () => {
                    // User denied, fallback to IP
                    const city = await WeatherWidget.getCityFromIP(defaultCity);
                    const location = { type: "city", city };
                    localStorage.setItem("weatherLocation", JSON.stringify(location));
                    await WeatherWidget.loadWeather(location);
                }
            );
        } else {
            // Unsupported geolocation, fallback to IP
            WeatherWidget.getCityFromIP(defaultCity).then((city) => {
                const location = { type: "city", city };
                localStorage.setItem("weatherLocation", JSON.stringify(location));
                WeatherWidget.loadWeather(location);
            });
        }
    },

    async loadWeather(location) {
        let data;
        data = (location.type === "coords")
            ? await WeatherService.getWeatherByCoords(location.lat, location.lon)
            : await WeatherService.getWeatherByCity(location.city);
        WeatherUI.update(data);
    },

    async getCityFromIP(defaultCity) {
        try {
            const res = await fetch("https://ipapi.co/json/");
            const data = await res.json();
            return data.city || defaultCity;
        } catch {
            return defaultCity;
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    WeatherWidget.init();
});