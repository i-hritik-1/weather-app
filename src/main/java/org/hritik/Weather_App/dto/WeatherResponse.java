package org.hritik.Weather_App.dto;

public class WeatherResponse {

    private String city;
    private String region;
    private String country;
    private String condition;
    private double temperature;

    public WeatherResponse(String city, String region, String country, String condition, double temperature) {
        this.city = city;
        this.region = region;
        this.country = country;
        this.condition = condition;
        this.temperature = temperature;
    }

    public WeatherResponse() {
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }
}