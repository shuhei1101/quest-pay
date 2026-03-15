(2026年3月15日 14:30記載)

# 子供クエスト閲覧画面 データ表示ロジック

## データ取得フロー

### 1. 初期データ取得

```typescript
// useChildQuest.ts
export function useChildQuest(id: string) {
  return useQuery({
    queryKey: ['childQuest', id],
    queryFn: () => fetchChildQuestDetail(id),
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  })
}

// client.ts
export async function fetchChildQuestDetail(id: string) {
  const response = await fetch(`/api/quests/child/${id}`)
  if (!response.ok) throw new Error('Failed to fetch child quest')
  return response.json()
}
```

### 2. データ構造

**APIレスポンス:**
```typescript
type ChildQuestDetailResponse = {
  childQuest: {
    id: string
    child_id: string
    family_quest_id: string
    current_level: number
    status: 'not_started' | 'in_progress' | 'pending_review' | 'completed'
    started_at: string | null
    reported_at: string | null
    completed_at: string | null
    reviewed_at: string | null
  }
  familyQuest: {
    id: string
    title: string
    description: string
    icon: string
    category: string
  }
  currentLevelDetail: {
    level: number
    title: string
    description: string
    reward: number
    experience_points: number
  }
  totalLevels: number
  child: {
    id: string
    name: string
    icon: string
  }
}
```

## データ変換ロジック

### 表示用データの生成

```typescript
// useChildQuestViewModel.ts
export function useChildQuestViewModel(data: ChildQuestDetailResponse) {
  return useMemo(() => ({
    // クエスト基本情報
    quest: {
      id: data.childQuest.id,
      title: data.familyQuest.title,
      description: data.familyQuest.description,
      icon: data.familyQuest.icon,
      category: data.familyQuest.category,
    },
    
    // レベル情報
    level: {
      current: data.childQuest.current_level,
      total: data.totalLevels,
      progress: (data.childQuest.current_level / data.totalLevels) * 100,
      title: data.currentLevelDetail.title,
      description: data.currentLevelDetail.description,
    },
    
    // 報酬情報
    reward: {
      amount: data.currentLevelDetail.reward,
      experiencePoints: data.currentLevelDetail.experience_points,
      display: `¥${data.currentLevelDetail.reward.toLocaleString()}`,
    },
    
    // ステータス情報
    status: {
      code: data.childQuest.status,
      label: getStatusLabel(data.childQuest.status),
      color: getStatusColor(data.childQuest.status),
      canReport: data.childQuest.status === 'in_progress',
      canCancel: data.childQuest.status === 'pending_review',
    },
    
    // タイムスタンプ情報
    timestamps: {
      startedAt: data.childQuest.started_at,
      reportedAt: data.childQuest.reported_at,
      completedAt: data.childQuest.completed_at,
      elapsedTime: calculateElapsedTime(data.childQuest.started_at),
      startedAtDisplay: formatDateTime(data.childQuest.started_at),
    },
    
    // 子供情報
    child: {
      name: data.child.name,
      icon: data.child.icon,
    },
  }), [data])
}
```

### ステータス表示ロジック

```typescript
function getStatusLabel(status: QuestStatus): string {
  const labels = {
    not_started: '未開始',
    in_progress: '実行中',
    pending_review: '承認待ち',
    completed: '完了',
  }
  return labels[status]
}

function getStatusColor(status: QuestStatus): string {
  const colors = {
    not_started: 'gray',
    in_progress: 'blue',
    pending_review: 'yellow',
    completed: 'green',
  }
  return colors[status]
}
```

### 時間計算ロジック

```typescript
function calculateElapsedTime(startedAt: string | null): string {
  if (!startedAt) return '未開始'
  
  const start = new Date(startedAt)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}時間${minutes}分`
  }
  return `${minutes}分`
}

function formatDateTime(dateString: string | null): string {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
```

## リアルタイム更新

### 経過時間の自動更新

```typescript
// useElapsedTime.ts
export function useElapsedTime(startedAt: string | null) {
  const [elapsed, setElapsed] = useState(calculateElapsedTime(startedAt))
  
  useEffect(() => {
    if (!startedAt) return
    
    // 1分ごとに更新
    const interval = setInterval(() => {
      setElapsed(calculateElapsedTime(startedAt))
    }, 60000)
    
    return () => clearInterval(interval)
  }, [startedAt])
  
  return elapsed
}
```

## エラー表示

### データ取得エラー

```typescript
// ChildQuestViewScreen.tsx
const { data, isLoading, error } = useChildQuest(id)

if (error) {
  return (
    <ErrorDisplay
      title="クエスト情報を取得できませんでした"
      message={error.message}
      action={
        <Button onClick={() => router.push('/quests/child')}>
          クエスト一覧へ戻る
        </Button>
      }
    />
  )
}
```

### データ不整合エラー

```typescript
// データ検証
if (!data.currentLevelDetail) {
  return (
    <ErrorDisplay
      title="レベル情報が見つかりません"
      message="クエストのレベル設定に問題があります"
    />
  )
}
```

## プレゼンテーション最適化

### 条件付きレンダリング

```typescript
// ChildQuestViewScreen.tsx
{status === 'pending_review' && (
  <NotificationBanner
    variant="warning"
    message="親の承認待ちです"
  />
)}

{timestamps.startedAt && (
  <ProgressTracker
    currentLevel={level.current}
    totalLevels={level.total}
    startedAt={timestamps.startedAt}
    reportedAt={timestamps.reportedAt}
  />
)}
```

### パフォーマンス最適化

```typescript
// React.memo による再レンダリング抑制
export const ChildQuestDetail = React.memo(({ quest }: Props) => {
  // ...
})

// useMemo によるデータ変換の最適化
const displayData = useMemo(() => 
  transformQuestData(data), 
  [data]
)
```
