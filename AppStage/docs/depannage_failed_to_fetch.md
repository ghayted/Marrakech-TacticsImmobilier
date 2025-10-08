# 🔧 Dépannage - Erreur "Failed to fetch"

## 🚨 **Problème Identifié**

L'erreur "Failed to fetch" indique que le frontend ne peut pas communiquer avec le backend.

## 🔍 **Causes Possibles**

### **1. Backend Non Démarré**
- Le serveur backend n'est pas en cours d'exécution
- Le backend s'est arrêté ou a planté

### **2. Port Incorrect**
- Backend configuré sur un port différent
- Frontend essaie de se connecter au mauvais port

### **3. CORS Non Configuré**
- Problème de politique CORS
- Frontend bloqué par le navigateur

### **4. URL Incorrecte**
- URL du backend incorrecte dans le frontend

---

## ✅ **Solutions par Ordre de Priorité**

### **Solution 1 : Démarrer le Backend**

#### **Étape 1 : Vérifier si le backend tourne**
```bash
# Ouvrir un terminal dans le dossier backend
cd backend

# Démarrer le serveur
dotnet run
```

#### **Étape 2 : Vérifier que le serveur démarre correctement**
Vous devriez voir :
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5257
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

#### **Étape 3 : Tester l'API directement**
Ouvrez votre navigateur et allez sur :
```
http://localhost:5257/swagger
```

Si vous voyez l'interface Swagger, le backend fonctionne !

### **Solution 2 : Vérifier la Configuration des Ports**

#### **Backend (Program.cs)**
Le backend est configuré pour écouter sur :
```csharp
builder.WebHost.UseUrls("http://0.0.0.0:5257");
```

#### **Frontend (LoginPage.jsx)**
Le frontend essaie de se connecter à :
```javascript
const response = await fetch('http://localhost:5257/api/Auth/login', {
```

**✅ Cette configuration est correcte !**

### **Solution 3 : Vérifier CORS**

Le CORS est configuré dans `Program.cs` :
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
```

**✅ Cette configuration devrait permettre toutes les connexions !**

---

## 🚀 **Procédure de Dépannage Complète**

### **Étape 1 : Démarrer le Backend**
```bash
# Terminal 1 - Backend
cd backend
dotnet run
```

### **Étape 2 : Démarrer le Frontend**
```bash
# Terminal 2 - Frontend
cd frontend
npm start
```

### **Étape 3 : Tester la Connexion**
1. Ouvrir `http://localhost:3000/admin-secret`
2. Entrer le code : `admin2024`
3. Tenter de se connecter avec `admin` / `admin123`

### **Étape 4 : Vérifier la Console du Navigateur**
1. Ouvrir les outils de développement (F12)
2. Aller dans l'onglet "Console"
3. Voir les erreurs détaillées

### **Étape 5 : Vérifier l'Onglet Network**
1. Dans les outils de développement
2. Onglet "Network"
3. Tenter la connexion
4. Voir si la requête apparaît et son statut

---

## 🔧 **Solutions Avancées**

### **Si le Backend ne Démarre Pas**

#### **Vérifier les Dépendances**
```bash
cd backend
dotnet restore
dotnet build
```

#### **Vérifier la Base de Données**
```bash
# Vérifier que SQL Server fonctionne
# Vérifier la chaîne de connexion dans appsettings.json
```

#### **Vérifier les Ports**
```bash
# Voir quels ports sont utilisés
netstat -an | findstr :5257
```

### **Si CORS Pose Problème**

#### **Modifier Program.cs**
```csharp
// Remplacer la politique CORS par :
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
```

### **Si l'URL est Incorrecte**

#### **Vérifier dans LoginPage.jsx**
```javascript
// Assurez-vous que l'URL est correcte :
const response = await fetch('http://localhost:5257/api/Auth/login', {
```

---

## 📋 **Checklist de Vérification**

- [ ] Backend démarré (`dotnet run` dans le dossier backend)
- [ ] Backend accessible sur `http://localhost:5257/swagger`
- [ ] Frontend démarré (`npm start` dans le dossier frontend)
- [ ] Frontend accessible sur `http://localhost:3000`
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Requête API visible dans l'onglet Network
- [ ] Base de données SQL Server accessible
- [ ] Port 5257 libre et accessible

---

## 🆘 **En Cas d'Échec**

### **Solution de Dernier Recours**

#### **1. Redémarrer Tout**
```bash
# Arrêter tous les processus
# Ctrl+C dans les terminaux

# Redémarrer le backend
cd backend
dotnet run

# Dans un autre terminal, redémarrer le frontend
cd frontend
npm start
```

#### **2. Vérifier les Logs**
```bash
# Backend - regarder les logs dans le terminal
# Frontend - regarder les logs dans le terminal et la console du navigateur
```

#### **3. Tester avec Postman**
```
POST http://localhost:5257/api/Auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

---

## 📞 **Informations de Debug**

### **URLs à Tester**
- Backend Swagger : `http://localhost:5257/swagger`
- Frontend : `http://localhost:3000`
- Accès Admin : `http://localhost:3000/admin-secret`

### **Ports Utilisés**
- Backend : `5257`
- Frontend : `3000`

### **Identifiants Admin**
- Utilisateur : `admin`
- Mot de passe : `admin123`
- Code secret : `admin2024`

---

**Guide créé le** : $(date)
**Version** : 1.0
**Pour** : Résolution de l'erreur "Failed to fetch"
