import { Box, Button, Input } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const SearchComponent=()=>{
  const handleSearch = async () => {
    if (!map) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const center = fromLonLat([parseFloat(lon), parseFloat(lat)]);
        setSelectedPlaceCoordinates(center);
        map.getView().animate({ center, zoom: 10, duration: 1000 });
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  return(
    <Box>
      <Input placeholder="Insert country/city"></Input>
      <Button onClick={handleSearch}><SearchIcon>Search</SearchIcon></Button>
    </Box>
  )

}
export default SearchComponent;
