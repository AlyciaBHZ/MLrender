/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto',
          'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif',
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'
        ]
      },
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        // Semantic colors are driven by CSS variables for theming (HSL).
        // Use with opacity: e.g., text-semantic-primary/50 -> hsl(var(--mlcd-primary)/0.5)
        semantic: {
          primary: 'hsl(var(--mlcd-primary) / <alpha-value>)',
          success: 'hsl(var(--mlcd-success) / <alpha-value>)',
          warning: 'hsl(var(--mlcd-warning) / <alpha-value>)',
          danger: 'hsl(var(--mlcd-danger) / <alpha-value>)',
          info: 'hsl(var(--mlcd-info) / <alpha-value>)',
          neutral: 'hsl(var(--mlcd-neutral) / <alpha-value>)'
        },
        mlcd: {
          canvas: 'hsl(var(--mlcd-canvas) / <alpha-value>)',
          grid: 'hsl(var(--mlcd-grid-dot) / <alpha-value>)',
          stroke: 'hsl(var(--mlcd-stroke) / <alpha-value>)',
          label: 'hsl(var(--mlcd-label) / <alpha-value>)',
          muted: 'hsl(var(--mlcd-muted-label) / <alpha-value>)',
          linear: 'hsl(var(--mlcd-linear) / <alpha-value>)',
          'linear-alt': 'hsl(var(--mlcd-linear-alt) / <alpha-value>)',
          'activation-g': 'hsl(var(--mlcd-activation-g) / <alpha-value>)',
          'activation-o': 'hsl(var(--mlcd-activation-o) / <alpha-value>)',
          data: 'hsl(var(--mlcd-data) / <alpha-value>)',
          'data-alt': 'hsl(var(--mlcd-data-alt) / <alpha-value>)',
          'data-neutral': 'hsl(var(--mlcd-data-neutral) / <alpha-value>)',
          aux: 'hsl(var(--mlcd-aux) / <alpha-value>)',
          loss: 'hsl(var(--mlcd-loss) / <alpha-value>)',
          optimizer: 'hsl(var(--mlcd-optimizer) / <alpha-value>)',
          attn: 'hsl(var(--mlcd-attn) / <alpha-value>)',
          'tensor-alt': 'hsl(var(--mlcd-tensor-alt) / <alpha-value>)',
          selected: 'hsl(var(--mlcd-selected) / <alpha-value>)'
        }
      },
      strokeWidth: {
        '1.25': '1.25px',
        '1.5': '1.5px'
      },
      borderRadius: {
        pill: '9999px'
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem'
      }
    }
  },
  plugins: []
};
