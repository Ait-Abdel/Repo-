# Chiffres clés
Trois ou quatre nombres essentiels lus avant tout le reste (avancement, effectifs, réserves ouvertes, jours de retard), en très grands chiffres.

## Quand l'utiliser
- Sous le cartouche d'une fiche, en tête d'un tableau de bord, dans l'en-tête mobile (un seul chiffre).
- Ne pas l'utiliser pour des données secondaires ou plus de 4 valeurs (→ tableau).

## Anatomie
1. Valeur (`text.display` : Schibsted noir, approche serrée, chiffres tabulaires) · 2. Unité réduite (`text.title-3`) · 3. Libellé (`text.overline`, capitales) · 4. Filet de séparation fin (`color.border.subtle`)

## Variantes
| Variante | Usage |
|---|---|
| Rangée | 2 à 4 chiffres côte à côte (passent sur plusieurs lignes en mobile) |
| Seul | en-tête mobile, sur `color.chrome.bg` |

## Tailles
`text.display` : 56 px dans les deux densités ; le libellé suit la densité (12 px bureau, 14 px terrain).

## États
Statique. Une valeur en alerte (retard) garde la couleur du texte ; l'alerte est portée par un statut ou un indice à côté.

## Tokens
`text.display`, `text.title-3`, `text.overline`, `color.fg.default`, `color.fg.muted`, `color.border.subtle`, `color.chrome.fg`, `color.chrome.fg-muted`.

## Contenu
- Nombres entiers ou arrondis (62 %, pas 61,8 %). Unité courte collée en petit.
- Libellé de 1 à 3 mots : AVANCEMENT, COMPAGNONS, RÉSERVES OUVERTES.

## Accessibilité
La valeur et son libellé forment un groupe lu ensemble (« 62 %, avancement »). Ne pas colorer un chiffre pour signifier un état sans le dire en texte.

## Web
`.fd-kpis` > `.fd-kpi` > `.fd-kpi__val` (+ `.fd-kpi__unit`) + `.fd-kpi__lbl`.

## Mobile
Un seul chiffre dans l'en-tête (`.fd-mhead`), le plus utile pour la journée (avancement ou tâches restantes).

## Ne pas faire
- Des tuiles colorées ou des icônes décoratives autour des chiffres.
- Mettre les chiffres clés sur chaque carte de liste : ils sont réservés aux fiches et aux tableaux de bord.
