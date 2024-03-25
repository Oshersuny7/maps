import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import { useGeographic } from "ol/proj";
import { Box } from "@mui/material";
import DrawComponent from "./DrawComponent";
import { Features_JSON_PATH } from "../utils/FilePaths";
import { clearVectorLayer, getLayerByName } from "../utils/MapUtils";
import GeoJSONLoader from "./GeoJSONLoader";
import NavBarComponent from "./navBar/NavBarComponent";
import { useCounterTotalFeatures } from "../hooks/useCounterTotalFeatures";
import LayersName from "../utils/LayersName";
import PopoverComponent from "./overlays/PopOverComponent";
import { useMap } from "../hooks/contexts/map/MapContext";
import { useDrawingInProgress } from "../hooks/useDrawingInProgress";

const MapComponent = () => {
  const mapRef = useRef(useMap());
  const [drawing, setDrawing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const containerRef = useRef(null);
  const { setDrawingInProgress } = useDrawingInProgress();
  const { resetCounter } = useCounterTotalFeatures();

  useEffect(() => {
    useGeographic();
    if (mapRef.current && containerRef.current) {
      mapRef.current.setTarget(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (drawing !== "None") {
      drawing ? setDrawingInProgress(true) : setDrawingInProgress(false);
    }
  }, [drawing]);

  const handleDelateAll = () => {
    const layerToRemove = getLayerByName(mapRef.current, LayersName.layers.Draw);
    if (layerToRemove) {
      clearVectorLayer(layerToRemove);
      resetCounter();
      setShowAlert(false);
    }
  };

  if (!mapRef.current) return <></>;

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
        <GeoJSONLoader url={Features_JSON_PATH} />
      </Box>
      <PopoverComponent />
      {drawing && <DrawComponent geometryType={drawing} showAlert={showAlert} setShowAlert={setShowAlert} />}
    </Box>
  );
};
export default MapComponent;
