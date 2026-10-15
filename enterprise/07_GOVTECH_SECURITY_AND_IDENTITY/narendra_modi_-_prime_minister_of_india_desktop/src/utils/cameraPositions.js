import * as THREE from 'three';
import { timelineData } from './timelineData';

export const getDefaultCameraPosition = (hasPopup = false) => {
  const xOffset = hasPopup ? 6 : 0;
  return {
    position: [-25 + xOffset, 14, 42],
    target: [0 + xOffset, 2, 0],
    fov: 46
  };
};

export const getCameraPositionForMarker = (marker, hasPopup = false) => {
  if (!marker) return getDefaultCameraPosition(hasPopup);

  // When popup is open on the right, shift target slightly to the right so
  // the model is positioned in the open left-center zone of the viewport
  const offsetDistance = hasPopup ? 5.5 : 0;

  return {
    position: [
      marker.cameraPosition?.x ?? marker.position.x,
      marker.cameraPosition?.y ?? (marker.position.y + 9),
      marker.cameraPosition?.z ?? (marker.position.z + 24)
    ],
    target: [
      marker.position.x + offsetDistance,
      marker.position.y + 1.8,
      marker.position.z
    ],
    fov: 44
  };
};

export const cameraPresets = {
  overview: {
    position: [25, 45, 110],
    target: [25, 5, 0],
    fov: 55
  },
  modelCloseUp: (modelPos) => ({
    position: [modelPos.x - 4, modelPos.y + 3, modelPos.z + 10],
    target: [modelPos.x, modelPos.y + 2, modelPos.z],
    fov: 38
  }),
  cinematicSide: (modelPos) => ({
    position: [modelPos.x + 12, modelPos.y + 6, modelPos.z + 18],
    target: [modelPos.x + 3, modelPos.y + 2, modelPos.z],
    fov: 45
  })
};

export default {
  getDefaultCameraPosition,
  getCameraPositionForMarker,
  cameraPresets
};
