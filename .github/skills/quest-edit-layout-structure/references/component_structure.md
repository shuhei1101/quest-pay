(2026年3月15日 14:30記載)

# QuestEditLayout コンポーネント構造

## コンポーネント階層

```
QuestEditLayout
├── PageHeader (タイトル表示)
│   └── title: "クエスト編集" / "クエスト登録"
├── Box (コンテナ)
│   ├── LoadingOverlay (ローディング表示)
│   └── form (フォーム本体)
│       └── Paper (メインコンテンツエリア)
│           ├── ScrollableTabs (タブコンポーネント)
│           │   ├── Tabs.List (タブヘッダー)
│           │   │   └── Tabs.Tab[] (各タブ)
│           │   │       └── rightSection: IconAlertCircle (エラーアイコン)
│           │   └── Tabs.Panel[] (タブコンテンツ)
│           │       └── content (各タブの内容)
│           └── Group (アクションボタンエリア)
│               └── actionButtons[] (保存/削除ボタン)
├── popups (フローティングポップアップ)
│   └── (IconSelectPopup等)
└── SubMenuFAB (フローティングアクションボタン)
    └── items: FloatingActionItem[]
```

## Props定義

### QuestEditLayoutProps<TForm>

```typescript
type QuestEditLayoutProps<TForm extends Record<string, unknown>> = {
  /** クエストID（新規作成時はundefined） */
  questId?: string
  /** データ取得中のローディング状態 */
  isLoading: boolean
  /** フォーム送信時のハンドラ */
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  /** タブ設定 */
  tabs: TabConfig[]
  /** 編集モード時のアクションボタン */
  editActions: ReactNode[]
  /** 新規作成モード時のアクションボタン */
  createActions: ReactNode[]
  /** 編集モード時のFABアクション */
  fabEditActions?: FloatingActionItem[]
  /** 新規作成モード時のFABアクション */
  fabCreateActions?: FloatingActionItem[]
  /** フローティングポップアップコンポーネント */
  popups?: ReactNode
}
```

### TabConfig

```typescript
type TabConfig = {
  /** タブの値 */
  value: string
  /** タブのラベル */
  label: string
  /** エラーがあるか */
  hasErrors: boolean
  /** タブパネルの内容 */
  content: ReactNode
}
```

### FloatingActionItem

```typescript
type FloatingActionItem = {
  /** アイコン */
  icon: ReactNode
  /** ラベル */
  label: string
  /** クリックハンドラ */
  onClick: () => void
  /** 色（オプション） */
  color?: "red" | "green" | "blue" | "violet" | string
}
```

## 状態管理

### ローカル状態

```typescript
/** アクティブタブ状態 */
const [activeTab, setActiveTab] = useState<string | null>(tabs[0]?.value ?? "basic")
```

### 計算値

```typescript
/** 表示するアクションボタンを取得する */
const actionButtons = questId ? editActions : createActions

/** 表示するFABアクションを取得する */
const fabActions = questId ? fabEditActions : fabCreateActions
```

### モバイル判定

```typescript
/** モバイル判定 */
const { isMobile } = useWindow()
```

## レイアウト仕様

### Paperコンテナ
- height: `var(--content-height)` (画面全体の高さ)
- display: `flex`
- flexDirection: `column`
- padding: `md`
- withBorder: `true`

### ScrollableTabs
- タブヘッダーがスティッキー（上部固定）
- 横スクロール対応（タブが多い場合）
- スワイプでのタブ切り替え対応
  - delta: 50ピクセル
  - swipeDuration: 500ms

### Tabs.Panel
- display: activeTab === tab.value ? 'flex' : 'none'
- flexDirection: 'column'
- flex: 1
- overflowY: 
  - 'hidden' (詳細設定タブの場合)
  - 'auto' (その他のタブ)
- overflowX: 'hidden'
- pt: 'xs'

### アクションボタンエリア
- mt: 'md'
- justify: 'flex-end'
- gap: 'xs'

## タブエラー表示

タブの右側セクションに、バリデーションエラーがある場合は赤色の警告アイコンを表示:

```typescript
rightSection: tab.hasErrors ? <IconAlertCircle size={16} color="red" /> : null
```

## レスポンシブ対応

- モバイル: FABを表示、アクションボタンは非表示
- デスクトップ: アクションボタンを表示、FABも表示可能

（実際の実装では、アクションボタンとFABの両方を条件に応じて表示）
