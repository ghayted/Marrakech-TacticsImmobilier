import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Si les données sont en cours de chargement, afficher un indicateur de chargement
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si pas authentifié, rediriger vers la page de connexion admin
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si authentifié, afficher la page demandée
  return <Outlet />;
};

export default ProtectedRoute;