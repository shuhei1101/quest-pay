---
name: child-reward-api
description: 子供個別の報酬API操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作、共通化戦略を含む。
---

# 子供個別の報酬API スキル

## 概要

このスキルは、各子供に対して独自の報酬テーブルのCRUD操作を行うAPI群の知識を提供します。家族全体の報酬APIと多くのコードを共有し、効率的な実装を実現しています。

## メインソースファイル

### API Routes
- `packages/web/app/api/children/[id]/reward/by-age/table/route.ts`: 年齢別報酬テーブル取得/更新
- `packages/web/app/api/children/[id]/reward/by-level/table/route.ts`: レベル別報酬テーブル取得/更新

### クライアント側
- `packages/web/app/api/children/[id]/reward/by-age/table/client.ts`: 年齢別報酬テーブルAPIクライアント
- `packages/web/app/api/children/[id]/reward/by-age/table/query.ts`: 年齢別報酬テーブルReact Queryフック
- `packages/web/app/api/children/[id]/reward/by-level/table/client.ts`: レベル別報酬テーブルAPIクライアント
- `packages/web/app/api/children/[id]/reward/by-level/table/query.ts`: レベル別報酬テーブルReact Queryフック

### 共通モジュール
- `packages/web/app/api/reward/by-age/query.ts`: 年齢別報酬共通クエリ（type="child"|"family"対応）
- `packages/web/app/api/reward/by-age/db.ts`: 年齢別報酬共通DB操作（type="child"|"family"対応）
- `packages/web/app/api/reward/by-age/service.ts`: 年齢別報酬共通サービス（type="child"|"family"対応）
- `packages/web/app/api/reward/by-level/query.ts`: レベル別報酬共通クエリ（type="child"|"family"対応）
- `packages/web/app/api/reward/by-level/db.ts`: レベル別報酬共通DB操作（type="child"|"family"対応）
- `packages/web/app/api/reward/by-level/service.ts`: レベル別報酬共通サービス（type="child"|"family"対応）

### データベース
- `drizzle/schema.ts`: child_age_reward_tables, child_level_reward_tables, reward_by_ages, reward_by_levels

## 主要機能グループ

### 1. 年齢別報酬設定
- テーブル取得（自動作成）、更新
- 年齢5-22歳の報酬カスタマイズ

### 2. レベル別報酬設定
- テーブル取得（自動作成）、更新
- レベル1-12の報酬カスタマイズ

### 3. 共通化戦略
- `type`パラメータによる家族/子供の統一処理
- DB操作、クエリ、サービス層の共通化

### 4. 報酬計算システム
- 子供個別設定 → 家族デフォルト設定 → システムデフォルトの優先順位
- クエスト完了時の動的報酬倍率適用

## Reference Files Usage

### データベース構造を把握する場合
子供報酬設定関連テーブルのER図と主要リレーションを確認：
```
references/er_diagram.md
```

### 報酬設定ライフサイクルを理解する場合
報酬設定から計算までのフロー、優先順位を確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、共通化パターンを確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、エラーコード、バリデーションルールを確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`で報酬計算フロー確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン
- **client.ts + route.ts**: セットで実装
- **React Query**: useQuery/useMutationでAPIアクセス
- **トランザクション**: 複数報酬更新時は必須
- **共通化**: type="child"|"family"パラメータで統一処理
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- **親のみ**: 報酬テーブルの取得・更新
- **システム**: 報酬計算（クエスト完了時自動実行）

### 共通化戦略
- `/api/reward/`配下の共通モジュールを活用
- `type`パラメータで家族/子供を区別
- 子供専用ロジックは子供APIディレクトリに配置

### 報酬計算の優先順位
1. 子供個別設定（`child_age_reward_tables` / `child_level_reward_tables`）
2. 家族デフォルト設定（`family_age_reward_tables` / `family_level_reward_tables`）
3. システムデフォルト（コード内定義）

### デフォルト値
- 年齢別: 5歳～22歳まで18段階、初期値0円
- レベル別: レベル1～12まで12段階、初期値0円

### typeパラメータ
- 共通関数を呼び出す際は必ず`type: "child"`を指定
- デフォルト値は`"family"`のため、明示的な指定が必要

### バリデーション
- Zodスキーマによる厳密なバリデーション
- 年齢: 5-22
- レベル: 1-12
- 金額: 0以上

## 関連スキル

- `child-reward-structure`: 子供個別の報酬設定画面の構造知識
- `reward-api`: 家族全体の報酬API操作の知識（共通関数の詳細）
- `database-operations`: データベース操作のベストプラクティス
- `child-management-api`: 子供管理API操作の知識
