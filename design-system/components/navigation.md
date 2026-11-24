# Navigation principale
Donne accès aux grandes rubriques : Chantiers, Planning, Réserves, Photos, Équipe (et, sur web, Documents, Achats, Paramètres).

## Quand l'utiliser
Une seule navigation principale par application, toujours visible sur les écrans de premier niveau.

## Anatomie
- **Web desktop (≥ `breakpoint.lg`)** : barre latérale fixe (logo, rubriques avec icône + libellé, sélecteur de chantier, compte en bas) + barre supérieure (recherche, notifications).
- **Web tablette (`md` → `lg`)** : barre latérale réduite aux icônes, libellés en infobulle, ou tiroir.
- **Mobile et web < `md`** : barre d'onglets en bas, 5 entrées maximum (icône + libellé + pastille de compteur).

## Variantes
| Élément | Repos | Actif |
|---|---|---|
| Entrée d'onglet | icône + libellé `color.fg.muted` | `color.primary.text`, semi-gras, trait supérieur `color.primary.solid` |
| Compteur | — | pastille `color.danger.solid` / `on-solid`, chiffre |

## Tailles
| | bureau | terrain |
|---|---|---|
| Hauteur d'un onglet | `size.control.lg` 48 px | 64 px |
| Icône | `size.icon.md` 20 px | 24 px |
| Libellé | `text.caption` | `text.caption` (14 px) |
| Largeur barre latérale | 240 px (à tokeniser lors de sa spec détaillée) | — |

## États
| État | Changement |
|---|---|
| Actif | couleur primaire, semi-gras, trait de `border-width.thick` |
| Pressé | fond `color.bg.hover` |
| Focus | anneau `color.border.focus` |

## Contenu
Libellés d'un mot (« Réserves », pas « Mes réserves en cours »). Les rubriques sont les mêmes sur web et mobile, dans le même ordre.

## Accessibilité
- `<nav aria-label="Navigation principale">`, entrée active avec `aria-current="page"`.
- Le compteur est inclus dans le nom accessible (« Réserves, 4 nouvelles »).
- La barre du bas respecte la zone sûre (`env(safe-area-inset-bottom)`).

## Web
`.fd-tabbar` / `.fd-tabbar__item` / `.fd-tabbar__badge` pour la barre du bas (web mobile et démonstration). Barre latérale : à implémenter selon cette spec.

## Mobile
- iOS : `UITabBar` / onglets de la navigation choisie (Expo Router `Tabs`, Flutter `NavigationBar`, Compose `NavigationBar`), stylés avec les tokens.
- Les rubriques au-delà de 5 vont dans un onglet « Plus » ou dans l'écran Chantier.
- La barre reste visible pendant la saisie ; elle se masque seulement quand le clavier est ouvert.

## Ne pas faire
- Un menu « hamburger » comme navigation principale sur mobile.
- Des icônes sans libellé.
