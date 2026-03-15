# 共通コンポーネント ベストプラクティス

**最終更新:** 2026年3月記載

## 設計原則

### 1. 単一責任の原則 (SRP)

**良い例:**
```typescript
// 表示のみに責任を持つコンポーネント
const QuestCard = ({ quest, onClick }) => {
  return (
    <Card onClick={onClick}>
      <Text>{quest.title}</Text>
      <QuestStatusBadge status={quest.status} />
    </Card>
  )
}
```

**悪い例:**
```typescript
// 表示とデータフェッチが混在
const QuestCard = ({ questId }) => {
  const { data: quest } = useQuery(['quest', questId], () => fetchQuest(questId))
  
  return (
    <Card>
      <Text>{quest?.title}</Text>
    </Card>
  )
}
```

### 2. 関心の分離

**コンポーネントの責任を明確にする:**

- **表示コンポーネント**: UI表示のみ
- **コンテナコンポーネント**: データフェッチとロジック
- **レイアウトコンポーネント**: 構造とレイアウト

**例:**
```typescript
// 表示コンポーネント
const QuestCardView = ({ quest, onClick }) => (
  <Card onClick={onClick}>
    <Text>{quest.title}</Text>
  </Card>
)

// コンテナコンポーネント
const QuestCardContainer = ({ questId }) => {
  const { data: quest } = useQuery(['quest', questId], () => fetchQuest(questId))
  const router = useRouter()
  
  if (!quest) return null
  
  return (
    <QuestCardView 
      quest={quest} 
      onClick={() => router.push(`/quests/${questId}`)}
    />
  )
}
```

### 3. Props命名規則

**イベントハンドラ:**
- ✅ `onClick`, `onChange`, `onSubmit`
- ❌ `clickHandler`, `handleClick`, `click`

**真偽値:**
- ✅ `isLoading`, `isDisabled`, `isActive`
- ❌ `loading`, `disabled`, `active`

**位置指定:**
- ✅ `leftSection`, `rightSection`
- ❌ `leftElement`, `leftContent`

## パフォーマンス最適化

### 1. メモ化の適切な使用

**React.memo: 再レンダリングを防ぐ**

```typescript
// 良い例: propsが変わらない限り再レンダリングしない
export const QuestCard = React.memo<QuestCardProps>(({ quest, onClick }) => {
  return (
    <Card onClick={onClick}>
      <Text>{quest.title}</Text>
    </Card>
  )
})

// さらに最適化: 比較関数を提供
export const QuestCard = React.memo<QuestCardProps>(
  ({ quest, onClick }) => {
    return (
      <Card onClick={onClick}>
        <Text>{quest.title}</Text>
      </Card>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.quest.id === nextProps.quest.id &&
           prevProps.quest.title === nextProps.quest.title
  }
)
```

**useMemo: 重い計算のメモ化**

```typescript
// 良い例: フィルタリングをメモ化
const filteredQuests = useMemo(() => {
  return quests.filter(q => q.status === 'active')
}, [quests])

// 悪い例: 軽い計算をメモ化（オーバーヘッドの方が大きい）
const title = useMemo(() => quest.title.toUpperCase(), [quest.title])
```

**useCallback: イベントハンドラのメモ化**

```typescript
// 良い例: 子コンポーネントに渡すハンドラをメモ化
const handleClick = useCallback(() => {
  router.push(`/quests/${quest.id}`)
}, [quest.id, router])

// 悪い例: 依存配列が空なのに外部値を参照
const handleClick = useCallback(() => {
  router.push(`/quests/${quest.id}`)  // quest.idを使用
}, [])  // 依存配列が空 → バグの原因
```

### 2. 遅延読み込み

**React.lazy: コンポーネントの遅延読み込み**

```typescript
// 大きなコンポーネントを遅延読み込み
const QuestDetail = React.lazy(() => import('./QuestDetail'))

export default function QuestPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <QuestDetail />
    </Suspense>
  )
}
```

**動的インポート: 条件付き読み込み**

```typescript
const loadHeavyComponent = async () => {
  const { HeavyComponent } = await import('./HeavyComponent')
  return HeavyComponent
}
```

### 3. 仮想化

**大量のリストを効率的に表示**

