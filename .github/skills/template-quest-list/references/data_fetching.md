(2026年3月記載)

# テンプレートクエスト一覧 データ取得パターン

## API構造

### エンドポイント
- `GET /api/quests/template`: テンプレートクエスト一覧取得
- `GET /api/quests/template/[id]`: テンプレートクエスト詳細取得
- `POST /api/quests/family/adopt`: テンプレートを家族クエストとして採用

### ファイル構成
```
packages/web/app/api/quests/template/
├── route.ts                    # GET（一覧）
├── client.ts                   # APIクライアント関数
├── query.ts                    # React Queryフック
└── [id]/
    └── route.ts               # GET（詳細）

packages/web/app/api/quests/family/
└── adopt/
    └── route.ts               # POST（採用）
```

## React Query フック

### useTemplateQuests
**ファイル**: `app/(app)/quests/template/_hooks/useTemplateQuests.ts`

```typescript
export function useTemplateQuests(params: {
  categoryId?: number
}) {
  return useQuery({
    queryKey: ['quests', 'template', params],
    queryFn: () => fetchTemplateQuests(params),
    staleTime: 1000 * 60 * 60, // 1時間（テンプレートは更新頻度が低い）
  })
}
```

**特徴**:
- カテゴリIDをクエリキーに含める
- 長いstaleTime（1時間）
- テンプレートは頻繁に変更されないため積極的なキャッシュ

### useAdoptTemplateQuest
**ファイル**: `app/(app)/quests/template/_hooks/useAdoptTemplateQuest.ts`

```typescript
export function useAdoptTemplateQuest() {
  const queryClient = useQueryClient()
  const router = useRouter()
  
  return useMutation({
    mutationFn: (templateId: string) => adoptTemplateQuest(templateId),
    onSuccess: (familyQuest) => {
      // 家族クエスト一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['quests', 'family'] })
      
      // 成功通知
      showNotification({
        title: '採用完了',
        message: 'クエストを家族クエストとして追加しました',
        color: 'green',
      })
      
      // 家族クエスト編集画面へ遷移（必要に応じてカスタマイズ）
      router.push(`/quests/family/${familyQuest.id}/edit`)
    },
    onError: (error) => {
      logger.error('テンプレート採用失敗', { error })
      showNotification({
        title: 'エラー',
        message: 'クエストの採用に失敗しました',
        color: 'red',
      })
    },
  })
}
```

**特徴**:
- 採用成功時に家族クエスト一覧を無効化
- 自動で編集画面へ遷移（オプション）
- エラー時の通知表示

## データフロー

### 初期ロード
```
Component Mount
    ↓
useTemplateQuests()
    ↓
React Query Cache Check
    ↓
API Call: GET /api/quests/template
    ↓
Database Query with JOIN (template_quests, quest_categories)
    ↓
Response: { quests: TemplateQuest[] }
    ↓
Cache Update (1時間保持)
    ↓
Component Re-render
```

### テンプレート採用フロー
```
User Click "採用する"
    ↓
useAdoptTemplateQuest.mutate(templateId)
    ↓
ローディング状態表示
    ↓
API Call: POST /api/quests/family/adopt
    ↓
Database Transaction
    ├─ INSERT into family_quests
    └─ INSERT into family_quest_details
    ↓
Response: { familyQuest: FamilyQuest }
    ↓
invalidateQueries(['quests', 'family'])
    ↓
Success Notification
    ↓
Navigate to /quests/family/[id]/edit
```

### カテゴリフィルタフロー
```
User Select Category
    ↓
categoryId State Update
    ↓
useTemplateQuests re-run with new categoryId
    ↓
React Query Cache Check with new key
    ↓
API Call: GET /api/quests/template?categoryId=X
    ↓
Database Query with WHERE clause
    ↓
Response: filtered quests
    ↓
List Re-render
```

## キャッシュ戦略

### クエリキー構造
```typescript
['quests', 'template']                          // 全テンプレート
['quests', 'template', { categoryId: 1 }]      // カテゴリフィルタ
['quest', 'template', templateId]              // 個別テンプレート詳細
```

### Stale Time
- テンプレート一覧: 1時間
- 個別テンプレート: 1時間

### Cache Time
- デフォルト: 1時間（使用されなくなったキャッシュの保持時間）

### Refetch 戦略
- フォーカス時: `refetchOnWindowFocus: false`（テンプレートは頻繁に変わらない）
- マウント時: `refetchOnMount: false`（キャッシュがあれば再取得しない）
- 再接続時: `refetchOnReconnect: false`

## パフォーマンス最適化

### プリフェッチ
```typescript
// カテゴリタブホバー時にプリフェッチ
const queryClient = useQueryClient()

const prefetchCategory = (categoryId: number) => {
  queryClient.prefetchQuery({
    queryKey: ['quests', 'template', { categoryId }],
    queryFn: () => fetchTemplateQuests({ categoryId }),
  })
}

<Tabs.Tab
  value={category.id}
  onMouseEnter={() => prefetchCategory(category.id)}
>
  {category.name}
</Tabs.Tab>
```

### 画像最適化
```typescript
<Image
  src={quest.imageUrl}
  loading="lazy"
  placeholder="blur"
  blurDataURL={quest.thumbnailUrl}
/>
```

### メモ化
```typescript
const filteredQuests = useMemo(() => {
  return quests?.filter(q => !categoryId || q.categoryId === categoryId)
}, [quests, categoryId])
```

## エラーハンドリング

### テンプレート取得エラー
```typescript
const { data, error, isError } = useTemplateQuests({ categoryId })

if (isError) {
  return (
    <ErrorState
      message="テンプレートクエストの取得に失敗しました"
      onRetry={() => queryClient.invalidateQueries(['quests', 'template'])}
    />
  )
}
```

### 採用エラー
```typescript
const { mutate: adoptQuest } = useAdoptTemplateQuest({
  onError: (error) => {
    if (error.response?.status === 403) {
      showNotification({
        title: '権限エラー',
        message: '親のみがクエストを採用できます',
        color: 'red',
      })
    } else if (error.response?.status === 404) {
      showNotification({
        title: 'エラー',
        message: 'テンプレートが見つかりませんでした',
        color: 'red',
      })
    } else {
      showNotification({
        title: 'エラー',
        message: 'クエストの採用に失敗しました',
        color: 'red',
      })
    }
  },
})
```

## 認証関連

### 閲覧権限
```typescript
// テンプレート一覧は認証必須
export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const templates = await fetchTemplateQuests()
  return NextResponse.json(templates)
}
```

### 採用権限
```typescript
// 採用は親のみ
export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const parent = await getParent(user.id)
  if (!parent) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // 採用処理
}
```

## データ型定義

### TemplateQuest
```typescript
type TemplateQuest = {
  id: string
  title: string
  description: string
  imageUrl?: string
  categoryId: number
  categoryName: string
  difficulty: 1 | 2 | 3  // ★の数
  recommendedAge: string  // "6-10歳"
  reward: number          // デフォルト報酬額
  exp: number             // 獲得経験値
  createdAt: string
}
```

### AdoptResponse
```typescript
type AdoptResponse = {
  familyQuest: FamilyQuest
  message: string
}
```
