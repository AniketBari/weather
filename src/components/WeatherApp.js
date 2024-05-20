import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const locationName = await fetchLocationName(latitude, longitude);
      setLocation(locationName);
      const response = await fetchWeatherData(latitude, longitude);
      setWeatherData(response);
      setLoading(false);
    });
  }, []);

  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAlN1zdrEFj8oa-dMRxs0PUNBY0kSZZk_I`);
      const data = await response.json();
      return data.results[0].formatted_address;
    } catch (error) {
      console.error('Error fetching location:', error);
      return 'Unknown';
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=251e7c5967d93d8393dc546248e1bf01&units=metric`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!weatherData) {
    return <div>Error fetching weather data</div>;
  }

  const { main, weather } = weatherData;

  return (
    <div>
      <h1>Current Weather in {location}</h1>
      <p>Temperature: {main.temp}°C</p>
      <p>Condition: {weather[0].description}</p>
    </div>
  );
};

export default WeatherApp;