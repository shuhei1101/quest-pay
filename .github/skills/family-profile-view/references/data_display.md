(2026年3月記載)

# 家族プロフィール閲覧画面 データ表示ロジック

## データ取得フロー

### 1. 初期データ取得（複数API並列）

```typescript
// useFamilyProfile.ts
export function useFamilyProfile(familyId: string) {
  // 家族詳細取得
  const familyQuery = useFamilyDetail(familyId)
  
  // フォロー状態取得
  const followQuery = useFollowStatus(familyId)
  
  // タイムライン取得
  const timelineQuery = useFamilyTimeline(familyId, 10)
  
  return {
    family: familyQuery.data,
    isFollowing: followQuery.data?.isFollowing ?? false,
    timeline: timelineQuery.data,
    isLoading: familyQuery.isLoading || followQuery.isLoading || timelineQuery.isLoading,
    error: familyQuery.error || followQuery.error || timelineQuery.error,
  }
}
```

### 2. データ構造

**家族詳細レスポンス:**
```typescript
type FamilyDetailResponse = {
  family: {
    id: string
    name: string
    icon: string
    description: string | null
    created_at: string
    updated_at: string
  }
  stats: {
    publicQuestCount: number
    totalLikes: number
    followerCount: number
  }
}
```

**フォロー状態レスポンス:**
```typescript
type FollowStatusResponse = {
  isFollowing: boolean
  followedAt: string | null
}
```

**タイムラインレスポンス:**
```typescript
type TimelineResponse = {
  items: Array<{
    id: string
    event_type: 'quest_completed' | 'quest_published' | 'level_up'
    child_name: string
    quest_title: string | null
    level: number | null
    created_at: string
  }>
  total: number
}
```

## データ変換ロジック

### 表示用データの生成

```typescript
// useFamilyProfileViewModel.ts
export function useFamilyProfileViewModel(
  family: FamilyDetailResponse,
  followStatus: FollowStatusResponse,
  timeline: TimelineResponse
) {
  return useMemo(() => ({
    // 基本情報
    basic: {
      id: family.family.id,
      name: family.family.name,
      icon: family.family.icon,
      description: family.family.description,
    },
    
    // 統計情報
    stats: {
      publicQuestCount: family.stats.publicQuestCount,
      totalLikes: family.stats.totalLikes,
      followerCount: family.stats.followerCount,
      publicQuestDisplay: `${family.stats.publicQuestCount}件`,
      totalLikesDisplay: `${family.stats.totalLikes}`,
      followerCountDisplay: `${family.stats.followerCount}人`,
    },
    
    // フォロー情報
    follow: {
      isFollowing: followStatus.isFollowing,
      followedAt: followStatus.followedAt,
      buttonLabel: followStatus.isFollowing ? 'フォロー中' : 'フォロー',
      buttonColor: followStatus.isFollowing ? 'gray' : 'blue',
      buttonIcon: followStatus.isFollowing ? <IconCheck /> : <IconPlus />,
    },
    
    // タイムライン情報
    timeline: {
      items: timeline.items.map(item => ({
        id: item.id,
        eventType: item.event_type,
        childName: item.child_name,
        questTitle: item.quest_title,
        level: item.level,
        createdAt: item.created_at,
        icon: getEventIcon(item.event_type),
        message: formatEventMessage(item),
        relativeTime: formatRelativeTime(item.created_at),
      })),
      total: timeline.total,
      hasMore: timeline.items.length < timeline.total,
    },
    
    // タイムスタンプ情報
    timestamps: {
      createdAt: family.family.created_at,
      memberSince: calculateMemberSince(family.family.created_at),
      createdAtDisplay: formatDate(family.family.created_at),
    },
  }), [family, followStatus, timeline])
}
```

### タイムラインイベントフォーマット

```typescript
// getEventIcon
function getEventIcon(eventType: string): React.ReactNode {
  const icons = {
    quest_completed: <IconCircleCheck color="green" />,
    quest_published: <IconRocket color="blue" />,
    level_up: <IconTrophy color="gold" />,
  }
  return icons[eventType] || <IconInfoCircle />
}

// formatEventMessage
function formatEventMessage(item: TimelineItem): string {
  switch (item.event_type) {
    case 'quest_completed':
      return `${item.child_name}さんが「${item.quest_title}」を完了しました！`
    case 'quest_published':
      return `「${item.quest_title}」を公開しました`
    case 'level_up':
      return `${item.child_name}さんがレベル${item.level}に到達！`
    default:
      return 'イベントが発生しました'
  }
}

// formatRelativeTime
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}分前`
  } else if (hours < 24) {
    return `${hours}時間前`
  } else if (days < 7) {
    return `${days}日前`
  } else {
    return formatDate(dateString)
  }
}
```

### 日付フォーマット関数

```typescript
// formatDate
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// calculateMemberSince
function calculateMemberSince(createdAt: string): string {
  const created = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - created.getTime()
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365))
  const months = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
  
  if (years > 0) {
    return `${years}年${months}ヶ月前から参加`
  } else if (months > 0) {
    return `${months}ヶ月前から参加`
  } else {
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    return `${days}日前から参加`
  }
}
```

## データ取得フック詳細

### useFamilyDetail

```typescript
// useFamilyProfile.ts
export function useFamilyDetail(familyId: string) {
  return useQuery({
    queryKey: ['family', familyId, 'detail'],
    queryFn: () => fetchFamilyDetail(familyId),
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  })
}

// client.ts
export async function fetchFamilyDetail(familyId: string) {
  const response = await fetch(`/api/families/${familyId}`)
  if (!response.ok) throw new Error('Failed to fetch family detail')
  return response.json()
}
```

### useFollowStatus

```typescript
export function useFollowStatus(familyId: string) {
  return useQuery({
    queryKey: ['family', familyId, 'follow-status'],
    queryFn: () => fetchFollowStatus(familyId),
    staleTime: 1000 * 60, // 1分間キャッシュ
  })
}

