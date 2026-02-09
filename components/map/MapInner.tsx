"use client";

import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Fix Leaflet default icon issue
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapInnerProps {
  universities: any[];
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapInner({ universities }: MapInnerProps) {
  const router = useRouter();

  const markers = universities.filter(
    (uni) => uni.latitude !== null && uni.longitude !== null && uni.is_active,
  );

  const defaultCenter: [number, number] = [42.278, -83.7382]; // Ann Arbor
  const center: [number, number] =
    markers.length > 0
      ? [markers[0].latitude!, markers[0].longitude!]
      : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={5}
      className="h-full w-full rounded-lg outline-none z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} />
      {markers.map((uni) => (
        <Marker
          key={uni.id}
          position={[uni.latitude!, uni.longitude!]}
          icon={icon}
          eventHandlers={{
            click: () => router.push(`/university-feed/${uni.id}`),
          }}
        >
          <Tooltip direction="top" offset={[0, -40]} opacity={1}>
            <div className="text-sm font-semibold">{uni.name}</div>
            <div className="text-xs text-gray-500">{uni.abbreviation}</div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
