(2026年3月記載)

# ホーム画面のダッシュボードデータ構造

## データソースとテーブルリレーション

### 主要テーブル
```
profiles (ユーザープロフィール)
├── family_quests (家族クエスト)
│   └── family_quest_details (レベル別詳細)
├── child_quests (子供のクエスト受注)
├── reward_history (報酬履歴)
└── notifications (通知)
```

## ダッシュボードデータ型定義

### HomeSummary (親用)
```typescript
type ParentHomeSummary = {
  role: "parent"
  
  // クエスト関連統計
  totalQuests: number          // family_quests の総数
  activeQuests: number         // 進行中のクエスト数
  completedQuests: number      // 完了済みクエスト数
  publicQuests: number         // 公開済みクエスト数
  
  // 子供の進捗統計
  childrenCount: number        // 登録された子供の人数
  activeChildren: number       // アクティブな子供の人数
  totalRewardsGiven: number    // 配布済み報酬の合計額
  
  // タイムライン統計
  recentActivities: number     // 最近のアクティビティ数
  pendingReviews: number       // レビュー待ちのクエスト数
}
```

### HomeSummary (子供用)
```typescript
type ChildHomeSummary = {
  role: "child"
  
  // レベル・経験値
  currentLevel: number         // profiles.level
  experiencePoints: number     // profiles.experience
  nextLevelExp: number         // 次のレベルまでの必要経験値
  progressPercentage: number   // 進捗率 (%)
  
  // クエスト統計
  activeQuests: number         // child_quests で in_progress
  completedQuests: number      // child_quests で completed
  pendingReviews: number       // child_quests で pending_review
  
  // 報酬統計
  totalRewards: number         // reward_history の合計額
  monthlyRewards: number       // 今月の獲得報酬
  todayRewards: number         // 今日の獲得報酬
  
  // ランキング・実績
  familyRank: number           // 家族内順位
  totalChildren: number        // 家族の子供総数
}
```

## API エンドポイント構造

### GET /api/home/summary
**返り値**:
```typescript
{
  summary: ParentHomeSummary | ChildHomeSummary
}
```

**クエリ処理 (親の場合)**:
```sql
-- 総クエスト数
SELECT COUNT(*) as totalQuests
FROM family_quests
WHERE created_by = ?

-- アクティブなクエスト数
SELECT COUNT(*) as activeQuests
FROM family_quests
WHERE created_by = ?
  AND is_active = true

-- 完了済みクエスト数
SELECT COUNT(*) as completedQuests
FROM child_quests
WHERE family_quest_id IN (
  SELECT id FROM family_quests WHERE created_by = ?
)
  AND status = 'completed'

-- 公開済みクエスト数
SELECT COUNT(*) as publicQuests
FROM public_quests
WHERE original_family_quest_id IN (
  SELECT id FROM family_quests WHERE created_by = ?
)
  AND is_active = true

-- 配布済み報酬合計
SELECT COALESCE(SUM(amount), 0) as totalRewardsGiven
FROM reward_history
WHERE family_id = ?

-- レビュー待ちクエスト数
SELECT COUNT(*) as pendingReviews
FROM child_quests
WHERE family_quest_id IN (
  SELECT id FROM family_quests WHERE created_by = ?
)
  AND status = 'pending_review'
```

**クエリ処理 (子供の場合)**:
```sql
-- レベル・経験値
SELECT level, experience
FROM profiles
WHERE id = ?

-- 次のレベルまでの経験値
SELECT experience_required
FROM level_config
WHERE level = (SELECT level FROM profiles WHERE id = ?) + 1

-- アクティブなクエスト数
SELECT COUNT(*) as activeQuests
FROM child_quests
WHERE profile_id = ?
  AND status = 'in_progress'

-- 完了済みクエスト数
SELECT COUNT(*) as completedQuests
FROM child_quests
WHERE profile_id = ?
  AND status = 'completed'

-- レビュー待ちクエスト数
SELECT COUNT(*) as pendingReviews
FROM child_quests
WHERE profile_id = ?
  AND status = 'pending_review'

-- 獲得報酬合計
SELECT COALESCE(SUM(amount), 0) as totalRewards
FROM reward_history
WHERE profile_id = ?

-- 今月の獲得報酬
SELECT COALESCE(SUM(amount), 0) as monthlyRewards
FROM reward_history
WHERE profile_id = ?
  AND created_at >= DATE_TRUNC('month', CURRENT_DATE)

-- 今日の獲得報酬
SELECT COALESCE(SUM(amount), 0) as todayRewards
FROM reward_history
WHERE profile_id = ?
  AND created_at >= CURRENT_DATE

-- 家族内ランキング
SELECT COUNT(*) + 1 as familyRank
FROM profiles
WHERE family_id = (SELECT family_id FROM profiles WHERE id = ?)
  AND type = 'child'
  AND experience > (SELECT experience FROM profiles WHERE id = ?)
```

