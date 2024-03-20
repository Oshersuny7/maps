import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useGeographic } from "ol/proj";
import { Box } from "@mui/material";
import DrawComponent from "./DrawComponent";
import { COORDINATES_JSON_PATH,LayerA_JSON_PATH,LayerB_JSON_PATH, SIBIRUNI_JSON_PATH,} from "../utils/FilePaths";
import { clearVectorLayer, getLayerByName } from "../utils/MapUtils";
import GeoJSONLoader from "./GeoJSONLoader";
import NavBarComponent from "./navBar/NavBarComponent";
import { useCounterTotalFeatures } from "../hooks/useCounterTotalFeatures";
import LayersName from "../utils/LayersName";
import PopoverComponent from "./overlays/PopOverComponent";
import { useMap } from "../hooks/contexts/map/MapContext";

const MapComponent = () => {
  const mapRef = useRef(useMap());
  const [vectorLayer, setVectorLayer] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [drawingInProgress, setDrawingInProgress] = useState(false);
  const containerRef = useRef(null);
  const { counterFeatures, incrementCounter, resetCounter, polygonFeature } = useCounterTotalFeatures();

  useEffect(() => {
    useGeographic();
    if (mapRef.current && containerRef.current) {
      const vectorLayer = new VectorLayer({
        source: new VectorSource(),
      });
      mapRef.current.addLayer(vectorLayer);
      setVectorLayer(vectorLayer);
      mapRef.current.setTarget(containerRef.current);
    }
  }, []);

  useEffect(() => {
    drawing ? setDrawingInProgress(true) : setDrawingInProgress(false);
  }, [drawing]);

  const handleDelateAll = () => {
    const layerToRemove = getLayerByName(mapRef.current, LayersName.layers.Draw);
    if (layerToRemove) {
      clearVectorLayer(layerToRemove);
      resetCounter();
    }
  };

  if (!mapRef.current) return <></>;

  return (
    <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2 }}>
        <NavBarComponent
          setDrawing={setDrawing}
          counterFeatures={counterFeatures}
          handleDelateAll={handleDelateAll}
        />
      </Box>
      <Box sx={{ flex: "1" }}>
        <Box
          ref={containerRef}
          id="map"
          style={{ width: "100%", height: "100%" }}
        ></Box>
        <GeoJSONLoader vectorLayer={vectorLayer} url={COORDINATES_JSON_PATH} />
        <GeoJSONLoader vectorLayer={vectorLayer} url={SIBIRUNI_JSON_PATH} />
        <GeoJSONLoader vectorLayer={vectorLayer} url={LayerA_JSON_PATH} />
        <GeoJSONLoader vectorLayer={vectorLayer} url={LayerB_JSON_PATH} />
      </Box>
      <PopoverComponent
        drawingInProgress={drawingInProgress}
        drawing={drawing}
      />
      {drawing && (
        <DrawComponent
          geometryType={drawing}
          incrementCounter={incrementCounter}
          polygonFeature={polygonFeature}
        />
      )}
    </Box>
  );
};
export default MapComponent;
