---
name: family-quest-api
description: 家族クエストAPIの構造知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。
---

# 家族クエストAPI スキル

## 概要

このスキルは、家族クエストのCRUD操作、公開機能、子供の受注・完了報告・承認フローを管理するAPI群の知識を提供します。

## メインソースファイル

### API Routes
- `packages/web/app/api/quests/family/route.ts`: 一覧取得、新規作成
- `packages/web/app/api/quests/family/[id]/route.ts`: 詳細取得、更新、削除
- `packages/web/app/api/quests/family/[id]/publish/route.ts`: 公開
- `packages/web/app/api/quests/family/[id]/review-request/route.ts`: 完了報告
- `packages/web/app/api/quests/family/[id]/child/[childId]/approve/route.ts`: 承認
- `packages/web/app/api/quests/family/[id]/child/[childId]/reject/route.ts`: 却下

### クライアント側
- `packages/web/app/api/quests/family/client.ts`: APIクライアント関数
- `packages/web/app/api/quests/family/query.ts`: React Queryフック

### データベース
- `drizzle/schema.ts`: family_quests, family_quest_details, child_quests, public_quests

## 主要機能グループ

### 1. 基本CRUD
- 一覧取得、新規作成、詳細取得、更新、削除

### 2. 公開機能
- 家族クエストを公開クエストとして公開
- 公開クエスト情報の取得

### 3. 子供クエスト操作
- クエスト受注、開始、完了報告、承認/却下
- ステータス遷移: not_started → in_progress → pending_review → completed

### 4. 報酬システム
- 承認時の報酬付与、経験値加算、レベルアップ判定

## Reference Files Usage

### データベース構造を把握する場合
家族クエスト関連テーブルのER図と主要リレーションを確認：
```
references/er_diagram.md
```

### クエストライフサイクルを理解する場合
作成から完了までのフロー、ステータス遷移を確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、非同期処理を確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、エラーコード、クエリパラメータを確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でライフサイクル確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン
- **client.ts + route.ts**: セットで実装
- **React Query**: useQuery/useMutationでAPIアクセス
- **トランザクション**: 複数テーブル更新時は必須
- **排他制御**: 承認/却下処理でFOR UPDATE使用
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- **親のみ**: 作成、更新、削除、承認、却下
- **子供のみ**: 完了報告、報告キャンセル
- **家族メンバー**: 一覧取得、詳細取得
