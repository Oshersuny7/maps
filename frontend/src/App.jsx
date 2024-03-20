import { Box } from "@mui/material";
import "./App.css";
import MapComponent from "./components/MapComponent";
import { CounterTotalFeatureContextProvider } from "./hooks/contexts/features/CounterTotalFeaturesContext";
import { MapContextProvider } from "./hooks/contexts/map/MapContext";
import { createMap } from "./utils/MapUtils";
import { useRef } from "react";
function App() {
  const mapRef = useRef(createMap());
  return (
    <Box className="App">
      <MapContextProvider map={mapRef.current}>
        <CounterTotalFeatureContextProvider>
          <MapComponent />
        </CounterTotalFeatureContextProvider>
      </MapContextProvider>
    </Box>
  );
}

export default App;
