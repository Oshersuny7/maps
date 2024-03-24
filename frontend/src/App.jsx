import { Box } from "@mui/material";
import "./App.css";
import MapComponent from "./components/MapComponent";
import { CounterTotalFeatureContextProvider } from "./hooks/contexts/features/CounterTotalFeaturesContext";
import { MapContextProvider } from "./hooks/contexts/map/MapContext";
import { createMap } from "./utils/MapUtils";
import { useRef } from "react";
import { DrawingInProgressContextProvider } from "./hooks/contexts/features/DrawingInProgress";


function App() {
  const mapRef = useRef(createMap());
  return (
    <Box className="App">
      <MapContextProvider map={mapRef.current}>
        <CounterTotalFeatureContextProvider>
          <DrawingInProgressContextProvider>
            <MapComponent />
          </DrawingInProgressContextProvider>
        </CounterTotalFeatureContextProvider>
      </MapContextProvider>
    </Box>
  );
}

export default App;
