# Guide d'Administration - Boukilibre

## Introduction

Ce guide vous explique comment gerer votre boutique Boukilibre via le tableau de bord administrateur.

---

## 1. Acces au Dashboard Admin

### URL d'acces
```
https://boukilibre.com/admin/
```

### Identifiants par defaut
- **Email** : admin@boukilibre.com
- **Mot de passe** : A configurer dans `.env` (ADMIN_PASSWORD)

**IMPORTANT** : Changez le mot de passe par defaut immediatement apres la premiere connexion !

---

## 2. Fonctionnalites du Dashboard

### 2.1 Vue d'ensemble (Accueil)

Le tableau de bord affiche :
- **Ventes du jour** : Montant total et nombre de commandes
- **Ventes du mois** : Montant total et evolution
- **Abonnes newsletter** : Nombre total et nouveaux
- **Graphique des ventes** : Evolution sur 30 jours

### 2.2 Gestion des Ebooks

#### Ajouter un nouvel ebook :
1. Cliquez sur **"Ebooks"** > **"Ajouter"**
2. Remplissez les informations :
   - Titre
   - Description
   - Prix (en FCFA)
   - Categorie
   - Image de couverture
   - Fichier PDF
3. Cliquez sur **"Publier"**

#### Modifier un ebook :
1. Cliquez sur **"Ebooks"** > **"Liste"**
2. Cliquez sur l'icone de modification
3. Modifiez les champs souhaites
4. Cliquez sur **"Enregistrer"**

#### Supprimer un ebook :
1. Cliquez sur **"Ebooks"** > **"Liste"**
2. Cliquez sur l'icone de suppression
3. Confirmez la suppression

**Note** : La suppression est definitive. Les commandes existantes conservent les informations du produit.

### 2.3 Gestion des Commandes

#### Voir toutes les commandes :
1. Cliquez sur **"Commandes"**
2. Filtrez par :
   - Statut (En attente, Payee, Echouee)
   - Date
   - Methode de paiement

#### Details d'une commande :
- Numero de commande
- Informations client
- Produits achetes
- Montant total
- Statut de paiement
- Date de creation

#### Actions possibles :
- **Renvoyer l'email** : Renvoie le lien de telechargement au client
- **Marquer comme remboursee** : En cas de remboursement
- **Exporter** : Telecharger en CSV/Excel

### 2.4 Gestion de la Newsletter

#### Voir les abonnes :
1. Cliquez sur **"Newsletter"**
2. Voir la liste des emails inscrits

#### Exporter les emails :
1. Cliquez sur **"Exporter"**
2. Telechargez le fichier CSV
3. Importez dans Mailchimp, Sendinblue, etc.

#### Supprimer un abonne :
1. Trouvez l'email dans la liste
2. Cliquez sur **"Desabonner"**

### 2.5 Messages de Contact

#### Voir les messages :
1. Cliquez sur **"Messages"**
2. Messages non lus en premier

#### Repondre a un message :
1. Cliquez sur le message
2. Cliquez sur **"Repondre"**
3. Redigez votre reponse
4. Envoyez

### 2.6 Statistiques et Analytics

#### Donnees disponibles :
- Ventes par jour/semaine/mois
- Produits les plus vendus
- Sources de trafic
- Taux de conversion
- Revenus par categorie

#### Exporter les rapports :
1. Selectionnez la periode
2. Cliquez sur **"Exporter"**
3. Choisissez le format (CSV, PDF)

---

## 3. Gestion des Paiements

### 3.1 Stripe (Cartes bancaires)

#### Configuration :
1. Connectez-vous a [Stripe Dashboard](https://dashboard.stripe.com)
2. Copiez vos cles API
3. Ajoutez-les dans `.env` :
   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   ```

#### Voir les paiements :
- Via le dashboard Stripe
- Ou dans l'admin Boukilibre > Commandes

#### Remboursements :
1. Dans Stripe Dashboard
2. Trouvez le paiement
3. Cliquez sur **"Refund"**

### 3.2 PayPal

#### Configuration :
1. Connectez-vous a [PayPal Business](https://www.paypal.com/business)
2. Creez une application dans Developer Dashboard
3. Copiez Client ID et Secret
4. Ajoutez dans `.env` :
   ```
   PAYPAL_CLIENT_ID=xxx
   PAYPAL_CLIENT_SECRET=xxx
   ```

### 3.3 Moov Money

#### Configuration :
1. Contactez Moov pour un compte marchand
2. Obtenez vos identifiants API
3. Ajoutez dans `.env` :
   ```
   MOOV_MERCHANT_ID=xxx
   MOOV_API_KEY=xxx
   ```

#### Processus de paiement :
1. Client choisit Moov Money
2. Entre son numero de telephone
3. Recoit une demande de confirmation
4. Valide avec son code PIN
5. Paiement confirme

---

## 4. Gestion des Fichiers

### 4.1 Images des ebooks

**Specifications recommandees :**
- Format : JPG ou PNG
- Dimensions : 800x1200 pixels
- Taille max : 500 KB
- Nommage : `ebook-[nom].jpg`

**Emplacement :** `/images/`

### 4.2 Fichiers PDF des ebooks

**Specifications recommandees :**
- Format : PDF
- Taille max : 10 MB
- Protection : Pas de DRM (optionnel)
- Nommage : `ebook-[nom].pdf`

**Emplacement :** `/downloads/` (non accessible publiquement)

---

## 5. Securite

### 5.1 Bonnes pratiques

1. **Mot de passe fort** :
   - Minimum 12 caracteres
   - Lettres majuscules et minuscules
   - Chiffres et caracteres speciaux

2. **Sessions** :
   - Deconnexion automatique apres 30 min d'inactivite
   - Invalider les sessions sur tous les appareils si compromis

3. **Sauvegardes** :
   - Automatiques quotidiennes de la base de donnees
   - Conservez les 30 derniers jours

### 5.2 En cas de probleme

**Compte compromis :**
1. Changez immediatement le mot de passe
2. Verifiez les commandes recentes
3. Contactez le support si necessaire

**Erreur sur le site :**
1. Verifiez les logs dans Firebase Console
2. Restaurez depuis une sauvegarde si necessaire

---

## 6. Support et Maintenance

### Mises a jour
- Verifiez regulierement les mises a jour de securite
- Testez en local avant de deployer

### Monitoring
- Configurez des alertes pour les erreurs
- Surveillez les metriques de performance

### Contact support technique
- Email : support@boukilibre.com
- Documentation : /docs/

---

## 7. FAQ Admin

**Q: Comment changer le prix d'un ebook ?**
R: Allez dans Ebooks > Liste > Modifier > Changez le prix > Enregistrer

**Q: Comment voir les ventes du mois ?**
R: Dashboard > Statistiques > Selectionnez "Ce mois"

**Q: Comment ajouter un nouvel administrateur ?**
R: Non recommande pour la securite. Utilisez un seul compte admin.

**Q: Les paiements arrivent ou ?**
R: Directement sur vos comptes Stripe/PayPal/Moov configures.

**Q: Comment envoyer une newsletter ?**
R: Exportez les emails et utilisez un service comme Mailchimp ou Sendinblue.
