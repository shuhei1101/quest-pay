---
name: home-api
description: ホーム画面API操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。
---

# ホームAPI スキル

## 概要

このスキルは、ホームダッシュボードのデータ集約、統計情報取得、最近のアクティビティ表示を管理するAPI知識を提供します。親と子供で異なるダッシュボードビューを提供します。

## メインソースファイル

### API Routes
- `packages/web/app/api/home/dashboard/route.ts`: ダッシュボードデータ取得

### クライアント側
- `packages/web/app/api/home/client.ts`: APIクライアント関数
- `packages/web/app/api/home/query.ts`: React Queryフック

### データベース
- `drizzle/schema.ts`: families, children, child_quests, family_quests, notifications, timeline_posts

## 主要機能グループ

### 1. 親ダッシュボード
- 家族全体の統計情報（子供数、進行中クエスト数、完了待ち数、未読通知数）
- 子供別サマリー（獲得報酬、レベル、経験値）
- 最近のクエスト（上位5件）
- 通知一覧（上位10件）
- タイムライン（上位10件）

### 2. 子供ダッシュボード
- 個人統計情報（累計獲得報酬、貯金額、レベル、経験値）
- クエスト状況（進行中、完了待ち、完了済み数）
- 進行中クエスト一覧（上位5件）
- 完了待ちクエスト一覧
- 自分宛て通知（上位10件）

### 3. データ集約
- 複数テーブルからの並列データ取得
- 統計情報の集約計算
- キャッシュによる高速化

## Reference Files Usage

### データベース構造を把握する場合
ホームダッシュボード関連テーブルのER図と集約対象を確認：
```
references/er_diagram.md
```

### データ集約フローを理解する場合
親/子供別のダッシュボードデータ取得フロー、並列処理を確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
エンドポイントの処理シーケンス、キャッシュ戦略、エラーハンドリングを確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、集約クエリ、パフォーマンス最適化を確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でデータ集約フロー確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン
- **client.ts + route.ts**: セットで実装
- **React Query**: useQueryでダッシュボードデータ取得
- **並列データ取得**: Promise.all()で独立クエリを並列実行
- **キャッシュ**: 5分間のTTLでDB負荷軽減
- **Logger**: すべてのAPI処理でlogger使用

### パフォーマンス最適化
- **インデックス活用**: child_id, status, updated_at の複合インデックス
- **結果セット制限**: LIMIT句で必要最小限のデータ取得
- **キャッシュ無効化**: クエストステータス変更時に自動無効化
- **コネクションプール**: DB接続の再利用

### 権限管理
- **親**: 自分の家族のデータのみアクセス可能
- **子供**: 自分のデータのみアクセス可能
- **認証**: すべてのエンドポイントでauthGuard必須
Files not intended to be loaded into context, but rather used within the output Claude produces.

**Examples from other skills:**
- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


