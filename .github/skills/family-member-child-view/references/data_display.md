(2026年3月15日 14:30記載)

# 家族メンバー子供閲覧画面 データ表示ロジック

## データ取得フロー

### 1. 初期データ取得

```typescript
// useChild.ts
export function useChild(id: string) {
  return useQuery({
    queryKey: ['child', id],
    queryFn: () => fetchChildDetail(id),
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  })
}

// client.ts
export async function fetchChildDetail(id: string) {
  const response = await fetch(`/api/children/${id}`)
  if (!response.ok) throw new Error('Failed to fetch child')
  return response.json()
}
```

### 2. データ構造

**APIレスポンス:**
```typescript
type ChildDetailResponse = {
  child: {
    id: string
    family_id: string
    name: string
    icon: string
    age: number | null
    grade: string | null
    balance: number
    level: number
    experience_points: number
    next_level_experience: number
    user_id: string | null  // nullの場合は招待コード表示
    invite_code: string | null
    created_at: string
    updated_at: string
  }
  family: {
    id: string
    name: string
  }
}
```

## データ変換ロジック

### 表示用データの生成

```typescript
// useChildViewModel.ts
export function useChildViewModel(data: ChildDetailResponse) {
  return useMemo(() => ({
    // 基本情報
    basic: {
      id: data.child.id,
      name: data.child.name,
      icon: data.child.icon,
      age: data.child.age,
      grade: data.child.grade,
      ageDisplay: formatAge(data.child.age),
      gradeDisplay: formatGrade(data.child.grade),
    },
    
    // 財務情報
    finance: {
      balance: data.child.balance,
      balanceDisplay: `¥${data.child.balance.toLocaleString()}`,
    },
    
    // レベル・経験値情報
    levelInfo: {
      currentLevel: data.child.level,
      experiencePoints: data.child.experience_points,
      nextLevelExperience: data.child.next_level_experience,
      progress: calculateProgressPercentage(
        data.child.experience_points,
        data.child.next_level_experience
      ),
      progressDisplay: `${data.child.experience_points} / ${data.child.next_level_experience} XP`,
    },
    
    // 招待コード情報
    invite: {
      isLinked: !!data.child.user_id,
      inviteCode: data.child.invite_code,
      needsInvite: !data.child.user_id,
      inviteCodeDisplay: formatInviteCode(data.child.invite_code),
    },
    
    // タイムスタンプ情報
    timestamps: {
      createdAt: data.child.created_at,
      updatedAt: data.child.updated_at,
      createdAtDisplay: formatDate(data.child.created_at),
      memberSince: calculateMemberSince(data.child.created_at),
    },
    
    // 家族情報
    family: {
      id: data.family.id,
      name: data.family.name,
    },
  }), [data])
}
```

### データフォーマット関数

```typescript
// formatAge
function formatAge(age: number | null): string {
  if (!age) return '未設定'
  return `${age}歳`
}

// formatGrade
function formatGrade(grade: string | null): string {
  if (!grade) return '未設定'
  return grade
}

// calculateProgressPercentage
function calculateProgressPercentage(current: number, next: number): number {
  if (next === 0) return 0
  return Math.floor((current / next) * 100)
}

// formatInviteCode
function formatInviteCode(code: string | null): string {
  if (!code) return ''
  // ABC123DEF456 → ABC-123-DEF-456
  return code.match(/.{1,3}/g)?.join('-') || code
}

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
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) {
    return `${diffDays}日前に登録`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}ヶ月前に登録`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years}年前に登録`
  }
}
```

## レベル・経験値表示ロジック

### プログレスバー計算

```typescript
// LevelProgressBar コンポーネント
type Props = {
  currentLevel: number
  experiencePoints: number
  nextLevelExperience: number
}

export function LevelProgressBar({ 
  currentLevel, 
  experiencePoints, 
  nextLevelExperience 
}: Props) {
  const progress = useMemo(() => {
    return (experiencePoints / nextLevelExperience) * 100
  }, [experiencePoints, nextLevelExperience])
  
  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Text size="sm" fw={600}>Level {currentLevel}</Text>
        <Text size="xs" c="dimmed">
          {experiencePoints} / {nextLevelExperience} XP
        </Text>
      </Group>
      <Progress value={progress} size="lg" />
      <Text size="xs" c="dimmed" ta="right">
        次のレベルまであと {nextLevelExperience - experiencePoints} XP
      </Text>
    </Stack>
  )
}
```

## 招待コード管理ロジック

### 招待コード表示判定

