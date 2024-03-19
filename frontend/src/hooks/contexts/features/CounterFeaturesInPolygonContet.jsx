import React, { createContext } from "react";

export const CounterFeatureInPolygonContext = createContext();

export const CounterFeatureInPolygonContextProvider = ({ children }) => {
  return (
    <CounterFeatureInPolygonContext.Provider value={{}}>
      {children}
    </CounterFeatureInPolygonContext.Provider>
  );
};
