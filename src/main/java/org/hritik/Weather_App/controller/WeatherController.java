package org.hritik.Weather_App.controller;

import org.hritik.Weather_App.dto.ForCastWeather;
import org.hritik.Weather_App.dto.WeatherResponse;
import org.hritik.Weather_App.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/weather")
@CrossOrigin
public class WeatherController {

    @Autowired
    private WeatherService weatherService;


    @GetMapping("/{city}")
    public String getWeattherData(@PathVariable String city)
    {
        return weatherService.test();
    }

    @GetMapping("/my/{city}")
    public WeatherResponse getWeatherData(@PathVariable String city)
    {
        return weatherService.getData(city);
    }

//    @GetMapping("/forecast")
//    public Forcast getForecast(@RequestParam String city, @RequestParam int days)
//    {
//        return weatherService.getForecast(city,days);
//    }

    @GetMapping("/forecast")
    public ForCastWeather getForecast(@RequestParam String city, @RequestParam int days)
    {
        return weatherService.getForecast(city,days);
    }
}
