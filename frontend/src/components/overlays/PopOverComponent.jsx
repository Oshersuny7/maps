import React, { useEffect, useRef, useState } from "react";
import { Box, Popover } from "@mui/material";
import { useMap } from "../../hooks/contexts/map/MapContext";
import { useDrawingInProgress } from "../../hooks/useDrawingInProgress";
import FeatureProperties from "./FeatureProperties";

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
        const feature = map.forEachFeatureAtPixel(event.pixel,(feature) => feature );
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
        <FeatureProperties selectedPlaceProperties={selectedPlaceProperties}/>
      </Popover>
      <Box
        ref={anchorElRef}
        style={{ display: "none", position: "absolute" }}
      />
    </Box>
  );
};

export default PopoverComponent;