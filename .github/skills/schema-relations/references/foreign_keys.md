(2026年3月記載)

# 外部キー制約詳細

## 概要

外部キー制約は、テーブル間の参照整合性を保証し、データの整合性を維持します。

## 主要な外部キー定義

### ユーザー関連

#### users → profiles (1:1)

```typescript
// drizzle/schema.ts
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { 
      onDelete: 'cascade' 
    }),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
})
```

**関係：**
- 1人のユーザーに対して1つのプロフィール
- ユーザー削除時、プロフィールも削除（cascade）

#### family_members → users (N:1)

```typescript
export const familyMembers = pgTable('family_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull()
    .references(() => families.id, { 
      onDelete: 'cascade' 
    }),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { 
      onDelete: 'cascade' 
    }),
  role: text('role').notNull(), // 'parent' | 'child'
})
```

**関係：**
- 複数の家族メンバーが1人のユーザーを参照
- ユーザー削除時、家族メンバー記録も削除（cascade）

### 家族クエスト関連

#### family_quests → families (N:1)

```typescript
export const familyQuests = pgTable('family_quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull()
    .references(() => families.id, { 
      onDelete: 'cascade' 
    }),
  title: text('title').notNull(),
  // ...
})
```

**関係：**
- 複数のクエストが1つの家族に属する
- 家族削除時、クエストも削除（cascade）

#### family_quests → quest_categories (N:1)

```typescript
export const familyQuests = pgTable('family_quests', {
  // ...
  categoryId: integer('category_id').notNull()
    .references(() => questCategories.id, { 
      onDelete: 'restrict' 
    }),
  // ...
})
```

**関係：**
- 複数のクエストが1つのカテゴリーに属する
- カテゴリー削除時、使用中のクエストがあれば削除不可（restrict）

#### family_quest_details → family_quests (N:1)

```typescript
export const familyQuestDetails = pgTable('family_quest_details', {
  id: uuid('id').primaryKey().defaultRandom(),
  questId: uuid('quest_id').notNull()
    .references(() => familyQuests.id, { 
      onDelete: 'cascade' 
    }),
  level: integer('level').notNull(),
  reward: integer('reward').notNull(),
  // ...
})
```

**関係：**
- 複数の詳細（レベル）が1つのクエストに属する
- クエスト削除時、詳細も削除（cascade）

### 子供クエスト関連

#### child_quests → family_quest_details (N:1)

```typescript
export const childQuests = pgTable('child_quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  detailId: uuid('detail_id').notNull()
    .references(() => familyQuestDetails.id, { 
      onDelete: 'cascade' 
    }),
  childId: uuid('child_id').notNull()
    .references(() => children.id, { 
      onDelete: 'cascade' 
    }),
  status: text('status').notNull(), // 'not_started' | 'in_progress' | ...
  // ...
})
```

**関係：**
- 複数の子供クエストが1つの家族クエスト詳細を参照
- 家族クエスト詳細削除時、子供クエストも削除（cascade）
- 子供削除時、その子供のクエストも削除（cascade）

### 公開クエスト関連

#### public_quests → family_quests (1:1)

```typescript
export const publicQuests = pgTable('public_quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyQuestId: uuid('family_quest_id').notNull().unique()
    .references(() => familyQuests.id, { 
      onDelete: 'cascade' 
    }),
  familyId: uuid('family_id').notNull()
    .references(() => families.id, { 
      onDelete: 'cascade' 
    }),
  // ...
})
```

**関係：**
- 1つの家族クエストに対して1つの公開クエスト（unique制約）
- 家族クエスト削除時、公開クエストも削除（cascade）

#### public_quest_likes → public_quests (N:1)

```typescript
export const publicQuestLikes = pgTable('public_quest_likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  questId: uuid('quest_id').notNull()
    .references(() => publicQuests.id, { 
      onDelete: 'cascade' 
    }),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { 
      onDelete: 'cascade' 
    }),
}, (table) => ({
  // 1ユーザーは1クエストに1回のみいいね可能
  unq: uniqueIndex().on(table.questId, table.userId),
}))
```

**関係：**
- 複数のいいねが1つの公開クエストに属する
- 公開クエスト削除時、いいねも削除（cascade）
- ユーザー削除時、そのユーザーのいいねも削除（cascade）

