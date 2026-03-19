---
name: login-structure
description: ログイン画面の構造知識を提供するスキル。ファイル構成、フォーム管理、ログインタイプ選択、処理フローを含む。 Trigger Keywords: ログイン画面、ログインページ、ログインフォーム、認証UI、ログインタイプ
---

# ログイン画面 スキル

## 概要

このスキルは、メールアドレス/パスワード認証、初回ログイン時の親/子供タイプ選択、招待コード入力による家族参加機能を管理するログイン画面の知識を提供します。

## メインソースファイル

### 画面
- `app/(auth)/login/page.tsx`: ログインページ（リダイレクト専用）
- `app/(auth)/login/LoginScreen.tsx`: ログイン画面実装

### コンポーネント
- `app/(auth)/login/_components/LoginTypeSelectPopup.tsx`: ログインタイプ選択ポップアップ

### フック
- `app/(auth)/login/_hooks/useLogin.ts`: ログイン処理
- `app/(auth)/login/_hooks/useLoginForm.ts`: フォーム管理
- `app/(auth)/login/_hooks/useLoginUserInfo.ts`: ユーザー情報取得
- `app/(auth)/login/_hooks/useJoinAsParent.ts`: 親として家族参加
- `app/(auth)/login/_hooks/useJoinAsChild.ts`: 子として家族参加

### フォーム定義
- `app/(auth)/login/form.ts`: フォームスキーマ

### API（login-apiスキル参照）
- `GET /api/users/login`: ログインユーザー情報取得

## 主要機能グループ

### 1. 認証機能
- メールアドレス/パスワード認証（Supabase）
- ログイン状態保持（rememberMe）
- セッション管理

### 2. ロール選択
- 初回ログイン時の親/子供タイプ選択
- 新規家族作成（親のみ）
- 既存家族への参加（招待コード）

### 3. フォーム管理
- バリデーション（email, password）
- 招待コード入力
- エラー表示

## Reference Files Usage

### コンポーネント構造を把握する場合
ログイン画面のレイアウト、LoginTypeSelectPopupの構造を確認：
```
references/component_structure.md
```

### フォーム処理を理解する場合
フォームスキーマ、バリデーション、招待コード入力を確認：
```
references/form_management.md
```

### ログインフローを把握する場合
初回アクセスからロール選択、リダイレクトまでのフロー確認：
```
references/flow_diagram.md
```

### Supabase認証を理解する場合
認証処理、セッション管理、ユーザー情報取得API統合を確認：
```
references/authentication_flow.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でログインフロー確認
2. **認証の理解**: `references/authentication_flow.md`でSupabase統合確認
3. **実装時**: `references/component_structure.md`でコンポーネント詳細確認
4. **フォーム実装**: `references/form_management.md`でバリデーション確認

## 実装上の注意点

### 必須パターン
- **Supabase認証**: createClient(rememberMe)で永続化制御
- **React Query**: currentUserキャッシュ管理
- **セッションクリア**: LoginScreen初回レンダリング時にsessionStorage.clear()
- **Suspense**: useSearchParams使用のためAccessErrorHandlerをラップ

### セキュリティ
- パスワード: PasswordInputコンポーネント使用
- HTTPS: Supabase認証はHTTPS必須
- トークン管理: Supabaseが自動管理

### 画面遷移パターン
- **ログイン済み**: クエスト画面へ自動リダイレクト
- **ユーザー情報あり**: ホーム画面へ遷移
- **ユーザー情報なし**: LoginTypeSelectPopup表示 → ロール選択後にホーム画面
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


