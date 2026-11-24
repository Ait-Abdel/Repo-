# Bouton
Déclenche une action : enregistrer, valider, créer, supprimer.

## Quand l'utiliser
- Pour une action. Pour aller vers une autre page, utiliser un lien (qui peut avoir l'apparence d'un bouton fantôme).
- Un seul bouton **accent** par écran (« Nouveau chantier ») ; un seul bouton **primaire** par zone d'action.
- Ne pas l'utiliser pour un choix entre options (→ sélecteur, boutons radio, onglets).

## Anatomie
1. Conteneur · 2. Icône (optionnelle, avant le libellé) · 3. Libellé · 4. Indicateur de chargement (remplace l'icône)

## Variantes
| Variante | Usage | Fond / texte / bordure |
|---|---|---|
| Accent | la création principale de l'écran | `color.accent.solid` / `color.accent.on-solid` / — |
| Primaire | l'action principale d'un formulaire ou d'une carte | `color.primary.solid` / `color.primary.on-solid` / — |
| Secondaire (défaut) | actions courantes | `color.bg.surface` / `color.fg.default` / `color.border.default` |
| Fantôme | action tertiaire, annuler | transparent / `color.primary.text` / — |
| Danger | suppression, action irréversible | `color.danger.solid` / `color.danger.on-solid` / — |

## Tailles
| Taille | bureau | terrain | Usage |
|---|---|---|---|
| sm | `size.control.sm` 32 px | 48 px | barres d'outils, tableaux |
| md (défaut) | `size.control.md` 40 px | 56 px | partout ailleurs |
| lg | `size.control.lg` 48 px | 64 px | action principale d'un écran mobile |

Padding horizontal : `layout.control-padding-x`. Texte : `text.label`. Rayon : `radius.md`. Icône : `size.icon.md`, écart `space.2`. Largeur minimale : `size.touch-target`. Bouton icône seul : carré de `size.control.*`.

## États
| État | Changement visuel | Tokens |
|---|---|---|
| Repos | — | voir variantes |
| Survol (web) | fond plus foncé | `*.solid-hover`, `color.bg.hover` (secondaire), `color.primary.subtle` (fantôme) |
| Pressé | fond encore plus foncé (primaire), creux (secondaire) | `color.primary.solid-active`, `color.bg.sunken` |
| Focus clavier | anneau de 3 px, décalé de 2 px | `color.border.focus`, `focus-ring.width`, `focus-ring.offset` |
| Désactivé | fond creux, texte éteint, curseur interdit | `color.bg.sunken`, `color.fg.disabled`, `color.border.subtle` |
| Chargement | indicateur rotatif à la place de l'icône, libellé au participe (« Envoi… »), non recliquable | `aria-busy="true"` |

## Contenu
- Un verbe à l'infinitif + un complément : « Valider le rapport », « Ajouter une photo ». Pas de « OK » ni de « Soumettre ».
- 1 à 4 mots, sans point final, majuscule initiale seulement.
- Une suppression nomme l'objet : « Supprimer la réserve ».

## Accessibilité
- Élément natif `<button type="button|submit">` (web), `Pressable` / `Button` avec `accessibilityRole="button"` (mobile).
- Bouton icône seul : nom accessible obligatoire (`aria-label="Ajouter une photo"`).
- Désactivé : préférer un bouton actif qui explique ce qui manque. Si le bouton est désactivé, un texte à côté dit pourquoi.
- Contraste vérifié : `on-solid` sur `solid`, `solid-hover` et `solid-active` ≥ 4,5:1 dans les deux thèmes.

## Web
`<button class="fd-btn fd-btn--primary">`, modificateurs `--sm`, `--lg`, `--block`, `--icon`. Survol et focus avec `:hover` et `:focus-visible`. Dans un formulaire, `Entrée` déclenche le bouton `submit`.

## Mobile
- Densité terrain par défaut : 56 px de haut, 64 px (`lg`) pour l'action principale en bas d'écran, pleine largeur dans la zone du pouce.
- État pressé visible immédiatement (pas de survol). Retour haptique léger sur les validations.
- iOS : pas de bordure sur le secondaire si la plateforme le rend plus natif, mais garder `color.border.default` dans les listes.
- Android : effet d'ondulation (ripple) avec `color.primary.subtle`.

## Ne pas faire
- Deux boutons accent ou primaires côte à côte.
- Du texte blanc sur l'accent orange : le texte est toujours `color.accent.on-solid` (foncé).
- Un libellé sur deux lignes : raccourcir le texte.
