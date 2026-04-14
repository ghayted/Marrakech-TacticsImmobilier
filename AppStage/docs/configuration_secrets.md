# Configuration des secrets – Marrakech Tactics Immobilier

Ce document explique comment configurer les secrets (clés API, credentials DB, etc.) pour travailler sur ce projet **sans jamais les committer dans Git**.

---

## ⚠️ Important

Les fichiers `appsettings.json` et `appsettings.*.json` **ne doivent jamais être commités**.  
Ils sont ignorés par le `.gitignore` à la racine du dépôt.  
Un fichier modèle sans secrets est disponible : [`AppStage/backend/appsettings.example.json`](../backend/appsettings.example.json).

---

## Setup local (développement)

### Option A – Copier le template

```bash
cp AppStage/backend/appsettings.example.json AppStage/backend/appsettings.json
```

Ensuite remplissez les valeurs dans `AppStage/backend/appsettings.json` :

| Clé                                    | Description                                              |
|----------------------------------------|----------------------------------------------------------|
| `ConnectionStrings.DefaultConnection`  | Chaîne de connexion SQL Server (locale ou distante)      |
| `Jwt.Key`                              | Clé secrète JWT (min. 32 caractères, aléatoire)          |
| `Stripe.SecretKey`                     | Clé secrète Stripe (commence par `sk_test_` ou `sk_live_`) |
| `Stripe.PublishableKey`                | Clé publique Stripe (`pk_test_` ou `pk_live_`)           |
| `Smtp.User` / `Smtp.Pass`             | Adresse Gmail + App Password (2FA requis)                |
| `Gemini.ApiKey`                        | Clé API Google Gemini                                    |

### Option B – .NET User Secrets (recommandé en développement)

```bash
cd AppStage/backend
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "votre-chaine-connexion"
dotnet user-secrets set "Jwt:Key" "votre-cle-jwt-tres-longue"
dotnet user-secrets set "Stripe:SecretKey" "sk_test_..."
dotnet user-secrets set "Stripe:PublishableKey" "pk_test_..."
dotnet user-secrets set "Smtp:Pass" "votre-app-password"
dotnet user-secrets set "Gemini:ApiKey" "votre-cle-gemini"
```

Les user-secrets sont stockés hors du dépôt (dans `%APPDATA%\Microsoft\UserSecrets\` sur Windows, `~/.microsoft/usersecrets/` sur Linux/macOS).

---

## Production / CI-CD

En production (Oracle Cloud, Azure, etc.), configurez les secrets via **variables d'environnement** :

```bash
# Exemples (Linux / Docker)
export ConnectionStrings__DefaultConnection="votre-chaine"
export Jwt__Key="votre-cle-jwt"
export Stripe__SecretKey="sk_live_..."
export Stripe__PublishableKey="pk_live_..."
export Smtp__Pass="votre-pass"
export Gemini__ApiKey="votre-cle"
```

> ASP.NET Core lit automatiquement les variables d'environnement avec le double underscore `__` comme séparateur de section.

Si vous utilisez GitHub Actions ou un autre CI, stockez ces valeurs dans les **Secrets du repository** (Settings → Secrets and variables → Actions).

---

## Secrets compromis ?

Si vous pensez que des secrets ont été exposés dans l'historique Git :

1. **Révoquez immédiatement** les clés compromises sur les dashboards correspondants (Stripe, Google Cloud, SMTP).
2. Regénérez de nouvelles clés.
3. Optionnel : nettoyez l'historique Git avec [`git filter-repo`](https://github.com/newren/git-filter-repo) pour supprimer les anciens commits contenant les secrets.
