import { useState } from 'react';

const DEFAULTS = {
  size: 18, // base body font size in px; headline/subhead/cta scale off this
  weight: 600, // headline font-weight; other elements derive from it
  spacing: 55, // 0-100 "spacing intensity" -> line-height + block gaps
  contrast: 88, // 0-100 "contrast intensity" -> text lightness vs. white stage bg
};

const HEADLINE_COLOR = '#0f172a';
const BODY_COLOR = '#334155';
const STAGE_TRANSITION = { transition: 'all 260ms ease' };

const ARTICLE = {
  headline: 'Design Systems Cut Rework, Not Creativity',
  subhead:
    'A shared component library let three product teams ship 40% faster without losing their design voice.',
  body: [
    'When our teams worked from separate Figma files, every button, spacing value, and shade of blue was a small negotiation. Multiply that by a dozen screens a sprint, and the cost was obvious: hours lost to decisions that had already been made once, somewhere else.',
    'A shared visual language did not slow anyone down. It removed the decisions that never needed to be made twice, and left more room for the ones that did.',
  ],
  cta: 'Read the case study',
};

const LEGAL_LIST = {
  title: 'Terms of Service',
  clauses: [
    '1. Acceptance of Terms — By creating an account, you agree to these terms and any future updates.',
    '2. Data Usage — We collect only what the product needs to function, and never sell it to third parties.',
    '3. Service Changes — Features may change or be discontinued at any time, with reasonable notice where possible.',
    '4. Termination — Either party may end this agreement at any time, for any reason, effective immediately.',
  ],
};

const NOTIFICATION_CARD = {
  title: 'Flash Sale — 40% Off Everything',
  detail: 'Applies automatically at checkout, no code needed.',
  badge: 'Ends in 2h',
};

const META_CONTENT = {
  title: 'Product Update',
  body: 'We rebuilt the export pipeline this week, so large reports now generate in seconds instead of minutes.',
  disclaimer: 'Performance may vary based on report size and account plan.',
  timestamp: 'Last edited 2 minutes ago',
};

const PULL_QUOTE = {
  quote:
    '"Good typography is invisible — until it is the only thing holding the page together."',
  attribution: '— Jane Doe, Editor-in-Chief',
};

const HERO_CONTENT = {
  eyebrow: 'Introducing',
  headline: 'The Design System Built for Speed',
  subhead: 'Ship consistent, accessible interfaces without starting from a blank canvas every sprint.',
  primaryCta: 'Get started',
  secondaryCta: 'See pricing',
};

const PRESETS = [
  {
    id: 'clear',
    label: 'Clear Hierarchy',
    scene: 'article',
    values: { size: 26, weight: 750, spacing: 70, contrast: 95 },
    focus:
      'The headline dominates on sight. Every lever pulls the same direction, so the eye moves headline → subhead → CTA in one obvious pass.',
    usedFor:
      'Blog posts and long-form articles — a single obvious reading path from headline to CTA.',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    scene: 'article',
    values: { size: 20, weight: 650, spacing: 75, contrast: 92 },
    focus:
      "A restrained, real-world combination — enough size and weight to lead the eye without shouting, generous spacing doing the quiet work. This is what 'good, not extreme' looks like in practice.",
    usedFor:
      'Documentation sites and default blog templates — the restrained middle ground most long-form reading UIs converge on.',
  },
  {
    id: 'flat',
    label: 'Flat Hierarchy',
    scene: 'list',
    values: { size: 15, weight: 350, spacing: 10, contrast: 40 },
    focus:
      'Every block reads at nearly the same size, weight, and spacing. There is no obvious entry point, so the eye has to search instead of being guided.',
    usedFor:
      'Legal text, spec sheets, T&Cs, FAQ lists — dense reference content where no single line is meant to dominate the scan.',
  },
  {
    id: 'cramped',
    label: 'Bold & Cramped',
    scene: 'card',
    values: { size: 20, weight: 800, spacing: 5, contrast: 90 },
    focus:
      'Weight alone still drags the eye to the headline, but near-zero spacing crowds every block together — the sections are hard to tell apart even though the entry point is clear.',
    usedFor:
      'Push notification titles, price tags, compact badges — a heavy, tightly-set label winning attention in a tiny footprint.',
  },
  {
    id: 'whisper',
    label: 'Low-Contrast Whisper',
    scene: 'meta',
    values: { size: 22, weight: 500, spacing: 60, contrast: 8 },
    focus:
      "Size still sends the eye to the headline first, but the body copy nearly disappears into the background — a contrast failure hiding behind otherwise decent hierarchy.",
    usedFor:
      'Illustrates a real contrast mistake: this fails WCAG AA and reads as closer to invisible than subtle. Real disclaimers and timestamps sit much higher on the scale.',
  },
  {
    id: 'size-only',
    label: 'Size Only',
    scene: 'quote',
    values: { size: 28, weight: 400, spacing: 60, contrast: 90 },
    focus:
      'Weight and contrast are left neutral — size alone has to carry the hierarchy. It still works, but the ranking feels less confident than when weight backs it up.',
    usedFor:
      'Magazine and editorial pull-quotes — large, light type as its own visual device, no bold needed.',
  },
  {
    id: 'maxed',
    label: 'Everything Maxed',
    scene: 'hero',
    values: { size: 30, weight: 800, spacing: 100, contrast: 100 },
    focus:
      "Every lever pushed to its ceiling. The headline is impossible to miss, but every block shouts at once — there's no restraint left to make the emphasis mean anything.",
    usedFor:
      'Marketing hero sections and campaign landing pages — maximum size, weight, space, and contrast for one loud moment; more a stress-test extreme than a subtle pattern.',
  },
];

