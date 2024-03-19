import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { useGeographic } from "ol/proj";
import { Box } from "@mui/material";
import DrawComponent from "./DrawComponent";
import {COORDINATES_JSON_PATH,LayerA_JSON_PATH,LayerB_JSON_PATH,SIBIRUNI_JSON_PATH,} from "../utils/FilePaths";
import { clearVectorLayer, createMap, getLayerByName } from "../utils/MapUtils";
import GeoJSONLoader from "./GeoJSONLoader";
import NavBarComponent from "./navBar/NavBarComponent";
import { useCounterTotalFeatures } from "../hooks/useCounterTotalFeatures";
import LayersName from "../utils/LayersName";
import PopoverComponent from "./overlays/PopOverComponent";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [drawingInProgress, setDrawingInProgress] = useState(false);
  const containerRef = useRef(null);
  const { counterFeatures, incrementCounter, resetCounter,polygonFeature } =useCounterTotalFeatures();
  
  useEffect(() => {
    useGeographic();
    const mapInstance = new Map({
      target: containerRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: [31, 35],
        zoom: 2,
      }),
    });
    setMap(mapInstance);
    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
    });
    mapInstance.addLayer(vectorLayer);
    setVectorLayer(vectorLayer);

    return () => {
      mapInstance.setTarget(null);
    };
  }, []);

  useEffect(() => {
    drawing ? setDrawingInProgress(true) : setDrawingInProgress(false);
  }, [drawing]);

  const handleDelateAll = () => {
    const layerToRemove = getLayerByName(map, LayersName.layers.Draw);
    if (layerToRemove) {
      clearVectorLayer(layerToRemove);
      resetCounter();
    }
  };

  return (
    <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2 }}>
        <NavBarComponent
          drawing={drawing}
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
        map={map}
        drawingInProgress={drawingInProgress}
        drawing={drawing}
      />
      {drawing && map && (
        <DrawComponent
          map={map}
          geometryType={drawing}
          incrementCounter={incrementCounter}
          polygonFeature={polygonFeature}
          
        />
      )}
    </Box>
  );
};
export default MapComponent;
