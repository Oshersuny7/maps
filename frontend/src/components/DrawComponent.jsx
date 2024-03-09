import React, { useEffect, useRef, useState } from "react";
import Draw from "ol/interaction/Draw.js";
import { unByKey } from "ol/Observable.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import DrawLayer from "./utils/LayersName"

const DrawComponent = ({ map, geometryType }) => {
  const drawInteraction = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!map || !geometryType || geometryType === "None") return;
       const drawLayer = new VectorLayer({
        name: DrawLayer,
        source: new VectorSource()
      })

    drawInteraction.current = new Draw({
      source: drawLayer.getSource(),
      type: geometryType,
    });
    map.addLayer(drawLayer);
    map.addInteraction(drawInteraction.current);

    const drawStartKey = drawInteraction.current.on("drawstart", () => {
      setDrawing(true);
      changeCursor();
    });

    const drawEndKey = drawInteraction.current.on("drawend", () => {
      setDrawing(false);
      changeCursor();
    });

    return () => {
      unByKey(drawStartKey);
      unByKey(drawEndKey);
      map.removeInteraction(drawInteraction.current);
      map.removeLayer(drawLayer);
    };
  }, [map, geometryType]);

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
