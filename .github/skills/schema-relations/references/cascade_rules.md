(2026年3月記載)

# カスケードルール詳細

## 概要

カスケードルールは、親レコード削除時の子レコードの挙動を定義します。適切なルール設定により、データ整合性を保ちながら、運用しやすいデータベース設計が可能になります。

## カスケードオプション

### 1. CASCADE（連鎖削除）

**動作：**
親レコード削除時、関連する子レコードも自動的に削除されます。

**用途：**
- 親子関係が強い場合
- 子レコードが親なしで存在する意味がない場合

**実装例：**

#### 家族 → 家族クエスト

```typescript
export const familyQuests = pgTable('family_quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').notNull()
    .references(() => families.id, { 
      onDelete: 'cascade' // 家族削除時、クエストも削除
    }),
})
```

**削除の連鎖：**
```
families (家族) 削除
  ↓ cascade
family_quests (家族クエスト) 削除
  ↓ cascade
family_quest_details (クエスト詳細) 削除
  ↓ cascade
child_quests (子供クエスト) 削除
```

#### ユーザー → プロフィール

```typescript
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull()
    .references(() => users.id, { 
      onDelete: 'cascade' // ユーザー削除時、プロフィールも削除
    }),
})
```

#### 公開クエスト → コメント

```typescript
export const publicQuestComments = pgTable('public_quest_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  questId: uuid('quest_id').notNull()
    .references(() => publicQuests.id, { 
      onDelete: 'cascade' // 公開クエスト削除時、コメントも削除
    }),
})
```

### 2. RESTRICT（削除制限）

**動作：**
子レコードが存在する場合、親レコードの削除を拒否します。

**用途：**
- マスターデータの保護
- 重要な参照データの保護

**実装例：**

#### クエストカテゴリー → 家族クエスト

```typescript
export const familyQuests = pgTable('family_quests', {
  categoryId: integer('category_id').notNull()
    .references(() => questCategories.id, { 
      onDelete: 'restrict' // カテゴリー使用中は削除不可
    }),
})
```

**削除時のエラー：**
```typescript
// カテゴリーID 1 を使用しているクエストが存在する場合
await db.delete(questCategories).where(eq(questCategories.id, 1))
// Error: update or delete on table "quest_categories" violates 
//        foreign key constraint on table "family_quests"
```

**対処方法：**
1. 子レコードを別のカテゴリーに変更
2. 子レコードを削除
3. その後、親レコードを削除

### 3. SET NULL（NULL設定）

**動作：**
親レコード削除時、子レコードの外部キーをNULLに設定します。

**用途：**
- 参照は残したいが、削除は許可する場合
- 履歴データの保持

**実装例：**

#### 報酬テーブル → 報酬履歴

```typescript
export const rewardHistory = pgTable('reward_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  rewardTableId: uuid('reward_table_id')
    .references(() => rewardTables.id, { 
      onDelete: 'set null' // 報酬テーブル削除時、履歴は残す
    }),
  amount: integer('amount').notNull(), // 金額は残る
})
```

**削除後の状態：**
```typescript
// 削除前
rewardHistory: {
  id: 'abc123',
  rewardTableId: 'reward-1',
  amount: 100,
}

// rewardTables の 'reward-1' を削除

// 削除後
rewardHistory: {
  id: 'abc123',
  rewardTableId: null, // NULLに設定
  amount: 100,         // 金額は保持
}
```

### 4. NO ACTION（何もしない）

**動作：**
制約違反をトランザクション終了時にチェックします。RESTRICTと似ていますが、チェックのタイミングが異なります。

**用途：**
- デフォルトの動作
- 特別な制御が不要な場合

**実装例：**

```typescript
export const someTable = pgTable('some_table', {
  parentId: uuid('parent_id')
    .references(() => parentTable.id), // onDeleteを指定しない場合
})
```

## カスケードルールの選択基準

### 判断フローチャート

```
子レコードは親なしで意味を持つ？
├─ NO（家族クエスト、コメントなど）
│   → CASCADE
│
└─ YES
    │
    履歴として残す必要がある？
    ├─ YES（報酬履歴など）
    │   → SET NULL
    │
    └─ NO
        │
        マスターデータ？
        ├─ YES（カテゴリー、アイコンなど）
        │   → RESTRICT
        │
        └─ NO
            → NO ACTION または CASCADE
```

## 実装パターン

