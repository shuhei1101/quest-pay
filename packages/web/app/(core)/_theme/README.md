# テーマ管理システム

このディレクトリには、アプリ全体のカラーテーマを管理するためのファイルが含まれています。

## ファイル構成

- `themeConfig.ts`: テーマの型定義（AppThemeConfig）
- `themes.ts`: 利用可能なテーマの定義（デフォルト、ブルー、グリーン、パープル）
- `themeContext.tsx`: テーマ状態を管理するReact Context
- `useTheme.ts`: テーマを利用するためのカスタムフック

## 機能

- **カラースキーム**: OSの設定に自動追従してライトモードとダークモードを切り替え
- **テーマ切り替え**: 複数のカラーテーマから選択可能
- **一元管理**: アプリ全体で統一されたカラー設定を提供

## 使い方

### コンポーネントでテーマを使用する

```tsx
import { useTheme } from "@/app/(core)/_theme/useTheme"

const MyComponent = () => {
  const { colors, isDark } = useTheme()

  return (
    <div style={{ backgroundColor: colors.backgroundColors.default }}>
      <Button color={colors.buttonColors.primary}>
        プライマリボタン
      </Button>
      {isDark && <p>ダークモードです</p>}
    </div>
  )
}
```

### テーマを切り替える

```tsx
import { useTheme } from "@/app/(core)/_theme/useTheme"

const ThemeSwitcher = () => {
  const { themeKey, setTheme } = useTheme()

  return (
    <div>
      <button onClick={() => setTheme("default")}>デフォルト</button>
      <button onClick={() => setTheme("blue")}>ブルー</button>
      <button onClick={() => setTheme("green")}>グリーン</button>
      <button onClick={() => setTheme("purple")}>パープル</button>
    </div>
  )
}
```

### カラースキームについて

カラースキーム（ライト/ダーク）はOSの設定に自動的に追従します。`useTheme()`から取得される`isDark`を使用して、現在のモードを確認できます。

```tsx
import { useTheme } from "@/app/(core)/_theme/useTheme"

const MyComponent = () => {
  const { isDark } = useTheme()

  return (
    <div>
      現在のモード: {isDark ? "ダーク" : "ライト"}
    </div>
  )
}
```

## 新しいテーマを追加する

`themes.ts`に新しいテーマを追加してください：

```ts
export const newTheme: AppThemeConfig = {
  name: "新しいテーマ",
  primaryColor: "indigo",
  light: {
    buttonColors: {
      default: "gray",
      primary: "indigo",
      secondary: "blue",
      danger: "red",
      success: "green",
    },
    textColors: {
      primary: "#1e1b4b",
      secondary: "#6366f1",
      disabled: "#e0e7ff",
    },
    backgroundColors: {
      default: "#ffffff",
      card: "#f5f5ff",
      hover: "#eef2ff",
    },
    borderColors: {
      default: "#e0e7ff",
      focus: "#6366f1",
    },
  },
  dark: {
    buttonColors: {
      default: "gray",
      primary: "indigo",
      secondary: "blue",
      danger: "red",
      success: "green",
    },
    textColors: {
      primary: "#eef2ff",
      secondary: "#c7d2fe",
      disabled: "#4338ca",
    },
    backgroundColors: {
      default: "#1a1a2e",
      card: "#2d2d44",
      hover: "#3d3d5a",
    },
    borderColors: {
      default: "#4f46e5",
      focus: "#6366f1",
    },
  },
  colors: {
    indigo: [
      "#eef2ff",
      "#e0e7ff",
      "#c7d2fe",
      "#a5b4fc",
      "#818cf8",
      "#6366f1",
      "#4f46e5",
      "#4338ca",
      "#3730a3",
      "#312e81",
    ],
  },
}

// themesオブジェクトに追加
export const themes = {
  default: defaultTheme,
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
  new: newTheme, // 追加
} as const
```

## テスト用ページ

テーマの動作確認には、以下のURLにアクセスしてください：

- `/test/theme` - テーマ切り替えデモページ（カラースキームはOSの設定に自動追従）
