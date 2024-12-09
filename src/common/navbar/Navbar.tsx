import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { sendDataToFirebase } from "../setData";

const Navbar: React.FC = () => {
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      nav("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px 20px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#ff5c5c",
          color: "white",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Logout
      </button>
      <button
        onClick={() => sendDataToFirebase()}
        style={{
          backgroundColor: "#ff5c5c",
          color: "white",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Send Data
      </button>
    </div>
  );
};

export default Navbar;
