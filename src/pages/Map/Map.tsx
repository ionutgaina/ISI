import React, { useEffect, useRef } from "react";
import ProtectedRoute from "../../common/auth/protectedRoute";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ArcGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    const initializeMap = async () => {
      const [WebMapModule, MapViewModule, TileLayerModule, FeatureLayerModule] = await Promise.all([
        import('@arcgis/core/WebMap'),
        import('@arcgis/core/views/MapView'),
        import('@arcgis/core/layers/TileLayer'),
        import('@arcgis/core/layers/FeatureLayer')
      ]);

      const WebMap = WebMapModule.default;
      const WebMapView = MapViewModule.default;
      const TileLayer = TileLayerModule.default;
      const FeatureLayer = FeatureLayerModule.default;

      const tileLayer = new TileLayer({
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
        opacity: 0.5,
      });

      const featureLayer = new FeatureLayer({
        url: 'https://services.arcgis.com/ArcGIS/rest/services/WorldCities/FeatureServer/0',
      });

      const map = new WebMap({
        basemap: "topo",
        layers: [tileLayer, featureLayer],
      });

      const view = new WebMapView({
        container: mapRef.current as HTMLDivElement,
        map: map,
        center: [-98, 39],
        zoom: 5,
      });

      view.when(() => {
        console.log("Map is ready");
      });
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth); // Sign out from Firebase
      nav("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ position: "relative", height: "100vh" }}>
        <div
          style={{
            position: "fixed",
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
        </div>

        <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
      </div>
    </ProtectedRoute>
  );
};

export default ArcGISMap;
