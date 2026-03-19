---
name: test-data-generator
description: 'テストデータ生成の知識を提供するスキル。Supabaseデータベースへのテストデータ投入・Pythonスクリプト作成・スキーマ整合性保証の方法を含む。'
---

# テストデータ生成 スキル

## 概要

Supabase データベースにテストデータを生成・投入するための Python スクリプト作成を支援する。`drizzle/schema.ts` の全テーブル構造を理解し、リレーション整合性を保ちながらデータを作成する。

## ファイル構成

### テンプレート
- `.github/skills/test-data-generator/assets/template_script.py`: スクリプトテンプレート
- `.github/skills/test-data-generator/assets/template_readme.md`: README テンプレート

### スキーマ参照
- `packages/web/drizzle/schema.ts`: 全テーブル定義・Enum型

### 出力先
- `packages/web/tmp/test-data-{date}/`: スクリプト配置先（Git 管理外）

## 作成ワークフロー

1. **要件確認**: 何のデータが必要か（種類・件数・既存データの利用有無）
2. **スキーマ確認**: `drizzle/schema.ts` で対象テーブルと制約を確認
3. **スクリプト作成**: `template_script.py` をベースに作成
4. **配置**: `packages/web/tmp/test-data-{YYYYMMDD}/` に配置
5. **実行**: `python3 generate_data.py`

## Enum値一覧

```python
USER_TYPES = ["parent", "child"]
QUEST_TYPES = ["template", "public", "family"]
CHILD_QUEST_STATUS = ["not_started", "in_progress", "pending_review", "completed"]
NOTIFICATION_TYPES = ["family_quest_review", "quest_report_rejected", "quest_report_approved", "quest_report_cleared", "level_up", "quest_completed"]
REWARD_TYPES = ["quest", "age_monthly", "level_monthly", "other"]
```

## スクリプト基本構造

```python
import uuid
from datetime import datetime, timedelta
import random
from supabase import create_client

# 環境変数から接続情報を取得（直接書かない）
import os
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

# UUID生成
def gen_uuid(): return str(uuid.uuid4())

# ランダムな過去日時
def random_past_datetime(days=365):
    return (datetime.now() - timedelta(days=random.randint(0, days))).isoformat()
```

## データ整合性ルール

- **挿入順序**: 親テーブル → 子テーブル（外部キー制約を満たす）
- **Enum値**: `schema.ts` の定義通りに使用
- **UUID**: `uuid.uuid4()` で生成
- **バッチ挿入**: 1度に1000件以下

## 実装上の注意点

- スクリプトは `packages/web/tmp/` に配置（Git コミットしない）
- 接続情報はコードに直接書かず環境変数から取得
- `README.md` に実行手順を記載する
- トランザクション内で関連データをまとめて投入
