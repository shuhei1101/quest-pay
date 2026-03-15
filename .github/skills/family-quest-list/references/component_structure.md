(2026年3月15日 14:30記載)

# 家族クエスト一覧画面 コンポーネント構造

## ファイル構成

```
packages/web/app/(app)/quests/family/
├── page.tsx                                # リダイレクト専用（サーバーコンポーネント）
├── FamilyQuestsScreen.tsx                  # 一覧画面メイン（タブ制御）
└── _components/
    ├── FamilyQuestList.tsx                 # 家族クエスト一覧表示
    ├── FamilyQuestCardLayout.tsx           # クエストカードレイアウト
    ├── FamilyQuestFilter.tsx               # フィルタコンポーネント
    ├── FamilyQuestFilterPopup.tsx          # フィルタポップアップ
    └── FamilyQuestSortPopup.tsx            # ソートポップアップ

packages/web/app/(app)/quests/public/
└── PublicQuestList.tsx                     # 公開クエスト一覧（タブ）

packages/web/app/(app)/quests/template/_components/
└── TemplateQuestList.tsx                   # テンプレートクエスト一覧（タブ）
```

## コンポーネント階層

```
page.tsx (Server Component - リダイレクト)
└── FamilyQuestsScreen (Client Component)
    ├── PageHeader
    ├── Tabs
    │   ├── TabsList
    │   │   ├── Tab: 公開
    │   │   ├── Tab: 家族
    │   │   ├── Tab: 違反リスト
    │   │   └── Tab: テンプレート
    │   └── TabsPanel
    │       ├── PublicQuestList（公開タブ）
    │       ├── FamilyQuestList（家族タブ）
    │       │   ├── QuestListLayout
    │       │   │   ├── 検索バー
    │       │   │   ├── カテゴリタブ
    │       │   │   ├── フィルター/ソートボタン
    │       │   │   └── FamilyQuestCardLayout × N
    │       │   ├── FamilyQuestFilterPopup
    │       │   └── FamilyQuestSortPopup
    │       ├── 違反リストコンテンツ（未実装）
    │       └── TemplateQuestList（テンプレートタブ）
    └── SubMenuFAB（新規作成ボタン）
```

---

## 主要コンポーネント

### FamilyQuestsScreen
**パス**: `app/(app)/quests/family/FamilyQuestsScreen.tsx`  
**タイプ**: Client Component (`"use client"`)

**責務**:
- タブ制御（公開/家族/違反リスト/テンプレート）
- URLクエリパラメータとタブ状態の同期
- FloatingActionButton配置

**使用フック**:
- `useSearchParams()`: クエリパラメータ取得
- `useRouter()`: URL操作
- `useLoginUserInfo()`: ログインユーザー情報
- `useWindow()`: デバイス判定
- `useTabAutoScroll()`: タブ自動スクロール
- `useTabHorizontalScroll()`: タブ横スクロール

**状態管理**:
```typescript
const [tabValue, setTabValue] = useState<string | null>('public')
```

**タブ値定義**:
```typescript
const VALID_TABS = ['public', 'family', 'penalty', 'template'] as const
```

**主要処理**:
- クエリパラメータからタブ値取得
- タブ変更時にURLクエリパラメータ更新
- タブごとに異なる色を適用

**タブカラー**:
- 公開: `rgb(96 165 250)` (青)
- 家族: `rgb(74, 222, 128)` (緑)
- 違反リスト: `rgb(252, 132, 132)` (赤)
- テンプレート: `rgb(250 204 21)` (黄)

---

### FamilyQuestList
**パス**: `app/(app)/quests/family/_components/FamilyQuestList.tsx`  
**タイプ**: Client Component

**責務**:
- 家族クエスト一覧の取得・表示
- フィルタリング・ソート機能
- カテゴリ切り替え
- ページネーション

**使用フック**:
- `useFamilyQuests()`: クエストデータ取得
- `useQuestCategories()`: カテゴリ取得
- `useDisclosure()`: ポップアップ制御

**状態管理**:
```typescript
const [questFilter, setQuestFilter] = useState<FamilyQuestFilterType>({ tags: [] })
const [searchFilter, setSearchFilter] = useState<FamilyQuestFilterType>({ tags: [] })
const [sort, setSort] = useState<QuestSort>({ column: "id", order: "asc" })
const [page, setPage] = useState<number>(1)
const pageSize = 30
```

**フィルタ型定義**:
```typescript
type FamilyQuestFilterType = {
  name?: string           // クエスト名
  categoryId?: string     // カテゴリID
  tags?: string[]         // タグ一覧
  minReward?: number      // 最小報酬
  maxReward?: number      // 最大報酬
}
```

**ソート型定義**:
```typescript
type QuestSort = {
  column: 'id' | 'title' | 'createdAt' | 'reward'
  order: 'asc' | 'desc'
}
```

