import React, { useEffect, useRef, useState } from 'react';
import Draw from 'ol/interaction/Draw.js';
import { unByKey } from 'ol/Observable.js';

const DrawComponent = ({ map, geometryType, onDeleteGeometries }) => {
  const drawInteraction = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!map || !geometryType) return;

    drawInteraction.current = new Draw({
      source: map.getLayers().item(1).getSource(),
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
    });

    return () => {
      unByKey(drawStartKey);
      unByKey(drawEndKey);
      map.removeInteraction(drawInteraction.current);
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
