---
name: ds-tokens
description: Crée ou modifie le socle de design tokens (couleurs, typographie, espacements, rayons, ombres, animations) au format W3C DTCG, avec modes clair/sombre et densités (bureau/terrain, desktop/mobile), contrôles automatiques de contraste WCAG et de lisibilité pour les daltoniens, puis génère CSS, TypeScript (React / React Native) et JSON (Flutter, natif). À utiliser pour « crée les tokens », « palette de couleurs », « ajoute un mode sombre », « change la couleur principale », « ajoute un statut / une catégorie », « exporte les tokens pour le mobile ».
---

# Tokens : le socle commun web + mobile

Entrée : `design-system/brief.md`. Si le brief manque, propose de passer d'abord par `ds-brief`. Sortie : `design-system/ds.config.json`, `design-system/tokens/**`, `design-system/build/**`.

Scripts (Node ≥ 18, sans dépendance), dans `.claude/skills/ds-tokens/scripts/` :

| Script | Rôle |
|---|---|
| `generate-scale.mjs` | gamme 50→950 en OKLCH, ramenée dans le gamut sRGB, avec les contrastes sur blanc et noir |
| `check-tokens.mjs` | structure, alias, parité des modes, contrastes, distinction des couleurs catégorielles |
| `build-tokens.mjs` | génère `build/css/tokens.css`, `build/ts/tokens.ts`, `build/json/tokens.json` |

## Architecture en trois niveaux

1. **Primitives** (`tokens/primitives/`) : palettes (`palette.<nom>.<palier>`), `space.*`, `radius.*`, `font.*`, `duration.*`, `easing.*`, `breakpoint.*`. Ce sont des valeurs brutes, que personne ne lit en dehors des tokens.
2. **Sémantiques par thème** (`tokens/themes/<thème>.json`) : `color.bg|fg|border.*`, `color.<rôle>.{solid, solid-hover, on-solid, subtle, on-subtle, border, text}` pour `primary`, `accent`, `success`, `warning`, `danger`, `info`, puis les rôles métier (`color.statut.*`, `color.<catégorie>.*`) et `shadow.*`. Uniquement des alias vers les primitives ou vers d'autres sémantiques du même fichier.
3. **Densité par contexte** (`tokens/density/<densité>.json`) : `size.control.*`, `size.touch-target`, `size.icon.*`, `size.row`, `layout.*` et les styles de texte `text.*` (composites `typography`). Les tailles de texte changent avec la densité.

Les axes de modes sont déclarés dans `ds.config.json` (`modes.<axe>.values`). Chaque valeur d'un axe doit définir exactement les mêmes tokens (parité contrôlée). Un token vit dans la base ou dans un axe, jamais dans les deux.

## Méthode

1. **Config** : crée `design-system/ds.config.json` sur le modèle de l'exemple plus bas, avec le nom du système, un préfixe CSS de 2 ou 3 lettres et les axes de modes tirés du brief.
2. **Palettes** : pour chaque teinte du brief (marque, accent, neutres, succès, avertissement, danger, info, catégories), lance le générateur et assemble `tokens/primitives/color.json`. Ajoute un `$description` par palette qui dit à quoi elle sert.
   ```bash
   node generate-scale.mjs --name bleu --hue 258 --chroma 0.16 --group none --json
   node generate-scale.mjs --name beton --hue 85 --chroma 0.014 --stops "50:0.978,100:0.955,…,975:0.19"
   ```
   - Neutres : chroma de 0,01 à 0,02, teinte biaisée vers la marque ou le matériau du domaine. Ajoute des paliers sombres (950, 975) pour les fonds du thème sombre.
   - Succès et danger ne doivent pas se distinguer seulement par l'opposition rouge/vert : tire le vert vers le bleu (teinte 155–165) et/ou écarte leurs luminosités.
   - Catégories : 8 au maximum. Au-delà, regroupe par familles et différencie chaque élément par une icône et un code.
3. **Rôles sémantiques** : remplis `themes/light.json` puis `themes/dark.json`. Repères :
   - texte principal ≥ 7:1 si l'on lit en extérieur, sinon ≥ 4.5:1 ; texte secondaire ≥ 4.5:1 ; icônes, bordures de champ et anneau de focus ≥ 3:1 ;
   - `on-solid` est toujours un token. Les fonds clairs, comme un orange vif ou un jaune, prennent un texte foncé, y compris dans le thème sombre ;
   - le thème sombre n'est pas une inversion : les fonds sont les paliers 900–975 des neutres, et les couleurs pleines remontent aux paliers 300–500 avec du texte foncé dessus ;
   - chaque token dont l'usage n'est pas évident porte un `$description` qui dit où il sert et sur quels fonds. Ces descriptions sont recopiées dans le CSS et dans la doc.
