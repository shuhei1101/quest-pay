(2026年3月15日 14:30記載)

# スキーマ統合ガイド

## 概要

`drizzle/schema.ts`と統合し、テーブル構造を理解してテストデータを生成するためのガイド。

## schema.tsの構造理解

### 基本的な読み方

**テーブル定義例**:
```typescript
export const families = pgTable("families", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
})
```

**Pythonでの対応**:
```python
family = {
    'id': str(uuid.uuid4()),           # uuid().defaultRandom()
    'name': fake.company(),            # text().notNull()
    'created_at': datetime.now().isoformat(),  # timestamp().defaultNow()
    'updated_at': datetime.now().isoformat()
}
```

### カラム型の対応表

| Drizzle型 | Python型 | 生成方法 |
|-----------|----------|----------|
| `uuid()` | `str` | `str(uuid.uuid4())` |
| `text()` | `str` | `fake.text()` または固定文字列 |
| `integer()` | `int` | `fake.random_int()` |
| `boolean()` | `bool` | `True` / `False` |
| `timestamp()` | `str` | `datetime.now().isoformat()` |
| `pgEnum()` | `str` | Enum定義から選択 |

### カラム制約の理解

#### primaryKey()
```typescript
id: uuid("id").primaryKey()
```
**対応**: 重複しない一意な値を生成
```python
'id': str(uuid.uuid4())
```

#### notNull()
```typescript
name: text("name").notNull()
```
**対応**: 必ず値を設定
```python
'name': fake.company()  # Noneは不可
```

#### defaultRandom() / defaultNow()
```typescript
id: uuid("id").defaultRandom()
created_at: timestamp("created_at").defaultNow()
```
**対応**: スクリプトで明示的に設定
```python
'id': str(uuid.uuid4()),
'created_at': datetime.now().isoformat()
```

#### unique()
```typescript
email: text("email").unique()
```
**対応**: 重複チェック関数を使用
```python
def generate_unique_email():
    # 既存チェックロジック
    pass
```

## Enum型の扱い

### schema.tsでのEnum定義

```typescript
export const userType = pgEnum("user_type", ["parent", "child"])
export const questType = pgEnum("quest_type", ["template", "public", "family"])
export const childQuestStatus = pgEnum("child_quest_status", [
  "not_started",
  "in_progress",
  "pending_review",
  "completed"
])
```

### Pythonでの使用

```python
# 1. 固定リストとして定義
USER_TYPES = ["parent", "child"]
QUEST_TYPES = ["template", "public", "family"]
CHILD_QUEST_STATUSES = ["not_started", "in_progress", "pending_review", "completed"]

# 2. ランダムに選択
user_type = random.choice(USER_TYPES)
quest_type = random.choice(QUEST_TYPES)
status = random.choice(CHILD_QUEST_STATUSES)

# 3. 条件に応じた選択
if is_new_quest:
    status = "not_started"
else:
    status = random.choice(["in_progress", "pending_review", "completed"])
```

### Enum値の検証

```python
def validate_enum_value(value: str, enum_name: str, valid_values: list):
    """Enum値が有効かチェック"""
    if value not in valid_values:
        raise ValueError(f"{enum_name} の値が不正です: {value}. 有効な値: {valid_values}")
    return value

# 使用例
status = validate_enum_value(
    status,
    "child_quest_status",
    CHILD_QUEST_STATUSES
)
```

## リレーションの理解

### schema.tsでのリレーション定義

```typescript
export const familyQuestsRelations = relations(familyQuests, ({ one, many }) => ({
  family: one(families, {
    fields: [familyQuests.familyId],
    references: [families.id]
  }),
  createdBy: one(profiles, {
    fields: [familyQuests.createdBy],
    references: [profiles.id]
  }),
  childQuests: many(childQuests)
}))
```

### Pythonでの対応

```python
def generate_family_quest_with_relations(family_id: str, parent_id: str, children: list):
    """リレーションを考慮してクエストと子供クエストを生成"""
    
    # 1. 親レコード（家族クエスト）
    quest_id = str(uuid.uuid4())
    family_quest = {
        'id': quest_id,
        'family_id': family_id,      # → families.id
        'created_by': parent_id,     # → profiles.id
        'title': fake.sentence(),
        'reward_coins': 50,
        'created_at': datetime.now().isoformat()
    }
    
    # 2. 子レコード（子供クエスト）
    child_quests = []
    for child in children:
        child_quest = {
            'id': str(uuid.uuid4()),
            'family_quest_id': quest_id,  # → family_quests.id
            'child_id': child['id'],      # → profiles.id
            'status': 'not_started',
            'created_at': datetime.now().isoformat()
        }
        child_quests.append(child_quest)
    
    return family_quest, child_quests
```

### 外部キー制約のチェック

```python
def check_foreign_key_exists(table: str, column: str, value: str):
    """外部キー参照先が存在するかチェック"""
    result = supabase.table(table).select('id').eq('id', value).execute()
    
    if not result.data:
        raise ValueError(f"{table} に id={value} のレコードが存在しません")
    
    return True

# 使用例
family_id = "existing-family-id"
check_foreign_key_exists('families', 'id', family_id)

family_quest = {
    'family_id': family_id,  # 外部キー制約を満たす
    ...
}
```

