---
name: template-quest-api
description: テンプレートクエストAPIの構造知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。
---

# テンプレートクエストAPI スキル

## 概要

このスキルは、システムが提供するクエストテンプレートの閲覧機能を管理するAPI群の知識を提供します。テンプレートは読み取り専用で、親が閲覧・採用して家族クエストとして登録できます。

## メインソースファイル

### API Routes
- `packages/web/app/api/quests/template/route.ts`: 一覧取得
- `packages/web/app/api/quests/template/[id]/route.ts`: 詳細取得

### クライアント側
- `packages/web/app/api/quests/template/client.ts`: APIクライアント関数
- `packages/web/app/api/quests/template/query.ts`: React Queryフック

### データベース
- `drizzle/schema.ts`: template_quests, template_quest_details

## 主要機能

### 1. テンプレート閲覧
- 一覧取得（フィルターオプション付き）
- 詳細取得（レベル別報酬情報含む）
- カテゴリー・難易度・タグによる検索

### 2. レベル対応
- 各テンプレートはレベル1-10の詳細情報を保持
- 子供のレベルに応じた推奨報酬額と経験値を提供

### 3. 採用機能連携
- テンプレートから family_quests への変換
- 採用機能は family-quest-api で実装

## Reference Files Usage

### データベース構造を把握する場合
テンプレート関連テーブルのER図とリレーションを確認：
```
references/er_diagram.md
```

### テンプレート利用フローを理解する場合
閲覧から採用までのフロー、権限管理を確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、データ取得方法を確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、フィルターオプション、エラーコードを確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`で利用フロー確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル構造確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン
- **client.ts + route.ts**: セットで実装
- **React Query**: useQueryでAPIアクセス（読み取り専用）
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- **親のみ**: テンプレート閲覧、採用
- **子供**: アクセス不可

### キャッシュ戦略
- テンプレートは更新頻度が低いため、staleTimeを長めに設定推奨（30分程度）

### 採用機能
- 採用処理は `family-quest-api` スキル参照
- テンプレートIDを指定して family_quests を作成
