import { Grid, Typography } from "@mui/material";
import React from "react";
import { useCounterTotalFeatures } from "../../hooks/useCounterTotalFeatures";

const CounterFeaturesComponent = () => {
  const { counterFeatures } = useCounterTotalFeatures();
  return (
    <Grid item xs={12} sm={3} lg={3}>
      <Typography>Features Added in total: {counterFeatures}</Typography>
    </Grid>
  );
};

export default CounterFeaturesComponent;
