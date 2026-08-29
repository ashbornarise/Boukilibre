# Guide de Deploiement - Vercel

Boukilibre est deploye entierement sur Vercel : le site statique (HTML/CSS/JS a la racine) et l'API Node (`api/index.js`, qui expose l'app Express de `app.js`) tournent sur la meme plateforme.

## 1. Prerequis

- Un compte [Vercel](https://vercel.com) (gratuit pour demarrer)
- Un cluster [MongoDB Atlas](https://www.mongodb.com/atlas) gratuit (voir [GUIDE_MONGODB_ATLAS.md](GUIDE_MONGODB_ATLAS.md))
- Le repo Boukilibre pousse sur GitHub

## 2. Importer le projet sur Vercel

1. Sur [vercel.com/new](https://vercel.com/new), importer le repo GitHub `Boukilibre`.
2. Vercel detecte automatiquement le projet (pas de framework particulier) : laisser les reglages par defaut (aucun build command necessaire, le site est statique).

## 3. Creer le Blob store (upload de fichiers)

Le dashboard admin uploade les images de couverture et les fichiers produits (PDF, ZIP...) via **Vercel Blob**, car les fonctions serverless n'ont pas de disque persistant.

1. Dans le projet Vercel, onglet **Storage** > **Create Database** > **Blob**.
2. Une fois cree, le connecter au projet : Vercel ajoute automatiquement la variable `BLOB_READ_WRITE_TOKEN`.

## 4. Variables d'environnement

Dans **Settings > Environment Variables**, ajouter toutes les variables de [.env.example](../.env.example), notamment :

| Variable | Description |
|---|---|
| `MONGODB_URI` | Chaine de connexion MongoDB Atlas |
| `SITE_URL` | URL publique du site (ex: `https://boukilibre.com`), utilisee pour generer les liens de telechargement dans les emails |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Identifiants du dashboard admin |
| `JWT_SECRET` | Chaine aleatoire longue pour signer les tokens admin |
| `EMAIL_USER` / `EMAIL_PASSWORD` | Compte Gmail avec un **mot de passe d'application** (pas le mot de passe du compte) |
| `STRIPE_SECRET_KEY` / autres cles paiement | Selon les moyens de paiement actives |
| `BLOB_READ_WRITE_TOKEN` | Ajoutee automatiquement a l'etape 3 |

## 5. Deployer

```bash
npm install -g vercel
vercel login
vercel --prod
```

Ou simplement pousser sur la branche connectee (`master`) : Vercel redeploiera automatiquement a chaque push.

## 6. Domaine personnalise

Dans **Settings > Domains**, ajouter `boukilibre.com` et suivre les instructions DNS de Vercel (enregistrement `A` ou `CNAME` selon le registrar). Le fichier `CNAME` utilise par GitHub Pages n'est plus necessaire une fois la bascule faite sur Vercel.

## 7. Verification post-deploiement

- `GET https://votre-domaine/api/health` doit repondre `{"status":"OK", ...}`.
- Se connecter sur `/admin/` avec les identifiants configures et ajouter un produit test (avec une image) pour verifier l'upload.
- Passer une commande test (mode paiement test) et verifier la reception de l'email avec le lien de telechargement.
