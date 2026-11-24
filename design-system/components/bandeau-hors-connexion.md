# Bandeau hors connexion
Prévient que l'appareil n'est plus connecté, que les saisies sont gardées et indique combien restent à synchroniser.

## Quand l'utiliser
- Dès que la connexion est perdue, en haut du contenu de l'écran courant.
- Variante « synchronisé » quelques secondes au retour de la connexion.
- Pas pour une erreur ponctuelle d'enregistrement (→ toast ou erreur de champ).

## Anatomie
1. Icône « nuage barré » · 2. Texte : état en gras + conséquence · 3. Action « Réessayer » en contour (optionnelle)

## Variantes
| Variante | Fond / texte / cadre |
|---|---|
| Hors connexion | `color.warning.subtle` / `color.warning.on-subtle` / `color.warning.border` |
| Synchronisé | `color.success.subtle` / `color.success.on-subtle` / `color.success.border` |

## Tailles
Cadre `border-width.thick`, `radius.none`, padding `space.3` × `space.4`, texte `text.body-sm`, bouton `size.control.sm`.

## États
« Réessayer » passe en chargement (`aria-busy`) pendant la tentative.

## Contenu
« **Hors connexion.** 3 éléments en attente de synchronisation. » / « **Synchronisé.** 3 éléments envoyés. » Jamais « Erreur réseau ».

## Accessibilité
`role="status"`, sans son. L'état est porté par l'icône et le texte, pas seulement la couleur.

## Web
`.fd-banner` (+ `--synced`) > icône + `.fd-banner__text` + `.fd-banner__action`.

## Mobile
Détection réseau native ; les éléments en attente sont aussi marqués « à synchroniser » dans les listes. Le bandeau ne bloque jamais la saisie.

## Ne pas faire
Une modale bloquante « Pas de connexion » ; masquer le compteur.
