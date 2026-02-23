---
name: login-structure
description: ログイン画面の構造知識を提供するスキル。ファイル構成、フォーム管理、ログインタイプ選択、処理フローを含む。
---

# ログイン画面 スキル

## 概要

ログイン画面は、ユーザーのメールアドレスとパスワードでログインし、初回ログイン時は親/子供のタイプを選択する画面。

## ファイル構成

### メインファイル
- `app/(auth)/login/page.tsx`: ログインページ（リダイレクト専用）
- `app/(auth)/login/LoginScreen.tsx`: ログイン画面実装
- `app/(auth)/login/form.ts`: フォームスキーマ定義

### コンポーネント
- `app/(auth)/login/_components/LoginTypeSelectPopup.tsx`: ログインタイプ選択ポップアップ（親/子供）

### フック
- `app/(auth)/login/_hooks/useLogin.ts`: ログイン処理フック
- `app/(auth)/login/_hooks/useLoginForm.ts`: ログインフォーム管理フック
- `app/(auth)/login/_hooks/useLoginUserInfo.ts`: ログインユーザー情報取得フック
- `app/(auth)/login/_hooks/useJoinAsParent.ts`: 親として家族に参加フック
- `app/(auth)/login/_hooks/useJoinAsChild.ts`: 子として家族に参加フック

### 共通フック
- `app/(auth)/_hooks/useSignOut.ts`: サインアウトフック

### API（login-apiスキル参照）
- `GET /api/users/login`: ログインユーザー情報取得

## 主要コンポーネント

### LoginScreen
**責務:** ログイン画面の表示と処理管理

**主要機能:**
- ログインフォーム表示
  - メールアドレス入力
  - パスワード入力
  - ログイン状態保持チェックボックス
- ログイン処理
- 初回ログイン時のタイプ選択ポップアップ表示
- パスワード忘れリンク
- 新規登録リンク
- セッションストレージクリア

**フォーム項目:**
```typescript
{
  email: string          // メールアドレス（必須）
  password: string       // パスワード（必須、6-20文字）
  rememberMe: boolean    // ログイン状態保持
}
```

**バリデーション:**
- email: 必須
- password: 必須、6文字以上、20文字以下

**ログイン成功時の分岐:**
- ユーザー情報が存在する → ホーム画面へ遷移
- ユーザー情報が存在しない → ログインタイプ選択ポップアップを表示

### LoginTypeSelectPopup
**責務:** 初回ログイン時の親/子供タイプ選択

**主要機能:**
- 親として新規家族作成
- 親として既存家族に参加（招待コード入力）
- 子として既存家族に参加（招待コード入力）

**選択肢:**
1. **新しい家族を作成する（親）**
   - 新規家族作成画面へ遷移
2. **既存の家族に親として参加**
   - 親招待コード入力
   - 参加ボタンクリック → useJoinAsParent
3. **既存の家族に子として参加**
   - 子招待コード入力
   - 参加ボタンクリック → useJoinAsChild

## 処理フロー

### 初回アクセス時
1. `page.tsx`: checkIsLoggedInでログイン状態確認
2. ログイン済み → クエスト画面へリダイレクト
3. 未ログイン → LoginScreenコンポーネント表示

### ログイン処理
1. ユーザーがメールアドレス、パスワードを入力
2. 「ログイン」ボタンクリック
3. useLogin.loginを呼び出し
4. Supabase認証実行
5. 成功時:
   - currentUserクエリを無効化
   - getLoginUserでユーザー情報取得
   - onSuccessコールバック実行
     - userInfoが存在 → ホーム画面へ遷移
     - userInfoが存在しない → LoginTypeSelectPopupを開く

### 初回ログイン時（タイプ選択）
1. LoginTypeSelectPopupが開く
2. ユーザーがタイプを選択
3. **新規家族作成（親）:**
   - 「新しい家族を作成する」ボタンクリック
   - 新規家族作成画面へ遷移
4. **既存家族に親として参加:**
   - 親招待コード入力
   - useJoinAsParent.handleJoinAsParent実行
   - 成功時: ユーザー情報再取得 → ホーム画面へ遷移
5. **既存家族に子として参加:**
   - 子招待コード入力
   - useJoinAsChild.handleJoinAsChild実行
   - 成功時: ユーザー情報再取得 → ホーム画面へ遷移

### セッションストレージクリア
- LoginScreen初回レンダリング時にsessionStorage.clear()を実行
- 前回のセッションデータをクリアする

## エンドポイント

### 画面URL
- `LOGIN_URL`: `/login`

### API URL
- login-apiスキルを参照

### 関連URL
- `HOME_URL`: ホーム画面
- `FAMILY_NEW_URL`: 新規家族作成画面
- `SIGNUP_URL`: サインアップ画面
- `FORGOT_PASSWORD_URL`: パスワード忘れ画面

## 注意点

- ログイン処理はSupabase認証を使用（useLogin内でcreateClient）
- rememberMeフラグに応じてSupabaseクライアントの永続化設定が変わる
- 初回ログイン時は必ずタイプ選択が必要（親 or 子）
- アクセスエラーハンドラをSuspenseでラップ（useSearchParams使用のため）
- ログイン済みの場合はクエスト画面へ自動リダイレクト
