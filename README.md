
# Shopopti+ v6.5.3

🚀 Version stable fusionnée incluant toutes les fonctionnalités SaaS essentielles.

## ✅ Fonctionnalités principales intégrées

- 🔐 Authentification Supabase
- 🧠 IA OpenAI pour optimisation de produits
- 💸 Paiement Stripe (Freemium / Pro / Agence)
- 🔁 Redirection automatique si abonnement annulé
- 📊 Tableau admin `/admin/subscriptions` avec :
  - Filtres dynamiques
  - Export CSV
  - Graphique camembert par plan
- 🛠 Gestion multi-boutiques Shopify
- 🧾 Pages : `/pricing`, `/my-subscription`, `/success`, `/cancel`

## ⚙️ Installation locale

```bash
git clone https://github.com/votre-utilisateur/application-shopopti.git
cd application-shopopti
npm install
npm run dev
```

## 🔐 Variables d’environnement `.env` (Vercel ou local)

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_OPENAI_API_KEY=sk-...
VITE_STRIPE_PRICE_PRO=price_...
VITE_STRIPE_PRICE_AGENCY=price_...
VITE_STRIPE_SUCCESS_URL=https://shopopti.io/success
VITE_STRIPE_CANCEL_URL=https://shopopti.io/cancel
VITE_SHOPIFY_STORE_DOMAIN=ma-boutique.myshopify.com
VITE_SHOPIFY_ADMIN_TOKEN=shpat_...
```

## 🌐 Déploiement Vercel

1. Connecte ton dépôt GitHub à Vercel
2. Ajoute les variables `.env` dans Settings > Environment Variables
3. Clique sur **Deploy**

---

© Shopopti+ v6.5.3 – Dernière mise à jour : IA, abonnements, sécurité admin, UX SaaS pro.
