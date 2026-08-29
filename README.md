# Boukilibre - Ebooks, Applications & Outils Premium

Plateforme e-commerce premium pour la vente d'ebooks, d'applications et d'outils numeriques.

**Site web :** [boukilibre.com](https://boukilibre.com)

---

## Fonctionnalites

- **Design Premium** : Interface moderne avec palette bleu/rose/gris elegant
- **Catalogue multi-produits** : Ebooks, applications et outils, avec filtres par type/categorie, recherche, tri
- **Panier d'Achat** : Systeme de panier avec localStorage
- **Paiements Multiples** : Stripe, PayPal, Moov Money
- **Livraison Automatique** : Envoi d'emails avec liens de telechargement (30 jours)
- **Newsletter** : Inscription avec emails de bienvenue
- **Blog** : Articles educatifs et inspirants
- **Dashboard Admin** : Ajout/edition/suppression de produits avec upload de fichiers (image de couverture + fichier du produit), gestion des commandes et de la newsletter
- **100% Responsive** : Design mobile-first adaptatif

---

## Demarrage Rapide

### Prerequis

- Node.js (v18 ou superieur)
- npm ou yarn
- Compte MongoDB Atlas (gratuit)
- Compte Vercel avec un Blob store (pour l'upload de fichiers en production)

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
├── admin/                  # Dashboard administrateur (CRUD produits, commandes, newsletter)
│   ├── index.html
│   ├── admin.css
│   └── admin.js
│
├── models/                 # Modeles MongoDB
│   ├── Ebook.js            # Produit (type: ebook / application / outil)
│   ├── Order.js
│   └── Subscriber.js
│
├── routes/                 # Routes API (montees sous /api par app.js)
│   ├── ebooks.js           # Catalogue + upload fichiers (admin)
│   ├── orders.js
│   ├── newsletter.js
│   ├── contact.js
│   ├── admin.js            # Login admin (JWT)
│   └── download.js         # Telechargement securise post-achat
│
├── middleware/
│   └── auth.js             # Verification du token admin (JWT)
│
├── lib/
│   ├── db.js                # Connexion MongoDB mise en cache (serverless-safe)
│   └── blob.js               # Upload de fichiers vers Vercel Blob
│
├── docs/                   # Documentation
│   ├── GUIDE_MONGODB_ATLAS.md
│   ├── GUIDE_SEO.md
│   ├── GUIDE_ADMINISTRATION.md
│   └── GUIDE_PAIEMENTS.md
│
├── api/
│   └── index.js             # Point d'entree serverless Vercel (exporte app.js)
├── app.js                   # Application Express partagee (local + Vercel)
├── server.js                # Lance app.js avec app.listen (dev local uniquement)
├── vercel.json               # Configuration du routage Vercel
├── package.json            # Dependances
├── sitemap.xml             # Plan du site pour SEO
├── robots.txt              # Instructions pour les moteurs de recherche
└── .env                    # Variables d'environnement (jamais commite, voir .env.example)
```

---

## Documentation

| Guide | Description |
|-------|-------------|
| [Guide MongoDB Atlas](docs/GUIDE_MONGODB_ATLAS.md) | Configuration de la base de donnees |
| [Guide SEO](docs/GUIDE_SEO.md) | Optimisation pour les moteurs de recherche |
| [Guide Deploiement Vercel](docs/GUIDE_DEPLOIEMENT_VERCEL.md) | Deployer le site et l'API sur Vercel |
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

# Vercel Blob (upload de l'image de couverture et du fichier produit)
BLOB_READ_WRITE_TOKEN=xxx
```

Voir [.env.example](.env.example) pour la liste complete. **Ne jamais commiter `.env`.**

---

## Scripts disponibles

```bash
# Demarrer en developpement (avec hot reload)
npm run dev

# Demarrer en production (local)
npm start

# Deployer sur Vercel
vercel --prod
```

---

## Administration

Acces au dashboard admin : `https://boukilibre.com/admin/`

**Identifiants :** definis par `ADMIN_EMAIL` / `ADMIN_PASSWORD` dans les variables d'environnement (aucun identifiant par defaut cote code).

**Fonctionnalites :**
- Vue d'ensemble des ventes
- Gestion des produits (ebooks, applications, outils) : ajout, edition, suppression, upload de l'image de couverture et du fichier (ou lien externe pour un fichier volumineux)
- Suivi des commandes
- Gestion de la newsletter
- Messages de contact

---

## Deploiement (Vercel)

Le site (statique) et l'API (fonction serverless Node dans `api/index.js`) sont deployes ensemble sur Vercel.

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Deployer
vercel --prod
```

Avant le premier deploiement :
1. Creer un cluster MongoDB Atlas et copier `MONGODB_URI`.
2. Dans le dashboard Vercel du projet, onglet **Storage**, creer un **Blob store** puis le connecter au projet (genere automatiquement `BLOB_READ_WRITE_TOKEN`).
3. Renseigner toutes les variables de `.env.example` dans **Settings > Environment Variables** sur Vercel.

Voir le [Guide Deploiement Vercel](docs/GUIDE_DEPLOIEMENT_VERCEL.md) pour le detail pas a pas.

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
