---
name: test-data-generator
description: 'Supabaseデータベースにテストデータを生成するスキル。schema.tsを熟知し、Pythonスクリプトでテストデータを作成・投入する。大量のテストデータが必要な時に使用する。'
---

# Test Data Generator

## Overview

このスキルは、お小遣いクエストボードプロジェクトのSupabaseデータベースにテストデータを生成する。schema.tsの全テーブル構造を理解し、リレーションを保ちながら整合性のあるテストデータを作成する。

## ワークフロー

### ステップ1: 要件ヒアリング

ユーザーから以下の情報を聞き取る：

1. **作成するテストデータの種類**
   - 例: 「家族クエストのテストデータ100件」
   - 例: 「子供プロフィール50件と関連する報酬履歴」
   - 例: 「公開クエスト20件とコメント・いいね」

2. **必要なデータ数**
   - メインエンティティの件数
   - 関連エンティティの件数（1件あたりいくつ）

3. **既存データの利用**
   - 既存の家族情報を使うか（SELECT文で取得）
   - 既存のユーザー情報を使うか
   - 新規作成が必要なマスターデータは何か

### ステップ2: スキーマ確認

`drizzle/schema.ts`を直接参照し、対象テーブルの構造を確認：

```
read_file: drizzle/schema.ts
```

確認事項：
- 必須カラム
- 外部キー制約
- Enum型の値
- デフォルト値
- 複合主キー

### ステップ3: スクリプト作成

`assets/template_script.py`をベースに、以下を実装：

1. **Supabase接続設定**
   - `.env`から接続情報を読み込む
   - 機密情報は環境変数経由でのみ利用

2. **既存データ取得（必要に応じて）**
   - SELECT文で家族情報、ユーザー情報などを取得
   - テストデータとの整合性を保つ

3. **テストデータ生成ロジック**
   - Fakerなどのライブラリで仮データ生成
   - リレーションを保ったデータ作成
   - Enum型の値を正しく使用

4. **SQL生成**
   - INSERT文を生成
   - トランザクション境界を明示
   - エラーハンドリング

### ステップ4: スクリプト配置

スクリプトは`packages/web/tmp/`配下に配置：

```
packages/web/tmp/
└── test-data-{date}/
    ├── generate_data.py
    ├── .env.local      # 接続情報（Gitにコミットしない）
    └── README.md       # 実行手順
```

**重要**: tmp配下はGitの管理外なので、機密情報を含むスクリプトも安全

### ステップ5: 実行確認

スクリプトを実行し、テストデータが正しく投入されたか確認：

```bash
cd packages/web/tmp/test-data-{date}
python3 generate_data.py
```

## 使用例

### 例1: 家族クエスト100件

**ユーザーリクエスト**: 「家族クエストのテストデータを100件作成して」

**実装内容**:
1. 既存の家族情報をSELECT
2. 各家族に対してクエストを生成
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
