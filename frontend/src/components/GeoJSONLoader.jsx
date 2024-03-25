import React, { useEffect } from "react";
import { addFeaturesToVectorLayer, getLayerByName } from "../utils/MapUtils";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useMap } from "../hooks/contexts/map/MapContext";

const GeoJSONLoader = ({ url }) => {
  const map = useMap();
  useEffect(() => {
    const loadGeoJSONData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const features = new GeoJSON().readFeatures(data);
        const uniqueLayerNames = [...new Set(features.map(feature => feature.getProperties().name))];

        uniqueLayerNames.forEach((layerName) => {
          const filteredFeatures = features.filter((feature) => feature.getProperties().name === layerName);

          if (filteredFeatures.length > 0) {
            addFeaturesToVectorLayer(map, layerName, filteredFeatures);
          }
        });
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };

    loadGeoJSONData();
  }, [map, url]);

  return <></>;
};

export default GeoJSONLoader;
