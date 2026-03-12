---
name: error-structure
description: エラー画面の構造知識を提供するスキル。グローバルエラーハンドラー、認証エラー画面の構造を含む。
---

# エラー画面構造スキル

## 概要

このスキルは、Quest Payアプリケーションにおけるエラー画面の構造知識を提供する。不明なエラーをキャッチするグローバルエラーハンドラーと、認証エラー専用画面の構造・責務・パスを網羅する。

## ファイル構成

### グローバルエラーハンドラー
- **`/packages/web/app/error.tsx`**: Next.js標準のエラーバウンダリー
  - 不明なエラーをキャッチして表示
  - 再読み込み、ホーム、ログインページへ戻るボタンを提供

### 認証エラー専用画面
- **`/packages/web/app/error/unauthorized/page.tsx`**: ルートページ
- **`/packages/web/app/error/unauthorized/UnauthorizedScreen.tsx`**: 認証エラー画面コンポーネント
- **`/packages/web/app/error/unauthorized/mock.tsx`**: モック画面

## グローバルエラーハンドラー (error.tsx)

### 構造
```tsx
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
})
```

### 機能
1. **再読み込みボタン**: `reset()` を呼び出してエラー状態をリセット
2. **ホームへ戻るボタン**: `HOME_URL` へ遷移
3. **ログインページへ戻るボタン**: `LOGIN_URL` へ遷移

### 使用コンポーネント
- `@mantine/core`: Button
- `next/navigation`: useRouter
- `endpoints.ts`: HOME_URL, LOGIN_URL

## 認証エラー画面 (UnauthorizedScreen)

### 構造
```tsx
export const UnauthorizedScreen = () => {
  const router = useRouter()
  
  useEffect(() => {
    appStorage.feedbackMessage.out()
  }, [])
  
  // ボタンハンドラー
  const handleBackToHome = () => router.push(LOGIN_URL)
  const handleGoBack = () => router.back()
}
```

### 機能
1. **セッションストレージからメッセージ取得**: `appStorage.feedbackMessage.out()` でフィードバックメッセージを表示
2. **ホームに戻る**: ログイン画面へ遷移
3. **前のページに戻る**: `router.back()` で前画面へ戻る

### UI要素
- **アイコン**: `IconLock` で鍵アイコンを表示
- **タイトル**: 「アクセスが制限されています」
- **説明文**: 「このページを表示する権限がありません」
- **アラート**: 赤色の警告メッセージ
- **アクションボタン**: 2つのボタン（ホームに戻る、前のページに戻る）

### 使用コンポーネント
- `@mantine/core`: Button, Center, Paper, Title, Text, Alert
- `@tabler/icons-react`: IconLock, IconHome, IconArrowLeft
- `appStorage`: セッションストレージ
- `FeedbackMessage`: フィードバックメッセージ表示

## 処理フロー

### グローバルエラー発生時
1. Next.jsがエラーをキャッチ
2. `error.tsx` がレンダリング
3. ユーザーが以下のいずれかを選択:
   - 再読み込み → `reset()` 実行
   - ホームへ戻る → `HOME_URL` へ遷移
   - ログインページへ戻る → `LOGIN_URL` へ遷移

### 認証エラー発生時
1. エラーハンドラーが認証エラーを検知
2. `appStorage.feedbackMessage.set()` でメッセージを保存
3. `/error/unauthorized` へリダイレクト
4. `UnauthorizedScreen` がレンダリング
5. `useEffect` で `appStorage.feedbackMessage.out()` を実行してメッセージを表示
6. ユーザーがボタンでアクションを選択

## 設計原則

### グローバルエラーハンドラー
- Next.js標準のエラーバウンダリーパターンを使用
- ユーザーに明確な復旧オプションを提供
- UI/UXは最小限に保つ

### 認証エラー画面
- 専用のUIで丁寧にエラーを説明
- セッションストレージでメッセージを引き継ぐ
- ユーザーに適切なナビゲーションを提供

## 関連スキル
- `error-handling`: エラーハンドリングユーティリティとエラークラスの知識
- `endpoints-definition`: エンドポイント定義の知識
- `app-shell-structure`: アプリ全体の構造知識
