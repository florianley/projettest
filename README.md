# Synthwave Hello World — v2

Site statique d'une page : soleil néon, grille infinie, terminal animé et deux thèmes.
Toujours aucune dépendance, aucun build, aucun tracker.

## Structure

| Fichier | Rôle |
| --- | --- |
| `index.html` | Page v2 (héros, système, terminal, specs) |
| `style.css` | Thèmes Sunset / Matrix, décor synthwave, responsive |
| `app.js` | Thème persistant, révélations au scroll, parallaxe, terminal |
| `favicon.svg` | Icône |
| `v1/index.html` | Archive de la version 1, accessible depuis la barre du haut |
| `v1/style.css` | Styles de la version 1 |

## V2 en bref

- Thème **Sunset** ou **Matrix**, mémorisé dans `localStorage`.
- Terminal qui se tape tout seul, avec repli `noscript`.
- Parallaxe légère souris et halo de curseur (désactivés sur tactile).
- Révélations au scroll via `IntersectionObserver`.
- Respect de `prefers-reduced-motion` et navigation clavier.
- Toujours trois fichiers pour la page principale, servis tels quels.

## Lancer en local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

Ou simplement ouvrir `index.html` dans un navigateur. Aucun script de build
n'est nécessaire : le site est déjà dans son état de production.

## Déploiement

Le dossier est prêt à être servi tel quel par GitHub Pages, Netlify, Cloudflare Pages,
ou n'importe quel serveur de fichiers statiques.

## Vérifications

```bash
node --check app.js
# servir le dossier puis vérifier que /, /style.css, /app.js et /v1/ répondent en 200
```
