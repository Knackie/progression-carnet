# 🚀 SETUP SQL RAPIDE

## ✨ Si tu as DÉJÀ une DB (ce qui semble être le cas!)

### Étape 1: Exécute ce fichier
**`SETUP_UPDATE_SAFE.sql`**

C'est le seul dont tu as besoin! Il va:
- ✅ Ajouter les colonnes manquantes (`sports`, `current_ranking`)
- ✅ Migrer tes données existantes
- ✅ Créer les indexes
- ✅ Configurer les triggers
- ✅ Créer les vues

**Comment faire:**
1. Ouvrir Supabase
2. SQL Editor → New Query
3. Copier-coller **tout** SETUP_UPDATE_SAFE.sql
4. Cliquer Run
5. ✅ Done!

---

## 🎯 Que faire après?

### Option A: Ajouter des données de test
```sql
-- D'abord trouver votre user_id
SELECT id FROM auth.users LIMIT 1;

-- Remplacez YOUR_USER_ID par votre vraie ID
INSERT INTO player_profiles (
  user_id, 
  first_name, 
  last_name,
  sports,
  current_ranking
) VALUES (
  'YOUR_USER_ID',
  'Jean',
  'Dupont',
  ARRAY['badminton'],
  'N2'
);
```

### Option B: Juste tester l'app
L'app fonctionne! Créez votre profil depuis l'interface.

---

## 📚 Autres fichiers (optionnel)

| Fichier | Utilité |
|---------|---------|
| `SETUP_COMPLET.sql` | Setup from scratch (tu n'en as pas besoin) |
| `FIND_USER_ID.sql` | Trouver ton user_id |
| `MIGRATION_UPGRADE.sql` | Ancienne migration (déjà fait) |
| `SQL_SETUP_GUIDE.md` | Guide détaillé |
| `SQL_FILES_README.md` | Vue d'ensemble |

---

## 🔥 C'est tout!

Exécute `SETUP_UPDATE_SAFE.sql` et c'est prêt! 🎉
