import React, { useState } from "react";
import { Box, Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import { geometryTypes } from "../../utils/GeomtryTypes";
import SearchComponent from "./SearchComponent";

const NavBarComponent = ({
  map,
  setDrawing,
  counterFeatures,
  handleDelateAll,
}) => {
  const [drawMode, setDrawMode] = useState("Polygon");

  const handleDrawButtonClick = () => {
    if (drawMode === "Polygon") {
      setDrawMode("Cancel");
      setDrawing("Polygon");
    } else {
      setDrawMode("Polygon");
      setDrawing("None");
    }
  };
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
        <Button variant="contained" onClick={handleDrawButtonClick}>
          {drawMode === "Polygon" ? "Draw polygon" : "Cancel drawing"}
        </Button>
      </Grid>
      <Grid item xs={12} sm={12} lg={2}>
        <Button variant="contained" color="error" onClick={handleDelateAll}>
          Delete all Draws
        </Button>
      </Grid>
    </Grid>
  );
};

export default NavBarComponent;
