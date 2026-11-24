# Statut
Indique l'état d'un chantier, d'une tâche ou d'une réserve par une forme, une couleur et un libellé en capitales mono : planifié, en cours, en attente, en retard, terminé.

## Quand l'utiliser
- À côté du titre d'un objet, dans une carte, une ligne, le cartouche.
- Ne pas l'utiliser comme bouton ni comme filtre.

## Anatomie
1. Marque de forme propre au statut (0,8 em) · 2. Libellé `text.overline` en capitales

## Variantes
| Statut | Marque | Couleur de la marque | Libellé |
|---|---|---|---|
| Planifié | carré vide | `color.statut.planifie.solid` | `color.fg.default` |
| En cours | carré à moitié plein | `color.statut.en-cours.solid` | `color.fg.default` |
| En attente | deux barres (pause) | `color.statut.en-attente.solid` | `color.fg.default` |
| En retard | triangle plein | `color.statut.en-retard.solid` | `color.danger.text` |
| Terminé | carré plein | `color.statut.termine.solid` | `color.fg.default` |
| Annulé | carré vide | `color.statut.planifie.solid` | `color.fg.muted`, barré |

Statut daté : même rendu avec le libellé daté (« Échue 20/11 », « Levée 21/11 », « Avant le 28/11 »).

## Tailles
Suit `text.overline` : 12 px bureau, 14 px terrain.

## États
Non interactif. Pour changer de statut, un bouton ou un menu contient le statut.

## Accessibilité
- Le libellé est du texte réel ; la marque est décorative.
- Marques ≥ 3:1 sur `bg.surface` ; les quatre couleurs de statut restent distinguables pour les trois types de daltonisme, et chaque statut a une forme différente.

## Web
`<span class="fd-statut fd-statut--en-retard">En retard</span>`. La marque est dessinée en CSS (`::before`).

## Mobile
Même rendu. Dans une liste dense, seul le statut « en retard » garde son libellé coloré.

## Ne pas faire
- Un point de couleur seul, sans libellé.
- Un badge en pilule pastel : le statut est une annotation de plan, pas une étiquette.
