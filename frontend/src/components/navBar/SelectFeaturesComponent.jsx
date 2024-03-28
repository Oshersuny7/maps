import { Box, Grid, MenuItem, Select, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { nicoleFeatures } from '../../utils/NicoleFeatures'
import { useMap } from '../../hooks/contexts/map/MapContext';
import { addFeaturesToVectorLayer, createVectorLayer } from '../../utils/MapUtils';
import LayersName from '../../utils/LayersName';

const SelectFeaturesComponent = () => {
    const map = useMap();
    const [selectedFeature, setSelectedFeature] = useState(null);
  
    useEffect(() => {
      if (!map) return;
      const clickListener = map.on("click", (event) => {
        if (selectedFeature) {
          addFeatureToMap(event.coordinate);
        }
      });
      return () => {
        map.un("click", clickListener);
      };
    }, [map, selectedFeature]);
  
    const addFeatureToMap = (coordinate) => {
      createVectorLayer(LayersName.layers.NicolLayer);
      addFeaturesToVectorLayer(map, LayersName.layers.NicolLayer, selectedFeature);
      map.addLayer(LayersName.layers.NicolLayer);
      setSelectedFeature(null);
    };
  return (
    <Grid item xs={12} sm={3} lg={3}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography>Select Nicole features to add: </Typography>
      <Select
        defaultValue="None"
        onChange={(event) => setSelectedFeature(event.target.value)}
      >
        {nicoleFeatures.map((feat) => (
          <MenuItem key={feat} value={feat}>
            {feat}
          </MenuItem>
        ))}
      </Select>
    </Box>
  </Grid>
  )
}

export default SelectFeaturesComponent