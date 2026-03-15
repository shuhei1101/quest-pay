(2026年3月記載)

# 通知一覧 リスト操作

## 基本操作

### 1. 通知一覧取得

**API**: `GET /api/notifications`

**Query Parameters**:
| パラメータ | 型 | 必須 | 説明 |
|------------|-----|------|------|
| filter | string | No | 'all' \| 'unread' \| 'read' |
| limit | number | No | 取得件数（デフォルト: 50） |
| offset | number | No | オフセット（デフォルト: 0） |

**Response**:
```typescript
{
  notifications: Notification[]
  totalCount: number
  unreadCount: number
}

type Notification = {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  targetId?: string
  targetType?: string
  readAt: string | null
  createdAt: string
}
```

### 2. 既読マーク

**API**: `PUT /api/notifications/[id]/read`

**Request Body**:
```typescript
{
  // Bodyなし
}
```

**Response**:
```typescript
{
  success: boolean
  notification: Notification
}
```

### 3. 全件既読

**API**: `PUT /api/notifications/read-all`

**Request Body**:
```typescript
{
  // Bodyなし
}
```

**Response**:
```typescript
{
  success: boolean
  updatedCount: number
}
```

## フィルタリング

### クライアント側フィルタ
```typescript
const filterNotifications = (
  notifications: Notification[],
  filter: 'all' | 'unread' | 'read'
) => {
  if (filter === 'all') return notifications
  if (filter === 'unread') return notifications.filter(n => !n.readAt)
  if (filter === 'read') return notifications.filter(n => n.readAt)
  return notifications
}
```

### サーバー側フィルタ
```typescript
// route.ts
const query = db.select().from(notifications)

if (filter === 'unread') {
  query.where(isNull(notifications.readAt))
}
if (filter === 'read') {
  query.where(isNotNull(notifications.readAt))
}
```

## ソート

### デフォルトソート
- 作成日時の降順（新しい順）

### カスタムソート
```typescript
const sortNotifications = (
  notifications: Notification[],
  sortBy: 'createdAt' | 'readAt'
) => {
  return [...notifications].sort((a, b) => {
    const aTime = new Date(a[sortBy] || 0).getTime()
    const bTime = new Date(b[sortBy] || 0).getTime()
    return bTime - aTime
  })
}
```

## ページネーション

### 無限スクロール（推奨）
```typescript
export function useInfiniteNotifications(filter?: string) {
  return useInfiniteQuery({
    queryKey: ['notifications', 'infinite', filter],
    queryFn: ({ pageParam = 0 }) => 
      fetchNotifications({ filter, offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((sum, page) => 
        sum + page.notifications.length, 0
      )
      return loadedCount < lastPage.totalCount ? loadedCount : undefined
    },
  })
}
```

### 従来型ページネーション
```typescript
const [page, setPage] = useState(1)
const pageSize = 20

const { data } = useNotifications({ 
  offset: (page - 1) * pageSize, 
  limit: pageSize 
})
```

## 一括操作

### 選択モード
```typescript
const [selectedIds, setSelectedIds] = useState<string[]>([])
const [isSelectionMode, setIsSelectionMode] = useState(false)

const toggleSelection = (id: string) => {
  setSelectedIds(prev => 
    prev.includes(id) 
      ? prev.filter(x => x !== id) 
      : [...prev, id]
  )
}

const selectAll = () => {
  setSelectedIds(notifications.map(n => n.id))
}

const clearSelection = () => {
  setSelectedIds([])
  setIsSelectionMode(false)
}
```

### 一括既読マーク
```typescript
const markSelectedAsRead = async () => {
  await Promise.all(
    selectedIds.map(id => markAsRead(id))
  )
  clearSelection()
}
```

### 一括削除
```typescript
const deleteSelected = async () => {
  await Promise.all(
    selectedIds.map(id => deleteNotification(id))
  )
  clearSelection()
}
```

## 検索

### キーワード検索
```typescript
const [searchQuery, setSearchQuery] = useState('')

const filteredNotifications = useMemo(() => {
  if (!searchQuery) return notifications
  
  return notifications.filter(n =>
    n.title.includes(searchQuery) ||
    n.body.includes(searchQuery)
  )
}, [notifications, searchQuery])
```

## 通知タイプ別処理

### タイプ判定
```typescript
enum NotificationType {
  QUEST_REVIEW_REQUEST = 'quest_review_request',
  QUEST_APPROVED = 'quest_approved',
  QUEST_REJECTED = 'quest_rejected',
  COMMENT = 'comment',
  LIKE = 'like',
  FAMILY_INVITE = 'family_invite',
  SYSTEM = 'system',
}
```

### 遷移先決定
```typescript
const getNavigationPath = (notification: Notification): string => {
  switch (notification.type) {
    case NotificationType.QUEST_REVIEW_REQUEST:
    case NotificationType.QUEST_APPROVED:
    case NotificationType.QUEST_REJECTED:
      return `/quests/family/${notification.targetId}`
    
    case NotificationType.COMMENT:
      return `/quests/public/${notification.targetId}`
    
    case NotificationType.LIKE:
      return `/quests/public/${notification.targetId}`
    
    case NotificationType.FAMILY_INVITE:
      return `/families/${notification.targetId}`
    
    case NotificationType.SYSTEM:
    default:
      return '/home'
  }
}
```

### アイコン決定
```typescript
const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.QUEST_REVIEW_REQUEST:
      return 'alert-circle'
    case NotificationType.QUEST_APPROVED:
      return 'check-circle'
    case NotificationType.QUEST_REJECTED:
      return 'x-circle'
    case NotificationType.COMMENT:
      return 'message-square'
    case NotificationType.LIKE:
      return 'heart'
    case NotificationType.FAMILY_INVITE:
      return 'users'
    case NotificationType.SYSTEM:
      return 'bell'
  }
}
```

## パフォーマンス最適化

### 仮想スクロール
```typescript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={notifications.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <NotificationItem notification={notifications[index]} />
    </div>
  )}
</FixedSizeList>
```

### メモ化
```typescript
const NotificationItem = memo(({ notification, onMarkAsRead }: Props) => {
  // コンポーネント実装
}, (prev, next) => {
  return prev.notification.id === next.notification.id &&
         prev.notification.readAt === next.notification.readAt
})
```

## エラーハンドリング

### 個別エラー
```typescript
const { mutate: markAsRead } = useMarkAsRead({
  onError: (error, notificationId) => {
    logger.error('既読マーク失敗', { notificationId, error })
    showNotification({
      title: 'エラー',
      message: '既読マークに失敗しました',
      color: 'red',
    })
  },
})
```

### リスト取得エラー
```typescript
const { data, error, isError } = useNotifications()

if (isError) {
  return (
    <ErrorState
      message="通知の取得に失敗しました"
      onRetry={() => queryClient.invalidateQueries(['notifications'])}
    />
  )
}
```
