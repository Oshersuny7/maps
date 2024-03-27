import React from 'react'
import { Box, Button, Typography } from '@mui/material';
import { drawLineBetweenSiteAndDevice, getFeatureBySiteId, getLayerByName } from "../../utils/MapUtils";
import LayersName from "../../utils/LayersName";
import FeatureTypes from "../../utils/FeatureTypes";
import { useMap } from '../../hooks/contexts/map/MapContext';
import { LineString } from 'ol/geom';

const FeatureProperties = ({selectedPlaceProperties}) => {
    const map = useMap();
    const handleDrawLine = () => {
        if (selectedPlaceProperties) {
            if (selectedPlaceProperties.type === FeatureTypes.types.Site) {
                const deviceLayer = getLayerByName(map, LayersName.layers.DeviceLayer);
                if (!deviceLayer) return;
    
                const deviceFeatures = deviceLayer.getSource().getFeatures();
                if (!deviceFeatures || deviceFeatures.length === 0) return;
    
                deviceFeatures.forEach((deviceFeature) => {
                    const siteCoordinates = selectedPlaceProperties.geometry.getCoordinates();
                    const deviceCoordinates = deviceFeature.getGeometry().getCoordinates();
    
                    const lineString = new LineString([siteCoordinates, deviceCoordinates]);
    
                    drawLineBetweenSiteAndDevice(map, lineString);
                });
    
            } else if (selectedPlaceProperties.type === FeatureTypes.types.Device) {
                const siteId = selectedPlaceProperties.siteId;
                const siteFeature = getFeatureBySiteId(map, LayersName.layers.SiteLayer, FeatureTypes.types.Site, siteId);
    
                if (siteFeature) {
                    const siteCoordinates = siteFeature.getGeometry().getCoordinates();
                    const deviceCoordinates = selectedPlaceProperties.geometry.getCoordinates();
    
                    const lineString = new LineString([siteCoordinates, deviceCoordinates]);
    
                    drawLineBetweenSiteAndDevice(map, lineString);
                }
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
      </Box>
    ); 
}
export default FeatureProperties;