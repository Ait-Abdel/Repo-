# Cote d'avancement
Montre l'avancement réalisé et l'écart au prévu, dessinés comme une cote de plan : ligne à barbules obliques, partie réalisée en trait épais, valeur écrite au-dessus, prévu en pointillé en dessous.

## Quand l'utiliser
- Avancement d'un chantier, d'un lot, d'une tâche (0–100 %), consommation d'une quantité ou d'un budget.
- Ne pas l'utiliser pour un chargement technique (→ indicateur de chargement).

## Anatomie
1. Ligne de cote (`border-width.regular`, `color.border.strong`) · 2. Barbules obliques aux deux extrémités (`motif.cote.barbule`) · 3. Partie réalisée, trait de `motif.cote.trait` · 4. Valeur au-dessus du trait (`text.reference` semi-gras) · 5. Repère du prévu : pointillé vertical et libellé « PRÉVU 70 » sous la ligne (`text.overline`)

## Variantes
| Variante | Partie réalisée | Valeur |
|---|---|---|
| Normale | `color.primary.solid` (encre) | `color.fg.default` |
| En retard (réalisé < prévu au-delà du seuil produit) | `color.statut.en-retard.solid` | `color.danger.text` |
| Terminée | `color.statut.termine.solid` | `color.fg.default` |

## Tailles
Hauteur totale ≈ 58 px. En densité terrain, les traits passent à `border-width.thick`.

## États
Statique, sans animation de remplissage.

## Contenu
Valeur en chiffres tabulaires avec espace insécable avant « % ». Le prévu est toujours écrit (« PRÉVU 70 ») : la couleur seule ne dit pas qu'on est en retard.

## Accessibilité
`role="img"` avec un nom complet : « Avancement 41 %, prévu 70 % ». Ou `role="progressbar"` + `aria-valuenow` si la valeur change en direct. Partie réalisée ≥ 3:1 sur la surface.

## Web
`<div class="fd-cote fd-cote--en-retard" style="--v:41;--p:70">` > `.fd-cote__val` + `.fd-cote__plan > span` + `.fd-cote__trait` (> `.fd-cote__fait` + deux `.fd-cote__barbule`). La valeur est contenue dans la ligne, même à 0 % ou 100 %.

## Mobile
Identique, pleine largeur. Dessin natif possible (Canvas / CustomPainter / Path) avec les mêmes tokens.

## Ne pas faire
- Une barre arrondie ou un dégradé du vert au rouge.
- Une cote sans valeur écrite.
