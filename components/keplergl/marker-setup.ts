"use client";

import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fix Leaflet's default icon
L.Marker.prototype.options.icon = DefaultIcon;

export { DefaultIcon };
