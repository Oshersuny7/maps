import React, { useState, useEffect, useRef, useContext } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { useGeographic } from "ol/proj";
import { Box, Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import PopoverComponent from "./PopOverComponent";
import DrawComponent from "./DrawComponent";
import SearchComponent from "./SearchComponent";
import { COORDINATES_JSON_PATH, SIBIRUNI_JSON_PATH } from "../utils/FilePaths";
import DrawLayer from "../utils/LayersName";
import useCounterFeaturesInPolygon from "../hooks/useCounterFeaturesInPolygon";
import { clearVectorLayer, getLayerByName } from "../utils/OpenLayersUtils";
import GeoJSONLoader from "./GeoJSONLoader";
import { CounterTotalFeatureContext } from "../hooks/contexts/features/CounterTotalFeaturesContext";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [drawingInProgress, setDrawingInProgress] = useState(false);
  const containerRef = useRef(null);
  const geometryTypes = ["Point", "LineString", "Polygon", "Circle", "None"];
  const { counterFeatures, incrementCounter, resetCounter } = useContext(CounterTotalFeatureContext);
  const { counterFeaturesInPolygon } = useCounterFeaturesInPolygon( map,vectorLayer);
  
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
    if (drawing) {
      setDrawingInProgress(true);
    } else {
      setDrawingInProgress(false);
    }
  }, [drawing]);

  const handleDelateAll = () => {
    const layerToRemove = getLayerByName(map, DrawLayer);
    if (layerToRemove) {
      clearVectorLayer(layerToRemove);
      resetCounter();
    }
  };

  const navBar = (
    <Grid
      container
      spacing={2}
      justifyContent="space-around"
      alignItems="center"
    >
      <Grid item xs={12} sm={12} lg={2}>
        <SearchComponent map={map} />
      </Grid>
      <Grid item xs={12} sm={12} lg={2}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 2 }}>Geometry type:</Typography>
          <Select
            defaultValue="None"
            onChange={(event) => setDrawing(event.target.value)}
          >
            {geometryTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} lg={2}>
        <Typography sx={{ display: "block", mb: 1 }}>
          Features Added in total: {counterFeatures}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} lg={2}>
        <Typography sx={{ display: "block", mb: 1 }}>
          Features in polygon: {counterFeaturesInPolygon}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} lg={2}>
        <Button variant="contained" color="error" onClick={handleDelateAll}>
          Delete all Draws
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2 }}>{navBar}</Box>
      <Box sx={{ flex: "1" }}>
        <Box
          ref={containerRef}
          id="map"
          style={{ width: "100%", height: "100%" }}
        ></Box>
        <GeoJSONLoader vectorLayer={vectorLayer} url={COORDINATES_JSON_PATH} />
        <GeoJSONLoader vectorLayer={vectorLayer} url={SIBIRUNI_JSON_PATH} />
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
        />
      )}
    </Box>
  );
};

export default MapComponent;
