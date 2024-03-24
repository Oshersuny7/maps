import React from "react";
import { Box, Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import { geometryTypes } from "../../utils/GeomtryTypes";
import SearchComponent from "./SearchComponent";
import { useMap } from "../../hooks/contexts/map/MapContext";
import { useCounterTotalFeatures } from "../../hooks/useCounterTotalFeatures";

const NavBarComponent = ({ setDrawing, handleDelateAll }) => {
  const {counterFeatures} = useCounterTotalFeatures();
  const map = useMap();
  return (
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
      <Grid item xs={12} sm={12} lg={2}>
        <Typography>Features Added in total: {counterFeatures}</Typography>
      </Grid>

      <Grid item xs={12} sm={12} lg={2}>
        <Button variant="contained" color="error" onClick={handleDelateAll}>
          Clear all Draws
        </Button>
      </Grid>
    </Grid>
  );
};

export default NavBarComponent;