// client.ts
export async function fetchFollowStatus(familyId: string) {
  const response = await fetch(`/api/families/${familyId}/follow/status`)
  if (!response.ok) throw new Error('Failed to fetch follow status')
  return response.json()
}
```

### useFamilyTimeline

```typescript
export function useFamilyTimeline(familyId: string, limit: number = 10) {
  return useQuery({
    queryKey: ['family', familyId, 'timeline', limit],
    queryFn: () => fetchFamilyTimeline(familyId, limit),
    staleTime: 1000 * 60 * 2, // 2分間キャッシュ
  })
}

// client.ts
export async function fetchFamilyTimeline(familyId: string, limit: number) {
  const response = await fetch(`/api/timeline/family/${familyId}?limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch timeline')
  return response.json()
}
```

## フォロー状態管理

### useFollowToggle

```typescript
export function useFollowToggle(familyId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (isFollowing: boolean) => {
      if (isFollowing) {
        return unfollowFamily(familyId)
      } else {
        return followFamily(familyId)
      }
    },
    onMutate: async (isFollowing) => {
      // 楽観的更新
      await queryClient.cancelQueries({ queryKey: ['family', familyId, 'follow-status'] })
      
      const previousData = queryClient.getQueryData(['family', familyId, 'follow-status'])
      
      queryClient.setQueryData(['family', familyId, 'follow-status'], {
        isFollowing: !isFollowing,
        followedAt: !isFollowing ? new Date().toISOString() : null,
      })
      
      return { previousData }
    },
    onError: (err, variables, context) => {
      // エラー時はロールバック
      if (context?.previousData) {
        queryClient.setQueryData(
          ['family', familyId, 'follow-status'],
          context.previousData
        )
      }
      
      showNotification({
        title: 'エラー',
        message: 'フォロー状態の更新に失敗しました',
        color: 'red',
      })
    },
    onSuccess: (data, isFollowing) => {
      // キャッシュ無効化
      queryClient.invalidateQueries({ queryKey: ['family', familyId, 'detail'] })
      
      // 成功トースト
      showNotification({
        title: isFollowing ? 'フォローを解除しました' : 'フォローしました',
        message: isFollowing ? '' : 'この家族の最新情報を受け取れます',
        color: 'green',
      })
    },
  })
}
```

## エラー表示

### データ取得エラー

```typescript
// FamilyProfileViewScreen.tsx
const { family, isFollowing, timeline, isLoading, error } = useFamilyProfile(id)

if (error) {
  return (
    <ErrorDisplay
      title="家族情報を取得できませんでした"
      message={error.message}
      action={
        <Button onClick={() => router.push('/families')}>
          家族一覧へ戻る
        </Button>
      }
    />
  )
}
```

### 権限エラー

```typescript
// page.tsx (サーバー側)
export default async function FamilyProfileViewPage({ params }: Props) {
  const user = await getCurrentUser()
  
  // 親ユーザーチェック
  if (user.role !== 'parent') {
    throw new Error('この画面は親ユーザーのみアクセスできます')
  }
  
  return <FamilyProfileViewScreen id={params.id} />
}
```

## プレゼンテーション最適化

### 条件付きレンダリング

```typescript
// FamilyProfileViewLayout.tsx
export function FamilyProfileViewLayout({ family }: Props) {
  return (
    <Stack>
      {/* 紹介文は設定されている場合のみ表示 */}
      {family.description && (
        <Text size="sm" c="dimmed">
          {family.description}
        </Text>
      )}
      
      {/* 統計情報は常に表示 */}
      <FamilyStats
        publicQuestCount={family.publicQuestCount}
        totalLikes={family.totalLikes}
        followerCount={family.followerCount}
      />
    </Stack>
  )
}
```

### パフォーマンス最適化

```typescript
// React.memo による再レンダリング抑制
export const FamilyProfileViewLayout = React.memo(({ family }: Props) => {
  // ...
})

// useMemo によるデータ変換の最適化
const viewModel = useMemo(() => 
  transformFamilyData(family, followStatus, timeline), 
  [family, followStatus, timeline]
)

// useCallback によるコールバック最適化
const handleFollowToggle = useCallback(async () => {
  await followMutation.mutateAsync(isFollowing)
}, [followMutation, isFollowing])
```

## 空状態の表示

### タイムラインが空の場合

```typescript
// TimelineList.tsx
if (!timeline?.items.length) {
  return (
    <EmptyState
      icon={<IconTimeline />}
      title="タイムラインはまだありません"
      message="この家族の活動が表示されます"
    />
  )
}
```

### 統計情報がゼロの場合

```typescript
// FamilyStats.tsx
<Stack align="center" gap={4}>
  <Text size="xl" fw={700}>
    {publicQuestCount || 0}
  </Text>
  <Text size="xs" c="dimmed">公開クエスト</Text>
  {publicQuestCount === 0 && (
    <Text size="xs" c="dimmed">（まだ公開していません）</Text>
  )}
</Stack>
```

## リアルタイム更新（オプション）

### ポーリングによる更新

```typescript
// useFamilyTimeline with polling
export function useFamilyTimeline(familyId: string, limit: number = 10) {
  return useQuery({
    queryKey: ['family', familyId, 'timeline', limit],
    queryFn: () => fetchFamilyTimeline(familyId, limit),
    staleTime: 1000 * 60 * 2, // 2分間キャッシュ
    refetchInterval: 1000 * 60 * 5, // 5分ごとに自動更新
  })
}
```
