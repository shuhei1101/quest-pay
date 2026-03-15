(2026年3月記載)

# ホーム画面のコンポーネント構造

## コンポーネント階層

```
HomeScreen
├── Stack (メインコンテナ)
│   ├── DashboardHeader
│   │   └── Title + Badge (ユーザーロール表示)
│   ├── DashboardSummary
│   │   ├── Grid (レスポンシブカード配置)
│   │   ├── StatCard (統計情報カード)
│   │   │   ├── Icon (アイコン)
│   │   │   ├── Text (数値)
│   │   │   └── Text (ラベル)
│   │   └── QuickActionCard (クイックアクションカード)
│   │       ├── Icon
│   │       ├── Text (タイトル)
│   │       └── Button
│   ├── RecentQuests (最近のクエスト)
│   │   ├── SectionHeader
│   │   └── QuestList
│   │       └── QuestCard[] (クエストカード一覧)
│   └── RecentNotifications (最近の通知)
│       ├── SectionHeader
│       └── NotificationList
│           └── NotificationItem[] (通知アイテム一覧)
```

## 主要コンポーネント詳細

### HomeScreen
**ファイル**: `packages/web/app/(app)/home/page.tsx`

**責務**:
- ホーム画面全体の統合管理
- ユーザーロール（親 or 子供）に応じた表示制御
- データ取得とローディング状態の管理

**主要フック**:
```typescript
const { userInfo } = useLoginUserInfo()          // ログインユーザー情報
const { summary, isLoading } = useHomeSummary()  // ホームサマリーデータ
const { recentQuests } = useRecentQuests()       // 最近のクエスト
const { notifications } = useRecentNotifications() // 最近の通知
```

**レイアウト構造**:
```tsx
<Stack gap="lg" p="md">
  {/* ヘッダー: タイトル + ロールバッジ */}
  <DashboardHeader role={userInfo?.profiles?.type} />
  
  {/* サマリー情報 */}
  {isLoading ? (
    <LoadingOverlay visible />
  ) : (
    <DashboardSummary summary={summary} role={userInfo?.profiles?.type} />
  )}
  
  {/* 最近のクエスト */}
  <RecentQuests quests={recentQuests} />
  
  {/* 最近の通知 */}
  <RecentNotifications notifications={notifications} />
</Stack>
```

### DashboardHeader
**ファイル**: `packages/web/app/(app)/home/_components/DashboardHeader.tsx`

**責務**:
- ホーム画面のヘッダー表示
- ユーザーロール（親 or 子供）の表示

**Props**:
```typescript
{
  role: "parent" | "child"  // ユーザーロール
}
```

**UI構造**:
```tsx
<Group justify="space-between" mb="md">
  <Title order={2}>ホーム</Title>
  <Badge 
    size="lg" 
    variant="gradient"
    gradient={role === "parent" ? { from: "blue", to: "cyan" } : { from: "orange", to: "red" }}
  >
    {role === "parent" ? "親" : "子供"}
  </Badge>
</Group>
```

### DashboardSummary
**ファイル**: `packages/web/app/(app)/home/_components/DashboardSummary.tsx`

**責務**:
- ユーザーの統計情報をカード形式で表示
- ロールに応じて表示内容を切り替え
- クイックアクションの提供

**Props**:
```typescript
{
  summary: {
    totalQuests?: number        // 総クエスト数
    activeQuests?: number       // アクティブなクエスト数
    completedQuests?: number    // 完了済みクエスト数
    totalRewards?: number       // 総報酬額
    currentLevel?: number       // 現在のレベル
    experiencePoints?: number   // 経験値
    // ... その他の統計情報
  }
  role: "parent" | "child"
}
```

