// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PropertyDetail from './pages/PropertyDetail';
import PropertyDetailUser from './pages/PropertyDetailUser';
import ProtectedRoute from './components/ProtectedRoute';
import ClientHome from './pages/ClientHome';
import BiensList from './pages/BiensList';

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
        {/* Routes admin protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Si tu veux garder la page admin detail, mets-la sur une autre URL */}
          {/* <Route path="/admin/property/:id" element={<PropertyDetail />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;