# Bulle de repère (métier)
Identifie le corps d'état d'une tâche, d'une réserve ou d'un lot, comme les bulles de repère d'un plan : un cercle à anneau de couleur et un code de 2 ou 3 lettres.

## Quand l'utiliser
- Partout où un métier apparaît : cartes, lignes, filtres, planning.
- L'**anneau** désigne la famille (8 familles + autre), le **code** désigne le métier. Le libellé complet s'ajoute à côté quand la place le permet.

## Anatomie
1. Cercle (`radius.full`, diamètre `size.repere`) · 2. Anneau `border-width.thick` en `color.metier.<famille>.solid` · 3. Code en mono semi-gras, `color.fg.default`, sur `color.bg.surface` · 4. Libellé (optionnel, `text.body-sm`)

## Variantes
| Variante | Usage |
|---|---|
| Bulle seule | cartes, cellules, planning |
| Bulle + libellé | listes, filtres, fiches |

Familles : `gros-oeuvre` (brique), `structure` (bois), `electricite` (jaune), `exterieurs` (feuille), `fluides` (eau), `enveloppe` (ardoise), `amenagement` (lavande), `finitions` (framboise), `autre` (béton).

Codes de référence :

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

La correspondance métier → famille est une **donnée du produit**, modifiable par entreprise, pas un token.

## Tailles
`size.repere` : 32 px (bureau), 40 px (terrain). Code en 12 px.

## États
Statique. En filtre, la bulle est contenue dans une puce de filtre qui porte l'état sélectionné.

## Accessibilité
- Le code est du texte ; sans libellé visible, le nom complet est le nom accessible (`aria-label="Plomberie"`).
- Anneaux ≥ 3:1 sur `bg.surface` et `bg.raised` dans les deux thèmes. Les 8 familles restent distinguables en vision normale (ΔE ≥ 0,08) ; en vision daltonienne, c'est le code qui garantit la lecture.

## Web
`<span class="fd-repere fd-repere--fluides">PLO</span>`, avec libellé : `<span class="fd-repere-label"><span class="fd-repere fd-repere--fluides">PLO</span>Plomberie</span>`.

## Mobile
Même rendu, 40 px. Dans le planning, la barre utilise `color.metier.*.subtle` avec un filet `.solid`, et la bulle se place en tête de ligne.

## Ne pas faire
- Écrire du texte sur un aplat `.solid`.
- Ajouter une 9ᵉ couleur : rattacher le métier à une famille.
