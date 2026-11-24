# Badge statut
Indique l'état d'un chantier, d'une tâche ou d'une réserve : planifié, en cours, en attente, en retard, terminé.

## Quand l'utiliser
- À côté du titre d'un objet, dans une carte, une ligne de liste ou un en-tête de page.
- Ne pas l'utiliser comme bouton ni comme filtre (→ puce de filtre, à spécifier).

## Anatomie
1. Fond teinté · 2. Icône de forme propre au statut · 3. Libellé

## Variantes
| Statut | Icône | Fond / texte / icône |
|---|---|---|
| Planifié | cercle pointillé | `color.statut.planifie.subtle` / `.on-subtle` / `.solid` |
| En cours | cercle à moitié plein | `color.statut.en-cours.*` (→ info) |
| En attente | cercle avec pause | `color.statut.en-attente.*` (→ warning) |
| En retard | triangle d'alerte | `color.statut.en-retard.*` (→ danger) |
| Terminé | cercle avec coche | `color.statut.termine.*` (→ success) |
| Annulé | cercle pointillé, libellé barré | comme Planifié |

## Tailles
Texte `text.caption` en semi-gras (12 px bureau, 14 px terrain), padding `space.1`/2 × `space.2`, rayon `radius.sm`, icône à 1,15 em.

## États
Non interactif : un seul état. Si le badge doit être cliquable (changer de statut), utiliser un bouton secondaire qui le contient.

## Contenu
- Le libellé du statut, ou un statut daté : « Échue le 20/11 », « Levée le 21/11 ».
- Jamais plus de 3 mots.

## Accessibilité
- Le libellé est du texte réel, lu par les lecteurs d'écran ; l'icône est décorative (`aria-hidden`).
- Contrastes contrôlés : `on-subtle` sur `subtle` ≥ 4,5:1 ; `solid` sur `bg.surface` ≥ 3:1, dans les deux thèmes.
- Distinction sans couleur : chaque statut a une forme d'icône différente. Les couleurs de statut restent distinguables en protanopie, deutéranopie et tritanopie (contrôle `checks.categorical` « statuts »).

## Web
`<span class="fd-badge fd-badge--en-retard"><svg class="fd-icon">…</svg>En retard</span>`.

## Mobile
Même rendu. Dans une liste dense, version compacte possible (icône + libellé sans fond) en gardant la couleur `color.<statut>.text`.

## Ne pas faire
- Un point de couleur seul pour indiquer un statut.
- Inventer un statut localement : un nouveau statut s'ajoute dans les tokens (`color.statut.*`) et dans cette spec.
