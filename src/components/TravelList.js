import React from "react";
import PropTypes from "prop-types";

const TravelList = ({ entries }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="travel-list">
      <h2>My Travels</h2>
      {entries.length === 0 ? (
        <p>No travel entries yet. Start by adding your first journey!</p>
      ) : (
        <div className="entries-grid">
          {entries.map((entry, index) => (
            <div key={index} className="entry-card">
              {entry.photos && entry.photos.length > 0 && (
                <div className="entry-photo">
                  <img
                    src={
                      typeof entry.photos[0] === "string"
                        ? entry.photos[0]
                        : URL.createObjectURL(entry.photos[0])
                    }
                    alt={entry.location}
                  />
                </div>
              )}
              <div className="entry-details">
                <h3>{entry.title}</h3>
                <p className="entry-location">{entry.location}</p>
                <p className="entry-date">
                  {formatDate(entry.visit_date || entry.visitDate)}
                </p>
                <p className="entry-description">{entry.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

TravelList.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      photos: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(File)])
      ),
    })
  ).isRequired,
};

export default TravelList;
