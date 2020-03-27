export default function calculateDistance(x, y) {
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