(2026年3月15日 14:30記載)

# スクリプト使用ガイド

## 概要

test-data-generatorスキルは、Pythonスクリプトを使用してSupabaseデータベースに整合性のあるテストデータを生成する。

## スクリプトテンプレート

### テンプレートファイル

**パス**: `.github/skills/test-data-generator/assets/template_script.py`

**内容**:
- Supabase接続設定
- 既存データ取得ロジック
- テストデータ生成ロジック
- SQL生成とトランザクション管理
- エラーハンドリング

**使用方法**:
```bash
# テンプレートをコピー
cp .github/skills/test-data-generator/assets/template_script.py packages/web/tmp/test-data-{date}/generate_data.py

# スクリプトを編集して実行
cd packages/web/tmp/test-data-{date}
python3 generate_data.py
```

## スクリプトの基本構造

### 1. 環境設定とインポート

```python
import os
from supabase import create_client, Client
from faker import Faker
from datetime import datetime, timedelta
import uuid

# 環境変数から接続情報を取得
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

# Supabaseクライアント初期化
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fakerインスタンス（日本語）
fake = Faker('ja_JP')
```

**ポイント**:
- 環境変数から接続情報を取得（`.env.local`に記載）
- Faker で仮データ生成（日本語対応）
- supabase-py ライブラリ使用

### 2. 既存データ取得

```python
def fetch_existing_data():
    """既存の家族情報やユーザー情報を取得"""
    # 家族情報取得
    families = supabase.table('families').select('*').execute()
    
    # 親ユーザー取得
    parents = supabase.table('profiles').select('*').eq('user_type', 'parent').execute()
    
    # 子供ユーザー取得
    children = supabase.table('profiles').select('*').eq('user_type', 'child').execute()
    
    return {
        'families': families.data,
        'parents': parents.data,
        'children': children.data
    }
```

**ポイント**:
- SELECT文で必要な既存データを取得
- テストデータと整合性を保つ
- 外部キー制約を満たすIDを利用

### 3. テストデータ生成ロジック

```python
def generate_quest_data(family_id: str, parent_id: str, count: int):
    """家族クエストのテストデータを生成"""
    quests = []
    
    for i in range(count):
        quest_id = str(uuid.uuid4())
        quest = {
            'id': quest_id,
            'family_id': family_id,
            'created_by': parent_id,
            'title': fake.sentence(),
            'description': fake.text(),
            'reward_coins': fake.random_int(min=10, max=100),
            'reward_exp': fake.random_int(min=5, max=50),
            'status': 'active',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        quests.append(quest)
    
    return quests
```

**ポイント**:
- Fakerで自然な仮データ生成
- UUIDで一意なID生成
- Enum型の値を正しく使用
- 外部キー制約を満たすデータ

### 4. データ投入

```python
def insert_data(table_name: str, data: list):
    """データを指定テーブルに投入"""
    try:
        result = supabase.table(table_name).insert(data).execute()
        print(f"✓ {table_name} に {len(data)} 件のデータを投入しました")
        return result
    except Exception as e:
        print(f"✗ {table_name} へのデータ投入に失敗: {e}")
        raise
```

**ポイント**:
- エラーハンドリング
- 成功/失敗のログ出力
- トランザクション境界の明示

### 5. メイン実行ロジック

```python
def main():
    print("テストデータ生成開始...")
    
    # 既存データ取得
    existing = fetch_existing_data()
    
    if not existing['families']:
        print("エラー: 家族データが存在しません")
        return
    
    # 各家族に対してテストデータ生成
    for family in existing['families']:
        print(f"\n家族: {family['name']}")
        
        # 親ユーザーを取得
        parent = next((p for p in existing['parents'] if p['family_id'] == family['id']), None)
        if not parent:
            print(f"  警告: 親ユーザーが見つかりません")
            continue
        
        # クエストデータ生成
        quests = generate_quest_data(family['id'], parent['id'], count=10)
        insert_data('family_quests', quests)
    
    print("\n✓ テストデータ生成完了!")

if __name__ == "__main__":
    main()
```

**ポイント**:
- 段階的なデータ生成
- エラーチェック
- 完了メッセージ

## 実行環境の準備

