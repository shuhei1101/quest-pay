---
name: login-api
description: ログインAPI操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。 Trigger Keywords: login API, authentication API, auth endpoint, login operations
---

# ログインAPI スキル

## 概要

このスキルは、Supabase認証、ユーザー情報取得、ロール別リダイレクト、招待コード経由の家族参加を管理するログイン・認証API群の知識を提供します。

## メインソースファイル

### API Routes
- `packages/web/app/api/users/login/route.ts`: ログインユーザー情報取得
- `packages/web/app/api/parents/join/route.ts`: 親として家族参加
- `packages/web/app/api/children/join/route.ts`: 子として家族参加

### クライアント側
- `packages/web/app/api/users/login/client.ts`: APIクライアント関数
- `packages/web/app/(auth)/_hooks/useSignOut.ts`: サインアウトフック
- `packages/web/app/(auth)/login/_hooks/useLogin.ts`: ログイン処理フック
- `packages/web/app/(auth)/login/_hooks/useLoginUserInfo.ts`: ログインユーザー情報取得フック
- `packages/web/app/(auth)/login/_hooks/useJoinAsParent.ts`: 親として参加フック
- `packages/web/app/(auth)/login/_hooks/useJoinAsChild.ts`: 子として参加フック

### 画面コンポーネント
- `packages/web/app/(auth)/login/LoginScreen.tsx`: ログイン画面
- `packages/web/app/(auth)/login/_components/LoginTypeSelectPopup.tsx`: タイプ選択ポップアップ

### データベース
- `drizzle/schema.ts`: auth.users, profiles, parents, children, families

## 主要機能グループ

### 1. Supabase認証
- メールアドレス・パスワードによるログイン
- セッション管理
- サインアウト

### 2. ユーザー情報取得
- 認証済みユーザーの情報取得
- 初回ログイン判定（userInfo = null）
- ロール判定（parent/child）

### 3. 招待コード参加
- 親として既存家族に参加
- 子として既存家族に参加
- プロフィール + ロール拡張テーブルの同時作成

### 4. リダイレクト制御
- 初回ログイン → タイプ選択ポップアップ
- 親ログイン → 親ホーム画面
- 子ログイン → 子ホーム画面

## Reference Files Usage

### データベース構造を把握する場合
認証・プロフィール関連テーブルのER図と主要リレーションを確認：
```
references/er_diagram.md
```

### ログインフローを理解する場合
標準ログイン、ロール検出、招待コードログイン、セッション管理フローを確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、トランザクション処理を確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、エラーコード、バリデーションルールを確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でログインフロー確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン
- **Supabase認証**: `auth.signInWithPassword` でログイン実行
- **セッション管理**: HTTP-onlyクッキーで自動管理
- **getAuthContext**: API Route内で認証状態確認
- **トランザクション**: profiles + parents/children の同時作成
- **Logger**: すべてのAPI処理でlogger使用

### 認証フロー
1. Supabaseで認証（auth.usersにレコード作成）
2. GET /api/users/login でプロフィール確認
3. プロフィールなし → タイプ選択ポップアップ
4. プロフィールあり → ロール別リダイレクト

### 権限管理
- **未認証**: ログイン画面のみアクセス可能
- **認証済み（プロフィールなし）**: タイプ選択のみ可能
- **認証済み（親）**: 親機能にアクセス可能
- **認証済み（子）**: 子機能にアクセス可能

### セキュリティ考慮事項
- アクセストークンはHTTP-onlyクッキーに保存
- CSRFはNext.js + Supabaseで自動保護
- エラーメッセージは詳細をログのみに記録
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


