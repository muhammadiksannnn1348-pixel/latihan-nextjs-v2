"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';

// dynamically load map components only on client to avoid SSR window reference
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);


export default function PenangananMapPage() {
    const [userLocation, setUserLocation] = useState< [number, number] | null>(null);
    const [loading, setLoading] = useState(false);

    // configure leaflet icons once on client
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const L = require('leaflet');
            // @ts-ignore
            delete (L.Icon.Default as any).prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        }
    }, []);

    // Fungsi untuk mendapatkan lokasi user
    const getUserLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setLoading(false);
                },
                (error) => {
                    alert("Error mendapatkan lokasi : " + error.message);
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation tidak didukung oleh browser ini.");
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Peta Sederhana</h1>

                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <button
                        onClick={getUserLocation}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Mendapatkan Lokasi..." : "Dapatkan Lokasi Saya"}
                    </button>

                    {userLocation && (
                        <p className="mt-2 text-gray-600">
                            Lokasi Anda : Latitude {userLocation[0].toFixed(4)}, Longitude {userLocation[1].toFixed(4)}
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <MapContainer
                        center={[-6.2088, 106.8456]}
                        zoom={5}
                        style={{height:"500px", width:"100%"}}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />

                        {userLocation && (
                            <Marker position={userLocation}>
                                <Popup>
                                    Lokasi Anda
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}