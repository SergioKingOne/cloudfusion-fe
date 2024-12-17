import React from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { signOut } = useAuth();

  return (
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
            onClick={signOut}
            style={{
              background: "transparent",
              border: "2px solid var(--bg-primary)",
              padding: "0.5rem 1rem",
              color: "var(--bg-primary)",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
