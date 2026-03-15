---
name: quest-view-api
description: クエスト閲覧画面のAPI操作知識を提供するスキル。エンドポイント、リクエスト/レスポンス、フック、DB操作を含む。
---

# クエストビューAPI スキル

## 概要

このスキルは、異なるクエストタイプ（家族、公開、テンプレート、子供）の閲覧ビューを統合的に管理するAPI群の知識を提供します。各タイプのクエストに対する統一的なインターフェースと、タイプ固有の追加情報（いいね、ステータス等）を提供します。

## メインソースファイル

### API Routes（家族クエスト）
- `packages/web/app/api/quests/family/[id]/route.ts`: 詳細取得、更新、削除
- `packages/web/app/api/quests/family/[id]/child/[childId]/route.ts`: 子供クエスト取得/生成

### API Routes（公開クエスト）
- `packages/web/app/api/quests/public/[id]/route.ts`: 詳細取得、更新、削除
- `packages/web/app/api/quests/public/[id]/like/route.ts`: いいね追加、解除
- `packages/web/app/api/quests/public/[id]/like-count/route.ts`: いいね数取得
- `packages/web/app/api/quests/public/[id]/is-like/route.ts`: いいね状態取得

### API Routes（テンプレートクエスト）
- `packages/web/app/api/quests/template/[id]/route.ts`: 詳細取得、更新、削除

### クライアント側
- `packages/web/app/api/quests/family/[id]/client.ts`: 家族クエストAPIクライアント関数
- `packages/web/app/api/quests/public/[id]/client.ts`: 公開クエストAPIクライアント関数
- `packages/web/app/api/quests/template/[id]/client.ts`: テンプレートクエストAPIクライアント関数
- `packages/web/app/api/quests/family/[id]/query.ts`: React Queryフック

### データベース
- `drizzle/schema.ts`: family_quests, public_quests, template_quests, child_quests

## 主要機能グループ

### 1. 統合クエストビュー
- 4つの異なるクエストタイプに対する統一的な閲覧インターフェース
- 共通フォーマット: base, quest, details, icon, category, tags

### 2. タイプ別追加機能
- **公開クエスト**: いいね機能、コメント表示、家族情報
- **子供クエスト**: ステータス情報、進捗管理
- **テンプレート**: 公式フラグ
- **家族クエスト**: 基本情報のみ

### 3. CRUD操作
- 詳細取得、更新、削除（権限に応じて）
- 楽観的排他制御による更新競合対策

### 4. インタラクション機能
- 公開クエストのいいね/いいね解除
- いいね数・状態のリアルタイム取得

## Reference Files Usage

### データベース構造を把握する場合
クエストタイプ横断のER図、共通フィールド構造を確認：
```
references/er_diagram.md
```

### クエストビュー解決フローを理解する場合
タイプ検出、データ取得、変換パイプラインを確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各タイプのエンドポイント処理シーケンス、並列データ取得を確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、エラーコード、クライアント関数、フックを確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/er_diagram.md`でクエストタイプ統合の概念確認
2. **フロー理解**: `references/flow_diagram.md`でタイプ検出・変換フロー確認
3. **実装時**: `references/api_endpoints.md`で各タイプの詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理シーケンス確認

## 実装上の注意点

### 必須パターン
- **client.ts + route.ts**: セットで実装
- **React Query**: useQuery/useMutationでAPIアクセス
- **統一レスポンス形式**: 各タイプで共通フィールド構造を維持
- **楽観的排他制御**: 更新・削除時にupdatedAtチェック
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- **家族クエスト**: 家族メンバー閲覧可、親のみ更新・削除
- **公開クエスト**: 全員閲覧可、投稿元のみ更新・削除、ログインユーザーのみいいね可
- **テンプレート**: 全ユーザー閲覧可、管理者のみ更新・削除
- **子供クエスト**: 本人または親のみ閲覧可

### クエストタイプ別の特性
- **家族クエスト**: 家族内共有、レベルシステム
- **公開クエスト**: ソーシャル機能（いいね、コメント）、家族情報表示
- **テンプレート**: 公式クエスト、is_officialフラグ
- **子供クエスト**: ステータス遷移、進捗管理、自動生成機能
