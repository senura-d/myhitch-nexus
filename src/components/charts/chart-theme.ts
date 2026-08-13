/**
 * Shared Recharts styling so every chart in Studio, Business and Admin reads as
 * one system and picks up the theme tokens rather than hard-coded colours.
 */

export const CHART_COLORS = [
  "rgb(var(--nx-chart-1))",
  "rgb(var(--nx-chart-2))",
  "rgb(var(--nx-chart-3))",
  "rgb(var(--nx-chart-4))",
  "rgb(var(--nx-chart-5))",
  "rgb(var(--nx-chart-6))",
];

export const chartAxis = {
  stroke: "rgb(var(--nx-fg-subtle))",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export const chartTooltip = {
  cursor: { fill: "rgb(var(--nx-fg) / 0.05)" },
  contentStyle: {
    background: "rgb(var(--nx-surface-2))",
    border: "1px solid rgb(var(--nx-border))",
    borderRadius: "var(--nx-radius)",
    fontSize: 12,
    color: "rgb(var(--nx-fg))",
    boxShadow: "var(--nx-shadow-md)",
  },
  labelStyle: { color: "rgb(var(--nx-fg-muted))", marginBottom: 4 },
  itemStyle: { color: "rgb(var(--nx-fg))" },
} as const;

export const chartGrid = {
  strokeDasharray: "3 3",
  stroke: "rgb(var(--nx-border))",
  vertical: false,
} as const;
