// Weather data state
let weatherData = null;
let currentCity = 'Motihari';
let currentDays = 3;
let selectedDayData = null;

// Weather condition mappings
const weatherConditions = {
    'clear': { icon: '☀️', emoji: '☀️', class: 'sunny' },
    'sunny': { icon: '☀️', emoji: '☀️', class: 'sunny' },
    'partly cloudy': { icon: '⛅', emoji: '⛅', class: 'partly-cloudy' },
    'cloudy': { icon: '☁️', emoji: '☁️', class: 'cloudy' },
    'overcast': { icon: '☁️', emoji: '☁️', class: 'cloudy' },
    'rain': { icon: '🌧️', emoji: '🌧️', class: 'rainy' },
    'light rain': { icon: '🌦️', emoji: '🌦️', class: 'rainy' },
    'heavy rain': { icon: '🌧️', emoji: '🌧️', class: 'rainy' },
    'moderate or heavy rain with thunder': { icon: '⛈️', emoji: '⛈️', class: 'rainy' },
    'patchy rain nearby': { icon: '🌦️', emoji: '🌦️', class: 'rainy' },
    'thunderstorm': { icon: '⛈️', emoji: '⛈️', class: 'rainy' },
    'snow': { icon: '❄️', emoji: '❄️', class: 'snowy' },
    'fog': { icon: '🌫️', emoji: '🌫️', class: 'foggy' },
    'mist': { icon: '🌫️', emoji: '🌫️', class: 'foggy' },
    'default': { icon: '☀️', emoji: '☀️', class: 'sunny' }
};

// Utility functions
function getWeatherIcon(condition) {
    const conditionLower = condition.toLowerCase();
    for (const key in weatherConditions) {
        if (conditionLower.includes(key)) {
            return weatherConditions[key];
        }
    }
    return weatherConditions.default;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
}

function formatFullDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getCurrentDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return now.toLocaleDateString('en-US', options).replace(',', ' at');
}

