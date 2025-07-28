import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import './LocationMap.css'; 
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Correction du marqueur Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationMap = ({ latitude, longitude }) => {
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return null; // Ne rien afficher si les coordonnées sont invalides
  }

  return (
    <section className="map-section-wrapper">
      <h2 className="map-section-title">Localisation du bien</h2>
      <div className="map-container-wrapper">
        <MapContainer center={[latitude, longitude]} zoom={15} style={{ height: 400, width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} />
        </MapContainer>
      </div>
    </section>
  );
};

export default LocationMap;