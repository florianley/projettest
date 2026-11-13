# Synthwave Hello World

Site statique d'une seule page : soleil néon, grille infinie et `HELLO WORLD`.

Aucune dépendance, aucun build. Trois fichiers et c'est tout :

- `index.html`
- `style.css`
- `favicon.svg`

## Lancer en local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Ou simplement ouvrir `index.html` dans un navigateur.

## Déploiement

Le dossier est prêt à être servi tel quel par GitHub Pages, Netlify, Cloudflare Pages,
ou n'importe quel serveur de fichiers statiques.

## Détails

- Mise en page responsive, sans JavaScript obligatoire (le seul script met à jour l'année du footer).
- Animations désactivées automatiquement via `prefers-reduced-motion`.
- Zéro tracker, zéro police externe, zéro CDN.
