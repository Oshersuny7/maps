import React, { useEffect } from "react";
import { addFeaturesToVectorLayer } from "../utils/MapUtils";
import { GeoJSON } from "ol/format";
const GeoJSONLoader = ({ vectorLayer, url }) => {
  useEffect(() => {
    if (!vectorLayer) return;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("GeoJSON data:", data);
        const features = new GeoJSON().readFeatures(data);
        features.forEach((feature, index) => {
          console.log(`Feature ${index}:`, feature.getProperties());
        });

        console.log("Features:", features);
        addFeaturesToVectorLayer(vectorLayer, features);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, [vectorLayer, url]);

  return <></>;
};

export default GeoJSONLoader;
