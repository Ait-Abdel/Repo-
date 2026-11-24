# Réserve
Ligne d'une liste de réserves (défauts constatés à lever avant ou après réception) : on la consulte, on la lève, on y joint des photos.

## Quand l'utiliser
- Listes de réserves par chantier, par logement, par entreprise ; OPR et réception.
- C'est un élément de liste spécialisé : pour une tâche de planning, utiliser l'élément de liste standard (à spécifier).

## Anatomie
1. Case « lever » (cercle, zone tactile `size.touch-target`) · 2. Intitulé (`text.body-strong`) · 3. Localisation (bâtiment · niveau · logement · pièce, `text.body-sm`, `fg.muted`) · 4. Pastille métier · 5. Échéance ou badge statut daté · 6. Nombre de photos

## Variantes
| Variante | Différence | Tokens |
|---|---|---|
| Ouverte | case vide | cercle `color.border.strong` |
| Échue | badge « Échue le … » | `color.statut.en-retard.*` |
| Levée | case cochée, intitulé barré et éteint, badge « Levée le … » | `color.statut.termine.solid`, `color.fg.muted` |

## Tailles
Hauteur minimale `size.row` (44 px bureau, 64 px terrain), padding `space.3` × `space.4`, séparateur `border.subtle`. Icône de case `size.icon.lg`.

## États
| État | Changement |
|---|---|
| Focus de la case | anneau `color.border.focus` |
| Pressé (mobile) | fond `color.bg.hover` sur la ligne |
| Levée en attente de synchronisation | case cochée + mention « à synchroniser » (`fg.muted`) |

## Contenu
- Intitulé : le défaut constaté, concret (« Joint de carrelage fissuré devant la douche »), pas la catégorie.
- Localisation toujours dans le même ordre : Bât. · Niveau (R-1, RDC, R+2) · Logement · Pièce.

## Accessibilité
- La case est un `role="checkbox"` avec `aria-checked` et un nom qui reprend l'intitulé (« Lever la réserve : prise non fixée »).
- Lever une réserve est réversible : un toast « Réserve levée · Annuler » plutôt qu'une confirmation bloquante.
- L'état « levée » est porté par la coche, le texte barré **et** le badge, pas seulement par la couleur.

## Web
`.fd-reserve` (+ `--levee`) > `.fd-reserve__check` + `.fd-reserve__body` (`__title`, `__where`, `__tags`) + `.fd-reserve__aside`.

## Mobile
- Toucher la ligne ouvre le détail (photos, historique) ; la case lève directement.
- Balayer vers la droite pour lever (avec retour haptique), toujours doublé par la case visible.
- Lever une réserve exige une photo si l'entreprise l'a configuré : ouvrir l'appareil photo directement.

## Ne pas faire
- Supprimer une réserve levée de la liste sans trace : elle reste visible (filtre « Levées »).
