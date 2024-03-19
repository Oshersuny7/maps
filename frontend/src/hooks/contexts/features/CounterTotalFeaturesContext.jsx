import React, { createContext, useState } from "react";

export const CounterTotalFeatureContext = createContext();

export const CounterTotalFeatureContextProvider = ({ children }) => {

  const [counterFeatures, setCounterFeatures] = useState(0);

  const incrementCounter = () => {
    setCounterFeatures((prevCounter) => prevCounter + 1);
  };
  
  const resetCounter = () => {
    setCounterFeatures(0);
  };

  return (
    <CounterTotalFeatureContext.Provider
      value={{
        counterFeatures,
        incrementCounter,
        resetCounter,
      }}
    >
      {children}
    </CounterTotalFeatureContext.Provider>
  );
};
