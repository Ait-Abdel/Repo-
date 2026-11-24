// Bibliothèque partagée : chargement, aplatissement et résolution de tokens
// au format W3C DTCG ($value, $type, $description, alias "{chemin.du.token}").
// Aucune dépendance : Node >= 18.

import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export function findConfig(start = process.cwd()) {
  let dir = path.resolve(start);
  for (;;) {
    for (const rel of ['ds.config.json', 'design-system/ds.config.json']) {
      const p = path.join(dir, rel);
      if (fs.existsSync(p)) return p;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function loadConfig(configPath) {
  const p = configPath ? path.resolve(configPath) : findConfig();
  if (!p || !fs.existsSync(p)) {
    throw new Error('ds.config.json introuvable (cherché dans le dossier courant et design-system/). Passe --config <chemin>.');
  }
  const config = JSON.parse(fs.readFileSync(p, 'utf8'));
  const root = path.dirname(p);
  config.__path = p;
  config.__tokensDir = path.resolve(root, config.tokensDir ?? 'tokens');
  config.__outDir = path.resolve(root, config.outDir ?? 'build');
  config.prefix ??= 'ds';
  config.base ??= [];
  config.modes ??= {};
  return config;
}

// ---------------------------------------------------------------------------
// Chargement et aplatissement
// ---------------------------------------------------------------------------

/** Lit un fichier DTCG et renvoie Map<chemin, token> */
export function flattenFile(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  const out = new Map();
  walk(json, [], undefined, out, file);
  return out;
}

function walk(node, trail, inheritedType, out, file) {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return;
  const type = node.$type ?? inheritedType;
  if (Object.prototype.hasOwnProperty.call(node, '$value')) {
    const p = trail.join('.');
    out.set(p, {
      path: p,
      $value: node.$value,
      $type: type,
      $description: node.$description,
      $extensions: node.$extensions,
      file,
    });
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (key.includes('.') || key.includes('{') || key.includes('}')) {
      throw new Error(`${file} : nom de groupe/token invalide « ${key} » (pas de . { } dans les noms)`);
    }
    walk(child, [...trail, key], type, out, file);
  }
}

export function loadFiles(config, files) {
  const merged = new Map();
  for (const rel of files) {
    const abs = path.resolve(config.__tokensDir, rel);
    for (const [p, t] of flattenFile(abs)) {
      if (merged.has(p)) {
        throw new Error(`Token « ${p} » défini deux fois (${merged.get(p).file} et ${abs})`);
      }
      merged.set(p, t);
    }
  }
  return merged;
}

/**
 * Charge la base et chaque valeur de chaque axe de modes.
 * Renvoie { base: Map, axes: { [axe]: { default, values: { [valeur]: Map } } } }
 */
export function loadAll(config) {
  const base = loadFiles(config, config.base);
  const axes = {};
  for (const [axis, def] of Object.entries(config.modes)) {
    axes[axis] = { default: def.default, css: def.css ?? {}, values: {} };
    for (const [value, files] of Object.entries(def.values)) {
      axes[axis].values[value] = loadFiles(config, files);
    }
    if (!axes[axis].values[def.default]) {
      throw new Error(`Mode « ${axis} » : la valeur par défaut « ${def.default} » n'existe pas`);
    }
  }
  return { base, axes };
}

/** Contexte de résolution : base + une valeur choisie pour chaque axe (défaut sinon). */
export function context(all, selection = {}) {
  const ctx = new Map(all.base);
  for (const [axis, def] of Object.entries(all.axes)) {
    const value = selection[axis] ?? def.default;
    for (const [p, t] of def.values[value]) ctx.set(p, t);
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Résolution des alias
// ---------------------------------------------------------------------------

const ALIAS = /^\{([^{}]+)\}$/;

export function isAlias(v) {
  return typeof v === 'string' && ALIAS.test(v);
}

export function aliasTarget(v) {
  return v.match(ALIAS)[1];
}

/** Liste des chemins référencés par une valeur (alias directs et dans les composites). */
export function referencesOf(value) {
  const refs = [];
  (function visit(v) {
    if (isAlias(v)) refs.push(aliasTarget(v));
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === 'object') Object.values(v).forEach(visit);
  })(value);
  return refs;
}

/** Type effectif d'un token (suit les alias si $type absent). */
export function typeOf(ctx, token, seen = new Set()) {
  if (token.$type) return token.$type;
  if (isAlias(token.$value)) {
    const target = aliasTarget(token.$value);
    if (seen.has(target)) return undefined;
    seen.add(target);
    const t = ctx.get(target);
    return t ? typeOf(ctx, t, seen) : undefined;
  }
  return undefined;
}

/** Résout récursivement une valeur dans un contexte. Lève une erreur si alias cassé ou cycle. */
export function resolveValue(ctx, value, stack = []) {
  if (isAlias(value)) {
    const target = aliasTarget(value);
    if (stack.includes(target)) {
      throw new Error(`Cycle d'alias : ${[...stack, target].join(' → ')}`);
    }
    const t = ctx.get(target);
    if (!t) throw new Error(`Alias cassé : {${target}}${stack.length ? ` (depuis ${stack[stack.length - 1]})` : ''}`);
    return resolveValue(ctx, t.$value, [...stack, target]);
  }
  if (Array.isArray(value)) return value.map((v) => resolveValue(ctx, v, stack));
  if (value && typeof value === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(value)) o[k] = resolveValue(ctx, v, stack);
    return o;
  }
  return value;
}

// ---------------------------------------------------------------------------
// Normalisation des valeurs
// ---------------------------------------------------------------------------

/** "16px" | "1rem" | {value, unit} | 16  →  {value, unit} */
export function parseDimension(v) {
  if (typeof v === 'number') return { value: v, unit: 'px' };
  if (v && typeof v === 'object' && 'value' in v) return { value: Number(v.value), unit: v.unit ?? 'px' };
  if (typeof v === 'string') {
    const m = v.trim().match(/^(-?\d*\.?\d+)(px|rem|em|%)?$/);
    if (m) return { value: Number(m[1]), unit: m[2] ?? 'px' };
  }
  throw new Error(`Dimension invalide : ${JSON.stringify(v)}`);
}

export function dimensionToCss(v) {
  const d = parseDimension(v);
  return d.value === 0 ? '0' : `${round(d.value)}${d.unit}`;
}

/** Dimension → nombre de px (rem × remBase ; em × emBase si fourni). */
export function dimensionToPx(v, { remBase = 16, emBase } = {}) {
  const d = parseDimension(v);
  if (d.unit === 'px') return d.value;
  if (d.unit === 'rem') return round(d.value * remBase);
  if (d.unit === 'em' && emBase != null) return round(d.value * emBase);
  throw new Error(`Impossible de convertir ${JSON.stringify(v)} en px`);
}

/** "200ms" | "0.2s" | {value, unit} → millisecondes */
export function durationToMs(v) {
  if (typeof v === 'number') return v;
  if (v && typeof v === 'object') return v.unit === 's' ? v.value * 1000 : v.value;
  const m = String(v).match(/^(\d*\.?\d+)(ms|s)$/);
  if (!m) throw new Error(`Durée invalide : ${JSON.stringify(v)}`);
  return m[2] === 's' ? Number(m[1]) * 1000 : Number(m[1]);
}

export function round(n, d = 4) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

// ---------------------------------------------------------------------------
// Couleur : parsing, sRGB ⇄ OKLab/OKLCH, contraste WCAG, simulation daltonisme
// ---------------------------------------------------------------------------

/** Couleur DTCG (hex ou objet) → {r,g,b,a} en 0..1 (sRGB gamma) */
export function parseColor(v) {
  if (v && typeof v === 'object') {
    if (v.hex) return parseColor(v.hex);
    if (v.components && (v.colorSpace ?? 'srgb') === 'srgb') {
      const [r, g, b] = v.components;
      return { r, g, b, a: v.alpha ?? 1 };
    }
    throw new Error(`Couleur objet non gérée : ${JSON.stringify(v)}`);
  }
  const s = String(v).trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) throw new Error(`Hex invalide : ${v}`);
    const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+%?))?\s*\)$/);
  if (m) {
    const a = m[4] == null ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : Number(m[4]);
    return { r: m[1] / 255, g: m[2] / 255, b: m[3] / 255, a };
  }
  throw new Error(`Couleur non reconnue : ${v} (utilise un hex #rrggbb ou #rrggbbaa)`);
}