const LEVERS = [
  {
    key: 'size',
    label: 'Font size',
    min: 13,
    max: 30,
    step: 1,
    unit: 'px base',
    blurb:
      "Size is the fastest way to tell a reader what matters first. The headline is set as a multiple of this base, so pushing the slider up doesn't just make text bigger — it widens the gap between headline and body, sharpening the order your eye follows.",
  },
  {
    key: 'weight',
    label: 'Font weight',
    min: 300,
    max: 800,
    step: 50,
    unit: 'headline weight',
    blurb:
      'Weight is emphasis without a change in size. At low weight the headline barely outranks the body text; at high weight it snaps into place as the obvious entry point — the same trick bold text pulls off in a paragraph.',
  },
  {
    key: 'spacing',
    label: 'Spacing',
    min: 0,
    max: 100,
    step: 1,
    unit: '% intensity',
    blurb:
      'Space groups related things and separates unrelated ones — line-height inside a paragraph, gaps between blocks. Cramped spacing forces the reader to work out the structure themselves; generous spacing hands it to them for free.',
  },
  {
    key: 'contrast',
    label: 'Contrast',
    min: 0,
    max: 100,
    step: 1,
    unit: '% intensity',
    blurb:
      "Contrast pulls the eye and keeps text legible — it's doing two jobs at once. Low contrast text is easy to skim past by accident and hard to read on a phone in sunlight; strong contrast serves both attention and accessibility with the same lever.",
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function deriveStyles(values) {
  const { size, weight, spacing, contrast } = values;

  const headlineSize = Math.round(size * 2.5);
  const subheadSize = Math.round(size * 1.3);
  const bodySize = size;
  const ctaSize = Math.round(size * 1.0);

  const headlineWeight = weight;
  const subheadWeight = clamp(weight - 150, 400, 700);
  const bodyWeight = 400;
  const ctaWeight = clamp(weight + 100, 500, 800);

  const lineHeight = 1.2 + (spacing / 100) * 0.7;
  const blockGap = 8 + (spacing / 100) * 48;
  const ctaPadding = 10 + (spacing / 100) * 14;

  const textLightness = 90 - (contrast / 100) * 90;
  const textColor = `hsl(250 8% ${textLightness}%)`;

  return {
    headlineSize,
    subheadSize,
    bodySize,
    ctaSize,
    headlineWeight,
    subheadWeight,
    bodyWeight,
    ctaWeight,
    lineHeight,
    blockGap,
    ctaPadding,
    textColor,
  };
}

function ArticleScene({ styles }) {
  return (
    <article style={STAGE_TRANSITION}>
      <h2
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.headlineSize}px`,
          fontWeight: styles.headlineWeight,
          lineHeight: 1.1,
          color: HEADLINE_COLOR,
          marginBottom: `${styles.blockGap * 0.5}px`,
        }}
      >
        {ARTICLE.headline}
      </h2>
      <p
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.subheadSize}px`,
          fontWeight: styles.subheadWeight,
          lineHeight: styles.lineHeight,
          color: styles.textColor,
          marginBottom: `${styles.blockGap}px`,
        }}
      >
        {ARTICLE.subhead}
      </p>
      {ARTICLE.body.map((para, i) => (
        <p
          key={i}
          style={{
            ...STAGE_TRANSITION,
            fontSize: `${styles.bodySize}px`,
            fontWeight: styles.bodyWeight,
            lineHeight: styles.lineHeight,
            color: styles.textColor,
            marginBottom: `${styles.blockGap}px`,
          }}
        >
          {para}
        </p>
      ))}
      <button
        type="button"
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.ctaSize}px`,
          fontWeight: styles.ctaWeight,
          padding: `${styles.ctaPadding}px ${styles.ctaPadding * 1.8}px`,
          marginTop: `${styles.blockGap * 0.5}px`,
        }}
        className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {ARTICLE.cta}
      </button>
    </article>
  );
}

function ListScene({ styles }) {
  return (
    <div style={STAGE_TRANSITION}>
      <h2
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.headlineSize}px`,
          fontWeight: styles.headlineWeight,
          lineHeight: 1.1,
          color: HEADLINE_COLOR,
          marginBottom: `${styles.blockGap * 0.5}px`,
        }}
      >
        {LEGAL_LIST.title}
      </h2>
      {LEGAL_LIST.clauses.map((clause, i) => (
        <p
          key={i}
          style={{
            ...STAGE_TRANSITION,
            fontSize: `${styles.bodySize}px`,
            fontWeight: styles.bodyWeight,
            lineHeight: styles.lineHeight,
            color: styles.textColor,
            marginBottom: `${styles.blockGap}px`,
          }}
        >
          {clause}
        </p>
      ))}
    </div>
  );
}

