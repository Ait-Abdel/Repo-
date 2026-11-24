---
name: ds-audit
description: Audite un design system et son utilisation — validité des tokens, contrastes WCAG 2.2 dans chaque thème, lisibilité pour les daltoniens, valeurs codées en dur dans le code web et mobile, complétude des specs de composants, cohérence entre web et mobile, accessibilité des composants implémentés — et produit un rapport priorisé avec corrections. À utiliser pour « vérifie le design system », « audit d'accessibilité », « est-ce que le code respecte les tokens », « contrôle avant mise en production », ou après toute modification de tokens.
---

# Audit du design system

Le rapport classe les problèmes par gravité et propose une correction pour chacun. **Ne corrige rien avant d'avoir montré le rapport**, sauf si l'utilisateur l'a demandé.

## 1. Tokens

```bash
cd design-system && node ../.claude/skills/ds-tokens/scripts/check-tokens.mjs --verbose
```

- Les erreurs (alias cassé, parité de modes, contraste insuffisant) sont **bloquantes**.
- Les avertissements de vision daltonienne sont acceptables seulement si chaque composant qui affiche ces couleurs les double d'une icône ou d'un libellé. Vérifie-le dans les specs.
- Paires manquantes : cherche dans les specs et dans le code les associations texte/fond réellement utilisées qui ne sont pas déclarées dans `checks.contrast.pairs`, et ajoute-les.
- Vérifie que `build/` est à jour : relance `build-tokens.mjs`, puis `git diff --stat design-system/build` doit être vide.

## 2. Valeurs en dur dans le code

```bash
node .claude/skills/ds-audit/scripts/lint-hardcoded.mjs src app   # dossiers du code web / mobile
```

Pour chaque résultat, propose le token à utiliser à la place, ou un token à créer s'il n'existe pas. Les fichiers générés et les déclarations de variables CSS sont ignorés. Une exception légitime (un logo tiers, par exemple) se marque `ds-ignore` sur la ligne.

## 3. Specs de composants (`design-system/components/`)

Pour chaque spec, vérifie :
- les sections du gabarit `ds-components` sont présentes ;
- le tableau des états couvre repos, pressé, focus, désactivé, plus chargement, erreur et sélectionné quand ils s'appliquent ;
- les tokens cités existent : compare-les aux chemins de `build/json/tokens.json` ;
- les sections Web **et** Mobile sont remplies, ou un équivalent est indiqué ;
- la couleur n'est jamais le seul porteur d'information.

## 4. Cohérence web / mobile

Compare la liste des composants des specs avec ce qui est implémenté de chaque côté : colonnes web et mobile de `components/README.md`, puis vérification dans le code. Signale :
- un composant implémenté d'un seul côté sans équivalent documenté ;
- une valeur divergente, par exemple un rayon ou une couleur différente entre web et mobile pour le même composant ;
- un composant d'une plateforme qui ne passe pas par les tokens.

## 5. Accessibilité (WCAG 2.2 AA) des composants implémentés

| Critère | Ce qu'on vérifie |
|---|---|
| 1.4.3 / 1.4.6 Contraste du texte | les paires réellement utilisées (étape 1), y compris texte sur image et texte désactivé porteur de sens |
| 1.4.11 Contraste non textuel | bordures de champs, icônes porteuses de sens, anneau de focus ≥ 3:1 |
| 1.4.1 Utilisation de la couleur | statuts, catégories, erreurs, liens dans le texte (soulignés) |
| 1.4.4 / 1.4.10 Agrandissement, reflow | 200 % de zoom, 320 px de large sans défilement horizontal, taille de texte système sur mobile |
| 2.4.7 / 2.4.11 Focus visible et non masqué | anneau `border.focus` sur tous les éléments interactifs, jamais caché par une barre collante |
| 2.5.8 Taille de cible | ≥ 24 px (web souris), `size.touch-target` en tactile |
| 2.3.3 / mouvement | `prefers-reduced-motion` respecté |
| 4.1.2 Nom, rôle, valeur | éléments natifs, libellés des boutons icône, `aria-invalid` et message d'erreur liés au champ |

Si Playwright est disponible, prends des captures de la page de démonstration (clair/sombre × densités × 375/1280 px) et regarde-les. Si `@axe-core/playwright` peut s'installer, lance-le sur la page de démonstration et intègre les résultats.

## 6. Rapport

Écris-le en markdown, dans le chat ou dans `design-system/audit.md` si l'utilisateur le demande :

```markdown
## Résumé
x bloquants · y importants · z mineurs — état : prêt / à corriger

## Bloquants
| # | Où | Problème | Correction proposée |
## Importants
## Mineurs
## Conforme
- ce qui a été vérifié et passe (avec les chiffres : 204/204 paires de contraste…)
```

Bloquant = un utilisateur est empêché de faire une tâche, ou un critère WCAG AA échoue. Important = une incohérence visible ou une dette qui va se propager. Mineur = du confort.
