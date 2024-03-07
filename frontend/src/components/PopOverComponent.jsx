import React from 'react';
import { Box, Typography, Button, Popover } from '@mui/material';

const PopoverComponent = ({ open, handleClose, selectedPlaceProperties, anchorElRef }) => {
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
        <Box>
          <Typography variant="h6" component="h2">
            Location Properties
          </Typography>
          <Typography variant="body1" component="Box" sx={{ mt: 2 }}>
            <Box>
              Location: {selectedPlaceProperties && selectedPlaceProperties.location}
            </Box>
            <Box>
              Coordinates: {selectedPlaceProperties && selectedPlaceProperties.coordinates}
            </Box>
            <Box>
              Degrees: {selectedPlaceProperties && selectedPlaceProperties.degrees}
            </Box>
          </Typography>

          <Button onClick={handleClose} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default PopoverComponent;
