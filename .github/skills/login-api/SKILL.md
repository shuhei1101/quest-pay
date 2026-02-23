---
name: login-api
description: ログインAPI操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。
---

# ログインAPI スキル

## 概要

ログインAPIは、ログインユーザーの情報取得を行うAPI。

## API エンドポイント

### ログインユーザー情報取得
- `GET /api/users/login`: ログインユーザー情報取得

## API詳細

### GET /api/users/login

**概要:** ログイン済みユーザーの情報を取得する

**認証:** 必須（Supabase認証後のみアクセス可能）

**リクエスト:**
- メソッド: GET
- ヘッダー: Content-Type: application/json
- ボディ: なし

**レスポンス:**
```typescript
{
  userInfo: UserInfo  // ユーザー情報（nullの場合は初回ログイン）
}

type UserInfo = {
  userId: string
  familyId: string
  parentId: string | null
  childId: string | null
  // ... その他のユーザー情報
}
```

**処理フロー:**
1. getAuthContextで認証コンテキスト取得（db, userId）
2. fetchUserInfoByUserIdでユーザー情報取得
3. userInfoを返却

**使用例:**
```typescript
import { getLoginUser } from "@/app/api/users/login/client"

const { userInfo } = await getLoginUser()
if (!userInfo) {
  // 初回ログイン → タイプ選択ポップアップ表示
} else {
  // ログイン済み → ホーム画面へ遷移
}
```

## クライアント実装

### getLoginUser (client.ts)

**ファイル:** `app/api/users/login/client.ts`

**関数:**
```typescript
export const getLoginUser = async (): Promise<GetLoginUserResponse>
```

**実装:**
- fetchでGET /api/users/loginを呼び出し
- レスポンスのステータスコードを確認
- エラー時はAppError.fromResponseでアプリ例外をスロー
- 正常時はGetLoginUserResponse型で返却

## データベース操作

### 使用クエリ
- `fetchUserInfoByUserId`: ユーザーIDからユーザー情報を取得

### テーブル
- `profiles`: ユーザープロファイル
- `families`: 家族情報
- `parents`: 親情報
- `children`: 子供情報

### 操作原則
- Drizzle低レベルクエリを使用
- 認証済みユーザーのみアクセス可能

## 注意点

- client.ts と route.ts のセットが必須
- フック経由でclient.tsを呼び出す（useLoginUserInfo）
- 認証が必要なAPI（getAuthContext使用）
- userInfoがnullの場合は初回ログイン（タイプ未選択）を意味する
- エラーハンドリングはwithRouteErrorHandlingで統一
