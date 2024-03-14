import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import View from 'ol/View';
import { OSM } from 'ol/source';

const DEFAULT_ZOOM_LEVEL = 2;
const ISRAEL_CENTER_COORDINATE = fromLonLat([31, 35]);

const defaultMapParams = {
    zoom: DEFAULT_ZOOM_LEVEL,
    center: ISRAEL_CENTER_COORDINATE,
    projection: 'EPSG:4326'
};

const createMap = (targetElement) => {
    return new Map({
        target: targetElement,
        layers: [
            new TileLayer({
                source: new OSM()
            })
        ],
        view: new View(defaultMapParams),
        controls: []
    });
};

export {createMap};
