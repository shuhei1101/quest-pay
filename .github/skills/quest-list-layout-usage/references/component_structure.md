# クエストリストレイアウト - コンポーネント構造

**最終更新:** 2026年3月記載

## コンポーネント階層

```
QuestListLayout (app/(app)/quests/_components/QuestListLayout.tsx)
├── QuestCategoryTabs (app/(app)/quests/_components/QuestCategoryTabs.tsx)
│   └── Mantine Tabs
├── QuestSearchBar (app/(app)/quests/_components/QuestSearchBar.tsx)
│   ├── Mantine Input
│   └── Action Icons (Filter, Sort) with Indicator badges
├── QuestGrid (app/(app)/quests/_components/QuestGrid.tsx)
│   ├── renderQuestCard() × N (カスタムレンダリング関数)
│   └── Sentinel div (無限スクロール検知用)
└── Loading State (Mantine Loader)
```

## 主要コンポーネント

### QuestListLayout

**ファイル:** `app/(app)/quests/_components/QuestListLayout.tsx`

**責務:**
- クエスト一覧の統合レイアウト管理
- カテゴリタブ、検索バー、クエストグリッドの統合
- 無限スクロール制御
- ページネーション管理

**主要Props:**
```typescript
{
  quests: T[]                           // 表示クエスト配列
  page: number                          // 現在ページ番号
  maxPage: number                       // 最大ページ番号
  totalRecords: number                  // 総レコード数
  isLoading: boolean                    // ローディング状態
  onPageChange: (page: number) => void  // ページ変更ハンドラ
  onSearchTextChange: (text: string) => void  // 検索テキスト変更ハンドラ
  onSearch: () => void                  // 検索実行ハンドラ
  renderQuestCard: (quest: T, index: number) => ReactNode  // カード描画関数
  questCategories: QuestCategorySelect[]  // カテゴリ一覧
  questCategoryById?: QuestCategoryById  // カテゴリID辞書
  filterPopup: ReactNode                // フィルターポップアップ
  sortPopup: ReactNode                  // ソートポップアップ
  onFilterOpen: () => void              // フィルター開くハンドラ
  onSortOpen: () => void                // ソート開くハンドラ
  onCategoryChange: (categoryId: string | undefined) => void  // カテゴリ変更ハンドラ
  filterCount?: number                  // フィルター適用数（バッジ表示用）
  sortCount?: number                    // ソート適用数（バッジ表示用）
  searchText?: string                   // 検索テキスト（制御コンポーネント用）
}
```

**主要機能:**
1. **無限スクロール:** Intersection Observer APIで画面下部検知、自動次ページ取得
2. **カテゴリフィルタリング:** タブ切替でカテゴリIDを解決
3. **検索テキスト連動:** 検索バーとフィルターポップアップで双方向同期
4. **ページ管理:** 初回検索時（page=1）はリセット、追加ロード時は配列結合

### QuestSearchBar

**ファイル:** `app/(app)/quests/_components/QuestSearchBar.tsx`

**責務:**
- クエスト名検索入力
- フィルター・ソートボタン（バッジ付き）
- IME対応のEnterキー検索

**主要Props:**
```typescript
{
  onSearch: (searchText: string) => void  // 検索実行ハンドラ
  onFilterClick: () => void               // フィルターボタンクリック
  onSortClick: () => void                 // ソートボタンクリック
  onSearchTextChange?: (text: string) => void  // リアルタイム変更通知
  placeholder?: string                    // 入力欄プレースホルダー
  value?: string                          // 制御コンポーネント用値
  filterCount?: number                    // フィルター適用数（デフォルト: 0）
  sortCount?: number                      // ソート適用数（デフォルト: 0）
}
```

**実装詳細:**
- **制御/非制御切替:** `value` prop指定時は制御コンポーネント、未指定時は内部状態使用
- **リアルタイム通知:** `onChange`で`onSearchTextChange`を即座に呼び出し
- **IME対応:** `isComposing`フラグでEnterキー誤動作を防止
- **バッジ表示:** `Indicator`コンポーネントでフィルター/ソート適用数を可視化

### QuestCategoryTabs

**ファイル:** `app/(app)/quests/_components/QuestCategoryTabs.tsx`

**責務:**
- カテゴリタブ表示（「すべて」「カテゴリ名」「その他」）
- タブリストの動的生成

**内部動作:**
1. タブリスト生成: `["すべて", ...questCategories.map(c => c.name), "その他"]`
2. カテゴリID解決: カテゴリ名→IDマッピング（`questCategoryById`使用）
3. 特殊値: "すべて" → undefined、"その他" → "null"

### QuestGrid

**ファイル:** `app/(app)/quests/_components/QuestGrid.tsx`

**責務:**
- クエストカードのグリッド表示
- 無限スクロール用センチネル要素配置

**構造:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {quests.map((quest, index) => renderQuestCard(quest, index))}
  <div ref={sentinelRef} /> {/* 無限スクロール検知用 */}
</div>
```

## フィルタリング・ソート機能

### バッジ表示システム

**適用数の計算例（FamilyQuestList）:**
```typescript
const filterCount = useMemo(() => {
  let count = 0
  if (searchFilter.name && searchFilter.name.trim() !== '') count++
  if (searchFilter.tags && searchFilter.tags.length > 0) count += searchFilter.tags.length
  if (searchFilter.categoryId) count++
  return count
}, [searchFilter])

const sortCount = useMemo(() => {
  return (sort.column !== 'id' || sort.order !== 'asc') ? 1 : 0
}, [sort])
```

### 検索テキスト連動フロー

1. **検索バー入力 →** `onSearchTextChange(text)` → 親の`questFilter.name`更新
2. **フィルターポップアップ開く →** `currentFilter.name`として検索バーの値表示
3. **フィルターポップアップで検索 →** `questFilter.name`更新 → `searchText` prop経由で検索バー更新

**キーポイント:**
- QuestSearchBarは制御コンポーネント（`value` propで外部制御）
- リアルタイム同期により、検索バーとポップアップの値が常に一致

## データフロー

### 無限スクロール

```
1. Intersection Observer でセンチネル要素を監視
2. entry.isIntersecting === true 検出
3. page < maxPage && !isLoading を確認
4. onPageChange(page + 1) 実行
5. 親コンポーネントがAPI呼び出し
6. quests配列が更新される
7. useEffect内で displayQuests に追加ロード分を結合
```

### 検索フロー

```
1. 検索バー入力 → onSearchTextChange → questFilter更新
2. Enterキーまたは検索ボタン → onSearch実行
3. 親がクエリパラメータをURLに反映
4. searchFilterを更新してAPI再取得
5. page=1になるため、displayQuestsがリセット
```

## 技術仕様

### 依存ライブラリ
- **Mantine:** Tabs, Input, ActionIcon, Indicator, Loader, Center
- **@mantine/hooks:** useDisclosure, useIntersection
- **@tabler/icons-react:** IconSearch, IconFilter, IconArrowsSort

### パフォーマンス最適化
- `memo`によるコンポーネントメモ化
- `useMemo`/`useCallback`による再計算抑制
- 無限スクロールによる段階的データ取得

### レスポンシブ対応
- Tailwind CSS グリッド: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- ローディング高さ: `calc(100vh - 200px)`
