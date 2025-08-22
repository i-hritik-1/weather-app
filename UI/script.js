// Weather data state
let weatherData = null;
let currentCity = 'Motihari';
let currentDays = 3;

// Weather condition mappings
const weatherConditions = {
    'clear': { icon: '☀️', emoji: '☀️' },
    'sunny': { icon: '☀️', emoji: '☀️' },
    'partly cloudy': { icon: '⛅', emoji: '⛅' },
    'cloudy': { icon: '☁️', emoji: '☁️' },
    'overcast': { icon: '☁️', emoji: '☁️' },
    'rain': { icon: '🌧️', emoji: '🌧️' },
    'light rain': { icon: '🌦️', emoji: '🌦️' },
    'heavy rain': { icon: '🌧️', emoji: '🌧️' },
    'patchy rain nearby': { icon: '🌦️', emoji: '🌦️' },
    'thunderstorm': { icon: '⛈️', emoji: '⛈️' },
    'snow': { icon: '❄️', emoji: '❄️' },
    'fog': { icon: '🌫️', emoji: '🌫️' },
    'mist': { icon: '🌫️', emoji: '🌫️' },
    'default': { icon: '☀️', emoji: '☀️' }
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
    return now.toLocaleDateString('en-US', options);
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
        getWeatherBtn.textContent = 'Get Weather';
        
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
        getWeatherBtn.textContent = 'Get Weather';
    }
}

// Show/Hide sections
function showWeatherContent() {
    const inputSection = document.getElementById('inputSection');
    const weatherContent = document.getElementById('weatherContent');
    
    inputSection.style.display = 'none';
    weatherContent.style.display = 'block';
    weatherContent.classList.add('fade-in');
}

function showInputForm() {
    const inputSection = document.getElementById('inputSection');
    const weatherContent = document.getElementById('weatherContent');
    const cityInput = document.getElementById('cityInput');
    const daysInput = document.getElementById('daysInput');
    
    weatherContent.style.display = 'none';
    inputSection.style.display = 'flex';
    inputSection.classList.add('fade-in');
    
    // Reset form with current values
    if (currentCity) {
        cityInput.value = currentCity;
    }
    daysInput.value = currentDays;
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
    weatherIcon.innerHTML = iconData.icon;
    
    // Update date and time
    dateTime.textContent = getCurrentDateTime();
    
    // Update forecast
    updateForecast(daysData);
    
    // Add some sample values for humidity, wind, etc.
    humidity.textContent = '65%';
    windSpeed.textContent = '15 km/h';
    windDirection.textContent = 'South-East';
}

// Update forecast section
function updateForecast(daysData) {
    const forecastSection = document.getElementById('forecastSection');
    
    // Clear existing forecast
    forecastSection.innerHTML = '';
    
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
        forecastCard.onclick = () => showDayDetails(day, index);
        
        forecastSection.appendChild(forecastCard);
    });
    
    // Adjust grid layout based on number of days
    const numDays = daysData.length;
    if (numDays <= 3) {
        forecastSection.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else if (numDays <= 5) {
        forecastSection.style.gridTemplateColumns = 'repeat(5, 1fr)';
    } else {
        forecastSection.style.gridTemplateColumns = 'repeat(auto-fit, minmax(80px, 1fr))';
    }
}

// Show detailed day information in modal
function showDayDetails(dayData, index) {
    const modal = document.getElementById('weatherModal');
    const modalDayTitle = document.getElementById('modalDayTitle');
    const modalWeatherIcon = document.getElementById('modalWeatherIcon');
    const modalMaxTemp = document.getElementById('modalMaxTemp');
    const modalMinTemp = document.getElementById('modalMinTemp');
    const modalAvgTemp = document.getElementById('modalAvgTemp');
    const modalSunrise = document.getElementById('modalSunrise');
    const modalSunset = document.getElementById('modalSunset');
    
    const dayName = formatDate(dayData.date);
    const fullDate = new Date(dayData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Determine weather condition for icon
    let condition = 'sunny';
    if (dayData.avgTemp < 20) {
        condition = 'cloudy';
    } else if (dayData.avgTemp < 25) {
        condition = 'partly cloudy';
    } else if (index % 3 === 2) {
        condition = 'light rain';
    }
    
    const iconData = getWeatherIcon(condition);
    
    // Populate modal content
    modalDayTitle.textContent = `${dayName} - ${fullDate}`;
    modalWeatherIcon.textContent = iconData.emoji;
    modalMaxTemp.textContent = `${dayData.maxTemp}°C`;
    modalMinTemp.textContent = `${dayData.minTemp}°C`;
    modalAvgTemp.textContent = `${dayData.avgTemp}°C`;
    modalSunrise.textContent = dayData.sunrise;
    modalSunset.textContent = dayData.sunset;
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('weatherModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
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
    const settingsIcon = document.querySelector('.settings-icon');
    const weatherContent = document.getElementById('weatherContent');
    const modalClose = document.getElementById('modalClose');
    const modal = document.getElementById('weatherModal');
    
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

    // Back button event
    backBtn.addEventListener('click', () => {
        showInputForm();
    });

    // Settings click handler
    settingsIcon.addEventListener('click', () => {
        showInputForm();
    });

    // Modal close events
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking on overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal.classList.contains('show')) {
                closeModal();
            } else if (weatherContent.style.display !== 'none') {
                showInputForm();
            }
        } else if (e.key === 'r' || e.key === 'R') {
            if (weatherContent.style.display !== 'none' && currentCity && !modal.classList.contains('show')) {
                fetchWeatherData(currentCity, currentDays);
            }
        }
    });

    // Weather container double-click to refresh
    weatherContent.addEventListener('dblclick', () => {
        if (currentCity && !modal.classList.contains('show')) {
            fetchWeatherData(currentCity, currentDays);
        }
    });
}

// Setup update intervals
function setupIntervals() {
    const weatherContent = document.getElementById('weatherContent');
    const dateTime = document.getElementById('dateTime');
    
    // Refresh data every 10 minutes (only when weather is shown)
    setInterval(() => {
        if (weatherData?.weatherResponse?.city && weatherContent.style.display !== 'none') {
            fetchWeatherData(currentCity, currentDays);
        }
    }, 10 * 60 * 1000);

    // Update time every minute
    setInterval(() => {
        if (weatherContent.style.display !== 'none' && dateTime) {
            dateTime.textContent = getCurrentDateTime();
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
    
    // Focus on city input
    const cityInput = document.getElementById('cityInput');
    if (cityInput) {
        cityInput.focus();
    }
    
    // Setup intervals for updates
    setupIntervals();
    
    console.log('App initialized successfully');
});