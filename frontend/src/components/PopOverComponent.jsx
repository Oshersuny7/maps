import React from 'react';
import { Box, Typography, Popover } from '@mui/material';

const PopoverComponent = ({ open, handleClose, selectedPlaceProperties, anchorElRef }) => {
  const locationProperties = (
    <Box>
           <Typography variant="h6" component="h2">
             Location Properties
           </Typography>
           <Typography variant="body1" component="div" sx={{ mt: 2 }}>
             <div>
               Location: {selectedPlaceProperties && selectedPlaceProperties.location}
             </div>
             <div>
               Coordinates: {selectedPlaceProperties && selectedPlaceProperties.coordinates}
             </div>
             <div>
               Degrees: {selectedPlaceProperties && selectedPlaceProperties.degrees}
             </div>
           </Typography>
    </Box>
 )
  return (
    <Box ref={anchorElRef} style={{ display: 'none', position: 'absolute' }}>
      <Popover
        id="popover"
        open={open}
        onClose={handleClose}
        anchorEl={anchorElRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {locationProperties}
      </Popover>
    </Box>
  );
};

export default PopoverComponent;