**レイアウト構造**:
```tsx
<Grid gutter="md">
  {/* 親の場合の統計カード */}
  {role === "parent" && (
    <>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={<IconClipboardList />}
          value={summary.totalQuests}
          label="総クエスト数"
          color="blue"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={<IconClock />}
          value={summary.activeQuests}
          label="アクティブ"
          color="orange"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={<IconCheck />}
          value={summary.completedQuests}
          label="完了済み"
          color="green"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <QuickActionCard
          icon={<IconPlus />}
          title="新規クエスト作成"
          buttonText="作成"
          onClick={() => router.push(FAMILY_QUEST_NEW_URL)}
        />
      </Grid.Col>
    </>
  )}
  
  {/* 子供の場合の統計カード */}
  {role === "child" && (
    <>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={<IconTrophy />}
          value={summary.currentLevel}
          label="レベル"
          color="yellow"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={<IconStar />}
          value={summary.experiencePoints}
          label="経験値"
          color="purple"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <StatCard
          icon={<IconCoins />}
          value={summary.totalRewards}
          label="獲得報酬"
          color="green"
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <QuickActionCard
          icon={<IconSearch />}
          title="クエスト探す"
          buttonText="探す"
          onClick={() => router.push(FAMILY_QUEST_LIST_URL)}
        />
      </Grid.Col>
    </>
  )}
</Grid>
```

**レスポンシブ設計**:
- **base (モバイル)**: 1列表示 (`span: 12`)
- **sm (タブレット)**: 2列表示 (`span: 6`)
- **md (デスクトップ)**: 4列表示 (`span: 3`)

### StatCard
**ファイル**: `packages/web/app/(app)/home/_components/StatCard.tsx`

**責務**:
- 統計情報を視覚的に表示
- アイコン + 数値 + ラベルの3要素構成

**Props**:
```typescript
{
  icon: ReactNode       // アイコン
  value: number | string // 数値
  label: string         // ラベル
  color: MantineColor   // カラーテーマ
}
```

**UI構造**:
```tsx
<Paper p="md" radius="md" withBorder>
  <Stack gap="xs" align="center">
    {/* アイコン */}
    <Box 
      style={{
        backgroundColor: `var(--mantine-color-${color}-light)`,
        borderRadius: "50%",
        padding: "0.75rem",
      }}
    >
      {icon}
    </Box>
    
    {/* 数値 */}
    <Text size="2rem" fw={700}>
      {value}
    </Text>
    
    {/* ラベル */}
    <Text size="sm" c="dimmed">
      {label}
    </Text>
  </Stack>
</Paper>
```

**デザイン仕様**:
- **Paper**: `withBorder` で境界線付き
- **アイコン背景**: カラーテーマの `light` バリアント
- **アイコン形状**: 円形 (`borderRadius: "50%"`)
- **数値**: 大きめのフォントサイズ (`2rem`)、太字 (`fw={700}`)
- **ラベル**: グレーテキスト (`c="dimmed"`)

### QuickActionCard
**ファイル**: `packages/web/app/(app)/home/_components/QuickActionCard.tsx`

**責務**:
- クイックアクションをカード形式で提供
- アイコン + タイトル + ボタンの3要素構成

**Props**:
```typescript
{
  icon: ReactNode     // アイコン
  title: string       // タイトル
  buttonText: string  // ボタンテキスト
  onClick: () => void // クリックハンドラー
}
```

**UI構造**:
```tsx
<Paper p="md" radius="md" withBorder style={{ cursor: "pointer" }} onClick={onClick}>
  <Stack gap="xs" align="center">
    {/* アイコン */}
    <Box 
      style={{
        backgroundColor: "var(--mantine-color-blue-light)",
        borderRadius: "50%",
        padding: "0.75rem",
      }}
    >
      {icon}
    </Box>
    
    {/* タイトル */}
    <Text size="sm" fw={600} ta="center">
      {title}
    </Text>
    
    {/* ボタン */}
    <Button size="xs" variant="light" fullWidth>
      {buttonText}
    </Button>
  </Stack>
</Paper>
```

**デザイン仕様**:
- **Paper**: `cursor: "pointer"` でクリック可能を示唆
- **onClick**: Paperクリック全体でアクション実行（UX向上）
- **Button**: `size="xs"`, `variant="light"`, `fullWidth`

