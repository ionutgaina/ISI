/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import ProtectedRoute from "../../common/auth/protectedRoute";
import Navbar from "../../common/navbar/Navbar";
import { db } from "../../common/config/firebase";
import { ref, onValue } from "firebase/database";
import Point from "@arcgis/core/geometry/Point";
import { useNavigate } from "react-router-dom";

const ArcGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      const [
        WebMapModule,
        MapViewModule,
        GraphicsLayerModule,
        GraphicModule,
        LocateModule,
      ] = await Promise.all([
        import("@arcgis/core/WebMap"),
        import("@arcgis/core/views/MapView"),
        import("@arcgis/core/layers/GraphicsLayer"),
        import("@arcgis/core/Graphic"),
        import("@arcgis/core/widgets/Locate"),
      ]);

      const WebMap = WebMapModule.default;
      const MapView = MapViewModule.default;
      const GraphicsLayer = GraphicsLayerModule.default;
      const Graphic = GraphicModule.default;
      const Locate = LocateModule.default;

      // Create a graphics layer
      const graphicsLayer = new GraphicsLayer();

      const map = new WebMap({
        basemap: "streets",
        layers: [graphicsLayer],
      });

      // Create the map view
      const view = new MapView({
        container: mapRef.current as HTMLDivElement,
        map: map,
        center: [26.1, 44.4],
        zoom: 12,
      });

      const locateWidget = new Locate({
        view: view,
        useHeadingEnabled: false,
        goToOverride: (view, options) => {
          options.target.scale = 1500;
          return view.goTo(options.target);
        },
      });

      view.ui.add(locateWidget, {
        position: "top-left",
      });

      // Add data from Firebase
      const locationsRef = ref(db, "sport_locations");
      onValue(locationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          graphicsLayer.removeAll();
          Object.entries(data).forEach(([sport, locations]) => {
            if (selectedSports.length === 0 || selectedSports.includes(sport)) {
              (locations as any[]).forEach((location) => {
                if (location && location.lat && location.lon) {
                  const point = new Point({
                  latitude: location.lat,
                  longitude: location.lon,
                });

                  const sportIcons: Record<string, string> = {
                          tennis: "/src/assets/tennis.svg",
                          swimming: "/src/assets/swimming.svg",
                          gym: "/src/assets/gym.svg",
                          bouldering: "/src/assets/bouldering.svg",
                          football: "/src/assets/football.svg",
                          fighting: "/src/assets/fighting.svg"
                          // Add more sports and their icons as needed
                  };
                  const symbol1 = {
                    type: "picture-marker",
                    url:  sportIcons[sport] || "/src/assets/default.svg", 
                    width: 30,
                    height: 30,
                  } as __esri.PictureMarkerSymbolProperties;

                  const graphic = new Graphic({
                    geometry: point,
                    symbol: symbol1,
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
            }
          });
        }
      });

      view.on("click", (event) => {
        view.hitTest(event).then((response) => {
          const results = response.results;

          if (results.length > 0) {
            if (results[0].type === "graphic" && results[0].graphic.attributes.sport) {
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

      return () => {
        if (mapRef.current) {
          mapRef.current.innerHTML = "";
        }
      };
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, [selectedSports]);

  const handleSearchEquipment = () => {
    if (selectedLocation) {
      const { sport, name } = selectedLocation;
      navigate(`/equipment?sport=${sport}&shop=${name}`);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar onFilterChange={(sports) => setSelectedSports(sports)}/>
      <div style={{ position: "relative", height: "100vh" }}>
        <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
        {selectedLocation && (
          <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px", 
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            width: "400px",
            maxHeight: "550px",
            overflowY: "auto",
            textAlign: "left",
          }}
        >

        <h2 style={{ fontSize: "19px", margin: "0 0 10px", textAlign: "left" }}>
          {selectedLocation.name}
        </h2>
        <p style={{ fontSize: "14px", textAlign: "left" }}>
          <strong>Sport:</strong> {selectedLocation.sport}
        </p>
        <p style={{ fontSize: "14px", textAlign: "left" }}>
          <strong>Phone:</strong> 0{selectedLocation.phone_number}
        </p>
        <p style={{ fontSize: "14px", textAlign: "left" }}>
          <strong>Website:</strong>{" "}
          <a
            href={selectedLocation.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "14px", textAlign: "left" }}
          >
            {selectedLocation.website}
          </a>
        </p>


              {selectedLocation.image ? (
                <img
                  src={selectedLocation.image.startsWith("http://") ? 
                    selectedLocation.image.replace("http://", "https://") : 
                    selectedLocation.image}
                  alt={selectedLocation.name}
                  onError={(e) => (e.currentTarget.src = "placeholder.jpg")}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "10px",
                    borderRadius: "5px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  <p>No image available</p>
                </div>
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
