import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import View from "ol/View";
import { OSM } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import LayersName from "./LayersName";

const DEFAULT_ZOOM_LEVEL = 2;
const ISRAEL_CENTER_COORDINATE = fromLonLat([31, 35]);

const defaultMapParams = {
  zoom: DEFAULT_ZOOM_LEVEL,
  center: ISRAEL_CENTER_COORDINATE,
};

const createMap = () => {
  return new Map({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View(defaultMapParams),
  });
};

const getLayerByName = (map, layerName) => {
  return map
    .getLayers()
    .getArray()
    .find((layer) => layer.get("name") === layerName);
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

const getLayerByPropertyName = (map, propertyName) => {
  console.log(map);
  return map
    .getLayers()
    .getArray()
    .find((layer) => layer.get(propertyName) === propertyName);
};

const createVectorLayer = (layerName) => {
  return new VectorLayer({
    name: layerName,
    source: new VectorSource(),
  });
};

const getArrayOfVectorLayersWithoutDrawing = (map) => {
  return map
    .getAllLayers()
    .filter(
      (layer) =>
        layer instanceof VectorLayer &&
        layer.getProperties().name !== LayersName.layers.Draw
    );
};

export {
  createMap,
  getLayerByName,
  clearVectorLayer,
  addFeaturesToVectorLayer,
  createVectorLayer,
  getLayerByPropertyName,
  getArrayOfVectorLayersWithoutDrawing
};
