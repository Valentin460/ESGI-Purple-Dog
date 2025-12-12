# 🐕💜 Purple Dog - Marketplace d'Objets de Valeur

> **Hackathon ESGI 2025** - Plateforme d'enchères et de vente d'objets de collection

## 📋 Table des matières

- [👥 Équipe](#-équipe)
- [🎯 Présentation](#-présentation)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🐳 Docker](#-docker)
- [📦 Technologies](#-technologies)
- [🌐 Déploiement](#-déploiement)
- [🙏 Remerciements](#-remerciements)

## 👥 Équipe

**Développeurs Purple Dog - Promotion 2025**

| Nom | Année | GitHub |
|-----|-------|--------|
| **Arthur VALENTIM** | 5ème année | [@Arthur VALENTIM](#) |
| **Vu Quang Anh DOAN** | 5ème année | [@Vu Quang Anh DOAN](#) |
| **Fatoumata DIABY** | 5ème année | [@Fatoumata Diaby](#) |
| **Zakaria MAARIFI** | 4ème année | [@Zakaria Maarifi](#) |
| **Adama DIAWARA** | 4ème année | [@Adama DIAWARA](#) |

---

## 🎯 Présentation

**Purple Dog** est une marketplace moderne dédiée aux objets de valeur et aux enchères en ligne. Développée dans le cadre du Hackathon ESGI 2025, la plateforme permet aux utilisateurs de vendre, acheter et enchérir sur des objets de collection, antiquités et objets de luxe.

### Vision du projet

Créer une plateforme sécurisée et intuitive où collectionneurs et amateurs peuvent échanger des objets de valeur dans un environnement de confiance, avec un système d'enchères en temps réel et des paiements sécurisés.

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité

- ✅ **Inscription** avec vérification par email (Nodemailer)
- ✅ **Connexion sécurisée** avec JWT Token
- ✅ **Hachage des mots de passe** avec Bcrypt
- ✅ **Tokens d'accès et de rafraîchissement**
- ✅ **Protection des routes** avec middleware d'authentification

### 💳 Paiement

- ✅ **Intégration Stripe** complète (backend)
- ✅ **Payment Intents** pour les transactions sécurisées
- ✅ **Gestion des commissions** (3% par transaction)
- 🚧 Intégration frontend en cours

### 📧 Système de Mailing

- ✅ **Email de vérification** avec lien cliquable
- 🚧 **Email de bienvenue** après inscription
- ✅ **Newsletter** pour communiquer avec les utilisateurs
- ✅ **Templates HTML responsives** et professionnels

### 🎨 Interface Utilisateur

- ✅ **Homepage** moderne avec carrousel
- ✅ **Header & Footer** responsive
- ✅ **Pages d'authentification** (Login/Signup)
- ✅ **Dashboard Admin** pour la gestion
- ✅ **Page Catalogue/Recherche** d'objets
- ✅ **Page Profil** utilisateur
- ✅ **Page Produit** avec détails
- ✅ **Page Avis** clients
- ✅ **Pages légales** (CGU, CGV, Politique de confidentialité)

### 🔨 Enchères (en développement)

- 🚧 Système d'enchères en temps réel
- 🚧 Notifications en direct des surenchères
- 🚧 Historique des enchères
- 🚧 Routages des pages entre l'une et l'autre

## 🚀 Installation

### Prérequis

- **Node.js** 22+ ([Télécharger](https://nodejs.org/))
- **Docker** et **Docker Compose** ([Installer](https://www.docker.com/))
- **Git** ([Installer](https://git-scm.com/))

### Cloner le projet

https://github.com/Valentin460/ESGI-Purple-Dog

## ⚙️ Configuration

### Les Variables d'environnement (dans le discord !)

## 🐳 Docker

### Lancer le projet avec Docker

```bash
# 1. Construire et démarrer les conteneurs
docker-compose up -d

# 2. Attendre que tout soit prêt

# 3. Exécuter les migrations Prisma
docker exec -it purple_dog_backend npm run prisma:migrate

# OU entrer dans le conteneur :
docker exec -it purple_dog_backend sh
npm run prisma:migrate
exit

# 4. Vérifier que tout fonctionne
docker-compose ps
```

### Accéder aux services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5137 | Interface utilisateur Vue.js |
| **Backend** | http://localhost:3000 | API Node.js |
| **PostgreSQL** | localhost:5442 | Base de données |
| **pgAdmin** | http://localhost:5050 | Interface de gestion PostgreSQL |

#### Connexion pgAdmin

- **Email** : `admin@purpledog.com`
- **Mot de passe** : `admin`

### Commandes Docker utiles

```bash
# Voir les logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes (⚠️ efface la DB)
docker-compose down -v

# Rebuild après modifications
docker-compose up -d --build

# Entrer dans un conteneur
docker exec -it purple_dog_backend sh
docker exec -it purple_dog_frontend sh
```

---

## 📦 Technologies

### Backend

| Technologie | Version | Description |
|-------------|---------|-------------|
| **Node.js** | 25+ | Runtime JavaScript |
| **Express.js** | 4.x | Framework web |
| **Prisma** | 5.x | ORM moderne |
| **PostgreSQL** | 16 | Base de données relationnelle |
| **JWT** | 9.x | Authentification token |
| **Bcrypt** | 5.x | Hachage de mots de passe |
| **Stripe** | 14.x | Paiements en ligne |
| **Nodemailer** | 6.x | Envoi d'emails |

### Frontend

| Technologie | Version | Description |
|-------------|---------|-------------|
| **Vue.js** | 3.x | Framework JavaScript progressif |
| **Vue Router** | 4.x | Gestion des routes |
| **Axios** | 1.x | Client HTTP |
| **Tailwind CSS** | 3.x | Framework CSS utility-first |

### DevOps

| Technologie | Description |
|-------------|-------------|
| **Docker** | Conteneurisation |
| **Docker Compose** | Orchestration multi-conteneurs |
| **GitHub Actions** | CI/CD (à venir) |
| **OVH VPS** | Hébergement en production |

---

## 🌐 Déploiement

### VPS OVH

Un serveur de production est en ligne sur OVH :

- **État** : 🟡 En cours de configuration
- **URL** : `https://purpledog.fr`
- **Issues** : Problèmes Git en cours de résolution

## 🧪 Tests

### Tester l'authentification

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123",
    "user_type": "individual"
  }'

# 2. Vérifier l'email (cliquer sur le lien reçu)

# 3. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123"
  }'
```

### Tester Stripe

```bash
# Créer un Payment Intent
curl -X POST http://localhost:3000/api/stripe/payment-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "amount": 10000,
    "itemId": 1,
    "itemType": "auction"
  }'
```

---

## 🐛 Debugging

### Problèmes courants

#### 1. Erreur "Cannot find module"

```bash
# Solution : Réinstaller les dépendances
cd back
npm install
cd ../front
npm install
```

#### 2. PostgreSQL n'est pas prêt

```bash
# Attendre quelques secondes puis relancer les migrations
sleep 10
docker exec -it purple_dog_backend npm run prisma:migrate
```

#### 3. Ports déjà utilisés

```bash
# Vérifier les ports occupés
lsof -i :3000
lsof -i :8080

# Changer les ports dans docker-compose.yml
```

#### 4. Erreur Prisma "Client not generated"

```bash
docker exec -it purple_dog_backend npx prisma generate
docker-compose restart backend
```

## 🙏 Remerciements

- **ESGI** pour l'organisation du hackathon
- Amin Nairi & Les clients qui nous ont guidés