4. **Densités** : une densité par contexte du brief. Repères pour une densité tactile : zone de toucher ≥ 48 px (44 pt iOS, 48 dp Android), contrôles de 48 à 64 px si l'utilisateur porte des gants, texte courant de 17 à 18 px en extérieur. Densité souris : contrôles de 32 à 48 px, texte de 14 à 16 px.
5. **Contrôles** : déclare dans `checks.contrast.pairs` toutes les paires texte/fond réellement utilisées. Les jokers `*` capturent un segment et se répercutent sur le fond, par exemple `color.*.on-solid` sur `color.*.solid`. Déclare dans `checks.categorical` les ensembles qui doivent rester distinguables.
   ```bash
   cd design-system && node ../.claude/skills/ds-tokens/scripts/check-tokens.mjs --verbose
   ```
   Corrige jusqu'à zéro erreur. Un avertissement de vision daltonienne est acceptable seulement si le composant double la couleur par une icône ou un libellé ; signale-le alors à l'utilisateur.
6. **Build** : `node ../.claude/skills/ds-tokens/scripts/build-tokens.mjs`. Ne modifie jamais `build/` à la main.
7. **Rapport** : montre à l'utilisateur la palette (marque, accent, neutres, statuts), les typographies, les densités et le résultat des contrôles. Ne colle pas les fichiers.

## Format DTCG accepté par les scripts

```json
{
  "color": {
    "$type": "color",
    "bg": { "canvas": { "$value": "{palette.beton.50}", "$description": "Fond de page." } }
  }
}
```

- `$type` se déclare sur le token ou sur un groupe parent (il est hérité). Types gérés : `color` (hex `#rrggbb` / `#rrggbbaa`, ou objet `{colorSpace, components, alpha, hex}`), `dimension` (`"16px"`, `"1rem"`, ou `{value, unit}`), `fontFamily` (chaîne ou tableau), `fontWeight`, `number`, `duration` (`"200ms"`), `cubicBezier` (`[x1, y1, x2, y2]`), `shadow` (objet ou tableau `{color, offsetX, offsetY, blur, spread, inset?}`), `typography` (`{fontFamily, fontWeight, fontSize, lineHeight, letterSpacing}`), `border`.
- Un alias est `"{chemin.complet}"`, y compris dans les champs d'un composite. Le CSS garde les alias sous forme de `var()`, ce qui fait suivre automatiquement le changement de mode. Le TS et le JSON sont entièrement résolus.
- Les noms ne contiennent ni `.`, ni `{`, ni `}`. Les paliers sont des nombres en chaîne (`"700"`).
- `letterSpacing` en `em` est accepté par nos scripts. C'est une tolérance, hors de la spec stricte.

## Ce que génère le build

- **CSS** : `:root` contient la base. Chaque mode a un bloc `[data-<axe>="<valeur>"]`, celui par défaut est aussi sur `:root`, et le thème sombre suit `prefers-color-scheme` quand aucun attribut n'est posé. Des classes `.<préfixe>-text-<style>` sont générées pour chaque style de texte. Variables : `--<préfixe>-<chemin-avec-tirets>`.
- **TS** : `base`, `modes`, `defaults` et `resolveTokens({ theme, density })`, qui renvoie l'arbre fusionné. Dimensions en nombres (px), durées en ms, typographies au format React Native (`lineHeight` en px absolus, `fontFamily` = première police).
- **JSON** : mêmes données que le TS. C'est l'entrée des générateurs Flutter, Swift ou Kotlin (voir `ds-mobile`).

## Exemple de `ds.config.json`

```json
{
  "name": "Mon produit", "prefix": "mp", "tokensDir": "tokens", "outDir": "build",
  "base": ["primitives/color.json", "primitives/dimension.json", "primitives/typography.json", "primitives/motion.json"],
  "modes": {
    "theme": { "default": "light", "values": { "light": ["themes/light.json"], "dark": ["themes/dark.json"] },
               "css": { "attribute": "data-theme", "colorScheme": { "light": "light", "dark": "dark" }, "media": { "(prefers-color-scheme: dark)": "dark" } } },
    "density": { "default": "desktop", "values": { "desktop": ["density/desktop.json"], "mobile": ["density/mobile.json"] }, "css": { "attribute": "data-density" } }
  },
  "checks": {
    "contrast": { "axis": "theme", "pairs": [ { "fg": "color.fg.default", "bg": ["color.bg.canvas", "color.bg.surface"], "min": 4.5 } ] },
    "categorical": [ { "name": "catégories", "axis": "theme", "tokens": "color.categorie.*.solid", "minDeltaE": 0.08, "minDeltaECvd": 0.04 } ]
  }
}
```

Le système Fondation BTP dans `design-system/` est un exemple complet : 3 palettes de marque, 4 statuts, 8 familles de métiers, 2 thèmes, 2 densités et 192 paires de contraste contrôlées.

## Modifier un système existant

Modifie le fichier source dans `tokens/`, jamais `build/`. Relance `check-tokens.mjs` puis `build-tokens.mjs`. Pour un nouveau rôle de couleur, ajoute-le dans **tous** les thèmes (la parité est contrôlée) et sa paire de contraste dans la config. Renommer un token casse le code qui l'utilise : cherche `--<préfixe>-<ancien-nom>` et le chemin TS dans le code, et mets-les à jour dans le même changement.
