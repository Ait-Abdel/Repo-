#!/usr/bin/env node
// Génère une gamme de couleurs 50→950 perceptuellement régulière (OKLCH),
// ramenée dans le gamut sRGB, au format DTCG. Affiche les contrastes sur
// blanc / noir pour choisir les paliers texte et fond.
//
// Usage :
//   node generate-scale.mjs --name bleu --hue 258 --chroma 0.15
//   node generate-scale.mjs --name beton --hue 85 --chroma 0.012 \
//        --stops "50:0.978,100:0.955,200:0.91,300:0.84,400:0.72,500:0.6,600:0.5,700:0.42,800:0.34,900:0.26,950:0.225,975:0.19"
//   node generate-scale.mjs --name ele --hue 90 --chroma 0.13 --only 100,300,500,700,900
//   Options : --group palette (préfixe du groupe), --json (sortie seule, sans tableau)

import { oklchToLinear, inGamut, linearToSrgb, toHex, contrast, parseArgs } from './lib/tokens.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.name || args.hue == null) {
  console.error('Usage : node generate-scale.mjs --name <nom> --hue <0-360> [--chroma 0.14] [--stops "50:0.97,..."] [--only 100,500] [--group palette]');
  process.exit(1);
}

const hue = Number(args.hue);
const peak = Number(args.chroma ?? 0.14);

// Luminosité OKLab par palier et part de la chroma maximale.
const DEFAULT_L = {
  50: 0.975, 100: 0.945, 200: 0.89, 300: 0.81, 400: 0.72, 500: 0.63,
  600: 0.55, 700: 0.47, 800: 0.39, 900: 0.31, 950: 0.24,
};
const CHROMA_SHARE = {
  50: 0.12, 100: 0.22, 150: 0.3, 200: 0.4, 300: 0.62, 400: 0.85, 500: 1,
  600: 1, 700: 0.92, 800: 0.8, 900: 0.65, 950: 0.52, 975: 0.45,
};

let stops = Object.entries(DEFAULT_L);
if (args.stops) {
  stops = String(args.stops).split(',').map((s) => {
    const [k, v] = s.split(':');
    return [k.trim(), Number(v)];
  });
}
if (args.only) {
  const keep = new Set(String(args.only).split(',').map((s) => s.trim()));
  stops = stops.filter(([k]) => keep.has(k));
}

const white = { r: 1, g: 1, b: 1, a: 1 };
const black = { r: 0, g: 0, b: 0, a: 1 };

const group = { $type: 'color' };
const rows = [];
for (const [stop, L] of stops) {
  let C = peak * (CHROMA_SHARE[stop] ?? 1);
  // Réduction de chroma par dichotomie jusqu'à rentrer dans le gamut sRGB.
  if (!inGamut(oklchToLinear(L, C, hue))) {
    let lo = 0, hi = C;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinear(L, mid, hue))) lo = mid; else hi = mid;
    }
    C = lo;
  }
  const rgb = linearToSrgb(oklchToLinear(L, C, hue).map((x) => Math.min(1, Math.max(0, x))));
  const hex = toHex(rgb);
  group[stop] = { $value: hex };
  rows.push({ stop, hex, L: L.toFixed(3), C: C.toFixed(3), surBlanc: contrast(rgb, white).toFixed(2), surNoir: contrast(rgb, black).toFixed(2) });
}

const out = args.group === 'none' ? { [args.name]: group } : { [args.group ?? 'palette']: { [args.name]: group } };
console.log(JSON.stringify(out, null, 2));
if (!args.json) {
  console.error(`\n${args.name} — teinte ${hue}°, chroma max ${peak}`);
  console.error('palier  hex       L      C      contraste/blanc  contraste/noir');
  for (const r of rows) {
    console.error(`${r.stop.padEnd(7)} ${r.hex}  ${r.L}  ${r.C}  ${r.surBlanc.padStart(6)}           ${r.surNoir.padStart(6)}`);
  }
}
