---
name: ds-brief
description: Transforme une thématique (secteur, produit, public) en brief de design exploitable — utilisateurs, contextes d'usage, contraintes, personnalité de marque et direction visuelle — écrit dans design-system/brief.md. À utiliser au démarrage d'un design system, quand l'utilisateur décrit son produit (« un SaaS pour… », « une app pour les… »), quand il demande une direction artistique, une ambiance, une palette « qui colle au métier », ou avant de créer des tokens sans brief existant.
---

# Brief de design à partir d'une thématique

Le brief sert à décider. Chaque choix de couleur, de police ou de densité fait plus tard doit pouvoir s'y rattacher. Un brief qui pourrait décrire n'importe quel produit est raté.

## 1. Collecter (questions groupées, une seule fois)

Pose seulement les questions dont la réponse manque, en un seul message, avec des options quand c'est possible :

1. **Produit** : que fait-il, pour qui le paie, pour qui l'utilise (souvent deux publics différents) ?
2. **Plateformes** : web desktop, web mobile, app iOS/Android ? Laquelle vient en premier ?
3. **Contextes d'usage** : bureau, terrain, en mouvement, en extérieur, mains occupées ou gantées, réseau faible, bruit, urgence ?
4. **Marque existante** : logo, couleurs, polices, site actuel ? Sinon, faut-il partir de zéro ?
5. **Personnalité** : trois adjectifs qui doivent décrire le produit, et trois qu'il ne faut surtout pas évoquer.
6. **Références** : produits admirés ou concurrents à éviter de copier.
7. **Contraintes** : niveau d'accessibilité visé (WCAG 2.2 AA par défaut), langues, marque blanche, mode sombre.

S'il n'y a pas de réponse, prends des hypothèses raisonnables, marque-les `(hypothèse)` dans le brief et continue.

## 2. Analyser la thématique

Pour le domaine, liste concrètement :

- **Utilisateurs et tâches** : pour chaque profil, l'écran, la tâche fréquente, la tâche critique et le contexte physique.
- **Le monde du métier** : ses matériaux, ses instruments, ses documents (plans, bons, factures, fiches), sa signalétique, ses unités, son jargon. C'est là que se trouvent les choix distinctifs.
- **Les catégories et statuts du domaine** : ils deviendront des tokens (`statut.*`, catégories colorées) et des composants (badges, pastilles). Vérifie leur nombre : au-delà de 8 catégories colorées, on ne les distingue plus, il faut regrouper par familles.
- **Les conventions à respecter** : codes couleur réglementaires ou culturels du secteur. Ce sont des couleurs à ne pas détourner, par exemple les couleurs de sécurité de la norme ISO 3864.
- **Les clichés à éviter** : la première image qui vient à tout le monde pour ce secteur.

## 3. Proposer une direction

Rédige une direction recommandée et une alternative contrastée, en tableau :

| | Direction A (recommandée) | Direction B |
|---|---|---|
| Idée en une phrase | | |
| Couleur de marque (teinte, d'où elle vient) | | |
| Accent | | |
| Neutres (teinte biaisée vers…) | | |
| Typo titres / texte | | |
| Formes (rayons, bordures vs ombres) | | |
| Densité bureau / terrain | | |
| Ce qu'on évite | | |

Pour la typographie, choisis des polices disponibles sur Google Fonts ou libres, avec chiffres tabulaires si l'on affiche des quantités. Elles doivent exister pour le web et pouvoir s'embarquer dans une app. Pour la couleur, donne des teintes OKLCH (angle et intensité). Les valeurs exactes seront calculées par `ds-tokens`.

## 4. Écrire `design-system/brief.md`

Structure du fichier :

```markdown
# Brief — <nom du produit>
## Produit
## Utilisateurs et contextes        ← tableau profil / tâche / contexte / plateforme
## Contraintes                       ← accessibilité, terrain, langues, hors ligne…
## Personnalité                      ← 3 adjectifs + 3 anti-adjectifs
## Vocabulaire du domaine            ← statuts, catégories, unités, documents
## Direction visuelle retenue        ← le tableau de la direction choisie
## Conséquences pour le système      ← modes (thèmes, densités), catégories colorées, composants métier prioritaires
## Hypothèses à valider
```

La section « Conséquences pour le système » fait le lien avec les étapes suivantes. Exemple : « deux densités (bureau/terrain), 8 familles de métiers colorées, composants prioritaires : carte chantier, badge statut, pastille métier, réserve ».

## 5. Valider

Présente la direction en quelques lignes, pas le fichier entier, et demande une validation avant de lancer `ds-tokens`. Si l'utilisateur hésite, propose de générer les deux palettes et de comparer.
