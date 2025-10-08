# 🔐 Sécurisation de l'Accès Administrateur

## Vue d'ensemble

Le système d'accès administrateur a été sécurisé avec plusieurs couches de protection pour empêcher l'accès non autorisé à l'interface d'administration.

## 🔒 Niveaux de Sécurité Implémentés

### 1. **Protection Frontend (React)**
- **Routes protégées** : Toutes les routes `/admin/*` sont maintenant protégées par le composant `ProtectedRoute`
- **Authentification requise** : Redirection automatique vers `/admin/login` si aucun token n'est présent
- **Accès caché** : URL secrète `/admin-secret` avec code d'accès

### 2. **Protection Backend (ASP.NET Core)**
- **Authentification JWT** : Middleware d'authentification configuré dans `Program.cs`
- **Autorisation requise** : Attribut `[Authorize]` sur les contrôleurs sensibles
- **Validation des tokens** : Vérification automatique de la validité des tokens JWT

### 3. **Accès Discret**
- **Lien caché** : Triple-clic sur la page d'accueil pour révéler le lien admin
- **Code secret** : Code d'accès requis pour accéder à l'interface admin
- **URL non évidente** : `/admin-secret` au lieu de `/admin` direct

## 🚀 Comment Accéder à l'Interface Admin

### Méthode 1: Accès Direct (Recommandé)
1. Aller sur `http://localhost:3000/admin-secret`
2. Entrer le code secret : `admin2024`
3. Saisir les identifiants admin (par défaut : `admin` / `admin123`)

### Méthode 2: Accès via la Page d'Accueil
1. Aller sur `http://localhost:3000/`
2. Faire un triple-clic en bas à droite de la page
3. Cliquer sur le lien "🔐 Admin" qui apparaît
4. Entrer le code secret : `admin2024`
5. Saisir les identifiants admin

## ⚙️ Configuration

### Code Secret Admin
Le code secret est défini dans `frontend/src/components/HiddenAdminAccess.jsx` :
```javascript
const ADMIN_SECRET_CODE = 'admin2024'; // Changez ce code selon vos besoins
```

### Identifiants Admin par Défaut
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin123`

⚠️ **Important** : Changez ces identifiants en production !

### Clé JWT
La clé JWT est définie dans `appsettings.json` :
```json
{
  "Jwt": {
    "Key": "votre_super_cle_secrete_personnelle_doit_etre_longue"
  }
}
```

## 🛡️ Contrôleurs Protégés

Les contrôleurs suivants sont maintenant protégés par l'authentification JWT :
- `PaiementsController` - Gestion des paiements
- `DashboardController` - Tableau de bord admin
- `ReservationsController` - Gestion des réservations
- Et tous les autres contrôleurs sensibles

## 🔧 Personnalisation

### Changer le Code Secret
1. Modifiez la constante `ADMIN_SECRET_CODE` dans `HiddenAdminAccess.jsx`
2. Redémarrez l'application frontend

### Changer les Identifiants Admin
1. Connectez-vous à la base de données
2. Modifiez l'utilisateur admin dans la table `Utilisateurs`
3. Ou utilisez l'interface admin pour créer un nouvel utilisateur

### Ajouter d'Autres Contrôleurs à la Protection
Ajoutez l'attribut `[Authorize]` au contrôleur :
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // Protection par authentification JWT
public class MonController : ControllerBase
{
    // ...
}
```

## 📝 Notes de Sécurité

1. **En Production** :
   - Changez la clé JWT pour une clé forte et unique
   - Utilisez HTTPS pour toutes les communications
   - Changez les identifiants admin par défaut
   - Activez les logs de sécurité

2. **Monitoring** :
   - Surveillez les tentatives de connexion échouées
   - Loggez les accès à l'interface admin
   - Configurez des alertes pour les accès suspects

3. **Sauvegarde** :
   - Sauvegardez régulièrement la base de données
   - Gardez une copie des clés JWT en lieu sûr

## 🆘 Dépannage

### Problème : "Unauthorized" sur les endpoints admin
**Solution** : Vérifiez que le token JWT est présent dans le localStorage et valide

### Problème : Redirection en boucle
**Solution** : Videz le localStorage et reconnectez-vous

### Problème : Code secret ne fonctionne pas
**Solution** : Vérifiez la constante `ADMIN_SECRET_CODE` dans `HiddenAdminAccess.jsx`

---

**Sécurité mise en place le** : $(date)
**Version** : 1.0
**Maintenu par** : Équipe de développement
