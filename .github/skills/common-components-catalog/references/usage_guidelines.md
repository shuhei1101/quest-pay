# 共通コンポーネント使用ガイドライン

**最終更新:** 2026年3月記載

## 設計原則

### 再利用性の確保

**DO:**
- ✅ 共通コンポーネントは `app/(core)/_components/` に配置
- ✅ 特定の画面に依存しない汎用的な設計
- ✅ Props経由でカスタマイズ可能にする
- ✅ デフォルト値を適切に設定

**DON'T:**
- ❌ 特定の画面専用のロジックを含めない
- ❌ グローバル状態に直接依存しない
- ❌ 過度に複雑な条件分岐を含めない

### Mantine UIベース

**基本方針:**
- Mantine UIコンポーネントを基本として使用
- 必要に応じてラップしてカスタマイズ
- Mantineのテーマシステムを活用
- スタイリングはMantine標準の方法で

### TypeScript厳格モード

**型定義:**
- すべてのPropsに型定義必須
- `any` 型の使用禁止
- 型推論を最大限活用
- ジェネリクスで柔軟性を確保

## コンポーネント選択ガイド

### レイアウト構築時

**PageHeader を使用する場合:**
- 各画面のヘッダーを統一的に表示したい
- プロフィールアイコンボタンを自動表示したい
- 右側にアクション要素を配置したい

**ScrollableTabs を使用する場合:**
- タブベースのUIを実装したい
- タブヘッダーを固定したい
- 横スクロール・スワイプ対応が必要

### ナビゲーション実装時

**NavigationFAB を使用する場合:**
- メインナビゲーションメニューを提供したい
- 左下固定のFABが必要
- アクティブアイテムの管理が必要

**SubMenuFAB を使用する場合:**
- サブメニューやアクション一覧を表示したい
- 右下固定のFABが必要
- 複数のアクションをまとめたい

**NavigationButton を使用する場合:**
- 画面遷移ボタンを実装したい
- 遷移時にローディングを自動表示したい

### ローディング管理時

**LoadingContext を使用する場合:**
- アプリ全体のローディング状態を管理したい
- 複数コンポーネント間でローディング状態を共有したい

**LoadingButton を使用する場合:**
- ボタンクリック時の非同期処理にローディングを表示したい
- ローディング中はボタンを無効化したい

**LoadingIndicator を使用する場合:**
- 画面左上にローディング表示が必要
- グローバルローディング状態に連動させたい

**ScreenWrapper を使用する場合:**
- 画面遷移完了を検知してローディングを停止したい
- 画面全体をラップしたい

## コンポーネント組み合わせパターン

### 基本画面レイアウト

```typescript
<ScreenWrapper>
  <PageHeader title="タイトル" />
  {/* コンテンツ */}
  <NavigationFAB items={navItems} />
</ScreenWrapper>
```

### タブ画面レイアウト

```typescript
<ScreenWrapper>
  <PageHeader title="タイトル" />
  <ScrollableTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs}>
    {/* タブパネルの内容 */}
  </ScrollableTabs>
  <SubMenuFAB items={menuItems} />
</ScreenWrapper>
```

### 一覧画面レイアウト

```typescript
<ScreenWrapper>
  <PageHeader 
    title="一覧" 
    rightSection={
      <NavigationButton href="/new">新規作成</NavigationButton>
    }
  />
  <SearchBar value={search} onChange={setSearch} />
  <Stack>
    {items.map(item => (
      <QuestCard key={item.id} quest={item} />
    ))}
  </Stack>
</ScreenWrapper>
```

### フォーム画面レイアウト

```typescript
<ScreenWrapper>
  <PageHeader title="編集" />
  <QuestForm 
    initialValues={initialValues} 
    onSubmit={handleSubmit} 
  />
</ScreenWrapper>
```

## スタイリングガイドライン

### Mantineテーマの活用

**色指定:**
```typescript
// MantineColorを使用
<Button color="blue">ボタン</Button>
<Badge color="green">バッジ</Badge>
```

**サイズ指定:**
```typescript
// Mantineサイズを使用
<Button size="md">中サイズ</Button>
<Text size="sm">小サイズテキスト</Text>
```

