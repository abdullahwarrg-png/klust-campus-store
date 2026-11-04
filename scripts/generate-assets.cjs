/* Rebuild the bundled product renders: npm run assets. No image service needed.
 * Renders are 1200 × 1200 transparent PNGs with a soft contact shadow, so the app
 * can place them on its own studio backdrop. Set ASSET_OUT to preview elsewhere. */
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = process.env.ASSET_OUT ? path.resolve(process.env.ASSET_OUT) : root;

const palette = {
  cloud: {
    base: '#ebe9e1',
    light: '#faf9f4',
    dark: '#cfccc1',
    deep: '#a9a598',
    ink: '#183b60',
    accent: '#3f74ba',
  },
  navy: {
    base: '#22385c',
    light: '#35517d',
    dark: '#172741',
    deep: '#0c1628',
    ink: '#f3ecd4',
    accent: '#7fa6dd',
  },
  blue: {
    base: '#3f74ba',
    light: '#5f92d6',
    dark: '#2d5c9c',
    deep: '#1c3f72',
    ink: '#f7f5ea',
    accent: '#102952',
  },
};
/** Glazed white ceramic needs softer shading than cotton or it reads as metal. */
const mugCloud = {
  ...palette.cloud,
  base: '#f3f1ea',
  light: '#ffffff',
  dark: '#e6e3da',
  deep: '#d0ccc0',
};

const serif = 'Georgia, Times New Roman, serif';
const sans = 'Helvetica Neue, Helvetica, Arial, sans-serif';

/** Shared filters: fabric/glaze grain, soft blur, and the lifted product shadow. */
function defs(extra = '') {
  return `<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 -0.32"/></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="softer" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="floor" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="26"/></filter>
<filter id="lift" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#0f2240" flood-opacity=".20"/></filter>
${extra}`;
}

function crestMark(image, cx, cy, size, ringColour) {
  const r = size / 2;
  const ring = ringColour
    ? `<circle cx="${cx}" cy="${cy}" r="${r + 5}" fill="none" stroke="${ringColour}" stroke-width="3.5" opacity=".9"/>`
    : '';
  return `${ring}<image href="${image}" x="${cx - r}" y="${cy - r}" width="${size}" height="${size}"/>`;
}

function text(x, y, value, { size, ink, family = serif, weight = 700, spacing = 0, extra = '' }) {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" fill="${ink}" ${extra}>${value}</text>`;
}

/* ---------- T-shirts ---------- */

const teeShape =
  'M512 228 C468 244 415 254 372 268 C312 296 240 370 195 452 L302 548 C330 520 358 492 382 470 C386 630 378 800 372 962 Q600 986 828 962 C822 800 814 630 818 470 C842 492 870 520 898 548 L1005 452 C960 370 888 296 828 268 C785 254 732 244 688 228 C662 300 538 300 512 228 Z';

function teePrint(design, image, p, dark) {
  const ring = dark ? p.ink : null;
  const cx = 600;
  switch (design) {
    case 'heritage':
      return (
        crestMark(image, cx, 490, 170, ring) +
        text(cx, 650, 'KLUST', { size: 62, ink: p.ink, spacing: 12 }) +
        text(cx, 688, 'KUALA LUMPUR', { size: 15, ink: p.ink, family: sans, spacing: 7 })
      );
    case 'varsity':
      return (
        text(cx, 526, 'KLUST', {
          size: 108,
          ink: p.ink,
          weight: 900,
          spacing: 4,
          extra: `stroke="${p.accent}" stroke-width="5" paint-order="stroke"`,
        }) +
        `<path d="M460 562 H740" stroke="${p.ink}" stroke-width="3"/>` +
        crestMark(image, cx, 634, 96, ring) +
        text(cx, 718, 'EST. UNIVERSITY', { size: 15, ink: p.ink, family: sans, spacing: 6 })
      );
    case 'studio':
      return (
        crestMark(image, 724, 404, 78, ring) +
        text(724, 466, 'KLUST', { size: 15, ink: p.ink, family: sans, spacing: 5 })
      );
    case 'weekender':
      return (
        crestMark(image, cx, 530, 270, ring) +
        text(cx, 730, 'KLUST · WEEKEND', { size: 18, ink: p.ink, family: sans, spacing: 8 })
      );
    case 'athletics':
      return (
        crestMark(image, cx, 446, 88, ring) +
        text(cx, 596, 'KLUST', { size: 104, ink: p.ink, family: sans, weight: 900, spacing: 2 }) +
        text(cx, 644, 'ATHLETICS', { size: 22, ink: p.ink, family: sans, spacing: 12 }) +
        `<path d="M430 676 H770 M430 692 H770" stroke="${p.ink}" stroke-width="6"/>`
      );
    case 'essential':
      return (
        crestMark(image, cx, 476, 96, ring) +
        text(cx, 566, 'KLUST', { size: 24, ink: p.ink, family: sans, spacing: 9 })
      );
    case 'alumni':
      return (
        text(cx, 524, 'ALUMNI', { size: 72, ink: p.ink, spacing: 6 }) +
        `<path d="M445 560 H755" stroke="${p.ink}" stroke-width="2.5"/>` +
        crestMark(image, cx, 634, 108, ring) +
        text(cx, 728, 'KLUST', { size: 20, ink: p.ink, family: sans, spacing: 10 })
      );
    case 'scholars':
      return (
        crestMark(image, cx, 500, 160, ring) +
        text(cx, 650, 'KLUST', { size: 50, ink: p.ink, spacing: 10 }) +
        text(cx, 684, 'FOR KNOWLEDGE · FOR HUMANITY', {
          size: 13,
          ink: p.ink,
          family: sans,
          spacing: 3.5,
        })
      );
    default:
      throw new Error(`Unknown tee design ${design}`);
  }
}

