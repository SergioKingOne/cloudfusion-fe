import React, { useState } from "react";
import Navbar from "./components/Navbar";
import WeatherForm from "./components/WeatherForm";
import PlaylistDisplay from "./components/PlaylistDisplay";
import Preferences from "./components/Preferences";
import { fetchWeather, fetchPlaylist, savePreferences } from "./api/api";

const App = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const weather = await fetchWeather(loc);
      setWeatherData(weather);
      const userPlaylist = await fetchPlaylist(loc);
      setPlaylist(userPlaylist);
      setLocation(loc);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSave = async (prefs) => {
    setLoading(true);
    setError(null);
    try {
      await savePreferences(prefs);
      setPreferences(prefs);
      alert("Preferences saved successfully!");
    } catch (err) {
      setError("Failed to save preferences. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <WeatherForm onFetch={handleFetch} loading={loading} />
        {error && <div className="error">{error}</div>}
        {weatherData && (
          <div className="weather-info">
            <h2>Weather in {weatherData.location}</h2>
            <p>Temperature: {weatherData.temperature}°C</p>
            <p>Condition: {weatherData.condition}</p>
          </div>
        )}
        {playlist.length > 0 && <PlaylistDisplay playlist={playlist} />}
        <Preferences onSave={handlePreferencesSave} />
      </div>
    </div>
  );
};

export default App;
