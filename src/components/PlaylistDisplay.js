import React from "react";
import PropTypes from "prop-types";

const PlaylistDisplay = ({ playlist }) => (
  <div className="playlist-display">
    <h2>Your Playlist</h2>
    <ul>
      {playlist.map((song, index) => (
        <li key={index}>
          <strong>{song.title}</strong> by {song.artist}
        </li>
      ))}
    </ul>
  </div>
);

PlaylistDisplay.propTypes = {
  playlist: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      artist: PropTypes.string,
    })
  ).isRequired,
};

export default PlaylistDisplay;
