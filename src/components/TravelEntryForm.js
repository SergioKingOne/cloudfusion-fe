import React, { useState } from "react";
import PropTypes from "prop-types";

const TravelEntryForm = ({ onSubmit, loading }) => {
  const [entry, setEntry] = useState({
    location: "",
    date: "",
    description: "",
    photos: [],
    coordinates: { lat: "", lng: "" },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(entry);
  };

  const handlePhotoUpload = (e) => {
    setEntry((prev) => ({
      ...prev,
      photos: [...e.target.files],
    }));
  };

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <h2>Add New Travel Entry</h2>
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          value={entry.location}
          onChange={(e) =>
            setEntry((prev) => ({ ...prev, location: e.target.value }))
          }
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={entry.date}
          onChange={(e) =>
            setEntry((prev) => ({ ...prev, date: e.target.value }))
          }
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="photos">Photos</label>
        <input
          type="file"
          id="photos"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={entry.description}
          onChange={(e) =>
            setEntry((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Entry"}
      </button>
    </form>
  );
};

TravelEntryForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default TravelEntryForm;