// API call function
async function fetchWeatherData(city, days) {
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    
    try {
        // Show loading state
        getWeatherBtn.disabled = true;
        getWeatherBtn.textContent = 'Loading...';
        
        const response = await fetch(`http://localhost:8080/weather/forecast?city=${encodeURIComponent(city)}&days=${days}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        weatherData = data;
        currentCity = city;
        currentDays = days;
        
        // Show weather content and hide input form
        showWeatherContent();
        updateUI(data);
        
        // Reset button state
        getWeatherBtn.disabled = false;
        getWeatherBtn.textContent = 'GET WEATHER';
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        let errorMessage = `Failed to fetch weather data for ${city}.`;
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage += ' Please check if the API server is running on localhost:8080.';
        } else if (error.message.includes('404')) {
            errorMessage += ' City not found or API endpoint not available.';
        } else if (error.message.includes('500')) {
            errorMessage += ' Server error. Please try again later.';
        } else {
            errorMessage += ' Please check your internet connection and try again.';
        }
        
        showError(errorMessage);
        
        // Reset button state
        getWeatherBtn.disabled = false;
        getWeatherBtn.textContent = 'GET WEATHER';
    }
}

// Show/Hide sections
function showWeatherContent() {
    const inputSection = document.getElementById('inputSection');
    const weatherContent = document.getElementById('weatherContent');
    const dayDetailView = document.getElementById('dayDetailView');
    
    inputSection.style.display = 'none';
    weatherContent.style.display = 'block';
    dayDetailView.style.display = 'none';
    weatherContent.classList.add('fade-in');
}

function showInputForm() {
    const inputSection = document.getElementById('inputSection');
    const weatherContent = document.getElementById('weatherContent');
    const dayDetailView = document.getElementById('dayDetailView');
    const cityInput = document.getElementById('cityInput');
    const daysInput = document.getElementById('daysInput');
    
    weatherContent.style.display = 'none';
    dayDetailView.style.display = 'none';
    inputSection.style.display = 'flex';
    inputSection.classList.add('fade-in');
    
    // Reset form with current values
    if (currentCity) {
        cityInput.value = currentCity;
    }
    daysInput.value = currentDays;
    
    // Focus on city input
    setTimeout(() => cityInput.focus(), 100);
}

function showDayDetailView(dayData, index) {
    const weatherContent = document.getElementById('weatherContent');
    const dayDetailView = document.getElementById('dayDetailView');
    
    selectedDayData = dayData;
    
    // Hide main weather content and show day detail
    weatherContent.style.display = 'none';
    dayDetailView.style.display = 'block';
    dayDetailView.classList.add('slide-in-right');
    
    // Update day detail view with data
    updateDayDetailView(dayData, index);
}

function hideDayDetailView() {
    const weatherContent = document.getElementById('weatherContent');
    const dayDetailView = document.getElementById('dayDetailView');
    
    dayDetailView.style.display = 'none';
    weatherContent.style.display = 'block';
    weatherContent.classList.add('slide-in-left');
    
    selectedDayData = null;
}

// Update UI with weather data
function updateUI(data) {
    const { weatherResponse, daysData } = data;
    
    // Get elements
    const cityName = document.getElementById('cityName');
    const currentTemp = document.getElementById('currentTemp');
    const maxTemp = document.getElementById('maxTemp');
    const minTemp = document.getElementById('minTemp');
    const conditionText = document.getElementById('conditionText');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const windDirection = document.getElementById('windDirection');
    const dateTime = document.getElementById('dateTime');
    const weatherIcon = document.getElementById('weatherIcon');
    
    // Update current weather
    cityName.textContent = weatherResponse.city;
    currentTemp.textContent = `${Math.round(weatherResponse.temperature)}°`;
    conditionText.textContent = weatherResponse.condition;
    
    // Update today's temperature range
    if (daysData && daysData.length > 0) {
        maxTemp.textContent = `${Math.round(daysData[0].maxTemp)}°`;
        minTemp.textContent = `${Math.round(daysData[0].minTemp)}°`;
    }
    
    // Update weather icon
    const iconData = getWeatherIcon(weatherResponse.condition);
    weatherIcon.className = `weather-icon ${iconData.class}`;
    
    // Update date and time
    dateTime.textContent = getCurrentDateTime();
    
    // Update forecast
    updateForecast(daysData);
    
    // Keep some sample values for humidity, wind, etc. (you can enhance this with real data)
    humidity.textContent = '65%';
    windSpeed.textContent = '15 km/h';
    windDirection.textContent = 'South-East';
}

// Update day detail view
function updateDayDetailView(dayData, index) {
    const dayDetailCityName = document.getElementById('dayDetailCityName');
    const dayDetailTemp = document.getElementById('dayDetailTemp');
    const dayDetailMaxTemp = document.getElementById('dayDetailMaxTemp');
    const dayDetailMinTemp = document.getElementById('dayDetailMinTemp');
    const dayDetailCondition = document.getElementById('dayDetailCondition');
    const dayDetailDateTime = document.getElementById('dayDetailDateTime');
    const dayDetailWeatherIcon = document.getElementById('dayDetailWeatherIcon');
    const dayDetailsTitle = document.getElementById('dayDetailsTitle');
    const detailMaxTemp = document.getElementById('detailMaxTemp');
    const detailMinTemp = document.getElementById('detailMinTemp');
    const detailAvgTemp = document.getElementById('detailAvgTemp');
    const detailSunrise = document.getElementById('detailSunrise');
    const detailSunset = document.getElementById('detailSunset');
    
    // Get day name and full date
    const dayName = formatDate(dayData.date);
    const fullDate = formatFullDate(dayData.date);
    
    // Determine weather condition (use current weather condition as base)
    const condition = weatherData?.weatherResponse?.condition || 'Partly Cloudy';
    const iconData = getWeatherIcon(condition);
    
    // Update basic info
    dayDetailCityName.textContent = weatherData?.weatherResponse?.city || currentCity;
    dayDetailTemp.textContent = `${Math.round(dayData.avgTemp)}°`;
    dayDetailMaxTemp.textContent = `${Math.round(dayData.maxTemp)}°`;
    dayDetailMinTemp.textContent = `${Math.round(dayData.minTemp)}°`;
    dayDetailCondition.textContent = condition;
    dayDetailDateTime.textContent = `${dayName}, ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    
    // Update weather icon
    dayDetailWeatherIcon.className = `weather-icon ${iconData.class}`;
    
    // Update detailed information
    dayDetailsTitle.textContent = `${dayName} - ${fullDate}`;
    detailMaxTemp.textContent = `${dayData.maxTemp}°C`;
    detailMinTemp.textContent = `${dayData.minTemp}°C`;
    detailAvgTemp.textContent = `${dayData.avgTemp}°C`;
    detailSunrise.textContent = dayData.sunrise;
    detailSunset.textContent = dayData.sunset;
}

// Update forecast section
function updateForecast(daysData) {
    const forecastSection = document.getElementById('forecastSection');
    
    // Clear existing forecast
    forecastSection.innerHTML = '';
    
    // Add appropriate class based on number of days
    forecastSection.className = 'forecast-section';
    if (daysData.length === 5) {
        forecastSection.classList.add('days-5');
    } else if (daysData.length >= 7) {
        forecastSection.classList.add('days-7');
    }
    
    // Create forecast cards dynamically based on the number of days
    daysData.forEach((day, index) => {
        const dayName = formatDate(day.date);
        
        // Determine weather condition based on temperature and add some variation
        let condition = 'sunny';
        if (day.avgTemp < 20) {
            condition = 'cloudy';
        } else if (day.avgTemp < 25) {
            condition = 'partly cloudy';
        } else if (index % 3 === 2) { // Add some variety
            condition = 'light rain';
        }
        
        const iconData = getWeatherIcon(condition);
        
        // Create forecast card
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-day';
        forecastCard.setAttribute('data-day', index);
        
        forecastCard.innerHTML = `
            <div class="forecast-icon">${iconData.emoji}</div>
            <div class="forecast-temp">${Math.round(day.avgTemp)}°</div>
            <div class="forecast-day-name">${dayName}</div>
        `;
        
        // Add click event for detailed view
        forecastCard.onclick = () => showDayDetailView(day, index);
        
        forecastSection.appendChild(forecastCard);
    });
}

// Error handling
function showError(message) {
    console.error(message);
    
    // Create a better error display
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
        z-index: 1000;
        max-width: 90%;
        text-align: center;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.getElementById('error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.animation = 'slideDown 0.3s ease reverse';
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }
    }, 5000);
    
    // Click to dismiss
    errorDiv.addEventListener('click', () => {
        errorDiv.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    });
}

