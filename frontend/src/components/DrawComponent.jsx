import React, { useEffect, useRef, useState } from "react";
import Draw from "ol/interaction/Draw.js";
import { unByKey } from "ol/Observable.js";
import {createVectorLayer,getArrayOfVectorLayersWithoutDrawLayer} from "../utils/MapUtils";
import LayersName from "../utils/LayersName";
import { Alert, Box, Typography } from "@mui/material";
import useFeaturesAmount from "../hooks/useFeaturesAmount";
import { useMap } from "../hooks/contexts/map/MapContext";
import { useDrawingInProgress } from "../hooks/useDrawingInProgress";
import { useCounterTotalFeatures } from "../hooks/useCounterTotalFeatures";

const DrawComponent = ({ geometryType ,showAlert, setShowAlert }) => {
  const { setDrawingInProgress } = useDrawingInProgress();
  const {incrementCounter} = useCounterTotalFeatures();
  const map = useMap();
  const drawLayerRef = useRef(null);
  const drawInteractionRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [counterArray, setCounterArray] = useState(null);
  const [vectorLayerWithoutDrawing, setVectorLayerWithoutDrawing] = useState([]);

  useEffect(() => {
    if (!map || !geometryType) return;

    if (geometryType === "None") {
      if (drawInteractionRef.current) {
        map.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
        setDrawingInProgress(false);
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
      const layersWithoutDrawing = getArrayOfVectorLayersWithoutDrawLayer(
        map
      );
      setVectorLayerWithoutDrawing(layersWithoutDrawing);
      const geometry = event.feature.getGeometry();
      const counter = useFeaturesAmount(layersWithoutDrawing, geometry);
      setCounterArray(counter);
      setDrawing(false);
      if (geometryType === "Polygon") {
        setShowAlert(true);
      }
      changeCursor();
      incrementCounter();
    });

    return () => {
      unByKey(drawStartKey);
      unByKey(drawEndKey);
    };
  }, [map, geometryType, incrementCounter]);

  const changeCursor = (cursorType = "crosshair") => {
    const mapElement = map.getTargetElement();
    mapElement.style.cursor = cursorType;
  };
  return (
    <>
      {showAlert && geometryType === "Polygon" && (
        <Alert severity="info">
          <Box>
            {vectorLayerWithoutDrawing.map((layer, index) => (
              <Typography sx={{ ml: "5px" }} key={`${layer.getProperties().name}-${index}`}>
                {layer.getProperties().name}:{" "}
                {counterArray ? counterArray[index] : 0} features
              </Typography>
            ))}
          </Box>
        </Alert>
      )}
    </>
  );
};
export default DrawComponent;