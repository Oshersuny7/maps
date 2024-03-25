import React, { useRef } from "react";
import MapComponent from "../components/MapComponent";
import { Box } from "@mui/material";
import { MapContextProvider } from "../hooks/contexts/map/MapContext";
import { createMap } from "../utils/MapUtils";
import { CounterTotalFeatureContextProvider } from "../hooks/contexts/features/CounterTotalFeaturesContext";
import { DrawingInProgressContextProvider } from "../hooks/contexts/features/DrawingInProgress";

const MapPage = () => {
  const mapRef = useRef(createMap());
  return (
    <Box className="App">
      <MapContextProvider map={mapRef.current}>
        <CounterTotalFeatureContextProvider>
          <DrawingInProgressContextProvider>
            <MapComponent/>
          </DrawingInProgressContextProvider>
        </CounterTotalFeatureContextProvider>
      </MapContextProvider>
    </Box>
  );
};

export default MapPage;
