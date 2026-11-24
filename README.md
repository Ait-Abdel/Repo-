# Skills « design system » pour Claude Code

Un ensemble de 8 skills pour créer, à partir d'une thématique, un design system **commun à un site web et à une application mobile**. Il est livré avec un premier système complet : **Fondation BTP**, pour un SaaS de gestion de chantier multi-métiers.

## Les skills

Ils sont dans `.claude/skills/` et se chargent automatiquement quand Claude Code est ouvert dans ce dépôt.

| Skill | Rôle |
|---|---|
| `design-system` | point d'entrée : enchaîne les étapes, sait reprendre là où on en est |
| `ds-brief` | thématique → utilisateurs, contextes d'usage, personnalité, direction visuelle (`brief.md`) |
| `ds-identite` | personnalité visuelle : diagnostic du générique, 3 territoires tirés du métier, planche comparative, choix |
| `ds-tokens` | socle de tokens W3C DTCG : palettes OKLCH, thèmes clair/sombre, densités, contrôles de contraste et de daltonisme, build CSS / TS / JSON |
| `ds-components` | specs de composants indépendantes de la techno, avec une section web et une section mobile |
| `ds-web` | intégration web : CSS, React, Vue, Tailwind, mode sombre, responsive |
| `ds-mobile` | intégration mobile : choix de la techno (Expo, Flutter, natif), thème généré, conventions iOS / Android |
| `ds-audit` | audit : tokens, valeurs en dur, cohérence web/mobile, WCAG 2.2 |

Exemples de demandes : « crée un design system pour une app de réservation de salles de sport », « ajoute un statut "suspendu" », « branche le design system dans Tailwind », « exporte les tokens pour Flutter », « audite le design system ».

## Fondation BTP

Le système produit avec ces skills, dans `design-system/` :

- `brief.md` : utilisateurs (gérant, conducteur de travaux, chef de chantier, compagnon), contraintes du terrain (soleil, gants, réseau faible, daltonisme), direction « bleu de travail et béton » ;
- `tokens/` : 14 palettes, 2 thèmes (clair, sombre), 2 densités (bureau, terrain), 5 statuts de chantier, 8 familles de métiers ;
- `build/` : `css/tokens.css`, `ts/tokens.ts` (React / React Native, avec `resolveTokens({ theme, density })`), `json/tokens.json` (Flutter, natif) ;
- `components/` : specs de bouton, champ avec unité, badge statut, pastille métier, barre d'avancement, carte chantier, réserve, navigation et bandeau hors connexion ;
- `web/components.css` et `web/demo.html` : implémentation web de référence et page de démonstration.

Contrôles actuels : 192/192 paires de contraste conformes (texte principal ≥ 7:1). Les couleurs de statut et de famille de métiers restent distinguables en vision normale et pour les trois types de daltonisme.

## Commandes

Node ≥ 18, sans dépendance. Depuis `design-system/` :

```bash
node ../.claude/skills/ds-tokens/scripts/check-tokens.mjs --verbose    # valider les tokens
node ../.claude/skills/ds-tokens/scripts/build-tokens.mjs              # régénérer build/
node ../.claude/skills/ds-tokens/scripts/generate-scale.mjs --name bleu --hue 258 --chroma 0.16   # nouvelle palette
node ../.claude/skills/ds-audit/scripts/lint-hardcoded.mjs web         # traquer les valeurs en dur
```

Pour voir la démo, ouvre `design-system/web/demo.html` dans un navigateur. Les boutons en haut changent le thème et la densité.

## Modifier le système

1. Modifier un fichier de `design-system/tokens/` (jamais `build/`).
2. `check-tokens.mjs`, puis `build-tokens.mjs`.
3. Si un rôle de couleur est ajouté, l'ajouter dans les deux thèmes et déclarer sa paire de contraste dans `ds.config.json`.

Pour changer le nom ou le préfixe CSS (`fd`), modifie `name` et `prefix` dans `design-system/ds.config.json`, puis reconstruis.
