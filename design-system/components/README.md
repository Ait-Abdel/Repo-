# Composants — inventaire

Une spec par composant, valable pour le web et le mobile (gabarit : skill `ds-components`). Référence web : `../web/components.css`, démonstration : `../web/demo.html`.

| Composant | Spec | Groupe | Priorité | Web | Mobile |
|---|---|---|---|---|---|
| Bouton | [bouton.md](bouton.md) | Actions | P1 | ✅ `.fd-btn` | à faire |
| Champ de saisie (avec unité) | [champ.md](champ.md) | Formulaires | P1 | ✅ `.fd-field` | à faire |
| Badge statut | [badge-statut.md](badge-statut.md) | Statuts | P1 | ✅ `.fd-badge` | à faire |
| Pastille métier | [pastille-metier.md](pastille-metier.md) | Métier | P1 | ✅ `.fd-metier` | à faire |
| Barre d'avancement | [barre-avancement.md](barre-avancement.md) | Statuts | P1 | ✅ `.fd-progress` | à faire |
| Carte chantier | [carte-chantier.md](carte-chantier.md) | Métier | P1 | ✅ `.fd-card` + `.fd-chantier__*` | à faire |
| Réserve | [reserve.md](reserve.md) | Métier | P1 | ✅ `.fd-reserve` | à faire |
| Navigation principale | [navigation.md](navigation.md) | Navigation | P1 | ⚠️ onglets du bas seulement (`.fd-tabbar`), barre latérale à faire | à faire |
| Bandeau hors connexion | [bandeau-hors-connexion.md](bandeau-hors-connexion.md) | Retours | P1 | ✅ `.fd-banner` | à faire |
| Sélecteur, cases à cocher, interrupteur | à spécifier | Formulaires | P1 | — | — |
| Dialogue, bottom sheet | à spécifier | Couches | P1 | — | — |
| Toast | à spécifier | Retours | P1 | — | — |
| État vide, squelette de chargement | à spécifier | Retours | P1 | — | — |
| Barre de planning (Gantt) | à spécifier | Métier | P2 | — | — |
| Capture photo annotée | à spécifier | Métier | P2 | — | — |

## Icônes

Le système ne fixe pas encore de bibliothèque d'icônes. Celles de la démo sont des tracés simples (trait de 2 px, coins arrondis, grille 24). Recommandation : une bibliothèque libre au même style, comme Lucide (licence ISC) ou Phosphor (MIT), disponible pour le web, React Native et Flutter. Une fois choisie, la même bibliothèque est utilisée sur toutes les plateformes. Les statuts ont chacun une **forme** d'icône différente, pour ne pas dépendre de la couleur :

| Statut | Forme |
|---|---|
| Planifié | cercle pointillé |
| En cours | cercle à moitié plein |
| En attente | cercle avec pause |
| En retard | triangle d'alerte |
| Terminé | cercle avec coche |
