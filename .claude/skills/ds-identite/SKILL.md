---
name: ds-identite
description: Donne une vraie personnalité visuelle à un design system avant de figer les tokens. Repère ce qui fait générique, puise dans le monde du métier, propose 3 territoires d'identité radicalement différents (métaphore, palette nommée, typographies, éléments signatures) et les rend sur les mêmes écrans dans une planche comparative pour faire choisir. À utiliser quand le rendu « manque d'identité », « fait template / fait IA / fait générique », quand on demande une direction artistique, une personnalité, un univers, une ambiance, ou entre ds-brief et ds-tokens.
---

# Identité visuelle : trouver une personnalité

Un design system peut être propre, accessible et cohérent, et pourtant ne ressembler à rien. Ce skill se place **entre `ds-brief` et `ds-tokens`**. On ne fige pas une palette tant qu'une identité n'a pas été choisie sur des écrans réels.

## 1. Diagnostiquer le générique (si un système existe déjà)

Note chaque symptôme présent (✗) dans le système actuel :

- couleur principale bleue « SaaS » + gris neutres + une police d'interface omniprésente (Inter, Roboto, SF) ;
- même arrondi moyen et même ombre légère sur tous les blocs ;
- badges pastel en pilule, icônes au trait génériques ;
- aucune forme, aucun motif, aucun détail qui n'appartienne qu'à ce métier ;
- **test du métier** : on pourrait remplacer les données par celles d'une app de livraison de repas sans rien changer au design ;
- **test du pouce** : en cachant le nom, on ne reconnaît pas le produit.

Trois ✗ ou plus : le système est générique. Dis-le franchement à l'utilisateur, avec la liste.

## 2. Inventorier le monde du métier

Liste au moins 20 éléments concrets du domaine. Pour chacun, note la propriété visuelle qu'il apporte : couleur, trait, forme, typographie, matière ou geste.

| Famille | Exemples à chercher |
|---|---|
| Documents | ce que les gens remplissent, signent, tamponnent, affichent (formulaires, plans, étiquettes, tickets, factures) |
| Outils et instruments | ce qu'ils tiennent en main, leurs graduations, leurs couleurs d'usine |
| Matières | ce qu'ils touchent, ce que produit le métier |
| Signalétique | panneaux, marquages au sol, codes couleur réglementaires |
| Gestes et rituels | ce qui marque le début, la validation ou la fin d'une tâche |
| Lieux | où se fait le travail, la lumière, les conditions |
| Langage | jargon, abréviations, unités, manière de nommer |

Exemple BTP : cartouche de plan, cotes, indices de révision en rouge, calque, bleu cyanotype, panneau de permis de construire, tampons « BON POUR EXÉCUTION », étiquettes de chantier, jaune des engins, bombe de traçage fluo, cordeau, mètre ruban, niveau à bulle, béton banché et ses trous de banche, acier corten, parpaing, bâche de chantier, PV de réception, carnet du chef de chantier, codes ISO 3864.

## 3. Diverger : 3 territoires

Chaque territoire part d'**une métaphore centrale** tirée de l'inventaire, porte **une attitude** (par exemple précis et expert, brut et terrain, premium et architectural) et parle à un profil d'utilisateur ou d'acheteur différent.

Les trois territoires doivent différer sur **au moins 4 de ces 5 axes** :
1. couleur dominante (pas deux fois la même famille de teinte) ;
2. typographie de titrage (jamais Inter, Roboto, Space Grotesk ou Arial en titre) ;
3. formes (angles vifs ou arrondis, traits fins ou épais, ombres ou contours) ;
4. élément signature graphique ;
5. ton et densité (calme, dense, bruyant, aéré).

Interdits sauf demande explicite (clichés « IA ») : dégradé violet-bleu, crème #F4F1EA + serif + terracotta, noir + une seule touche vert acide, emoji comme marqueurs, cartes arrondies avec une barre colorée à gauche, tout centré. Interdits aussi : le cliché du secteur lui-même (pour le BTP, les bandes de balisage jaune et noir et le casque).

