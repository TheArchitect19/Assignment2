import React, { useState, useEffect } from "react";
import {key,base} from "./apiKeys";
// import Clock from "react-live-clock";
import Forcast from "./Forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";


const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

export const CurrentLocation = () => {
  
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getPosition = (options) => {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    const getWeather = async (lat, lon) => {
      const api_call = await fetch(
        `${base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${key}`
      );
      const data = await api_call.json();
      const main = data.weather[0].main;
      let icon = "CLEAR_DAY";
      switch (main) {
        case "Haze":
          icon = "CLEAR_DAY";
          break;
        case "Clouds":
          icon = "CLOUDY";
          break;
        case "Rain":
          icon = "RAIN";
          break;
        case "Snow":
          icon = "SNOW";
          break;
        case "Dust":
          icon = "WIND";
          break;
        case "Drizzle":
          icon = "SLEET";
          break;
        case "Fog":
          icon = "FOG";
          break;
        case "Smoke":
          icon = "FOG";
          break;
        case "Tornado":
          icon = "WIND";
          break;
        default:
          icon = "CLEAR_DAY";
      }
      setWeatherData({
        lat,
        lon,
        city: data.name,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main,
        country: data.sys.country,
        icon,
      });
      setIsLoading(false);
    };

    const fetchData = async () => {
      if (navigator.geolocation) {
        try {
          const position = await getPosition();
          getWeather(position.coords.latitude, position.coords.longitude);
        } catch (error) {
          getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        }
      } else {
        alert("Geolocation not available");
      }
    };

    fetchData();

    const timerID = setInterval(() => {
      fetchData();
    }, 600000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  if (isLoading) {
    return (
      <React.Fragment>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location wil be displayed on the App <br></br> & used for
          calculating Real time weather.
        </h3>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="city">
        <div className="title">
          <h2>{weatherData.city}</h2>
          <h3>{weatherData.country}</h3>
        </div>
        <div className="mb-icon">
          {" "}
          <ReactAnimatedWeather
            icon={weatherData.icon}
            color={defaults.color}
            size={defaults.size}
            animate={defaults.animate}
          />
          <p>{weatherData.main}</p>
        </div>
        <div className="date-time">
          <div className="dmy">
            <div id="txt"></div>
            <div className="current-time">
              {/* <Clock format="HH:mm:ss" interval={1000} ticking={true} /> */}
            </div>
            <div className="current-date">{dateBuilder(new Date())}</div>
          </div>
          <div className="temperature">
            <p>
              {weatherData.temperatureC}°<span>C</span>
            </p>
          </div>
        </div>
      </div>
      <Forcast icon={weatherData.icon} weather={weatherData.main} />
    </React.Fragment>
  );
};


