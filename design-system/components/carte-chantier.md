# Carte chantier
Résumé d'un chantier dans une liste ou un tableau de bord : identité, lieu, statut, avancement, métiers présents, dates et équipe.

## Quand l'utiliser
- Liste des chantiers (grille sur web, liste verticale sur mobile), tableau de bord du gérant.
- Pour comparer beaucoup de chantiers sur desktop, préférer un tableau (à spécifier) ; la carte reste l'équivalent mobile du tableau.

## Anatomie
1. Sur-titre : référence + type (`text.overline`, capitales) · 2. Nom du chantier (`text.title-3`) · 3. Badge statut · 4. Adresse ou information clé (`text.body-sm`, `fg.muted`) · 5. Barre d'avancement · 6. Pastilles métier compactes · 7. Pied : dates et effectifs (`text.caption`, séparateur `border.subtle`)

## Variantes
| Variante | Différence |
|---|---|
| Interactive (défaut en liste) | toute la carte ouvre la fiche chantier |
| Statique | dans une fiche, sans survol |
| Tâche du jour (mobile) | sur-titre = lot, contenu = tâche, bouton primaire pleine largeur en bas |

## Tailles
Padding `space.4`, espace interne `space.3`, rayon `radius.lg`, contour `border.subtle` sur `bg.surface`. Largeur minimale 320 px en grille (`repeat(auto-fill, minmax(min(100%, 320px), 1fr))`).

## États
| État | Changement | Tokens |
|---|---|---|
| Repos | contour fin | `color.border.subtle` |
| Survol (web) | contour plus marqué + ombre légère | `color.border.default`, `shadow.sm` |
| Pressé (mobile) | fond | `color.bg.hover` |
| Focus | anneau sur la carte (le lien couvre la carte) | `color.border.focus` |

## Contenu
- Nom du chantier tel que l'utilise l'entreprise ; référence en sur-titre.
- L'information clé change selon le statut : adresse si en cours, cause si en retard (« livraison zinc reportée au 02/12 »).
- Dates au format court JJ/MM → JJ/MM/AAAA.

## Accessibilité
- Un seul lien par carte (le titre), étendu à toute la carte en CSS ; les éléments internes ne sont pas des liens.
- Ordre de lecture : titre, statut, information clé, avancement, métiers, dates.

## Web
`<article class="fd-card fd-card--interactive">` avec `.fd-chantier__head`, `__ref`, `__title`, `__meta`, `__metiers`, `__foot`.

## Mobile
Pleine largeur, gouttière `layout.gutter`. Toucher la carte ouvre la fiche ; un appui long ouvre les actions (bottom sheet). Pas d'ombre : contour seulement.

## Ne pas faire
- Un bandeau ou une bordure gauche colorée selon le statut : le badge suffit.
- Plus de 5 pastilles métier : afficher 4 puis « +3 ».
