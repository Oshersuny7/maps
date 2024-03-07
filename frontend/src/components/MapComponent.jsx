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
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import PopoverComponent from "./PopOverComponent";
import DrawComponent from "./DrawComponent";
import SearchComponent from "./SearchComponent";
import { COORDINATES_JSON_PATH, SIBIRUNI_JSON_PATH } from "./utils/FilePaths";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlaceProperties, setSelectedPlaceProperties] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const containerRef = useRef(null); 
  const anchorElRef = useRef(null);

  useEffect(() => {
    useGeographic();
    const mapInstance = new Map({
      target: containerRef.current, 
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: [31, 35],
        zoom: 7,
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
        return new GeoJSON().readFeatures(data);
      })
      .then((features) => {
        vectorLayer.getSource().addFeatures(features);
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
        return new GeoJSON().readFeatures(data);
      })
      .then((features) => {
        vectorLayer.getSource().addFeatures(features);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
      });
  }, [vectorLayer, map]);

  useEffect(() => {
    if (!map) return;
    map.on("click", function (event) {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const properties = feature.getProperties();
        setSelectedPlaceProperties(properties);
        setOpenModal(true);
        anchorElRef.current.style.left = event.pixel[0] + "px";
        anchorElRef.current.style.top = event.pixel[1] + "px";
        anchorElRef.current.style.display = "block";
      }, {
        layerFilter: (layer) => layer.getProperties().name && layer.getProperties().name !== 'drawLayer'
      });
    });

    return () => {
      map.un("click");
    };
  }, [map]);

  const handleCloseModal = () => {
    setOpenModal(false);
    anchorElRef.current.style.display = "none";
  };

  const handleDelete = () => {
    const layerToRemove = map.getLayers().getArray().find(layer => layer.getProperties().name === 'drawLayer')

    if (layerToRemove) map.removeLayer(layerToRemove)
  }

  return (
    <Box>
      <Box ref={containerRef} id="map" style={{ width: "100%", height: "500px" }}></Box>
      <PopoverComponent
        open={openModal}
        handleClose={handleCloseModal}
        selectedPlaceProperties={selectedPlaceProperties}
        anchorElRef={anchorElRef}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: "5px",
        }}
      >
        <SearchComponent />
        <Box sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Typography>Geometry type:</Typography>
        <Select
          defaultValue="None"
          onChange={(event) => setDrawing(event.target.value)}
          >
          <MenuItem value="Point">Point</MenuItem>
          <MenuItem value="LineString">LineString</MenuItem>
          <MenuItem value="Polygon">Polygon</MenuItem>
          <MenuItem value="Circle">Circle</MenuItem>
          <MenuItem value="None">None</MenuItem>
        </Select>
          </Box>
        
        <Button variant="contained" color="error" onClick={handleDelete}> Delete all Draws</Button>
      </Box>
      {drawing && map && <DrawComponent map={map} geometryType={drawing} />}
    </Box>
  );
};

export default MapComponent;
