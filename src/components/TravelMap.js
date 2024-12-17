import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";

// Create custom icons for saved and unsaved markers
const savedIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const unsavedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map clicks
const LocationSelector = ({ onLocationSelect, selectedPosition }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng);
    },
  });

  return selectedPosition ? (
    <Marker position={selectedPosition} icon={unsavedIcon}>
      <Popup>Selected location (unsaved)</Popup>
    </Marker>
  ) : null;
};

const TravelMap = ({ entries, onLocationSelect, selectedPosition }) => {
  const defaultPosition = [0, 0];
  const defaultZoom = 2;

  const getMarkerPosition = (entry) => {
    if (entry.coordinates) {
      return [entry.coordinates.lat, entry.coordinates.lng];
    }
    return [entry.latitude, entry.longitude];
  };

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
        {entries.map((entry, index) => {
          try {
            const position = getMarkerPosition(entry);
            return (
              <Marker key={index} position={position} icon={savedIcon}>
                <Popup>
                  <strong>{entry.location}</strong>
                  <br />
                  {(entry.visit_date || entry.visitDate) &&
                    new Date(
                      entry.visit_date || entry.visitDate
                    ).toLocaleDateString()}
                </Popup>
              </Marker>
            );
          } catch (error) {
            console.error("Error rendering marker for entry:", entry);
            return null;
          }
        })}

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
      visit_date: PropTypes.string,
      visitDate: PropTypes.string,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    })
  ).isRequired,
  onLocationSelect: PropTypes.func,
  selectedPosition: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

export default TravelMap;