### パターン1: 完全な従属関係

**例：** 家族 → 家族クエスト → クエスト詳細 → 子供クエスト

```typescript
// 家族削除時、すべて削除
export const familyQuests = pgTable('family_quests', {
  familyId: uuid('family_id').references(() => families.id, { 
    onDelete: 'cascade' 
  }),
})

export const familyQuestDetails = pgTable('family_quest_details', {
  questId: uuid('quest_id').references(() => familyQuests.id, { 
    onDelete: 'cascade' 
  }),
})

export const childQuests = pgTable('child_quests', {
  detailId: uuid('detail_id').references(() => familyQuestDetails.id, { 
    onDelete: 'cascade' 
  }),
})
```

### パターン2: マスターデータ保護

**例：** クエストカテゴリー → 家族クエスト

```typescript
export const questCategories = pgTable('quest_categories', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
})

export const familyQuests = pgTable('family_quests', {
  categoryId: integer('category_id').references(() => questCategories.id, { 
    onDelete: 'restrict' // カテゴリー保護
  }),
})
```

**削除手順：**
```typescript
// 1. カテゴリー変更
await db.update(familyQuests)
  .set({ categoryId: newCategoryId })
  .where(eq(familyQuests.categoryId, oldCategoryId))

// 2. カテゴリー削除
await db.delete(questCategories)
  .where(eq(questCategories.id, oldCategoryId))
```

### パターン3: 履歴データ保持

**例：** 報酬テーブル → 報酬履歴

```typescript
export const rewardTables = pgTable('reward_tables', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
})

export const rewardHistory = pgTable('reward_history', {
  rewardTableId: uuid('reward_table_id').references(() => rewardTables.id, { 
    onDelete: 'set null' // 履歴は残す
  }),
  amount: integer('amount').notNull(), // 金額は保持
})
```

**削除後も履歴を参照可能：**
```typescript
const history = await db.select().from(rewardHistory)
// rewardTableId が null でも amount は保持されている
```

### パターン4: 複数の親を持つ場合

**例：** タイムライン（家族 + ユーザー）

```typescript
export const timelinePosts = pgTable('timeline_posts', {
  familyId: uuid('family_id').references(() => families.id, { 
    onDelete: 'cascade' // 家族削除時、投稿削除
  }),
  userId: uuid('user_id').references(() => users.id, { 
    onDelete: 'cascade' // ユーザー削除時、投稿削除
  }),
})
```

**どちらかが削除されても投稿は削除される**

## 運用上の注意点

### 1. 大量削除のパフォーマンス

CASCADE設定が多い場合、削除処理が重くなる可能性があります。

**対策：**
- インデックスの適切な設定
- バッチ処理での削除
- 削除前の警告メッセージ

### 2. 削除前の確認

```typescript
// 削除前に影響範囲を確認
const affectedQuests = await db.select()
  .from(familyQuests)
  .where(eq(familyQuests.familyId, familyId))

console.log(`${affectedQuests.length}件のクエストが削除されます`)
```

### 3. トランザクション内での削除

```typescript
await db.transaction(async (tx) => {
  // 関連データの削除
  await tx.delete(childQuests).where(eq(childQuests.questId, questId))
  
  // クエスト削除
  await tx.delete(familyQuests).where(eq(familyQuests.id, questId))
})
```

### 4. ソフトデリート（論理削除）の検討

```typescript
export const familyQuests = pgTable('family_quests', {
  id: uuid('id').primaryKey(),
  deletedAt: timestamp('deleted_at'), // null = 未削除
})

// 論理削除
await db.update(familyQuests)
  .set({ deletedAt: new Date() })
  .where(eq(familyQuests.id, questId))

// クエリ時に除外
const activeQuests = await db.select()
  .from(familyQuests)
  .where(isNull(familyQuests.deletedAt))
```

## Drizzle Relations との関係

外部キー制約とは別に、Drizzleのrelationsを定義します：

```typescript
export const familyQuestsRelations = relations(familyQuests, ({ one, many }) => ({
  family: one(families, {
    fields: [familyQuests.familyId],
    references: [families.id],
  }),
  details: many(familyQuestDetails),
}))
```

**relationsの役割：**
- クエリの簡略化（WITH句の自動生成）
- 型安全なデータ取得
- **カスケードルールは外部キー制約で制御**

詳細は `references/foreign_keys.md` を参照。
