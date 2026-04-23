# Composant Alternatives

Application Next.js pour gérer des composants industriels et rechercher les pièces disponibles, les alternatives et les ruptures.

## Objectif
- Rechercher les composants depuis un cahier de charge
- Identifier les pièces disponibles
- Lister les alternatives pour les composants indisponibles
- Prévoir un backend SQL Server pour stocker les informations
- Proposer une interface plus attractive pour le dashboard

## Installation
1. Copier `.env.local.example` en `.env.local`
2. Mettre à jour les variables SQL Server
3. Installer les dépendances :
   ```bash
   npm install
   ```
4. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

## Schéma SQL Server
Le fichier `sql/schema.sql` contient les tables:
- `Components`
- `Alternatives`

## Fonctionnalités ajoutées
- Page d'import et de recherche : `/import`
- API `POST /api/search` pour chercher les composants depuis une liste de références
- Fallback sur des données mock si la base SQL Server n'est pas configurée
- Dashboard plus proche du style industriel et du panneau métier

## Notes
- Le projet fonctionne immédiatement avec des données mock.
- Pour connecter SQL Server, configurez les variables d'environnement et exécutez `sql/schema.sql` sur votre instance.
- Pour afficher le logo Versigent, placez les fichiers d'image dans `public/logos/` et nommez le logo principal `versigent-white.png`.
