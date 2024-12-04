import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";

const TravelMap = ({ entries }) => {
  // Default center position (can be adjusted based on entries)
  const defaultPosition = [0, 0];
  const defaultZoom = 2;

  return (
    <div className="travel-map">
      <MapContainer
        center={defaultPosition}
        zoom={defaultZoom}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {entries.map((entry, index) => (
          <Marker
            key={index}
            position={[entry.coordinates.lat, entry.coordinates.lng]}
          >
            <Popup>
              <strong>{entry.location}</strong>
              <br />
              {entry.date}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

TravelMap.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default TravelMap;
