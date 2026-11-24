#!/usr/bin/env node
// Convertit les tokens DTCG du dépôt vers le format d'un artifact « Design System » de claude.ai :
//   <out>/project/tokens.json            familles en listes {name, value, usage}, couleurs par thème
//   <out>/project/components/bundle.css  correspondances (polices, styles de texte, densités, animations)
//                                        + le CSS des composants (--css, par défaut web/components.css)
// Les noms de tokens sont ceux des variables CSS du build (fd-color-primary-solid → --fd-color-primary-solid),
// donc le même CSS de composants fonctionne dans le dépôt et dans l'artifact.
//
// Usage : node export-claude-artifact.mjs --out <dossier> [--config design-system/ds.config.json]
//         [--theme-axis theme] [--density-axis density] [--css design-system/web/components.css]

import fs from 'node:fs';
import path from 'node:path';
import {
  loadConfig, loadAll, context, typeOf, resolveValue, isAlias, aliasTarget, parseColor, toHex,
  dimensionToCss, dimensionToPx, durationToMs, parseArgs,
} from '../../ds-tokens/scripts/lib/tokens.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.out) {
  console.error('Usage : node export-claude-artifact.mjs --out <dossier> [--config …]');
  process.exit(1);
}
const config = loadConfig(args.config);
const all = loadAll(config);
const P = config.prefix;
const themeAxis = args['theme-axis'] ?? 'theme';
const densityAxis = args['density-axis'] ?? 'density';
const theme = all.axes[themeAxis];
const density = all.axes[densityAxis];
const themeIds = [theme.default, ...Object.keys(theme.values).filter((v) => v !== theme.default)];
const otherDensities = density ? Object.keys(density.values).filter((v) => v !== density.default) : [];

const name = (p) => `${P}-${p.replace(/\./g, '-')}`;
const groupDescription = (p) => {
  // Description du groupe parent le plus proche, relue dans les fichiers sources.
  const parts = p.split('.');
  for (let i = parts.length - 1; i > 0; i--) {
    const prefix = parts.slice(0, i).join('.');
    const d = groupDescriptions.get(prefix);
    if (d) return d;
  }
  return undefined;
};

// Descriptions de groupes : relues dans les fichiers sources.
const groupDescriptions = new Map();
function collectGroupDescriptions(node, trail) {
  if (!node || typeof node !== 'object' || '$value' in node) return;
  if (node.$description && trail.length) groupDescriptions.set(trail.join('.'), node.$description);
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) collectGroupDescriptions(v, [...trail, k]);
}
const allFiles = [...config.base, ...Object.values(config.modes).flatMap((m) => m.values[m.default])];
for (const f of allFiles) collectGroupDescriptions(JSON.parse(fs.readFileSync(path.resolve(config.__tokensDir, f), 'utf8')), []);

const ROLE = {
  solid: 'fond plein (boutons, pastilles, barres)',
  'solid-hover': 'fond plein au survol',
  'solid-active': 'fond plein pressé',
  'on-solid': 'texte et icônes posés sur solid',
  subtle: 'fond teinté (badges, bandeaux)',
  'on-subtle': 'texte et icônes posés sur subtle',
  text: 'texte et icônes de cette couleur sur bg-canvas, bg-surface, bg-raised',
  border: 'contour (bandeaux, champs en erreur)',
};
function usageOf(ctx, t) {
  if (t.$description) return t.$description;
  const leaf = t.path.split('.').pop();
  const g = groupDescription(t.path);
  return [g, ROLE[leaf]].filter(Boolean).join(' — ') || undefined;
}

// ---------------------------------------------------------------- couleurs

const colorTokens = [];
const baseCtx = context(all);
for (const t of all.base.values()) {
  if (typeOf(baseCtx, t) !== 'color') continue;
  const v = resolveValue(baseCtx, t.$value, [t.path]);
  colorTokens.push({ name: name(t.path), value: toHex(parseColor(v)), usage: usageOf(baseCtx, t) ?? 'Primitive.' });
}
const themed = theme.values[theme.default];
for (const t of themed.values()) {
  const ctx0 = context(all, { [themeAxis]: theme.default });
  const type = typeOf(ctx0, t);
  if (type !== 'color') continue;
  const value = {};
  for (const id of themeIds) {
    const ctx = context(all, { [themeAxis]: id });
    const tt = ctx.get(t.path);
    value[id] = isAlias(tt.$value) ? `{${name(aliasTarget(tt.$value))}}` : toHex(parseColor(resolveValue(ctx, tt.$value, [t.path])));
  }
  colorTokens.push({ name: name(t.path), value, usage: usageOf(ctx0, t) });
}

// ---------------------------------------------------------------- ombres (par thème)

