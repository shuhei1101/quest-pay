---
name: error
description: 'エラーハンドリングの知識を提供するスキル。エラークラス・クライアント/サーバーのエラー処理・エラー画面の構造を含む。'
---

# エラーハンドリング スキル

## 概要

クライアント・サーバー双方のエラー処理パターンとエラー表示画面を管理する。`AppError` を中心とした統一的なエラー処理を実装。

## メインソースファイル

### エラークラス・ハンドラー
- `packages/web/app/(core)/errors/AppError.ts`: 基本エラークラス
- `packages/web/app/(core)/errors/ClientValueError.ts`: バリデーションエラー
- `packages/web/app/(core)/errors/ClientAuthError.ts`: 認証エラー
- `packages/web/app/(core)/errors/client.ts`: クライアント側エラーハンドラー（`handleAppError`）
- `packages/web/app/(core)/errors/server.ts`: サーバー側エラーハンドラー（`withRouteErrorHandling`）

### エラー画面
- `packages/web/app/error.tsx`: Next.js グローバルエラー境界
- `packages/web/app/error/unauthorized/page.tsx`: 認証エラーページ
- `packages/web/app/(app)/_components/UnauthorizedScreen.tsx`: 認証エラー表示コンポーネント

## エラークラス

```typescript
// 基本エラー
class AppError extends Error {
  statusCode: number
  code: string
  // AppError.fromResponse() でレスポンスから生成
}

// バリデーションエラー（クライアント入力エラー）
class ClientValueError extends AppError {
  field?: string   // エラーが発生したフィールド名
}

// 認証エラー（未認証・権限なし）
class ClientAuthError extends AppError {}
```

## サーバー側エラーハンドリング

```typescript
// route.ts で使用
export const GET = withRouteErrorHandling(async (req) => {
  // 処理...
  // エラーは自動的にキャッチ・レスポンス変換される
})
```

## クライアント側エラーハンドリング

```typescript
// client.ts で使用
try {
  const response = await fetch(url)
  return handleAppError(response)  // エラーレスポンスを AppError に変換
} catch (error) {
  // React Query の error オブジェクトとして管理
}
```

## エラー画面

### グローバルエラー境界 (app/error.tsx)
- Next.js の `error.tsx` によるアプリレベルのエラーキャッチ
- リロードボタンを表示

### 認証エラーページ (error/unauthorized/page.tsx)
- 未認証・権限不足時に表示
- ログインページへのリダイレクトリンク

## 実装上の注意点

- API route は必ず `withRouteErrorHandling` でラップする
- クライアント側は `handleAppError` でレスポンスを変換
- `ClientValueError` はフォームバリデーションエラーに使用
- `ClientAuthError` は認証失敗・権限不足に使用
- `AppError.fromResponse()` でレスポンスから生成