### RecentQuests
**ファイル**: `packages/web/app/(app)/home/_components/RecentQuests.tsx`

**責務**:
- 最近のクエストを一覧表示
- 最大5件まで表示
- "もっと見る"リンクで一覧ページへ遷移

**Props**:
```typescript
{
  quests: {
    id: string
    title: string
    reward: number
    status: "not_started" | "in_progress" | "pending_review" | "completed"
    dueDate?: string
  }[]
}
```

**UI構造**:
```tsx
<Box>
  {/* セクションヘッダー */}
  <Group justify="space-between" mb="sm">
    <Title order={3}>最近のクエスト</Title>
    <Button 
      variant="subtle" 
      size="xs"
      component={Link}
      href={CHILD_QUEST_LIST_URL}
    >
      もっと見る
    </Button>
  </Group>
  
  {/* クエスト一覧 */}
  <Stack gap="xs">
    {quests.slice(0, 5).map((quest) => (
      <QuestCard key={quest.id} quest={quest} />
    ))}
  </Stack>
</Box>
```

### QuestCard
**ファイル**: `packages/web/app/(app)/home/_components/QuestCard.tsx`

**責務**:
- クエスト情報をカード形式で表示
- ステータスバッジの表示
- クリックでクエスト詳細ページへ遷移

**Props**:
```typescript
{
  quest: {
    id: string
    title: string
    reward: number
    status: QuestStatus
    dueDate?: string
  }
}
```

**UI構造**:
```tsx
<Paper 
  p="sm" 
  radius="md" 
  withBorder 
  style={{ cursor: "pointer" }}
  onClick={() => router.push(`/quests/${quest.id}`)}
>
  <Group justify="space-between" wrap="nowrap">
    {/* 左側: タイトル + ステータス */}
    <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
      <Text fw={600} truncate>{quest.title}</Text>
      <Badge size="sm" color={getStatusColor(quest.status)}>
        {getStatusLabel(quest.status)}
      </Badge>
    </Stack>
    
    {/* 右側: 報酬額 */}
    <Group gap="xs" style={{ flexShrink: 0 }}>
      <IconCoins size={16} />
      <Text fw={700}>{quest.reward}円</Text>
    </Group>
  </Group>
</Paper>
```

**ステータス色の定義**:
```typescript
const getStatusColor = (status: QuestStatus): MantineColor => {
  switch (status) {
    case "not_started": return "gray"
    case "in_progress": return "blue"
    case "pending_review": return "orange"
    case "completed": return "green"
    default: return "gray"
  }
}

const getStatusLabel = (status: QuestStatus): string => {
  switch (status) {
    case "not_started": return "未着手"
    case "in_progress": return "進行中"
    case "pending_review": return "確認待ち"
    case "completed": return "完了"
    default: return "未着手"
  }
}
```

### RecentNotifications
**ファイル**: `packages/web/app/(app)/home/_components/RecentNotifications.tsx`

**責務**:
- 最近の通知を一覧表示
- 最大5件まで表示
- "もっと見る"リンクで通知一覧ページへ遷移

**Props**:
```typescript
{
  notifications: {
    id: string
    type: "quest_approved" | "quest_rejected" | "new_quest" | "comment"
    title: string
    message: string
    createdAt: string
    isRead: boolean
  }[]
}
```

**UI構造**:
```tsx
<Box>
  {/* セクションヘッダー */}
  <Group justify="space-between" mb="sm">
    <Title order={3}>最近の通知</Title>
    <Button 
      variant="subtle" 
      size="xs"
      component={Link}
      href={NOTIFICATION_LIST_URL}
    >
      もっと見る
    </Button>
  </Group>
  
  {/* 通知一覧 */}
  <Stack gap="xs">
    {notifications.slice(0, 5).map((notification) => (
      <NotificationItem key={notification.id} notification={notification} />
    ))}
  </Stack>
</Box>
```

