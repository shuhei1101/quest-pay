# Timeline Structure - Component Structure

**記載日**: 2026年3月

## 概要

このドキュメントは、タイムライン画面のコンポーネント構造とレイアウトを定義します。タイムライン画面は、家族内のアクティビティと公開クエストの活動を時系列で表示する画面です。

## ファイル構成

```
/packages/web/app/(app)/timeline/
├── page.tsx                           # エントリーポイント（認証チェック）
├── TimelinesScreen.tsx                # メイン画面コンポーネント
├── _components/
│   ├── TimelineItem.tsx               # 家族タイムラインアイテム
│   └── PublicTimelineItem.tsx         # 公開タイムラインアイテム
├── _hooks/
│   ├── useFamilyTimelines.ts          # 家族タイムライン取得
│   └── usePublicTimelines.ts          # 公開タイムライン取得
└── _utils/
    └── timeUtils.ts                   # 時間関連ユーティリティ
```

## コンポーネント階層

```
page.tsx
└── TimelinesScreen
    ├── PageHeader
    │   └── title: "タイムライン"
    └── ScrollableTabs
        ├── Tab: "家族" (IconHome2)
        │   └── Panel: 家族タイムライン
        │       ├── Loader (ロード中)
        │       └── Stack
        │           └── TimelineItem[]
        │               ├── Card
        │               │   └── Group
        │               │       ├── Avatar (プロフィールアイコン)
        │               │       └── Content
        │               │           ├── Text (プロフィール名)
        │               │           ├── Text (メッセージ)
        │               │           └── Text (タイムスタンプ)
        │               └── ...
        └── Tab: "公開" (IconWorld) ※親ユーザーのみ
            └── Panel: 公開タイムライン
                ├── Loader (ロード中)
                └── Stack
                    └── PublicTimelineItem[]
                        ├── Card
                        │   └── Group
                        │       ├── Avatar (家族アイコン)
                        │       └── Content
                        │           ├── Text (家族オンライン名)
                        │           ├── Text (メッセージ)
                        │           └── Text (タイムスタンプ)
                        └── ...
```

## メインコンポーネント詳細

### TimelinesScreen

**責務**: タイムラインの表示とタブ切り替え管理

**State**:
```typescript
const [activeTab, setActiveTab] = useState<string>("family")
```

**主要フック**:
```typescript
// ログインユーザー情報
const {isChild} = useLoginUserInfo()

// 家族タイムライン取得
const { data: familyTimelines, isLoading: isFamilyLoading } = useFamilyTimelines()

// 公開タイムライン取得
const { data: publicTimelines, isLoading: isPublicLoading } = usePublicTimelines()
```

**タブ定義**:
```typescript
const tabs = [
  {
    value: "family",
    label: "家族",
    icon: <IconHome2 size={18} />,
    color: "rgb(74, 222, 128)",
  },
  // 子供ユーザーの場合は公開タブを非表示
  ...(!isChild ? [{
    value: "public",
    label: "公開",
    icon: <IconWorld size={18} />,
    color: "rgb(96 165 250)",
  }] : []),
]
```

### TimelineItem

**責務**: 家族タイムラインの個別アイテム表示

**Props**:
```typescript
type TimelineItemProps = {
  profileName?: string | null      // プロフィール名
  profileIconColor?: string | null // プロフィールアイコン色
  message: string                   // メッセージ内容
  createdAt: string                 // 作成日時
  url?: string | null               // リンク先URL（任意）
}
```

**レイアウト**:
```tsx
<Card onClick={handleClick}>
  <Group>
    <Avatar color={profileIconColor}>
      <IconUser />
    </Avatar>
    <div>
      <Text>{profileName}</Text>
      <Text>{message}</Text>
      <Text>{getRelativeTime(createdAt)}</Text>
    </div>
  </Group>
</Card>
```

### PublicTimelineItem

**責務**: 公開タイムラインの個別アイテム表示

**Props**:
```typescript
type PublicTimelineItemProps = {
  familyOnlineName?: string | null  // 家族オンライン名
  familyIconColor?: string | null   // 家族アイコン色
  message: string                    // メッセージ内容
  createdAt: string                  // 作成日時
  url?: string | null                // リンク先URL（任意）
}
```

## レイアウト構造

### 全体レイアウト

```tsx
<div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  paddingBottom: '100px' // フッター分の余白
}}>
  <PageHeader title="タイムライン" />
  
  <ScrollableTabs
    tabs={tabs}
    activeTab={activeTab}
    onChange={setActiveTab}
  >
    <div style={{ padding: '8px' }}>
      {/* タブコンテンツ */}
    </div>
  </ScrollableTabs>
</div>
```

### タイムラインリストレイアウト

```tsx
<Stack gap="md">
  {timelines.map((timeline) => (
    <TimelineItem key={timeline.id} {...props} />
  ))}
</Stack>
```

