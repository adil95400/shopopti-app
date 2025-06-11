# 📦 Shopopti+ – Version 6.8-final

## ✅ Nouveautés
- Refactor complet de la structure du projet pour une compatibilité parfaite avec Vercel
- Séparation claire des composants, pages, modules, services et contextes
- Ajout d’un `.env.example` pour la configuration environnementale sécurisée
- Nettoyage des fichiers inutiles et suppression des dossiers corrompus

## 🛠️ Corrections
- Correction des erreurs de build liées aux fichiers `.DS_Store`, `node_modules`, `package.json` mal positionné
- Suppression des dépendances externes conflictuelles
- Réorganisation du dépôt Git avec branche `v6.8`

## 🔐 Sécurité & Optimisation
- Ajout de `.gitignore` complet pour éviter les secrets (`.env`) et les fichiers locaux sensibles
- Normalisation des scripts shell (ex: `fix-vercel.sh`)
- Préparation pour la branche `v6.9` (Analytics, Stripe Billing, Assistant AI...)

---

### 🚀 Étapes suivantes

1. 🏷️ Créer un tag Git :
```bash
git tag v6.8-final
git push origin v6.8-final

### 📚 Documentation API

L'application FastAPI expose une interface Swagger disponible sur `/docs`.
Vous pouvez également récupérer le schéma brut via `/openapi.json`.
En local, lancez `uvicorn backend.main:app` puis ouvrez
<http://localhost:8000/docs> pour explorer les différentes routes.
