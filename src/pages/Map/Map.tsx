import React, { useEffect, useRef, useState } from "react";
import ProtectedRoute from "../../common/auth/protectedRoute";
import Navbar from "../../common/navbar/Navbar";
import { db } from "../../common/config/firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

const ArcGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const [WebMapModule, MapViewModule, GraphicsLayerModule, GraphicModule] =
        await Promise.all([
          import("@arcgis/core/WebMap"),
          import("@arcgis/core/views/MapView"),
          import("@arcgis/core/layers/GraphicsLayer"),
          import("@arcgis/core/Graphic"),
        ]);

      const WebMap = WebMapModule.default;
      const WebMapView = MapViewModule.default;
      const GraphicsLayer = GraphicsLayerModule.default;
      const Graphic = GraphicModule.default;
      const graphicsLayer = new GraphicsLayer();

      const map = new WebMap({
        basemap: "streets",
        layers: [graphicsLayer],
      });

      const view = new WebMapView({
        container: mapRef.current as HTMLDivElement,
        map: map,
        center: [26.1, 44.4],
        zoom: 12,
      });

      const locationsRef = ref(db, "sport_locations");
      onValue(locationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          Object.entries(data).forEach(([sport, locations]) => {
            (locations as any[]).forEach((location) => {
              if (location && location.lat && location.lon) {
                const point = {
                  type: "point",
                  longitude: location.lon,
                  latitude: location.lat,
                };

                const symbol = {
                  type: "simple-marker",
                  color: "blue",
                  size: 8,
                  outline: {
                    color: "white",
                    width: 1,
                  },
                };

                const graphic = new Graphic({
                  geometry: point,
                  symbol: symbol,
                  attributes: {
                    name: location.name,
                    sport: sport,
                    phone_number: location.phone_number || "N/A",
                    website: location.website || "N/A",
                    image: location.image || null,
                  },
                });

                graphicsLayer.add(graphic);
              }
            });
          });
        }
      });

      view.on("click", (event) => {
        view.hitTest(event).then((response) => {
          const results = response.results;

          if (results.length > 0) {
            if (results[0].graphic && results[0].graphic.attributes.sport) {
              setSelectedLocation(results[0].graphic.attributes);
            }
            else {
              setSelectedLocation(null);
            }
          } 

        });
      });

      view.when(() => {
        console.log("Map is ready");
      });
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, []);

  const handleSearchEquipment = () => {
    if (selectedLocation) {
      const { sport, name } = selectedLocation;
      navigate(`/equipment?sport=${sport}&shop=${name}`);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div style={{ position: "relative", height: "100vh" }}>
        <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
        {selectedLocation && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              width: "400px",
              maxHeight: "550px",
              overflowY: "auto",
            }}
          >
            <h3 style={{ fontSize: "16px", margin: "0 0 10px" }}>{selectedLocation.name}</h3>
            <p style={{ fontSize: "14px" }}><strong>Sport:</strong> {selectedLocation.sport}</p>
            <p style={{ fontSize: "14px" }}><strong>Phone:</strong> {selectedLocation.phone_number}</p>
            <p style={{ fontSize: "14px" }}>
              <strong>Website:</strong>{" "}
              <a href={selectedLocation.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px" }}>
                {selectedLocation.website}
              </a>
            </p>
            {selectedLocation.image && (
              <img
                src={selectedLocation.image}
                alt={selectedLocation.name}
                style={{ width: "100%", height: "auto", marginTop: "10px", borderRadius: "5px" }}
              />
            )}
            <button
              onClick={handleSearchEquipment}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Cauta echipamente
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ArcGISMap;
