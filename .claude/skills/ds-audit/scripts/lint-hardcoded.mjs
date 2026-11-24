#!/usr/bin/env node
// Repère les valeurs codées en dur qui devraient passer par les tokens :
// couleurs (#hex, rgb(), hsl()), tailles de police et espacements en px,
// dans le CSS/SCSS, le JSX/TSX (styles inline, StyleSheet React Native),
// Vue, Svelte, Dart (Flutter), Swift et Kotlin.
//
// Heuristique : chaque résultat est à examiner, pas à corriger aveuglément.
// Pour ignorer une ligne légitime : ajouter le commentaire « ds-ignore ».
//
// Usage : node lint-hardcoded.mjs [dossiers…] [--ignore build,tokens] [--strict] [--json]
//   Par défaut : src app lib components (ceux qui existent).

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--') && !a.includes('=')));
const opt = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
};
const ignoreArg = opt('ignore');
const values = new Set([ignoreArg].filter(Boolean));
const dirs = argv.filter((a) => !a.startsWith('--') && !values.has(a));
const roots = (dirs.length ? dirs : ['src', 'app', 'lib', 'components']).filter((d) => fs.existsSync(d));

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.expo', 'ios', 'android', 'Pods', '.dart_tool', ...(ignoreArg ? ignoreArg.split(',') : [])]);
const EXT = new Set(['.css', '.scss', '.sass', '.less', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.html', '.dart', '.swift', '.kt']);

const RULES = [
  { id: 'couleur-hex', re: /(?<![\w&-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g, msg: 'couleur hexadécimale en dur → utiliser un token color.*' },
  { id: 'couleur-fonction', re: /\b(?:rgba?|hsla?|oklch)\(\s*\d/g, msg: 'couleur en dur → utiliser un token color.*' },
  { id: 'couleur-flutter', re: /\bColor\(0x[0-9a-fA-F]{8}\)/g, msg: 'couleur Flutter en dur → utiliser les tokens générés' },
  { id: 'police-px', re: /font-size\s*:\s*\d+(?:\.\d+)?px/g, msg: 'taille de police en dur → utiliser un style text.* (classe fd-text-…)' },
  { id: 'espacement-px', re: /\b(?:margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)(?:-[a-z]+)?\s*:\s*(?:[^;{}]*\s)?(?:[2-9]|[1-9]\d+)px/g, msg: 'espacement en px → utiliser var(--…-space-*) ou un token de layout' },
  { id: 'rayon-px', re: /border-radius\s*:\s*(?:[2-9]|[1-9]\d+)px/g, msg: 'rayon en dur → utiliser un token radius.*' },
  { id: 'style-rn', ext: /\.(?:jsx?|tsx?)$/, re: /\b(?:fontSize|padding\w*|margin\w*|gap|borderRadius)\s*:\s*(?!0\b)\d{1,3}\b(?!\s*[%.])/g, msg: 'valeur numérique en dur dans un style → utiliser les tokens (resolveTokens)' },
];

const findings = [];

function scan(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes('ds-ignore')) return;
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
    for (const rule of RULES) {
      if (rule.ext && !rule.ext.test(file)) continue;
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line))) {
        // Une déclaration de variable CSS (--x: #fff) est la source des tokens : ignorée.
        if (/^\s*--[\w-]+\s*:/.test(line)) break;
        findings.push({ file, line: i + 1, col: m.index + 1, rule: rule.id, match: m[0].trim(), msg: rule.msg });
      }
    }
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (EXT.has(path.extname(entry.name)) && !/tokens\.(css|ts|js|json|dart|swift|kt)$/.test(entry.name)) scan(p);
  }
}

if (!roots.length) {
  console.log('Aucun dossier à analyser (passe un ou plusieurs chemins en argument).');
  process.exit(0);
}
roots.forEach(walk);

if (flags.has('--json')) {
  console.log(JSON.stringify(findings, null, 2));
} else {
  const byRule = {};
  for (const f of findings) {
    console.log(`${f.file}:${f.line}:${f.col}  ${f.match}  — ${f.msg}`);
    byRule[f.rule] = (byRule[f.rule] ?? 0) + 1;
  }
  console.log(`\n${findings.length} valeur(s) en dur dans ${roots.join(', ')}${findings.length ? ' : ' + Object.entries(byRule).map(([k, v]) => `${k} ${v}`).join(', ') : ''}`);
}
process.exit(flags.has('--strict') && findings.length ? 1 : 0);
