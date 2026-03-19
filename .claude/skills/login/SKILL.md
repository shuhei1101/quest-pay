---
name: login
description: 'ログイン・認証機能の知識を提供するスキル。ログインAPI、認証画面、ユーザータイプ選択、招待コード入力を含む。'
---

# ログイン・認証 スキル

## 概要

ユーザーのログイン・新規登録・招待コードによる子供アカウント参加処理を管理する機能。Supabase Auth を使用。

## メインソースファイル

### API Routes
- `packages/web/app/api/users/login/route.ts`: ログイン処理 (POST)
  - Supabase auth でロール検出
  - リダイレクト先制御
- `packages/web/app/api/users/parents/join/route.ts`: 親アカウント登録 (POST)
- `packages/web/app/api/users/children/join/route.ts`: 子供アカウント招待コードで参加 (POST)

### 画面・コンポーネント
- `packages/web/app/(auth)/login/page.tsx`: ログインページ
- `packages/web/app/(auth)/login/_components/LoginScreen.tsx`: ログイン画面
- `packages/web/app/(auth)/login/_components/LoginTypeSelectPopup.tsx`: ユーザータイプ選択ポップアップ（親/子供）
- `packages/web/app/(auth)/login/_hooks/useLoginForm.ts`: ログインフォーム管理

## 主要機能

### 1. ログイン
- メールアドレス + パスワードで認証（Supabase Auth）
- ロール検出後に適切なホーム画面へリダイレクト
  - 親 → `/home`
  - 子供 → `/home`（子供向けビュー）

### 2. 新規登録（親）
- メールアドレス・パスワード・プロフィール情報入力
- `parents/join` API で profiles + parents テーブルに作成

### 3. 招待コードで参加（子供）
- 招待コード入力
- `children/join` API で既存 Supabase ユーザーと子供プロフィールを紐付け

### 4. ユーザータイプ選択
- `LoginTypeSelectPopup` でログイン種別選択（親として登録 / 招待コードで参加）

## APIエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| POST | `/api/users/login` | ログイン |
| POST | `/api/users/parents/join` | 親アカウント登録 |
| POST | `/api/users/children/join` | 招待コードで子供参加 |

## 実装上の注意点

- `(auth)` ルートグループは認証不要のレイアウトを使用
- 認証済みユーザーがログインページにアクセスした場合はホームへリダイレクト
- Supabase Auth のセッション管理は `@supabase/ssr` を使用