function tee(design, colour, image) {
  const p = palette[colour];
  const dark = colour !== 'cloud';
  const neck = 'M512 228 C538 300 662 300 688 228';
  const backNeck = 'M512 228 C546 216 654 216 688 228 C662 300 538 300 512 228 Z';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
<defs>${defs(`
<clipPath id="tee"><path d="${teeShape}"/></clipPath>
<linearGradient id="across" gradientUnits="userSpaceOnUse" x1="195" y1="0" x2="1005" y2="0">
  <stop offset="0" stop-color="${p.deep}" stop-opacity=".55"/>
  <stop offset=".24" stop-color="${p.dark}" stop-opacity=".35"/>
  <stop offset=".42" stop-color="${p.light}" stop-opacity=".45"/>
  <stop offset=".6" stop-color="${p.light}" stop-opacity=".12"/>
  <stop offset=".8" stop-color="${p.dark}" stop-opacity=".35"/>
  <stop offset="1" stop-color="${p.deep}" stop-opacity=".6"/>
</linearGradient>
<linearGradient id="down" gradientUnits="userSpaceOnUse" x1="0" y1="228" x2="0" y2="986">
  <stop offset="0" stop-color="${p.light}" stop-opacity=".35"/>
  <stop offset=".35" stop-color="${p.light}" stop-opacity="0"/>
  <stop offset="1" stop-color="${p.deep}" stop-opacity=".28"/>
</linearGradient>`)}</defs>
<ellipse cx="600" cy="1004" rx="370" ry="30" fill="#0f2240" opacity=".16" filter="url(#floor)"/>
<g filter="url(#lift)">
  <path d="${teeShape}" fill="${p.base}"/>
  <path d="${backNeck}" fill="${p.deep}"/>
  <path d="M530 232 C560 224 640 224 670 232 C650 280 550 280 530 232 Z" fill="${p.dark}" opacity=".7"/>
</g>
<g clip-path="url(#tee)">
  <rect width="1200" height="1200" fill="url(#across)"/>
  <rect width="1200" height="1200" fill="url(#down)"/>
  <g opacity="${dark ? 0.95 : 1}">${teePrint(design, image, p, dark)}</g>
  <g fill="none" stroke-linecap="round">
    <path d="M410 510 Q510 640 540 800" stroke="${p.deep}" stroke-width="46" opacity=".16" filter="url(#soft)"/>
    <path d="M792 520 Q705 660 700 840" stroke="${p.deep}" stroke-width="40" opacity=".14" filter="url(#soft)"/>
    <path d="M440 955 Q480 870 452 790" stroke="${p.deep}" stroke-width="30" opacity=".16" filter="url(#soft)"/>
    <path d="M760 960 Q735 880 752 810" stroke="${p.deep}" stroke-width="26" opacity=".12" filter="url(#soft)"/>
    <path d="M628 540 Q652 740 616 930" stroke="${p.light}" stroke-width="58" opacity="${dark ? 0.18 : 0.5}" filter="url(#soft)"/>
    <path d="M290 350 Q322 420 340 505" stroke="${p.light}" stroke-width="34" opacity="${dark ? 0.16 : 0.45}" filter="url(#soft)"/>
    <path d="M910 350 Q878 420 860 505" stroke="${p.deep}" stroke-width="34" opacity=".14" filter="url(#soft)"/>
    <path d="M372 268 Q414 375 382 470" stroke="${p.deep}" stroke-width="18" opacity=".18" filter="url(#softer)"/>
    <path d="M828 268 Q786 375 818 470" stroke="${p.deep}" stroke-width="18" opacity=".18" filter="url(#softer)"/>
    <path d="M372 268 Q414 375 382 470 M828 268 Q786 375 818 470" stroke="${p.deep}" stroke-width="2.2" opacity=".45"/>
    <path d="M208 437 L315 533 M992 437 L885 533" stroke="${p.deep}" stroke-width="2" stroke-dasharray="7 6" opacity=".5"/>
    <path d="M378 940 Q600 962 822 940" stroke="${p.deep}" stroke-width="2" stroke-dasharray="7 6" opacity=".5"/>
    <path d="M197 452 L302 548 M1003 452 L898 548" stroke="${p.deep}" stroke-width="5" opacity=".25"/>
  </g>
  <rect width="1200" height="1200" filter="url(#grain)" opacity="${dark ? 0.22 : 0.16}"/>
</g>
<path d="${neck}" fill="none" stroke="${p.dark}" stroke-width="24" stroke-linecap="round"/>
<path d="${neck}" fill="none" stroke="${p.light}" stroke-width="2" opacity=".55" transform="translate(0 -9)"/>
<path d="M506 244 C536 320 664 320 694 244" fill="none" stroke="${p.deep}" stroke-width="2" stroke-dasharray="6 5" opacity=".55"/>
<path d="M512 228 C546 216 654 216 688 228" fill="none" stroke="${p.dark}" stroke-width="12" stroke-linecap="round"/>
<rect x="585" y="232" width="30" height="20" rx="2" fill="#f4efdf" opacity=".95"/>
<text x="600" y="246" text-anchor="middle" font-family="${sans}" font-size="8" font-weight="700" letter-spacing="1" fill="#183b60">KLUST</text>
</svg>`;
}

/* ---------- Mugs ---------- */

function mugPrint(design, image, p) {
  const cx = 562;
  switch (design) {
    case 'campus':
      return (
        crestMark(image, cx, 545, 172) +
        text(cx, 700, 'KLUST', { size: 50, ink: p.ink, spacing: 11 })
      );
    case 'crest':
      return crestMark(image, cx, 585, 270);
    case 'daily':
      return (
        crestMark(image, cx, 500, 118) +
        text(cx, 640, 'KLUST', { size: 56, ink: p.ink, spacing: 12 }) +
        text(cx, 684, 'YOUR DAILY DOSE OF CAMPUS', {
          size: 15,
          ink: p.ink,
          family: sans,
          spacing: 4,
        })
      );
    case 'duo':
      return (
        crestMark(image, cx, 555, 160) +
        text(cx, 700, 'KLUST', { size: 44, ink: p.ink, family: sans, spacing: 14 })
      );
    default:
      throw new Error(`Unknown mug design ${design}`);
  }
}

function mug(design, colour, image) {
  const p = colour === 'cloud' ? mugCloud : palette[colour];
  const contrast = design === 'duo' ? palette[colour === 'cloud' ? 'blue' : 'navy'] : null;
  const handle = contrast ?? p;
  const interior = contrast ? contrast.base : '#f2f1ea';
  const interiorDeep = contrast ? contrast.deep : '#c9c7bd';
  const body = 'M352 330 L352 812 C352 884 772 884 772 812 L772 330 Z';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
<defs>${defs(`
<clipPath id="body"><path d="${body}"/></clipPath>
<linearGradient id="cyl" gradientUnits="userSpaceOnUse" x1="352" y1="0" x2="772" y2="0">
  <stop offset="0" stop-color="${p.deep}"/>
  <stop offset=".1" stop-color="${p.dark}"/>
  <stop offset=".3" stop-color="${p.light}"/>
  <stop offset=".52" stop-color="${p.base}"/>
  <stop offset=".84" stop-color="${p.dark}"/>
  <stop offset="1" stop-color="${p.deep}"/>
</linearGradient>
<linearGradient id="wrap" gradientUnits="userSpaceOnUse" x1="352" y1="0" x2="772" y2="0">
  <stop offset="0" stop-color="#0c1628" stop-opacity="${colour === 'cloud' ? 0.14 : 0.35}"/>
  <stop offset=".22" stop-color="#0c1628" stop-opacity="0"/>
  <stop offset=".7" stop-color="#0c1628" stop-opacity="0"/>
  <stop offset="1" stop-color="#0c1628" stop-opacity="${colour === 'cloud' ? 0.16 : 0.4}"/>
</linearGradient>
<linearGradient id="handle" gradientUnits="userSpaceOnUse" x1="760" y1="0" x2="940" y2="0">
  <stop offset="0" stop-color="${handle.deep}"/>
  <stop offset=".45" stop-color="${handle.base}"/>
  <stop offset=".75" stop-color="${handle.light}"/>
  <stop offset="1" stop-color="${handle.dark}"/>
</linearGradient>
<linearGradient id="inside" gradientUnits="userSpaceOnUse" x1="0" y1="282" x2="0" y2="376">
  <stop offset="0" stop-color="${interiorDeep}"/>
  <stop offset=".7" stop-color="${interior}"/>
</linearGradient>`)}</defs>
<ellipse cx="600" cy="872" rx="300" ry="34" fill="#0f2240" opacity=".24" filter="url(#floor)"/>
<g filter="url(#lift)">
  <path d="M762 432 C918 404 942 708 762 712" fill="none" stroke="url(#handle)" stroke-width="62" stroke-linecap="round"/>
  <path d="M770 452 C892 436 906 680 770 690" fill="none" stroke="${handle.light}" stroke-width="5" opacity=".45"/>
  <path d="${body}" fill="url(#cyl)"/>
</g>
<g clip-path="url(#body)">
  <g opacity=".96">${mugPrint(design, image, p)}</g>
  <rect width="1200" height="1200" fill="url(#wrap)"/>
  <rect x="428" y="380" width="30" height="430" rx="15" fill="#ffffff" opacity=".38" filter="url(#softer)"/>
  <rect x="470" y="400" width="8" height="380" rx="4" fill="#ffffff" opacity=".22" filter="url(#softer)"/>
  <path d="M352 812 C352 884 772 884 772 812" fill="none" stroke="${p.deep}" stroke-width="26" opacity=".35" filter="url(#softer)"/>
  <path d="M352 352 C352 410 772 410 772 352" fill="none" stroke="${p.deep}" stroke-width="16" opacity=".22" filter="url(#softer)"/>
  <rect width="1200" height="1200" filter="url(#grain)" opacity=".06"/>
</g>
<ellipse cx="562" cy="330" rx="210" ry="54" fill="${p.light}"/>
<ellipse cx="562" cy="330" rx="210" ry="54" fill="none" stroke="${p.dark}" stroke-width="2" opacity=".6"/>
<ellipse cx="562" cy="332" rx="192" ry="44" fill="url(#inside)"/>
<path d="M378 340 C420 372 704 372 746 340" fill="none" stroke="#ffffff" stroke-width="3" opacity=".5"/>
</svg>`;
}

