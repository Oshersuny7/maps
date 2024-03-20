import { getLayerByPropertyName } from "../utils/MapUtils";
import LayersName from "../utils/LayersName";
import { useMap } from "./contexts/map/MapContext";
import { useRef } from "react";

const useFeaturesAmount = ({ polygonFeature }) => {
  const mapRef = useRef(useMap());
  const counts = {};
  for (const [layerName, layer] of Object.entries(LayersName.layers)) {
    if (layer !== LayersName.layers.Draw) {
      console.log(layer);
      const currentLayer = getLayerByPropertyName(mapRef.current, layer);
      if (currentLayer) {
        const source = currentLayer.getSource();
        let count = 0;
        source.forEachFeature((feature) => {
          const properties = feature.getProperties();
          if (
            properties &&
            properties.layer === layerName &&
            feature
              .getGeometry()
              .intersectsPolygon(polygonFeature.getGeometry())
          ) {
            count++;
          }
        });
        counts[layerName] = count;
      }
    }
  }
  return counts;
};

export default useFeaturesAmount;
