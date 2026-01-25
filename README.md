# Boukilibre - Site Web Premium d'Ebooks

Site web e-commerce premium pour la vente d'ebooks de développement personnel, entrepreneuriat et études.

## 🚀 Fonctionnalités

- **Design Premium** : Interface moderne avec palette bleu/rose/gris élégant
- **Catalogue d'Ebooks** : Filtres par catégorie, recherche, tri
- **Panier d'Achat** : Système de panier avec localStorage
- **Paiements Multiples** : Stripe, PayPal, Moov Money, Mixx by Yas
- **Livraison Automatique** : Envoi d'emails avec liens de téléchargement
- **Newsletter** : Inscription avec emails de bienvenue
- **Pages Complètes** : Accueil, Catalogue, FAQ, À propos, Contact
- **Responsive** : Design mobile-first adaptatif

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- Compte Gmail (pour l'envoi d'emails)
- Clés API Stripe (optionnel pour les paiements)

## ⚙️ Installation

1. **Cloner le projet** (si applicable)
   ```bash
   cd c:\Users\Clement AGBALENYO\Documents\GitHub\Boukilibre
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   
   Créer un fichier `.env` à la racine du projet :
   ```bash
   cp .env.example .env
   ```
   
   Remplir les variables dans `.env` :
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/boukilibre
   EMAIL_USER=votre-email@gmail.com
   EMAIL_PASSWORD=votre-mot-de-passe-app
   STRIPE_SECRET_KEY=sk_test_votre_cle
   SITE_URL=http://localhost:3000
   ```

4. **Démarrer MongoDB** (si local)
   ```bash
   mongod
   ```

5. **Lancer le serveur**
   ```bash
   npm run dev
   ```

6. **Accéder au site**
   ```
   http://localhost:3000
   ```

## 📁 Structure du Projet

```
Boukilibre/
├── public/                 # Fichiers statiques frontend
│   ├── css/               # Feuilles de style
│   ├── js/                # Scripts JavaScript
│   ├── images/            # Images et assets
│   ├── index.html         # Page d'accueil
│   ├── catalog.html       # Page catalogue
│   ├── faq.html           # Page FAQ
│   ├── about.html         # Page à propos
│   └── contact.html       # Page contact
├── models/                # Modèles MongoDB
│   ├── Ebook.js
│   ├── Order.js
│   └── Subscriber.js
├── routes/                # Routes API
│   ├── ebooks.js
│   ├── orders.js
│   ├── newsletter.js
│   └── contact.js
├── services/              # Services métier
│   ├── emailService.js
│   └── paymentService.js
├── server.js              # Serveur Express
├── package.json
└── .env.example
```

## 🔧 Configuration Gmail

Pour l'envoi d'emails via Gmail :

1. Activer la validation en 2 étapes sur votre compte Google
2. Générer un mot de passe d'application :
   - Aller dans Paramètres Google > Sécurité
   - Mots de passe d'application
   - Créer un nouveau mot de passe pour "Mail"
3. Utiliser ce mot de passe dans `EMAIL_PASSWORD`

## 💳 Configuration Stripe

1. Créer un compte sur [Stripe](https://stripe.com)
2. Récupérer les clés de test dans le Dashboard
3. Ajouter les clés dans `.env`
4. Configurer les webhooks pour `/api/orders/stripe-webhook`

## 📝 Ajouter des Ebooks

Utiliser l'API POST `/api/ebooks` avec un outil comme Postman :

```json
{
  "title": "Titre de l'Ebook",
  "description": "Description complète",
  "category": "entrepreneuriat",
  "price": 2000,
  "coverImage": "/images/ebook-cover.jpg",
  "pdfFile": "/files/ebook.pdf",
  "benefits": ["Bénéfice 1", "Bénéfice 2"],
  "features": ["Fonctionnalité 1", "Fonctionnalité 2"],
  "badge": "Nouveau"
}
```

## 🧪 Tests

Pour tester le site :

1. **Frontend** : Ouvrir http://localhost:3000
2. **API** : Tester les endpoints avec Postman
3. **Paiement** : Utiliser les cartes de test Stripe
   - Carte valide : `4242 4242 4242 4242`
   - Date : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres

## 🚀 Déploiement

### Variables d'environnement en production

- Mettre `NODE_ENV=production`
- Utiliser MongoDB Atlas pour la base de données
- Configurer un service SMTP professionnel
- Utiliser les vraies clés Stripe en production

### Hébergement recommandé

- **Backend** : Heroku, Railway, Render
- **Base de données** : MongoDB Atlas
- **Fichiers statiques** : Vercel, Netlify

## 📧 Support

Pour toute question : support@boukilibre.com

## 📄 Licence

ISC © 2026 Boukilibre
