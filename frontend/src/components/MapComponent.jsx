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
import { Modal, Box, Typography, Button, Popover } from "@mui/material";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vectorLayer, setVectorLayer] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlaceProperties, setSelectedPlaceProperties] = useState(null);
  const [selectedPlaceCoordinates, setSelectedPlaceCoordinates] = useState(null);
  const anchorElRef = useRef(null);

  useEffect(() => {
    useGeographic();
    const mapInstance = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
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
    fetch("/coordinates.json")
      .then((response) => response.json())
      .then((data) => {
        return new GeoJSON().readFeatures(data);
      })
      .then((features) => {
        vectorLayer.getSource().addFeatures(features);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, [vectorLayer]);

  useEffect(() => {
    if (!vectorLayer) return;
    fetch("/sibiruni.json")
      .then((response) => response.json())
      .then((data) => {
        return new GeoJSON().readFeatures(data);
      })
      .then((features) => {
        vectorLayer.getSource().addFeatures(features);
      
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, [vectorLayer, map]);

  useEffect(() => {
    if (!map) return;

    map.on("click", function (event) {
      map.forEachFeatureAtPixel(event.pixel, function (feature) {
        const properties = feature.getProperties();
        setSelectedPlaceProperties(properties);
        setOpenModal(true);

        const coordinate = feature.getGeometry().getCoordinates();
        anchorElRef.current.style.left = event.pixel[0] + "px";
        anchorElRef.current.style.top = event.pixel[1] + "px";
        anchorElRef.current.style.display = "block";
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
  
  const handleSearch = async () => {
    if (!map) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const center = fromLonLat([parseFloat(lon), parseFloat(lat)]);
        setSelectedPlaceCoordinates(center);
        map.getView().animate({ center, zoom: 10, duration: 1000 });
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  return (
    <div>
      <Box id="map" style={{ width: "100%", height: "500px" }}> </Box>
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter city or country"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    
      <div ref={anchorElRef} style={{ display: "none", position: "absolute" }}>
        <Popover
          id="popover"
          open={openModal}
          onClose={handleCloseModal}
          anchorEl={anchorElRef.current}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Box>
            <Typography variant="h6" component="h2">
              Location Properties
            </Typography>
            <Typography variant="body1" component="div" sx={{ mt: 2 }}>
              <div>
                Location:{" "}
                {selectedPlaceProperties && selectedPlaceProperties.location}
              </div>
              <div>
                Coordinates:{" "}
                {selectedPlaceProperties && selectedPlaceProperties.coordinates}
              </div>
              <div>
                Degrees:{" "}
                {selectedPlaceProperties && selectedPlaceProperties.degrees}
              </div>
            </Typography>

            <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        </Popover>
      </div>
    </div>
  );
};

export default MapComponent;