const shadowTokens = [];
const shadowCss = (v) => (Array.isArray(v) ? v : [v]).map((s) => `${s.inset ? 'inset ' : ''}${dimensionToCss(s.offsetX)} ${dimensionToCss(s.offsetY)} ${dimensionToCss(s.blur)} ${dimensionToCss(s.spread ?? 0)} ${toHex(parseColor(s.color))}`).join(', ');
for (const t of themed.values()) {
  const ctx0 = context(all, { [themeAxis]: theme.default });
  if (typeOf(ctx0, t) !== 'shadow') continue;
  const value = {};
  for (const id of themeIds) {
    const ctx = context(all, { [themeAxis]: id });
    value[id] = shadowCss(resolveValue(ctx, ctx.get(t.path).$value, [t.path]));
  }
  shadowTokens.push({ name: name(t.path), value, usage: usageOf(ctx0, t) });
}

// ---------------------------------------------------------------- dimensions et autres familles

const families = { spacing: [], radius: [] };
const extra = {};
const addExtra = (fam, tok) => (extra[fam] ??= []).push(tok);
const familyOf = (p, type) => {
  if (p.startsWith('space.')) return 'spacing';
  if (p.startsWith('radius.')) return 'radius';
  if (p.startsWith('font.size.')) return 'fontSize';
  if (p.startsWith('font.weight.')) return 'fontWeight';
  if (p.startsWith('font.line-height.')) return 'lineHeight';
  if (p.startsWith('font.letter-spacing.')) return 'letterSpacing';
  if (p.startsWith('border-width.') || p.startsWith('focus-ring.')) return 'borderWidth';
  if (p.startsWith('breakpoint.')) return 'breakpoint';
  if (p.startsWith('size.')) return 'size';
  if (p.startsWith('layout.')) return 'layout';
  if (p.startsWith('motif.')) return 'motif';
  return null;
};
const plain = (type, v) => (type === 'dimension' ? dimensionToCss(v) : String(v));

for (const t of all.base.values()) {
  const type = typeOf(baseCtx, t);
  const fam = familyOf(t.path, type);
  if (!fam) continue;
  const tok = { name: name(t.path), value: plain(type, resolveValue(baseCtx, t.$value, [t.path])), usage: usageOf(baseCtx, t) };
  if (fam === 'spacing' || fam === 'radius') families[fam].push(tok); else addExtra(fam, tok);
}
const densityAliases = {};
if (density) {
  const defCtx = context(all, { [densityAxis]: density.default });
  for (const t of density.values[density.default].values()) {
    const type = typeOf(defCtx, t);
    const fam = familyOf(t.path, type);
    if (!fam) continue;
    const label = density.default;
    addExtra(fam, { name: name(t.path), value: plain(type, resolveValue(defCtx, t.$value, [t.path])), usage: [usageOf(defCtx, t), `Densité ${label}.`].filter(Boolean).join(' ') });
    for (const d of otherDensities) {
      const ctx = context(all, { [densityAxis]: d });
      const other = ctx.get(t.path);
      addExtra(fam, { name: `${name(t.path)}-${d}`, value: plain(type, resolveValue(ctx, other.$value, [t.path])), usage: `Valeur de ${name(t.path)} en densité ${d} (appliquée par [data-${densityAxis}="${d}"]).` });
      (densityAliases[d] ??= []).push([`--${name(t.path)}`, `var(--${name(t.path)}-${d})`]);
    }
  }
}

// ---------------------------------------------------------------- typographie

