---
name: error-structure
description: エラー画面の構造知識を提供するスキル。グローバルエラーハンドラー、認証エラー画面の構造を含む。 Trigger Keywords: エラー画面、エラーページ、グローバルエラー、認証エラー、エラーUI
---

# エラー画面構造 スキル

## 概要

このスキルは、Quest Payアプリケーションにおけるエラー画面の構造知識を提供します。不明なエラーをキャッチするグローバルエラーハンドラー、認証エラー専用画面、エラーハンドリング戦略を含みます。

## メインソースファイル

### エラー画面
- `packages/web/app/error.tsx`: グローバルエラーハンドラー（Error Boundary）
- `packages/web/app/error/unauthorized/page.tsx`: 認証エラーページ
- `packages/web/app/error/unauthorized/UnauthorizedScreen.tsx`: 認証エラー画面

### エラーハンドラー
- `packages/web/app/(core)/error/handler/client.ts`: クライアント側エラーハンドラー
- `packages/web/app/(core)/error/handler/server.ts`: サーバー側エラーハンドラー
- `packages/web/app/(core)/error/appError.ts`: エラークラス定義

### セッションストレージ
- `packages/web/app/(core)/_sessionStorage/appStorage.ts`: feedbackMessage管理

## 主要機能グループ

### 1. グローバルエラーハンドラー
- コンポーネントレンダリング中の予期しないエラーをキャッチ
- 中央配置の洗練されたエラーUI表示
- reset関数によるエラー回復

### 2. 認証エラー画面
- 401/403エラー専用の表示
- セッションストレージからのフィードバックメッセージ表示
- ログインページへの誘導

### 3. エラーハンドリング戦略
- ClientError/ServerErrorの適切な処理振り分け
- エラータイプに応じたtoast通知 or ページ遷移
- ログレベルの使い分け（error/warn/info/debug）

## Reference Files Usage

### コンポーネント構造を把握する場合
エラー画面の階層、アイコン、ボタン配置を確認：
```
references/component_structure.md
```

### エラー処理フローを理解する場合
エラー発生からユーザー通知までの流れを確認：
```
references/flow_diagram.md
```

### エラーハンドリング詳細を確認する場合
エラークラス、ハンドラー、ログ戦略、リカバリー方法を確認：
```
references/error_handling.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でエラー処理フロー確認
2. **コンポーネント理解**: `references/component_structure.md`でUI構造確認
3. **実装時**: `references/error_handling.md`でハンドリング戦略確認

## 実装上の注意点

### 必須パターン
- **エラークラスの使用**: `throw new ClientError("メッセージ", 401)` でエラータイプを明確化
- **統一ハンドラー**: `handleAppError(error, router)` で一貫したエラー処理
- **ログの構造化**: `logger.error('コンテキスト', { ...詳細 })` で検索・分析可能に

### 推奨パターン
- **ユーザーフレンドリーなメッセージ**: 専門用語を避け、次のアクションを示唆
- **開発者向け詳細**: logger経由で詳細なエラー情報（stack trace等）を記録
- **リカバリー手段の提供**: 再読み込みボタン、ホームへ戻るボタン等

### エラーバウンダリーの配置
- **グローバル**: `app/error.tsx` でアプリ全体をカバー
- **レイアウト固有**: 将来的に `app/(app)/error.tsx` で特定セクションをカバー可能

### 使用コンポーネント
- `@mantine/core`: Button, Center, Paper, Stack, Text, Title, Alert
- `@tabler/icons-react`: IconAlertTriangle, IconRefresh, IconHome
- `next/navigation`: useRouter
- `endpoints.ts`: HOME_URL

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


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
3. 中央揃えのカードレイアウトで表示
4. ユーザーが以下のいずれかを選択:
   - 再読み込み → `reset()` 実行
   - ホームへ戻る → `HOME_URL` へ遷移

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
- 洗練されたUIで中央揃えのカードレイアウトを採用
- 視覚的に分かりやすいアイコンとカラーコーディング（オレンジ色で警告）
- エラー詳細はAlertコンポーネントで明確に表示

### 認証エラー画面
- 専用のUIで丁寧にエラーを説明
- セッションストレージでメッセージを引き継ぐ
- ユーザーに適切なナビゲーションを提供

## 関連スキル
- `error-handling`: エラーハンドリングユーティリティとエラークラスの知識
- `endpoints-definition`: エンドポイント定義の知識
- `app-shell-structure`: アプリ全体の構造知識
