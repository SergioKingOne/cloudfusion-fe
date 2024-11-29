import React, { useState } from "react";
import PropTypes from "prop-types";

const WeatherForm = ({ onFetch, loading }) => {
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim() !== "") {
      onFetch(location);
    }
  };

  return (
    <form className="weather-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Fetching..." : "Get Playlist"}
      </button>
    </form>
  );
};

WeatherForm.propTypes = {
  onFetch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default WeatherForm;
