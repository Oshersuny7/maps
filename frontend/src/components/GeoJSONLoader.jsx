import React, { useEffect } from "react";
import { addFeaturesToVectorLayer } from "../utils/OpenLayersUtils";
import { GeoJSON } from "ol/format";

const GeoJSONLoader = ({ vectorLayer, url }) => {
  useEffect(() => {
    if (!vectorLayer) return;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const features = new GeoJSON().readFeatures(data);
        addFeaturesToVectorLayer(vectorLayer, features);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, [vectorLayer, url]);

  return <></>;
};

export default GeoJSONLoader;
