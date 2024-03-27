import { Box, Button, Typography } from '@mui/material';
import { drawLineBetweenSiteAndDevice, getFeatureBySiteId } from "../../utils/MapUtils";
import LayersName from "../../utils/LayersName";
import FeatureTypes from "../../utils/FeatureTypes";
import React from 'react'
import { useMap } from '../../hooks/contexts/map/MapContext';

const FeatureProperties = ({selectedPlaceProperties}) => {
    const map =useMap();
    const handleDrawLine = () => {
        console.log("clicked");
        if (selectedPlaceProperties && selectedPlaceProperties.type === FeatureTypes.types.Site) {
          const siteId = selectedPlaceProperties.id;
          const deviceFeatures = getFeatureBySiteId(map, LayersName.layers.DeviceLayer, FeatureTypes.types.Device, siteId);
          
          deviceFeatures.forEach(deviceFeature => {
            drawLineBetweenSiteAndDevice(map, selectedPlaceProperties, deviceFeature);
           });
        } 
        else if (selectedPlaceProperties && selectedPlaceProperties.type === FeatureTypes.types.Device) {
          const siteId = selectedPlaceProperties.siteId;
          const siteFeature = getFeatureBySiteId(map, LayersName.layers.SiteLayer, FeatureTypes.types.Site, siteId);
          
          if (siteFeature) {
            drawLineBetweenSiteAndDevice(map, siteFeature, selectedPlaceProperties);
          }
        }
      };
  return (
    <Box sx={{ bgcolor: "gray" }}>
    <Box>
      <Typography
        sx={{ display: "flex", justifyContent: "center", color: "white" }}
        variant="h6"
        component="h2"
      >
        Location Properties
      </Typography>
      <Button
        variant="contained"
        color="warning"
        sx={{ width: "100%" }}
        onClick={handleDrawLine}
      >
      find {selectedPlaceProperties && selectedPlaceProperties.find}
      </Button>
    </Box>
    <Typography variant="body1" component="div" sx={{ mt: 1 }}>
      <Box sx={{ color: "white" }}>
        Type: {selectedPlaceProperties && selectedPlaceProperties.type}
      </Box>
      <Box sx={{ color: "white" }}>
        Layer: {selectedPlaceProperties && selectedPlaceProperties.name}
      </Box>
      <Box sx={{ color: "white" }}>
        Location:{" "}
        {selectedPlaceProperties && selectedPlaceProperties.location}
      </Box>
      <Box sx={{ color: "white" }}>
        Coordinates:{" "}
        {selectedPlaceProperties && selectedPlaceProperties.coordinates}
      </Box>
      <Box sx={{ color: "white" }}>
        Degrees: {selectedPlaceProperties && selectedPlaceProperties.degrees}
      </Box>
    </Typography>
  </Box>); 
}
export default FeatureProperties