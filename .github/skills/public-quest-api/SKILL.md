---
name: public-quest-api
description: 公開クエストAPIの構造知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。
---

# 公開クエストAPI スキル

## 概要

このスキルは、公開クエストの閲覧、いいね、コメント機能を管理するAPI群の知識を提供します。家族クエストを他家族と共有し、コミュニティでの交流を促進します。

## メインソースファイル

### API Routes
- `packages/web/app/api/quests/public/route.ts`: 一覧取得
- `packages/web/app/api/quests/public/[id]/route.ts`: 詳細取得
- `packages/web/app/api/quests/public/[id]/like/route.ts`: いいね
- `packages/web/app/api/quests/public/[id]/like/cancel/route.ts`: いいね解除
- `packages/web/app/api/quests/public/[id]/comments/route.ts`: コメント一覧、投稿
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/route.ts`: コメント編集、削除
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/upvote/route.ts`: 高評価
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/downvote/route.ts`: 低評価
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/report/route.ts`: 報告
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/pin/route.ts`: ピン留め
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/publisher-like/route.ts`: 公開者いいね
- `packages/web/app/api/quests/public/[id]/activate/route.ts`: 再公開
- `packages/web/app/api/quests/public/[id]/deactivate/route.ts`: 非公開化

### クライアント側
- `packages/web/app/api/quests/public/client.ts`: APIクライアント関数
- `packages/web/app/api/quests/public/query.ts`: React Queryフック

### データベース
- `drizzle/schema.ts`: public_quests, public_quest_likes, public_quest_comments, families, family_quests

## 主要機能グループ

### 1. 基本閲覧
- 公開クエスト一覧取得（フィルタ、ソート、検索対応）
- 公開クエスト詳細取得（いいね状態含む）

### 2. いいね機能
- いいね追加・解除
- いいね数カウンタキャッシュ
- 重複防止（1家族1いいね）

### 3. コメント機能
- コメント投稿・編集・削除（ソフトデリート）
- コメント高評価・低評価
- コメント報告（モデレーション）

### 4. 公開者専用機能
- コメントピン留め（重要コメントを最上位表示）
- 公開者いいね（特別なマーク付け）
- 公開・非公開化コントロール

## Reference Files Usage

### データベース構造を把握する場合
公開クエスト関連テーブルのER図とリレーション、インデックス戦略を確認：
```
references/er_diagram.md
```

### クエスト公開フローを理解する場合
公開から採用まで、いいね・コメント処理、モデレーションフローを確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、トランザクション、非同期処理を確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、エラーコード、権限管理、クライアント関数を確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`で公開・いいね・コメントフロー確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン
- **client.ts + route.ts**: セットで実装
- **React Query**: useQuery/useMutationでAPIアクセス
- **トランザクション**: いいね・コメント追加時のカウンタ更新は必須
- **排他制御**: いいね重複防止にFOR UPDATE使用
- **ソフトデリート**: コメント削除はdeleted_at設定
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- **全家族**: 一覧取得、詳細取得、いいね、コメント投稿・編集（本人のみ）・高評価・低評価・報告
- **公開者のみ**: コメントピン留め、公開者いいね、非公開化・再公開、コメント削除（全コメント）
- **管理者**: すべての操作

### カウンタキャッシュ
- **likes_count**: いいね追加時に+1、解除時に-1
- **comments_count**: コメント投稿時に+1、削除時に-1
- **GREATEST(count - 1, 0)**: マイナス値を防止

### モデレーション
- **is_reported**: 報告されたコメントは管理者レビュー対象
- **is_pinned**: ピン留めコメントは一覧最上位表示
- **publisher_liked**: 公開者いいねマーク付き表示
- **deleted_at**: ソフトデリートで履歴保持
