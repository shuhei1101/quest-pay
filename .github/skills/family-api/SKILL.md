---
name: family-api
description: 家族API操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。
---

# 家族API スキル

## 概要

このスキルは、家族のCRUD操作、メンバー管理、フォロー機能を管理するAPI群の知識を提供します。

## メインソースファイル

### API Routes
- `packages/web/app/api/families/route.ts`: 一覧取得、新規作成
- `packages/web/app/api/families/[id]/route.ts`: 詳細取得、更新、削除
- `packages/web/app/api/families/[id]/members/route.ts`: メンバー一覧取得、追加
- `packages/web/app/api/families/[id]/members/[memberId]/route.ts`: メンバー削除
- `packages/web/app/api/families/[id]/follow/route.ts`: フォロー、フォロー解除
- `packages/web/app/api/families/[id]/follow/status/route.ts`: フォロー状態取得
- `packages/web/app/api/families/[id]/follow/count/route.ts`: フォロー数取得
- `packages/web/app/api/families/invite/route.ts`: 招待コード生成

### クライアント側
- `packages/web/app/api/families/client.ts`: APIクライアント関数
- `packages/web/app/api/families/query.ts`: React Queryフック

### データベース
- `drizzle/schema.ts`: families, profiles, parents, children, family_follows

## 主要機能グループ

### 1. 基本CRUD
- 一覧取得、新規作成、詳細取得、更新、削除

### 2. メンバー管理
- メンバー一覧取得、メンバー追加、メンバー削除
- 親と子供のプロフィール管理
- 招待コードによる参加

### 3. フォロー機能
- 家族間のフォロー、フォロー解除
- フォロー状態確認、フォロー数取得

### 4. 権限管理
- 親権限チェック（`checkIsParentInFamily`）
- メンバータイプ判定（parent/child）

## Reference Files Usage

### データベース構造を把握する場合
家族、プロフィール、親、子供テーブルのER図と主要リレーションを確認：
```
references/er_diagram.md
```

### 家族作成・メンバー管理フローを理解する場合
家族作成から招待、ロール管理までのフロー、権限管理を確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、トランザクション処理を確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、エラーコード、クエリパラメータを確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`で家族作成・メンバー管理フロー確認
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
- **親のみ**: 家族作成、更新、削除、メンバー追加・削除
- **全メンバー**: 一覧取得、詳細取得、フォロー機能
- **招待コード**: 親・子供それぞれに個別の招待コード

### CASCADE削除
- 家族削除時: profiles、family_follows（CASCADE）
- メンバー削除時: parents/children（CASCADE）
- 制約違反: family_quests、quest_children（RESTRICT）
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


