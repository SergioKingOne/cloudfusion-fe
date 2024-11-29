import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch weather data for a given location
export const fetchWeather = async (location) => {
  const response = await axios.get(`${API_BASE_URL}/weather`, {
    params: { location },
  });
  return response.data;
};

// Fetch playlist based on location
export const fetchPlaylist = async (location) => {
  const response = await axios.get(`${API_BASE_URL}/playlist`, {
    params: { location },
  });
  return response.data.playlist;
};

// Save user preferences
export const savePreferences = async (preferences) => {
  const response = await axios.post(`${API_BASE_URL}/preferences`, preferences);
  return response.data;
};
