(2026年3月記載)

# Logger 使用パターン

## 基本的な使用方法

### インポート

```typescript
import { logger } from '@/app/(core)/logger'
```

## パターン別の使用例

### 1. API Route / Server Actions

#### エントリーポイント

```typescript
// packages/web/app/api/quests/family/route.ts
import { logger } from '@/app/(core)/logger'

export async function GET(request: Request) {
  logger.info('家族クエスト一覧取得開始')
  
  try {
    // 処理
    const quests = await fetchQuests()
    logger.info('家族クエスト一覧取得成功', { count: quests.length })
    return Response.json(quests)
  } catch (error) {
    logger.error('家族クエスト一覧取得失敗', error)
    throw error
  }
}
```

#### パラメータの記録

```typescript
export async function POST(request: Request) {
  const body = await request.json()
  logger.info('クエスト作成リクエスト', { 
    title: body.title, 
    category: body.category 
  })
  
  // 処理...
}
```

### 2. データベース操作

#### クエリ実行前後

```typescript
logger.debug('DB: 家族クエスト検索開始', { familyId })

const quests = await db
  .select()
  .from(familyQuests)
  .where(eq(familyQuests.familyId, familyId))

logger.debug('DB: 家族クエスト検索完了', { count: quests.length })
```

#### トランザクション

```typescript
logger.info('トランザクション開始: クエスト承認処理')

await db.transaction(async (tx) => {
  logger.debug('トランザクション内: child_quests更新')
  await tx.update(childQuests).set({ status: 'completed' })
  
  logger.debug('トランザクション内: 報酬付与')
  await tx.insert(rewardHistory).values(reward)
  
  logger.info('トランザクション完了: クエスト承認処理')
})
```

### 3. フロントエンド（コンポーネント）

#### イベントハンドラー

```typescript
'use client'
import { logger } from '@/app/(core)/logger'

export default function QuestForm() {
  const handleSubmit = async (data: FormData) => {
    logger.info('クエストフォーム送信', { title: data.title })
    
    try {
      await createQuest(data)
      logger.info('クエスト作成成功')
    } catch (error) {
      logger.error('クエスト作成失敗', error)
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

#### useEffect

```typescript
useEffect(() => {
  logger.debug('useEffect実行: クエスト一覧取得')
  
  fetchQuests().then(quests => {
    logger.debug('クエスト一覧取得完了', { count: quests.length })
  })
}, [])
```

### 4. React Query（データフェッチング）

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['family-quests', familyId],
  queryFn: async () => {
    logger.debug('React Query: 家族クエスト取得開始')
    const data = await fetchFamilyQuests(familyId)
    logger.debug('React Query: 家族クエスト取得完了', { count: data.length })
    return data
  },
})

if (error) {
  logger.error('React Query: 家族クエスト取得エラー', error)
}
```

### 5. 条件分岐

```typescript
if (!user) {
  logger.warn('認証エラー: ユーザーが存在しません')
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

logger.debug('ユーザー認証成功', { userId: user.id })
```

### 6. 非同期処理

```typescript
logger.info('非同期処理開始: 複数APIの並列実行')

const [quests, rewards, notifications] = await Promise.all([
  fetchQuests(),
  fetchRewards(),
  fetchNotifications(),
])

logger.info('非同期処理完了', {
  quests: quests.length,
  rewards: rewards.length,
  notifications: notifications.length,
})
```

### 7. エラーハンドリング

#### try-catch

```typescript
try {
  await dangerousOperation()
} catch (error) {
  logger.error('危険な操作でエラー発生', error)
  
  if (error instanceof ValidationError) {
    logger.warn('バリデーションエラー', { details: error.details })
  }
  
  throw error
}
```

#### カスタムエラー

```typescript
if (!isValid(data)) {
  const error = new Error('無効なデータ')
  logger.error('バリデーション失敗', error, { data })
  throw error
}
```

## ベストプラクティス

### ✅ 推奨パターン

1. **関数の開始・終了をログ**
```typescript
logger.info('処理開始: クエスト承認')
// 処理
logger.info('処理完了: クエスト承認')
```

2. **重要なデータをログに含める**
```typescript
logger.info('クエスト作成', { 
  questId: quest.id, 
  familyId: quest.familyId 
})
```

3. **エラーは必ずログ**
```typescript
catch (error) {
  logger.error('エラー発生', error)
}
```

### ❌ 避けるべきパターン

1. **ループ内での過度なログ**
```typescript
// ❌ 悪い例
quests.forEach(quest => {
  logger.debug('クエスト処理中', quest) // 大量のログが出力される
})

// ✅ 良い例
logger.debug('クエスト一括処理開始', { count: quests.length })
quests.forEach(quest => {
  // 処理のみ
})
logger.debug('クエスト一括処理完了')
```

2. **機密情報のログ**
```typescript
// ❌ 悪い例
logger.info('ユーザー情報', { password: user.password })

// ✅ 良い例
logger.info('ユーザー情報', { userId: user.id })
```

3. **エラーを握りつぶす**
```typescript
// ❌ 悪い例
try {
  await operation()
} catch (error) {
  // ログなし
}

// ✅ 良い例
try {
  await operation()
} catch (error) {
  logger.error('操作失敗', error)
  throw error
}
```

## ログ分析スクリプトの活用

既存コードのログ配置を分析：

```bash
python3 .github/skills/logger-management/scripts/analyze_logs.py <ファイルパス>
```

重要度別に改善ポイントが表示されるため、優先順位をつけてログを追加できます。
