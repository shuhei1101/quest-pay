---
name: child-quest-api
description: 子供クエストAPIの構造知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。 Trigger Keywords: 子供クエストAPI、子供クエスト操作、子供クエストCRUD
---

# 子供クエストAPI スキル

## 概要

このスキルは、子供が受注したクエストの管理、完了報告、親の承認処理を管理するAPI群の知識を提供します。子供がクエストを受注してから完了までのライフサイクル全体（開始→作業→報告→承認→報酬付与）をカバーします。

## メインソースファイル

### API Routes
- `packages/web/app/api/quests/child/route.ts`: 一覧取得
- `packages/web/app/api/quests/child/[id]/route.ts`: 詳細取得
- `packages/web/app/api/quests/family/[id]/review-request/route.ts`: 完了報告（再掲）
- `packages/web/app/api/quests/family/[id]/cancel-review/route.ts`: 報告キャンセル
- `packages/web/app/api/quests/family/[id]/child/[childId]/approve/route.ts`: 承認（再掲）
- `packages/web/app/api/quests/family/[id]/child/[childId]/reject/route.ts`: 却下（再掲）

### クライアント側
- `packages/web/app/api/quests/child/client.ts`: APIクライアント関数
- `packages/web/app/api/quests/child/query.ts`: React Queryフック

### データベース
- `drizzle/schema.ts`: child_quests, family_quest_details, family_quests, reward_history, children

## 主要機能グループ

### 1. 基本CRUD
- 子供クエスト一覧取得、詳細取得

### 2. クエスト進行管理
- 開始、完了報告、報告キャンセル
- ステータス遷移: not_started → in_progress → pending_review → completed

### 3. 親の承認システム
- 完了報告の承認/却下
- 承認時の報酬付与、経験値加算、レベルアップ判定

### 4. レベル進行システム
- 現在レベル完了時の次レベル自動生成
- 最終レベル完了時のクエストクリア処理

## Reference Files Usage

### データベース構造を把握する場合
子供クエスト関連テーブルのER図と主要リレーションを確認：
```
references/er_diagram.md
```

### クエストライフサイクルを理解する場合
受注から完了までのフロー、ステータス遷移、報酬付与フローを確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、排他制御、トランザクション処理を確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、エラーコード、ビジネスロジック詳細を確認：
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
- **トランザクション**: 報酬付与時は必須（child_quests, reward_history, children更新）
- **排他制御**: 完了報告、承認、却下処理でFOR UPDATE使用
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- **子供のみ**: 完了報告、報告キャンセル（本人確認必須）
- **親のみ**: 承認、却下（parent_id一致確認）
- **子供または親**: 一覧取得、詳細取得

### ステータス遷移ルール
- `not_started` → `in_progress`: 子供が開始ボタン押下
- `in_progress` → `pending_review`: 子供が完了報告
- `pending_review` → `completed`: 親が承認
- `pending_review` → `in_progress`: 親が却下または子供が報告キャンセル
- `in_progress` → `not_started`: 子供がリセット（started_at = NULL）

### タイムスタンプ管理
- `started_at`: 開始ボタン押下時に設定
- `reported_at`: 完了報告時に設定、キャンセル時に NULL
- `reviewed_at`: 承認/却下時に設定
- `completed_at`: 承認時のみ設定

### 報酬付与フロー
1. `child_quests.status` を `completed` に更新
2. `reward_history` レコード作成
3. `children.total_earned` に報酬額加算
4. `children.exp` に報酬額加算（経験値）
5. レベルアップ判定（`exp >= level * 100`）
6. 次レベル存在確認と新規 `child_quests` 作成
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


