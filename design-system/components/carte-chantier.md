# Carte chantier
Résumé d'un chantier dans une liste ou un tableau de bord : référence, nom, statut, information clé, cote d'avancement, métiers présents, dates et effectifs.

## Quand l'utiliser
- Liste des chantiers (grille en structure apparente sur web, pile sur mobile), tableau de bord du gérant.
- Pour comparer beaucoup de chantiers sur desktop : un tableau (à spécifier), dont la carte est l'équivalent mobile.

## Anatomie
1. Sur-titre : référence + type (`text.overline`) · 2. Statut (à droite) · 3. Nom (`text.title-3`) · 4. Information clé (`text.body-sm`, `color.fg.muted`), suivie d'un indice de révision si modifiée · 5. Cote d'avancement · 6. Bulles de repère des métiers · 7. Pied : dates et effectifs (`text.caption`, filet `color.border.subtle`)

## Variantes
| Variante | Différence |
|---|---|
| Dans une structure (défaut en liste) | pas de cadre : les joints de la structure séparent les cartes |
| Isolée | cadre `border-width.thick` en `color.border.joint` |
| Tâche du jour (mobile) | sur-titre = lot et tâche ; bouton corten pleine largeur sous la carte |

## Tailles
Padding `layout.block-padding`, gap `space.3`, `radius.none`. Largeur minimale 320 px en grille.

## États
| État | Changement | Tokens |
|---|---|---|
| Survol (web) | fond | `color.bg.hover` |
| Pressé (mobile) | fond | `color.bg.hover` |
| Focus | anneau sur la carte | `color.border.focus` |

## Contenu
L'information clé dépend du statut : adresse si en cours, cause si en retard (« livraison zinc reportée au 02/12 »). Dates courtes JJ/MM → JJ/MM/AAAA. 4 bulles de repère au maximum, puis « +3 ».

## Accessibilité
Un seul lien par carte (le titre), étendu à la carte entière. Ordre de lecture : titre, statut, information clé, avancement, métiers, dates.

## Web
`<article class="fd-card fd-card--interactive">` avec `.fd-chantier__head`, `.fd-overline`, `.fd-chantier__title`, `.fd-chantier__meta`, `.fd-cote`, `.fd-reperes`, `.fd-chantier__foot`, dans une `.fd-structure` pour une grille.

## Mobile
Pile pleine largeur dans une structure ; appui long pour ouvrir les actions (bottom sheet).

## Ne pas faire
- Ombre, arrondi ou bordure gauche colorée.
- Des chiffres clés dans chaque carte : ils sont réservés à la fiche.
