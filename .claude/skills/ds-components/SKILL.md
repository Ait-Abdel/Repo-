---
name: ds-components
description: Rédige les spécifications des composants d'interface d'un design system, indépendantes de la techno, valables à la fois pour le web et le mobile — anatomie, variantes, tailles par densité, états, tokens utilisés, accessibilité, différences web / iOS / Android — dans design-system/components/. À utiliser pour « spécifie les composants », « quels composants faut-il », « ajoute un composant », « comment doit se comporter le bouton / la carte / la navigation », ou avant d'implémenter des composants web ou mobiles.
---

# Spécifications de composants web + mobile

Une spec décrit **un seul composant pour toutes les plateformes**. Le web et le mobile partagent le rôle, les variantes, les états et les tokens. Ils diffèrent par le comportement natif, décrit dans deux sections dédiées. `ds-web` et `ds-mobile` implémentent à partir de ces fichiers, sans rien inventer.

Entrées : `design-system/brief.md` (composants métier prioritaires) et les tokens (`design-system/tokens/` ou `build/json/tokens.json`).

## 1. Inventaire

Commence par `design-system/components/README.md` : un tableau de tous les composants, avec leur priorité, leur statut (à spécifier, spécifié, web, mobile) et leur groupe.

- **Fondamentaux** (P1, toujours) : Bouton, Bouton icône, Champ de texte, Sélecteur, Case à cocher / Radio / Interrupteur, Badge, Carte, Élément de liste, Onglets, Navigation principale, Dialogue / Bottom sheet, Bannière et Toast, État vide, Squelette de chargement.
- **Composants du domaine** (P1 si cités dans le brief) : ceux qui portent le vocabulaire du métier. Exemples BTP : Badge statut, Pastille métier, Carte chantier, Réserve, Barre d'avancement, Capture photo, Indicateur hors ligne.
- **Plus tard** (P2) : tout le reste. N'en ajoute pas « par habitude » : chaque composant répond à une tâche du brief.

## 2. Une spec par composant : `design-system/components/<nom-kebab>.md`

Gabarit (garde les titres, supprime les sections vides seulement si elles ne s'appliquent vraiment pas) :

```markdown
# <Nom>
<Une phrase : à quoi il sert.>

## Quand l'utiliser
- … / Ne pas l'utiliser pour … (→ composant alternatif)

## Anatomie
1. Conteneur · 2. Icône (optionnelle) · 3. Libellé · …

## Variantes
| Variante | Usage | Tokens (fond / texte / bordure) |

## Tailles
| Taille | bureau | terrain | Usage |      ← lit size.control.*, size.icon.*, text.*

## États
| État | Changement visuel | Tokens |      ← repos, survol (web), pressé, focus clavier, désactivé, chargement, erreur, sélectionné

## Contenu
Règles de rédaction : longueur, majuscules, verbes d'action, unités, troncature.

## Accessibilité
Rôle / élément natif, nom accessible, clavier, lecteur d'écran, taille de cible, contraste, mouvement.

## Web
Élément HTML, comportement responsive, survol, raccourcis.

## Mobile
iOS / Android : équivalent natif, geste, retour haptique, placement (pouce), taille de police système.

## Ne pas faire
```

Règles :

- **Tokens sémantiques uniquement** (`color.primary.solid`, `size.control.md`, `text.label`), jamais de palette ni de valeur brute. Si un token manque, note-le dans « Tokens à créer » en fin de spec et signale-le pour qu'il soit ajouté via `ds-tokens`.
- **Tous les états** : survol n'existe pas sur mobile, et l'appui (pressé) doit y être visible. Le focus clavier est obligatoire sur le web (anneau `border.focus`, épaisseur `focus-ring.width`).
- **Cible tactile** : sur mobile, la zone de toucher atteint `size.touch-target` même si l'élément visuel est plus petit.
- **Couleur jamais seule** : un statut, une catégorie ou une erreur a toujours un libellé ou une icône.
- **Un composant web seulement** (tableau dense, barre latérale) indique son équivalent mobile : liste de cartes, onglets du bas. L'inverse vaut aussi : un bouton d'action flottant n'existe que sur mobile.
- Les exemples utilisent du **contenu réel du domaine**, jamais de lorem ipsum.

## 3. Finir

Mets à jour le tableau de `components/README.md`. Résume à l'utilisateur les composants spécifiés et les tokens à créer, puis propose `ds-web` ou `ds-mobile`.