```typescript
import { Virtualizer } from '@tanstack/react-virtual'

export default function VirtualizedList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100
  })
  
  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <QuestCard quest={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## エラーハンドリング

### 1. Error Boundary

**コンポーネントレベルのエラー処理**

```typescript
class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    
    return this.props.children
  }
}

// 使用例
<ErrorBoundary fallback={<ErrorMessage message="エラーが発生しました" />}>
  <QuestList />
</ErrorBoundary>
```

### 2. 非同期エラー処理

**try-catch + 通知**

```typescript
const handleSubmit = async (values: FormValues) => {
  try {
    await api.submit(values)
    showNotification({
      title: '成功',
      message: '保存しました',
      color: 'green'
    })
    router.push('/success')
  } catch (error) {
    console.error('Submit error:', error)
    showNotification({
      title: 'エラー',
      message: error instanceof Error ? error.message : '不明なエラー',
      color: 'red'
    })
  }
}
```

## アクセシビリティ

### 1. セマンティックHTML

**適切なHTML要素を使用**

```typescript
// 良い例
<button onClick={handleClick}>クリック</button>
<nav><a href="/home">ホーム</a></nav>
<header><h1>タイトル</h1></header>

// 悪い例
<div onClick={handleClick}>クリック</div>
<div><div>ホーム</div></div>
<div><span>タイトル</span></div>
```

### 2. ARIA属性

**スクリーンリーダー対応**

```typescript
// アイコンボタン
<button aria-label="閉じる">
  <IconX />
</button>

// ライブリージョン
<div role="alert" aria-live="polite">
  エラーメッセージ
</div>

// 展開可能なセクション
<button 
  aria-expanded={isOpen}
  aria-controls="content-id"
  onClick={() => setIsOpen(!isOpen)}
>
  展開
</button>
<div id="content-id" aria-hidden={!isOpen}>
  コンテンツ
</div>
```

### 3. キーボードナビゲーション

**フォーカス管理**

```typescript
// 自動フォーカス
<TextInput autoFocus />

// フォーカストラップ（モーダル等）
import { useFocusTrap } from '@mantine/hooks'

function Modal() {
  const focusTrapRef = useFocusTrap()
  
  return (
    <div ref={focusTrapRef}>
      <input />
      <button>OK</button>
      <button>Cancel</button>
    </div>
  )
}
```

## テスト

### 1. 単体テスト

**Jestとtesting-libraryを使用**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { QuestCard } from './QuestCard'

describe('QuestCard', () => {
  const mockQuest = {
    id: '1',
    title: 'テストクエスト',
    status: 'active'
  }
  
  it('クエスト情報を表示する', () => {
    render(<QuestCard quest={mockQuest} />)
    expect(screen.getByText('テストクエスト')).toBeInTheDocument()
  })
  
  it('クリック時にonClickが呼ばれる', () => {
    const handleClick = jest.fn()
    render(<QuestCard quest={mockQuest} onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 2. 統合テスト

**React Query + APIモックを使用**

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useQuestList } from './useQuestList'

// モックAPIを設定
jest.mock('./api', () => ({
  fetchQuests: jest.fn(() => Promise.resolve([
    { id: '1', title: 'Quest 1' },
    { id: '2', title: 'Quest 2' }
  ]))
}))

describe('useQuestList', () => {
  it('クエスト一覧を取得する', async () => {
    const queryClient = new QueryClient()
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
    
    const { result } = renderHook(() => useQuestList(), { wrapper })
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[0].title).toBe('Quest 1')
  })
})
```

## コード品質

### 1. TypeScript厳格モード

**tsconfig.json設定**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 2. ESLintルール

**.eslintrc.json設定**

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "semi": ["error", "never"],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### 3. コードレビューチェックリスト

- [ ] 型定義が適切か
- [ ] 再利用可能な設計か
- [ ] パフォーマンスが考慮されているか
- [ ] エラーハンドリングが適切か
- [ ] アクセシビリティが考慮されているか
- [ ] テストが書かれているか
- [ ] ドキュメントが書かれているか

## まとめ

これらのベストプラクティスに従うことで、保守性・拡張性・パフォーマンスに優れた共通コンポーネントを構築できます。
