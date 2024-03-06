import React, { useState, useEffect } from "react";
import 'ol/ol.css';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { LineString } from 'ol/geom';
import Feature from 'ol/Feature';

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vectorLayer, setVectorLayer] = useState(null);
  const [selectedPlaceCoordinates, setSelectedPlaceCoordinates] = useState(null);

  useEffect(() => {
    const mapInstance = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    setMap(mapInstance);
    const vectorLayer = new VectorLayer({
      source: new VectorSource()
    });
    mapInstance.addLayer(vectorLayer);
    setVectorLayer(vectorLayer);

    return () => {
      mapInstance.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (!vectorLayer) return;

    fetch('coordinates.json')
      .then(response => response.json())
      .then(data => {
        const features = data.features.map(feature => {
          const coordinates = feature.geometry.coordinates;
          const lineString = new LineString(coordinates);
          const featureObject = new Feature({ geometry: lineString });
          return featureObject;
        });
        vectorLayer.getSource().addFeatures(features);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
      });
  }, [vectorLayer]);

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
      <div id="map" style={{ width: '100%', height: '500px' }}></div>

      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter city or country"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default MapComponent;

{/* <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            minWidth: 400,
          }}
          >
          <Typography variant="h6" component="h2">
            Location Properties
          </Typography>
          <Typography variant="body1" component="Box" sx={{ mt: 2 }}>
            <Box>
              Location:{" "}
              {selectedPlaceProperties && selectedPlaceProperties.location}
            </Box>
            <Box>
              Coordinates:{" "}
              {selectedPlaceProperties && selectedPlaceProperties.coordinates}
            </Box>
            <Box>
              Degrees:{" "}
              {selectedPlaceProperties && selectedPlaceProperties.degrees}
            </Box>
          </Typography>

          <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal> */}