---

### QuestListLayout
**パス**: `app/(app)/quests/_components/QuestListLayout.tsx`  
**タイプ**: Client Component

**責務**:
- クエスト一覧の共通レイアウト提供
- 検索バー表示
- カテゴリタブ表示
- フィルター/ソートボタン表示
- ページネーション表示

**Props**:
```typescript
{
  questCards: React.ReactNode[]       // クエストカード配列
  currentPage: number                  // 現在ページ
  totalPages: number                   // 総ページ数
  onPageChange: (page: number) => void
  onSearchChange: (text: string) => void
  onFilterClick?: () => void
  onSortClick?: () => void
  categories?: Category[]
  onCategoryChange?: (categoryId?: string) => void
  isLoading?: boolean
}
```

**レイアウト構造**:
```tsx
<Stack>
  {/* 検索バー */}
  <TextInput placeholder="検索..." />
  
  {/* カテゴリタブ */}
  <Tabs>
    <Tab value="all">すべて</Tab>
    {categories.map(cat => <Tab>{cat.name}</Tab>)}
  </Tabs>
  
  {/* フィルター/ソートボタン */}
  <Group>
    <Button onClick={onFilterClick}>フィルター</Button>
    <Button onClick={onSortClick}>並び替え</Button>
  </Group>
  
  {/* クエストカード一覧 */}
  {questCards}
  
  {/* ページネーション */}
  <Pagination page={currentPage} total={totalPages} />
</Stack>
```

---

### FamilyQuestCardLayout
**パス**: `app/(app)/quests/family/_components/FamilyQuestCardLayout.tsx`

**責務**:
- 家族クエスト情報の表示
- クリックイベントハンドリング

**Props**:
```typescript
{
  familyQuest: FamilyQuest
  onClick?: (questId: string) => void
}
```

**表示項目**:
- タイトル
- カテゴリアイコン
- 報酬額（各レベル）
- 作成日
- 公開状態

---

### FamilyQuestFilterPopup
**パス**: `app/(app)/quests/family/_components/FamilyQuestFilterPopup.tsx`

**責務**:
- フィルター条件入力UI提供
- フィルター適用処理

**Props**:
```typescript
{
  close: () => void
  handleSearch: (filter: FamilyQuestFilterType) => void
}
```

**フィルター項目**:
- クエスト名（部分一致）
- カテゴリ選択
- タグ選択
- 報酬範囲（最小/最大）

---

### FamilyQuestSortPopup
**パス**: `app/(app)/quests/family/_components/FamilyQuestSortPopup.tsx`

**責務**:
- ソート条件選択UI提供
- ソート適用処理

**Props**:
```typescript
{
  close: () => void
  handleSearch: (sort: QuestSort) => void
}
```

**ソート項目**:
- ID順
- タイトル順
- 作成日順
- 報酬額順
- 昇順/降順切り替え

---

## レイアウトパターン

### デスクトップ表示
```
┌────────────────────────────────────────┐
│  ページヘッダー: "クエスト一覧"        │
├────────────────────────────────────────┤
│  [公開] [家族] [違反リスト] [テンプレ] │━━ タブ
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │ 検索バー                          │  │
│  ├──────────────────────────────────┤  │
│  │ [すべて] [掃除] [料理] ...       │━━ カテゴリタブ
│  ├──────────────────────────────────┤  │
│  │ [フィルター] [並び替え]          │  │
│  ├──────────────────────────────────┤  │
│  │  ┌────────────────────────────┐  │  │
│  │  │ FamilyQuestCard 1          │  │  │
│  │  ├────────────────────────────┤  │  │
│  │  │ FamilyQuestCard 2          │  │  │
│  │  └────────────────────────────┘  │  │
│  ├──────────────────────────────────┤  │
│  │  ← 1 2 3 ... 10 →              │━━ ページネーション
│  └──────────────────────────────────┘  │
│                                        │
│  [FloatingActionButton: +]             │
└────────────────────────────────────────┘
```

### モバイル表示
- タブは横スクロール可能
- カテゴリタブも横スクロール
- カードは画面幅に追従
- FABは画面右下固定

---

## スタイリング

### タブスタイル
```typescript
<Tabs variant="pills" color={tabColor}>
  <Tabs.List>
    <div className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
      <Tabs.Tab>{...}</Tabs.Tab>
    </div>
  </Tabs.List>
</Tabs>
```

### カードスタイル
```typescript
<Paper p="xs" withBorder>
  <Stack gap={4}>
    {questCards}
  </Stack>
</Paper>
```

### ページネーション
```typescript
<Pagination 
  page={currentPage} 
  total={totalPages}
  onChange={handlePageChange}
  color="blue"
/>
```