export function toHex({ r, g, b, a = 1 }) {
  const h = (x) => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}${a < 1 ? h(a) : ''}`;
}

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function srgbToLinear({ r, g, b }) {
  return [lin(r), lin(g), lin(b)];
}

export function linearToSrgb([r, g, b]) {
  return { r: gam(r), g: gam(g), b: gam(b), a: 1 };
}

export function linearToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function oklabToLinear([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export function oklchToLinear(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  return oklabToLinear([L, C * Math.cos(h), C * Math.sin(h)]);
}

export function colorToOklch(c) {
  const [L, a, b] = linearToOklab(srgbToLinear(c));
  const C = Math.hypot(a, b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
}

export function inGamut(rgbLinear, eps = 1e-6) {
  return rgbLinear.every((x) => x >= -eps && x <= 1 + eps);
}

/** Compose une couleur semi-transparente sur un fond opaque. */
export function composite(fg, bg) {
  const a = fg.a ?? 1;
  if (a >= 1) return fg;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}

export function luminance(c) {
  const [r, g, b] = srgbToLinear(c);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Ratio de contraste WCAG 2.x (fg composé sur bg si transparent). */
export function contrast(fg, bg) {
  const f = composite(fg, bg);
  const L1 = luminance(f);
  const L2 = luminance(bg);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

// Matrices de Machado et al. (2009), sévérité 1.0, appliquées en RGB linéaire.
const CVD = {
  protanopie: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopie: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopie: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

export const VISIONS = ['normale', ...Object.keys(CVD)];

export function simulate(c, vision) {
  const rgb = srgbToLinear(c);
  if (vision === 'normale') return rgb;
  const M = CVD[vision];
  return M.map((row) => Math.min(1, Math.max(0, row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2])));
}

/** Distance perceptuelle ΔE OKLab (≈ 0.02 = à peine visible, ≥ 0.1 = nettement différent). */
export function deltaE(c1, c2, vision = 'normale') {
  const a = linearToOklab(simulate(c1, vision));
  const b = linearToOklab(simulate(c2, vision));
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

// ---------------------------------------------------------------------------
// Utilitaires divers
// ---------------------------------------------------------------------------

/** "color.metier.*.solid" → RegExp ; capture le segment * */
export function patternToRegex(pattern) {
  const esc = pattern
    .split('.')
    .map((seg) => (seg === '*' ? '([^.]+)' : seg.replace(/[-/\\^$+?()|[\]{}]/g, '\\$&')))
    .join('\\.');
  return new RegExp(`^${esc}$`);
}

export function cssVarName(prefix, p) {
  return `--${prefix ? prefix + '-' : ''}${p.replace(/\./g, '-')}`;
}

export function setDeep(obj, p, value) {
  const keys = p.split('.');
  let o = obj;
  for (const k of keys.slice(0, -1)) {
    o[k] ??= {};
    o = o[k];
  }
  o[keys[keys.length - 1]] = value;
}

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      if (v !== undefined) args[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) args[k] = argv[++i];
      else args[k] = true;
    } else args._.push(a);
  }
  return args;
}
