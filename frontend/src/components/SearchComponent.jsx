import React from "react";
import { Alert, Box, Button, Input, Snackbar } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchComponent = () => {
  const handleSearch = () => {
    if (!map) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          const center = fromLonLat([parseFloat(lon), parseFloat(lat)]);
          setSelectedPlaceCoordinates(center);
          map.getView().animate({ center, zoom: 10, duration: 1000 });
        } else {
          setSnackbarOpen(true);
        }
      })
      .catch(error => {
        console.error('Error searching location:', error);
      });
  };

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Input placeholder="Insert country/city"></Input>
      <Button onClick={handleSearch}><SearchIcon /> Search</Button> 
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          Location not found
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchComponent;
