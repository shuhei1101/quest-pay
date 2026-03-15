# 子供クエスト一覧 - リスト操作

**2026年3月記載**

## 概要

子供クエスト一覧画面で実行可能な操作とナビゲーションパターンを説明します。

## 閲覧操作

### Read（読み取り）

**トリガー:** ページマウント、手動リフレッシュ、フィルター/ソート変更

**API:** `GET /api/children/[id]/quests`

**クエリパラメータ:**
```typescript
{
  tags?: string[]
  name?: string
  categoryId?: string
  sortColumn: QuestColumn
  sortOrder: SortOrder
  page: number
  pageSize: number
}
```

**レスポンス:**
```typescript
type GetChildQuestsResponse = {
  rows: ChildQuest[]
  totalRecords: number
}
```

**処理フロー:**
1. useChildQuests フック実行
2. API呼び出し
3. データ取得
4. ChildQuestCardLayout のレンダリング

**権限:** 該当する子供ユーザーのみ

## クエスト操作

### クエスト詳細表示

**トリガー:** ChildQuestCardLayout クリック

**遷移先:** `/quests/child/[id]?childId=[childId]`

**表示内容:**
- クエスト詳細情報
- 完了報告ボタン（status = in_progress の場合）
- ステータス履歴

### 完了報告

**トリガー:** クエスト詳細画面で「完了報告」ボタンクリック

**API:** `PUT /api/quests/family/[id]/review-request`

**リクエスト:**
```typescript
{
  childId: string
}
```

**処理フロー:**
1. バリデーション（status = in_progress のみ）
2. API呼び出し
3. status を "pending_review" に更新
4. 一覧画面に戻る
5. 自動再取得により最新状態を表示

**権限:** 該当する子供ユーザーのみ

**制約:**
- status = "in_progress" の場合のみ実行可能
- 一度報告すると親の承認/却下まで再報告不可

### 報告キャンセル

現在、報告キャンセル機能は実装されていません。親の却下により status が "in_progress" に戻ります。

## フィルター操作

### フィルター設定

**フィルター項目:**
1. **クエスト名:** テキスト部分一致
2. **タグ:** 複数選択可能

**操作フロー:**
```
1. フィルターフォームで条件入力
2. questFilter 状態を更新
3. 「検索」ボタンクリック
4. URLクエリパラメータに反映
5. searchFilter を更新
6. useChildQuests が再実行
7. フィルター結果を表示
```

### フィルタークリア

**方法:**
- 各フィルター項目を個別にクリア
- ページURLから ?以降を削除

### タグ操作

**追加:**
```typescript
// タグ入力フィールドに入力 → Enter または blur
const handleTag = () => {
  const newTag = tagInputValue.trim()
  if (newTag && !filter.tags.includes(newTag)) {
    setTags([...filter.tags, newTag])
  }
  setTagInputValue("")
}
```

**削除:**
```typescript
// タグの × ボタンクリック
<Pill withRemoveButton
  onRemove={() => setTags(filter.tags.filter((t) => t !== tag))}
>{tag}</Pill>
```

## ソート操作

### ソート設定

**ソート可能な列:**
- `id`: クエストID
- `name`: クエスト名
- `categoryId`: カテゴリ
- `reward`: 報酬額
- `deadline`: 期限

**ソート順:**
- `asc`: 昇順
- `desc`: 降順

**操作フロー:**
```
1. ソートポップアップを開く
2. ソート列・順を選択
3. sort 状態を更新
4. useChildQuests が再実行
5. ソート結果を表示
```

## ページネーション操作

### ページ遷移

**方法:**
- 「前へ」ボタン
- 「次へ」ボタン
- ページ番号直接指定

**制約:**
- 1 ≤ page ≤ maxPage

**操作フロー:**
```typescript
const handlePageChange = useCallback((newPage: number) => {
  setPage(newPage)
}, [])
```

### ページ情報表示

**表示内容:**
- 現在のページ番号
- 総ページ数
- 総件数
- ページサイズ（30件固定）

## ナビゲーションパターン

### クエスト詳細への遷移

**トリガー:** ChildQuestCardLayout クリック

**遷移先:** `/quests/child/[id]?childId=[childId]`

**用途:**
- クエスト詳細情報表示
- 完了報告
- ステータス履歴表示

### ホーム画面への遷移

**トリガー:** ヘッダーのホームボタンクリック

**遷移先:** `/home`

### マイページへの遷移

**トリガー:** ヘッダーのユーザーアイコンクリック

**遷移先:** `/profile`

## ステータス表示

### ステータスバッジ

**表示されるステータス:**
1. `not_started`: 未開始（グレー）
2. `in_progress`: 進行中（青）
3. `pending_review`: 完了報告中（オレンジ）
4. `completed`: 完了（緑）

**ステータス遷移:**
```
not_started → in_progress → pending_review → completed
                   ↑              ↓
                   └──── reject ───┘
```

## リアルタイム更新

### 自動再取得
- 他の画面から戻った際に`refetchOnMount: "always"`により自動再取得
- 完了報告後は一覧画面に戻った際に自動再取得

### 手動リフレッシュ
```typescript
const { refetch } = useChildQuests({...})

// 手動リフレッシュ
await refetch()
```

## 操作権限

### 子供ユーザー
- 自分のクエストのみ表示・閲覧可能
- 完了報告可能（status = in_progress の場合のみ）

### 親ユーザー
- この画面へのアクセス不可
- 家族クエスト一覧画面から子供別にクエストを管理

## エラーケース

### 閲覧時エラー
- 認証エラー → ログイン画面へリダイレクト
- 権限不足 → エラー画面表示

### 完了報告時エラー
- ステータス不正 → エラーメッセージ表示
- 存在しないクエストID → 404エラー

### フィルター時エラー
- 不正なクエリパラメータ → デフォルト値で表示

## パフォーマンス最適化

### React Query キャッシュ
- フィルター・ソート・ページごとに個別キャッシュ
- 同じ条件での再アクセス時はキャッシュから即座に表示

### メモ化
```typescript
const renderChildQuestCard = useCallback((quest: ChildQuest, index: number) => (
  <ChildQuestCardLayout
    key={index}
    childQuest={quest}
    onClick={(id) => router.push(CHILD_QUEST_VIEW_URL(id, userInfo?.children?.id))}
  />
), [router, userInfo?.children?.id])
```