```typescript
// ChildView.tsx
export function ChildView({ childId }: { childId: string }) {
  const { data } = useChild(childId)
  const [showInvitePopup, setShowInvitePopup] = useState(false)
  
  // user_idがない場合、初回表示時に自動でポップアップ
  useEffect(() => {
    if (data && !data.child.user_id) {
      setShowInvitePopup(true)
    }
  }, [data])
  
  const needsInvite = !data?.child.user_id
  
  return (
    <Stack>
      <ChildViewLayout child={data.child} />
      
      {needsInvite && (
        <Button
          fullWidth
          variant="light"
          onClick={() => setShowInvitePopup(true)}
        >
          招待コードを表示
        </Button>
      )}
      
      <InviteCodePopup
        opened={showInvitePopup}
        onClose={() => setShowInvitePopup(false)}
        inviteCode={data?.child.invite_code || ''}
        childName={data?.child.name || ''}
      />
    </Stack>
  )
}
```

### 招待コードコピー機能

```typescript
// InviteCodePopup.tsx
export function InviteCodePopup({ 
  opened, 
  onClose, 
  inviteCode, 
  childName 
}: Props) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
      showNotification({
        title: 'コピーしました',
        message: '招待コードをクリップボードにコピーしました',
        color: 'green',
      })
    } catch (error) {
      showNotification({
        title: 'エラー',
        message: 'コピーに失敗しました',
        color: 'red',
      })
    }
  }
  
  return (
    <Modal opened={opened} onClose={onClose} title="招待コード">
      <Stack>
        <Text>{childName}さんの招待コード</Text>
        
        <Card withBorder>
          <Text size="xl" fw={700} ta="center">
            {formatInviteCode(inviteCode)}
          </Text>
        </Card>
        
        <Button onClick={handleCopy} leftSection={<IconCopy />}>
          クリップボードにコピー
        </Button>
        
        <Text size="sm" c="dimmed">
          この招待コードを子供のアカウント作成時に入力してもらってください
        </Text>
      </Stack>
    </Modal>
  )
}
```

## エラー表示

### データ取得エラー

```typescript
// ChildView.tsx
const { data, isLoading, error } = useChild(childId)

if (error) {
  return (
    <ErrorDisplay
      title="子供情報を取得できませんでした"
      message={error.message}
      action={
        <Button onClick={() => router.push('/families/members')}>
          メンバー一覧へ戻る
        </Button>
      }
    />
  )
}
```

### 権限エラー

```typescript
// page.tsx (サーバー側)
export default async function ChildViewPage({ params }: Props) {
  const user = await getCurrentUser()
  
  // 親ユーザーチェック
  if (user.role !== 'parent') {
    throw new Error('この画面は親ユーザーのみアクセスできます')
  }
  
  // 家族メンバーチェック
  const child = await getChild(params.id)
  if (child.family_id !== user.family_id) {
    throw new Error('別の家族の子供情報は閲覧できません')
  }
  
  return <ChildView childId={params.id} />
}
```

## プレゼンテーション最適化

### 条件付きレンダリング

```typescript
// ChildViewLayout.tsx
export function ChildViewLayout({ child }: Props) {
  return (
    <Stack>
      {/* 年齢・学年は設定されている場合のみ表示 */}
      {(child.age || child.grade) && (
        <Group>
          {child.age && <Text>年齢: {child.age}歳</Text>}
          {child.grade && <Text>学年: {child.grade}</Text>}
        </Group>
      )}
      
      {/* 残高は常に表示 */}
      <Text size="xl" fw={700}>
        残高: ¥{child.balance.toLocaleString()}
      </Text>
      
      {/* レベル・経験値 */}
      <LevelProgressBar
        currentLevel={child.level}
        experiencePoints={child.experience_points}
        nextLevelExperience={child.next_level_experience}
      />
    </Stack>
  )
}
```

### パフォーマンス最適化

```typescript
// React.memo による再レンダリング抑制
export const ChildViewLayout = React.memo(({ child }: Props) => {
  // ...
})

// useMemo によるデータ変換の最適化
const viewModel = useMemo(() => 
  transformChildData(data), 
  [data]
)
```

## ナビゲーション

### 編集画面への遷移

```typescript
// FAB (Floating Action Button)
<FloatingActionButton
  icon={<IconEdit />}
  onClick={() => router.push(`/children/${childId}/edit`)}
/>
```

### 報酬履歴画面への遷移

```typescript
<Button
  onClick={() => router.push(`/children/${childId}/rewards`)}
>
  報酬履歴を見る
</Button>
```
