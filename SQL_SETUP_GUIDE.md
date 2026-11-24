# 🗄️ Guide Installation SQL - Carnet de Progression

## 📋 Table des matières
1. [Setup Initial](#setup-initial)
2. [Vérifications](#vérifications)
3. [Troubleshooting](#troubleshooting)
4. [Données de Test](#données-de-test)

---

## 🚀 Setup Initial

### Étape 1: Accéder à Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Cliquez sur **SQL Editor** dans le menu de gauche
4. Cliquez sur **+ New Query**

### Étape 2: Exécuter le script complet
1. Ouvrez le fichier `SETUP_COMPLET.sql`
2. Copiez TOUT le contenu
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur **Run** (ou Ctrl+Enter)
5. ✅ Regardez les messages de succès en bas!

### Étape 3: Vérifier que tout fonctionne
```sql
-- Afficher les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## ✅ Vérifications

### Vérifier que progression_entries existe
```sql
SELECT COUNT(*) as nb_entries FROM progression_entries;
```
Résultat attendu: `0` (aucune donnée au départ)

### Vérifier que player_profiles existe
```sql
SELECT COUNT(*) as nb_profiles FROM player_profiles;
```
Résultat attendu: `0`

### Vérifier les colonnes de player_profiles
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'player_profiles'
ORDER BY ordinal_position;
```

Vous devez voir:
- `id` (uuid)
- `user_id` (uuid)
- `first_name` (character varying)
- `last_name` (character varying)
- `age` (integer)
- `sport` (character varying) - optionnel
- `sports` (text[]) - nouveau
- `playing_style` (text)
- `season_objective` (text)
- `current_ranking` (character varying) - nouveau
- `key_strengths` (text[])
- `key_weaknesses` (text[])
- `improvement_focus` (text[])
- `bio` (text)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Vérifier que RLS est activé
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND (tablename = 'progression_entries' OR tablename = 'player_profiles');
```

Résultat attendu: `rowsecurity = true` pour les deux tables

### Vérifier les index
```sql
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND (tablename = 'progression_entries' OR tablename = 'player_profiles');
```

---

## 🔄 Migration depuis l'ancienne structure

Si vous aviez déjà des données:

### Étape 1: Faire une sauvegarde
```sql
-- Sauvegarde des données existantes
SELECT * FROM player_profiles LIMIT 10;
SELECT * FROM progression_entries LIMIT 10;
```

### Étape 2: Lancer la migration
1. Ouvrez `MIGRATION_UPGRADE.sql`
2. Copiez le contenu
3. Collez dans l'éditeur SQL
4. Cliquez sur **Run**

### Étape 3: Vérifier que la migration a marché
```sql
-- Afficher les profils migrés
SELECT 
  first_name,
  last_name,
  sport,
  sports,
  current_ranking
FROM player_profiles;
```

---

## 🎯 Données de Test

### Ajouter un profil de test

Remplacez `'YOUR_USER_ID'` par votre vrai ID utilisateur:

```sql
-- D'abord, trouvez votre user_id
SELECT id, email FROM auth.users LIMIT 1;

-- Puis insérez le profil (remplacez YOUR_USER_ID)
INSERT INTO player_profiles (
  user_id, 
  first_name, 
  last_name, 
  age,
  sports,
  playing_style,
  season_objective,
  current_ranking,
  key_strengths,
  key_weaknesses,
  improvement_focus
) VALUES (
  'YOUR_USER_ID',
  'Jean',
  'Dupont',
  25,
  ARRAY['badminton', 'chess'],
  'Agressif',
  'Atteindre N1 en Badminton',
  'N2',
  ARRAY['Smash puissant', 'Déplacements rapides', 'Jeu stratégique'],
  ARRAY['Revers faible', 'Service inconsistant', 'Gestion mentale'],
  ARRAY['Améliorer le revers', 'Régularité du service', 'Préparation mentale']
);
```

### Ajouter des entrées de test

```sql
-- Remplacez YOUR_USER_ID par votre user_id
INSERT INTO progression_entries (
  user_id,
  sport,
  date,
  entry_type,
  score,
  opponent_level,
  match_result,
  notes,
  strengths,
  weaknesses,
  improvement_axes
) VALUES 
(
  'YOUR_USER_ID',
  'badminton',
  '2026-11-24',
  'match',
  7,
  'R',
  'win',
  'Bon match! Service très régulier.',
  ARRAY['Service excellent', 'Déplacements rapides', 'Jeu au filet'],
  ARRAY['Revers aléatoire', 'Gestion du stress', 'Concentration'],
  ARRAY['Travailler le revers', 'Calme et concentration', 'Meilleur positionnement']
);
```

### Vérifier que les données sont bien insérées
```sql
SELECT * FROM player_profiles WHERE first_name = 'Jean';
SELECT * FROM progression_entries WHERE user_id = 'YOUR_USER_ID';
```

---

## 🐛 Troubleshooting

### Erreur: "policy relation does not exist"
**Solution:** Exécutez d'abord `SETUP_COMPLET.sql` pour créer les tables avant les policies.

### Erreur: "duplicate key value violates unique constraint"
**Solution:** Les tables existent déjà. Vérifiez avec:
```sql
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('progression_entries', 'player_profiles');
```

### Erreur: "column does not exist"
**Solution:** Vérifiez que toutes les colonnes existent:
```sql
\d progression_entries
\d player_profiles
```

### RLS empêche mes requêtes
**Vérification:**
```sql
-- Voir les policies appliquées
SELECT * FROM pg_policies 
WHERE tablename IN ('progression_entries', 'player_profiles');
```

---

## 📊 Vues Disponibles

Après le setup, vous pouvez utiliser ces vues:

### Vue: progression_stats
```sql
SELECT * FROM progression_stats WHERE user_id = 'YOUR_USER_ID';
```

Affiche:
- Nombre d'entrées totales
- Nombre de matchs/entraînements
- Score moyen
- Nombre de wins/loss/draw
- Dernière date d'entrée

### Vue: monthly_stats
```sql
SELECT * FROM monthly_stats WHERE user_id = 'YOUR_USER_ID';
```

Affiche les stats par mois.

---

## ✨ C'est fait!

Vos tables sont prêtes. Vous pouvez maintenant:
- ✅ Utiliser l'application web
- ✅ Créer des profils
- ✅ Ajouter des entrées
- ✅ Visualiser les statistiques

Besoin d'aide? Vérifiez les logs SQL de Supabase! 🚀
