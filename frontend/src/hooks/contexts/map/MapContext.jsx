import React, { createContext, useContext } from 'react'

export const MapContext = createContext();

export const MapContextProvider = ({children, map}) => {
  return (
    <MapContext.Provider value={map}>
        {children}
    </MapContext.Provider>
  )
}

export const useMap = () => useContext(MapContext);