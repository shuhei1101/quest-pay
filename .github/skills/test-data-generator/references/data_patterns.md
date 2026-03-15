(2026年3月記載)

# データパターン

## 概要

テストデータ生成における典型的なデータパターンと生成戦略を定義する。

## データパターンの分類

### パターン1: マスターデータ

**特徴**:
- 比較的件数が少ない
- 他のデータから参照される
- 変更頻度が低い

**対象テーブル**:
- `families`: 家族
- `profiles`: ユーザープロフィール
- `rewards`: 報酬設定

**生成戦略**:
1. 既存データをチェック
2. 不足していれば追加
3. 件数は5-20件程度

**生成例** (families):
```python
def generate_families(count: int):
    families = []
    for i in range(count):
        family = {
            'id': str(uuid.uuid4()),
            'name': fake.company(),  # 「〇〇家」として使用
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        families.append(family)
    return families
```

### パターン2: トランザクションデータ

**特徴**:
- 件数が多い（数十〜数百件）
- マスターデータに紐づく
- 時系列データ

**対象テーブル**:
- `family_quests`: 家族クエスト
- `child_quests`: 子供クエスト
- `reward_history`: 報酬履歴

**生成戦略**:
1. マスターデータから親レコードを取得
2. 各親レコードに対して複数の子レコードを生成
3. 時系列を考慮（過去から現在）

**生成例** (family_quests):
```python
def generate_family_quests(family_id: str, parent_id: str, count: int):
    quests = []
    base_date = datetime.now() - timedelta(days=90)  # 90日前から
    
    for i in range(count):
        # 徐々に日付を進める
        created_at = base_date + timedelta(days=i)
        
        quest = {
            'id': str(uuid.uuid4()),
            'family_id': family_id,
            'created_by': parent_id,
            'title': fake.sentence(),
            'description': fake.text(max_nb_chars=200),
            'reward_coins': fake.random_int(min=10, max=100),
            'reward_exp': fake.random_int(min=5, max=50),
            'difficulty': random.choice(['easy', 'normal', 'hard']),
            'status': random.choice(['active', 'completed', 'cancelled']),
            'created_at': created_at.isoformat(),
            'updated_at': created_at.isoformat()
        }
        quests.append(quest)
    
    return quests
```

### パターン3: 関連データ

**特徴**:
- 親子関係が明確
- 親レコードに対して0-N件
- 親レコードの状態に依存

**対象テーブル**:
- `child_quests`: 家族クエストに対する子供クエスト
- `quest_comments`: クエストに対するコメント
- `quest_likes`: クエストに対するいいね

**生成戦略**:
1. 親レコードを取得
2. 各親に対してランダムな数の子レコードを生成
3. 親の状態に応じて子の状態を決定

**生成例** (child_quests):
```python
def generate_child_quests(quest_id: str, children: list):
    """1つの家族クエストに対して複数の子供クエストを生成"""
    child_quests = []
    
    # ランダムに子供を選択（全員とは限らない）
    selected_children = random.sample(children, k=random.randint(1, len(children)))
    
    for child in selected_children:
        status = random.choice([
            'not_started',
            'in_progress',
            'pending_review',
            'completed'
        ])
        
        child_quest = {
            'id': str(uuid.uuid4()),
            'family_quest_id': quest_id,
            'child_id': child['id'],
            'status': status,
            'started_at': datetime.now().isoformat() if status != 'not_started' else None,
            'completed_at': datetime.now().isoformat() if status == 'completed' else None,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        child_quests.append(child_quest)
    
    return child_quests
```

### パターン4: 履歴データ

**特徴**:
- 時系列で蓄積
- 更新・削除されない
- 統計・分析に使用

**対象テーブル**:
- `reward_history`: 報酬履歴
- `notification_history`: 通知履歴
- `coin_transactions`: コイン取引履歴

**生成戦略**:
1. 時系列順にデータを生成
2. 累積値を計算（コイン残高など）
3. 一貫性を保つ（前後関係）

**生成例** (reward_history):
```python
def generate_reward_history(child_id: str, count: int):
    """報酬履歴を時系列で生成"""
    histories = []
    base_date = datetime.now() - timedelta(days=180)  # 180日前から
    cumulative_coins = 0
    
    for i in range(count):
        created_at = base_date + timedelta(days=i * 2)  # 2日おき
        coins = fake.random_int(min=10, max=50)
        cumulative_coins += coins
        
        history = {
            'id': str(uuid.uuid4()),
            'child_id': child_id,
            'reward_type': random.choice(['quest', 'age_monthly', 'level_monthly']),
            'amount_coins': coins,
            'amount_exp': fake.random_int(min=5, max=25),
            'total_coins': cumulative_coins,  # 累積残高
            'description': fake.sentence(),
            'created_at': created_at.isoformat()
        }
        histories.append(history)
    
    return histories
```

### パターン5: 多対多関連

**特徴**:
- 中間テーブル
- 2つのエンティティを関連付ける
- 重複を避ける必要がある

**対象テーブル**:
- （現時点では該当なし、将来追加予定）

