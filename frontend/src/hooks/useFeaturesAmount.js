const useFeaturesAmount = (layers, geometry) => {
  console.log(layers);
      const counter = new Array(layers.length).fill(0)
      const type = geometry.getType();
      if (type === "Polygon") {
        layers.forEach((layer,index) =>
        layer.getSource().forEachFeature(function(feature){
          const coordinates = feature.getGeometry().getCoordinates()
          if(geometry.intersectsCoordinate(coordinates)) {
              counter[index] += 1;
          }
        })
        );
      }
      return counter
  }

export default useFeaturesAmount