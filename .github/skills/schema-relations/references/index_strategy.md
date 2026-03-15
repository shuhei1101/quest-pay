(2026年3月15日 14:30記載)

# インデックス戦略

## 概要

インデックスは、データベースのクエリパフォーマンスを向上させるための重要な要素です。適切なインデックス設計により、検索速度を大幅に改善できます。

## インデックスの基本

### インデックスの種類

| 種類 | 用途 | Drizzle記法 |
|------|------|-------------|
| **Primary Key** | 主キー（自動的にインデックス） | `.primaryKey()` |
| **Unique Index** | 一意制約 + 高速検索 | `.unique()`, `uniqueIndex()` |
| **Index** | 検索速度向上 | `index()` |
| **Composite Index** | 複数カラムの組み合わせ検索 | `index().on(col1, col2)` |

### インデックスが必要なケース

- ✅ WHERE句で頻繁に使用されるカラム
- ✅ JOIN句で使用されるカラム
- ✅ ORDER BY句で使用されるカラム
- ✅ 外部キー制約のカラム

### インデックスが不要なケース

- ❌ 小さなテーブル（< 1000行）
- ❌ 更新頻度が高すぎるカラム
- ❌ カーディナリティが低いカラム（例：boolean）

## 主要テーブルのインデックス戦略

### 1. family_quests（家族クエスト）

```typescript
export const familyQuests = pgTable('family_quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull()
    .references(() => families.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id').notNull()
    .references(() => parents.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull()
    .references(() => questCategories.id, { onDelete: 'restrict' }),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // 家族IDでの検索（最も頻繁）
  familyIdIdx: index('family_quests_family_id_idx').on(table.familyId),
  
  // 親IDでの検索
  parentIdIdx: index('family_quests_parent_id_idx').on(table.parentId),
  
  // ステータスでのフィルタリング
  statusIdx: index('family_quests_status_idx').on(table.status),
  
  // 家族 + ステータスでの複合検索
  familyStatusIdx: index('family_quests_family_status_idx')
    .on(table.familyId, table.status),
  
  // 作成日でのソート
  createdAtIdx: index('family_quests_created_at_idx').on(table.createdAt),
}))
```

**主なクエリパターン：**
```typescript
// 家族の全クエスト取得
db.select().from(familyQuests)
  .where(eq(familyQuests.familyId, familyId))
  // → familyIdIdx を使用

// 家族の進行中クエスト取得
db.select().from(familyQuests)
  .where(
    and(
      eq(familyQuests.familyId, familyId),
      eq(familyQuests.status, 'in_progress')
    )
  )
  // → familyStatusIdx を使用（複合インデックス）
```

### 2. child_quests（子供クエスト）

```typescript
export const childQuests = pgTable('child_quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  detailId: uuid('detail_id').notNull()
    .references(() => familyQuestDetails.id, { onDelete: 'cascade' }),
  childId: uuid('child_id').notNull()
    .references(() => children.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  // 子供IDでの検索（最も頻繁）
  childIdIdx: index('child_quests_child_id_idx').on(table.childId),
  
  // 詳細IDでの検索
  detailIdIdx: index('child_quests_detail_id_idx').on(table.detailId),
  
  // 子供 + ステータスでの複合検索
  childStatusIdx: index('child_quests_child_status_idx')
    .on(table.childId, table.status),
  
  // 完了日でのソート
  completedAtIdx: index('child_quests_completed_at_idx').on(table.completedAt),
}))
```

### 3. public_quests（公開クエスト）

```typescript
export const publicQuests = pgTable('public_quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyQuestId: uuid('family_quest_id').notNull().unique()
    .references(() => familyQuests.id, { onDelete: 'cascade' }),
  familyId: uuid('family_id').notNull()
    .references(() => families.id, { onDelete: 'cascade' }),
  likesCount: integer('likes_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // 家族IDでの検索
  familyIdIdx: index('public_quests_family_id_idx').on(table.familyId),
  
  // いいね数でのソート（人気順）
  likesCountIdx: index('public_quests_likes_count_idx').on(table.likesCount),
  
  // 作成日でのソート（新着順）
  createdAtIdx: index('public_quests_created_at_idx').on(table.createdAt),
}))
```

### 4. public_quest_likes（いいね）

```typescript
export const publicQuestLikes = pgTable('public_quest_likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  questId: uuid('quest_id').notNull()
    .references(() => publicQuests.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // クエストIDでの検索
  questIdIdx: index('public_quest_likes_quest_id_idx').on(table.questId),
  
  // ユーザーIDでの検索
  userIdIdx: index('public_quest_likes_user_id_idx').on(table.userId),
  
  // 重複いいね防止（ユニーク複合インデックス）
  questUserUnq: uniqueIndex('public_quest_likes_quest_user_unq')
    .on(table.questId, table.userId),
}))
```

**重複防止の仕組み：**
```typescript
// 同じユーザーが同じクエストに2回いいねしようとすると、
// uniqueIndex違反でエラーになる
await db.insert(publicQuestLikes).values({
  questId: 'quest-1',
  userId: 'user-1',
})
// → 成功

await db.insert(publicQuestLikes).values({
  questId: 'quest-1',
  userId: 'user-1',
})
// → エラー: duplicate key value violates unique constraint
```

