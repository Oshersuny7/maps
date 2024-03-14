import { Box } from "@mui/material";
import "./App.css";
import MapComponent from "./components/MapComponent";
import { CounterTotalFeatureContextProvider } from "./hooks/contexts/features/CounterTotalFeaturesContext";
import { MapContextProvider } from "./hooks/contexts/map/MapContext";
function App() {
  return (
    <Box className="App">
      <MapContextProvider>
      <CounterTotalFeatureContextProvider>
        <MapComponent />
      </CounterTotalFeatureContextProvider>
      </MapContextProvider>
    </Box>
  );
}

export default App;
