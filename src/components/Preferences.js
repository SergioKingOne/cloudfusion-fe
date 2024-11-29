import React, { useState } from "react";
import PropTypes from "prop-types";

const Preferences = ({ onSave }) => {
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ genre, mood });
  };

  return (
    <form className="preferences-form" onSubmit={handleSubmit}>
      <h2>Set Your Preferences</h2>
      <div className="form-group">
        <label htmlFor="genre">Preferred Genre:</label>
        <input
          type="text"
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="e.g., Pop, Rock"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="mood">Preferred Mood:</label>
        <input
          type="text"
          id="mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="e.g., Happy, Chill"
          required
        />
      </div>
      <button type="submit">Save Preferences</button>
    </form>
  );
};

Preferences.propTypes = {
  onSave: PropTypes.func.isRequired,
};

export default Preferences;