### 5. notifications（通知）

```typescript
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // ユーザーIDでの検索
  userIdIdx: index('notifications_user_id_idx').on(table.userId),
  
  // ユーザー + 未読でのフィルタリング
  userReadIdx: index('notifications_user_read_idx')
    .on(table.userId, table.isRead),
  
  // 作成日でのソート
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
}))
```

### 6. reward_history（報酬履歴）

```typescript
export const rewardHistory = pgTable('reward_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  childId: uuid('child_id').notNull()
    .references(() => children.id, { onDelete: 'cascade' }),
  rewardTableId: uuid('reward_table_id')
    .references(() => rewardTables.id, { onDelete: 'set null' }),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // 子供IDでの検索
  childIdIdx: index('reward_history_child_id_idx').on(table.childId),
  
  // 作成日でのソート
  createdAtIdx: index('reward_history_created_at_idx').on(table.createdAt),
  
  // 子供 + 作成日での複合検索（履歴参照で頻繁）
  childCreatedIdx: index('reward_history_child_created_idx')
    .on(table.childId, table.createdAt),
}))
```

## 複合インデックスの設計

### 複合インデックスの順序

複合インデックスは、カラムの順序が重要です。

**原則：**
1. 等価比較（=）のカラムを先に
2. 範囲検索（>, <）のカラムを後に
3. 選択性の高いカラムを先に

**例：**

```typescript
// ✅ 良い例
index().on(table.familyId, table.status, table.createdAt)

// クエリ1: familyId = ? AND status = ? → 使用可能
// クエリ2: familyId = ? → 使用可能
// クエリ3: status = ? → 使用不可（先頭カラムがない）
```

### 部分インデックスの活用

特定の条件のレコードのみインデックス化：

```typescript
export const familyQuests = pgTable('family_quests', {
  // ...
  status: text('status').notNull(),
}, (table) => ({
  // 進行中のクエストのみインデックス化
  activeQuestsIdx: index('family_quests_active_idx')
    .on(table.familyId, table.status)
    .where(sql`status = 'in_progress'`),
}))
```

**メリット：**
- インデックスサイズの削減
- 更新パフォーマンスの向上

## インデックスのパフォーマンス分析

### EXPLAIN ANALYZE の使用

```sql
EXPLAIN ANALYZE
SELECT * FROM family_quests
WHERE family_id = 'abc123'
  AND status = 'in_progress';
```

**結果の見方：**
```
Index Scan using family_quests_family_status_idx
  → 複合インデックスを使用（良い）

Seq Scan on family_quests
  → フルスキャン（改善の余地あり）
```

### インデックスの使用状況確認

```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

**指標：**
- `idx_scan` が0に近い → 使用されていない（削除を検討）
- `idx_tup_read` が大きい → 頻繁に使用されている

## インデックスのメンテナンス

### 1. 未使用インデックスの削除

```sql
-- 使用されていないインデックスを確認
SELECT indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- 削除
DROP INDEX IF EXISTS unused_index_name;
```

### 2. インデックスの再構築

```sql
-- インデックスの肥大化確認
SELECT 
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;

-- 再構築
REINDEX INDEX index_name;
```

### 3. 統計情報の更新

```sql
-- テーブルの統計情報を更新（クエリプランナーの最適化）
ANALYZE family_quests;
```

## ベストプラクティス

### ✅ 推奨パターン

1. **外部キーにはインデックスを作成**
```typescript
export const familyQuests = pgTable('family_quests', {
  familyId: uuid('family_id').references(() => families.id),
}, (table) => ({
  familyIdIdx: index().on(table.familyId), // 必須
}))
```

2. **頻繁なクエリパターンに複合インデックス**
```typescript
// 家族 + ステータスでの検索が多い場合
index().on(table.familyId, table.status)
```

3. **ユニーク制約は uniqueIndex**
```typescript
uniqueIndex().on(table.questId, table.userId) // 重複防止 + 高速検索
```

### ❌ 避けるべきパターン

1. **すべてのカラムにインデックス**
   - 更新パフォーマンスが悪化
   - ストレージの無駄

2. **カーディナリティが低いカラムへのインデックス**
```typescript
// ❌ 悪い例
index().on(table.isActive) // true/false の2値しかない
```

3. **重複する複合インデックス**
```typescript
// ❌ 悪い例
index().on(table.familyId, table.status)
index().on(table.familyId) // 冗長（上のインデックスで代用可能）
```

## まとめ

| 状況 | インデックス戦略 |
|------|----------------|
| 外部キー | 必ずインデックス作成 |
| 頻繁な検索カラム | 単一インデックス |
| 複合検索 | 複合インデックス（順序に注意） |
| 一意制約 | uniqueIndex |
| 範囲検索 | 複合インデックスの後方に配置 |
| 小さなテーブル | インデックス不要 |
| boolean型 | 通常は不要（部分インデックスは検討可） |

詳細なリレーション設計は `references/foreign_keys.md` と `references/cascade_rules.md` を参照。