### 1. ディレクトリ作成

```bash
mkdir -p packages/web/tmp/test-data-$(date +%Y%m%d)
cd packages/web/tmp/test-data-$(date +%Y%m%d)
```

### 2. 環境変数ファイル作成

`.env.local` ファイル（Gitにコミットしない）:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**取得方法**:
1. Supabaseダッシュボードにログイン
2. プロジェクト設定 > API
3. URLとanon keyをコピー

### 3. 依存パッケージインストール

```bash
pip install supabase faker python-dotenv
```

または `requirements.txt` を作成:
```txt
supabase>=2.0.0
faker>=20.0.0
python-dotenv>=1.0.0
```

```bash
pip install -r requirements.txt
```

### 4. スクリプト実行

```bash
python3 generate_data.py
```

## よく使うFakerメソッド

### 文字列生成
```python
fake.sentence()          # 短い文章
fake.text()              # 長い文章
fake.word()              # 単語
fake.name()              # 人名
```

### 数値生成
```python
fake.random_int(min=1, max=100)     # ランダム整数
fake.random_digit()                 # 0-9の数字
fake.pyfloat(min_value=0, max_value=100)  # 浮動小数点
```

### 日時生成
```python
fake.date_time_between(start_date='-30d', end_date='now')  # 過去30日間のランダム日時
fake.date_between(start_date='-1y', end_date='today')      # 過去1年間のランダム日付
fake.future_datetime(end_date='+30d')                      # 未来30日間のランダム日時
```

### UUID生成
```python
import uuid
str(uuid.uuid4())        # UUID v4 文字列
```

### Enum値の選択
```python
import random

# 固定リストからランダムに選択
status = random.choice(['active', 'completed', 'cancelled'])
quest_type = random.choice(['template', 'public', 'family'])
user_type = random.choice(['parent', 'child'])
```

## ベストプラクティス

### データ整合性
1. **外部キー制約を守る**: 親レコードが存在することを確認
2. **Enum値を正しく使う**: schema.tsで定義された値のみ使用
3. **必須カラムを埋める**: NOT NULL制約のあるカラムは必ず値を設定

### エラーハンドリング
1. **try-exceptで囲む**: データ投入処理は例外処理
2. **エラーログ出力**: 失敗時は詳細なエラーメッセージ
3. **ロールバック**: トランザクション失敗時は全体をロールバック

### パフォーマンス
1. **バッチ挿入**: 1件ずつではなく配列でまとめて挿入
2. **適切な件数**: 大量データは分割して投入
3. **インデックス考慮**: 検索に使うカラムにインデックスがあるか確認

### セキュリティ
1. **環境変数使用**: 接続情報はコードに直接書かない
2. **tmp配下に配置**: 機密情報を含むスクリプトはGit管理外
3. **.gitignore確認**: `.env.local` が無視されているか確認

## トラブルシューティング

### エラー: 外部キー制約違反
**原因**: 存在しない親レコードのIDを参照
**解決**: 既存データを取得し、有効なIDを使用

### エラー: Enum型の値が不正
**原因**: schema.tsで定義されていない値を使用
**解決**: `references/schema_guide.md` でEnum定義を確認

### エラー: 接続失敗
**原因**: 環境変数が正しく設定されていない
**解決**: `.env.local` のURLとキーを確認

### エラー: パッケージが見つからない
**原因**: 必要なライブラリがインストールされていない
**解決**: `pip install supabase faker python-dotenv`

## README.mdテンプレート

スクリプトと一緒に`README.md`を作成：

```markdown
# テストデータ生成スクリプト

## 概要
{どのようなテストデータを生成するか}

## 前提条件
- Python 3.8以上
- Supabaseプロジェクトへのアクセス権限
- 既存データ: {必要な既存データ}

## セットアップ

### 1. 環境変数設定
`.env.local` ファイルを作成：
```env
SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-key
```

### 2. 依存パッケージインストール
```bash
pip install -r requirements.txt
```

## 実行

```bash
python3 generate_data.py
```

## 生成されるデータ
- {テーブル1}: {件数} 件
- {テーブル2}: {件数} 件
...

## 注意事項
- {重要な注意事項}
```
