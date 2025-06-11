#!/bin/bash

# 1. Déplacer le contenu du sous-dossier `shopopti-app-main` à la racine (si existe)
if [ -d "shopopti-app-main" ]; then
  mv shopopti-app-main/* . && mv shopopti-app-main/.* . 2>/dev/null
  rm -rf shopopti-app-main
  echo "✅ Fichiers déplacés depuis shopopti-app-main/"
else
  echo "ℹ️ Aucun dossier 'shopopti-app-main' trouvé, rien à déplacer."
fi

# 2. Vérifier que package.json est bien présent
if [ ! -f "package.json" ]; then
  echo "❌ Erreur : fichier package.json introuvable à la racine !"
  exit 1
fi

# 3. Instructions Git
echo "\n✅ Les fichiers sont prêts. Exécutez les commandes suivantes pour enregistrer"
echo "manuellement les changements :"
echo "\n   git add ."
echo "   git commit -m 'fix: repositionner les fichiers à la racine pour Vercel'"
echo "   git push origin <votre-branche>"
echo "\nEnsuite, redeployez sur Vercel."