Pour chaque territoire, définis :

- **Nom** : un mot du métier (« Cartouche », « Tampon », « Béton brut »).
- **Idée** : une phrase.
- **Pour qui** : le profil qu'il rassure ou attire.
- **Palette** : 5 à 7 couleurs **nommées avec les mots du métier** (« Encre de plan », « Jaune engin », « Corten »), avec le rôle de chacune. Vérifie les contrastes avec `ds-tokens/scripts/lib/tokens.mjs` (`contrast`) avant de les montrer : texte ≥ 4,5:1, texte principal ≥ 7:1 si l'on lit en extérieur.
- **Typographies** : une police de titrage avec du caractère, une police de texte très lisible et, si besoin, une mono pour les données. Uniquement des polices libres (Google Fonts) disponibles pour le web et pour l'app.
- **3 éléments signatures** : (a) un composant transformé par la métaphore, par exemple des statuts en tampons ou un avancement dessiné comme une cote ; (b) un motif ou une structure graphique, par exemple une trame de calque ou des trous de banche ; (c) un détail typographique ou rédactionnel. Ils doivent **servir** une tâche, pas seulement décorer.
- **Vigilance** : risques d'accessibilité, de fatigue visuelle, de coût d'implémentation, ou de décalage avec une partie des utilisateurs.

## 4. Rendre les territoires comparables : la planche

Une seule page HTML, où **les mêmes contenus réels** sont rendus dans chaque territoire :
- l'en-tête de page d'un objet métier ;
- une carte de liste avec statut, avancement et catégories ;
- deux lignes de liste, dont une validée ;
- un écran mobile avec l'action principale et la navigation du bas ;
- à gauche, ou au-dessus sur téléphone : palette, typographies, signatures, vigilance.

Chaque territoire est encapsulé dans une classe qui porte ses propres variables CSS. Les polices viennent de Google Fonts. Prends une capture (Playwright) et regarde-la avant de montrer la page. Publie-la (artifact) pour que l'utilisateur la consulte sur son téléphone, et garde une copie dans `design-system/explorations/`.

Termine la planche par un tableau « Comment choisir » : ressenti, atout terrain, atout bureau, risque.

## 5. Faire choisir, puis inscrire le choix

Demande à l'utilisateur de choisir un territoire ou un mélange (« la palette de Tampon avec la typo de Cartouche »). Fais-le réagir sur les signatures, pas seulement sur les couleurs. Puis :

1. Mets à jour `design-system/brief.md` : la section « Direction visuelle retenue », plus une nouvelle section « Éléments signatures » (ce qu'ils sont, à quoi ils servent, où ils apparaissent).
2. Passe à `ds-tokens`. Les signatures deviennent aussi des tokens quand elles portent des valeurs : rotation des tampons, pas de la trame, épaisseur des traits, police de titrage.
3. Ajoute les signatures dans les specs (`ds-components`). Un composant signature mérite sa propre spec.

## Critères d'une identité réussie

- **Test du pouce** : en cachant le nom, on reconnaît le produit à ses couleurs et à ses formes.
- **Test du métier** : au moins trois éléments ne pourraient exister que dans ce domaine.
- **Test du terrain** : tout reste lisible dans les conditions réelles d'usage (soleil, gants, petit écran, daltonisme).
- **Test de la retenue** : l'audace est concentrée en un ou deux endroits ; le reste de l'interface reste calme et efficace.

## Skills complémentaires

- `frontend-design` (Anthropic) : exécuter une direction audacieuse en code, sans retomber dans le générique.
- `brand-md` : poser la stratégie de marque (positionnement, voix, primitives visuelles) quand le produit n'a pas encore de marque.
- `design-taste-frontend` (taste-skill) : conçu pour les **sites vitrines** et les landing pages, pas pour l'interface d'une application. Il est utile pour le site marketing, une fois l'identité choisie.
