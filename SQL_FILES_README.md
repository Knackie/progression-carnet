# 📚 Fichiers SQL - Carnet de Progression

## 📖 Guide de Lecture

### 1️⃣ **SETUP_COMPLET.sql** ⭐ COMMENCER ICI
**Le fichier principal pour tout configurer**

Contient:
- ✅ Table `progression_entries` (logs de matches/entraînements)
- ✅ Table `player_profiles` (profils joueurs)
- ✅ Indexes pour les performances
- ✅ Row Level Security (RLS) - sécurité
- ✅ Triggers pour les timestamps automatiques
- ✅ Vues pour les statistiques
- ✅ Données de test commentées

**Comment l'utiliser:**
1. Allez dans Supabase > SQL Editor
2. Créez une nouvelle query
3. Copiez-collez **tout** le contenu
4. Cliquez sur Run
5. ✅ C'est fait!

---

### 2️⃣ **FIND_USER_ID.sql** (Avant d'ajouter des données)
**Pour trouver votre ID utilisateur**

Affiche:
- Tous les utilisateurs de votre projet
- Ou filtré par email
- Avec leur `user_id` (UUID)

**Comment l'utiliser:**
1. Exécutez-le dans Supabase
2. Copiez votre `user_id`
3. Remplacez `'YOUR_USER_ID'` dans les autres fichiers

---

### 3️⃣ **MIGRATION_UPGRADE.sql** (Si vous aviez déjà une DB)
**Pour mettre à jour une structure existante**

Fait:
- ✅ Ajoute la colonne `sports` (array)
- ✅ Ajoute la colonne `current_ranking`
- ✅ Migre les données de `sport` → `sports`

**Quand l'utiliser:**
- Seulement si vous aviez déjà une version avec un seul champ `sport`
- Sinon, ne l'exécutez PAS

---

### 4️⃣ **Autres fichiers anciens** (Optionnel - legacy)
- `create-player-profiles.sql` - Ancien setup (utiliser SETUP_COMPLET à la place)
- `add-match-result.sql` - Ancienne migration
- `update-player-profiles-sports.sql` - Ancienne migration
- `rls-policies.sql` - Anciennes policies

---

## 🎯 Workflow Complet

### Si vous commencez de zéro:
```
1. Exécuter: SETUP_COMPLET.sql
   ↓
2. Exécuter: FIND_USER_ID.sql (pour trouver votre user_id)
   ↓
3. Ajouter les données de test avec votre user_id
   ↓
4. ✅ Prêt à utiliser l'app!
```

### Si vous aviez déjà une DB:
```
1. Exécuter: MIGRATION_UPGRADE.sql
   ↓
2. Vérifier que les données sont bien migrées
   ↓
3. ✅ Continuer à utiliser l'app!
```

---

## 📋 Checkliste Rapide

- [ ] ✅ Exécuté `SETUP_COMPLET.sql`
- [ ] ✅ Vérifié que les tables existent
- [ ] ✅ Exécuté `FIND_USER_ID.sql` et copié mon user_id
- [ ] ✅ Optionnel: Ajouté des données de test
- [ ] ✅ Prêt à coder!

---

## 🚨 Troubleshooting Rapide

| Erreur | Solution |
|--------|----------|
| "relation does not exist" | Exécutez `SETUP_COMPLET.sql` d'abord |
| "duplicate key" | Les tables existent. C'est normal. |
| "RLS policy violation" | Vérifiez votre user_id dans les requêtes |
| Pas de colonnes `sports`/`current_ranking` | Exécutez `MIGRATION_UPGRADE.sql` |

---

## 📞 Besoin d'aide?

Vérifiez dans Supabase:
1. **SQL Editor** → Regardez les erreurs en rouge
2. **Database** → Cliquez sur les tables pour voir les colonnes
3. **Auth** → Vérifiez vos utilisateurs

---

**Prêt? C'est parti! 🚀**
