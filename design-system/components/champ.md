# Champ de saisie
Saisie d'une valeur courte (texte, nombre, quantité avec unité) avec son libellé, son aide et son erreur.

## Quand l'utiliser
- Quantités, références, noms, dates saisies au clavier.
- Ne pas l'utiliser pour une liste fermée (→ sélecteur) ni un texte long (→ zone de texte).

## Anatomie
1. Libellé (+ « facultatif ») · 2. Cadre à angles vifs · 3. Zone de saisie · 4. Cellule d'unité en mono (m², ml, m³, kg, t, u, h, %) · 5. Aide · 6. Erreur avec icône triangle

## Variantes
| Variante | Tokens |
|---|---|
| Texte | `color.bg.surface`, cadre `border-width.regular` en `color.border.strong` |
| Avec unité | cellule `color.bg.sunken`, filet `color.border.strong`, `text.reference` en `color.fg.muted` |
| Lecture seule / désactivé | `color.bg.sunken`, `color.border.subtle`, `color.fg.disabled` |

## Tailles
| | bureau | terrain |
|---|---|---|
| Hauteur | `size.control.md` 40 px | 56 px |
| Cadre | 1,5 px | 2 px |
| Texte saisi | `text.body` 16 px | 18 px |
| Espace entre champs | `layout.stack` 16 px | 20 px |

## États
| État | Changement |
|---|---|
| Focus | anneau autour du cadre entier, unité comprise (`color.border.focus`) |
| Erreur | cadre `border-width.thick` en `color.danger.border`, message `color.danger.text` |
| Placeholder | exemple de format en `color.fg.subtle`, jamais la consigne |

## Contenu
Libellé visible en casse normale ; on marque les champs facultatifs. Erreur = problème + valeur de référence (« Supérieure au bon de commande (10 t) »). Nombres au format français.

## Accessibilité
`<label for>`, `aria-describedby` pour l'aide et l'erreur, `aria-invalid="true"`, `inputmode="decimal"` pour les quantités. L'erreur est signalée par l'icône, le texte et le cadre épais.

## Web
`.fd-field` > `.fd-field__label` + `.fd-field__control` (> `.fd-input` + `.fd-field__unit`) + `.fd-field__help` / `.fd-field__error`.

## Mobile
Clavier décimal, bouton « Suivant », champ visible au-dessus du clavier. Avec des gants, boutons − / + de 56 px autour des quantités fréquentes.

## Ne pas faire
- Un libellé dans le placeholder.
- Une unité tapée dans la valeur.
