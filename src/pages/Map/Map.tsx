import React, { useEffect, useRef } from 'react';

const ArcGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

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
        basemap: 'topo', 
        layers: [tileLayer, featureLayer],
      });

      const view = new WebMapView({
        container: mapRef.current as HTMLDivElement,
        map: map,
        center: [-98, 39],
        zoom: 5,
      });

      view.when(() => {
        console.log('Map is ready');
      });
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default ArcGISMap;
