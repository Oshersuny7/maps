import React, { useEffect, useRef, useState } from "react";
import Draw from "ol/interaction/Draw.js";
import { unByKey } from "ol/Observable.js";
import { createVectorLayer } from "../utils/MapUtils";
import LayersName from "../utils/LayersName";
import { Alert, Box, Typography } from "@mui/material";
import useFeaturesAmount from "../hooks/useFeaturesAmount";

const DrawComponent = ({ map, geometryType, incrementCounter, polygonFeature }) => {
  const drawLayerRef = useRef(null);
  const drawInteractionRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [polygonDrawn, setPolygonDrawn] = useState(false);
  const [featureCounts, setFeatureCounts] = useState(null);

  useEffect(() => {
    if (!map || !geometryType) return;

    if (geometryType === "None") {
      if (drawInteractionRef.current) {
        map.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }
      changeCursor("default");
      return;
    }

    if (!drawLayerRef.current) {
      drawLayerRef.current = createVectorLayer(LayersName.layers.Draw);
      map.addLayer(drawLayerRef.current);
    }

    if (drawInteractionRef.current) {
      map.removeInteraction(drawInteractionRef.current);
    }

    drawInteractionRef.current = new Draw({
      source: drawLayerRef.current.getSource(),
      type: geometryType,
    });

    map.addInteraction(drawInteractionRef.current);

    const drawStartKey = drawInteractionRef.current.on("drawstart", () => {
      setDrawing(true);
      changeCursor();
    });

    const drawEndKey = drawInteractionRef.current.on("drawend", (event) => {
      setDrawing(false);
      if (geometryType === "Polygon") {
        setPolygonDrawn(true);
      }
      changeCursor();
      incrementCounter();
    });

    return () => {
      unByKey(drawStartKey);
      unByKey(drawEndKey);
    };
  }, [map, geometryType, incrementCounter]);

  useEffect(() => {
    if (polygonFeature && polygonFeature.getGeometry()) {
      const counts = useFeaturesAmount({ polygonFeature });
      setFeatureCounts(counts);
    }
  }, [polygonFeature]);

  const changeCursor = (cursorType = "crosshair") => {
    const mapElement = map.getTargetElement();
    mapElement.style.cursor = cursorType;
  };

  useEffect(() => {
    console.log("Feature counts:", featureCounts);
  }, [featureCounts]);

  return (
    <>
      {polygonDrawn && geometryType === "Polygon" && (
        <Alert severity="info">
          <Box>
            {Object.values(LayersName.layers).map((layerName) => (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                key={layerName}
              >
                <Typography>
                  {layerName} has:{" "}
                  {featureCounts && featureCounts[layerName] !== undefined
                    ? featureCounts[layerName]
                    : "0"}{" "}
                  features
                </Typography>
              </Box>
            ))}
          </Box>
        </Alert>
      )}
    </>
  );
};

export default DrawComponent;
