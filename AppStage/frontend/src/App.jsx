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
        {/* Route utilisateur pour les détails */}
        <Route path="/property/:id" element={<PropertyDetailUserWrapper />} />
        {/* Route pour la réservation */}
        <Route path="/reservation/:id" element={<ReservationPage />} />
        {/* Page Mes Réservations */}
        <Route path="/mes-reservations" element={<MesReservations />} />
        {/* Routes admin protégées */}
        <Route path="/admin-secret" element={<HiddenAdminAccess />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Si tu veux garder la page admin detail, mets-la sur une autre URL */}
          {/* <Route path="property/:id" element={<PropertyDetail />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;