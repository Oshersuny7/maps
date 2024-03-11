import React, { useEffect, useRef, useState } from "react";
import Draw from "ol/interaction/Draw.js";
import { unByKey } from "ol/Observable.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import DrawLayer from "./utils/LayersName";

const DrawComponent = ({ map, geometryType, incrementCounter }) => { 
  const drawLayerRef = useRef(null);
  const drawInteractionRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  

  useEffect(() => {
    if (!map || !geometryType) return;
  
    if (geometryType === "None") {
      if (drawInteractionRef.current) {
        map.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }
      changeCursor("default");
      return;
    }
  
    if (!drawLayerRef.current) {
      drawLayerRef.current = new VectorLayer({
        name: DrawLayer,
        source: new VectorSource(),
      });
      map.addLayer(drawLayerRef.current);
    }
  
    if (drawInteractionRef.current) {
      map.removeInteraction(drawInteractionRef.current);
    }
  
    drawInteractionRef.current = new Draw({
      source: drawLayerRef.current.getSource(),
      type: geometryType,
    });
  
    map.addInteraction(drawInteractionRef.current);
  
    const drawStartKey = drawInteractionRef.current.on("drawstart", () => {
      setDrawing(true);
      changeCursor();
    });
  
    const drawEndKey = drawInteractionRef.current.on("drawend", () => {
      setDrawing(false);
      changeCursor();
      incrementCounter(); 
    });
  
    return () => {
      unByKey(drawStartKey);
      unByKey(drawEndKey);
    };
  }, [map, geometryType, incrementCounter]); 

  const changeCursor = (cursorType = "crosshair") => {
    const mapElement = map.getTargetElement();
    mapElement.style.cursor = cursorType;
  };

  return <></>;
};

export default DrawComponent;
