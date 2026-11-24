---
name: ds-web
description: Implémente un design system dans un site ou une application web à partir des tokens générés (build/css/tokens.css) et des specs de composants — CSS de composants, intégration React, Vue, Svelte ou Tailwind, thème clair/sombre, densités, polices, responsive, vérification visuelle. À utiliser pour « applique le design system au site », « crée les composants web », « branche les tokens dans Tailwind / React », « ajoute le mode sombre au site », « fais la page de démonstration du design system ».
---

# Déclinaison web

Entrées : `design-system/build/css/tokens.css` (lancer `build-tokens.mjs` s'il manque) et `design-system/components/*.md`. Le code web ne contient **aucune** valeur de couleur, de taille de police, d'espacement ou de rayon : il lit uniquement des `var(--<préfixe>-…)`.

## 1. Détecter la pile

Regarde `package.json` et la structure du projet : framework (React, Next, Vue, Nuxt, Svelte, Astro, HTML statique), méthode de style (CSS modules, Tailwind, styled-components, SCSS), bibliothèque de composants existante. **Adapte-toi à l'existant** : si le projet utilise une bibliothèque (Radix, shadcn, MUI…), thème-la avec les tokens au lieu de tout réécrire. S'il n'y a pas de projet web, travaille dans `design-system/web/`.

## 2. Brancher les tokens

1. Importe `tokens.css` une seule fois, à la racine (layout ou entrée de l'app). Copie-le, ou référence-le depuis `design-system/build/` par un alias de build. Ne l'édite jamais.
2. **Thème** : sans attribut, le système suit le réglage de l'OS (`prefers-color-scheme`). Pour un sélecteur, pose `data-theme="light|dark"` sur `<html>` et retiens le choix (localStorage, ou cookie pour le rendu serveur, afin d'éviter le flash au chargement).
3. **Densité** : `data-density` sur `<html>` ou sur une zone de la page. Utilise par défaut la densité bureau sur desktop. Passe en densité terrain sur les écrans tactiles (`@media (pointer: coarse)` → poser l'attribut en JS) ou par un réglage utilisateur.
4. **Polices** : charge les familles de `font.family.*` (Google Fonts avec `display=swap`, ou fichiers auto-hébergés en woff2 avec `@font-face`). Précharge la police du texte courant. Applique `font-variant-numeric: tabular-nums` partout où des chiffres s'alignent.
5. **Tailwind** : en v4, mappe les variables dans `@theme`, par exemple `--color-primary: var(--fd-color-primary-solid);`. En v3, utilise `theme.extend.colors.primary = 'var(--fd-color-primary-solid)'`. Ne recopie jamais les hex dans la config.

## 3. Écrire les composants

Pour chaque spec, dans l'ordre de priorité de `components/README.md` :

- un élément HTML natif d'abord (`<button>`, `<input>`, `<dialog>`, `<details>`) ; ARIA seulement en complément ;
- des classes préfixées (`.fd-btn`, `.fd-btn--primary`), ou les conventions du framework ;
- chaque état de la spec est implémenté : `:hover`, `:active`, `:focus-visible` (outline `var(--…-focus-ring-width) solid var(--…-color-border-focus)`, offset `var(--…-focus-ring-offset)`), `:disabled` / `aria-disabled`, `aria-busy`, `aria-invalid` ;
- hauteurs via `size.control.*`, padding via `layout.control-padding-x`, texte via les classes `.<préfixe>-text-*` ou `font: var(--…-text-label)` ;
- animations via `duration.*` et `easing.*`, désactivées sous `prefers-reduced-motion: reduce`.

La référence CSS du système est dans `design-system/web/components.css`. Réutilise-la ou porte-la dans le framework.

## 4. Mise en page responsive

- Points de rupture : `breakpoint.*`. Les variables CSS ne marchent pas dans les media queries, recopie la valeur avec un commentaire qui cite le token.
- **App de gestion** : barre latérale (navigation) + barre du haut (recherche, compte) à partir de `breakpoint.lg`. En dessous, la barre latérale devient un tiroir. Sur téléphone, la navigation passe en barre du bas, comme dans l'app mobile.
- Les tableaux denses deviennent des listes de cartes sous `breakpoint.md`, ou défilent dans leur propre conteneur (`overflow-x: auto`), jamais la page entière.
- Marges : `layout.gutter`. Largeur de lecture : environ 65 caractères pour le texte long.

## 5. Vérifier

1. `node .claude/skills/ds-audit/scripts/lint-hardcoded.mjs <dossiers du code web>` → zéro valeur en dur hors exceptions marquées `ds-ignore`.
2. Une page de démonstration qui montre chaque composant dans tous ses états.
3. Des captures avec Playwright (préinstallé), en clair et sombre, bureau et terrain, à 375 px et 1280 px : regarde-les. Rien ne doit être tronqué, tous les textes doivent être lisibles et le focus visible.
4. Navigation au clavier sur la page de démo : ordre logique, focus jamais perdu, `Échap` ferme les couches.
