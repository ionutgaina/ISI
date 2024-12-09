import esriConfig from '@arcgis/core/config';

const configureArcGIS = () => {
  esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
};

export default configureArcGIS;
