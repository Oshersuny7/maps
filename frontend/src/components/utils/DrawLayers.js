import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
export const drawLayer = new VectorLayer({
    name: 'drawLayer',
    source: new VectorSource()
  })