import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import L from "leaflet";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Component to handle map clicks
const LocationSelector = ({ onLocationSelect, selectedPosition }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng);
    },
  });

  return selectedPosition ? (
    <Marker position={selectedPosition}>
      <Popup>Selected location</Popup>
    </Marker>
  ) : null;
};

const TravelMap = ({ entries, onLocationSelect, selectedPosition }) => {
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

        <LocationSelector
          onLocationSelect={onLocationSelect}
          selectedPosition={selectedPosition}
        />
      </MapContainer>
      {selectedPosition && (
        <p className="coordinates-helper">
          Selected coordinates: {selectedPosition.lat.toFixed(6)},{" "}
          {selectedPosition.lng.toFixed(6)}
        </p>
      )}
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
  onLocationSelect: PropTypes.func,
  selectedPosition: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

export default TravelMap;
