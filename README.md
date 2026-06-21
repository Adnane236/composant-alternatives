# Composant Alternatives

Application Next.js pour gérer des composants industriels et rechercher les pièces disponibles, les alternatives et les ruptures.

## Objectif
- Rechercher les composants depuis un cahier de charge
- Identifier les pièces disponibles
- Lister les alternatives pour les composants indisponibles
- Backend PostgreSQL (Neon / Supabase / self-hosted) pour stocker les informations
- Proposer une interface plus attractive pour le dashboard

## Installation
1. Copier `.env.local.example` en `.env.local`
2. Renseigner `DATABASE_URL` (PostgreSQL — laisser vide pour les données de démonstration)
3. Installer les dépendances :
   ```bash
   npm install
   ```
4. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## Schéma PostgreSQL
Le fichier `sql/schema.sql` contient les tables (`Fils`, `Torsades`, `Splices`,
`SpliceFils`, `Inventaire`, `ProductionTracking`, `Contacts`, `Recap`,
`RMAlternativeMateriel`) et des données d'exemple. `sql/schema_create_only.sql`
crée les tables sans données. Appliquer avec :
```bash
psql "$DATABASE_URL" -f sql/schema.sql
```

## Fonctionnalités ajoutées
- Page d'import et de recherche : `/import`
- API `POST /api/search` pour chercher les composants depuis une liste de références
- Fallback sur des données mock si la base SQL Server n'est pas configurée
- Dashboard plus proche du style industriel et du panneau métier

## Notes
- Le projet fonctionne immédiatement avec des données mock.
- Pour connecter PostgreSQL, définissez `DATABASE_URL` et exécutez `sql/schema.sql` sur votre base.
- Pour afficher le logo Versigent, placez les fichiers d'image dans `public/logos/` et nommez le logo principal `versigent-white.png`.
