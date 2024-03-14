import React, { createContext, useContext, useRef } from 'react'
import { createMap } from "../../../utils/MapUtils"

export const MapContext = createContext();

export const MapContextProvider = ({children}) => {
  const mapRef = useRef(createMap());
  return (
    <MapContext.Provider value= {mapRef.current}>
        {children}
    </MapContext.Provider>
  )
}

export const useMap = () => useContext(MapContext);