# Bouton
Déclenche une action : enregistrer, valider, créer, supprimer. Angles vifs, libellé en capitales.

## Quand l'utiliser
- Pour une action. Pour aller vers une autre page, utiliser un lien.
- **Un seul bouton corten (accent) par écran** : la création ou l'action de terrain principale (« Nouveau chantier », « Ajouter au rapport »).
- Un seul bouton encre (primaire) par zone d'action.

## Anatomie
1. Conteneur à angles vifs · 2. Icône (optionnelle, avant le libellé) · 3. Libellé en capitales · 4. Indicateur de chargement

## Variantes
| Variante | Usage | Fond / texte / bordure |
|---|---|---|
| Accent (corten) | l'action mise en avant de l'écran | `color.accent.solid` / `color.accent.on-solid` |
| Primaire (encre) | valider, enregistrer | `color.primary.solid` / `color.primary.on-solid` |
| Secondaire (défaut) | actions courantes | `color.bg.surface` / `color.fg.default` / `color.border.default` |
| Fantôme | action tertiaire, annuler | transparent / `color.primary.text` |
| Danger | suppression | `color.bg.surface` / `color.danger.text` / `color.danger.border` : **toujours en contour**, pour ne jamais se confondre avec le corten |

## Tailles
| Taille | bureau | terrain | Usage |
|---|---|---|---|
| sm | `size.control.sm` 32 px | 48 px | barres d'outils, tableaux |
| md (défaut) | 40 px | 56 px | partout ailleurs |
| lg | 48 px | 64 px | action principale d'un écran mobile, pleine largeur |

Padding `layout.control-padding-x`, libellé `text.label` en capitales (`letter-spacing` wide), bordure `border-width.regular`, `radius.none`, largeur minimale `size.touch-target`.

## États
| État | Changement visuel | Tokens |
|---|---|---|
| Survol (web) | fond plus foncé | `*.solid-hover`, `color.bg.hover`, `color.danger.subtle` |
| Pressé | fond plus profond | `color.primary.solid-active`, `color.bg.sunken` |
| Focus clavier | anneau de 3 px décalé de 2 px | `color.border.focus`, `focus-ring.*` |
| Désactivé | fond creux, texte éteint | `color.bg.sunken`, `color.fg.disabled` |
| Chargement | indicateur rotatif, libellé au participe terminé par « … » (« ENVOI… »), bouton **désactivé pendant l'envoi** (pas de double enregistrement) tout en gardant l'apparence de sa variante | `aria-busy="true"` + `disabled` |

## Actions destructrices
Une suppression n'est jamais immédiate et définitive. Si l'action est réversible, on l'exécute et on affiche un toast « Réserve supprimée · Annuler » pendant 8 secondes. Si elle est irréversible (purge, envoi au client), on demande confirmation dans un dialogue qui nomme l'objet et dont le bouton répète le verbe (« Supprimer le chantier »).

Un bouton de validation reste actif tant que l'envoi n'a pas commencé : on valide au clic et on montre les erreurs, plutôt que de le désactiver tant que le formulaire est incomplet.

## Contenu
Verbe à l'infinitif + complément, 1 à 4 mots : « Valider le rapport ». Le texte source est en casse normale ; les capitales sont appliquées en CSS.

## Accessibilité
`<button>` natif ; bouton icône seul avec `aria-label`. Contrastes `on-solid` / `solid`, `solid-hover`, `solid-active` contrôlés dans les deux thèmes.

## Web
`.fd-btn` + `--accent`, `--primary`, `--danger`, `--ghost`, `--sm`, `--lg`, `--block`, `--icon`.

## Mobile
Densité terrain : 56 px, et 64 px pleine largeur pour l'action principale en bas d'écran. L'état pressé doit être visible immédiatement, avec un retour haptique léger sur les validations.

## Ne pas faire
- Deux boutons corten sur le même écran.
- Un bouton danger en aplat rouge.
- Arrondir les angles.
