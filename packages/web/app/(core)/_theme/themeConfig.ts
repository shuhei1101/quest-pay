import { MantineColorsTuple } from "@mantine/core"

/** カラー設定 */
export type ColorConfig = {
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
  /** カードの設定 */
  cardStyles: {
    /** 背景色 */
    background: string
    /** 枠線の色 */
    border: string
    /** ホバー時の影 */
    hoverShadow: string
  }
  /** バッジの色 */
  badgeColors: {
    /** 情報バッジ */
    info: string
    /** 警告バッジ */
    warning: string
    /** エラーバッジ */
    error: string
    /** 成功バッジ */
    success: string
  }
  /** 入力フォームの色 */
  inputColors: {
    /** 背景色 */
    background: string
    /** 枠線の色 */
    border: string
    /** フォーカス時の枠線 */
    focusBorder: string
  }
  /** FAB（フローティングアクションボタン）の設定 */
  fab: {
    /** ボタンのvariant */
    variant: "light" | "filled"
    /** 透明度設定 */
    opacity: {
      /** 選択中 */
      active: number
      /** 非選択 */
      inactive: number
    }
    /** 枠線設定 */
    border: {
      /** 選択中の枠線幅 */
      activeWidth: string
      /** 非選択の枠線幅 */
      inactiveWidth: string
    }
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
