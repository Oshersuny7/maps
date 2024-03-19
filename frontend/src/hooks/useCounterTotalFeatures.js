import { useContext } from "react";
import { CounterTotalFeatureContext } from "./contexts/features/CounterTotalFeaturesContext";

export const useCounterTotalFeatures = () => {
  const { counterFeatures, incrementCounter, resetCounter } = useContext(CounterTotalFeatureContext);
  return{counterFeatures, incrementCounter, resetCounter};
};

