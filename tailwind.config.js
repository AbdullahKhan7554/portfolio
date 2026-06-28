/**
 * Obsidian Atelier — Tailwind config.
 * Colors/typography/spacing reference CSS custom properties defined in
 * src/styles/tokens.css (Design TRD §7). Never hardcode a raw hex in a
 * component — always go through a token.
 * @type {import('tailwindcss').Config}
 */
const config = {
  content: ['./src/**/*.{js,jsx,mdx}'],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: { '2xl': '1360px' },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        bg: { DEFAULT: 'var(--bg)', alt: 'var(--bg-alt)' },
        surface: { DEFAULT: 'var(--surface)', raised: 'var(--surface-raised)' },
        text: {
          DEFAULT: 'var(--text)',
          strong: 'var(--text-strong)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          pressed: 'var(--accent-pressed)',
          on: 'var(--on-accent)',
        },
        border: { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        display: ['var(--fs-display)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        h1: ['var(--fs-h1)', { lineHeight: '0.96', letterSpacing: '-0.025em' }],
        h2: ['var(--fs-h2)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        h3: ['var(--fs-h3)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        h4: ['var(--fs-h4)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        lead: ['var(--fs-lead)', { lineHeight: '1.55' }],
        body: ['var(--fs-body)', { lineHeight: '1.65' }],
        'body-sm': ['var(--fs-body-sm)', { lineHeight: '1.6' }],
        label: ['var(--fs-label)', { lineHeight: '1.4' }],
        caption: ['var(--fs-caption)', { lineHeight: '1.45' }],
        eyebrow: ['var(--fs-eyebrow)', { lineHeight: '1.3', letterSpacing: '0.18em' }],
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--glow-accent)',
      },
      backdropBlur: { nav: '16px' },
      maxWidth: {
        container: 'var(--container)',
        bleed: 'var(--container-bleed)',
        measure: '66ch',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'out-quad': 'var(--ease-out-quad)',
        'in-out-soft': 'var(--ease-in-out-soft)',
        magnetic: 'var(--ease-magnetic)',
      },
      transitionDuration: {
        fast: '200ms',
        base: '300ms',
        slow: '500ms',
        slower: '800ms',
      },
      zIndex: {
        sticky: '100',
        header: '200',
        cursor: '300',
        overlay: '400',
        modal: '500',
        toast: '600',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
