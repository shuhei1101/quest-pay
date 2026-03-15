(2026年3月15日 14:30記載)

# 家族一覧画面 リスト操作

## 主要操作一覧

| 操作 | トリガー | アクション | 遷移先 |
|------|---------|-----------|--------|
| 家族選択 | カードクリック | 詳細画面表示 | `/families/{id}` |
| 新規作成 | FABクリック | 作成画面表示 | `/families/new` |
| プルリフレッシュ | 下スワイプ | データ再取得 | - |
| 検索（未実装） | 検索バー入力 | フィルタリング | - |

---

## 家族選択操作

### 実装詳細
```typescript
const handleFamilyClick = (familyId: string) => {
  router.push(`/families/${familyId}`)
}
```

### 動作仕様
1. ユーザーが家族カードをクリック
2. `onClick`イベント発火
3. `router.push()`で詳細画面へ遷移
4. 選択状態を維持（URL経由）

### 選択状態の管理
- URLパスから選択IDを取得
- 該当カードに`isSelected`プロパティを付与
- スタイルをハイライト表示

```typescript
const selectedId = pathname.match(/\/families\/([^\/]+)/)?.[1]
<FamilyCard 
  isSelected={family.id === selectedId}
  onClick={handleFamilyClick}
/>
```

---

## 新規作成操作

### FloatingActionButton設定
```typescript
<FloatingActionButton
  icon={<IconPlus size={24} />}
  onClick={() => router.push('/families/new')}
  color="blue"
/>
```

### 動作フロー
1. FABクリック
2. `/families/new`へ遷移
3. 新規作成フォーム表示
4. 作成完了後、一覧へ戻る
5. キャッシュ無効化による自動更新

---

## プルリフレッシュ操作

### 実装（モバイルのみ）
```typescript
const { refetch } = useFamilies()

<RefreshControl
  refreshing={isRefreshing}
  onRefresh={async () => {
    await refetch()
  }}
/>
```

### 動作仕様
1. 画面を下にスワイプ
2. スピナー表示
3. `refetch()`実行
4. API再呼び出し
5. 一覧更新
6. スピナー非表示

---

## ナビゲーション詳細

### ルーティング構造
```
/families                   # 一覧画面
├── /new                    # 新規作成
└── /:id                    # 詳細画面
    ├── /edit               # 編集
    └── /members            # メンバー管理
```

### 遷移パターン

#### 一覧 → 詳細
```typescript
router.push(`/families/${familyId}`)
```

#### 一覧 → 新規作成
```typescript
router.push('/families/new')
```

#### 戻るナビゲーション
```typescript
router.back()  // ブラウザ履歴の前ページへ
```

---

## ソート・フィルター（将来実装予定）

### ソート機能
**未実装**: 現在はデフォルト順序（作成日降順）

**計画仕様**:
- 作成日順
- 名前順
- メンバー数順

### フィルター機能
**未実装**: 現在は全件表示

**計画仕様**:
- 名前検索
- メンバー数範囲
- 作成日範囲

---

## ページネーション（将来実装予定）

### 現状
- 全件取得・表示
- 家族数が少ない場合は問題なし

### 将来計画
```typescript
const { families, hasMore, loadMore } = useFamilies({
  page: currentPage,
  pageSize: 20
})

// 無限スクロール
<InfiniteScroll
  loadMore={loadMore}
  hasMore={hasMore}
>
  {families.map(...)}
</InfiniteScroll>
```

---

## UI状態管理

### ローディング状態
```typescript
{isLoading && <Loader />}
{!isLoading && families.length === 0 && <EmptyState />}
{!isLoading && families.length > 0 && <FamilyList />}
```

### エラー状態
```typescript
{error && (
  <Alert color="red">
    {error.message}
    <Button onClick={refetch}>リトライ</Button>
  </Alert>
)}
```

### 空状態
```typescript
<Center>
  <Stack align="center">
    <IconHome size={48} />
    <Text>家族がありません</Text>
    <Button onClick={() => router.push('/families/new')}>
      家族を作成
    </Button>
  </Stack>
</Center>
```

---

## キーボード操作（アクセシビリティ）

### サポート予定キー
- `Enter`: 選択中の家族を開く
- `↓/↑`: カード間移動
- `Tab`: フォーカス移動
- `Esc`: 選択解除

### 実装方針
```typescript
<FamilyCard
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleFamilyClick(family.id)
  }}
/>
```

---

## アニメーション

### カード表示アニメーション
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <FamilyCard />
</motion.div>
```

### スクロールアニメーション
- フェードイン効果
- スタガー表示（順次表示）
- スムーススクロール

---

## パフォーマンス最適化

### 仮想化（将来実装）
大量データ対応のため、`react-window`や`react-virtualized`を使用:

```typescript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={families.length}
  itemSize={100}
>
  {({ index, style }) => (
    <div style={style}>
      <FamilyCard family={families[index]} />
    </div>
  )}
</FixedSizeList>
```

### メモ化
```typescript
const MemoizedFamilyCard = memo(FamilyCard)
```
