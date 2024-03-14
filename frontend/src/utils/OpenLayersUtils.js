import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

const getLayerByName = (map, layerName) => {
  return map.getLayers().getArray().find(layer => layer.get('name') === layerName);
};

const clearVectorLayer = (vectorLayer) => {
  if (vectorLayer) {
    vectorLayer.getSource().clear();
  }
};

const addFeaturesToVectorLayer = (vectorLayer, features) => {
  if (vectorLayer && features) {
    const source = vectorLayer.getSource();
    if (source) {
      source.addFeatures(features);
    }
  }
};

const createVectorLayer = (layerName) => {
  return new VectorLayer({
    name: layerName ,
    source: new VectorSource(),
  });
};

export { getLayerByName, clearVectorLayer, addFeaturesToVectorLayer, createVectorLayer };
