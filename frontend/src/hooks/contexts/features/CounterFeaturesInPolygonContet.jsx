import React, { createContext } from "react";
import useCounterFeaturesInPolygon from "../../useCounterFeaturesInPolygon";

export const CounterFeatureInPolygonContext = createContext();

export const CounterFeatureInPolygonContextProvider = ({ children }) => {
  const { counterFeaturesInPolygon } = useCounterFeaturesInPolygon();

  return (
    <CounterFeatureInPolygonContext.Provider
      value={{
        counterFeaturesInPolygon,
      }}
    >
      {children}
    </CounterFeatureInPolygonContext.Provider>
  );
};