function CardScene({ styles }) {
  return (
    <div
      style={STAGE_TRANSITION}
      className="mx-auto max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <span className="inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
        {NOTIFICATION_CARD.badge}
      </span>
      <h2
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.headlineSize}px`,
          fontWeight: styles.headlineWeight,
          lineHeight: 1.15,
          color: HEADLINE_COLOR,
          marginTop: `${styles.blockGap * 0.4}px`,
          marginBottom: `${styles.blockGap * 0.4}px`,
        }}
      >
        {NOTIFICATION_CARD.title}
      </h2>
      <p
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.bodySize}px`,
          fontWeight: styles.bodyWeight,
          lineHeight: styles.lineHeight,
          color: styles.textColor,
        }}
      >
        {NOTIFICATION_CARD.detail}
      </p>
    </div>
  );
}

function MetaScene({ styles }) {
  const captionSize = Math.round(styles.bodySize * 0.8);
  return (
    <article style={STAGE_TRANSITION}>
      <h2
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.headlineSize}px`,
          fontWeight: styles.headlineWeight,
          lineHeight: 1.1,
          color: HEADLINE_COLOR,
          marginBottom: `${styles.blockGap * 0.5}px`,
        }}
      >
        {META_CONTENT.title}
      </h2>
      <p
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.bodySize}px`,
          fontWeight: styles.bodyWeight,
          lineHeight: styles.lineHeight,
          color: BODY_COLOR,
          marginBottom: `${styles.blockGap}px`,
        }}
      >
        {META_CONTENT.body}
      </p>
      <p
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${captionSize}px`,
          fontWeight: styles.bodyWeight,
          lineHeight: styles.lineHeight,
          color: styles.textColor,
          marginBottom: `${styles.blockGap * 0.3}px`,
        }}
      >
        {META_CONTENT.disclaimer}
      </p>
      <p
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${captionSize}px`,
          fontWeight: styles.bodyWeight,
          lineHeight: styles.lineHeight,
          color: styles.textColor,
        }}
      >
        {META_CONTENT.timestamp}
      </p>
    </article>
  );
}

function QuoteScene({ styles }) {
  return (
    <div style={STAGE_TRANSITION}>
      <p
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.headlineSize}px`,
          fontWeight: styles.headlineWeight,
          lineHeight: 1.2,
          color: HEADLINE_COLOR,
          marginBottom: `${styles.blockGap}px`,
        }}
      >
        {PULL_QUOTE.quote}
      </p>
      <p
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.subheadSize}px`,
          fontWeight: styles.subheadWeight,
          lineHeight: styles.lineHeight,
          color: styles.textColor,
        }}
      >
        {PULL_QUOTE.attribution}
      </p>
    </div>
  );
}

