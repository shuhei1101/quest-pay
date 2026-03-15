(2026年3月15日 14:30記載)

# 最適化ガイド

## 排他制御

### db_helper.tsの使用

排他制御が必要な更新処理では、必ず`db_helper.ts`の`checkVersion`関数を使用すること。

**基本パターン:**
```ts
import { checkVersion } from "@/app/api/_db_helper/db_helper"
import { questsTable } from "@/drizzle/schema"
import { eq, and } from "drizzle-orm"

// バージョンチェック付き更新
await checkVersion(db, questsTable, questId, currentVersion)

const [updatedQuest] = await db
  .update(questsTable)
  .set({
    title: "更新されたタイトル",
    version: currentVersion + 1,
    updated_at: new Date(),
  })
  .where(and(
    eq(questsTable.id, questId),
    eq(questsTable.version, currentVersion)
  ))
  .returning()
```

### FOR UPDATEの使用

トランザクション内で行ロックが必要な場合:

```ts
import { sql } from "drizzle-orm"

const result = await db.transaction(async (tx) => {
  // 行ロック
  const [quest] = await tx.execute(sql`
    SELECT * FROM quests 
    WHERE id = ${questId} 
    FOR UPDATE
  `)
  
  // 更新処理
  await tx
    .update(questsTable)
    .set({ status: "completed" })
    .where(eq(questsTable.id, questId))
})
```

## インデックス最適化

### よく検索されるカラムにインデックス

**例: 家族IDでの検索が頻繁な場合:**
```sql
CREATE INDEX idx_quests_family_id ON quests(family_id);
CREATE INDEX idx_child_quests_child_id ON child_quests(child_id);
```

### 複合インデックス

**例: 家族IDとステータスでの検索:**
```sql
CREATE INDEX idx_quests_family_status ON quests(family_id, status);
```

### 部分インデックス

**例: アクティブなクエストのみ:**
```sql
CREATE INDEX idx_active_quests ON quests(family_id) WHERE status = 'active';
```

## クエリ最適化

### N+1問題の回避

**❌ 悪い例（N+1問題）:**
```ts
// クエスト一覧を取得
const quests = await db
  .select()
  .from(questsTable)
  .where(eq(questsTable.family_id, familyId))

// 各クエストのカテゴリを個別に取得（N+1問題）
for (const quest of quests) {
  const category = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, quest.category_id))
}
```

**✅ 良い例（JOIN使用）:**
```ts
// 一度のクエリで取得
const questsWithCategory = await db
  .select({
    id: questsTable.id,
    title: questsTable.title,
    categoryName: categoriesTable.name,
  })
  .from(questsTable)
  .leftJoin(categoriesTable, eq(questsTable.category_id, categoriesTable.id))
  .where(eq(questsTable.family_id, familyId))
```

### 必要なカラムのみ取得

**❌ 悪い例（全カラム取得）:**
```ts
const quests = await db
  .select()  // すべてのカラムを取得
  .from(questsTable)
```

**✅ 良い例（必要なカラムのみ）:**
```ts
const quests = await db
  .select({
    id: questsTable.id,
    title: questsTable.title,
  })
  .from(questsTable)
```

### 条件の最適化

**❌ 悪い例（OR条件が多い）:**
```ts
const quests = await db
  .select()
  .from(questsTable)
  .where(or(
    eq(questsTable.id, id1),
    eq(questsTable.id, id2),
    eq(questsTable.id, id3),
    // ... 多数のOR条件
  ))
```

**✅ 良い例（IN句使用）:**
```ts
import { inArray } from "drizzle-orm"

const quests = await db
  .select()
  .from(questsTable)
  .where(inArray(questsTable.id, [id1, id2, id3, ...]))
```

## バッチ処理

### 大量レコードの処理

**バッチ挿入:**
```ts
const BATCH_SIZE = 100

export const insertManyQuests = async (quests: NewQuest[]) => {
  const results = []
  
  for (let i = 0; i < quests.length; i += BATCH_SIZE) {
    const batch = quests.slice(i, i + BATCH_SIZE)
    
    const inserted = await db
      .insert(questsTable)
      .values(batch)
      .returning()
    
    results.push(...inserted)
  }
  
  return results
}
```

**バッチ更新:**
```ts
export const updateManyQuests = async (updates: QuestUpdate[]) => {
  return await db.transaction(async (tx) => {
    for (const update of updates) {
      await tx
        .update(questsTable)
        .set(update.data)
        .where(eq(questsTable.id, update.id))
    }
  })
}
```

## キャッシュ戦略

### React Queryのキャッシュ活用

**適切なstaleTimeの設定:**
```ts
// query.ts
export const useQuests = (familyId: string) => {
  return useQuery({
    queryKey: ['quests', familyId],
    queryFn: () => getQuests(familyId),
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  })
}
```

**キャッシュの無効化:**
```ts
// 更新後にキャッシュを無効化
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: updateQuest,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['quests'] })
  },
})
```

## 接続プール

### Supabase接続設定

**接続プール設定:**
```ts
// app/(core)/_supabase/db.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

// 接続プール設定
const client = postgres(connectionString, {
  max: 10,              // 最大接続数
  idle_timeout: 20,     // アイドルタイムアウト（秒）
  connect_timeout: 10,  // 接続タイムアウト（秒）
})

export const db = drizzle(client)
```

## パフォーマンス監視

### ログによる監視

```ts
import { logger } from '@/app/(core)/_logger/logger'

export const getQuests = async (familyId: string) => {
  const startTime = Date.now()
  
  try {
    const quests = await db
      .select()
      .from(questsTable)
      .where(eq(questsTable.family_id, familyId))
    
    const duration = Date.now() - startTime
    logger.debug(`クエスト取得完了: ${duration}ms`)
    
    return quests
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error(`クエスト取得失敗: ${duration}ms`, error)
    throw error
  }
}
```

### スロークエリの検出

```ts
const SLOW_QUERY_THRESHOLD = 1000 // 1秒

export const monitoredQuery = async <T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> => {
  const startTime = Date.now()
  
  try {
    const result = await queryFn()
    const duration = Date.now() - startTime
    
    if (duration > SLOW_QUERY_THRESHOLD) {
      logger.warn(`スロークエリ検出: ${queryName} (${duration}ms)`)
    }
    
    return result
  } catch (error) {
    logger.error(`クエリ失敗: ${queryName}`, error)
    throw error
  }
}

// 使用例
const quests = await monitoredQuery('getQuests', async () => {
  return await db
    .select()
    .from(questsTable)
    .where(eq(questsTable.family_id, familyId))
})
```

## ベストプラクティス

### 1. 適切なトランザクション範囲
- トランザクションは必要最小限の範囲で使用
- 長時間のトランザクションは避ける
- 外部API呼び出しはトランザクション外で行う

### 2. 効率的なクエリ
- 必要なカラムのみ取得
- JOINを活用してN+1問題を回避
- インデックスを適切に設定

### 3. 排他制御
- 更新処理では必ずバージョン管理を実装
- トランザクション内で行ロックが必要な場合はFOR UPDATEを使用

### 4. エラーハンドリング
- すべてのDB操作でエラーハンドリングを実装
- ユーザーフレンドリーなエラーメッセージを提供
- ロギングでエラーの追跡を可能にする

### 5. パフォーマンス監視
- クエリの実行時間を監視
- スロークエリを検出して最適化
- 定期的にクエリプランを確認
