import { AppThemeConfig } from "./themeConfig"

/** デフォルトテーマ（ブルー基調） */
export const defaultTheme: AppThemeConfig = {
  name: "デフォルト",
  primaryColor: "blue",
  light: {
    buttonColors: {
      default: "gray",
      primary: "blue",
      secondary: "cyan",
      danger: "red",
      success: "green",
    },
    textColors: {
      primary: "#1e293b",
      secondary: "#64748b",
      disabled: "#cbd5e1",
    },
    backgroundColors: {
      default: "#ffffff",
      card: "#f5f5f5",
      hover: "#e8e8e8",
    },
    borderColors: {
      default: "#d1d5db",
      focus: "#3b82f6",
    },
    cardStyles: {
      background: "#ffffff",
      border: "#d1d5db",
      hoverShadow: "0 4px 6px rgba(59, 130, 246, 0.1)",
    },
    badgeColors: {
      info: "blue",
      warning: "yellow",
      error: "red",
      success: "green",
    },
    inputColors: {
      background: "#ffffff",
      border: "#d1d5db",
      focusBorder: "#3b82f6",
    },
    fab: {
      variant: "light",
      opacity: {
        active: 1,
        inactive: 0.6,
      },
      border: {
        activeWidth: "2px",
        inactiveWidth: "0px",
      },
    },
  },
  dark: {
    buttonColors: {
      default: "gray",
      primary: "blue",
      secondary: "cyan",
      danger: "red",
      success: "green",
    },
    textColors: {
      primary: "#f1f5f9",
      secondary: "#cbd5e1",
      disabled: "#64748b",
    },
    backgroundColors: {
      default: "#1a1a1a",
      card: "#2d2d2d",
      hover: "#3d3d3d",
    },
    borderColors: {
      default: "#4b5563",
      focus: "#3b82f6",
    },
    cardStyles: {
      background: "#2d2d2d",
      border: "#4b5563",
      hoverShadow: "0 4px 6px rgba(59, 130, 246, 0.2)",
    },
    badgeColors: {
      info: "blue",
      warning: "yellow",
      error: "red",
      success: "green",
    },
    inputColors: {
      background: "#1a1a1a",
      border: "#4b5563",
      focusBorder: "#3b82f6",
    },
    fab: {
      variant: "light",
      opacity: {
        active: 1,
        inactive: 0.6,
      },
      border: {
        activeWidth: "2px",
        inactiveWidth: "0px",
      },
    },
  },
  colors: {
    blue: [
      "#e0f2fe",
      "#bae6fd",
      "#7dd3fc",
      "#38bdf8",
      "#0ea5e9",
      "#0284c7",
      "#0369a1",
      "#075985",
      "#0c4a6e",
      "#082f49",
    ],
  },
}

