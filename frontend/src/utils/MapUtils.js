import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import View from "ol/View";
import { OSM } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import LayersName from "./LayersName";
import { LineString } from "ol/geom";
import Feature from "ol/Feature";
import FeatureTypes from "./FeatureTypes";

const DEFAULT_ZOOM_LEVEL = 2;
const ISRAEL_CENTER_COORDINATE = fromLonLat([31, 35]);

const defaultMapParams = {
  zoom: DEFAULT_ZOOM_LEVEL,
  center: ISRAEL_CENTER_COORDINATE,
};

export const createMap = () => {
  return new Map({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View(defaultMapParams),
  });
};

export const getLayerByName = (map, layerName) => {
  return map
    .getLayers()
    .getArray()
    .find((layer) => layer.get("name") === layerName);
};

export const clearVectorLayer = (vectorLayer) => {
  if (vectorLayer) {
    vectorLayer.getSource().clear();
  }
};

export const addFeaturesToVectorLayer = (map, layerName, features) => {
  const foundLayer = getLayerByName(map, layerName);
  
  if (foundLayer) {
    const featuresToAdd = features.filter(feature => {
      return !foundLayer.getSource().getFeatures().find(feat => feat.getId() === feature.getId())
    })
    foundLayer.getSource().addFeatures(featuresToAdd);
  }
    else {
      const newVectorLayer = new VectorLayer({
        source: new VectorSource({
          features: features
        }),
        name: layerName,
      });

      map.addLayer(newVectorLayer)
    }
};

export const createVectorLayer = (layerName) => {
  return new VectorLayer({
    name: layerName,
    source: new VectorSource(),
  });
};

export const getArrayOfVectorLayersWithoutDrawLayer = (map) => {
  return map
    .getAllLayers()
    .filter(
      (layer) =>
        layer instanceof VectorLayer &&
        layer.getProperties().name !== LayersName.layers.Draw
    );
};

export const drawLineBetweenSiteAndDevice = (map, lineString) => {
  const lineLayer = createVectorLayer(LayersName.layers.LineStringLayer);
  lineLayer.getSource().addFeature(new Feature(lineString));
  map.addLayer(lineLayer); 
  console.log("line created");
};

export const getFeatureBySiteId = (map, layerName, featureType, featureSiteId) => {
  const layer = getLayerByName(map, layerName);
  const features = layer ? layer.getSource().getFeatures() : [];

  const feature = features.find((feature) => {
    if (featureType === FeatureTypes.types.Site) {
      return feature.getId() === featureSiteId;
    } else if (featureType === FeatureTypes.types.Device) {
      return feature.getProperties().siteId === featureSiteId;
    }
    return false;
  });
  return feature;
};