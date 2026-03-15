---
name: child-management-api
description: 子供管理API操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。
---

# 子供管理API スキル

## 概要

このスキルは、子供アカウントのCRUD操作、招待コード生成、プロフィール管理を行うAPI群の知識を提供します。

## メインソースファイル

### API Routes
- `packages/web/app/api/children/route.ts`: 一覧取得、新規登録
- `packages/web/app/api/children/[id]/route.ts`: 詳細取得、更新、削除
- `packages/web/app/api/children/invite/service.ts`: 招待コード生成
- `packages/web/app/api/children/join/route.ts`: 招待コードで参加

### クライアント側
- `packages/web/app/api/children/client.ts`: APIクライアント関数
- `packages/web/app/api/children/query.ts`: React Queryフック

### データベース
- `drizzle/schema.ts`: children, profiles, families, auth.users

## 主要機能グループ

### 1. 基本CRUD
- 一覧取得、新規登録、詳細取得、更新、削除

### 2. 招待コードシステム
- 子供登録時に一意の招待コードを自動生成
- 招待コードで子供アカウントとauth.usersを紐付け

### 3. プロフィール管理
- 名前、アイコン、生年月日の管理
- 貯金額、レベル、経験値の集計値表示

### 4. 統計情報
- クエスト統計（未着手/進行中/報告中/完了）
- 報酬統計（総報酬/種類別）
- 定額報酬（年齢別/レベル別）

## Reference Files Usage

### データベース構造を把握する場合
子供管理関連テーブルのER図と主要リレーションを確認：
```
references/er_diagram.md
```

### 子供登録フローを理解する場合
登録から招待コード生成までのフロー、プロフィール更新・削除を確認：
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

1. **全体像の把握**: `references/flow_diagram.md`で登録フロー確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン
- **client.ts + route.ts**: セットで実装
- **React Query**: useQuery/useMutationでAPIアクセス
- **トランザクション**: 複数テーブル更新時は必須
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- **親のみ**: 作成、削除
- **親または本人**: 更新
- **家族メンバー**: 一覧取得、詳細取得

### 招待コードシステム
- **生成**: POST /api/children 内で自動生成（最大10回試行）
- **用途**: 子供アカウント作成時に表示、子供がログイン時に入力
- **紐付け**: POST /api/children/join で auth.users と profiles を紐付け
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