/** ブルーテーマ（ピンク基調） */
export const blueTheme: AppThemeConfig = {
  name: "ブルー",
  primaryColor: "pink",
  light: {
    buttonColors: {
      default: "gray",
      primary: "pink",
      secondary: "blue",
      danger: "red",
      success: "green",
    },
    textColors: {
      primary: "#000000",
      secondary: "#666666",
      disabled: "#999999",
    },
    backgroundColors: {
      default: "#ffffff",
      card: "#f9fafb",
      hover: "#f3f4f6",
    },
    borderColors: {
      default: "#e5e7eb",
      focus: "#ec4899",
    },
    cardStyles: {
      background: "#ffffff",
      border: "#e5e7eb",
      hoverShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    badgeColors: {
      info: "blue",
      warning: "yellow",
      error: "red",
      success: "green",
    },
    inputColors: {
      background: "#ffffff",
      border: "#e5e7eb",
      focusBorder: "#ec4899",
    },
    fab: {
      variant: "light",
      opacity: {
        active: 1,
        inactive: 0.6,
      },
      border: {
        activeWidth: "2px",
        inactiveWidth: "0px",
      },
    },
  },
  dark: {
    buttonColors: {
      default: "gray",
      primary: "pink",
      secondary: "blue",
      danger: "red",
      success: "green",
    },
    textColors: {
      primary: "#f9fafb",
      secondary: "#d1d5db",
      disabled: "#6b7280",
    },
    backgroundColors: {
      default: "#1a1a1a",
      card: "#2d2d2d",
      hover: "#3d3d3d",
    },
    borderColors: {
      default: "#4b5563",
      focus: "#ec4899",
    },
    cardStyles: {
      background: "#2d2d2d",
      border: "#4b5563",
      hoverShadow: "0 4px 6px rgba(0, 0, 0, 0.4)",
    },
    badgeColors: {
      info: "blue",
      warning: "yellow",
      error: "red",
      success: "green",
    },
    inputColors: {
      background: "#1a1a1a",
      border: "#4b5563",
      focusBorder: "#ec4899",
    },
    fab: {
      variant: "light",
      opacity: {
        active: 1,
        inactive: 0.6,
      },
      border: {
        activeWidth: "2px",
        inactiveWidth: "0px",
      },
    },
  },
  colors: {
    pink: [
      "#fff0f6",
      "#ffe0ed",
      "#fcc2d7",
      "#faa2c1",
      "#f783ac",
      "#f06595",
      "#e64980",
      "#d6336c",
      "#c2255c",
      "#a61e4d",
    ],
  },
}

/** グリーンテーマ */
export const greenTheme: AppThemeConfig = {
  name: "グリーン",
  primaryColor: "green",
  light: {
    buttonColors: {
      default: "gray",
      primary: "green",
      secondary: "teal",
      danger: "red",
      success: "green",
    },
    textColors: {
      primary: "#14532d",
      secondary: "#16a34a",
      disabled: "#bbf7d0",
    },
    backgroundColors: {
      default: "#ffffff",
      card: "#f0fdf4",
      hover: "#dcfce7",
    },
    borderColors: {
      default: "#bbf7d0",
      focus: "#22c55e",
    },
    cardStyles: {
      background: "#ffffff",
      border: "#bbf7d0",
      hoverShadow: "0 4px 6px rgba(34, 197, 94, 0.1)",
    },
    badgeColors: {
      info: "blue",
      warning: "yellow",
      error: "red",
      success: "green",
    },
    inputColors: {
      background: "#ffffff",
      border: "#bbf7d0",
      focusBorder: "#22c55e",
    },
    fab: {
      variant: "light",
      opacity: {
        active: 1,
        inactive: 0.6,
      },
      border: {
        activeWidth: "2px",
        inactiveWidth: "0px",
      },
    },
  },
  dark: {
    buttonColors: {
      default: "gray",
      primary: "green",
      secondary: "teal",
      danger: "red",
      success: "green",
    },
    textColors: {
      primary: "#dcfce7",
      secondary: "#86efac",
      disabled: "#166534",
    },
    backgroundColors: {
      default: "#0a1f14",
      card: "#14532d",
      hover: "#166534",
    },
    borderColors: {
      default: "#15803d",
      focus: "#22c55e",
    },
    cardStyles: {
      background: "#14532d",
      border: "#15803d",
      hoverShadow: "0 4px 6px rgba(34, 197, 94, 0.2)",
    },
    badgeColors: {
      info: "blue",
      warning: "yellow",
      error: "red",
      success: "green",
    },
    inputColors: {
      background: "#0a1f14",
      border: "#15803d",
      focusBorder: "#22c55e",
    },
    fab: {
      variant: "light",
      opacity: {
        active: 1,
        inactive: 0.6,
      },
      border: {
        activeWidth: "2px",
        inactiveWidth: "0px",
      },
    },
  },
  colors: {
    green: [
      "#f0fdf4",
      "#dcfce7",
      "#bbf7d0",
      "#86efac",
      "#4ade80",
      "#22c55e",
      "#16a34a",
      "#15803d",
      "#166534",
      "#14532d",
    ],
  },
}

/** パープルテーマ */
export const purpleTheme: AppThemeConfig = {
  name: "パープル",
  primaryColor: "violet",
  light: {
    buttonColors: {
      default: "gray",
      primary: "violet",
      secondary: "grape",
      danger: "red",
      success: "green",
    },
    textColors: {
      primary: "#581c87",
      secondary: "#a855f7",
      disabled: "#e9d5ff",
    },
    backgroundColors: {
      default: "#ffffff",
      card: "#faf5ff",
      hover: "#f3e8ff",
    },
    borderColors: {
      default: "#e9d5ff",
      focus: "#a855f7",
    },
    cardStyles: {
      background: "#ffffff",
      border: "#e9d5ff",
      hoverShadow: "0 4px 6px rgba(168, 85, 247, 0.1)",
    },
    badgeColors: {
      info: "blue",
      warning: "yellow",
      error: "red",
      success: "green",
    },
    inputColors: {
      background: "#ffffff",
      border: "#e9d5ff",
      focusBorder: "#a855f7",
    },
    fab: {
      variant: "light",
      opacity: {
        active: 1,
        inactive: 0.6,
      },
      border: {
        activeWidth: "2px",
        inactiveWidth: "0px",
      },
    },
  },
  dark: {
    buttonColors: {
      default: "gray",
      primary: "violet",
      secondary: "grape",
      danger: "red",
      success: "green",
    },
    textColors: {
      primary: "#f3e8ff",
      secondary: "#d8b4fe",
      disabled: "#6b21a8",
    },
    backgroundColors: {
      default: "#1a0a2e",
      card: "#2e1a47",
      hover: "#4a2b6f",
    },
    borderColors: {
      default: "#7e22ce",
      focus: "#a855f7",
    },
    cardStyles: {
      background: "#2e1a47",
      border: "#7e22ce",
      hoverShadow: "0 4px 6px rgba(168, 85, 247, 0.2)",
    },
    badgeColors: {
      info: "blue",
      warning: "yellow",
      error: "red",
      success: "green",
    },
    inputColors: {
      background: "#1a0a2e",
      border: "#7e22ce",
      focusBorder: "#a855f7",
    },
    fab: {
      variant: "light",
      opacity: {
        active: 1,
        inactive: 0.6,
      },
      border: {
        activeWidth: "2px",
        inactiveWidth: "0px",
      },
    },
  },
  colors: {
    violet: [
      "#faf5ff",
      "#f3e8ff",
      "#e9d5ff",
      "#d8b4fe",
      "#c084fc",
      "#a855f7",
      "#9333ea",
      "#7e22ce",
      "#6b21a8",
      "#581c87",
    ],
  },
}

/** 利用可能なテーマのリスト */
export const themes = {
  default: defaultTheme,
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
} as const

/** テーマのキー型 */
export type ThemeKey = keyof typeof themes
