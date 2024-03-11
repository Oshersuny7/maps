import { useState } from "react";

export const useCounterFeatures = () => {
  const [counterFeatures, setCounterFeatures] = useState(0);

  const incrementCounter = () => {
    setCounterFeatures((prevCounter) => prevCounter + 1);
  };

  const resetCounter = () => {
    setCounterFeatures(0);
  };

  return { counterFeatures, incrementCounter, resetCounter };
};
