# Pastille métier
Identifie le corps d'état concerné par une tâche, une réserve, un lot ou une entreprise.

## Quand l'utiliser
- Sur les cartes, lignes de liste, filtres et barres de planning, chaque fois qu'un objet appartient à un métier.
- La couleur désigne la **famille** (8 familles + « autre ») ; le **code** et le **libellé** désignent le métier.

## Anatomie
1. Fond teinté de la famille · 2. Carré plein de la couleur de famille · 3. Code du métier (2–3 lettres, mono) · 4. Libellé (optionnel)

## Variantes
| Variante | Contenu | Usage |
|---|---|---|
| Complète | carré + code + libellé | listes, fiches, filtres |
| Compacte | carré + code | cartes, cellules de tableau, planning |

Couleurs : `color.metier.<famille>.subtle` (fond), `.on-subtle` (texte), `.solid` (carré, barres de planning). Familles : `gros-oeuvre`, `structure`, `electricite`, `exterieurs`, `fluides`, `enveloppe`, `amenagement`, `finitions`, `autre`.

Correspondance métier → famille et codes de référence :

| Famille | Métiers (code) |
|---|---|
| gros-oeuvre | Terrassement (TER), VRD (VRD), Démolition (DEM), Maçonnerie (MAC), Gros œuvre (GO) |
| structure | Charpente (CHA), Ossature bois (OSB), Serrurerie-métallerie (SER) |
| electricite | Électricité (ELE), Courants faibles (CFA), Photovoltaïque (PV) |
| exterieurs | Espaces verts (EXT), Clôtures (CLO), Piscine (PIS) |
| fluides | Plomberie (PLO), Chauffage (CHF), Ventilation (VMC), Climatisation (CLI) |
| enveloppe | Couverture (COU), Zinguerie (ZIN), Étanchéité (ETA), Façade (FAC), Menuiseries extérieures (MEX) |
| amenagement | Plâtrerie (PLA), Isolation (ISO), Faux plafonds (FPL), Menuiseries intérieures (MIN) |
| finitions | Peinture (PEI), Carrelage (CAR), Sols souples (SOL), Faïence (FAI) |
| autre | Nettoyage (DIV), Échafaudage (ECH), tout métier non classé |

Cette correspondance est une **donnée du produit** (modifiable par entreprise), pas un token.

## Tailles
Texte `text.caption` (12 px bureau, 14 px terrain), code en `font.family.mono` semi-gras, carré de 0,75 em, rayon `radius.sm`.

## États
Statique. En filtre : utiliser une puce de filtre qui contient la pastille et porte l'état sélectionné.

## Contenu
Libellé court (« Plomberie », pas « Plomberie sanitaire et chauffage ») ; tronqué avec points de suspension au-delà de la largeur disponible, le code restant visible.

## Accessibilité
- Le code et le libellé sont du texte ; en compacte, ajouter le libellé complet comme nom accessible (`aria-label="Plomberie"`) ou en infobulle.
- Contrastes contrôlés : `on-subtle` sur `subtle` ≥ 4,5:1 ; `solid` sur `bg.surface` et `bg.canvas` ≥ 3:1, dans les deux thèmes.
- 8 couleurs au maximum : l'écart minimal mesuré est ΔE 0,08 (clair) / 0,10 (sombre) en vision normale et ≥ 0,04 en vision daltonienne. C'est suffisant **parce que** le code est toujours présent.

## Web
`<span class="fd-metier fd-metier--fluides"><span class="fd-metier__swatch"></span><span class="fd-metier__code">PLO</span><span class="fd-metier__label">Plomberie</span></span>`.

## Mobile
Même rendu ; en compacte dans les cartes. Dans un planning sur téléphone, la barre utilise `.solid` et le code s'affiche à côté, pas dedans.

## Ne pas faire
- Écrire du texte blanc sur `.solid` : certaines familles (électricité, finitions) n'ont pas le contraste suffisant.
- Ajouter une 9ᵉ couleur de famille : rattacher le métier à une famille existante.