**間隔指定:**
```typescript
// Mantineスペーシングを使用
<Stack gap="md">
  <div>要素1</div>
  <div>要素2</div>
</Stack>
```

### レスポンシブデザイン

**ブレークポイント:**
- `xs`: 0-575px
- `sm`: 576-767px
- `md`: 768-991px
- `lg`: 992-1199px
- `xl`: 1200px+

**使用例:**
```typescript
<Box
  sx={{
    padding: '1rem',
    '@media (max-width: 768px)': {
      padding: '0.5rem'
    }
  }}
>
  コンテンツ
</Box>
```

## パフォーマンス最適化

### メモ化の活用

**React.memo:**
```typescript
export const QuestCard = React.memo<QuestCardProps>(({ quest, onClick }) => {
  // コンポーネント実装
})
```

**useMemo:**
```typescript
const filteredQuests = useMemo(() => {
  return quests.filter(q => q.status === 'completed')
}, [quests])
```

**useCallback:**
```typescript
const handleClick = useCallback(() => {
  // 処理
}, [依存配列])
```

### 遅延読み込み

**React.lazy:**
```typescript
const QuestDetail = React.lazy(() => import('./QuestDetail'))

// 使用時
<Suspense fallback={<LoadingSpinner />}>
  <QuestDetail />
</Suspense>
```

## アクセシビリティ

### キーボード操作

**フォーカス管理:**
```typescript
<Button autoFocus>最初にフォーカス</Button>
```

**Tab順序:**
```typescript
<input tabIndex={1} />
<button tabIndex={2}>ボタン</button>
```

### スクリーンリーダー対応

**ARIA属性:**
```typescript
<button aria-label="閉じる">
  <IconX />
</button>

<div role="alert" aria-live="polite">
  エラーメッセージ
</div>
```

## エラーハンドリング

### Error Boundary

```typescript
<ErrorBoundary fallback={<ErrorMessage message="エラーが発生しました" />}>
  <QuestList />
</ErrorBoundary>
```

### 非同期エラー

```typescript
const handleSubmit = async () => {
  try {
    await submitQuest(values)
  } catch (error) {
    showNotification({
      title: 'エラー',
      message: error.message,
      color: 'red'
    })
  }
}
```

## テスト

### 単体テスト

```typescript
describe('QuestCard', () => {
  it('クエスト情報を表示する', () => {
    render(<QuestCard quest={mockQuest} />)
    expect(screen.getByText(mockQuest.title)).toBeInTheDocument()
  })
})
```

### スナップショットテスト

```typescript
it('正しくレンダリングされる', () => {
  const { container } = render(<PageHeader title="テスト" />)
  expect(container).toMatchSnapshot()
})
```

## ベストプラクティス

### DO

- ✅ 共通コンポーネントを優先的に使用
- ✅ Propsで動作をカスタマイズ
- ✅ 型定義を明確に
- ✅ ドキュメントコメントを記載
- ✅ アクセシビリティを考慮
- ✅ パフォーマンスを意識

### DON'T

- ❌ 同じUIを複数箇所で実装
- ❌ 共通コンポーネントを直接編集（フォークして使用）
- ❌ グローバル状態に直接依存
- ❌ 過度に複雑な実装
- ❌ ドキュメントなしで新規作成
- ❌ テストなしでリリース

## トラブルシューティング

### よくある問題と解決方法

**Q: PageHeaderのプロフィールボタンが表示されない**

A: `showProfileButton={false}` が設定されていないか確認してください。デフォルトでは表示されます。

**Q: ScrollableTabsでスワイプが動作しない**

A: タッチイベントが他の要素に取られている可能性があります。`touchAction: "pan-y"` が設定されているか確認してください。

**Q: LoadingButtonがローディング状態にならない**

A: `onClick` に渡す関数が `Promise` を返しているか確認してください。

**Q: NavigationFABのアクティブアイテムが更新されない**

A: `activeIndex` プロップを正しく更新しているか確認してください。

## まとめ

共通コンポーネントは、UIの一貫性とコードの再利用性を高めるための重要な要素です。このガイドラインに従って、効果的に活用してください。
