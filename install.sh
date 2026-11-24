#!/bin/bash
# Script d'installation pour progression-carnet

echo "🏸 Installation de Carnet de Progression"
echo "========================================"
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+."
    exit 1
fi

echo "✅ Node.js $(node --version) détecté"
echo ""

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

echo ""
echo "✅ Dépendances installées"
echo ""
echo "⚠️  Prochaines étapes :"
echo ""
echo "1. Créer un compte sur https://supabase.com (gratuit)"
echo "2. Créer un nouveau projet Supabase"
echo "3. Copier votre 'Project URL' et 'Anon Public Key'"
echo "4. Renommer .env.local.example en .env.local"
echo "5. Remplir les variables d'environnement"
echo "6. Exécuter les SQL dans le dashboard Supabase (voir SETUP.md)"
echo "7. Lancer: npm run dev"
echo ""
echo "🚀 Bon développement !"