## 最近のクエストデータ構造

### GET /api/quests/recent
**返り値**:
```typescript
{
  quests: RecentQuest[]
}

type RecentQuest = {
  id: string
  title: string
  reward: number
  status: "not_started" | "in_progress" | "pending_review" | "completed"
  dueDate?: string
  createdAt: string
  updatedAt: string
  family: {
    id: string
    name: string
  }
}
```

**クエリ処理**:
```sql
SELECT 
  cq.id,
  fqd.title,
  fqd.reward,
  cq.status,
  fqd.due_date as "dueDate",
  cq.created_at as "createdAt",
  cq.updated_at as "updatedAt",
  f.id as "family.id",
  f.name as "family.name"
FROM child_quests cq
JOIN family_quest_details fqd ON cq.family_quest_detail_id = fqd.id
JOIN family_quests fq ON fqd.family_quest_id = fq.id
JOIN families f ON fq.family_id = f.id
WHERE cq.profile_id = ?
ORDER BY cq.updated_at DESC
LIMIT 10
```

## 最近の通知データ構造

### GET /api/notifications/recent
**返り値**:
```typescript
{
  notifications: RecentNotification[]
}

type RecentNotification = {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
  isRead: boolean
  relatedId?: string        // 関連するクエストID等
  relatedType?: string      // "quest" | "reward" | "comment"
}

type NotificationType = 
  | "quest_approved"        // クエスト承認
  | "quest_rejected"        // クエスト却下
  | "new_quest"             // 新規クエスト登録
  | "comment"               // コメント投稿
  | "level_up"              // レベルアップ
  | "reward_received"       // 報酬獲得
```

**クエリ処理**:
```sql
SELECT 
  id,
  type,
  title,
  message,
  created_at as "createdAt",
  is_read as "isRead",
  related_id as "relatedId",
  related_type as "relatedType"
FROM notifications
WHERE profile_id = ?
ORDER BY 
  CASE WHEN is_read = false THEN 0 ELSE 1 END,  -- 未読を優先
  created_at DESC
LIMIT 10
```

## データ集計の最適化戦略

### 1. キャッシュ戦略
```typescript
// React Query のキャッシュ設定
const queryOptions = {
  queryKey: ["homeSummary"],
  queryFn: fetchHomeSummary,
  staleTime: 5 * 60 * 1000,        // 5分間fresh
  cacheTime: 10 * 60 * 1000,       // 10分間キャッシュ保持
  refetchOnWindowFocus: true,      // ウィンドウフォーカス時に再取得
  refetchOnMount: true,            // マウント時に再取得
}
```

### 2. バックグラウンド更新
```typescript
// staleTime 経過後、バックグラウンドで自動再検証
useQuery({
  ...queryOptions,
  staleTime: 5 * 60 * 1000,
  refetchInterval: 10 * 60 * 1000,  // 10分ごとにバックグラウンド更新
})
```

### 3. 楽観的更新
```typescript
// クエスト完了時、サマリーを楽観的に更新
const mutation = useMutation({
  mutationFn: completeQuest,
  onMutate: async () => {
    // 現在のキャッシュを保存
    const previousSummary = queryClient.getQueryData(["homeSummary"])
    
    // 楽観的更新
    queryClient.setQueryData(["homeSummary"], (old: any) => ({
      ...old,
      completedQuests: old.completedQuests + 1,
      activeQuests: old.activeQuests - 1,
    }))
    
    return { previousSummary }
  },
  onError: (err, variables, context) => {
    // エラー時はロールバック
    queryClient.setQueryData(["homeSummary"], context.previousSummary)
  },
  onSettled: () => {
    // 完了後に正確なデータを再取得
    queryClient.invalidateQueries(["homeSummary"])
  },
})
```

### 4. 並列クエリ最適化
```typescript
// Promise.all で並列実行
const [summary, quests, notifications] = await Promise.all([
  fetchHomeSummary(),
  fetchRecentQuests(),
  fetchRecentNotifications(),
])
```

