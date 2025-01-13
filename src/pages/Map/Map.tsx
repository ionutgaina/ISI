/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import ProtectedRoute from "../../common/auth/protectedRoute";
import Navbar from "../../common/navbar/Navbar";
import { db } from "../../common/config/firebase";
import { ref, onValue } from "firebase/database";
import Point from "@arcgis/core/geometry/Point"; // Correct import

const ArcGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

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

      // Create the map
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
          Object.entries(data).forEach(([sport, locations]) => {
            (locations as any[]).forEach((location) => {
              if (location && location.lat && location.lon) {
                const point = new Point({
                  latitude: location.lat,
                  longitude: location.lon,
                });

                const symbol = {
                  type: "simple-marker",
                  color: "blue",
                  size: 8,
                  outline: {
                    color: "white",
                    width: 1,
                  },
                };

                const popupTemplate = {
                  title: `${location.name}`,
                  content: `<p>Sport: ${sport}</p>`,
                };

                const graphic = new Graphic({
                  geometry: point,
                  symbol: symbol,
                  popupTemplate: popupTemplate,
                });

                graphicsLayer.add(graphic);
              }
            });
          });
        }
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
  }, []);

  return (
    <ProtectedRoute>
      <Navbar />
      <div style={{ position: "relative", height: "100vh" }}>
        <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
      </div>
    </ProtectedRoute>
  );
};

export default ArcGISMap;
