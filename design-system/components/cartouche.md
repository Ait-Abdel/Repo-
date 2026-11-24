# Cartouche
En-tête d'identité d'un objet (chantier, lot, réserve, document) en grille, comme le cartouche d'un plan : projet, référence, lot, indice, statut.

## Quand l'utiliser
- En haut de toute fiche d'objet.
- Ne pas l'utiliser dans une liste ou une carte (→ sur-titre `text.overline` + titre).

## Anatomie
1. Cadre et filets (`color.border.joint`) · 2. Cellule projet sur toute la largeur : clé + titre (`text.title-1`) · 3. Cellules : clé (`text.overline`, `color.fg.muted`, capitales) + valeur (`text.reference` semi-gras) · 4. Statut dans la dernière cellule

Cellules par défaut, dans cet ordre : PROJET · RÉF. · LOT · INDICE (lettre et date de la dernière révision) · STATUT. Un document ajoute ÉCHELLE ou PHASE (APS, APD, PRO, EXE, DOE).

## Variantes
| Variante | Contenu |
|---|---|
| Fiche chantier | projet, réf., lot ou phase, indice, statut |
| Fiche réserve | intitulé, localisation, métier (repère), échéance, statut |
| Compact (mobile) | deux cellules : objet + indice |

## Tailles
| | bureau | terrain |
|---|---|---|
| Filets | `border-width.regular` 1,5 px | `border-width.thick` 2 px |
| Colonnes | 4 (2 sous 560 px) | 2 |
| Padding des cellules | `space.2` × `space.3` | idem |

## États
Statique. L'indice passe en rouge révision (`fd-indice`) quand l'objet a changé depuis la dernière visite de l'utilisateur.

## Tokens
`color.border.joint`, `color.bg.surface`, `color.fg.muted`, `color.fg.default`, `text.overline`, `text.reference`, `text.title-1`.

## Contenu
- Clés en capitales abrégées, comme sur un plan : RÉF., IND., ÉCH.
- Valeurs courtes ; le titre de projet passe sur deux lignes au maximum.

## Accessibilité
- Structure sémantique : le titre est le `h1` de la page ; les paires clé/valeur sont une liste de définitions (`<dl>`) ou des `<span>` avec une clé lue avant la valeur.
- Les capitales sont appliquées en CSS (`text-transform`), le texte source reste en casse normale pour les lecteurs d'écran.

## Web
`.fd-cartouche` > `.fd-cartouche__cell` (+ `--projet`) > `.fd-cartouche__k` + `.fd-cartouche__v` ou `.fd-cartouche__titre`. Les filets viennent du `gap` sur fond de joint.

## Mobile
Version compacte dans l'en-tête de l'écran (`color.chrome.*`) ; le cartouche complet est accessible en touchant l'en-tête.

## Ne pas faire
- Plus de 6 cellules : le reste va dans la fiche.
- Des cellules vides : retirer la cellule.
