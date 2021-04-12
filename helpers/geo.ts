import * as Location from 'expo-location';
import geohash from 'ngeohash';
import GeoPoint from 'geopoint';

type Location = { lat: number; lon: number };

export function calculateDistance(x: Location, y: Location) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(y.lat - x.lat); // deg2rad below
  const dLon = deg2rad(y.lon - x.lon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(x.lat)) * Math.cos(deg2rad(y.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

export function isWithinBoundary(hash: string, location: Location, distance: number) {
  const decoded = geohash.decode(hash);
  return (
    calculateDistance(
      { lat: decoded.latitude, lon: decoded.longitude },
      { lat: location.lat, lon: location.lon }
    ) < distance
  );
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export async function getLatLong() {
  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  } catch (e) {
    throw e;
  }
}

export function formatDistance(distance: number, t) {
  if (distance < 1) {
    return `${Math.floor(distance * 1000)} ${t('COMMON:DISTANCE.M')}`;
  }
  return `${distance.toFixed(2)} ${t('COMMON:DISTANCE.KM')}`;
}

export const getGeohashRange = (latitude: number, longitude: number, distance: number) => {
  const geopoint = new GeoPoint(latitude, longitude);
  const bounds = geopoint.boundingCoordinates(distance, null, true);

  const lower = geohash.encode(bounds[0]._degLat, bounds[0]._degLon);
  const upper = geohash.encode(bounds[1]._degLat, bounds[1]._degLon);

  return {
    lower,
    upper,
  };
};

export const isLocationEmpty = (location: { latitude?: number; longitude?: number }) => {
  return !location || (location.latitude === 0 && location.longitude === 0);
};

export const isLessThanKm = (km: number) => (curr: Location, comp: Location) => {
  return calculateDistance(curr, comp) < km;
};
