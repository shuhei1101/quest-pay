---
name: quest-list
description: 'クエスト一覧機能の知識を提供するスキル。QuestListLayout共通コンポーネント・検索バー・カテゴリタブ・無限スクロールの使い方と、各クエストタイプ（家族/公開/子供/テンプレート）一覧APIの5層構成（route/service/query/db）を含む。'
---

# クエスト一覧 スキル

## 概要

クエスト一覧画面で使用する共通レイアウトコンポーネント `QuestListLayout` と、各クエストタイプの一覧取得 API（家族・公開・子供・テンプレート）の実装パターンを提供する。

---

## フロントエンド

### メインソースファイル

- `packages/web/app/(app)/quests/_components/QuestListLayout.tsx`: 共通一覧レイアウト
- `packages/web/app/(app)/quests/_components/QuestSearchBar.tsx`: 検索バー
- `packages/web/app/(app)/quests/_components/QuestCategoryTabs.tsx`: カテゴリタブ
- `packages/web/app/(app)/quests/_components/QuestGrid.tsx`: クエストグリッド
- `packages/web/app/(app)/quests/_components/questTabConstants.ts`: タブ定数定義

### コンポーネント構造

```
QuestListLayout
├── QuestSearchBar（テキスト検索）
├── QuestCategoryTabs（タブ切り替え）
│   └── バッジ付きタブ（件数表示）
├── QuestGrid（グリッド一覧）
│   └── カスタムレンダー関数（renderItem）
└── 無限スクロールトリガー
```

### Props

```typescript
type QuestListLayoutProps = {
  tabs: CategoryTab[]           // カテゴリタブ設定
  activeTab: string             // 現在のタブ
  onTabChange: (tab: string) => void
  searchQuery: string           // 検索テキスト
  onSearchChange: (query: string) => void
  items: Quest[]                // 表示するクエスト一覧
  renderItem: (item: Quest) => ReactNode  // カスタムレンダー
  hasNextPage?: boolean         // 次ページの有無
  fetchNextPage: () => void     // 次ページ読み込み
  isLoading: boolean
}

type CategoryTab = {
  value: string
  label: string
  badgeCount?: number           // バッジに表示する件数
}
```

### 使用例（家族クエスト一覧）

```typescript
<QuestListLayout
  tabs={[
    { value: "public", label: "公開中", badgeCount: publicCount },
    { value: "family", label: "家族のみ" },
    { value: "violation", label: "違反" },
    { value: "template", label: "テンプレート" }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  searchQuery={search}
  onSearchChange={setSearch}
  items={quests}
  renderItem={(quest) => <FamilyQuestCard quest={quest} />}
  hasNextPage={hasNextPage}
  fetchNextPage={fetchNextPage}
  isLoading={isLoading}
/>
```

### 実装上の注意点

- フィルター・ソート状態はURLクエリパラメータで管理（ブラウザ戻り対応）
- React Query `useInfiniteQuery` と組み合わせて使用
- `renderItem` でタブごとに異なるカード表示が可能
- 検索は debounce 処理（300ms）

### 使用画面

- `packages/web/app/(app)/quests/family/page.tsx`: 家族クエスト一覧
- `packages/web/app/(app)/quests/public/`: 公開クエスト一覧
- `packages/web/app/(app)/quests/child/page.tsx`: 子供クエスト一覧（ChildQuestsScreen）
- `packages/web/app/(app)/quests/template/`: テンプレートクエスト一覧

---

## API（5層構成）

### 家族クエスト一覧

| レイヤー | ファイル |
|----------|---------|
| route    | `packages/web/app/api/quests/family/route.ts` |
| service  | `packages/web/app/api/quests/family/service.ts` |
| query    | `packages/web/app/api/quests/family/query.ts` |
| db       | `packages/web/app/api/quests/family/db.ts` |
| client   | `packages/web/app/api/quests/family/client.ts` |

エンドポイント: `GET /api/quests/family`

### 公開クエスト一覧

| レイヤー | ファイル |
|----------|---------|
| route    | `packages/web/app/api/quests/public/route.ts` |
| client   | `packages/web/app/api/quests/public/client.ts` |

エンドポイント: `GET /api/quests/public`

### 子供クエスト一覧

子供クエストの一覧取得は `child-quest` スキルを参照。

### テンプレートクエスト一覧

テンプレートクエストの一覧取得は `template-quest` スキルを参照。

### カテゴリ

| レイヤー | ファイル |
|----------|---------|
| route    | `packages/web/app/api/quests/category/route.ts` |
| service  | `packages/web/app/api/quests/category/service.ts` |
| query    | `packages/web/app/api/quests/category/query.ts` |
| client   | `packages/web/app/api/quests/category/client.ts` |

エンドポイント: `GET /api/quests/category`

### 共有DBファイル

- `packages/web/app/api/quests/db.ts`: 汎用クエスト操作（insert/update）
- `packages/web/app/api/quests/dbHelper.ts`: 共通ヘルパー（楽観的ロックなど）
- `packages/web/app/api/quests/detail/db.ts`: クエスト詳細取得の共通クエリ

### 実装パターン

```typescript
// route.ts の基本パターン
export const GET = withRouteErrorHandling(async (req) => {
  const { user } = await getAuthContext()
  const { searchParams } = new URL(req.url)
  const result = await getFamilyQuestsService({ userId: user.id, search: searchParams.get("search") })
  return NextResponse.json(result)
})
```
