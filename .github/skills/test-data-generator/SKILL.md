---
name: test-data-generator
description: 'Supabaseデータベースにテストデータを生成するスキル。schema.tsを熟知し、Pythonスクリプトでテストデータを作成・投入する。大量のテストデータが必要な時に使用する。'
---

# Test Data Generator

## 概要

このスキルは、お小遣いクエストボードプロジェクトのSupabaseデータベースにテストデータを生成する。schema.tsの全テーブル構造を理解し、リレーションを保ちながら整合性のあるテストデータを作成する。

## メインファイル

### テンプレート
- `assets/template_script.py`: テストデータ生成スクリプトのテンプレート
- `assets/template_readme.md`: README.mdテンプレート

### スキーマ参照
- `drizzle/schema.ts`: すべてのテーブル定義、Enum型、リレーション

### 出力先
- `packages/web/tmp/test-data-{date}/`: スクリプト配置先（Git管理外）

## 主要機能グループ

### 1. 要件ヒアリング
データ種類、件数、既存データ利用の確認

### 2. スクリプト作成
template_script.pyをベースに、Supabase接続、データ生成ロジック、SQL生成を実装

### 3. データ投入
Pythonスクリプトでデータベースに一括投入

### 4. 整合性保証
外部キー制約、Enum値、リレーションの整合性を確保

## Reference Files Usage

### スクリプトの使用方法を確認する場合
テンプレート構造、環境設定、実行方法、Fakerメソッドを確認：
```
references/script_usage.md
```

### データパターンを理解する場合
マスターデータ、トランザクションデータ、関連データ、履歴データの生成パターンを確認：
```
references/data_patterns.md
```

### スキーマ統合方法を把握する場合
schema.tsの読み方、Enum対応、リレーション解決、依存関係の扱いを確認：
```
references/schema_integration.md
```

### Enum定義を確認する場合
すべてのEnum型の定義と使用方法を確認：
```
references/schema_guide.md
```

## クイックスタート

1. **要件確認**: どのようなテストデータが必要か確認
2. **スクリプト作成**: template_script.pyをベースに作成
3. **環境設定**: .env.localでSupabase接続情報を設定
4. **実行**: `python3 generate_data.py`

## 実装上の注意点

### データ整合性
- **外部キー制約**: 親レコードが存在することを確認
- **Enum値**: schema.tsで定義された値のみ使用
- **必須カラム**: NOT NULL制約のあるカラムは必ず値を設定

### リレーション管理
- **依存順序**: 親→子の順でデータ投入
- **トランザクション**: 関連データは同一トランザクションで処理
- **外部キーチェック**: 存在確認を必ず実施

### スクリプト配置
- **tmp配下**: 機密情報を含むためGit管理外に配置
- **.env.local**: 接続情報はコードに直接書かない
- **README.md**: 実行手順を必ず記載

### パフォーマンス
- **バッチ挿入**: 配列でまとめて投入（1件ずつは避ける）
- **適切な件数**: 一度に1000件以下
- **インデックス考慮**: 大量データ投入後はインデックスを確認

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## 使用例

### 例1: 家族クエスト100件
既存の家族情報を利用し、各家族に対してクエストを生成

### 例2: 子供プロフィール50件と報酬履歴
新規子供ユーザーを作成し、関連する報酬履歴を時系列で生成

### 例3: 公開クエスト20件とコメント・いいね
公開クエストとその関連データ（コメント、いいね）を一括生成
3. questsテーブル、family_questsテーブル、quest_detailsテーブルにINSERT
4. カテゴリ、アイコンはランダムに既存データから選択

### 例2: 子供プロフィールと報酬履歴

**ユーザーリクエスト**: 「子供プロフィール50件と、各子供に報酬履歴を10件ずつ作成して」

**実装内容**:
1. 既存の家族情報をSELECT
2. 各家族に子供プロフィールを作成（profiles、children）
3. 各子供に報酬履歴を10件ずつ作成（reward_histories）
4. 報酬タイプ、金額、経験値はランダム

### 例3: 公開クエストとコメント

**ユーザーリクエスト**: 「公開クエスト20件と、各クエストにコメント5件、いいね10件」

**実装内容**:
1. 既存の家族クエストから20件をSELECT（または新規作成）
2. public_questsテーブルにINSERT
3. 各公開クエストにpublic_quest_commentsを5件
4. commentLikesやcommentUpvotesなども適宜作成

## データ生成のベストプラクティス

### リレーションの保持

- 外部キー制約を満たすデータを生成
- 参照先テーブルのIDは必ず既存データから取得
- CASCADE削除を考慮したデータ構造

### Enum型の正しい使用

```python
# schema.tsから抽出したEnum値
USER_TYPES = ["parent", "child"]
QUEST_TYPES = ["template", "public", "family"]
CHILD_QUEST_STATUS = ["not_started", "in_progress", "pending_review", "completed"]
NOTIFICATION_TYPES = ["family_quest_review", "quest_report_rejected", ...]
REWARD_TYPES = ["quest", "age_monthly", "level_monthly", "other"]
```

### タイムスタンプの生成

```python
from datetime import datetime, timedelta
import random

# 過去1年以内のランダムな日時
def random_past_datetime():
    days_ago = random.randint(0, 365)
    return datetime.now() - timedelta(days=days_ago)
```

### UUID生成

```python
import uuid

# PostgreSQLのgen_random_uuid()相当
test_id = str(uuid.uuid4())
```

## Resources

### scripts/

このスキルには実行可能なスクリプトは含まれない。代わりに、ユーザーの要件に応じて`packages/web/tmp/`配下にスクリプトを生成する。

### references/

**スキーマ情報は常に最新のschema.tsを直接参照すること：**
```
read_file: drizzle/schema.ts
```

または、特定の範囲を読み込む：
```
read_file: drizzle/schema.ts (lines 1-100)
read_file: drizzle/schema.ts (lines 100-200)
```

### assets/

- `template_script.py`: テストデータ生成スクリプトのテンプレート
- `template_readme.md`: スクリプト実行手順テンプレート

新規スクリプト作成時にこれらをベースにする。

## 制約事項

### セキュリティ

- `.env`の接続情報は直接スクリプトに埋め込まない
- スクリプトは`packages/web/tmp/`配下に配置（Gitにコミットしない）
- 機密情報は環境変数経由でのみ利用

### データ整合性

- 外部キー制約を必ず満たすこと
- Enum型の値は`schema.ts`から正確にコピーすること
- 複合主キーを持つテーブルは重複を避けること

### パフォーマンス

- 大量データ投入時はバッチINSERTを使用
- トランザクション境界を適切に設定
- 進捗表示を追加（ユーザビリティ向上）

## 次のステップ

1. ユーザーからテストデータの要件をヒアリング
2. 必要に応じて`references/schema_guide.md`を参照
3. `assets/template_script.py`をベースにスクリプト作成
4. `packages/web/tmp/test-data-{date}/`にスクリプトを配置
5. 実行確認とユーザーへのフィードバック
