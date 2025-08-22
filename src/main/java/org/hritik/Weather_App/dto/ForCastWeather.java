package org.hritik.Weather_App.dto;

import java.util.ArrayList;


public class ForCastWeather {
    private WeatherResponse weatherResponse;

    private ArrayList<DayData> daysData;


    public ArrayList<DayData> getDaysData() {
        return daysData;
    }

    public void setDaysData(ArrayList<DayData> daysData) {
        this.daysData = daysData;
    }

    public WeatherResponse getWeatherResponse() {
        return weatherResponse;
    }

    public void setWeatherResponse(WeatherResponse weatherResponse) {
        this.weatherResponse = weatherResponse;
    }
}
