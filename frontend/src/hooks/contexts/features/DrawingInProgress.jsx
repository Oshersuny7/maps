import React, { createContext, useState } from "react";

export const DrawingInProgressContext = createContext();

export const DrawingInProgressContextProvider = ({ children }) => {

  const [drawingInProgress, setDrawingInProgress] = useState(false);

  return (
    <DrawingInProgressContext.Provider 
    value={{
        drawingInProgress,
        setDrawingInProgress
    }}>
      {children}
    </DrawingInProgressContext.Provider>
  );
};
