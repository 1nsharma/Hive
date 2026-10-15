// Geo Fuzzing & Validation Helpers for Pet Privacy Protection

export function fuzzCoords(lat: number, lng: number, decimals = 3) {
  const f = Math.pow(10, decimals); // 3 decimals ≈ ~110m radius fuzz for location privacy
  return {
    lat: Math.round(lat * f) / f,
    lng: Math.round(lng * f) / f,
  };
}

export function isValidLatLng(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
