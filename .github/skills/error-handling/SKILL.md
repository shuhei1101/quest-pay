---
name: error-handling
description: エラーハンドリングの知識を提供するスキル。エラークラス定義、クライアント/サーバーエラーハンドラーを含む。
---

# エラーハンドリング スキル

## 概要

このスキルは、Quest Payアプリケーションの統一的なエラーハンドリング戦略の知識を提供します。エラークラス定義、ハンドラーパターン、ロギング統合を含みます。

## メインソースファイル

### エラークラス定義
- `app/(core)/error/appError.ts`: 基底エラークラスと派生クラス
  - `AppError`: 基底クラス
  - `ClientValueError`: バリデーションエラー
  - `ClientAuthError`: 認証エラー

### エラーハンドラー
- `app/(core)/error/handler/client.ts`: クライアントサイドハンドラー
- `app/(core)/error/handler/server.ts`: サーバーサイドハンドラー

### エラーバウンダリー
- `app/(core)/error/ErrorFallback.tsx`: Reactエラーバウンダリー
- `app/error.tsx`: ページレベルエラーハンドラー
- `app/global-error.tsx`: グローバルエラーハンドラー

### ロガー統合
- `app/(core)/logger.ts`: loglevelベースのロガー

## 主要機能グループ

### 1. エラークラス階層
- 基底クラス（AppError）
- バリデーションエラー（ClientValueError）
- 認証エラー（ClientAuthError）
- カスタムエラー拡張可能

### 2. エラーハンドリングフロー
- クライアントサイド: ルーティング、UI更新
- サーバーサイド: HTTPレスポンス変換
- エラーバウンダリー: React境界

### 3. ロギング統合
- エラーレベル別ログ出力
- デバッグ情報記録
- 本番環境でのログ制御

## Reference Files Usage

### エラークラス定義を確認する場合
すべてのエラークラスの詳細仕様とAPI：
```
references/error_classes.md
```

### ハンドラーパターンを学ぶ場合
クライアント/サーバーのエラー処理パターンと実装例：
```
references/handler_patterns.md
```

### ロギング戦略を確認する場合
ログレベル、出力パターン、デバッグ方法：
```
references/logging_strategy.md
```

## クイックスタート

1. **エラークラス理解**: `references/error_classes.md`で階層確認
2. **ハンドラー実装**: `references/handler_patterns.md`でパターン確認
3. **ログ設定**: `references/logging_strategy.md`でログ戦略確認

## 実装上の注意点

### 必須パターン
1. **エラーは早期キャッチ**: バリデーション後即座にスロー
2. **適切なエラーコード**: 意味のあるコードを使用
3. **ユーザーフレンドリー**: 分かりやすいメッセージ
  
  // 前画面がある場合、遷移する
  let redirectUrl = appStorage.parentScreen.get()
  if (!redirectUrl) {
    // サインアウトする
    await createClient().auth.signOut()
    redirectUrl = ROOT_URL
  }
  
  router.push(`${redirectUrl}`)
}
```

**処理フロー:**
1. エラー内容をログ出力
2. フィードバックメッセージをセッションストレージに保存
3. 前画面URLを取得
4. 前画面がない場合:
   - サインアウト実行
   - ルートURLへリダイレクト
5. 前画面がある場合:
   - 前画面へリダイレクト

**使用モジュール:**
- `appStorage.feedbackMessage`: フィードバックメッセージ管理
- `appStorage.parentScreen`: 前画面URL管理
- `createClient().auth.signOut()`: Supabase認証サインアウト

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## サーバーサイドエラーハンドラー (handler/server.ts)

### withRouteErrorHandling
```typescript
export async function withRouteErrorHandling(
  fn: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof AppError) {
      // アプリ固有エラーのハンドル
      devLog("withRouteErrorHandling.サーバ内例外: ", error, error.path)
      return NextResponse.json(error.toResponse(), { status: error.status })
    } else {
      devLog("withRouteErrorHandling.想定外の例外: ", error)
      // 想定外のエラー
      return NextResponse.json({
        code: UNKNOWN_ERROR, 
        message: error instanceof Error ? error.message : String(error),
      } as ErrorResponse, { status: 500 })
    }
  }
}
```

**処理フロー:**
1. コールバック関数を実行
2. `AppError` の場合:
   - エラーログを出力
   - `toResponse()` でレスポンスに変換
   - エラーのステータスコードでレスポンス
3. 想定外のエラーの場合:
   - エラーログを出力
   - `UNKNOWN_ERROR` コードでレスポンス
   - ステータスコード 500 で返却

**使用例:**
```typescript
export async function POST(request: Request) {
  return withRouteErrorHandling(async () => {
    // API処理
    return NextResponse.json({ data: "success" })
  })
}
```

## エラーバウンダリーフォールバック (ErrorFallback.tsx)

### ErrorFallback
```typescript
export const ErrorFallback = ({ error }: FallbackProps) => {
  useEffect(() => {
    // 次画面で表示するメッセージを登録
    const errorMessage = error instanceof Error 
      ? error.message 
      : String(error)
    appStorage.feedbackMessage.set({ 
      message: errorMessage, 
      type: "error" 
    })
    
    // ログイン画面にリダイレクトする
    redirect(LOGIN_URL)
  }, [error])

  return null
}
```

**処理フロー:**
1. エラーメッセージを取得
2. セッションストレージに保存
3. ログイン画面へリダイレクト
4. レンダリングは行わない（`return null`）

**使用ライブラリ:**
- `react-error-boundary`: `FallbackProps` 型

## 使用パターン

### クライアントエラーハンドリング
```typescript
"use client"

import { handleAppError } from "@/app/(core)/error/handler/client"
import { useRouter } from "next/navigation"

export const MyComponent = () => {
  const router = useRouter()
  
  const handleSubmit = async () => {
    try {
      // 処理
    } catch (error) {
      await handleAppError(error as Error, router)
    }
  }
}
```

### サーバーエラーハンドリング
```typescript
import { withRouteErrorHandling } from "@/app/(core)/error/handler/server"
import { AppError } from "@/app/(core)/error/appError"

export async function POST(request: Request) {
  return withRouteErrorHandling(async () => {
    const data = await request.json()
    
    if (!data.id) {
      throw new AppError(
        'VALIDATION_ERROR',
        400,
        'IDが必要です',
        'data.id'
      )
    }
    
    return NextResponse.json({ success: true })
  })
}
```

### カスタムエラー作成
```typescript
import { AppError } from "@/app/(core)/error/appError"

// カスタムエラークラス
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(
      'NOT_FOUND',
      404,
      `${resource}が見つかりません`,
      ''
    )
  }
}

// 使用例
throw new NotFoundError('クエスト')
```

## 設計原則

1. **統一されたエラーレスポンス**: すべてのエラーは `ErrorResponse` 型に統一
2. **適切なログ出力**: クライアント/サーバー両方で `devLog` を使用
3. **ユーザーフィードバック**: エラーメッセージはセッションストレージで次画面に引き継ぐ
4. **セキュリティ**: 想定外のエラーは詳細を隠してログに記録
5. **型安全性**: Zodスキーマでエラーレスポンスを検証

## 関連スキル
- `error-structure`: エラー画面の構造知識
- `endpoints-definition`: エンドポイント定義の知識
- `database-operations`: データベース操作のエラーハンドリング
