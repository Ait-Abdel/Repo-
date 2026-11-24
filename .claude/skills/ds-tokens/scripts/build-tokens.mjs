#!/usr/bin/env node
// Construit les sorties du design system à partir des tokens DTCG :
//   css  → <outDir>/css/tokens.css   (variables CSS + modes + classes de texte)
//   ts   → <outDir>/ts/tokens.ts     (valeurs résolues, prêtes pour React / React Native)
//   json → <outDir>/json/tokens.json (valeurs résolues, pour Flutter, Swift, Kotlin, outils)
//
// Usage : node build-tokens.mjs [--config design-system/ds.config.json] [--only css,ts]

import fs from 'node:fs';
import path from 'node:path';
import {
  loadConfig, loadAll, context, isAlias, aliasTarget, typeOf, resolveValue,
  dimensionToCss, dimensionToPx, parseDimension, durationToMs, parseColor, toHex,
  cssVarName, setDeep, parseArgs, round,
} from './lib/tokens.mjs';

const args = parseArgs(process.argv.slice(2));
const config = loadConfig(args.config);
const all = loadAll(config);
const outputs = new Set(String(args.only ?? (config.outputs ?? ['css', 'ts', 'json']).join(',')).split(','));
const P = config.prefix;
const header = `${config.name ?? 'Design system'} — généré par build-tokens.mjs depuis ${path.relative(path.dirname(config.__path), config.__tokensDir) || '.'}. Ne pas éditer à la main.`;

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------

const GENERIC_FAMILIES = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-sans-serif', 'ui-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong', '-apple-system', 'BlinkMacSystemFont']);

