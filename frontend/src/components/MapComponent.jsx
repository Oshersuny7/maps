import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import { useGeographic } from "ol/proj";
import { Box } from "@mui/material";
import DrawComponent from "./DrawComponent";
import { FEATURES_JSON_PATH, NICOLE_FEATURES_JSON_PATH } from "../utils/FilePaths";
import { clearVectorLayer, getLayerByName } from "../utils/MapUtils";
import GeoJSONLoader from "./GeoJSONLoader";
import NavBarComponent from "./navBar/NavBarComponent";
import { useCounterTotalFeatures } from "../hooks/useCounterTotalFeatures";
import LayersName from "../utils/LayersName";
import PopoverComponent from "./overlays/PopOverComponent";
import { useMap } from "../hooks/contexts/map/MapContext";
import { useDrawingInProgress } from "../hooks/useDrawingInProgress";

const MapComponent = () => {
  const map = useMap();
  const [drawing, setDrawing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const containerRef = useRef(null);
  const { setDrawingInProgress } = useDrawingInProgress();
  const { resetCounter } = useCounterTotalFeatures();

  useEffect(() => {
    useGeographic();
    if (map && containerRef.current) {
      map.setTarget(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (drawing !== "None") {
      drawing ? setDrawingInProgress(true) : setDrawingInProgress(false);
    }
  }, [drawing]);

  const handleDelateAll = () => {
    const drawlayerToRemove = getLayerByName(map, LayersName.layers.Draw);
    const removeLines = getLayerByName(map, LayersName.layers.LineStringLayer)
    if (drawlayerToRemove || removeLines) {
      clearVectorLayer(drawlayerToRemove);
      clearVectorLayer(removeLines);
      resetCounter();
      setShowAlert(false);
    }
  };

  if (!map) return <></>;

  return (
    <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2 }}>
        <NavBarComponent
          setDrawing={setDrawing}
          handleDelateAll={handleDelateAll}
        />
      </Box>
      <Box sx={{ flex: "1" }}>
        <Box
          ref={containerRef}
          id="map"
          style={{ width: "100%", height: "100%" }}
        ></Box>
        <GeoJSONLoader url={FEATURES_JSON_PATH} />
      </Box>
      <PopoverComponent />
      {drawing && <DrawComponent geometryType={drawing} showAlert={showAlert} setShowAlert={setShowAlert} />}
    </Box>
  );
};
export default MapComponent;
