function updateDateTime() {
    const month = [
        'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September', 'October',
        'November', 'December'
    ];

    const weekday = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ];

    const now = new Date();

    const fullDate = `${weekday[now.getDay()]} ${now.getDate()} ${month[now.getMonth()]} ${now.getFullYear()}`;
    const fullDateSmall = `${now.getDate()} ${month[now.getMonth()].slice(0, 3)} ${now.getFullYear()}`;

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    const timeString = `${hours}:${minutes}:${seconds}`;

    const dateElement = document.querySelector('.date');
    const timeElement = document.querySelector('.time');

    if (dateElement) {
        dateElement.textContent = screen.width < 600 ? fullDateSmall : fullDate;
    }

    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Run immediately
updateDateTime();

// Update every second
setInterval(updateDateTime, 1000);