function HeroScene({ styles }) {
  return (
    <div style={STAGE_TRANSITION} className="text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        {HERO_CONTENT.eyebrow}
      </p>
      <h2
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.headlineSize}px`,
          fontWeight: styles.headlineWeight,
          lineHeight: 1.05,
          color: HEADLINE_COLOR,
          marginBottom: `${styles.blockGap * 0.5}px`,
        }}
      >
        {HERO_CONTENT.headline}
      </h2>
      <p
        style={{
          ...STAGE_TRANSITION,
          fontSize: `${styles.subheadSize}px`,
          fontWeight: styles.subheadWeight,
          lineHeight: styles.lineHeight,
          color: styles.textColor,
          marginBottom: `${styles.blockGap}px`,
        }}
      >
        {HERO_CONTENT.subhead}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          style={{
            ...STAGE_TRANSITION,
            fontSize: `${styles.ctaSize}px`,
            fontWeight: styles.ctaWeight,
            padding: `${styles.ctaPadding}px ${styles.ctaPadding * 1.8}px`,
          }}
          className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {HERO_CONTENT.primaryCta}
        </button>
        <button
          type="button"
          style={{
            ...STAGE_TRANSITION,
            fontSize: `${styles.ctaSize}px`,
            fontWeight: styles.ctaWeight,
          }}
          className="font-semibold text-indigo-600 hover:text-indigo-800"
        >
          {HERO_CONTENT.secondaryCta}
        </button>
      </div>
    </div>
  );
}

const SCENES = {
  article: ArticleScene,
  list: ListScene,
  card: CardScene,
  meta: MetaScene,
  quote: QuoteScene,
  hero: HeroScene,
};

export default function App() {
  const [values, setValues] = useState(DEFAULTS);
  const [activeScene, setActiveScene] = useState('article');

  const setLever = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: Number(e.target.value) }));
  };

  const reset = () => {
    setValues(DEFAULTS);
    setActiveScene('article');
  };

  const applyPreset = (preset) => {
    setValues(preset.values);
    setActiveScene(preset.scene);
  };

  const isActivePreset = (preset) =>
    preset.scene === activeScene &&
    Object.keys(preset.values).every((key) => preset.values[key] === values[key]);

  const styles = deriveStyles(values);
  const ActiveScene = SCENES[activeScene];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
            Visual Hierarchy
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Typographic Hierarchy Playground
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
            Visual hierarchy has many levers — layout, color, imagery. This one isolates the
            typographic ones: drag the sliders to change font size, weight, spacing, and contrast
            on the layout below, and watch where your eye lands first.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Preview stage */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <ActiveScene styles={styles} />
          </section>

          {/* Side panel */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Controls</h2>
                <button
                  type="button"
                  onClick={reset}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Reset to defaults
                </button>
              </div>

              <div className="mt-5 space-y-6">
                {LEVERS.map((lever) => (
                  <div key={lever.key}>
                    <div className="flex items-baseline justify-between">
                      <label htmlFor={lever.key} className="text-sm font-semibold text-slate-800">
                        {lever.label}
                      </label>
                      <span className="text-xs text-slate-500">
                        {values[lever.key]} {lever.unit}
                      </span>
                    </div>
                    <input
                      id={lever.key}
                      type="range"
                      min={lever.min}
                      max={lever.max}
                      step={lever.step}
                      value={values[lever.key]}
                      onChange={setLever(lever.key)}
                      className="mt-2 w-full accent-indigo-600"
                    />
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{lever.blurb}</p>
                  </div>
                ))}
              </div>
            </div>


          </aside>
                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Presets</h2>
              <p className="mt-1 text-sm text-slate-600">
                Seven combinations, each paired with the layout it's built for.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PRESETS.map((preset) => {
                  const active = isActivePreset(preset);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        active
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      <span className="text-sm font-semibold text-slate-900">{preset.label}</span>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">{preset.focus}</p>
                      <p className="mt-2 text-xs font-medium text-indigo-700">
                        Used for: {preset.usedFor}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
