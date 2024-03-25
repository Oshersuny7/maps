import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Popover, Button } from "@mui/material";
import { useMap } from "../../hooks/contexts/map/MapContext";
import { useDrawingInProgress } from "../../hooks/useDrawingInProgress";

const PopoverComponent = ({ drawing }) => {
  const map = useMap();
  const { drawingInProgress } = useDrawingInProgress();
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlaceProperties, setSelectedPlaceProperties] = useState(null);
  const anchorElRef = useRef(null);

  useEffect(() => {
    if (!map) return;
    const handlePopOver = (event) => {
      if (!drawingInProgress && !drawing) {
        const feature = map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => feature
        );
        if (feature) {
          const properties = feature.getProperties();
          anchorElRef.current.style.left = event.pixel[0] + "px";
          anchorElRef.current.style.top = event.pixel[1] + "px";
          anchorElRef.current.style.display = "block";
          setSelectedPlaceProperties(properties);
          setOpenModal(true);
        }
      }
    };
    map.on("click", handlePopOver);
    return () => {
      map.un("click", handlePopOver);
    };
  }, [map, drawingInProgress, drawing]);

  const handleCloseModal = () => {
    setOpenModal(false);
    anchorElRef.current.style.display = "none";
  };
  const locationProperties = (
    <Box sx={{ bgcolor: "gray" }}>
      <Box>
        <Typography
          sx={{ display: "flex", justifyContent: "center", color: "white" }}
          variant="h6"
          component="h2"
        >
          Location Properties
        </Typography>
        <Button variant="contained" color="secondary" sx={{ width: "100%" }}>
          Show relatives
        </Button>
      </Box>
      <Typography variant="body1" component="div" sx={{ mt: 1 }}>
        <Box sx={{ color: "white" }}>
          Id:{" "} {selectedPlaceProperties && selectedPlaceProperties.id}
        </Box>
        <Box sx={{ color: "white" }}>
          Layer:{" "} {selectedPlaceProperties && selectedPlaceProperties.name}
        </Box>
        <Box sx={{ color: "white" }}>
          Location:{" "}
          {selectedPlaceProperties && selectedPlaceProperties.location}
        </Box>
        <Box sx={{ color: "white" }}>
          Coordinates:{" "}
          {selectedPlaceProperties && selectedPlaceProperties.coordinates}
        </Box>
        <Box sx={{ color: "white" }}>
          Degrees:{" "}{selectedPlaceProperties && selectedPlaceProperties.degrees}
        </Box>
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Popover
        id="popover"
        open={openModal}
        onClose={handleCloseModal}
        anchorEl={anchorElRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        {locationProperties}
      </Popover>
      <Box
        ref={anchorElRef}
        style={{ display: "none", position: "absolute" }}
      />
    </Box>
  );
};
export default PopoverComponent;
