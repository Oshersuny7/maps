import React, { useState } from "react";
import { TextField, IconButton, Alert, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchComponent = ({ map }) => {
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState(false);

  const handleSearch = () => {
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchInput
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const coordinates = data.features[0].center;
          map.getView().animate({ center: coordinates, zoom: 10 });
          setError(false);
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        console.error("Error geocoding:", error);
        setError(true);
      });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <TextField
        label="Search for a place"
        variant="outlined"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <IconButton
        onClick={handleSearch}
        aria-label="Search"
        disabled={!searchInput.trim()}
      >
        <SearchIcon />
      </IconButton>
      {error && (
        <Alert severity="error">Location not found. Please try again.</Alert>
      )}
    </Box>
  );
};

export default SearchComponent;
