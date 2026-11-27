# Navigation principale
Donne accès aux grandes rubriques : Chantiers, Planning, Réserves, Photos, Équipe (et, sur web, Documents, Achats, Paramètres). Le cadre de l'application (`color.chrome.*`) est anthracite dans les deux thèmes.

## Quand l'utiliser
Une seule navigation principale, toujours visible sur les écrans de premier niveau.

## Anatomie
- **Web desktop (≥ `breakpoint.lg`)** : barre latérale anthracite (nom du produit, rubriques icône + libellé, sélecteur de chantier, compte), contenu sur le béton.
- **Web tablette** : barre latérale réduite aux icônes, ou tiroir.
- **Mobile et web < `md`** : en-tête anthracite (`.fd-mhead` : sur-titre, nom du chantier, un chiffre clé) + barre d'onglets du bas, 5 entrées maximum.

## Variantes
| Élément | Repos | Actif |
|---|---|---|
| Entrée | icône + libellé `color.chrome.fg-muted` | `color.chrome.fg` en gras + trait supérieur `border-width.thick` en `color.chrome.indicator` (corten) |
| Compteur | — | pastille `color.danger.solid` / `on-solid` |

## Tailles
| | bureau | terrain |
|---|---|---|
| Hauteur d'onglet | `size.control.lg` 48 px | 64 px |
| Icône | 20 px | 24 px |

## États
Actif (voir ci-dessus), pressé (fond `color.chrome.fg-muted` à faible opacité ou effet natif de la plateforme), focus (`color.border.focus`).

## Contenu
Libellés d'un mot, mêmes rubriques et même ordre sur web et mobile.

## Accessibilité
Lien d'évitement « Aller au contenu » en premier élément de chaque page (`.fd-skip-link`, visible au focus clavier). `<nav aria-label="Navigation principale">`, `aria-current="page"`, compteur inclus dans le nom (« Réserves, 4 nouvelles »), zone sûre du bas respectée. Avec une barre d'onglets fixe, la page porte `scroll-padding-bottom` (classe `.fd-has-tabbar`) pour que l'élément focalisé ne passe jamais dessous (WCAG 2.4.11).

## Web
`.fd-tabbar` / `.fd-tabbar__item` / `.fd-tabbar__badge` ; en-tête mobile `.fd-mhead`. Barre latérale : à implémenter selon cette spec, avec les mêmes tokens `color.chrome.*`.

## Mobile
Composant d'onglets de la techno choisie (Expo Router `Tabs`, Flutter `NavigationBar`, Compose `NavigationBar`), stylé avec `color.chrome.*`.

## Ne pas faire
Un menu « hamburger » comme navigation principale sur mobile ; des icônes sans libellé.
