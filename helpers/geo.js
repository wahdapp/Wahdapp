import * as Location from 'expo-location';
import geohash from 'ngeohash';

export function calculateDistance(x, y) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(y.lat - x.lat);  // deg2rad below
  const dLon = deg2rad(y.lon - x.lon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(x.lat)) * Math.cos(deg2rad(y.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

export async function getLatLong() {
  try {
    const position = await Location.getCurrentPositionAsync({});
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  }
  catch (e) {
    throw e;
  }
}

export function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.floor(distance * 1000)} m`;
  }
  return `${distance.toFixed(2)} km`;
}

export const getGeohashRange = (
  latitude,
  longitude,
  distance, // km
) => {
  const lat = 0.009009009009; // degrees latitude per km
  const lon = 0.01129943502; // degrees longitude per km

  const lowerLat = latitude - lat * distance;
  const lowerLon = longitude - lon * distance;

  const upperLat = latitude + lat * distance;
  const upperLon = longitude + lon * distance;

  const lower = geohash.encode(lowerLat, lowerLon);
  const upper = geohash.encode(upperLat, upperLon);

  return {
    lower,
    upper
  };
};