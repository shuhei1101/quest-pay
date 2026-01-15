import { MantineColorsTuple } from "@mantine/core"

/** カラースキーム */
export type ColorScheme = "light" | "dark"

/** カラー設定 */
type ColorConfig = {
  /** ボタンの色 */
  buttonColors: {
    /** 通常ボタン */
    default: string
    /** プライマリボタン */
    primary: string
    /** セカンダリボタン */
    secondary: string
    /** 危険なアクション */
    danger: string
    /** 成功アクション */
    success: string
  }
  /** テキストの色 */
  textColors: {
    /** プライマリテキスト */
    primary: string
    /** セカンダリテキスト */
    secondary: string
    /** 無効化テキスト */
    disabled: string
  }
  /** 背景色 */
  backgroundColors: {
    /** デフォルト背景 */
    default: string
    /** カード背景 */
    card: string
    /** ホバー時 */
    hover: string
  }
  /** 枠線の色 */
  borderColors: {
    /** デフォルト */
    default: string
    /** フォーカス時 */
    focus: string
  }
}

/** アプリで使用するカラーテーマの設定 */
export type AppThemeConfig = {
  /** テーマ名 */
  name: string
  /** プライマリカラー */
  primaryColor: string
  /** ライトモードのカラー設定 */
  light: ColorConfig
  /** ダークモードのカラー設定 */
  dark: ColorConfig
  /** カスタムカラーパレット（Mantine用） */
  colors?: {
    [key: string]: MantineColorsTuple
  }
}
