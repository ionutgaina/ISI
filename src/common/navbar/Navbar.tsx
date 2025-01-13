import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

type NavbarProps = {
  onFilterChange: (sports: string[]) => void; // Prop to handle selected sports
};

const Navbar: React.FC<NavbarProps> = ({ onFilterChange }) => {
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
  const sportOptions = [
    { value: "bouldering", label: "Bouldering" },
    { value: "football", label: "Football" },
    { value: "gym", label: "Gym" },
    { value: "swimming", label: "Swimming" },
    { value: "tennis", label: "Tennis" },
    { value: "fighting", label: "Fighting" },
  ];

  const handleChange = (selectedOptions: any) => {
    const selectedSports = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    onFilterChange(selectedSports);
    console.log(selectedSports);
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
        color: "black",
        padding: "10px 20px",
        zIndex: 1000,
      }}
    >
      <div style={{ width: "300px" }}>
        <Select
          isMulti
          options={sportOptions}
          onChange={handleChange}
          placeholder="Filter sports..."
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "white",
              color: "",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }),
          }}
        />
      </div>

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
    </div>
  );
};

export default Navbar;
