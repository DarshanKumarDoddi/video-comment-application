export const lightColors = {
  primary: "#3B82F6",
  secondary: "#6B7280",
  background: "#FFFFFF",
  surface: "#F3F4F6",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  accent: "#EF4444",
  success: "#10B981",
  border: "#E5E7EB",
  inputBg: "#FFFFFF",
};

export const darkColors = {
  primary: "#60A5FA",
  secondary: "#9CA3AF",
  background: "#0F172A",
  surface: "#1E293B",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  accent: "#F87171",
  success: "#34D399",
  border: "#334155",
  inputBg: "#1E293B",
};

export type ThemeColors = typeof lightColors;

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const },
  h2: { fontSize: 22, fontWeight: "600" as const },
  h3: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 14, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "400" as const },
  button: { fontSize: 14, fontWeight: "500" as const },
};

export const spacing = {
  screenPadding: 16,
  cardPadding: 16,
  sectionGap: 24,
  commentIndent: 24,
  maxCommentIndent: 120,
  borderRadiusCard: 8,
  borderRadiusButton: 6,
  minTouchTarget: 44,
};