// Event listeners setup
function setupEventListeners() {
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const cityInput = document.getElementById('cityInput');
    const backBtn = document.getElementById('backBtn');
    const dayDetailBackBtn = document.getElementById('dayDetailBackBtn');
    const settingsIcon = document.querySelector('.settings-icon');
    const weatherContent = document.getElementById('weatherContent');
    
    // Get weather button
    getWeatherBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        const days = parseInt(document.getElementById('daysInput').value);
        
        if (!city) {
            showError('Please enter a city name');
            cityInput.focus();
            return;
        }
        
        fetchWeatherData(city, days);
    });

    // Enter key support for city input
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            getWeatherBtn.click();
        }
    });

    // Back button event (from main weather to input)
    backBtn.addEventListener('click', () => {
        showInputForm();
    });

    // Day detail back button event (from day detail to main weather)
    dayDetailBackBtn.addEventListener('click', () => {
        hideDayDetailView();
    });

    // Settings click handler
    settingsIcon.addEventListener('click', () => {
        showInputForm();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const dayDetailView = document.getElementById('dayDetailView');
            if (dayDetailView.style.display !== 'none') {
                hideDayDetailView();
            } else if (weatherContent.style.display !== 'none') {
                showInputForm();
            }
        } else if (e.key === 'r' || e.key === 'R') {
            if (weatherContent.style.display !== 'none' && currentCity) {
                fetchWeatherData(currentCity, currentDays);
            }
        }
    });

    // Weather container double-click to refresh
    weatherContent.addEventListener('dblclick', () => {
        if (currentCity) {
            fetchWeatherData(currentCity, currentDays);
        }
    });
}

// Setup update intervals
function setupIntervals() {
    const weatherContent = document.getElementById('weatherContent');
    const dayDetailView = document.getElementById('dayDetailView');
    const dateTime = document.getElementById('dateTime');
    const dayDetailDateTime = document.getElementById('dayDetailDateTime');
    
    // Refresh data every 10 minutes (only when weather is shown)
    setInterval(() => {
        if (weatherData?.weatherResponse?.city && (weatherContent.style.display !== 'none' || dayDetailView.style.display !== 'none')) {
            fetchWeatherData(currentCity, currentDays);
        }
    }, 10 * 60 * 1000);

    // Update time every minute
    setInterval(() => {
        if (weatherContent.style.display !== 'none' && dateTime) {
            dateTime.textContent = getCurrentDateTime();
        }
        if (dayDetailView.style.display !== 'none' && dayDetailDateTime && selectedDayData) {
            const dayName = formatDate(selectedDayData.date);
            dayDetailDateTime.textContent = `${dayName}, ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
        }
    }, 60000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Start with input form
    showInputForm();
    
    // Setup intervals for updates
    setupIntervals();
    
    console.log('App initialized successfully');
});