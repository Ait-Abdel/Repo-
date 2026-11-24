---
name: design-system
description: Point d'entrée pour créer ou faire évoluer un design system (charte graphique d'interface, UI kit, thème, design tokens) commun à un site web et à une application mobile, à partir d'une thématique ou d'un secteur. À utiliser quand on demande « crée un design system », « une charte graphique pour mon SaaS / mon app », « un thème pour l'interface », « des design tokens », « un UI kit », ou pour savoir quelle étape lancer ensuite. Enchaîne les skills ds-brief → ds-tokens → ds-components → ds-web / ds-mobile → ds-audit.
---

# Design system thématique : web + mobile

Un design system ici, c'est **un socle commun** (les tokens) et **deux déclinaisons** (web et mobile) qui le lisent. Les tokens sont la seule source de vérité : aucune couleur, taille ou espacement n'est écrit en dur ailleurs.

## Les étapes et leurs skills

| # | Étape | Skill | Produit | Terminé quand |
|---|---|---|---|---|
| 1 | Comprendre la thématique | `ds-brief` | `design-system/brief.md` | utilisateurs, contextes d'usage, personnalité et direction visuelle validés par l'utilisateur |
| 2 | Socle de tokens | `ds-tokens` | `design-system/ds.config.json`, `tokens/**/*.json`, `build/` | `check-tokens.mjs` sans erreur, `build-tokens.mjs` exécuté |
| 3 | Spécifier les composants | `ds-components` | `design-system/components/*.md` | chaque composant a ses états, ses tokens, ses règles d'accessibilité, sa version web et mobile |
| 4a | Déclinaison web | `ds-web` | CSS / composants du framework web | rendu vérifié en clair, sombre, bureau, terrain |
| 4b | Déclinaison mobile | `ds-mobile` | thème + composants de la techno mobile | techno choisie, thème branché, composants clés rendus |
| 5 | Contrôler | `ds-audit` | rapport d'audit | contrastes, valeurs en dur, cohérence web/mobile, accessibilité |

Les étapes 4a et 4b sont indépendantes : on peut faire le web d'abord et le mobile plus tard. Elles ne modifient jamais les tokens ; si un besoin manque, on revient à l'étape 2.

## Reprendre là où on en est

Avant de lancer quoi que ce soit, regarde ce qui existe :

- pas de `design-system/brief.md` → `ds-brief` ;
- un brief, mais pas de `design-system/ds.config.json` → `ds-tokens` ;
- des tokens, mais pas de `design-system/components/` → `ds-components` ;
- des specs → `ds-web` ou `ds-mobile` selon la demande ;
- tout existe → `ds-audit`, ou l'étape concernée par la modification demandée.

Pour une modification ponctuelle (« rends le bleu plus foncé », « ajoute un statut »), va directement à l'étape concernée, puis relance les vérifications de `ds-tokens` et `ds-audit`.

## Arborescence

```
design-system/
├── brief.md                ← ds-brief
├── ds.config.json          ← ds-tokens : nom, préfixe CSS, fichiers, modes, contrôles
├── tokens/                 ← SOURCE (éditée à la main ou générée puis éditée)
│   ├── primitives/         palettes, espacements, rayons, polices, animations
│   ├── themes/             light.json, dark.json : rôles de couleur, ombres
│   └── density/            bureau.json, terrain.json (ou desktop / mobile) : tailles, styles de texte
├── build/                  ← GÉNÉRÉ par build-tokens.mjs, jamais édité
│   ├── css/tokens.css
│   ├── ts/tokens.ts
│   └── json/tokens.json
├── components/             ← ds-components : une spec par composant
└── web/                    ← ds-web : CSS de référence des composants
```

## Commandes

Depuis `design-system/` :

```bash
node ../.claude/skills/ds-tokens/scripts/check-tokens.mjs --verbose   # valider
node ../.claude/skills/ds-tokens/scripts/build-tokens.mjs             # générer build/
node ../.claude/skills/ds-audit/scripts/lint-hardcoded.mjs ../src     # traquer les valeurs en dur
```

## Règles transverses

- **Un socle, deux déclinaisons.** Couleurs, typographie, espacements, rayons et ombres sont communs. Ce qui change entre web et mobile passe par un axe de modes (densité) ou par la spec du composant, jamais par une copie des valeurs.
- **Trois niveaux de tokens.** Les primitives (`palette.bleu.700`) ne sont lues que par les tokens sémantiques (`color.primary.solid`). Les composants ne lisent que les sémantiques.
- **Nommage.** Les rôles techniques sont en anglais, comme dans l'outillage du marché : `bg`, `fg`, `border`, `solid`, `subtle`, `on-solid`. Le vocabulaire du domaine et les palettes sont dans la langue du produit : `statut.en-retard`, `metier.gros-oeuvre`, `palette.beton`.
- **Accessibilité par construction.** Les paires de contraste sont déclarées dans `ds.config.json` et vérifiées à chaque build. La couleur n'est jamais le seul porteur d'information : il y a toujours une icône ou un libellé en plus.
- **La thématique se voit dans les détails.** Le vocabulaire, les unités, les statuts et les catégories du métier sont des tokens et des composants, pas de la décoration.
- Réponds dans la langue de l'utilisateur. Montre-lui les choix structurants (palette, typographies, densités) avant de produire tous les composants.

## Version consultable (optionnel)

Pour partager le système avec une équipe non technique, publie-le comme artifact de type « Design System » sur claude.ai : README d'usage, tokens par thème, aperçus des composants. Pour cela :

1. `node .claude/skills/design-system/scripts/export-claude-artifact.mjs --out <dossier> --config design-system/ds.config.json` écrit `project/tokens.json` (familles en listes, couleurs par thème, densités secondaires en tokens suffixés) et `project/components/bundle.css` (alias de polices, styles de texte et densités, suivis du CSS de `web/components.css`). Aucune valeur n'est retapée.
2. Ajoute `project/README.md` : les règles d'usage, qui citent les noms de tokens, et pas d'historique. Ajoute aussi un `components/<Nom>/README.md` et un `preview.html` par composant, plus la couverture `components/Cover/preview.html`, en suivant les instructions du type d'artifact.
3. Publie tous les fichiers en un seul appel, avec l'index `project/design-system.json` en dernier.

Le dépôt reste la source : une modification se fait dans `tokens/`, puis on relance l'export et on republie seulement les fichiers modifiés.
