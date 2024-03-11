import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { useGeographic } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON.js";
import { Box, Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import PopoverComponent from "./PopOverComponent";
import DrawComponent from "./DrawComponent";
import SearchComponent from "./SearchComponent";
import { COORDINATES_JSON_PATH, SIBIRUNI_JSON_PATH } from "./utils/FilePaths";
import DrawLayer from "./utils/LayersName";
import { useCounterFeatures } from "./hooks/CounterFeautersHook";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlaceProperties, setSelectedPlaceProperties] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [drawingInProgress, setDrawingInProgress] = useState(false);
  const containerRef = useRef(null);
  const anchorElRef = useRef(null);
  const geometryTypes = ["Point", "LineString", "Polygon", "Circle", "None"];
  const { counterFeatures, incrementCounter, resetCounter } = useCounterFeatures();

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
    if (!vectorLayer) return;
    fetch(COORDINATES_JSON_PATH)
      .then((response) => response.json())
      .then((data) => {
        const features = new GeoJSON().readFeatures(data);
        if (vectorLayer.getSource() instanceof VectorSource) {
          vectorLayer.getSource().addFeatures(features);
        } else {
          console.error('Vector layer source is not properly initialized');
        }
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
      });
  }, [vectorLayer]);

  useEffect(() => {
    if (!vectorLayer) return;
    fetch(SIBIRUNI_JSON_PATH)
      .then((response) => response.json())
      .then((data) => {
        const features = new GeoJSON().readFeatures(data);
        if (vectorLayer.getSource() instanceof VectorSource) {
          vectorLayer.getSource().addFeatures(features);
        } else {
          console.error('Vector layer source is not properly initialized');
        }
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
      });
  }, [vectorLayer]);

  useEffect(() => {
    if (!map) return;
    const handlePopOver = (event) => {
      if (!drawingInProgress && !drawing) {
        const feature = map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => feature
        );
        if (feature) {
          const properties = feature.getProperties();
          anchorElRef.current.style.left = event.pixel[0] + "px";
          anchorElRef.current.style.top = event.pixel[1] + "px";
          anchorElRef.current.style.display = "block";
          setSelectedPlaceProperties(properties);
          setOpenModal(true);
        }
      }
    };

    map.on("click", handlePopOver);
    return () => {
      map.un("click", handlePopOver);
    };
  }, [map, drawingInProgress, counterFeatures]);

  useEffect(() => {
    if (drawing) {
      setDrawingInProgress(true);
    } else {
      setDrawingInProgress(false);
    }
  }, [drawing]);

  const handleCloseModal = () => {
    setOpenModal(false);
    anchorElRef.current.style.display = "none";
  };

  const handleDelete = () => {
    const layerToRemove = map
      .getLayers()
      .getArray()
      .find((layer) => layer.getProperties().name === DrawLayer);
    if (layerToRemove) {
      const source = layerToRemove.getSource();
      if (source instanceof VectorSource) {
        source.clear();
      } else {
        console.error('Vector layer source is not properly initialized');
      }
      resetCounter();
    }
  };

  return (
    <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2 }}>
        <Grid
          container
          spacing={2}
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item xs={12} sm={6} lg={3}>
            <SearchComponent map={map} />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
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
          <Grid item xs={12} sm={6} lg={2}>
            <Typography sx={{ display: "block", mb: 1 }}>
              Features Added in total: {counterFeatures}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <Typography sx={{ display: "block", mb: 1 }}>
              Features in polygon: {}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete all Draws
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flex: "1" }}>
        <Box
          ref={containerRef}
          id="map"
          style={{ width: "100%", height: "100%" }}
        ></Box>
      </Box>

      <PopoverComponent
        open={openModal}
        handleClose={handleCloseModal}
        selectedPlaceProperties={selectedPlaceProperties}
        anchorElRef={anchorElRef}
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
