// // import React, { useEffect, useRef } from "react";
// // import ProtectedRoute from "../../common/auth/protectedRoute";
// // import Navbar from "../../common/navbar/Navbar";

// // const ArcGISMap: React.FC = () => {
// //   const mapRef = useRef<HTMLDivElement>(null);

// //   useEffect(() => {
// //     const initializeMap = async () => {
// //       const [WebMapModule, MapViewModule, TileLayerModule, FeatureLayerModule] =
// //         await Promise.all([
// //           import("@arcgis/core/WebMap"),
// //           import("@arcgis/core/views/MapView"),
// //           import("@arcgis/core/layers/TileLayer"),
// //           import("@arcgis/core/layers/FeatureLayer"),
// //         ]);

// //       const WebMap = WebMapModule.default;
// //       const WebMapView = MapViewModule.default;
// //       const TileLayer = TileLayerModule.default;
// //       const FeatureLayer = FeatureLayerModule.default;

// //       const tileLayer = new TileLayer({
// //         url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer",
// //         opacity: 0.5,
// //       });

// //       const featureLayer = new FeatureLayer({
// //         url: "https://services.arcgis.com/ArcGIS/rest/services/WorldCities/FeatureServer/0",
// //       });

// //       const map = new WebMap({
// //         basemap: "topo",
// //         layers: [tileLayer, featureLayer],
// //       });

// //       const view = new WebMapView({
// //         container: mapRef.current as HTMLDivElement,
// //         map: map,
// //         center: [-98, 39],
// //         zoom: 5,
// //       });

// //       view.when(() => {
// //         console.log("Map is ready");
// //       });
// //     };

// //     initializeMap();

// //     return () => {
// //       if (mapRef.current) {
// //         mapRef.current.innerHTML = "";
// //       }
// //     };
// //   }, []);

// //   return (
// //     <ProtectedRoute>
// //       <Navbar />
// //       <div style={{ position: "relative", height: "100vh" }}>
// //         <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
// //       </div>
// //     </ProtectedRoute>
// //   );
// // };

// // export default ArcGISMap;




// import React, { useEffect, useRef } from "react";
// import ProtectedRoute from "../../common/auth/protectedRoute";
// import Navbar from "../../common/navbar/Navbar";
// import { db } from "../../common/config/firebase";
// import { ref, onValue } from "firebase/database";





// const ArcGISMap: React.FC = () => {
//   const mapRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const initializeMap = async () => {
//       const [WebMapModule, MapViewModule, GraphicsLayerModule, GraphicModule] =
//         await Promise.all([
//           import("@arcgis/core/WebMap"),
//           import("@arcgis/core/views/MapView"),
//           import("@arcgis/core/layers/GraphicsLayer"),
//           import("@arcgis/core/Graphic"),
//         ]);

//       const WebMap = WebMapModule.default;
//       const WebMapView = MapViewModule.default;
//       const GraphicsLayer = GraphicsLayerModule.default;
//       const Graphic = GraphicModule.default;

//       // Create a graphics layer
//       const graphicsLayer = new GraphicsLayer();

//       // Create the map
//       const map = new WebMap({
//         basemap: "streets",
//         layers: [graphicsLayer],
//       });

//       // Create the map view
//       const view = new WebMapView({
//         container: mapRef.current as HTMLDivElement,
//         map: map,
//         center: [26.1, 44.4], // Center on Bucharest
//         zoom: 12,
//       });

//       // Fetch locations from Firebase and add them to the map
//       const locationsRef = ref(db, "sport_locations");
//       onValue(locationsRef, (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           Object.entries(data).forEach(([sport, locations]) => {
//             (locations as any[]).forEach((location, index) => {
//               if (location && location.lat && location.lon) {
//                 const point = {
//                   type: "point",
//                   longitude: location.lon,
//                   latitude: location.lat,
//                 };

//                 const symbol = {
//                   type: "simple-marker",
//                   color: "blue",
//                   size: 8,
//                   outline: {
//                     color: "white",
//                     width: 1,
//                   },
//                 };

//                 const popupTemplate = {
//                   title: `${location.name}`,
//                   content: `<p>Sport: ${sport}</p>`,
//                 };

//                 const graphic = new Graphic({
//                   geometry: point,
//                   symbol: symbol,
//                   popupTemplate: popupTemplate,
//                 });

//                 graphicsLayer.add(graphic);
//               }
//             });
//           });
//         }
//       });

//       view.when(() => {
//         console.log("Map is ready");
//       });
//     };

//     initializeMap();

//     return () => {
//       if (mapRef.current) {
//         mapRef.current.innerHTML = "";
//       }
//     };
//   }, []);

//   return (
//     <ProtectedRoute>
//       <Navbar />
//       <div style={{ position: "relative", height: "100vh" }}>
//         <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default ArcGISMap;








import React, { useEffect, useRef } from "react";
import ProtectedRoute from "../../common/auth/protectedRoute";
import Navbar from "../../common/navbar/Navbar";
import { db } from "../../common/config/firebase";
import { ref, onValue } from "firebase/database";

const ArcGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

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

      // Create a graphics layer
      const graphicsLayer = new GraphicsLayer();

      // Create the map
      const map = new WebMap({
        basemap: "streets",
        layers: [graphicsLayer],
      });

      // Create the map view
      const view = new WebMapView({
        container: mapRef.current as HTMLDivElement,
        map: map,
        center: [26.1, 44.4], // Center on Bucharest
        zoom: 12,
      });

      // Fetch locations from Firebase and add them to the map
      const locationsRef = ref(db, "sport_locations");
      onValue(locationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          Object.entries(data).forEach(([sport, locations]) => {
            (locations as any[]).forEach((location, index) => {
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

                // const popupTemplate = {
                //   title: `${location.name}`,
                //   content: `
                //     <div>
                //       <p><strong>Sport:</strong> ${sport}</p>
                //       <p><strong>Phone:</strong> ${location.phone_number || "N/A"}</p>
                //       <p><strong>Website:</strong> <a href="${location.website}" target="_blank">${location.website || "N/A"}</a></p>
                //       <img src="${location.image}" alt="${location.name}" style="width:100%; height:auto; margin-top:10px;" />
                //     </div>
                //   `,
                // };

                const popupTemplate = {
                  title: `${location.name}`,
                  content: `
                    <div>
                      <p><strong>Sport:</strong> ${sport}</p>
                      <p><strong>Phone:</strong> ${location.phone_number || "N/A"}</p>
                      <p><strong>Website:</strong> <a href="${location.website}" target="_blank">${location.website || "N/A"}</a></p>
                      ${location.image ? `<img src="${location.image}" alt="${location.name}" style="width:100%; height:auto; margin-top:10px;" />` : ""}
                    </div>
                  `,
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
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
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
