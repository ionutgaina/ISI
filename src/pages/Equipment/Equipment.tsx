import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../common/config/firebase";
import { ref, onValue } from "firebase/database";
import Navbar from "../../common/navbar/Navbar";
import "./Equipment.css";

const EquipmentPage: React.FC = () => {
  const location = useLocation();
  const [equipment, setEquipment] = useState<any[]>([]);
  const [sport, setSport] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract the sport query parameter from the URL
    const searchParams = new URLSearchParams(location.search);
    const sportParam = searchParams.get("sport") || "";

    setSport(sportParam);

    if (!sportParam) {
      setError("Sport parameter is required.");
      setLoading(false);
      return;
    }

    const equipmentRef = ref(db, `equipment/${sportParam}`);
    onValue(
      equipmentRef,
      (snapshot) => {
        setLoading(false);
        const data = snapshot.val();
        if (data) {
          const equipmentList = Object.keys(data).flatMap((shopKey) =>
            Object.values(data[shopKey])
          );
          setEquipment(equipmentList);
        } else {
          setError(`No equipment found for the sport: ${sportParam}`);
        }
      },
      (err) => {
        setLoading(false);
        setError("Error fetching data: " + err.message);
      }
    );
  }, [location.search]);

  return (
    <div className="equipment-page">
      <Navbar />
      <div className="equipment-container">
        <h1>Echipamente pentru {sport}</h1>

        {loading && <p>Loading...</p>}

        {error && <p className="error">{error}</p>}

        {equipment.length > 0 && !loading ? (
          <div className="equipment-list">
            {equipment.map((item, index) => (
              <div className="equipment-item" key={index}>
                <h3>{item.name}</h3>
                <p className="price">{item.price} RON</p>
                <p>{item.description}</p>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="equipment-image"
                  />
                )}
                <a
                  href={item.shopLink}
                  className="btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vezi detalii
                </a>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>Nu s-au gasit echipamente disponibile pentru acest sport.</p>
        )}
      </div>
    </div>
  );
};

export default EquipmentPage;
