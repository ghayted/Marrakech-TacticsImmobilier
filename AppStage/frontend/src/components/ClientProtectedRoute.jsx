// src/components/ClientProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ClientProtectedRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Si les données sont en cours de chargement, afficher un indicateur de chargement
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si pas de token, on redirige vers la page de connexion client
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si l'utilisateur est un admin, on le redirige vers le dashboard admin
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Si un token existe et que l'utilisateur est un client, on affiche la page demandée
  return <Outlet />;
};

export default ClientProtectedRoute;