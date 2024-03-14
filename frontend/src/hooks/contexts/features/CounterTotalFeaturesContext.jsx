import React, { createContext } from "react";
import { useCounterTotalFeatures } from "../../useCounterTotalFeatures";

export const CounterTotalFeatureContext = createContext();

export const CounterTotalFeatureContextProvider = ({ children }) => {

  const { counterFeatures, incrementCounter, resetCounter } = useCounterTotalFeatures();

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
