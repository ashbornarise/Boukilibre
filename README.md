# Boukilibre - Boutique Premium d'Ebooks

Plateforme e-commerce premium pour la vente d'ebooks de developpement personnel, entrepreneuriat et etudes.

**Site web :** [boukilibre.com](https://boukilibre.com)

---

## Fonctionnalites

- **Design Premium** : Interface moderne avec palette bleu/rose/gris elegant
- **Catalogue d'Ebooks** : Filtres par categorie, recherche, tri
- **Panier d'Achat** : Systeme de panier avec localStorage
- **Paiements Multiples** : Stripe, PayPal, Moov Money
- **Livraison Automatique** : Envoi d'emails avec liens de telechargement
- **Newsletter** : Inscription avec emails de bienvenue
- **Blog** : Articles educatifs et inspirants
- **Dashboard Admin** : Gestion complete du site
- **100% Responsive** : Design mobile-first adaptatif

---

## Demarrage Rapide

### Prerequis

- Node.js (v18 ou superieur)
- npm ou yarn
- Compte MongoDB Atlas (gratuit)

### Installation

```bash
# Cloner le projet
git clone https://github.com/votre-repo/Boukilibre.git
cd Boukilibre

# Installer les dependances
npm install

# Copier le fichier de configuration
cp .env.example .env

# Demarrer en mode developpement
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

---

## Structure du Projet

```
Boukilibre/
├── index.html              # Page d'accueil
├── catalog.html            # Catalogue des ebooks
├── product.html            # Page produit
├── blog.html               # Blog
├── about.html              # A propos
├── faq.html                # Questions frequentes
├── contact.html            # Contact
├── checkout.html           # Page de paiement
│
├── css/                    # Feuilles de style
│   ├── styles.css          # Styles globaux
│   ├── home.css            # Styles page accueil
│   ├── catalog.css         # Styles catalogue
│   ├── product.css         # Styles page produit
│   ├── blog.css            # Styles blog
│   └── ...
│
├── js/                     # Scripts JavaScript
│   ├── main.js             # Navigation et fonctions globales
│   ├── cart.js             # Systeme de panier
│   ├── catalog.js          # Filtres et recherche
│   ├── checkout.js         # Processus de paiement
│   └── ...
│
├── images/                 # Images et assets
│   ├── logo.png            # Logo du site
│   ├── ebook-1.jpg         # Couvertures des ebooks
│   └── ...
│
├── admin/                  # Dashboard administrateur
│   ├── index.html
│   ├── admin.css
│   └── admin.js
│
├── models/                 # Modeles MongoDB
│   ├── Ebook.js
│   ├── Order.js
│   └── Subscriber.js
│
├── routes/                 # Routes API
│   ├── ebooks.js
│   ├── orders.js
│   ├── newsletter.js
│   └── contact.js
│
├── docs/                   # Documentation
│   ├── GUIDE_MONGODB_ATLAS.md
│   ├── GUIDE_SEO.md
│   ├── GUIDE_DEPLOIEMENT_FIREBASE.md
│   ├── GUIDE_ADMINISTRATION.md
│   └── GUIDE_PAIEMENTS.md
│
├── server.js               # Serveur Express
├── package.json            # Dependances
├── sitemap.xml             # Plan du site pour SEO
├── robots.txt              # Instructions pour les moteurs de recherche
└── .env                    # Variables d'environnement (non commite)
```

---

## Documentation

| Guide | Description |
|-------|-------------|
| [Guide MongoDB Atlas](docs/GUIDE_MONGODB_ATLAS.md) | Configuration de la base de donnees |
| [Guide SEO](docs/GUIDE_SEO.md) | Optimisation pour les moteurs de recherche |
| [Guide Deploiement Firebase](docs/GUIDE_DEPLOIEMENT_FIREBASE.md) | Deployer sur Firebase Hosting |
| [Guide Administration](docs/GUIDE_ADMINISTRATION.md) | Utiliser le dashboard admin |
| [Guide Paiements](docs/GUIDE_PAIEMENTS.md) | Configurer Stripe, PayPal, Moov Money |

---

## Configuration

### Variables d'environnement (.env)

```env
# Serveur
PORT=3000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/boukilibre

# Paiements
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
MOOV_MERCHANT_ID=xxx
MOOV_API_KEY=xxx

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contact@boukilibre.com
EMAIL_PASS=xxx

# Admin
ADMIN_EMAIL=admin@boukilibre.com
ADMIN_PASSWORD=xxx
JWT_SECRET=xxx
```

---

## Scripts disponibles

```bash
# Demarrer en developpement (avec hot reload)
npm run dev

# Demarrer en production
npm start

# Deployer sur Firebase
firebase deploy
```

---

## Administration

Acces au dashboard admin : `https://boukilibre.com/admin/`

**Identifiants par defaut :**
- Email : `admin@boukilibre.com`
- Mot de passe : Configure dans `.env`

**Fonctionnalites :**
- Vue d'ensemble des ventes
- Gestion des ebooks
- Suivi des commandes
- Gestion de la newsletter
- Messages de contact
- Parametres du site

---

## Deploiement

### Option 1 : Firebase (Recommande)

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser
firebase init

# Deployer
firebase deploy
```

Voir le [Guide Deploiement Firebase](docs/GUIDE_DEPLOIEMENT_FIREBASE.md) pour plus de details.

### Option 2 : Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Deployer
vercel
```

---

## SEO

Le site est optimise pour le referencement avec :
- Meta tags sur toutes les pages
- Open Graph pour les reseaux sociaux
- Sitemap.xml
- Robots.txt
- URLs propres
- Contenu structure avec H1, H2, H3

Voir le [Guide SEO](docs/GUIDE_SEO.md) pour plus de details.

---

## Technologies

- **Frontend** : HTML5, CSS3, JavaScript vanilla
- **Backend** : Node.js, Express.js
- **Base de donnees** : MongoDB (Atlas)
- **Paiements** : Stripe, PayPal, Moov Money
- **Hebergement** : Firebase Hosting
- **Emails** : Nodemailer

---

## Support

- **Email** : support@boukilibre.com
- **Site** : [boukilibre.com/contact](https://boukilibre.com/contact.html)

---

## Licence

ISC © 2026 Boukilibre
