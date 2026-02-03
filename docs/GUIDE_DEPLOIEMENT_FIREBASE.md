# Guide de Deploiement Firebase - Boukilibre

## Introduction

Ce guide vous explique comment deployer Boukilibre sur Firebase Hosting avec les Cloud Functions pour le backend.

---

## 1. Prerequis

### Installer les outils necessaires

```bash
# Installer Node.js (si pas deja fait)
# Telechargez depuis https://nodejs.org

# Verifier l'installation
node --version
npm --version

# Installer Firebase CLI
npm install -g firebase-tools

# Verifier l'installation
firebase --version
```

---

## 2. Configurer Firebase

### Etape 1 : Creer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Cliquez sur **"Ajouter un projet"**
3. Nom du projet : `boukilibre`
4. Desactivez Google Analytics (ou activez si vous voulez)
5. Cliquez sur **"Creer le projet"**

### Etape 2 : Se connecter a Firebase

```bash
# Se connecter
firebase login

# Verifier la connexion
firebase projects:list
```

### Etape 3 : Initialiser Firebase dans le projet

```bash
cd Boukilibre

# Initialiser Firebase
firebase init
```

Selectionnez :
- [x] **Hosting** : Configure files for Firebase Hosting
- [x] **Functions** : Configure Cloud Functions

Configuration Hosting :
- Public directory : `.` (racine du projet)
- Single-page app : `No`
- Automatic builds with GitHub : `No`

Configuration Functions :
- Language : `JavaScript`
- ESLint : `Yes`
- Install dependencies : `Yes`

---

## 3. Structure du projet pour Firebase

```
Boukilibre/
├── .firebaserc              # Configuration projet Firebase
├── firebase.json            # Configuration deploiement
├── index.html
├── catalog.html
├── ...
├── css/
├── js/
├── images/
├── functions/               # Backend (Cloud Functions)
│   ├── index.js
│   ├── package.json
│   └── ...
└── docs/
```

---

## 4. Configurer firebase.json

Modifiez le fichier `firebase.json` :

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "functions/**",
      "docs/**",
      "*.md"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(css|js)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  }
}
```

---

## 5. Configurer les Cloud Functions

### Etape 1 : Creer le dossier functions

```bash
mkdir functions
cd functions
npm init -y
```

### Etape 2 : Installer les dependances

```bash
npm install firebase-functions firebase-admin express cors mongoose stripe nodemailer
```

### Etape 3 : Creer functions/index.js

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

admin.initializeApp();
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = functions.config().mongodb?.uri || process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));
}

// Import routes
const ebooksRoutes = require('./routes/ebooks');
const ordersRoutes = require('./routes/orders');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');

app.use('/ebooks', ebooksRoutes);
app.use('/orders', ordersRoutes);
app.use('/newsletter', newsletterRoutes);
app.use('/contact', contactRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Boukilibre API running on Firebase' });
});

// Export as Firebase Function
exports.api = functions.https.onRequest(app);
```

### Etape 4 : Configurer les variables d'environnement

```bash
# Configurer MongoDB URI
firebase functions:config:set mongodb.uri="votre-uri-mongodb"

# Configurer Stripe
firebase functions:config:set stripe.secret="sk_live_xxx"

# Configurer Email
firebase functions:config:set email.host="smtp.gmail.com" email.user="votre@email.com" email.pass="votre-password"

# Verifier la configuration
firebase functions:config:get
```

---

## 6. Deployer le site

### Deployer uniquement l'hosting (frontend)

```bash
firebase deploy --only hosting
```

### Deployer uniquement les functions (backend)

```bash
firebase deploy --only functions
```

### Deployer tout

```bash
firebase deploy
```

### URL du site deploye
Apres deploiement, votre site sera accessible a :
- `https://boukilibre.web.app`
- `https://boukilibre.firebaseapp.com`

---

## 7. Connecter votre domaine personnalise

### Etape 1 : Ajouter le domaine

1. Dans Firebase Console, allez dans **Hosting**
2. Cliquez sur **"Ajouter un domaine personnalise"**
3. Entrez : `boukilibre.com`

### Etape 2 : Configurer les DNS

Ajoutez ces enregistrements chez votre registrar (GoDaddy, Namecheap, etc.) :

| Type | Nom | Valeur |
|------|-----|--------|
| A | @ | 151.101.1.195 |
| A | @ | 151.101.65.195 |
| CNAME | www | boukilibre.web.app |

### Etape 3 : Attendre la verification

- La verification SSL peut prendre jusqu'a 24h
- Firebase generera automatiquement un certificat SSL

---

## 8. CI/CD avec GitHub Actions

### Creer .github/workflows/firebase-deploy.yml

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          npm install
          cd functions && npm install

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: boukilibre
```

### Configurer le secret Firebase

1. Dans Firebase Console, allez dans **Parametres du projet** > **Comptes de service**
2. Cliquez sur **"Generer une nouvelle cle privee"**
3. Dans GitHub, allez dans **Settings** > **Secrets** > **Actions**
4. Ajoutez un secret `FIREBASE_SERVICE_ACCOUNT` avec le contenu du fichier JSON

---

## 9. Commandes utiles

```bash
# Voir les logs des functions
firebase functions:log

# Emulateur local (test avant deploiement)
firebase emulators:start

# Voir l'etat du deploiement
firebase hosting:channel:list

# Rollback vers une version precedente
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL TARGET_SITE_ID:live
```

---

## 10. Surveillance et Debug

### Firebase Console

1. **Hosting** : Voir les metriques de trafic
2. **Functions** : Voir les logs et erreurs
3. **Performance** : Analyser les temps de chargement

### Alertes

Configurez des alertes pour :
- Erreurs de fonction > 10/minute
- Temps de reponse > 5 secondes
- Quota depasse

---

## 11. Couts estimes

### Plan Spark (Gratuit) :
- 10 GB de stockage hosting
- 360 MB/jour de bande passante
- 125K invocations functions/mois
- 40K GB-secondes functions

### Plan Blaze (Pay as you go) :
Necessaire si vous depassez les limites gratuites
- Hosting : $0.026/GB
- Functions : $0.0000025/invocation

Pour Boukilibre avec ~1000 visiteurs/mois, le plan gratuit devrait suffire.

---

## Support

- Documentation Firebase : [firebase.google.com/docs](https://firebase.google.com/docs)
- Support : [firebase.google.com/support](https://firebase.google.com/support)
- Email Boukilibre : support@boukilibre.com
