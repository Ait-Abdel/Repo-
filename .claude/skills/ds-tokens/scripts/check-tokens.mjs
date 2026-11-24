#!/usr/bin/env node
// Vérifie un jeu de tokens DTCG avant build :
//   1. structure : $type connu, valeurs parsables, alias résolus, pas de cycle
//   2. architecture : la base ne dépend d'aucun mode ; un mode ne dépend que de la base et de lui-même
//   3. parité : chaque valeur d'un axe (light/dark, bureau/terrain…) définit exactement les mêmes tokens
//   4. contraste WCAG des paires déclarées dans ds.config.json (checks.contrast), pour chaque mode
//   5. distinction des palettes catégorielles (checks.categorical) en vision normale et daltonienne
//
// Usage : node check-tokens.mjs [--config design-system/ds.config.json] [--verbose]
// Code de sortie 1 si au moins une erreur (les avertissements ne bloquent pas).

import {
  loadConfig, loadAll, context, typeOf, resolveValue, referencesOf, parseColor,
  parseDimension, durationToMs, contrast, deltaE, VISIONS, patternToRegex, parseArgs,
} from './lib/tokens.mjs';

const args = parseArgs(process.argv.slice(2));
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

let config, all;
try {
  config = loadConfig(args.config);
  all = loadAll(config);
} catch (e) {
  console.error(`✘ ${e.message}`);
  process.exit(1);
}

const KNOWN_TYPES = new Set(['color', 'dimension', 'fontFamily', 'fontWeight', 'duration', 'cubicBezier', 'number', 'shadow', 'typography', 'border', 'strokeStyle', 'transition', 'gradient']);

// ---- 1 & 2 : structure et dépendances ------------------------------------

function validate(ctx, token, allowed, scopeLabel) {
  const type = typeOf(ctx, token);
  if (!type) return err(`${token.path} : $type manquant (sur le token ou son groupe)`);
  if (!KNOWN_TYPES.has(type)) warn(`${token.path} : $type « ${type} » non standard`);
  for (const ref of referencesOf(token.$value)) {
    if (!ctx.has(ref)) return err(`${token.path} : alias cassé {${ref}}`);
    if (allowed && !allowed(ref)) err(`${token.path} (${scopeLabel}) référence {${ref}}, défini dans un autre axe de modes`);
  }
  let v;
  try {
    v = resolveValue(ctx, token.$value, [token.path]);
  } catch (e) {
    return err(`${token.path} : ${e.message}`);
  }
  try {
    if (type === 'color') parseColor(v);
    if (type === 'dimension') parseDimension(v);
    if (type === 'duration') durationToMs(v);
    if (type === 'typography' && v.fontSize == null) err(`${token.path} : typographie sans fontSize`);
  } catch (e) {
    err(`${token.path} : ${e.message}`);
  }
}

const baseCtx = context(all);
for (const t of all.base.values()) {
  validate(baseCtx, t, (ref) => all.base.has(ref), 'base');
}

for (const [axis, def] of Object.entries(all.axes)) {
  const values = Object.entries(def.values);
  for (const [value, tokens] of values) {
    const ctx = context(all, { [axis]: value });
    for (const t of tokens.values()) {
      if (all.base.has(t.path)) err(`${t.path} : défini dans la base ET dans ${axis}/${value} (un token vit à un seul endroit)`);
      validate(ctx, t, (ref) => all.base.has(ref) || tokens.has(ref), `${axis}/${value}`);
    }
    for (const [otherAxis, otherDef] of Object.entries(all.axes)) {
      if (otherAxis === axis) continue;
      for (const p of tokens.keys()) {
        if (Object.values(otherDef.values).some((m) => m.has(p))) err(`${p} : défini à la fois dans l'axe ${axis} et l'axe ${otherAxis}`);
      }
    }
  }
  // ---- 3 : parité ----
  const ref = def.values[def.default];
  for (const [value, tokens] of values) {
    if (value === def.default) continue;
    for (const p of ref.keys()) if (!tokens.has(p)) err(`${axis}/${value} : manque ${p} (présent dans ${def.default})`);
    for (const p of tokens.keys()) if (!ref.has(p)) err(`${axis}/${def.default} : manque ${p} (présent dans ${value})`);
  }
}

// ---- 4 : contraste -------------------------------------------------------

