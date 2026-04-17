
# アプリシェルコンポーネント スキル

## 概要

アプリ全体のナビゲーション構造（サイドメニュー・ボトムバー・FAB）を管理するコンポーネント群。

## メインソースファイル

- `packages/web/app/(app)/_components/AppShellContent.tsx`: アプリシェルのルートコンポーネント
- `packages/web/app/(app)/_components/SideMenu.tsx`: PC向けサイドメニュー
- `packages/web/app/(app)/_components/BottomBar.tsx`: モバイル向けボトムバー
- `packages/web/app/(app)/_components/NavigationFAB.tsx`: フローティングアクションボタン
- `packages/web/app/(core)/_components/FABContext.tsx`: FAB状態管理コンテキスト

## 主要コンポーネント

### AppShellContent
- アプリの全体レイアウトを管理
- PC: `SideMenu`（左固定） + コンテンツエリア
- モバイル: `BottomBar`（下固定） + コンテンツエリア
- `useWindow` + `isTablet` でレスポンシブ切り替え

### SideMenu（PCサイドメニュー）
- ナビゲーションリンク一覧
- 通知バッジ表示
- ユーザーアバター・ログアウト

### BottomBar（モバイルボトムバー）
- タブバー形式のナビゲーション
- 通知バッジ表示

### NavigationFAB
- 画面下部のフローティングボタン
- `FABContext` で各画面からカスタマイズ可能

### FABContext
- 各画面でFABのアクションをオーバーライド
- `useFAB()` フックで FAB に独自アクションを追加

## 使い方（FABカスタマイズ）

```typescript
import { useFAB } from "@/app/(core)/_components/FABContext"

// 画面コンポーネント内で FAB アクションを設定
const MyScreen = () => {
  const { setFabActions } = useFAB()

  useEffect(() => {
    setFabActions([
      { label: "新規作成", icon: <IconPlus />, onClick: handleCreate }
    ])
    return () => setFabActions([])  // アンマウント時にクリア
  }, [])
}
```

## 実装上の注意点

- FABContext は `AppShellContent` の外側でプロバイダーを提供
- `NavigationFAB` と `SubMenuFAB` は別物（`SubMenuFAB` は `common-components` スキル参照）
- BottomBar のアクティブ状態は URL パスで自動判定
