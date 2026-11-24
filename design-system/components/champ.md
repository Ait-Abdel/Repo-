# Champ de saisie
Saisie d'une valeur courte (texte, nombre, quantité avec unité) avec son libellé, son aide et son erreur.

## Quand l'utiliser
- Quantités, références, noms, dates saisies au clavier.
- Ne pas l'utiliser pour choisir parmi une liste fermée (→ sélecteur) ni pour un texte long (→ zone de texte).

## Anatomie
1. Libellé (+ « facultatif ») · 2. Conteneur · 3. Zone de saisie · 4. Unité (m², ml, m³, kg, t, u, h, %) · 5. Aide · 6. Message d'erreur avec icône

## Variantes
| Variante | Usage | Tokens |
|---|---|---|
| Texte | saisie libre | conteneur `color.bg.surface`, bordure `color.border.strong` |
| Avec unité | quantités du chantier | unité sur `color.bg.sunken`, texte `color.fg.muted`, séparateur `color.border.subtle` |
| Lecture seule | valeur héritée, non modifiable | `color.bg.sunken`, texte `color.fg.default` |

## Tailles
| | bureau | terrain |
|---|---|---|
| Hauteur | `size.control.md` 40 px | 56 px |
| Texte saisi | `text.body` 16 px | 18 px |
| Libellé | `text.label` 14 px | 16 px |
| Espace entre champs | `layout.stack` 16 px | 20 px |

## États
| État | Changement visuel | Tokens |
|---|---|---|
| Repos | bordure fine | `color.border.strong` (≥ 3:1) |
| Focus | anneau autour du conteneur entier, unité comprise | `color.border.focus`, `focus-ring.*` |
| Erreur | bordure épaisse rouge + message sous le champ | `border-width.thick`, `color.danger.border`, `color.danger.text` |
| Désactivé | fond creux, texte éteint | `color.bg.sunken`, `color.fg.disabled` |
| Placeholder | exemple de format, jamais la consigne | `color.fg.subtle` |

## Contenu
- Libellé court et toujours visible ; le placeholder ne remplace jamais le libellé.
- On marque les champs **facultatifs** (« (facultatif) »), pas les obligatoires.
- Erreur : ce qui ne va pas et comment corriger, avec la valeur de référence : « Supérieure au bon de commande (10 t) ».
- Nombres au format français (virgule décimale, espace fine pour les milliers), chiffres tabulaires.

## Accessibilité
- `<label for>` relié au champ. Aide et erreur reliées par `aria-describedby`. En erreur : `aria-invalid="true"`.
- L'unité est un texte visible lu après le champ ; pour un lecteur d'écran, l'inclure dans le libellé si besoin (« Surface coulée, en mètres carrés »).
- Clavier adapté : `inputmode="decimal"` pour les quantités, `numeric` pour les entiers.
- L'erreur n'est pas portée que par la couleur : icône + texte + bordure plus épaisse.

## Web
Structure `.fd-field` > `.fd-field__label` + `.fd-field__control` (> `.fd-input` + `.fd-field__unit`) + `.fd-field__help` / `.fd-field__error`. Validation au moment où l'on quitte le champ, pas à chaque frappe.

## Mobile
- iOS : `keyboardType="decimalPad"` ; Android : `inputType="numberDecimal"`. Bouton « Suivant » du clavier pour passer au champ suivant.
- Le champ actif reste visible au-dessus du clavier (défilement automatique).
- Gants : 56 px de haut minimum ; pour les quantités fréquentes, proposer des boutons − / + autour du champ.
- Dictée vocale autorisée sur les champs texte.

## Ne pas faire
- Un libellé dans le placeholder qui disparaît à la saisie.
- Une unité tapée par l'utilisateur dans la valeur (« 12 t ») : l'unité est fixe.
- Un message d'erreur générique (« Champ invalide »).
