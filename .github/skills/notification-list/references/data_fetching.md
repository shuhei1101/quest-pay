(2026年3月記載)

# 通知一覧 データ取得パターン

## API構造

### エンドポイント
- `GET /api/notifications`: 通知一覧取得
- `PUT /api/notifications/[id]/read`: 既読マーク
- `PUT /api/notifications/read-all`: 全件既読マーク

### ファイル構成
```
packages/web/app/api/notifications/
├── route.ts                    # GET（一覧）、POST（作成）
├── client.ts                   # APIクライアント関数
├── query.ts                    # React Queryフック
├── [id]/
│   ├── route.ts               # GET（詳細）、DELETE（削除）
│   └── read/
│       └── route.ts           # PUT（既読マーク）
└── read-all/
    └── route.ts               # PUT（全件既読）
```

## React Query フック

### useNotifications
**ファイル**: `app/(app)/notifications/_hooks/useNotifications.ts`

```typescript
export function useNotifications(filter?: 'all' | 'unread' | 'read') {
  return useQuery({
    queryKey: ['notifications', filter],
    queryFn: () => fetchNotifications(filter),
    staleTime: 1000 * 60, // 1分
    refetchInterval: 1000 * 60 * 5, // 5分ごと自動更新
  })
}
```

**特徴**:
- フィルタ条件をクエリキーに含める
- 定期的な自動更新（5分間隔）
- 未読数をリアルタイム反映

### useMarkAsRead
**ファイル**: `app/(app)/notifications/_hooks/useMarkAsRead.ts`

```typescript
export function useMarkAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => {
      // 通知一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      // 未読数を更新
      queryClient.invalidateQueries({ queryKey: ['notification-count'] })
    },
  })
}
```

**特徴**:
- 楽観的更新（Optimistic Update）
- 未読数バッジの即座反映
- エラー時のロールバック

## データフロー

### 初期ロード
```
Component Mount
    ↓
useNotifications()
    ↓
React Query Cache Check
    ↓
API Call: GET /api/notifications
    ↓
Database Query
    ↓
Response: notifications[]
    ↓
Cache Update
    ↓
Component Re-render
```

### 既読マーク
```
User Click "Mark as Read"
    ↓
useMarkAsRead.mutate(id)
    ↓
Optimistic Update (UI即座反映)
    ↓
API Call: PUT /api/notifications/[id]/read
    ↓
Database Update
    ↓
success → invalidateQueries(['notifications'])
    ↓
Background Refetch
    ↓
Cache Update
```

## キャッシュ戦略

### クエリキー構造
```typescript
['notifications']                    // 全通知
['notifications', 'unread']          // 未読のみ
['notifications', 'read']            // 既読のみ
['notification-count']               // 未読数
['notification-count', userId]       // ユーザー別未読数
```

### Stale Time
- 通知一覧: 1分
- 未読数: 30秒

### Refetch Interval
- 通知一覧: 5分
- 未読数: 2分

## エラーハンドリング

### ネットワークエラー
```typescript
if (error) {
  return <ErrorState message="通知の取得に失敗しました" />
}
```

### 空データ
```typescript
if (!notifications || notifications.length === 0) {
  return <EmptyState message="通知がありません" />
}
```

## リアルタイム更新

### Supabase Realtime（将来実装）
```typescript
useEffect(() => {
  const subscription = supabase
    .channel('notifications')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    })
    .subscribe()
    
  return () => subscription.unsubscribe()
}, [userId])
```

## パフォーマンス最適化

### メモ化
```typescript
const filteredNotifications = useMemo(() => {
  return notifications?.filter(n => 
    filter === 'all' || 
    (filter === 'unread' && !n.readAt) ||
    (filter === 'read' && n.readAt)
  )
}, [notifications, filter])
```

### 仮想スクロール（大量データ時）
```typescript
import { VirtualScroller } from '@/components/VirtualScroller'

<VirtualScroller
  items={notifications}
  itemHeight={80}
  renderItem={(notification) => (
    <NotificationItem notification={notification} />
  )}
/>
```
