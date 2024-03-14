import { useState, useEffect } from 'react';
import { unByKey } from 'ol/Observable';

const useCounterFeaturesInPolygon = (map, drawLayer) => {
    const [counterFeaturesInPolygon, setCounterFeaturesInPolygon] = useState(0);

    useEffect(() => {
        if (!map || !drawLayer) return;

        const handleFeaturesInPolygon = () => {
            const featuresInDrawLayer = drawLayer.getSource().getFeatures();
            const polygonFeature = featuresInDrawLayer[featuresInDrawLayer.length - 1]; 

            console.log("Polygon Feature:", polygonFeature);

            if (polygonFeature && polygonFeature.getGeometry().getType() === 'Polygon') {
                const polygonGeometry = polygonFeature.getGeometry();
                let count = 0;

                featuresInDrawLayer.forEach((feature) => {
                    const featureGeometry = feature.getGeometry();

                    console.log("Feature Geometry:", featureGeometry);

                    if (featureGeometry && polygonGeometry.intersects(featureGeometry,)) {
                        count++;
                    }
                });

                console.log("Counter of features inside the polygon:", count);
                setCounterFeaturesInPolygon(count);
            } else {
                setCounterFeaturesInPolygon(0); 
            }
        };

        const listenerKey = drawLayer.getSource().on('addfeature', handleFeaturesInPolygon);

        return () => {
            unByKey(listenerKey);
        };
    }, [map, drawLayer]);

    return { counterFeaturesInPolygon };
};
export default useCounterFeaturesInPolygon;
