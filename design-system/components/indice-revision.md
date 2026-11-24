# Indice de révision
Petit triangle rouge portant une lettre (A, B, C…) qui signale qu'un élément a changé depuis la dernière visite, comme l'indice d'un plan révisé.

## Quand l'utiliser
- Sur une ligne, une carte ou un document modifié depuis la dernière consultation de l'utilisateur : date déplacée, quantité changée, nouvelle photo, nouveau commentaire.
- Ne pas l'utiliser pour une erreur (→ message d'erreur) ni pour un retard (→ statut « en retard »).

## Anatomie
1. Triangle : contour `color.danger.solid`, fond `color.bg.surface` · 2. Lettre d'indice en `color.danger.text`, mono gras

## Variantes
| Variante | Usage |
|---|---|
| Avec lettre | documents et objets versionnés (indice B, C…) |
| Sans lettre | simple « modifié » dans une liste |

## Tailles
1,4 em de large, aligné sur le texte qu'il suit (titre de ligne, méta de carte).

## États
Disparaît quand l'utilisateur a ouvert l'élément. Un survol ou un appui affiche ce qui a changé (« Date déplacée du 18/11 au 02/12 »).

## Tokens
`color.danger.solid`, `color.danger.text`, `color.bg.surface`, `font.family.mono`.

## Accessibilité
- Nom accessible explicite : « Modifié, indice B ». Il n'est jamais porté seulement par la couleur : la forme triangulaire et la lettre suffisent.
- Le détail du changement est disponible au clavier (bouton ou infobulle focusable).

## Web
`<svg class="fd-indice" viewBox="0 0 24 22" role="img" aria-label="Modifié, indice B"><path d="M12 1.5 22.5 20.5h-21z"/><text x="12" y="17.5" text-anchor="middle">B</text></svg>`

## Mobile
Même dessin, après le titre. Le détail s'ouvre dans une bottom sheet.

## Ne pas faire
- L'utiliser comme simple point de notification décoratif.
- Plus d'un indice par ligne.
