# Composants — inventaire

Une spec par composant, valable pour le web et le mobile (gabarit : skill `ds-components`). Langage visuel : « Plan et matière » (voir `../brief.md`, section Éléments signatures). Référence web : `../web/components.css`, démonstration : `../web/demo.html`.

| Composant | Spec | Groupe | Priorité | Web | Mobile |
|---|---|---|---|---|---|
| Structure apparente | [structure.md](structure.md) | Mise en page | P1 | ✅ `.fd-structure` | à faire |
| Cartouche | [cartouche.md](cartouche.md) | Signature | P1 | ✅ `.fd-cartouche` | à faire |
| Chiffres clés | [chiffres-cles.md](chiffres-cles.md) | Signature | P1 | ✅ `.fd-kpis` | à faire |
| Cote d'avancement | [cote.md](cote.md) | Signature | P1 | ✅ `.fd-cote` | à faire |
| Indice de révision | [indice-revision.md](indice-revision.md) | Signature | P1 | ✅ `.fd-indice` | à faire |
| Bulle de repère (métier) | [repere.md](repere.md) | Signature | P1 | ✅ `.fd-repere` | à faire |
| Statut | [statut.md](statut.md) | Statuts | P1 | ✅ `.fd-statut` | à faire |
| Bouton | [bouton.md](bouton.md) | Actions | P1 | ✅ `.fd-btn` | à faire |
| Lien et utilitaires d'accessibilité | [lien.md](lien.md) | Fondations | P1 | ✅ `.fd-link`, `.fd-skip-link`, `.fd-sr-only` | à faire |
| Champ de saisie (avec unité) | [champ.md](champ.md) | Formulaires | P1 | ✅ `.fd-field` | à faire |
| Carte chantier | [carte-chantier.md](carte-chantier.md) | Métier | P1 | ✅ `.fd-card` + `.fd-chantier__*` | à faire |
| Réserve | [reserve.md](reserve.md) | Métier | P1 | ✅ `.fd-reserve` | à faire |
| Navigation principale | [navigation.md](navigation.md) | Navigation | P1 | ⚠️ onglets du bas et en-tête mobile (`.fd-tabbar`, `.fd-mhead`), barre latérale à faire | à faire |
| Bandeau hors connexion | [bandeau-hors-connexion.md](bandeau-hors-connexion.md) | Retours | P1 | ✅ `.fd-banner` | à faire |
| Sélecteur, cases à cocher, interrupteur | à spécifier | Formulaires | P1 | — | — |
| Dialogue, bottom sheet | à spécifier | Couches | P1 | — | — |
| Toast | à spécifier | Retours | P1 | — | — |
| État vide, squelette de chargement | à spécifier | Retours | P1 | — | — |
| Barre de planning (Gantt) | à spécifier : barres en `color.metier.*`, prévu en cote pointillée | Métier | P2 | — | — |
| Capture photo annotée | à spécifier : annotations en rouge révision | Métier | P2 | — | — |

## Icônes

Aucune bibliothèque n'est encore fixée. Le style est un trait de 1,75 px à **angles vifs** (`stroke-linecap: square`, `stroke-linejoin: miter`) sur une grille de 24, en cohérence avec les angles vifs du système. Recommandation : une bibliothèque libre réglable dans ce style (Lucide ou Phosphor, avec des extrémités carrées), utilisée à l'identique sur web, React Native et Flutter.

Chaque statut a une **forme** propre, pour ne pas dépendre de la couleur :

| Statut | Forme |
|---|---|
| Planifié | carré vide |
| En cours | carré à moitié plein |
| En attente | deux barres (pause) |
| En retard | triangle plein (rouge révision) |
| Terminé | carré plein |
