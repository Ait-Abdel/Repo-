# Réserve
Ligne d'une liste de réserves (défauts constatés à lever avant ou après réception) : on la consulte, on la lève, on y joint des photos.

## Quand l'utiliser
Listes de réserves par chantier, logement ou entreprise ; OPR et réception.

## Anatomie
1. Case « lever » carrée (`radius.sm`, zone tactile `size.touch-target`) · 2. Intitulé (`text.body-strong`) + indice de révision si modifiée · 3. Localisation en mono capitales (`text.overline`) : BÂT. · NIVEAU · LGT · PIÈCE · 4. Bulle de repère du métier · 5. Statut daté

## Variantes
| Variante | Différence | Tokens |
|---|---|---|
| Ouverte | case vide | cadre `color.border.strong` |
| Échue | statut « Échue 20/11 » | `color.statut.en-retard.*`, `color.danger.text` |
| Levée | case pleine cochée, intitulé barré, statut « Levée 21/11 » | `color.statut.termine.solid`, `color.fg.muted` |

## Tailles
Hauteur minimale `size.row` (44 px bureau, 64 px terrain), padding `space.3` × `layout.block-padding`. Les lignes d'une liste sont dans une structure ; entre deux lignes, un filet `color.border.subtle`.

## États
| État | Changement |
|---|---|
| Focus de la case | anneau `color.border.focus` |
| Pressé (mobile) | fond `color.bg.hover` |
| Levée hors connexion | case cochée + « à synchroniser » en `color.fg.muted` |

## Contenu
Intitulé = le défaut constaté, concret. Localisation toujours dans le même ordre.

## Accessibilité
`role="checkbox"` + `aria-checked`, nom qui reprend l'intitulé (« Lever la réserve : prise non fixée »). Levée réversible : toast « Réserve levée · Annuler ».

## Web
`.fd-reserve` (+ `--levee`) > `.fd-reserve__check` + `.fd-reserve__body` (`__title`, `__where`) + `.fd-reserve__aside` (repère + statut). Sous 560 px, le repère et le statut passent sous l'intitulé.

## Mobile
Toucher la ligne ouvre le détail ; la case lève directement ; balayage vers la droite pour lever, toujours doublé par la case. Photo obligatoire si l'entreprise l'a configuré.

## Ne pas faire
Supprimer une réserve levée de la liste sans trace.
