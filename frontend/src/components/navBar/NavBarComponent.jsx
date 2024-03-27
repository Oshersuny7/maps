import React from "react";
import {Grid} from "@mui/material";
import CounterFeaturesComponent from "./CounterFeaturesComponent";
import ClearFeaturesComponent from "./ClearFeaturesComponent";
import SelectFeaturesTypeComponent from "./SelectFeatureTypeComponet";
import SelectFeaturesComponent from "./SelectFeaturesComponent";

const NavBarComponent = ({ setDrawing, handleDelateAll }) => {
  return (
    <Grid
      container
      spacing={2}
      justifyContent="space-around"
      alignItems="center"
    >
      <SelectFeaturesComponent />
      <SelectFeaturesTypeComponent setDrawing={setDrawing} />
      <CounterFeaturesComponent />
      <ClearFeaturesComponent handleDelateAll={handleDelateAll} />
    </Grid>
  );
};

export default NavBarComponent;
