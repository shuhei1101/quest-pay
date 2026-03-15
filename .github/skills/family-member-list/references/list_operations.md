(2026年3月15日 14:30記載)

# 家族メンバー一覧画面 リスト操作

## 主要操作一覧

| 操作 | トリガー | アクション | 遷移先 |
|------|---------|-----------|--------|
| 親選択 | 親カードクリック | 親詳細画面表示 | `/families/members/parent/{id}/view` |
| 子供選択 | 子供カードクリック | 子供詳細画面表示 | `/families/members/child/{id}/view` |
| 子供追加 | FABクリック | 新規作成画面表示 | `/families/members/child/new` |
| 子供編集 | 編集FABクリック | 編集画面表示 | `/families/members/child/{id}/edit` |
| プルリフレッシュ | 下スワイプ | データ再取得 | - |
| 一覧に戻る | 戻るボタン | 一覧画面表示 | `/families/members` |

---

## メンバー選択操作

### 親選択
**実装詳細**:
```typescript
const handleParentClick = (parentId: string) => {
  router.push(`/families/members/parent/${parentId}/view`)
}
```

**動作仕様**:
1. ユーザーが親カードをクリック
2. `onClick`イベント発火
3. `router.push()`で親詳細画面へ遷移
4. PC: 2ペイン表示（左:一覧、右:詳細）
5. モバイル: 詳細画面のみ表示

### 子供選択
**実装詳細**:
```typescript
const handleChildClick = (childId: string) => {
  router.push(`/families/members/child/${childId}/view`)
}
```

**動作仕様**:
1. ユーザーが子供カードをクリック
2. `onClick`イベント発火
3. `router.push()`で子供詳細画面へ遷移
4. PC: 2ペイン表示（左:一覧、右:詳細）
5. モバイル: 詳細画面のみ表示

### 選択状態の管理
**URLパースによる選択状態取得**:
```typescript
const getSelectedIdFromPath = (): string | null => {
  // /families/members/parent/{id}/view のパターンにマッチ
  const parentMatch = pathname.match(/\/families\/members\/parent\/([^\/]+)(\/|$)/)
  
  // /families/members/child/{id}/view のパターンにマッチ
  const childMatch = pathname.match(/\/families\/members\/child\/([^\/]+)(\/|$)/)
  
  return parentMatch?.[1] || childMatch?.[1] || null
}
```

**カードへの選択状態適用**:
```typescript
<ParentCardLayout 
  parent={parent}
  isSelected={selectedId === parent.parents.id}
  onClick={handleParentClick}
/>

<ChildCardLayout 
  child={child}
  isSelected={selectedId === child.children.id}
  onClick={handleChildClick}
/>
```

**選択時のスタイル**:
```typescript
style={{
  backgroundColor: isSelected ? "#e7f5ff" : "transparent",
  borderLeft: isSelected ? "4px solid #228be6" : "none",
  cursor: "pointer"
}}
```

---

## 子供追加操作

### FloatingActionButton設定（追加）
```typescript
const actionItems: FloatingActionItem[] = [
  { 
    icon: <IconPlus size={20} />,
    onClick: () => router.push(FAMILIES_MEMBERS_CHILD_NEW_URL)
  }
]

<SubMenuFAB items={actionItems} />
```

### 動作フロー
1. FABクリック
2. `/families/members/child/new`へ遷移
3. 新規作成フォーム表示
4. 作成完了後:
   - キャッシュ無効化: `invalidateQueries(['children'])`
   - 一覧へ戻る
   - 自動でデータ再取得・更新

---

## 子供編集操作

### FloatingActionButton設定（編集）
子供閲覧画面表示時のみ表示:
```typescript
const isChildViewPage = pathname.match(/\/families\/members\/child\/([^\/]+)\/view/)
const childIdForEdit = isChildViewPage?.[1]

if (childIdForEdit) {
  actionItems.unshift({
    icon: <IconEdit size={20} />,
    onClick: () => router.push(FAMILIES_MEMBERS_CHILD_EDIT_URL(childIdForEdit))
  })
}
```

### 動作フロー
1. 子供詳細画面で編集FABクリック
2. `/families/members/child/{id}/edit`へ遷移
3. 編集フォーム表示
4. 編集完了後:
   - キャッシュ無効化
   - 詳細画面へ戻る
   - 自動でデータ再取得・更新

---

## プルリフレッシュ操作

### 実装（モバイルのみ）
```typescript
const { refetch: refetchParents } = useParents()
const { refetch: refetchChildren } = useChildren()

<RefreshControl
  refreshing={isRefreshing}
  onRefresh={async () => {
    await Promise.all([
      refetchParents(),
      refetchChildren()
    ])
  }}
/>
```