### NotificationItem
**ファイル**: `packages/web/app/(app)/home/_components/NotificationItem.tsx`

**責務**:
- 通知情報をアイテム形式で表示
- 未読・既読の視覚的な区別
- クリックで通知詳細 or 関連ページへ遷移

**Props**:
```typescript
{
  notification: {
    id: string
    type: NotificationType
    title: string
    message: string
    createdAt: string
    isRead: boolean
  }
}
```

**UI構造**:
```tsx
<Paper 
  p="sm" 
  radius="md" 
  withBorder 
  style={{ 
    cursor: "pointer",
    backgroundColor: notification.isRead ? "transparent" : "var(--mantine-color-blue-light)",
  }}
  onClick={handleClick}
>
  <Group gap="sm" wrap="nowrap">
    {/* 通知アイコン */}
    <Box style={{ flexShrink: 0 }}>
      {getNotificationIcon(notification.type)}
    </Box>
    
    {/* 通知内容 */}
    <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
      <Text fw={600} size="sm" truncate>{notification.title}</Text>
      <Text size="xs" c="dimmed" truncate>{notification.message}</Text>
      <Text size="xs" c="dimmed">
        {formatRelativeTime(notification.createdAt)}
      </Text>
    </Stack>
    
    {/* 未読バッジ */}
    {!notification.isRead && (
      <Box 
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "var(--mantine-color-blue-filled)",
          flexShrink: 0,
        }}
      />
    )}
  </Group>
</Paper>
```

**通知アイコンの定義**:
```typescript
const getNotificationIcon = (type: NotificationType): ReactNode => {
  switch (type) {
    case "quest_approved": return <IconCheck size={20} color="green" />
    case "quest_rejected": return <IconX size={20} color="red" />
    case "new_quest": return <IconBell size={20} color="blue" />
    case "comment": return <IconMessage size={20} color="orange" />
    default: return <IconBell size={20} />
  }
}
```

## データ取得フックの詳細

### useHomeSummary
**ファイル**: `packages/web/app/(app)/home/_hooks/useHomeSummary.ts`

**責務**:
- ホーム画面のサマリーデータ取得
- ユーザーロールに応じたデータ集計

**返り値**:
```typescript
{
  summary: HomeSummary | undefined
  isLoading: boolean
  error: Error | null
}
```

**API呼び出し**:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["homeSummary"],
  queryFn: () => fetchHomeSummary(),
  staleTime: 5 * 60 * 1000,  // 5分間キャッシュ
})
```

### useRecentQuests
**ファイル**: `packages/web/app/(app)/home/_hooks/useRecentQuests.ts`

**責務**:
- 最近のクエストを取得（最大10件）
- ユーザーロールに応じて親クエスト or 子供クエストを取得

**返り値**:
```typescript
{
  recentQuests: Quest[]
  isLoading: boolean
  error: Error | null
}
```

### useRecentNotifications
**ファイル**: `packages/web/app/(app)/home/_hooks/useRecentNotifications.ts`

**責務**:
- 最近の通知を取得（最大10件）
- 未読通知を優先表示

**返り値**:
```typescript
{
  notifications: Notification[]
  isLoading: boolean
  error: Error | null
}
```

## レスポンシブデザインパターン

### Grid breakpoints
```typescript
{
  base: 12,   // モバイル: 1列
  sm: 6,      // タブレット: 2列
  md: 3,      // デスクトップ: 4列
}
```

### Padding調整
```typescript
<Stack gap="lg" p={{ base: "sm", sm: "md", md: "lg" }}>
  {/* 画面サイズに応じてパディング調整 */}
</Stack>
```

## アクセシビリティ対応

- **クリック可能要素**: `cursor: "pointer"` で視覚的フィードバック
- **truncate**: 長いテキストは省略記号で表示
- **contrasting colors**: 視認性の高い色の組み合わせ
- **semantic HTML**: `Title`, `Text`, `Button` などの意味的なコンポーネント使用