function familyToCss(v) {
  const list = Array.isArray(v) ? v : String(v).split(',').map((s) => s.trim());
  return list.map((f) => (GENERIC_FAMILIES.has(f) || /^["']/.test(f) ? f : /\s/.test(f) ? `"${f}"` : f)).join(', ');
}

/** Valeur CSS d'un champ : alias → var(), sinon littéral selon le type. */
function cssField(value, type) {
  if (isAlias(value)) return `var(${cssVarName(P, aliasTarget(value))})`;
  switch (type) {
    case 'color': return toHex(parseColor(value));
    case 'dimension': return dimensionToCss(value);
    case 'fontFamily': return familyToCss(value);
    case 'duration': return `${durationToMs(value)}ms`;
    case 'cubicBezier': return `cubic-bezier(${value.join(', ')})`;
    case 'number':
    case 'fontWeight': return String(value);
    default: return String(value);
  }
}

function shadowToCss(value) {
  const list = Array.isArray(value) ? value : [value];
  return list.map((s) => [
    s.inset ? 'inset' : '',
    cssField(s.offsetX, 'dimension'),
    cssField(s.offsetY, 'dimension'),
    cssField(s.blur, 'dimension'),
    cssField(s.spread ?? '0px', 'dimension'),
    cssField(s.color, 'color'),
  ].filter(Boolean).join(' ')).join(', ');
}

/** Déclarations CSS d'un token : [[nom, valeur], ...] */
function cssDecls(ctx, token) {
  const name = cssVarName(P, token.path);
  const type = typeOf(ctx, token);
  const v = token.$value;
  if (isAlias(v)) {
    const decls = [[name, `var(${cssVarName(P, aliasTarget(v))})`]];
    if (type === 'typography') decls.push([`${name}-letter-spacing`, `var(${cssVarName(P, aliasTarget(v))}-letter-spacing)`]);
    return decls;
  }
  switch (type) {
    case 'shadow': return [[name, shadowToCss(v)]];
    case 'border': return [[name, `${cssField(v.width, 'dimension')} ${v.style ?? 'solid'} ${cssField(v.color, 'color')}`]];
    case 'typography': {
      const font = `${cssField(v.fontWeight ?? 400, 'fontWeight')} ${cssField(v.fontSize, 'dimension')}/${cssField(v.lineHeight ?? 1.4, 'number')} ${cssField(v.fontFamily, 'fontFamily')}`;
      return [[name, font], [`${name}-letter-spacing`, v.letterSpacing != null ? cssField(v.letterSpacing, 'dimension') : 'normal']];
    }
    default: return [[name, cssField(v, type)]];
  }
}

function block(selector, ctx, tokens, extra = []) {
  const lines = [];
  for (const t of tokens.values()) {
    if (t.$description) lines.push(`  /* ${t.$description.replace(/\*\//g, '* /')} */`);
    for (const [k, val] of cssDecls(ctx, t)) lines.push(`  ${k}: ${val};`);
  }
  for (const [k, val] of extra) lines.push(`  ${k}: ${val};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}

function buildCss() {
  const parts = [`/* ${header} */`, ''];
  const defaultCtx = context(all);
  parts.push('/* ---- Base (primitives, partagée par tous les modes) ---- */');
  parts.push(block(':root', defaultCtx, all.base));

  const typographyPaths = new Set();
  for (const t of all.base.values()) if (typeOf(defaultCtx, t) === 'typography') typographyPaths.add(t.path);

  for (const [axis, def] of Object.entries(all.axes)) {
    const attr = def.css.attribute ?? `data-${axis}`;
    const colorScheme = def.css.colorScheme ?? {};
    for (const [value, tokens] of Object.entries(def.values)) {
      const ctx = context(all, { [axis]: value });
      for (const t of tokens.values()) if (typeOf(ctx, t) === 'typography') typographyPaths.add(t.path);
      const extra = colorScheme[value] ? [['color-scheme', colorScheme[value]]] : [];
      const isDefault = value === def.default;
      parts.push('');
      parts.push(`/* ---- ${axis} : ${value}${isDefault ? ' (défaut)' : ''} ---- */`);
      parts.push(block(isDefault ? `:root, [${attr}="${value}"]` : `[${attr}="${value}"]`, ctx, tokens, extra));
      // Préférence système (ex. thème sombre) quand aucun attribut n'est posé.
      for (const [media, target] of Object.entries(def.css.media ?? {})) {
        if (target !== value) continue;
        const inner = block(`:root:not([${attr}])`, ctx, tokens, extra).replace(/^/gm, '  ');
        parts.push(`@media ${media} {\n${inner}\n}`);
      }
    }
  }

  if (typographyPaths.size) {
    parts.push('');
    parts.push('/* ---- Styles de texte (classes utilitaires) ---- */');
    for (const p of typographyPaths) {
      const v = cssVarName(P, p);
      parts.push(`.${v.slice(2)} { font: var(${v}); letter-spacing: var(${v}-letter-spacing); }`);
    }
  }
  return parts.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// Valeurs résolues (TS / JSON) — pensées pour React Native et les outils natifs
// ---------------------------------------------------------------------------

const remBase = config.remBase ?? 16;

function firstFamily(v) {
  const list = Array.isArray(v) ? v : String(v).split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
  return list[0];
}

function resolvedField(value, type) {
  switch (type) {
    case 'color': return toHex(parseColor(value));
    case 'dimension': {
      const d = parseDimension(value);
      return d.unit === 'px' || d.unit === 'rem' ? dimensionToPx(value, { remBase }) : `${d.value}${d.unit}`;
    }
    case 'duration': return durationToMs(value);
    case 'fontFamily': return Array.isArray(value) ? value : String(value).split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
    case 'number':
    case 'fontWeight': return Number(value);
    case 'shadow': {
      const one = (s) => ({
        offsetX: dimensionToPx(s.offsetX), offsetY: dimensionToPx(s.offsetY),
        blur: dimensionToPx(s.blur), spread: dimensionToPx(s.spread ?? 0),
        color: toHex(parseColor(s.color)), ...(s.inset ? { inset: true } : {}),
      });
      return Array.isArray(value) ? value.map(one) : one(value);
    }
    case 'typography': {
      const fontSize = dimensionToPx(value.fontSize, { remBase });
      const lh = value.lineHeight ?? 1.4;
      const ls = value.letterSpacing ?? 0;
      return {
        fontFamily: firstFamily(value.fontFamily),
        fontSize,
        fontWeight: String(value.fontWeight ?? 400),
        lineHeight: round(typeof lh === 'number' ? lh * fontSize : dimensionToPx(lh, { remBase, emBase: fontSize }), 2),
        letterSpacing: round(dimensionToPx(ls, { remBase, emBase: fontSize }), 3),
      };
    }
    case 'border': return { width: dimensionToPx(value.width), style: value.style ?? 'solid', color: toHex(parseColor(value.color)) };
    default: return value;
  }
}

function resolvedTree(ctx, tokens) {
  const tree = {};
  for (const t of tokens.values()) {
    const type = typeOf(ctx, t);
    setDeep(tree, t.path, resolvedField(resolveValue(ctx, t.$value, [t.path]), type));
  }
  return tree;
}

function resolvedAll() {
  const base = resolvedTree(context(all), all.base);
  const modes = {};
  for (const [axis, def] of Object.entries(all.axes)) {
    modes[axis] = {};
    for (const [value, tokens] of Object.entries(def.values)) {
      modes[axis][value] = resolvedTree(context(all, { [axis]: value }), tokens);
    }
  }
  const defaults = Object.fromEntries(Object.entries(all.axes).map(([a, d]) => [a, d.default]));
  return { name: config.name, prefix: P, defaults, base, modes };
}

function buildTs(data) {
  const axes = Object.keys(data.modes);
  const selType = axes.map((a) => `  ${a}?: keyof typeof modes.${a};`).join('\n');
  return `// ${header}
// Dimensions en px (nombres), durées en ms, typographies prêtes pour React Native
// (lineHeight et letterSpacing en px absolus, fontFamily = première police de la pile).

export const defaults = ${JSON.stringify(data.defaults, null, 2)} as const;

export const base = ${JSON.stringify(data.base, null, 2)} as const;

export const modes = ${JSON.stringify(data.modes, null, 2)} as const;

export type ModeSelection = {
${selType}
};

function merge(target: Record<string, any>, source: Record<string, any>) {
  for (const [k, v] of Object.entries(source)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      target[k] = merge(target[k] && typeof target[k] === 'object' ? { ...target[k] } : {}, v);
    } else target[k] = v;
  }
  return target;
}

/** Fusionne la base et les modes choisis : resolveTokens({ theme: 'dark', density: 'terrain' }) */
export function resolveTokens(selection: ModeSelection = {}) {
  const out: Record<string, any> = merge({}, base);
  for (const axis of Object.keys(modes) as (keyof typeof modes)[]) {
    const value = (selection as any)[axis] ?? (defaults as any)[axis];
    merge(out, (modes as any)[axis][value]);
  }
  return out as typeof base & ${axes.map((a) => `(typeof modes.${a})[keyof typeof modes.${a}]`).join(' & ') || '{}'};
}

export default { defaults, base, modes, resolveTokens };
`;
}

// ---------------------------------------------------------------------------

function write(rel, content) {
  const p = path.join(config.__outDir, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log(`✔ ${path.relative(process.cwd(), p)}`);
}

try {
  if (outputs.has('css')) write('css/tokens.css', buildCss());
  if (outputs.has('ts') || outputs.has('json')) {
    const data = resolvedAll();
    if (outputs.has('ts')) write('ts/tokens.ts', buildTs(data));
    if (outputs.has('json')) write('json/tokens.json', JSON.stringify(data, null, 2) + '\n');
  }
} catch (e) {
  console.error(`✘ ${e.message}`);
  console.error('  Lance check-tokens.mjs pour un diagnostic complet.');
  process.exit(1);
}
