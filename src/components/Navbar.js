import React from "react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => (
  <nav className="navbar">
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1>Travel Journal</h1>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <ThemeToggle />
        <button
          style={{
            background: "transparent",
            border: "2px solid var(--color-light)",
            padding: "0.5rem 1rem",
          }}
        >
          New Entry
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;
