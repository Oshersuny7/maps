import React, { useEffect } from "react";
import { addFeaturesToVectorLayer } from "../utils/MapUtils";
import { GeoJSON } from "ol/format";
import useFeaturesAmount from "../hooks/useFeaturesAmount"; 

const GeoJSONLoader = ({ vectorLayer, url }) => {
  const { featureCounts } = useFeaturesAmount({ vectorLayer }); 

  useEffect(() => {
    if (!vectorLayer) return;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("GeoJSON data:", data); 
        const features = new GeoJSON().readFeatures(data);
        console.log("Features:", features); 
        addFeaturesToVectorLayer(vectorLayer, features);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, [vectorLayer, url]);

  useEffect(() => {
    console.log("Feature counts:", featureCounts); 
  }, [featureCounts]);

  return <></>;
};

export default GeoJSONLoader;
