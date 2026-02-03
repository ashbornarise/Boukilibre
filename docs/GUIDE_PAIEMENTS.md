# Guide Configuration des Paiements - Boukilibre

## Introduction

Ce guide vous explique comment configurer les 3 methodes de paiement pour recevoir les paiements directement sur vos comptes.

---

## 1. Stripe (Cartes Bancaires : Visa, Mastercard)

### Etape 1 : Creer un compte Stripe

1. Allez sur [https://stripe.com](https://stripe.com)
2. Cliquez sur **"Start now"**
3. Creez votre compte avec votre email

### Etape 2 : Configurer votre compte business

1. Dans le Dashboard, allez dans **"Settings"** > **"Business settings"**
2. Remplissez :
   - Nom de l'entreprise : **Boukilibre**
   - Type d'activite : **E-commerce / Produits numeriques**
   - Site web : **https://boukilibre.com**
3. Ajoutez vos informations bancaires pour recevoir les virements

### Etape 3 : Obtenir les cles API

1. Allez dans **"Developers"** > **"API keys"**
2. Vous verrez :
   - **Publishable key** : `pk_live_xxxx` (pour le frontend)
   - **Secret key** : `sk_live_xxxx` (pour le backend)

### Etape 4 : Configurer dans Boukilibre

Ajoutez dans votre fichier `.env` :

```env
STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete
```

### Frais Stripe :
- **2.9% + 0.30 EUR** par transaction
- Virements sur votre compte bancaire sous 2-7 jours

### Exemple : Vente de 2000 FCFA (≈3 EUR)
- Frais Stripe : ~0.39 EUR
- Vous recevez : ~2.61 EUR

---

## 2. PayPal

### Etape 1 : Creer un compte PayPal Business

1. Allez sur [https://www.paypal.com/business](https://www.paypal.com/business)
2. Cliquez sur **"S'inscrire"**
3. Choisissez **"Compte Business"**
4. Remplissez vos informations :
   - Nom de l'entreprise : **Boukilibre**
   - Email professionnel
   - Informations bancaires

### Etape 2 : Configurer l'API

1. Connectez-vous a [developer.paypal.com](https://developer.paypal.com)
2. Allez dans **"Dashboard"** > **"Apps & Credentials"**
3. Cliquez sur **"Create App"**
4. Nom de l'app : **Boukilibre Store**
5. Notez :
   - **Client ID**
   - **Client Secret**

### Etape 3 : Passer en mode Live

1. Dans le dashboard, passez de **"Sandbox"** a **"Live"**
2. Copiez les credentials Live

### Etape 4 : Configurer dans Boukilibre

Ajoutez dans votre fichier `.env` :

```env
PAYPAL_CLIENT_ID=votre_client_id_live
PAYPAL_CLIENT_SECRET=votre_client_secret_live
PAYPAL_MODE=live
```

### Frais PayPal :
- **3.4% + 0.35 EUR** par transaction (international)
- Retrait vers compte bancaire : gratuit (2-3 jours)

---

## 3. Moov Money (Flooz)

### Etape 1 : Devenir marchand Moov Money

1. Contactez Moov Togo :
   - **Email** : partenaires@moov-togo.tg
   - **Tel** : +228 22 32 90 00
   - Ou rendez-vous en agence Moov

2. Documents requis :
   - Piece d'identite
   - Registre de commerce (si applicable)
   - Justificatif d'activite
   - RIB bancaire

3. Demandez un **compte marchand API**

### Etape 2 : Obtenir les credentials API

Apres validation, vous recevrez :
- **Merchant ID** : Votre identifiant marchand
- **API Key** : Cle d'authentification
- **API Secret** : Secret pour les requetes

### Etape 3 : Configurer dans Boukilibre

Ajoutez dans votre fichier `.env` :

```env
MOOV_MERCHANT_ID=votre_merchant_id
MOOV_API_KEY=votre_api_key
MOOV_API_SECRET=votre_api_secret
MOOV_CALLBACK_URL=https://boukilibre.com/api/payment/moov/callback
```

### Processus de paiement Moov :

1. Le client choisit "Moov Money"
2. Il entre son numero Moov (ex: +228 90 XX XX XX)
3. Il recoit une demande USSD sur son telephone
4. Il entre son code PIN Moov
5. Le paiement est confirme
6. Vous recevez la notification

### Frais Moov Money :
- **~2%** par transaction (negociable)
- Fonds disponibles immediatement sur votre compte Moov
- Retrait en especes gratuit en agence

---

## 4. Configuration du fichier .env complet

Voici un exemple de fichier `.env` avec toutes les configurations :

```env
# ======================================
# CONFIGURATION BOUKILIBRE
# ======================================

# Serveur
PORT=3000
NODE_ENV=production

# MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/boukilibre

# ======================================
# PAIEMENTS
# ======================================

# Stripe (Cartes bancaires)
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# PayPal
PAYPAL_CLIENT_ID=xxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=xxxxxxxxxxxx
PAYPAL_MODE=live

# Moov Money
MOOV_MERCHANT_ID=xxxxxxxxxxxx
MOOV_API_KEY=xxxxxxxxxxxx
MOOV_API_SECRET=xxxxxxxxxxxx
MOOV_CALLBACK_URL=https://boukilibre.com/api/payment/moov/callback

# ======================================
# EMAIL (pour notifications)
# ======================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contact@boukilibre.com
EMAIL_PASS=votre_mot_de_passe_application

# ======================================
# ADMIN
# ======================================
ADMIN_EMAIL=admin@boukilibre.com
ADMIN_PASSWORD=votre_mot_de_passe_admin_securise
JWT_SECRET=une_chaine_tres_longue_et_aleatoire_pour_jwt

# ======================================
# SITE
# ======================================
SITE_URL=https://boukilibre.com
SITE_NAME=Boukilibre
```

---

## 5. Ou arrivent vos paiements ?

| Methode | Ou arrive l'argent | Delai |
|---------|-------------------|-------|
| **Stripe** | Compte bancaire configure | 2-7 jours |
| **PayPal** | Solde PayPal | Immediat |
| **Moov** | Compte Moov Money | Immediat |

### Retirer l'argent :

**Stripe :**
1. Les fonds sont automatiquement vires sur votre compte bancaire
2. Frequence : quotidienne, hebdomadaire, ou mensuelle (configurable)

**PayPal :**
1. Connectez-vous a PayPal
2. Cliquez sur "Retirer"
3. Transferez vers votre compte bancaire (2-3 jours)

**Moov Money :**
1. Rendez-vous en agence Moov
2. Ou transferez vers un compte bancaire
3. Ou utilisez directement pour payer

---

## 6. Tester les paiements

### Mode Test (Sandbox)

Avant de passer en production, testez avec les modes sandbox :

**Stripe Test :**
- Utilisez les cles `pk_test_xxx` et `sk_test_xxx`
- Carte test : `4242 4242 4242 4242`
- Date : n'importe quelle date future
- CVC : n'importe quel code a 3 chiffres

**PayPal Sandbox :**
- Creez des comptes sandbox dans le dashboard developer
- Testez les paiements sans argent reel

**Moov Test :**
- Demandez des credentials de test a Moov
- Testez avec des numeros virtuels

---

## 7. Notifications de paiement

Le systeme envoie automatiquement un email au client apres un paiement reussi :

**Contenu de l'email :**
- Confirmation de la commande
- Numero de commande
- Lien de telechargement de l'ebook
- Contact support

### Configurer les emails :

Si vous utilisez Gmail :
1. Activez l'authentification a 2 facteurs
2. Generez un "Mot de passe d'application"
3. Utilisez ce mot de passe dans EMAIL_PASS

---

## 8. Securite

### Bonnes pratiques :

1. **Ne jamais exposer les cles secretes**
   - Gardez-les uniquement dans `.env`
   - Ajoutez `.env` dans `.gitignore`

2. **Utiliser HTTPS**
   - Obligatoire pour les paiements
   - Firebase/Vercel le fournit automatiquement

3. **Verifier les webhooks**
   - Validez les signatures Stripe
   - Verifiez les callbacks PayPal et Moov

4. **Surveiller les transactions**
   - Activez les alertes dans chaque dashboard
   - Verifiez regulierement les transactions suspectes

---

## 9. Support

### En cas de probleme :

**Stripe :**
- Support : [support.stripe.com](https://support.stripe.com)
- Status : [status.stripe.com](https://status.stripe.com)

**PayPal :**
- Support : [paypal.com/help](https://paypal.com/help)
- Tel : 0 800 942 890 (France)

**Moov Money :**
- Tel : +228 22 32 90 00
- Email : partenaires@moov-togo.tg

**Boukilibre :**
- Email : support@boukilibre.com

---

## Checklist de configuration

- [ ] Compte Stripe cree et verifie
- [ ] Compte PayPal Business active
- [ ] Compte marchand Moov Money obtenu
- [ ] Cles API ajoutees dans .env
- [ ] Mode test valide
- [ ] Passage en mode production
- [ ] Emails de confirmation configures
- [ ] Webhooks configures
