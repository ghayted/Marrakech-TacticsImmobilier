import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationMap.css'; 
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Composant pour forcer la mise à jour de la carte
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

// Correction du marqueur Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationMap = ({ latitude, longitude }) => {
  console.log('LocationMap props:', { latitude, longitude });

  // Convertir les coordonnées en nombres
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  console.log('Coordonnées converties:', { lat, lng });

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    console.log('Coordonnées invalides, map non affichée');
    return null;
  }

  return (
    <section className="map-section-wrapper">
      <h2 className="map-section-title">Localisation du bien</h2>
      <div className="map-container-wrapper">
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer 
            center={[lat, lng]} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            dragging={true}
            touchZoom={true}
            doubleClickZoom={true}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker 
              position={[lat, lng]}
              title="Emplacement du bien"
            />
            <MapUpdater center={[lat, lng]} />
        </MapContainer>
      </div>
      </div>
    </section>
  );
};

export default LocationMap;