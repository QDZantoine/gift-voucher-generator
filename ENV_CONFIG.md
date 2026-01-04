# Configuration des Variables d'Environnement

## 📧 Configuration Email pour la Production

### Variables requises dans votre fichier `.env` :

```env
# Resend Email
RESEND_API_KEY="re_your_resend_api_key_here"

# Email Configuration (IMPORTANT pour la production)
# Utilisez une adresse avec votre domaine vérifié sur Resend
EMAIL_FROM="Restaurant Influences <noreply@votre-domaine-verifie.com>"
EMAIL_REPLY_TO="contact@votre-domaine-verifie.com"
```

### 🔧 Étapes pour configurer Resend en Production

#### 1. Vérifier un domaine sur Resend

1. Connectez-vous à https://resend.com/domains
2. Cliquez sur "Add Domain"
3. Entrez votre domaine (ex: `restaurant-influences.fr`)
4. Ajoutez les enregistrements DNS fournis par Resend :

   **Enregistrement SPF** (Type: TXT)
   ```
   Nom: @
   Valeur: v=spf1 include:_spf.resend.com ~all
   ```

   **Enregistrement DKIM** (Type: TXT)
   ```
   Nom: resend._domainkey
   Valeur: [fourni par Resend - commence par "p="]
   ```

   **Enregistrement DMARC** (Type: TXT) - Optionnel mais recommandé
   ```
   Nom: _dmarc
   Valeur: v=DMARC1; p=none; rua=mailto:dmarc@votre-domaine.com
   ```

5. Attendez la vérification (peut prendre jusqu'à 72h, généralement quelques minutes)

#### 2. Mettre à jour vos variables d'environnement

**En développement (tests):**
```env
EMAIL_FROM="Restaurant Influences <onboarding@resend.dev>"
```
☝️ Vous ne pouvez envoyer qu'à votre propre email

**En production (après vérification du domaine):**
```env
EMAIL_FROM="Restaurant Influences <noreply@restaurant-influences.fr>"
EMAIL_REPLY_TO="contact@restaurant-influences.fr"
```
✅ Vous pouvez envoyer à n'importe quel email

#### 3. Exemples d'adresses email recommandées

- `noreply@votre-domaine.com` - Pour les emails automatiques
- `contact@votre-domaine.com` - Pour le reply-to
- `notifications@votre-domaine.com` - Alternative
- `reservations@votre-domaine.com` - Spécifique au restaurant

### 🔍 Vérifier la configuration

Pour tester si votre domaine est bien vérifié :

1. Allez sur https://resend.com/domains
2. Votre domaine doit afficher "Verified" avec une coche verte
3. Testez l'envoi d'un email via votre application

### ⚠️ Points importants

- **Mode développement** : Resend limite les envois à votre propre adresse email
- **Mode production** : Nécessite un domaine vérifié pour envoyer à n'importe qui
- **Limite gratuite** : 100 emails/jour, 3000 emails/mois
- **Plan payant** : À partir de $20/mois pour des volumes plus importants

### 🚀 Déploiement sur Coolify

Dans Coolify, ajoutez ces variables d'environnement :

```
RESEND_API_KEY=re_your_actual_api_key
EMAIL_FROM=Restaurant Influences <noreply@restaurant-influences.fr>
EMAIL_REPLY_TO=contact@restaurant-influences.fr
```

### 📚 Documentation Resend

- Domains: https://resend.com/docs/dashboard/domains/introduction
- DNS Records: https://resend.com/docs/dashboard/domains/dns-records
- Pricing: https://resend.com/pricing