async function main() {
  const crest = await sharp(path.join(root, 'assets/branding/klust-logo.png'))
    .extract({ left: 0, top: 0, width: 163, height: 161 })
    .png()
    .toBuffer();
  await fs.mkdir(path.join(out, 'assets/branding'), { recursive: true });
  await fs.mkdir(path.join(out, 'assets/products'), { recursive: true });
  await fs.writeFile(path.join(out, 'assets/branding/klust-crest.png'), crest);
  const image = `data:image/png;base64,${crest.toString('base64')}`;
  const render = (svg, size = 1200) =>
    sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 });

  const tees = {
    heritage: ['cloud', 'navy', 'blue'],
    varsity: ['navy', 'cloud'],
    studio: ['blue', 'cloud'],
    weekender: ['cloud', 'blue'],
    athletics: ['blue', 'navy'],
    essential: ['navy', 'cloud'],
    alumni: ['cloud', 'navy'],
    scholars: ['blue', 'cloud'],
  };
  const mugs = {
    campus: ['cloud', 'blue'],
    crest: ['navy', 'cloud'],
    daily: ['blue', 'cloud'],
    duo: ['cloud', 'blue'],
  };
  for (const [design, colours] of Object.entries(tees))
    for (const colour of colours)
      await render(tee(design, colour, image)).toFile(
        path.join(out, `assets/products/${design}-tee-${colour}.png`),
      );
  for (const [design, colours] of Object.entries(mugs))
    for (const colour of colours)
      await render(mug(design, colour, image)).toFile(
        path.join(out, `assets/products/${design}-mug-${colour}.png`),
      );
  const hero = await sharp({
    create: { width: 800, height: 800, channels: 4, background: '#00000000' },
  })
    .composite([
      {
        input: await render(tee('heritage', 'cloud', image), 560)
          .rotate(10, { background: '#00000000' })
          .toBuffer(),
        left: 0,
        top: 0,
      },
      { input: await render(mug('campus', 'blue', image), 420).toBuffer(), left: 380, top: 340 },
    ])
    .png()
    .toBuffer();
  await fs.writeFile(path.join(out, 'assets/products/hero.png'), hero);
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" rx="220" fill="#175CDB"/><image href="${image}" x="232" y="156" width="560" height="553"/><text x="512" y="814" text-anchor="middle" font-family="Arial" font-size="95" font-weight="bold" letter-spacing="14" fill="white">CAMPUS</text></svg>`;
  await sharp(Buffer.from(icon)).png().toFile(path.join(out, 'assets/icon.png'));
  await sharp(Buffer.from(icon)).resize(64).png().toFile(path.join(out, 'assets/favicon.png'));
  console.log('Generated 25 product variants, hero, crest, and app icons.');
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
