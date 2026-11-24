# Bandeau hors connexion
Prévient que l'appareil n'est plus connecté, que les saisies sont gardées et indique combien restent à synchroniser.

## Quand l'utiliser
- Dès que la connexion est perdue, en haut du contenu de l'écran courant (sous la barre de titre).
- Variante « synchronisé » quelques secondes au retour de la connexion, puis le bandeau disparaît.
- Ne pas l'utiliser pour une erreur ponctuelle d'enregistrement (→ toast ou erreur de champ).

## Anatomie
1. Icône « nuage barré » · 2. Texte : état en gras + conséquence · 3. Action « Réessayer » (optionnelle)

## Variantes
| Variante | Fond / texte / bordure |
|---|---|
| Hors connexion | `color.warning.subtle` / `color.warning.on-subtle` / `color.warning.border` |
| Synchronisé | `color.success.subtle` / `color.success.on-subtle` / `color.success.border` |

## Tailles
Padding `space.3` × `space.4`, rayon `radius.md`, texte `text.body-sm`, bouton d'action `size.control.sm`.

## États
Le bouton « Réessayer » passe en chargement (`aria-busy`) pendant la tentative.

## Contenu
- « **Hors connexion.** 3 éléments en attente de synchronisation. »
- « **Synchronisé.** 3 éléments envoyés. »
- Jamais « Erreur réseau » : l'utilisateur doit comprendre que son travail n'est pas perdu.

## Accessibilité
- `role="status"` : annoncé sans interrompre. Pas de son.
- Le changement d'état est porté par l'icône et le texte, pas seulement par la couleur.

## Web
`.fd-banner` (+ `--synced`) > icône + `.fd-banner__text` + `.fd-banner__action`. Détection via `navigator.onLine` + événements `online` / `offline`, confirmée par l'échec réel des requêtes.

## Mobile
- Détection par l'API réseau de la plateforme (NetInfo, connectivity_plus…).
- Les éléments en attente sont aussi marqués individuellement (« à synchroniser ») dans les listes.
- Le bandeau ne bloque jamais la saisie.

## Ne pas faire
- Une modale bloquante « Pas de connexion ».
- Masquer le compteur : c'est l'information qui rassure.
