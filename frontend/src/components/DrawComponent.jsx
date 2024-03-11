import React, { useEffect, useRef, useState } from "react";
import Draw from "ol/interaction/Draw.js";
import { unByKey } from "ol/Observable.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import DrawLayer from "./utils/LayersName";

const DrawComponent = ({ map, geometryType, setCounterFeatures }) => {
  const drawLayerRef = useRef(null);
  const drawInteractionRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!map || !geometryType || geometryType === "None") return;

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
      setCounterFeatures((prevCounter) => prevCounter + 1);
    });

    return () => {
      unByKey(drawStartKey);
      unByKey(drawEndKey);
    };
  }, [map, geometryType, setCounterFeatures]);

  const changeCursor = () => {
    const mapElement = map.getTargetElement();
    if (drawing) {
      mapElement.style.cursor = "crosshair";
    } else {
      mapElement.style.cursor = "";
    }
  };

  return <></>;
};

export default DrawComponent;
