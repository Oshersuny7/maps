import { Box, Grid, MenuItem, Select, Typography } from '@mui/material'
import React from 'react'
import { geometryTypes } from '../../utils/GeomtryTypes'

const SelectFeaturesTypeComponent = ({setDrawing}) => {
  return (
    <Grid item xs={12} sm={3} lg={3}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography>Geometry type:</Typography>
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
  )
}

export default SelectFeaturesTypeComponent