const WeatherUI = {
    update(data) {
        document.getElementById("weather-location").textContent =
        `${data.name}, ${data.sys.country}`;

        document.getElementById("weather-temp").textContent =
        `${Math.round(data.main.temp)}°C`;

        document.getElementById("weather-desc").textContent =
        data.weather[0].description;

        document.getElementById("weather-icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        document.getElementById("weather-updated").textContent =
            `Updated: ${new Date().toLocaleTimeString([], { 
                hour: "2-digit", 
                minute: "2-digit",
                second: "2-digit", 
                hour12: false 
            })}`;
    }
};