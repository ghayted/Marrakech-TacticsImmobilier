// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PropertyDetail from './pages/PropertyDetail';
import PropertyDetailUser from './pages/PropertyDetailUser';
import ReservationPage from './pages/ReservationPage';
import ProtectedRoute from './components/ProtectedRoute';
import ClientHome from './pages/ClientHome';
import BiensList from './pages/BiensList';
import MesReservations from './pages/MesReservations';
import HiddenAdminAccess from './components/HiddenAdminAccess';

function PropertyDetailUserWrapper() {
  const { id } = useParams();
  return <PropertyDetailUser bienId={id} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientHome />} />
        <Route path="/biens" element={<BiensList />} />
        
        {/* Route publique pour les détails de propriétés - accessible sans authentification */}
        <Route path="/property/:id" element={<PropertyDetailUserWrapper />} />
        
        {/* Route pour la réservation - accessible sans authentification */}
        <Route path="/reservation/:id" element={<ReservationPage />} />
        
        {/* Page Mes Réservations - accessible sans authentification */}
        <Route path="/mes-reservations" element={<MesReservations />} />
        
        {/* Routes d'authentification */}
        <Route path="/admin-secret" element={<HiddenAdminAccess />} />
        <Route path="/admin/login" element={<LoginPage />} />
        
        {/* Routes admin protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Si tu veux garder la page admin detail, mets-la sur une autre URL */}
          {/* <Route path="property/:id" element={<PropertyDetail />} /> */}
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;