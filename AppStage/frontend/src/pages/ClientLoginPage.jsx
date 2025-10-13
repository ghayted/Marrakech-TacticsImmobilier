// src/pages/ClientLoginPage.jsx
import { useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';

function ClientLoginPage() {
  // This component will use the same LoginPage but with client-specific styling
  // For now, we'll just use the same component since we've made it dynamic
  return <LoginPage />;
}

export default ClientLoginPage;