## 複合主キーの扱い

### schema.tsでの定義

```typescript
export const questLikes = pgTable("quest_likes", {
  questId: uuid("quest_id").notNull(),
  userId: uuid("user_id").notNull()
}, (table) => ({
  pk: primaryKey({ columns: [table.questId, table.userId] })
}))
```

### Pythonでの対応

```python
def generate_quest_likes(quest_id: str, users: list):
    """複合主キーを持つレコードを生成"""
    likes = []
    used_pairs = set()  # 重複チェック用
    
    for user in random.sample(users, k=random.randint(1, len(users))):
        pair = (quest_id, user['id'])
        
        # 複合主キーの重複チェック
        if pair not in used_pairs:
            like = {
                'quest_id': quest_id,
                'user_id': user['id'],
                'created_at': datetime.now().isoformat()
            }
            likes.append(like)
            used_pairs.add(pair)
    
    return likes
```

## テーブル依存関係の解決

### 依存グラフの構築

```python
# テーブル依存関係（親から子へ）
TABLE_DEPENDENCIES = {
    'families': [],                          # 依存なし
    'profiles': ['families'],                # families に依存
    'family_quests': ['families', 'profiles'],  # families, profiles に依存
    'child_quests': ['family_quests', 'profiles'],  # family_quests, profiles に依存
    'reward_history': ['profiles']            # profiles に依存
}
```

### 正しい投入順序

```python
def get_insertion_order(dependencies: dict):
    """トポロジカルソートで投入順序を決定"""
    # 簡易実装（実際はトポロジカルソートアルゴリズムを使用）
    ordered = []
    remaining = set(dependencies.keys())
    
    while remaining:
        # 依存がないか、依存が全て解決済みのテーブルを選択
        ready = [
            table for table in remaining
            if all(dep in ordered for dep in dependencies[table])
        ]
        
        if not ready:
            raise ValueError("循環依存が存在します")
        
        # 投入
        for table in ready:
            ordered.append(table)
            remaining.remove(table)
    
    return ordered

# 使用例
insertion_order = get_insertion_order(TABLE_DEPENDENCIES)
# ['families', 'profiles', 'family_quests', 'reward_history', 'child_quests']

for table in insertion_order:
    print(f"投入: {table}")
    generate_and_insert_data(table)
```

## schema.tsからの自動抽出

### スキーマ情報の取得

```python
def extract_table_info_from_schema(schema_path: str):
    """schema.tsからテーブル情報を抽出（簡易版）"""
    with open(schema_path, 'r') as f:
        content = f.read()
    
    # 正規表現でテーブル定義を抽出
    import re
    
    # テーブル名の抽出
    table_pattern = r'export const (\w+) = pgTable\("(\w+)"'
    tables = re.findall(table_pattern, content)
    
    # Enum定義の抽出
    enum_pattern = r'export const (\w+) = pgEnum\("(\w+)", \[(.*?)\]\)'
    enums = re.findall(enum_pattern, content)
    
    return {
        'tables': tables,
        'enums': enums
    }

# 使用例
schema_info = extract_table_info_from_schema('drizzle/schema.ts')
print(f"テーブル数: {len(schema_info['tables'])}")
print(f"Enum数: {len(schema_info['enums'])}")
```

### 動的なデータ生成

```python
def generate_dynamic_data(table_name: str, schema_info: dict):
    """スキーマ情報に基づいて動的にデータを生成"""
    # テーブルのカラム情報を取得
    columns = get_table_columns(table_name, schema_info)
    
    data = {}
    for column in columns:
        col_type = column['type']
        
        if col_type == 'uuid':
            data[column['name']] = str(uuid.uuid4())
        elif col_type == 'text':
            data[column['name']] = fake.text(max_nb_chars=100)
        elif col_type == 'integer':
            data[column['name']] = fake.random_int(min=1, max=100)
        elif col_type == 'timestamp':
            data[column['name']] = datetime.now().isoformat()
        # ... その他の型
    
    return data
```

## ベストプラクティス

### スキーマ参照
1. **references/schema_guide.md参照**: 主要Enum定義
2. **drizzle/schema.ts直接確認**: 最新の構造
3. **定期的な同期**: schema.ts変更時はガイドも更新

### リレーション管理
1. **依存順序を守る**: 親→子の順で投入
2. **外部キーチェック**: 存在確認を実施
3. **トランザクション**: 関連データは同一トランザクション

### Enum値の扱い
1. **固定リスト定義**: スクリプト内で定義
2. **バリデーション**: 不正な値を防ぐ
3. **コメント記載**: Enum値の意味を説明

### 複合主キー
1. **重複チェック**: Setで管理
2. **一意性保証**: 投入前に確認
3. **エラーハンドリング**: 重複時の対応

### スキーマ変更への対応
1. **マイグレーション確認**: 新しいカラムに注意
2. **デフォルト値設定**: 新カラムは適切なデフォルト値
3. **後方互換性**: 既存データへの影響を考慮
