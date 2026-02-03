# Guide Backend MongoDB Atlas - Boukilibre

## Introduction

Ce guide vous explique comment configurer et gerer votre base de donnees MongoDB Atlas pour Boukilibre.

---

## 1. Creer un compte MongoDB Atlas

### Etape 1 : Inscription
1. Allez sur [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Cliquez sur **"Try Free"**
3. Creez un compte avec votre email ou connectez-vous avec Google

### Etape 2 : Creer un Cluster (Base de donnees)
1. Apres connexion, cliquez sur **"Build a Database"**
2. Choisissez **"M0 FREE"** (gratuit, 512MB)
3. Selectionnez une region proche de vos utilisateurs :
   - **Pour l'Afrique francophone** : `AWS Paris (eu-west-3)` ou `AWS Frankfurt (eu-central-1)`
4. Donnez un nom a votre cluster : `boukilibre-cluster`
5. Cliquez sur **"Create"**

### Etape 3 : Configurer l'acces
1. **Creer un utilisateur base de donnees** :
   - Username : `boukilibre_admin`
   - Password : (generez un mot de passe fort)
   - Cliquez sur **"Create User"**

2. **Configurer l'acces reseau** :
   - Cliquez sur **"Add IP Address"**
   - Pour le developpement : Cliquez sur **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Pour la production : Ajoutez uniquement l'IP de votre serveur Firebase

### Etape 4 : Obtenir la chaine de connexion
1. Cliquez sur **"Connect"** sur votre cluster
2. Choisissez **"Connect your application"**
3. Selectionnez **"Node.js"** version **"4.1 or later"**
4. Copiez la chaine de connexion :
   ```
   mongodb+srv://boukilibre_admin:<password>@boukilibre-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Remplacez `<password>` par votre mot de passe

---

## 2. Configurer votre projet Boukilibre

### Etape 1 : Fichier .env
Creez ou modifiez le fichier `.env` a la racine du projet :

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://boukilibre_admin:VOTRE_MOT_DE_PASSE@boukilibre-cluster.xxxxx.mongodb.net/boukilibre?retryWrites=true&w=majority

# Serveur
PORT=3000
NODE_ENV=development

# Email (pour les notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application

# Stripe (paiement carte)
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxx

# PayPal
PAYPAL_CLIENT_ID=votre-client-id
PAYPAL_CLIENT_SECRET=votre-client-secret

# Admin
ADMIN_EMAIL=admin@boukilibre.com
ADMIN_PASSWORD=votre-mot-de-passe-admin
JWT_SECRET=votre-secret-jwt-tres-long-et-securise
```

### Etape 2 : Tester la connexion
```bash
npm run dev
```

Vous devriez voir :
```
MongoDB connected successfully
Boukilibre server running on port 3000
```

---

## 3. Structure de la Base de Donnees

### Collection : `ebooks`
```javascript
{
  _id: ObjectId,
  title: String,           // "Guide de l'Entrepreneur"
  slug: String,            // "guide-entrepreneur"
  description: String,
  price: Number,           // 2000 (en FCFA)
  category: String,        // "entrepreneuriat" | "productivite" | "developpement"
  image: String,           // URL de l'image
  file: String,            // URL du fichier PDF
  features: [String],      // Liste des caracteristiques
  learnings: [String],     // Ce que vous allez apprendre
  badge: String,           // "Nouveau" | "Populaire" | "Bestseller"
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection : `orders`
```javascript
{
  _id: ObjectId,
  orderNumber: String,     // "BKL-2026-001"
  customer: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  items: [{
    ebookId: ObjectId,
    title: String,
    price: Number
  }],
  total: Number,
  paymentMethod: String,   // "stripe" | "paypal" | "moov"
  paymentStatus: String,   // "pending" | "completed" | "failed"
  downloadLinks: [{
    ebookId: ObjectId,
    url: String,
    expiresAt: Date
  }],
  createdAt: Date
}
```

### Collection : `subscribers`
```javascript
{
  _id: ObjectId,
  email: String,
  isActive: Boolean,
  subscribedAt: Date,
  unsubscribedAt: Date
}
```

### Collection : `users` (Admin)
```javascript
{
  _id: ObjectId,
  email: String,
  password: String,        // Hash bcrypt
  role: String,            // "admin" | "editor"
  lastLogin: Date,
  createdAt: Date
}
```

---

## 4. Commandes utiles MongoDB

### Via MongoDB Compass (interface graphique)
1. Telechargez [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Collez votre chaine de connexion
3. Explorez vos donnees visuellement

### Via le shell MongoDB
```bash
# Connexion
mongosh "mongodb+srv://boukilibre-cluster.xxxxx.mongodb.net/boukilibre" --username boukilibre_admin

# Lister les collections
show collections

# Voir tous les ebooks
db.ebooks.find()

# Voir toutes les commandes
db.orders.find()

# Compter les abonnes newsletter
db.subscribers.countDocuments({ isActive: true })
```

---

## 5. Sauvegardes

### Sauvegardes automatiques (Atlas)
- Les clusters M0 (gratuits) n'ont pas de backup automatique
- Passez a M2+ pour des backups automatiques

### Sauvegarde manuelle
```bash
# Exporter toute la base
mongodump --uri="votre-uri-mongodb" --out=./backup

# Restaurer
mongorestore --uri="votre-uri-mongodb" ./backup
```

---

## 6. Surveillance et Alertes

### Dans MongoDB Atlas :
1. Allez dans **"Alerts"**
2. Configurez des alertes pour :
   - Utilisation CPU > 80%
   - Espace disque > 80%
   - Connexions > 90% du maximum

### Metriques a surveiller :
- Operations/seconde
- Temps de reponse moyen
- Nombre de connexions actives

---

## 7. Securite

### Bonnes pratiques :
1. **Ne jamais** commiter le fichier `.env` (ajoutez-le dans `.gitignore`)
2. Utilisez des mots de passe forts (minimum 16 caracteres)
3. Limitez les IP autorisees en production
4. Activez l'authentification a deux facteurs sur votre compte Atlas

### Verifier la securite :
1. Dans Atlas, allez dans **"Security"** > **"Database Access"**
2. Assurez-vous que chaque utilisateur a le minimum de privileges necessaires

---

## Support

Pour toute question :
- Documentation MongoDB : [docs.mongodb.com](https://docs.mongodb.com)
- Support Atlas : [support.mongodb.com](https://support.mongodb.com)
- Email Boukilibre : support@boukilibre.com
