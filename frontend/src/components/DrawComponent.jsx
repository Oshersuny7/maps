import React, { useEffect, useRef, useState } from 'react';
import Draw from 'ol/interaction/Draw.js';
import { unByKey } from 'ol/Observable.js';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

const DrawComponent = ({ map, geometryType, onDeleteGeometries }) => {
  const drawInteraction = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!map || !geometryType) return;

    const drawLayer = new VectorLayer({
      name: 'drawLayer',
      source: new VectorSource()
    })

    drawInteraction.current = new Draw({
      source: drawLayer.getSource(),
      type: geometryType,
    });

    map.addInteraction(drawInteraction.current);

    const drawStartKey = drawInteraction.current.on('drawstart', () => {
      setDrawing(true);
      changeCursor();
    });

    const drawEndKey = drawInteraction.current.on('drawend', () => {
      setDrawing(false);
      changeCursor();
      map.addLayer(drawLayer);
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
      mapElement.style.cursor = '';
    }
  };


  return null;
};

export default DrawComponent;