**生成戦略**:
1. 両側のエンティティを取得
2. ランダムにペアを作成
3. 重複チェック

## ステータス遷移パターン

### パターン1: 単純な進行

**ステータス**: A → B → C

**例**: 子供クエストのステータス遷移
- `not_started` → `in_progress` → `pending_review` → `completed`

**生成方法**:
```python
def generate_progressive_status(base_date: datetime):
    """時系列に沿って段階的にステータスを進める"""
    days_ago = (datetime.now() - base_date).days
    
    if days_ago > 20:
        return 'completed'
    elif days_ago > 10:
        return random.choice(['pending_review', 'completed'])
    elif days_ago > 5:
        return random.choice(['in_progress', 'pending_review'])
    else:
        return random.choice(['not_started', 'in_progress'])
```

### パターン2: 分岐あり

**ステータス**: A → B → (C or D)

**例**: 報告後の承認/却下
- `pending_review` → `completed` (承認)
- `pending_review` → `in_progress` (却下)

**生成方法**:
```python
def generate_branching_status():
    """分岐を含むステータス生成"""
    status = random.choice(['not_started', 'in_progress', 'pending_review', 'completed'])
    
    if status == 'pending_review':
        # 80%で承認、20%で却下（再作業）
        if random.random() < 0.8:
            return 'completed'
        else:
            return 'in_progress'
    
    return status
```

### パターン3: 循環あり

**ステータス**: A → B → C → (back to B)

**例**: クエストの再オープン
- `completed` → `active` (再度実施可能)

**生成方法**:
```python
def generate_cyclic_status():
    """循環を含むステータス生成"""
    # 基本ステータス
    status = random.choice(['active', 'completed', 'cancelled'])
    
    # 10%の確率で再オープン
    if status == 'completed' and random.random() < 0.1:
        return 'active'
    
    return status
```

## リアリティのあるデータ生成

### 日本語データの生成

```python
# Faker日本語設定
fake = Faker('ja_JP')

# 自然な日本語タイトル
titles = [
    "お部屋の掃除",
    "お風呂掃除",
    "食器洗い",
    "洗濯物を畳む",
    "ゴミ出し",
    "庭の草むしり",
    "買い物に行く",
    "宿題を終わらせる"
]

title = random.choice(titles)
```

### 現実的な数値範囲

```python
# コイン報酬: 10-100（10刻み）
reward_coins = random.choice(range(10, 110, 10))

# 経験値: コインの半分程度
reward_exp = reward_coins // 2

# タスク時間: 5-60分（5分刻み）
estimated_minutes = random.choice(range(5, 65, 5))
```

### 時刻の考慮

```python
def generate_realistic_time():
    """現実的な時刻を生成（深夜を避ける）"""
    base_date = fake.date_time_between(start_date='-30d', end_date='now')
    
    # 8:00-22:00の間に調整
    hour = random.randint(8, 22)
    minute = random.randint(0, 59)
    
    return base_date.replace(hour=hour, minute=minute)
```

## データ整合性の保証

### 外部キー制約

```python
def ensure_foreign_key(parent_table: str, parent_id_column: str):
    """外部キー制約を満たすIDを取得"""
    result = supabase.table(parent_table).select(parent_id_column).execute()
    
    if not result.data:
        raise ValueError(f"{parent_table} にデータが存在しません")
    
    return random.choice(result.data)[parent_id_column]
```

### ユニーク制約

```python
def generate_unique_value(table: str, column: str, generator_func):
    """ユニーク制約を満たす値を生成"""
    max_attempts = 100
    
    for _ in range(max_attempts):
        value = generator_func()
        
        # 既存チェック
        result = supabase.table(table).select(column).eq(column, value).execute()
        
        if not result.data:
            return value
    
    raise ValueError(f"{table}.{column} のユニーク値生成に失敗")
```

### NOT NULL制約

```python
def generate_with_required_fields(schema: dict):
    """必須フィールドを確実に埋める"""
    data = {}
    
    for field, config in schema.items():
        if config.get('required', False):
            # 必須フィールドは必ず値を設定
            data[field] = config['generator']()
        else:
            # オプショナルフィールドは80%の確率で設定
            if random.random() < 0.8:
                data[field] = config['generator']()
            else:
                data[field] = None
    
    return data
```

## ベストプラクティス

### データ量の設計
1. **マスターデータ**: 5-20件
2. **トランザクションデータ**: 50-200件
3. **関連データ**: 親1件あたり1-10件
4. **履歴データ**: 子1件あたり10-100件

### リアリティの追求
1. **適切なFaker使用**: 日本語対応、自然な値
2. **時系列の一貫性**: 過去から現在への流れ
3. **現実的な数値範囲**: 極端な値を避ける
4. **ステータス遷移**: 論理的な状態変化

### パフォーマンス
1. **バッチ処理**: 配列でまとめて挿入
2. **適切な件数**: 一度に1000件以下
3. **トランザクション**: 関連データは同一トランザクション

### 保守性
1. **パターン化**: 共通処理を関数化
2. **設定分離**: 件数などは変数で管理
3. **ドキュメント**: 生成ロジックをコメント