const familiesCss = {};
for (const t of all.base.values()) {
  if (typeOf(baseCtx, t) !== 'fontFamily') continue;
  const key = t.path.split('.').pop();
  const v = resolveValue(baseCtx, t.$value, [t.path]);
  familiesCss[key] = (Array.isArray(v) ? v : String(v).split(',')).map((f) => f.trim()).map((f) => (/\s/.test(f) && !/^["']/.test(f) ? `"${f}"` : f)).join(', ');
}
const samples = config.export?.samples ?? {};
const groups = {};
const textAliases = { root: [], ...Object.fromEntries(otherDensities.map((d) => [d, []])) };
if (density) {
  const defCtx = context(all, { [densityAxis]: density.default });
  for (const t of density.values[density.default].values()) {
    if (typeOf(defCtx, t) !== 'typography') continue;
    const raw = t.$value;
    const v = resolveValue(defCtx, raw, [t.path]);
    const fam = isAlias(raw.fontFamily) ? aliasTarget(raw.fontFamily).split('.').pop() : 'text';
    const fontSize = dimensionToPx(v.fontSize);
    const terrain = otherDensities.map((d) => {
      const ctx = context(all, { [densityAxis]: d });
      return `${dimensionToPx(resolveValue(ctx, ctx.get(t.path).$value, [t.path]).fontSize)} px en ${d}`;
    });
    (groups[fam] ??= []).push({
      name: name(t.path),
      fontSize: `${fontSize}px`,
      lineHeight: v.lineHeight,
      fontWeight: Number(v.fontWeight),
      ...(v.letterSpacing && parseFloat(v.letterSpacing) !== 0 ? { letterSpacing: dimensionToCss(v.letterSpacing) } : {}),
      ...(samples[t.path] ? { sample: samples[t.path] } : {}),
      usage: [t.$description, `${fontSize} px en ${density.default}${terrain.length ? ', ' + terrain.join(', ') : ''}.`].filter(Boolean).join(' '),
    });
    // Composites CSS (--fd-text-*) reconstruits à partir des références : aucune valeur recopiée.
    const composite = (val) => {
      const ref = (x) => (isAlias(x) ? `var(--${name(aliasTarget(x)).replace(`${P}-font-family-`, 'font-')})` : x);
      return [`${ref(val.fontWeight)} ${ref(val.fontSize)}/${ref(val.lineHeight)} ${ref(val.fontFamily)}`, val.letterSpacing ? ref(val.letterSpacing) : 'normal'];
    };
    const [f, ls] = composite(raw);
    textAliases.root.push([`--${name(t.path)}`, f], [`--${name(t.path)}-letter-spacing`, ls]);
    for (const d of otherDensities) {
      const ctx = context(all, { [densityAxis]: d });
      const [fd, lsd] = composite(ctx.get(t.path).$value);
      if (fd !== f) textAliases[d].push([`--${name(t.path)}`, fd]);
      if (lsd !== ls) textAliases[d].push([`--${name(t.path)}-letter-spacing`, lsd]);
    }
  }
}
const GROUP_LABEL = { display: 'Titres', text: 'Texte', mono: 'Références' };

// ---------------------------------------------------------------- écriture

const tokens = {
  name: config.name,
  version: 1,
  meta: { source: 'repository', paths: { tokens: [path.relative(process.cwd(), config.__tokensDir)] }, generator: 'export-claude-artifact.mjs', exported: new Date().toISOString().slice(0, 10) },
  color: { themes: themeIds.map((id) => ({ id, name: config.export?.themeNames?.[id] ?? id })), tokens: colorTokens },
  type: {
    fonts: [],
    families: familiesCss,
    groups: Object.entries(groups).map(([fam, styles]) => ({ name: GROUP_LABEL[fam] ?? fam, family: fam, styles })),
  },
  spacing: { note: 'Base 4 px.', tokens: families.spacing },
  radius: { note: 'Arrondis sobres.', tokens: families.radius },
  shadow: { note: 'Préférer les contours (border-subtle) ; ombres pour ce qui flotte.', tokens: shadowTokens },
  ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, { tokens: v }])),
};

const motion = [...all.base.values()].filter((t) => ['duration', 'cubicBezier'].includes(typeOf(baseCtx, t))).map((t) => {
  const v = resolveValue(baseCtx, t.$value, [t.path]);
  return [`--${name(t.path)}`, typeOf(baseCtx, t) === 'duration' ? `${durationToMs(v)}ms` : `cubic-bezier(${v.join(', ')})`];
});
const decl = (pairs, indent = '  ') => pairs.map(([k, v]) => `${indent}${k}: ${v};`).join('\n');
const fontsUrl = config.export?.googleFonts;
const shim = `${fontsUrl ? `@import url("${fontsUrl}");\n` : ''}/* ${config.name} — correspondances générées par export-claude-artifact.mjs.
   Ne contient aucune valeur de tokens.json : seulement des alias (polices, styles de texte, densités)
   et les animations, que le format de l'artifact ne porte pas. */
:root {
${decl(Object.keys(familiesCss).map((k) => [`--${P}-font-family-${k}`, `var(--font-${k})`]))}
${decl(motion)}
${decl(textAliases.root)}
}
${otherDensities.map((d) => `[data-${densityAxis}="${d}"] {\n${decl([...(densityAliases[d] ?? []), ...textAliases[d]])}\n}`).join('\n')}
body { margin: 0; background: var(--${P}-color-bg-canvas); color: var(--${P}-color-fg-default); font: var(--${P}-text-body); }
.${P}-preview { display: flex; flex-wrap: wrap; gap: var(--${P}-space-3); align-items: center; padding: var(--${P}-space-4); }
.${P}-preview--stack { display: grid; gap: var(--${P}-space-3); padding: var(--${P}-space-4); }
`;
const cssPath = args.css ?? path.resolve(path.dirname(config.__path), 'web/components.css');
const componentsCss = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

const out = path.resolve(args.out, 'project');
fs.mkdirSync(path.join(out, 'components'), { recursive: true });
fs.writeFileSync(path.join(out, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'components/bundle.css'), `${shim}\n${componentsCss}`);
const counts = `${colorTokens.length} couleurs, ${Object.values(groups).flat().length} styles de texte, ${families.spacing.length} espacements, ${families.radius.length} rayons, ${shadowTokens.length} ombres, ${Object.values(extra).flat().length} autres`;
console.log(`✔ ${path.relative(process.cwd(), out)}/tokens.json (${counts})`);
console.log(`✔ ${path.relative(process.cwd(), out)}/components/bundle.css`);
