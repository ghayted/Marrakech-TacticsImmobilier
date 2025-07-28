// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Importer useNavigate

function LoginPage() {
  const navigate = useNavigate(); // <-- Initialiser le hook
  const [username, setUsername] = useState('admin'); // Pré-rempli pour le test
  const [password, setPassword] = useState('admin123'); // Pré-rempli pour le test
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5257/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Identifiants incorrects');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);

      navigate('/admin/dashboard'); // <-- Redirection vers le tableau de bord

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Connexion Administrateur</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom d'utilisateur:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default LoginPage;