# テーマ管理システム

このディレクトリには、アプリ全体のカラーテーマを管理するためのファイルが含まれています。

## ファイル構成

- `themeConfig.ts`: テーマの型定義
- `themes.ts`: 利用可能なテーマの定義（デフォルト、ブルー、グリーン、パープル）
- `themeContext.tsx`: テーマ状態を管理するReact Context
- `useTheme.ts`: テーマを利用するためのカスタムフック

## 使い方

### コンポーネントでテーマを使用する

```tsx
import { useTheme } from "@/app/(core)/_theme/useTheme"

const MyComponent = () => {
  const { theme, getButtonColor, getTextColor } = useTheme()

  return (
    <Button color={getButtonColor("primary")}>
      プライマリボタン
    </Button>
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

## 新しいテーマを追加する

`themes.ts`に新しいテーマを追加してください：

```ts
export const newTheme: AppThemeConfig = {
  name: "新しいテーマ",
  primaryColor: "indigo",
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

- `/test-theme` - テーマ切り替えデモページ（認証不要）
- `/test/theme` - テーマ切り替えデモページ（認証必要）