const results = [];
const contrastCfg = config.checks?.contrast;
if (contrastCfg) {
  const axis = contrastCfg.axis;
  const values = axis ? Object.keys(all.axes[axis]?.values ?? {}) : [null];
  if (axis && !all.axes[axis]) err(`checks.contrast.axis « ${axis} » inconnu`);
  for (const value of values) {
    const ctx = context(all, value ? { [axis]: value } : {});
    const color = (p) => parseColor(resolveValue(ctx, ctx.get(p).$value, [p]));
    for (const pair of contrastCfg.pairs ?? []) {
      const bgs = Array.isArray(pair.bg) ? pair.bg : [pair.bg];
      const fgRe = patternToRegex(pair.fg);
      const matches = [...ctx.keys()].map((p) => [p, p.match(fgRe)]).filter(([, m]) => m);
      if (!matches.length) err(`contraste : aucun token ne correspond à ${pair.fg}`);
      for (const [fgPath, m] of matches) {
        for (const bgPattern of bgs) {
          const bgPath = bgPattern.replace('*', m[1] ?? '*');
          if (!ctx.has(bgPath)) { err(`contraste : fond ${bgPath} introuvable`); continue; }
          let ratio;
          try { ratio = contrast(color(fgPath), color(bgPath)); } catch (e) { err(`contraste ${fgPath} / ${bgPath} : ${e.message}`); continue; }
          const ok = ratio >= pair.min;
          results.push({ mode: value ?? '-', fg: fgPath, bg: bgPath, ratio, min: pair.min, ok, note: pair.note });
          if (!ok) err(`contraste ${value ?? ''} : ${fgPath} sur ${bgPath} = ${ratio.toFixed(2)}:1 (min ${pair.min}:1${pair.note ? ` — ${pair.note}` : ''})`);
        }
      }
    }
  }
}

// ---- 5 : palettes catégorielles -----------------------------------------

const catResults = [];
for (const cat of config.checks?.categorical ?? []) {
  const axis = cat.axis;
  const values = axis ? Object.keys(all.axes[axis]?.values ?? {}) : [null];
  for (const value of values) {
    const ctx = context(all, value ? { [axis]: value } : {});
    const res = (Array.isArray(cat.tokens) ? cat.tokens : [cat.tokens]).map(patternToRegex);
    const items = [...ctx.keys()].filter((p) => res.some((re) => re.test(p))).map((p) => ({ p, c: parseColor(resolveValue(ctx, ctx.get(p).$value, [p])) }));
    if (items.length < 2) { warn(`catégoriel : moins de 2 tokens pour ${cat.tokens}`); continue; }
    for (const vision of VISIONS) {
      let min = { d: Infinity };
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const d = deltaE(items[i].c, items[j].c, vision);
          if (d < min.d) min = { d, a: items[i].p, b: items[j].p };
        }
      }
      const threshold = vision === 'normale' ? cat.minDeltaE ?? 0.08 : cat.minDeltaECvd ?? cat.minDeltaE ?? 0.08;
      const ok = min.d >= threshold;
      catResults.push({ mode: value ?? "-", set: cat.name ?? String(cat.tokens), vision, ...min, threshold, ok });
      if (!ok) {
        const msg = `catégoriel ${value ?? ''} (${vision}) : ${min.a} et ${min.b} trop proches (ΔE ${min.d.toFixed(3)} < ${threshold})`;
        if (vision === 'normale' && cat.strict !== false) err(msg); else warn(msg);
      }
    }
  }
}

// ---- Rapport ---------------------------------------------------------------

const count = all.base.size + Object.values(all.axes).reduce((n, a) => n + [...Object.values(a.values)][0].size, 0);
console.log(`${config.name ?? 'Design system'} : ${count} tokens (${all.base.size} en base, ${Object.keys(all.axes).length} axe(s) de modes)`);

if (results.length) {
  const failing = results.filter((r) => !r.ok).length;
  console.log(`\nContraste : ${results.length - failing}/${results.length} paires conformes`);
  if (args.verbose) {
    for (const r of results) console.log(`  ${r.ok ? '✔' : '✘'} [${r.mode}] ${r.fg} / ${r.bg} : ${r.ratio.toFixed(2)}:1 (min ${r.min})`);
  }
}
if (catResults.length) {
  console.log('\nPalettes catégorielles (plus petite distance ΔE OKLab entre deux couleurs) :');
  for (const r of catResults) {
    console.log(`  ${r.ok ? "✔" : "⚠"} [${r.mode}] ${r.set} · ${r.vision.padEnd(12)} ΔE min ${r.d.toFixed(3)} (seuil ${r.threshold}) ${r.ok ? '' : `→ ${r.a} ≈ ${r.b}`}`);
  }
}
if (warnings.length) {
  console.log(`\n${warnings.length} avertissement(s) :`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
}
if (errors.length) {
  console.log(`\n${errors.length} erreur(s) :`);
  for (const e of errors) console.log(`  ✘ ${e}`);
  process.exit(1);
}
console.log('\n✔ Tokens valides');