### 動作仕様
1. 画面を下にスワイプ
2. スピナー表示
3. 親・子供データを並列再取得
4. 一覧更新
5. スピナー非表示

---

## ナビゲーション詳細

### ルーティング構造
```
/families/members                           # 一覧画面（親のみアクセス可）
├── /parent/:id/view                        # 親詳細画面
├── /child/new                              # 子供新規作成
└── /child/:id
    ├── /view                               # 子供詳細画面
    └── /edit                               # 子供編集
```

### 遷移パターン

#### 一覧 → 親詳細
```typescript
router.push(`/families/members/parent/${parentId}/view`)
```

#### 一覧 → 子供詳細
```typescript
router.push(`/families/members/child/${childId}/view`)
```

#### 一覧 → 子供新規作成
```typescript
router.push('/families/members/child/new')
```

#### 詳細 → 編集
```typescript
router.push(`/families/members/child/${childId}/edit`)
```

#### 戻るナビゲーション
```typescript
router.back()  // ブラウザ履歴の前ページへ
// または
router.push('/families/members')  // 一覧へ明示的に戻る
```

---

## 2ペイン/シングルペイン切り替え

### デバイス判定
```typescript
const { isTablet } = useWindow()

if (isTablet) {
  // シングルペイン（モバイル/タブレット）
  if (!selectedId) {
    return <FamilyMemberList selectedId={null} />
  }
  return children  // 詳細画面
}

// 2ペイン（PC）
return (
  <>
    <aside><FamilyMemberList selectedId={selectedId} /></aside>
    <main>{children}</main>
  </>
)
```

### 動作仕様

#### PC（2ペイン）
- 一覧と詳細を常に同時表示
- 選択カードをハイライト
- 独立したスクロール

#### モバイル/タブレット（シングルペイン）
- 未選択時: 一覧のみ表示
- 選択時: 詳細のみ表示
- 戻るボタンで一覧に戻る

---

## FAB配置制御

### PC（2ペイン）時のFAB配置
```typescript
// 左ペイン（一覧）FAB
const leftPaneActionItems = [
  { 
    icon: <IconPlus size={20} />,
    onClick: () => router.push('/families/members/child/new')
  }
]

// 右ペイン（詳細）FAB（子供閲覧時のみ）
const rightPaneActionItems = []
if (childIdForEdit) {
  rightPaneActionItems.push({
    icon: <IconEdit size={20} />,
    onClick: () => router.push(`/families/members/child/${childIdForEdit}/edit`)
  })
}
```

### モバイル時のFAB配置
```typescript
// 一覧画面: 追加ボタンのみ
// 子供詳細画面: 編集ボタンのみ
// 親詳細画面: FABなし
```

---

## ソート・フィルター（将来実装予定）

### ソート機能
**未実装**: 現在はデフォルト順序

**計画仕様**:
- 名前順（あいうえお/ABC）
- レベル順（子供のみ）
- 作成日順

### フィルター機能
**未実装**: 現在は全件表示

**計画仕様**:
- 名前検索
- レベル範囲（子供のみ）
- ロール（親のみ）

---

## UI状態管理

### ローディング状態
```typescript
{(parentLoading || childLoading) && <Loader />}
{!parentLoading && parents.length === 0 && <EmptyState text="親がいません" />}
{!childLoading && children.length === 0 && <EmptyState text="子供がいません" />}
```

### エラー状態
```typescript
{parentError && (
  <Alert color="red">
    親情報の取得に失敗しました
    <Button onClick={refetchParents}>リトライ</Button>
  </Alert>
)}

{childError && (
  <Alert color="red">
    子供情報の取得に失敗しました
    <Button onClick={refetchChildren}>リトライ</Button>
  </Alert>
)}
```

### 空状態
```typescript
<Stack align="center">
  <IconUsers size={48} />
  <Text>メンバーがいません</Text>
  <Button onClick={() => router.push('/families/members/child/new')}>
    子供を追加
  </Button>
</Stack>
```

---

## キーボード操作（アクセシビリティ）

### サポート予定キー
- `Enter`: 選択メンバーを開く
- `↓/↑`: カード間移動
- `Tab`: フォーカス移動
- `Esc`: 選択解除（モバイル時は一覧に戻る）

### 実装方針
```typescript
<ParentCardLayout
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleParentClick(parent.id)
  }}
/>
```

---

## パフォーマンス最適化

### メモ化
```typescript
const MemoizedParentCard = memo(ParentCardLayout)
const MemoizedChildCard = memo(ChildCardLayout)
```

### 仮想化（将来実装）
大量メンバー対応:
```typescript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={children.length}
  itemSize={80}
>
  {({ index, style }) => (
    <div style={style}>
      <ChildCardLayout child={children[index]} />
    </div>
  )}
</FixedSizeList>
```
