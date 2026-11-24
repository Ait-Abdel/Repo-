---
name: ds-mobile
description: Décline un design system dans une application mobile iOS / Android — aide au choix de la techno (React Native / Expo, Flutter, SwiftUI + Jetpack Compose), génération du thème à partir des tokens (build/ts/tokens.ts ou build/json/tokens.json), conventions natives (navigation, gestes, zones sûres, taille de texte système, mode sombre), composants mobiles à partir des specs. À utiliser pour « fais l'app mobile avec le design system », « quelle techno pour l'app », « exporte les tokens en Flutter / Swift / Kotlin », « thème React Native », « adapter le design system au mobile ».
---

# Déclinaison mobile

Entrées : `design-system/build/` (tokens résolus) et `design-system/components/*.md`. Le mobile lit **les mêmes tokens** que le web : pas de nouvelle palette, pas de nouvelles tailles. Il utilise la densité tactile du système (`terrain`, `mobile`… selon `ds.config.json`) et le thème qui suit le réglage du téléphone.

## 1. Choisir la techno (si ce n'est pas fait)

Pose la question avec cette grille, et recommande selon les réponses :

| Critère | React Native + Expo | Flutter | Natif (SwiftUI + Compose) | PWA (web installable) |
|---|---|---|---|---|
| Équipe web en React / TypeScript | ✅ partage du langage, des tokens TS, de la logique | ➖ Dart à apprendre | ❌ deux codebases | ✅ c'est le site |
| Une seule base de code iOS + Android | ✅ | ✅ | ❌ | ✅ |
| Hors ligne, appareil photo, GPS, notifications | ✅ (modules Expo) | ✅ | ✅ meilleur accès | ⚠️ limité sur iOS |
| Rendu identique sur les deux OS | ➖ composants natifs | ✅ moteur de rendu propre | ❌ deux UI | ✅ |
| Publication sur les stores | ✅ EAS | ✅ | ✅ | ❌ hors store |
| Tokens consommés | `build/ts/tokens.ts` directement | Dart généré depuis le JSON | Swift + Kotlin générés depuis le JSON | `tokens.css` |

Recommandation par défaut quand rien n'est décidé : **Expo (React Native)** si le web est ou sera en React, **Flutter** si l'équipe n'a pas de préférence et veut un rendu identique, **PWA** pour valider le besoin avant d'investir dans une app. Note le choix dans `design-system/brief.md`.

## 2. Brancher les tokens

### React Native / Expo
- Importe `resolveTokens` depuis `design-system/build/ts/tokens.ts`. Copie le fichier ou crée un alias de workspace (monorepo).
- `ThemeProvider` : `const scheme = useColorScheme(); const t = resolveTokens({ theme: scheme === 'dark' ? 'dark' : 'light', density: '<densité tactile>' });` exposé par un contexte React (`useTokens()`).
- Styles : `StyleSheet.create` ou une fabrique `makeStyles(t => …)`. Ne mets jamais de nombre ni de couleur en dur dans un style.
- Typographie : `t.text.body` est déjà au format RN (`fontSize`, `lineHeight` en px, `fontWeight` en chaîne). Charge les polices avec `expo-font`, avec des noms identiques à `fontFamily`. Garde `allowFontScaling` actif.
- Ombres : en iOS, `shadowColor/Offset/Radius/Opacity` à partir de `t.shadow.*` ; en Android, `elevation` (correspondance indicative sm→2, md→6, lg→12).

### Flutter
- Ajoute un générateur `design-system/scripts/tokens-to-dart.mjs` qui lit `build/json/tokens.json` et écrit `lib/theme/tokens.g.dart` : une classe par mode (`FdColorsLight`, `FdColorsDark` sous forme de `ThemeExtension`), `Color(0xAARRGGBB)` à partir des hex `#rrggbb[aa]`, des `double` pour les dimensions, des `TextStyle` (`height = lineHeight / fontSize`).
- Construis `ThemeData.light()` / `.dark()` en remplissant `ColorScheme` depuis les rôles (`primary` = `color.primary.solid`, `onPrimary` = `on-solid`, `surface` = `bg.surface`, `error` = `danger.solid`…) et en ajoutant l'extension pour les rôles métier (statuts, catégories).
- Ajoute la commande de génération au README et au CI, après `build-tokens.mjs`.

### SwiftUI + Jetpack Compose
- Même principe : un générateur lit `build/json/tokens.json`. Côté iOS, il produit un catalogue de couleurs `.xcassets` avec variantes Any/Dark, ou une extension `Color` + des constantes `CGFloat`. Côté Android, il produit un `object FdTokens` + un `ColorScheme` Material 3 clair et sombre.
- Typographie : passe par `Font.custom(_:size:relativeTo:)` (iOS) et des unités `sp` (Android) pour suivre la taille de texte système.

Quel que soit le choix, le fichier généré porte l'en-tête « généré, ne pas éditer » et se régénère après chaque modification de tokens.

## 3. Conventions natives à respecter

- **Navigation** : barre d'onglets en bas, 5 destinations au maximum, icône + libellé. Tout le reste va dans « Plus » ou dans les écrans. Le retour se fait par le geste système (iOS) et par le bouton ou le geste retour (Android).
- **Zones sûres** : rien d'interactif sous l'encoche, l'île dynamique ou la barre de geste (`SafeAreaView`, `SafeArea`, `WindowInsets`).
- **Pouce** : les actions principales sont en bas de l'écran, dans un bouton pleine largeur ou un bouton d'action flottant. Les actions destructrices sont éloignées des actions fréquentes.
- **Cibles** : `size.touch-target` minimum, et 8 px d'écart entre deux cibles.
- **Texte** : respecte la taille de texte choisie dans les réglages du téléphone. Les écrans doivent tenir à 200 % (le texte passe à la ligne, les conteneurs grandissent).
- **Couches** : bottom sheet pour les choix et les actions contextuelles, dialogue seulement pour une confirmation bloquante.
- **Retour d'état** : retour haptique léger sur les validations, état « pressé » visible, chargement dans le bouton déclencheur.
- **Hors ligne** : si le brief le prévoit, chaque écran a un état « hors connexion », chaque saisie est mise en file d'attente et l'interface montre ce qui reste à synchroniser.
- **Permissions** (appareil photo, position) : demandées au moment de l'action, avec une phrase qui dit pourquoi.

## 4. Composants

Pour chaque spec, implémente la section « Mobile ». Si un composant n'existe que sur le web (tableau dense, barre latérale), utilise l'équivalent indiqué dans la spec. Pour un composant natif de l'OS (sélecteur de date, menu), garde le composant natif et applique seulement les tokens de couleur et de typographie : l'utilisateur le connaît déjà.

## 5. Vérifier

- Lance `node .claude/skills/ds-audit/scripts/lint-hardcoded.mjs <dossier de l'app>` : aucun résultat en dehors des fichiers générés.
- Vérifie le rendu en clair et en sombre, avec la taille de texte système au maximum, sur un petit écran (iPhone SE / 360 dp) et un grand.
- Lecteur d'écran (VoiceOver / TalkBack) : chaque contrôle a un nom, et les statuts sont lus avec leur libellé.
- Mets à jour la colonne « mobile » de `design-system/components/README.md`.
