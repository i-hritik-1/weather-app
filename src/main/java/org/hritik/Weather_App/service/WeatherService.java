package org.hritik.Weather_App.service;


import org.hritik.Weather_App.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;


@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;
    @Value("${weather.api.url}")
    private String apiUrl;

    @Value("${weather.api.forcast.url}")
    private String foreCastUrl;




    public String test()
    {
        return "Successfully tested.";
    }


    public WeatherResponse getData(String city) {

        String url = apiUrl +"?key="+apiKey+"&q="+city;
        RestTemplate restemplate = new RestTemplate();
        Root response = restemplate.getForObject(url,Root.class);
        WeatherResponse result = new WeatherResponse();
        result.setCity(response.getLocation().getName());
        result.setCountry(response.getLocation().getCountry());
        result.setRegion(response.getLocation().getRegion());
        result.setTemperature(response.getCurrent().getTemp_c());
        result.setCondition(response.getCurrent().getCondition().getText());
        return result;

    }

    public ForCastWeather getForecast(String city, int days)
    {

        WeatherResponse weatherResponse = getData(city);

        String url = foreCastUrl +"?key="+apiKey+"&q="+city+"&days="+days;
        RestTemplate restTemplate = new RestTemplate();
        Root root = restTemplate.getForObject(url,Root.class);

        ForCastWeather forcastResponse = new ForCastWeather();
        forcastResponse.setWeatherResponse(weatherResponse);

        ForeCast foreCast = root.getForecast();
        ArrayList<Forecastday> forecastdays = foreCast.getForecastday();
        ArrayList<DayData> dayData = new ArrayList<>();

        for(Forecastday day : forecastdays)
        {
            DayData d = new DayData();

            d.setDate(day.getDate());
            d.setMinTemp(day.getDay().getMintemp_c());
            d.setMaxTemp(day.getDay().getMaxtemp_c());
            d.setAvgTemp(day.getDay().getAvgtemp_c());
            d.setSunrise(day.getAstro().getSunrise());
            d.setSunset(day.getAstro().getSunset());

            dayData.add(d);
        }

        forcastResponse.setDaysData(dayData);
        return forcastResponse;
    }
}
