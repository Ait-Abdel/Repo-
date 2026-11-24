# Barre d'avancement
Montre le pourcentage réalisé d'un chantier, d'un lot ou d'une tâche, et l'écart au prévu.

## Quand l'utiliser
- Avancement physique déclaré (0–100 %), consommation d'un budget ou d'une quantité.
- Ne pas l'utiliser pour un chargement technique (→ indicateur de chargement).

## Anatomie
1. Libellé (« Avancement ») et précision (« prévu 70 % ») · 2. Valeur en % · 3. Piste · 4. Remplissage

## Variantes
| Variante | Remplissage | Usage |
|---|---|---|
| Normale | `color.primary.solid` | dans les temps |
| En retard | `color.statut.en-retard.solid` | réalisé < prévu au-delà du seuil défini par le produit |
| Terminée | `color.statut.termine.solid` | 100 % et réceptionné |

Piste : `color.bg.sunken` + contour intérieur `color.border.subtle` (visible sur toutes les surfaces). Hauteur `space.2` (8 px), rayon `radius.full`.

## États
Statique. Pas d'animation de remplissage au chargement (information, pas décoration).

## Contenu
- Valeur en chiffres tabulaires, espace insécable avant « % » (« 62 % »).
- En retard : le prévu est écrit en clair dans le libellé ; la couleur seule ne suffit pas.

## Accessibilité
- `role="progressbar"` avec `aria-valuenow`, `aria-valuemin`, `aria-valuemax` et un nom (`aria-label`).
- Le remplissage a ≥ 3:1 sur la piste et sur `bg.surface`.

## Web
`.fd-progress` (+ `--en-retard`, `--termine`) > `.fd-progress__head` + `.fd-progress__track` > `.fd-progress__bar` (largeur en style inline ou variable CSS).

## Mobile
Identique. Sur une carte de liste mobile, le libellé peut passer sur une seule ligne : « 41 % · prévu 70 % ».

## Ne pas faire
- Un dégradé du vert au rouge selon la valeur.
- Une barre sans valeur chiffrée.
