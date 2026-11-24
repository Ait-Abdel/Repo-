# Brief — Fondation BTP

> Nom de travail du design system. À remplacer par le nom du produit dès qu'il est choisi : `name` et `prefix` dans `ds.config.json`.

## Produit

SaaS de gestion de chantier pour les entreprises du bâtiment de tous les corps d'état : planning, suivi d'avancement, équipes et sous-traitants, réserves et levées de réserves, photos, rapports journaliers, documents (plans, PV, DOE), commandes et livraisons.

Deux surfaces, un seul système :
- **application web** (priorité 1), utilisée surtout au bureau, aussi sur tablette en réunion de chantier ;
- **application mobile iOS / Android** (priorité 2, si le web fonctionne), utilisée sur le chantier. Techno pas encore choisie : voir le skill `ds-mobile`.

## Utilisateurs et contextes

| Profil | Tâche fréquente | Tâche critique | Contexte | Plateforme |
|---|---|---|---|---|
| Gérant, dirigeant de TPE/PME | voir l'état de tous les chantiers | repérer un chantier en retard ou en dépassement | bureau, souris | web desktop |
| Conducteur de travaux | planifier les lots, coordonner les métiers | décaler une phase sans casser le planning | bureau + tablette sur chantier | web desktop, tablette |
| Chef de chantier, chef d'équipe | rapport du jour, photos, réserves | signaler un blocage (livraison, sécurité) | extérieur, debout, une main | mobile |
| Compagnon, ouvrier | voir ses tâches du jour, pointer | lever une réserve avec photo | extérieur, gants, poussière, soleil | mobile |
| Sous-traitant | voir ses lots et ses réserves | déclarer une réserve levée | variable, accès limité | mobile, web |
| Client, maître d'ouvrage | suivre l'avancement | valider une réception | bureau | web (consultation) |

## Contraintes

- **Lisibilité en extérieur** : texte principal à 7:1 minimum sur tous les fonds (WCAG AAA) ; jamais d'information portée par une couleur pâle.
- **Gants et une main** : zones de toucher ≥ 48 px, contrôles de 56 px par défaut sur mobile, actions principales en bas de l'écran.
- **Réseau faible** (sous-sol, zone rurale) : état hors connexion visible, saisies en file d'attente, synchronisation explicite.
- **Daltonisme** : environ 8 % des hommes, et un public très majoritairement masculin sur le terrain. Statuts et métiers sont toujours doublés d'une icône et d'un libellé.
- **Accessibilité** : WCAG 2.2 AA partout, AAA sur le contraste du texte principal.
- **Langue** : français, avec des libellés courts (les noms de métiers sont longs : prévoir troncature et codes).

## Personnalité

- **Est** : robuste, clair, fiable.
- **N'est pas** : gadget, « startup cool », administratif austère.

## Vocabulaire du domaine

- **Objets** : chantier, lot, corps d'état, phase, tâche, réserve, levée de réserve, OPR, PV de réception, DOE, bon de livraison, rapport journalier.
- **Statuts** (tokens `color.statut.*`) : planifié, en cours, en attente (bloqué), en retard, terminé. « Annulé » reprend le style « planifié » avec un libellé barré.
- **Unités** : m², ml, m³, kg, t, u, h, jours ouvrés, %.
- **Repérage** : bâtiment, niveau (R-1, RDC, R+2), logement, pièce.
- **Familles de métiers** (tokens `color.metier.*`, 8 couleurs + « autre ») :

| Famille | Métiers | Couleur |
|---|---|---|
| Gros œuvre | terrassement, VRD, démolition, fondations, maçonnerie, béton | brique |
| Structure | charpente bois et métal, ossature bois, serrurerie-métallerie | bois |
| Électricité | courants forts et faibles, domotique, photovoltaïque | jaune |
| Extérieurs | aménagements extérieurs, espaces verts, clôtures | feuille |
| Fluides | plomberie, sanitaire, chauffage, ventilation, climatisation | eau |
| Enveloppe | couverture, zinguerie, étanchéité, façade, menuiseries extérieures | ardoise |
| Aménagement | plâtrerie, cloisons, isolation, faux plafonds, menuiseries intérieures | lavande |
| Finitions | peinture, carrelage, revêtements de sol, faïence | framboise |

Pourquoi des familles plutôt qu'une couleur par métier : avec 12 couleurs ou plus, deux métiers deviennent indiscernables pour un daltonien (mesuré : écart ΔE de 0,002). Avec 8 familles, l'écart minimal reste de 0,10 en vision normale et de 0,04 à 0,07 selon le type de daltonisme. Chaque métier garde son icône et son code (GO, ELE, PLO…).

## Direction visuelle retenue : « Bleu de travail et béton »

| | Choix | Pourquoi |
|---|---|---|
| Idée | l'outil a l'air d'un équipement de chantier bien entretenu | robuste, sans folklore |
| Couleur de marque | bleu de travail (OKLCH h 258), `palette.bleu` | la couleur des vêtements de travail en France ; sérieux, lisible au soleil |
| Accent | orange signalisation (h 45), `palette.orange` : un seul élément par écran, avec du texte foncé dessus | le code couleur du balisage, réservé à ce qui doit attirer l'œil |
| Neutres | « béton » : gris chaud (h 85, chroma 0,014), `palette.beton` | évite le gris bleuté générique des SaaS |
| Statuts | vert tiré vers le bleu, ambre, rouge, bleu | cohérent avec les couleurs de sécurité (ISO 3864) connues du terrain, et distinguables par les daltoniens |
| Titres | Barlow Semi Condensed | dessinée d'après la signalétique routière : compacte, lisible de loin |
| Texte | Inter, chiffres tabulaires | formulaires et tableaux denses, quantités alignées |
| Références | JetBrains Mono | numéros de lot, de devis, de bon |
| Formes | rayons de 4 à 10 px, contours plutôt qu'ombres | solide, pas ludique |
| Densités | bureau (contrôles de 40 px, texte 16 px) et terrain (56 px, texte 18 px) | deux contextes physiques très différents |

**Alternative écartée : « Plan d'exécution »** (encre bleu nuit sur papier, traits fins, tout en mono). Élégante au bureau, mais trop fine pour le terrain.

**Clichés évités** : bandes de balisage jaune et noir, interface tout orange, pictogrammes de casque, faux béton texturé.

## Conséquences pour le système

- 2 thèmes (`light`, `dark`) × 2 densités (`bureau`, `terrain`). Le web desktop est en bureau ; le mobile et la tablette tactile sont en terrain.
- Rôles de couleur métier : 5 statuts, 8 familles de métiers + « autre ».
- Composants prioritaires : bouton, champ avec unité, badge statut, pastille métier, carte chantier, barre d'avancement, réserve, navigation (barre latérale web / onglets mobiles), bandeau hors connexion.

## Hypothèses à valider

- Nom du produit et logo : aucun pour l'instant, le nom est composé en typographie simple.
- Techno mobile : non choisie.
- Le regroupement des métiers en familles convient aux entreprises ciblées. Sinon, la correspondance métier → famille est une donnée du produit, modifiable sans toucher aux couleurs.
