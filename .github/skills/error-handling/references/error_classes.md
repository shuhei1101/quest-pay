# Error Classes リファレンス
> 2026年3月記載

## 概要

Quest Payアプリケーションで使用するエラークラスの完全な定義とAPI。

## エラークラス階層

```
Error (標準)
  └─ AppError (基底)
       ├─ ClientValueError (クライアントバリデーション)
       └─ ClientAuthError (クライアント認証)
```

## 基底クラス: AppError

### クラス定義

```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
    public path = '',
  ) {
    super(message)
    this.name = APP_ERROR
  }

  public toResponse(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
    }
  }

  static fromResponse(data: any, status: number): AppError {
    if (ErrorResponseScheme.safeParse(data).success) {
      const { code, message, path } = data
      return new AppError(code, status, message, path)
    }
    return new AppError(
      UNKNOWN_ERROR,
      status,
      'エラーが発生しました。時間をおいて再度お試しください。',
      '',
    )
  }
}
```

### プロパティ

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `code` | `string` | エラーコード（識別子） |
| `status` | `number` | HTTPステータスコード |
| `message` | `string` | ユーザー向けエラーメッセージ |
| `path` | `string` | エラー発生パス（オプション） |
| `name` | `string` | 'AppError'（固定） |

### メソッド

#### toResponse()

エラーをレスポンス形式に変換。

**戻り値**: `ErrorResponse`
```typescript
{
  code: string
  message: string
  path?: string
}
```

**使用例**:
```typescript
const error = new AppError('VALIDATION_ERROR', 400, 'Invalid input', '/api/users')
const response = error.toResponse()
// { code: 'VALIDATION_ERROR', message: 'Invalid input', path: '/api/users' }
```

#### fromResponse(data: any, status: number)

レスポンスからエラーインスタンスを生成。

**パラメータ**:
- `data`: レスポンスボディ
- `status`: HTTPステータスコード

**戻り値**: `AppError`

**使用例**:
```typescript
const response = await fetch('/api/users')
const data = await response.json()

if (!response.ok) {
  const error = AppError.fromResponse(data, response.status)
  throw error
}
```

## 派生クラス

### ClientValueError

クライアントサイドバリデーションエラー。

```typescript
export const CLIENT_VALUE_ERROR_CODE = 'CLIENT_ERROR'

export class ClientValueError extends AppError {
  constructor(message = '不正な値が入力されました。', path = '') {
    super(CLIENT_VALUE_ERROR_CODE, 400, message, path)
  }
}
```

**特徴**:
- HTTPステータス: 400 (Bad Request)
- コード: `CLIENT_ERROR`
- デフォルトメッセージ: 「不正な値が入力されました。」

**使用ケース**:
- フォーム入力値の検証失敗
- 必須フィールドの未入力
- 形式不正（メール、電話番号など）
- 範囲外の値

**使用例**:
```typescript
// フォームバリデーション
if (!email.includes('@')) {
  throw new ClientValueError('有効なメールアドレスを入力してください。', 'email')
}

if (age < 0 || age > 150) {
  throw new ClientValueError('年齢は0〜150の範囲で入力してください。', 'age')
}
```

### ClientAuthError

クライアントサイド認証エラー。

```typescript
export const CLIENT_AUTH_ERROR_CODE = 'CLIENT_AUTH_ERROR'

export class ClientAuthError extends AppError {
  constructor(message = '認証に失敗しました。', path = '') {
    super(CLIENT_AUTH_ERROR_CODE, 401, message, path)
  }
}
```

**特徴**:
- HTTPステータス: 401 (Unauthorized)
- コード: `CLIENT_AUTH_ERROR`
- デフォルトメッセージ: 「認証に失敗しました。」

**使用ケース**:
- ログイン失敗
- セッション切れ
- トークン無効
- 認証情報不正

**使用例**:
```typescript
// ログイン処理
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

if (error) {
  throw new ClientAuthError('メールアドレスまたはパスワードが正しくありません。')
}

// セッションチェック
const { data: session } = await supabase.auth.getSession()
if (!session) {
  throw new ClientAuthError('セッションが切れました。再度ログインしてください。')
}
```

## エラーレスポンススキーマ

### ErrorResponseScheme

Zod スキーマでエラーレスポンスを検証。

```typescript
import { z } from 'zod'

export const ErrorResponseScheme = z.object({
  code: z.string(),
  message: z.string(),
  path: z.string().optional(),
})

export type ErrorResponse = z.infer<typeof ErrorResponseScheme>
```

**使用例**:
```typescript
// APIレスポンスの検証
const response = await fetch('/api/quests')
const data = await response.json()

if (ErrorResponseScheme.safeParse(data).success) {
  // エラーレスポンス
  const error = AppError.fromResponse(data, response.status)
  throw error
} else {
  // 正常レスポンス
  return data
}
```

## 定数

```typescript
// エラー識別子
export const APP_ERROR = 'AppError'

// エラーコード
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR'
export const CLIENT_VALUE_ERROR_CODE = 'CLIENT_ERROR'
export const CLIENT_AUTH_ERROR_CODE = 'CLIENT_AUTH_ERROR'
```

## エラーコード一覧

| コード | 説明 | HTTPステータス | 使用クラス |
|--------|------|---------------|-----------|
| `UNKNOWN_ERROR` | 不明なエラー | 可変 | `AppError` |
| `CLIENT_ERROR` | クライアントバリデーションエラー | 400 | `ClientValueError` |
| `CLIENT_AUTH_ERROR` | クライアント認証エラー | 401 | `ClientAuthError` |

## サーバーサイドエラー

サーバーサイドでは`AppError`をスローし、APIルートハンドラーでキャッチ。

**使用例**:
```typescript
// app/api/quests/family/route.ts
import { AppError } from '@/(core)/error/appError'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // ビジネスロジック検証
    if (!body.title) {
      throw new AppError(
        'VALIDATION_ERROR',
        400,
        'タイトルは必須です。',
        'title'
      )
    }
    
    // ...処理
    
    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json(error.toResponse(), { status: error.status })
    }
    
    // 予期しないエラー
    const unknownError = new AppError(
      UNKNOWN_ERROR,
      500,
      'サーバーエラーが発生しました。'
    )
    return Response.json(unknownError.toResponse(), { status: 500 })
  }
}
```

## カスタムエラークラスの追加

新しいエラータイプが必要な場合、`AppError`を継承：

```typescript
// 例: リソース不足エラー
export const CLIENT_QUOTA_ERROR_CODE = 'CLIENT_QUOTA_ERROR'

export class ClientQuotaError extends AppError {
  constructor(message = 'リソースの上限に達しました。', path = '') {
    super(CLIENT_QUOTA_ERROR_CODE, 403, message, path)
  }
}
```

**使用例**:
```typescript
// クエスト作成数制限チェック
const questCount = await getQuestCount(familyId)
if (questCount >= MAX_QUESTS) {
  throw new ClientQuotaError('作成可能なクエスト数の上限に達しました。')
}
```

## エラーハンドリングフロー

```
1. エラー発生
   ↓
2. AppError（または派生クラス）をスロー
   ↓
3. エラーハンドラーでキャッチ
   ↓
4. toResponse()でレスポンス形式に変換
   ↓
5. クライアントに返却
   ↓
6. fromResponse()でエラーインスタンスに変換
   ↓
7. ユーザーにメッセージ表示
```
