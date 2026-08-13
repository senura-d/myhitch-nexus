import type { Config } from "tailwindcss";

/** Maps a token declared in src/app/tokens.css to a Tailwind colour. */
const token = (name: string) => `rgb(var(--nx-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: {
          DEFAULT: token("surface"),
          2: token("surface-2"),
          3: token("surface-3"),
        },
        overlay: token("overlay"),
        border: {
          DEFAULT: token("border"),
          strong: token("border-strong"),
        },
        fg: {
          DEFAULT: token("fg"),
          muted: token("fg-muted"),
          subtle: token("fg-subtle"),
          inverse: token("fg-inverse"),
        },
        accent: {
          DEFAULT: token("accent"),
          hover: token("accent-hover"),
          press: token("accent-press"),
          fg: token("accent-fg"),
          soft: token("accent-soft"),
        },
        live: {
          DEFAULT: token("live"),
          soft: token("live-soft"),
        },
        status: {
          draft: token("status-draft"),
          pending: token("status-pending"),
          published: token("status-published"),
          scheduled: token("status-scheduled"),
          restricted: token("status-restricted"),
          rejected: token("status-rejected"),
          archived: token("status-archived"),
          private: token("status-private"),
          unlisted: token("status-unlisted"),
        },
        success: token("success"),
        warning: token("warning"),
        danger: token("danger"),
        info: token("info"),
        chart: {
          1: token("chart-1"),
          2: token("chart-2"),
          3: token("chart-3"),
          4: token("chart-4"),
          5: token("chart-5"),
          6: token("chart-6"),
        },
      },
      borderColor: { DEFAULT: token("border") },
      borderRadius: {
        sm: "var(--nx-radius-sm)",
        DEFAULT: "var(--nx-radius)",
        md: "var(--nx-radius)",
        lg: "var(--nx-radius-lg)",
        full: "var(--nx-radius-full)",
      },
      boxShadow: {
        sm: "var(--nx-shadow-sm)",
        md: "var(--nx-shadow-md)",
        lg: "var(--nx-shadow-lg)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
      },
      screens: {
        xs: "480px",
        // Widescreen viewing is a first-class target, not an afterthought.
        "3xl": "1800px",
        tv: "2200px",
      },
      spacing: {
        header: "var(--nx-header-h)",
        rail: "var(--nx-rail-w)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "live-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.82)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateX(16px) scale(0.98)" },
          to: { opacity: "1", transform: "translateX(0) scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 160ms ease-out",
        "slide-up": "slide-up 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-down": "slide-down 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-in": "scale-in 140ms cubic-bezier(0.22, 1, 0.36, 1)",
        "live-pulse": "live-pulse 1.6s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
        "toast-in": "toast-in 200ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