## データ変換とフォーマット

### 経験値の進捗率計算
```typescript
const calculateProgressPercentage = (
  currentExp: number,
  currentLevel: number,
  nextLevelExp: number
): number => {
  // 現在のレベルで必要な経験値の基準値
  const currentLevelBaseExp = getLevelBaseExp(currentLevel)
  
  // 現在のレベルでの進捗
  const progressInLevel = currentExp - currentLevelBaseExp
  
  // 次のレベルまでに必要な経験値
  const expRequiredForNextLevel = nextLevelExp - currentLevelBaseExp
  
  // パーセンテージ計算
  const percentage = (progressInLevel / expRequiredForNextLevel) * 100
  
  return Math.min(Math.max(percentage, 0), 100) // 0-100の範囲に制限
}
```

### 報酬額のフォーマット
```typescript
const formatReward = (amount: number): string => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(amount)
}

// 使用例
formatReward(1500) // "¥1,500"
```

### 相対時刻のフォーマット
```typescript
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 1) return "たった今"
  if (diffMinutes < 60) return `${diffMinutes}分前`
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`
  
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date)
}

// 使用例
formatRelativeTime("2026-03-15T10:00:00Z") // "2時間前"
```

## パフォーマンス監視指標

### 取得時間の目標値
```typescript
const performanceTargets = {
  homeSummary: 500,         // 500ms以内
  recentQuests: 300,        // 300ms以内
  recentNotifications: 300, // 300ms以内
  totalPageLoad: 2000,      // 2秒以内 (初回表示完了まで)
}
```

### 監視項目
```typescript
type PerformanceMetrics = {
  apiCallDuration: number      // API呼び出し時間
  dbQueryDuration: number      // DB クエリ時間
  renderDuration: number       // レンダリング時間
  totalLoadTime: number        // 合計読み込み時間
  cacheHitRate: number         // キャッシュヒット率
}
```

## データ整合性の保証

### トランザクション範囲
```typescript
// クエスト承認時のトランザクション例
await db.transaction(async (tx) => {
  // 1. child_quests の status を completed に更新
  await tx.update(childQuests)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(childQuests.id, questId))
  
  // 2. reward_history にレコード追加
  await tx.insert(rewardHistory).values({
    profileId,
    amount: reward,
    source: "quest_completion",
    relatedId: questId,
  })
  
  // 3. profiles の経験値・レベル更新
  await tx.update(profiles)
    .set({ 
      experience: sql`experience + ${experienceGain}`,
      level: sql`CASE WHEN experience + ${experienceGain} >= ${nextLevelExp} THEN level + 1 ELSE level END`
    })
    .where(eq(profiles.id, profileId))
  
  // 4. 通知作成
  await tx.insert(notifications).values({
    profileId,
    type: "quest_approved",
    title: "クエスト承認",
    message: `「${questTitle}」が承認されました！`,
  })
})
```

### キャッシュ無効化タイミング
```typescript
// クエスト操作後にサマリーキャッシュを無効化
const invalidateSummaryCache = () => {
  queryClient.invalidateQueries(["homeSummary"])
  queryClient.invalidateQueries(["recentQuests"])
  queryClient.invalidateQueries(["recentNotifications"])
}

// ミューテーション成功時に実行
onSuccess: invalidateSummaryCache
```

## エラーハンドリングとフォールバック

### データ取得失敗時の処理
```typescript
const { summary, isLoading, error } = useHomeSummary()

if (error) {
  // エラー時はフォールバックデータを表示
  return (
    <ErrorFallback 
      message="データの取得に失敗しました"
      onRetry={() => refetch()}
    />
  )
}

if (isLoading) {
  // ローディング時はスケルトン表示
  return <DashboardSkeleton />
}
```

### 部分的なデータ表示
```typescript
// 一部のデータ取得が失敗しても、取得できたデータは表示する
const { summary } = useHomeSummary()
const { quests, error: questsError } = useRecentQuests()
const { notifications } = useRecentNotifications()

return (
  <>
    <DashboardSummary summary={summary} />
    
    {questsError ? (
      <Alert color="yellow">クエストデータの取得に失敗しました</Alert>
    ) : (
      <RecentQuests quests={quests} />
    )}
    
    <RecentNotifications notifications={notifications} />
  </>
)
```
