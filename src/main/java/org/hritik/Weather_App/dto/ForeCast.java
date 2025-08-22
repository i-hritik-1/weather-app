package org.hritik.Weather_App.dto;

import java.util.ArrayList;

public class ForeCast{
    public ArrayList<Forecastday> forecastday;

    public ArrayList<Forecastday> getForecastday() {
        return forecastday;
    }

    public void setForecastday(ArrayList<Forecastday> forecastday) {
        this.forecastday = forecastday;
    }
}

