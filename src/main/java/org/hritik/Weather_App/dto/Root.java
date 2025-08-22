package org.hritik.Weather_App.dto;

public class Root{
    public Location location;
    public Current current;
    public ForeCast forecast;

    public Root(Location location, Current current, ForeCast forecast) {
        this.location = location;
        this.current = current;
        this.forecast = forecast;
    }

    public Root() {
    }

    public ForeCast getForecast() {
        return forecast;
    }

    public void setForecast(ForeCast forecast) {
        this.forecast = forecast;
    }



    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Current getCurrent() {
        return current;
    }

    public void setCurrent(Current current) {
        this.current = current;
    }
}
