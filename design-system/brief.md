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

| Famille | Métiers | Couleur (anneau de la bulle de repère) |
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

## Direction visuelle retenue : « Plan et matière »

Choisie sur la planche `explorations/identites.html`. C'est un mélange des territoires **A · Cartouche** et **C · Béton brut**. Le troisième territoire, Tampon, a été écarté.

| | Choix | Vient de |
|---|---|---|
| Idée | la matière du chantier livré (béton, corten) et le langage du plan qui le décrit (cartouche, cotes, révisions) | A + C |
| Fonds | béton banché (`bg.canvas`) avec trous de banche ; béton ciré (`bg.surface`) pour les blocs | C |
| Texte | anthracite, 11:1 sur le béton banché | C |
| Action principale | encre de plan, bleu nuit (`primary`) | A |
| Action mise en avant | corten (`accent`) : une seule par écran | C |
| Statuts | encre claire (en cours), ocre (en attente), rouge révision (en retard), vert-de-gris (terminé) | A + C |
| Titres et chiffres | Schibsted Grotesk, très gras, approche serrée | C |
| Texte | Instrument Sans | C |
| Langage du plan | IBM Plex Mono, en capitales espacées pour les clés, cotes et références | A |
| Formes | angles vifs partout (`radius.none`), joints sombres de 2 px entre les blocs, pas d'ombre sauf pour ce qui flotte | C |
| Densités | bureau (contrôles de 40 px, texte 16 px) et terrain (56 px, texte 18 px) | inchangé |

**Écartés** : la trame de calque en fond (un seul motif, les trous de banche), le jaune et les tampons du territoire B, le bleu « SaaS » de la première version.

## Éléments signatures

| Signature | Ce que c'est | À quoi ça sert | Où |
|---|---|---|---|
| Cartouche | en-tête de fiche en grille, cadre anthracite, clés en mono capitales (PROJET, RÉF., LOT, INDICE, STATUT) | retrouver d'un coup d'œil les infos d'identité, comme sur un plan | fiche chantier, lot, réserve, document |
| Cote d'avancement | ligne de cote à barbules obliques ; la partie réalisée en trait épais ; valeur écrite sur le trait ; prévu en pointillé | voir l'avancement **et** l'écart au prévu, dans le langage des plans | cartes, fiches, planning |
| Indice de révision | triangle rouge avec une lettre (A, B, C…) | signaler ce qui a changé depuis la dernière visite, comme sur un plan révisé | lignes, cartes, documents modifiés |
| Bulles de repère | cercle à anneau de couleur de famille, code métier en mono | identifier le métier sans dépendre de la couleur | partout où un métier apparaît |
| Grands chiffres | avancement, effectifs, réserves ouvertes en Schibsted noir | lire l'essentiel avant le détail | en-têtes de fiche, tableau de bord, en-tête mobile |
| Structure apparente | blocs séparés par des joints sombres de 2 px, angles vifs, sans ombre | hiérarchie lisible sans décoration | toutes les mises en page de blocs |
| Trous de banche | trame de points discrète sur le fond de page | ancrer la matière, reconnaître le produit | fond de page uniquement |

## Conséquences pour le système

- 2 thèmes (`light`, `dark`) × 2 densités (`bureau`, `terrain`). Le web desktop est en bureau ; le mobile et la tablette tactile sont en terrain.
- Rôles de couleur métier : 5 statuts, 8 familles de métiers + « autre ».
- Composants prioritaires : bouton, champ avec unité, statut, bulle de repère (métier), cote d'avancement, cartouche, chiffres clés, indice de révision, carte chantier, réserve, navigation (barre latérale web / onglets mobiles), bandeau hors connexion.

## Hypothèses à valider

- Nom du produit et logo : aucun pour l'instant, le nom est composé en typographie simple.
- Techno mobile : non choisie.
- Le regroupement des métiers en familles convient aux entreprises ciblées. Sinon, la correspondance métier → famille est une donnée du produit, modifiable sans toucher aux couleurs.
