// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');

  // Si pas de token, on redirige vers la page de connexion
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si un token existe, on affiche la page demandée (qui sera un enfant de cette route)
  return <Outlet />;
};

export default ProtectedRoute; // <-- C'est cette ligne qui manquait probablement