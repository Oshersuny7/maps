import React, { useState } from "react";
import { Box, Button, Input, Snackbar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Alert from "@mui/material/Alert";

const SearchComponent = ({ map, fromLonLat }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedPlaceCoordinates, setSelectedPlaceCoordinates] =
    useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Search clicked");
    if (!map) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          const center = fromLonLat([parseFloat(lon), parseFloat(lat)]);
          setSelectedPlaceCoordinates(center);
          map.getView().animate({ center, zoom: 10, duration: 1000 });
        } else {
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error searching location:", error);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Input
          variant="contained"
          color="primary"
          placeholder="Insert country/city"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          <SearchIcon />
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Location not found
        </Alert>
      </Snackbar>
    </Box>
  );
  
};

export default SearchComponent;
