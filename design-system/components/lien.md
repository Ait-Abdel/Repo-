# Lien
Mène vers une autre page ou ressource depuis un texte ; toujours souligné, pour ne jamais être distingué par la seule couleur.

## Quand l'utiliser
- Navigation dans du texte courant. Pour une action, utiliser un bouton ; pour une carte entière, le lien étendu de la carte (`fd-card__link`).

## Anatomie
1. Texte du lien en `color.fg.link` · 2. Soulignement `border-width.thin`, décalé de 0,2 em

## États
| État | Changement |
|---|---|
| Survol (web) | soulignement en `border-width.thick` |
| Focus clavier | anneau `color.border.focus` |
| Visité | identique (outil de travail, pas de site éditorial) |

## Contenu
Le texte du lien dit où il mène (« Voir l'inventaire des composants »), jamais « cliquez ici ».

## Accessibilité
Soulignement obligatoire (WCAG 1.4.1). Un lien qui ouvre un nouvel onglet l'annonce (« (nouvel onglet) » en `fd-sr-only`).

## Utilitaires associés
- `.fd-skip-link` : « Aller au contenu », premier élément de chaque page, visible au focus.
- `.fd-sr-only` : texte réservé aux lecteurs d'écran (dates complètes, unités en toutes lettres, contexte d'un bouton icône).

## Web
`<a class="fd-link" href="…">`.

## Mobile
Liens rares dans l'app : préférer des lignes de liste ou des boutons. Lorsqu'il y en a, même règle de soulignement.

## Ne pas faire
Retirer le soulignement ; coloriser un lien en corten.
