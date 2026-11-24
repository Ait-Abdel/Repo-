# Structure apparente
Assemble des blocs (fiches, cartes, lignes, panneaux) séparés par des joints sombres de 2 px, comme les éléments d'un ouvrage en béton.

## Quand l'utiliser
- Pour toute suite de blocs liés : en-tête de fiche et ses chiffres, grille de cartes, liste de réserves, panneaux d'un tableau de bord.
- Ne pas l'utiliser pour un bloc isolé : une carte seule porte son propre cadre (`border-width.thick` en `color.border.joint`).

## Anatomie
1. Conteneur (fond = couleur du joint) · 2. Blocs enfants en `color.bg.surface` · 3. Joints = l'espace entre les blocs

## Variantes
| Variante | Usage |
|---|---|
| Pile | blocs les uns sous les autres (fiche, liste) |
| Grille | cartes côte à côte, qui passent en pile sur téléphone |

## Tailles
Joint et cadre : `border-width.thick` (2 px) dans les deux densités. Padding des blocs : `layout.block-padding` (24 px bureau, 16 px terrain).

## États
Statique. Les états (survol, sélection) se portent sur les blocs, jamais sur les joints.

## Tokens
`color.border.joint` (joints et cadre), `color.bg.surface` (blocs), `radius.none`.

## Accessibilité
Les joints sont décoratifs mais contrastés (≥ 3:1 sur `bg.canvas` et `bg.surface`, contrôlé). L'ordre de lecture suit l'ordre du DOM : ne pas réordonner visuellement les blocs.

## Web
`<div class="fd-structure">` ; les enfants reçoivent le fond de surface. Technique : `display: grid; gap: 2px; background: joint`. Les joints suivent automatiquement les retours à la ligne de la grille.

## Mobile
Même principe : un conteneur au fond `color.border.joint`, des enfants espacés de 2 px. Pas d'ombre portée, pas d'arrondi, sauf pour les bottom sheets natives (`radius.sheet`).

## Ne pas faire
- Ajouter une ombre ou un arrondi aux blocs d'une structure.
- Une structure avec une case vide visible : le nombre de colonnes doit être rempli, sinon passer en pile.
