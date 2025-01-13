/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import ProtectedRoute from "../../common/auth/protectedRoute";
import Navbar from "../../common/navbar/Navbar";
import { db } from "../../common/config/firebase";
import { ref, onValue } from "firebase/database";
import Point from "@arcgis/core/geometry/Point";
import { useNavigate } from "react-router-dom";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import * as route from "@arcgis/core/rest/route.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import config from "@arcgis/core/config";

const ArcGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<Point | null>(null); // Track user's location
  const [map, setMap] = useState<any>(null);
  const [routeSelected, setRouteSelected] = useState<any>(null);
  const [routingLayer, setRoutingLayer] = useState<GraphicsLayer | null>(null);

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

      config.apiKey =
        "AAPTxy8BH1VEsoebNVZXo8HurAr4bclhMMoDuFlrd07C6arUMbNNMbd-tiBYACtSGi8Lc7vKz2sKW8bj3tvH7S9yHt5BNtgzVCpKTvo05IE-Mw--u_jkzMloQsOGaSqTxdBQ0371u2K31ZY70ZXCL9T2hPgq7vAt48yDI9Axdf9tFEtusW1d4R1DZgwkkQQO1Sfl8l9RlkN5x-oAD6GcKrd-hU_sxxZxfAAaZL1iMIYPe3fGcGdggCyCbuOdX2No0AcNAT1_M5HyiAFO";

      const WebMap = WebMapModule.default;
      const MapView = MapViewModule.default;
      const GraphicsLayer = GraphicsLayerModule.default;
      const Graphic = GraphicModule.default;
      const Locate = LocateModule.default;

      // Create a graphics layer
      const graphicsLayer = new GraphicsLayer();
      const routingLayer = new GraphicsLayer();

      const map = new WebMap({
        basemap: "streets",
        layers: [graphicsLayer, routingLayer],
      });

      setMap(map);

      const newRoutingLayer = new GraphicsLayer();
      map.add(newRoutingLayer);
      setRoutingLayer(newRoutingLayer);

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
                    spatialReference: { wkid: 4326 },
                  });

                  const sportIcons: Record<string, string> = {
                    tennis: "/src/assets/tennis.svg",
                    swimming: "/src/assets/swimming.svg",
                    gym: "/src/assets/gym.svg",
                    bouldering: "/src/assets/bouldering.svg",
                    football: "/src/assets/football.svg",
                    fighting: "/src/assets/fighting.svg",
                    // Add more sports and their icons as needed
                  };
                  const symbol1 = {
                    type: "picture-marker",
                    url: sportIcons[sport] || "/src/assets/default.svg",
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

      // Handle map click to select a location
      view.on("click", (event) => {
        view.hitTest(event).then((response) => {
          const results = response.results;

          if (results.length > 0) {
            if (
              results[0].type === "graphic" &&
              results[0].graphic.attributes.sport
            ) {
              setSelectedLocation(results[0].graphic.attributes);
              setRouteSelected(results[0].graphic.geometry);
            } else {
              setSelectedLocation(null);
              setRouteSelected(null);
            }
          }
        });
      });

      // Get user geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userPoint = new Point({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            spatialReference: { wkid: 4326 },
          });
          setUserLocation(userPoint);
          view.goTo(userPoint); // Center map on user's location
        });
      }

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

  const calculateRoute = async () => {
    if (userLocation && selectedLocation && routingLayer) {
      // Clear previous route and markers
      routingLayer.removeAll();
  
      const location1 = new Point({
        longitude: userLocation.x,
        latitude: userLocation.y,
      });
  
      const location2 = new Point({
        longitude: routeSelected.x,
        latitude: routeSelected.y,
      });
  
      // Define route parameters
      const routeParams = new RouteParameters({
        stops: new FeatureSet({
          features: [
            new Graphic({
              geometry: location1,
            }),
            new Graphic({
              geometry: location2,
            }),
          ],
        }),
        returnDirections: true,
      });
  
      try {
        const data = await route.solve(
          "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
          routeParams
        );
        displayRoute(data); // Display the route first
  
        // Add user and destination markers after route is added
        const userMarker = new Graphic({
          geometry: location1,
          symbol: {
            type: "simple-marker",
            color: "blue",
            size: "10px",
            outline: {
              color: "white",
              width: 1,
            },
          },
        });
        routingLayer.add(userMarker);
  
        const destinationMarker = new Graphic({
          geometry: location2,
          symbol: {
            type: "simple-marker",
            color: "red",
            size: "10px",
            outline: {
              color: "white",
              width: 1,
            },
          },
        });
        routingLayer.add(destinationMarker);
  
      } catch (error) {
        console.error("Error calculating route: ", error);
        alert("Error calculating route");
      }
    } else {
      alert("Please select a location and ensure geolocation is enabled.");
    }
  };
  

  const displayRoute = (data: any) => {
    if (routingLayer) {
      routingLayer.removeAll(); // Ensure no duplicate routes

      const routeResult = data.routeResults[0].route;
      routeResult.symbol = {
        type: "simple-line",
        color: [5, 150, 255],
        width: 3,
      };

      const routeGraphic = new Graphic({
        geometry: routeResult.geometry,
        symbol: routeResult.symbol,
      });

      routingLayer.add(routeGraphic);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar onFilterChange={(sports) => setSelectedSports(sports)} />
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
            <h2
              style={{
                fontSize: "19px",
                margin: "0 0 10px",
                textAlign: "left",
              }}
            >
              {selectedLocation.name}
            </h2>
            <p style={{ fontSize: "14px", textAlign: "left" }}>
              <strong>Sport:</strong> {selectedLocation.sport}
            </p>
            <p style={{ fontSize: "14px", textAlign: "left" }}>
              <strong>Phone:</strong> 0{selectedLocation.phone_number}
            </p>
            <p style={{ fontSize: "14px", textAlign: "left" }}>
              <strong>Website:</strong>
              <a
                href={selectedLocation.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "14px", textAlign: "left" }}
              >
                {selectedLocation.website}
              </a>
            </p>

            {selectedLocation.image !== null ? (
              <img
                src={
                  selectedLocation.image.startsWith("http://")
                    ? selectedLocation.image.replace("http://", "https://")
                    : selectedLocation.image
                }
                alt={selectedLocation.name}
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
            <button
              onClick={calculateRoute}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Calculate Route
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ArcGISMap;
