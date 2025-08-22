# Weather App

## Overview

The **Weather App** is a web application that allows users to:
- Enter a city and number of days.
- Fetch and display weather forecasts for the selected city and days.
- View current weather conditions and daily forecasts in a user-friendly UI.

## Features

- **City & Days Input:** Users can specify any city and the number of forecast days (1–3).
- **Live Weather Data:** Fetches weather data from a backend API endpoint.
- **Responsive UI:** Displays current weather and daily forecasts with temperature, sunrise, and sunset times.
- **Error Handling:** Shows a message if weather data cannot be loaded.

## Technologies Used

- **HTML:** Structure of the UI.
- **CSS:** Styling for layout, colors, and responsiveness.
- **JavaScript:** Handles user input, API requests, and dynamic rendering of weather data.
- **Backend API:** Expects a REST API at  
  `http://localhost:8080/weather/forecast?city={city}&days={days}`  
  

## How It Works

1. **User Input:**  
   The user enters a city name and selects the number of days for the forecast.

2. **API Request:**  
   On form submission, JavaScript sends a GET request to the backend API.

3. **Display Results:**  
   The app displays current weather and a card for each forecast day, including:
   - Date
   - Average, max, and min temperature
   - Sunrise and sunset times

## Folder Structure

```
weather-app/
│
├── index.html      # Main UI file
├── styles.css        # CSS styles
└── script.js        # JavaScript logic
```

## Usage

1. Start your backend API server (here Spring Boot) at `http://localhost:8080`.
2. Open `index.html` in your browser.
3. Enter a city and number of days, then click "Get Forecast".

## Sample API Response

```json
{
  "weatherResponse": {
    "city": "Motihari",
    "region": "Bihar",
    "country": "India",
    "condition": "Patchy rain nearby",
    "temperature": 26.7
  },
  "daysData": [
    {
      "date": "2025-08-22",
      "maxTemp": 34.5,
      "minTemp": 26.7,
      "avgTemp": 30.1,
      "sunrise": "05:26 AM",
      "sunset": "06:20 PM"
    }
    // ...
  ]
}
```

## License

This project is for educational/demo purposes.
