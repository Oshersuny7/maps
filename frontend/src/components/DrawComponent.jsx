import React, { useEffect, useRef, useState } from "react";
import Draw from "ol/interaction/Draw.js";
import { unByKey } from "ol/Observable.js";
import {createVectorLayer,getArrayOfVectorLayersWithoutDrawing,} from "../utils/MapUtils";
import LayersName from "../utils/LayersName";
import { Alert, Box, Typography } from "@mui/material";
import useFeaturesAmount from "../hooks/useFeaturesAmount";
import { useMap } from "../hooks/contexts/map/MapContext";
import { useDrawingInProgress } from "../hooks/useDrawingInProgress";

const DrawComponent = ({ geometryType, incrementCounter}) => {
  const {setDrawingInProgress} = useDrawingInProgress();
  const mapRef = useRef(useMap());
  const drawLayerRef = useRef(null);
  const drawInteractionRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [polygonDrawn, setPolygonDrawn] = useState(false);
  const [counterArray, setCounterArray] = useState(null);

  useEffect(() => {
    if (!mapRef.current || !geometryType) return;

    if (geometryType === "None") {
      if (drawInteractionRef.current) {
        mapRef.current.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
        setDrawingInProgress(false);
      }
      changeCursor("default");
      return;
    }

    if (!drawLayerRef.current) {
      drawLayerRef.current = createVectorLayer(LayersName.layers.Draw);
      mapRef.current.addLayer(drawLayerRef.current);
    }

    if (drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
    }

    drawInteractionRef.current = new Draw({
      source: drawLayerRef.current.getSource(),
      type: geometryType,
    });

    mapRef.current.addInteraction(drawInteractionRef.current);

    const drawStartKey = drawInteractionRef.current.on("drawstart", () => {
      setDrawing(true);
      changeCursor();
    });

    const drawEndKey = drawInteractionRef.current.on("drawend", (event) => {
      const layersWithoutDrawing = getArrayOfVectorLayersWithoutDrawing( mapRef.current);
      const geometry = event.feature.getGeometry();
      const counter = useFeaturesAmount(layersWithoutDrawing, geometry);
      console.log(counter);
      setCounterArray(counter);
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
  }, [mapRef.current, geometryType, incrementCounter, counterArray]);

  const changeCursor = (cursorType = "crosshair") => {
    const mapElement = mapRef.current.getTargetElement();
    mapElement.style.cursor = cursorType;
  };

  return (
    <>
      {polygonDrawn && geometryType === "Polygon" && (
        <Alert severity="info">
          <Box>
            {Object.keys(LayersName.layers)
              .filter(
                (layerKey) =>
                  LayersName.layers[layerKey] !== LayersName.layers.Draw
              )
              .map((layerKey, index) => (
                <Typography key={layerKey}>
                  {LayersName.layers[layerKey]}:{" "}
                  {counterArray[index] ? counterArray[index] : 0} features
                </Typography>
              ))}
          </Box>
        </Alert>
      )}
    </>
  );
};

export default DrawComponent;
