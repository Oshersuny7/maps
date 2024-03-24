import { useContext } from "react";
import { DrawingInProgressContext } from "./contexts/features/DrawingInProgress";

export const useDrawingInProgress = () => {
  const { drawingInProgress, setDrawingInProgress } = useContext( DrawingInProgressContext );
  return { drawingInProgress, setDrawingInProgress };
};