### 空状態レイアウト

```tsx
<Center h={200}>
  <Text c="dimmed">タイムラインがありません</Text>
</Center>
```

### ローディング状態

```tsx
<Center h={200}>
  <Loader />
</Center>
```

## データフロー

### 家族タイムライン

```
useFamilyTimelines()
    ↓
React Query (queryKey: ["familyTimelines"])
    ↓
getFamilyTimelines() (API client)
    ↓
/api/timeline/family (GET)
    ↓
{
  timelines: [
    {
      family_timeline: { id, message, createdAt, url },
      profiles: { name, iconColor }
    }
  ]
}
    ↓
TimelinesScreen
    ↓
TimelineItem[]
```

### 公開タイムライン

```
usePublicTimelines()
    ↓
React Query (queryKey: ["publicTimelines"])
    ↓
getPublicTimelines() (API client)
    ↓
/api/timeline/public (GET)
    ↓
{
  timelines: [
    {
      public_timeline: { id, message, createdAt, url },
      families: { onlineName, iconColor }
    }
  ]
}
    ↓
TimelinesScreen
    ↓
PublicTimelineItem[]
```

## インタラクション設計

### タブ切り替え

```typescript
<ScrollableTabs
  activeTab={activeTab}
  onChange={(value) => value && setActiveTab(value)}
>
```

- **初期状態**: "family"タブが選択
- **クリック**: タブ値を更新してコンテンツ切り替え
- **アニメーション**: ScrollableTabsが自動処理

### アイテムクリック

```typescript
const handleClick = () => {
  if (url) {
    router.push(url)
  }
}
```

- **cursor**: URL有り → "pointer", URL無し → "default"
- **遷移先**: クエスト詳細、プロフィール等

### 相対時間表示

```typescript
getRelativeTime(createdAt)
```

- **例**: "2分前", "1時間前", "3日前"
- **ユーティリティ**: `timeUtils.ts` で定義

## スタイリング

### カードスタイル（TimelineItem）

```typescript
<Card 
  shadow="sm"      // 軽い影
  padding="md"     // 中サイズのパディング
  radius="md"      // 中サイズの角丸
  withBorder       // ボーダー付き
  style={{ cursor: url ? "pointer" : "default" }}
  onClick={handleClick}
>
```

### アバタースタイル

```typescript
<Avatar 
  color={profileIconColor || "blue"}  // 動的カラー
  radius="xl"                          // 大きな角丸（円形）
>
  <IconUser size={24} />
</Avatar>
```

### テキストスタイル

```typescript
// プロフィール名
<Text size="sm" fw={600} c="dimmed">

// メッセージ
<Text size="md" mt={4}>

// タイムスタンプ
<Text size="xs" c="dimmed" mt={8}>
```

## 権限制御

### 子供ユーザー

```typescript
const {isChild} = useLoginUserInfo()

const tabs = [
  { value: "family", ... },
  ...(!isChild ? [{ value: "public", ... }] : []),
]
```

- **表示**: 家族タブのみ
- **非表示**: 公開タブ

### 親ユーザー

- **表示**: 家族タブ + 公開タブ

## React Query設定

### キャッシュ戦略

```typescript
// 家族タイムライン
queryKey: ["familyTimelines"]
staleTime: 1000 * 60 * 5  // 5分間キャッシュ

// 公開タイムライン
queryKey: ["publicTimelines"]
staleTime: 1000 * 60 * 5  // 5分間キャッシュ
```

### 自動更新

- **refetch**: タブ切り替え時に自動実行
- **background refetch**: タブがアクティブな間

## アクセシビリティ

- **セマンティック構造**: Card, Group, Stackで明確な階層
- **カーソル表示**: クリック可能な要素はpointer cursor
- **コントラスト**: dimmedカラーで十分な視認性
- **相対時間**: ユーザーフレンドリーな時間表現

## パフォーマンス最適化

- **React Query**: 自動キャッシング、重複リクエスト防止
- **条件付きレンダリング**: タブごとにコンテンツを分離
- **遅延ロード**: Loader表示でUX向上
- **key属性**: 効率的なリスト更新

## 拡張性

### 無限スクロール（将来実装）

```typescript
// useInfiniteQueryへの移行
const { 
  data, 
  fetchNextPage, 
  hasNextPage 
} = useInfiniteQuery({
  queryKey: ["familyTimelines"],
  queryFn: ({ pageParam = 0 }) => getFamilyTimelines(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})
```

### フィルタリング（将来実装）

```typescript
const [filter, setFilter] = useState<string | null>(null)

// フィルタUIの追加
<Select
  data={["すべて", "クエスト", "報酬", "メンバー"]}
  value={filter}
  onChange={setFilter}
/>
```

### 通知連携（将来実装）

```typescript
// 新着バッジ表示
<Badge>3</Badge>
```