#### public_quest_comments → public_quests (N:1)

```typescript
export const publicQuestComments = pgTable('public_quest_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  questId: uuid('quest_id').notNull()
    .references(() => publicQuests.id, { 
      onDelete: 'cascade' 
    }),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { 
      onDelete: 'cascade' 
    }),
  content: text('content').notNull(),
  // ...
})
```

**関係：**
- 複数のコメントが1つの公開クエストに属する
- 公開クエスト削除時、コメントも削除（cascade）

### 報酬関連

#### reward_history → children (N:1)

```typescript
export const rewardHistory = pgTable('reward_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  childId: uuid('child_id').notNull()
    .references(() => children.id, { 
      onDelete: 'cascade' 
    }),
  rewardTableId: uuid('reward_table_id')
    .references(() => rewardTables.id, { 
      onDelete: 'set null' 
    }),
  amount: integer('amount').notNull(),
  // ...
})
```

**関係：**
- 複数の報酬履歴が1人の子供に属する
- 子供削除時、報酬履歴も削除（cascade）
- 報酬テーブル削除時、履歴のrewardTableIdはnullに設定（set null）

### 通知関連

#### notifications → users (N:1)

```typescript
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { 
      onDelete: 'cascade' 
    }),
  type: text('type').notNull(),
  content: jsonb('content').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  // ...
})
```

**関係：**
- 複数の通知が1人のユーザーに属する
- ユーザー削除時、通知も削除（cascade）

### タイムライン関連

#### timeline_posts → families (N:1)

```typescript
export const timelinePosts = pgTable('timeline_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull()
    .references(() => families.id, { 
      onDelete: 'cascade' 
    }),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { 
      onDelete: 'cascade' 
    }),
  content: text('content').notNull(),
  // ...
})
```

**関係：**
- 複数の投稿が1つの家族に属する
- 家族削除時、投稿も削除（cascade）
- ユーザー削除時、そのユーザーの投稿も削除（cascade）

## 外部キー制約の種類

### onDelete オプション

| オプション | 動作 | 用途 |
|-----------|------|------|
| **cascade** | 親レコード削除時、子レコードも削除 | 従属関係が強い場合（家族→クエスト） |
| **restrict** | 子レコードが存在する場合、親レコード削除不可 | マスターデータ（カテゴリー） |
| **set null** | 親レコード削除時、子レコードの外部キーをnullに設定 | 参照は残すが削除は許可（報酬テーブル） |
| **no action** | 制約違反をトランザクション終了時にチェック | デフォルト動作 |

## 実装時の注意点

### 1. 循環参照の回避

```typescript
// ❌ 悪い例：循環参照
export const tableA = pgTable('table_a', {
  id: uuid('id').primaryKey(),
  bId: uuid('b_id').references(() => tableB.id),
})

export const tableB = pgTable('table_b', {
  id: uuid('id').primaryKey(),
  aId: uuid('a_id').references(() => tableA.id),
})

// ✅ 良い例：一方向の参照
export const tableA = pgTable('table_a', {
  id: uuid('id').primaryKey(),
})

export const tableB = pgTable('table_b', {
  id: uuid('id').primaryKey(),
  aId: uuid('a_id').references(() => tableA.id),
})
```

### 2. unique制約との組み合わせ

1:1のリレーションには`unique()`制約を追加：

```typescript
export const publicQuests = pgTable('public_quests', {
  familyQuestId: uuid('family_quest_id').notNull().unique()
    .references(() => familyQuests.id, { onDelete: 'cascade' }),
})
```

### 3. 複合外部キー

複数のカラムで外部キーを構成する場合：

```typescript
export const childQuests = pgTable('child_quests', {
  // ...
}, (table) => ({
  fk: foreignKey({
    columns: [table.familyId, table.questId],
    foreignColumns: [familyQuests.familyId, familyQuests.id],
  }),
}))
```

## リレーション定義（Drizzle）

外部キーとは別に、Drizzleのrelationsを定義してクエリを簡略化：

```typescript
export const familyQuestsRelations = relations(familyQuests, ({ one, many }) => ({
  family: one(families, {
    fields: [familyQuests.familyId],
    references: [families.id],
  }),
  details: many(familyQuestDetails),
  childQuests: many(childQuests),
}))
```

詳細は `references/cascade_rules.md` を参照。
