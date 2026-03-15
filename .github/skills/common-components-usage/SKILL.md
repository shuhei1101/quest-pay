---
name: common-components-usage
description: 共通コンポーネントの使用方法を提供するスキル。Props定義、使用例を含む。
---

# 共通コンポーネント使用方法 スキル

## 概要

共通コンポーネントの効果的な使用方法を提供するスキルです。統合パターン、実装例、ベストプラクティスを含みます。

## メインソースファイル

### 共通コンポーネント
- `app/(core)/_components/`: すべての共通コンポーネント

## 主要機能グループ

### 1. レイアウトパターン
- 基本画面レイアウト（ScreenWrapper + PageHeader）
- タブ画面レイアウト（ScrollableTabs）
- 一覧画面レイアウト（SearchBar + Filter + QuestCard）
- フォーム画面レイアウト（QuestForm + LoadingButton）
- 詳細画面レイアウト（QuestDetail + アクション）

### 2. 状態管理パターン
- ローディング状態管理（LoadingContext）
- フォーム状態管理（React Hook Form）
- データフェッチ（React Query）

### 3. ナビゲーションパターン
- 階層ナビゲーション（NavigationFAB）
- コンテキストメニュー（SubMenuFAB）
- 画面遷移（NavigationButton）

### 4. エラーハンドリングパターン
- グローバルエラー（ErrorBoundary）
- 個別エラー（try-catch + 通知）

### 5. 条件付きレンダリングパターン
- 空状態（EmptyState）
- ローディング（LoadingSpinner）

### 6. レスポンシブパターン
- デバイス別レイアウト（useMediaQuery）

## Reference Files Usage

### 統合パターンを確認する場合
レイアウト、状態管理、ナビゲーション、エラーハンドリング等のパターンを確認：
```
references/integration_patterns.md
```

### 実装コード例を確認する場合
各コンポーネントの具体的な使用例、複合例を確認：
```
references/code_examples.md
```

### ベストプラクティスを確認する場合
設計原則、パフォーマンス最適化、エラーハンドリング、アクセシビリティ、テスト、コード品質を確認：
```
references/best_practices.md
```

## クイックスタート

1. **パターン探索**: `references/integration_patterns.md` で実装パターン確認
2. **コード例参照**: `references/code_examples.md` で具体例確認
3. **実装時**: `references/best_practices.md` でベストプラクティス確認

## 実装上の注意点

### 必須パターン

**基本画面構成:**
```typescript
<ScreenWrapper>
  <PageHeader title="タイトル" />
  {/* コンテンツ */}
  <NavigationFAB items={navItems} />
</ScreenWrapper>
```

**タブ画面構成:**
```typescript
<ScreenWrapper>
  <PageHeader title="タイトル" />
  <ScrollableTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs}>
    {/* タブパネル */}
  </ScrollableTabs>
</ScreenWrapper>
```

**一覧画面構成:**
```typescript
<ScreenWrapper>
  <PageHeader title="一覧" rightSection={<NavigationButton href="/new">新規</NavigationButton>} />
  <SearchBar value={search} onChange={setSearch} />
  <Stack>
    {items.map(item => <QuestCard key={item.id} quest={item} />)}
  </Stack>
</ScreenWrapper>
```

### 設計原則

**単一責任の原則:**
- 1つのコンポーネント = 1つの責任
- 表示とロジックを分離
- コンテナ/プレゼンテーションパターン活用

**Props命名規則:**
- イベントハンドラ: `onClick`, `onChange`, `onSubmit`
- 真偽値: `isLoading`, `isDisabled`, `isActive`
- 位置指定: `leftSection`, `rightSection`

### パフォーマンス最適化

**メモ化:**
- `React.memo`: 再レンダリング防止
- `useMemo`: 重い計算のメモ化
- `useCallback`: イベントハンドラのメモ化

**遅延読み込み:**
- `React.lazy`: コンポーネントの遅延読み込み
- 動的インポート: 条件付き読み込み

### エラーハンドリング

**Error Boundary:**
```typescript
<ErrorBoundary fallback={<ErrorMessage message="エラー" />}>
  <QuestList />
</ErrorBoundary>
```

**非同期エラー:**
```typescript
try {
  await api.submit(values)
} catch (error) {
  showNotification({ title: 'エラー', message: error.message, color: 'red' })
}
```

### アクセシビリティ

**セマンティックHTML:**
- `<button>`, `<nav>`, `<header>` 等の適切な要素使用

**ARIA属性:**
```typescript
<button aria-label="閉じる"><IconX /></button>
<div role="alert" aria-live="polite">エラー</div>
```

**キーボードナビゲーション:**
- `autoFocus`, `tabIndex` の適切な設定
- フォーカストラップ（モーダル等）

### 主要コンポーネントの基本使用

**PageHeader:**
```typescript
<PageHeader title="タイトル" />  // プロフィールボタン自動表示
<PageHeader title="タイトル" showProfileButton={false} />  // 非表示
<PageHeader title="タイトル" rightSection={<Button>編集</Button>} />  // アクション追加
```

**NavigationButton:**
```typescript
<NavigationButton href="/quests/new">新規作成</NavigationButton>
```

**LoadingButton:**
```typescript
<LoadingButton onClick={handleSubmit}>送信</LoadingButton>
```

**SearchBar:**
```typescript
<SearchBar value={search} onChange={setSearch} placeholder="検索" />
```

**EmptyState:**
```typescript
<EmptyState 
  message="データがありません" 
  actionLabel="新規作成"
  onAction={() => router.push('/new')}
/>
```


画面遷移時に自動的にローディング状態を管理するボタン。クリック時に`useRouter().push()`で遷移し、ローディングを開始する。

**Props:**
```typescript
type NavigationButtonProps = Omit<ButtonProps, "onClick"> & {
  href: string  // 遷移先のURL
  ignoreLoading?: boolean  // ローディング状態を無視する（デフォルト: false）
}
```

**使用例:**
```typescript
import { NavigationButton } from '@/app/(core)/_components/NavigationButton'

// 基本的な使用
<NavigationButton href="/quests/123">
  クエスト詳細を見る
</NavigationButton>

// Mantineのボタンプロパティも使用可能
<NavigationButton 
  href="/families/456/edit"
  variant="outline"
  leftSection={<IconEdit size={16} />}
  fullWidth
>
  編集
</NavigationButton>
```

**動作:**
1. クリック時に`startLoading()`を自動実行
2. `useRouter().push(href)`で画面遷移
3. 画面左上にLoadingIndicatorが表示される
4. 遷移先の`ScreenWrapper`がマウントされると自動的に停止
5. 3秒経過しても停止しない場合はタイムアウトで自動停止

### LoadingButton
API呼び出しなど非同期処理時に自動的にローディング状態を開始するボタン。ローディング中は押せないようにdisabledになる。

**Props:**
```typescript
type LoadingButtonProps = ButtonProps & {
  onClick?: () => void
  ignoreLoading?: boolean  // ローディング状態を無視する（デフォルト: false）
}
```

**使用例:**
```typescript
import { LoadingButton } from '@/app/(core)/_components/LoadingButton'
import { useLoadingContext } from '@/app/(core)/_components/LoadingContext'

const MyComponent = () => {
  const { stopLoading } = useLoadingContext()
  
  const handleSubmit = async () => {
    try {
      await submitForm()
    } finally {
      stopLoading()
    }
  }
  
  return (
    <LoadingButton onClick={handleSubmit}>
      送信
    </LoadingButton>
  )
}
```

**動作:**
1. クリック時に`startLoading()`を自動実行
2. 画面左上にLoadingIndicatorが表示される
3. 手動で`stopLoading()`を呼び出すまで継続
4. 3秒経過しても停止しない場合はタイムアウトで自動停止

**NavigationButtonとの使い分け:**
- **NavigationButton**: 画面遷移時に使用（hrefを指定）
- **LoadingButton**: API呼び出しなど非遷移処理時に使用（onClickを定義）

### ScreenWrapper
画面コンポーネント用のラッパー。画面遷移完了を検知してローディングを停止する。

**必須:**
- すべての`XxxScreen.tsx`で使用すること

**使用例:**
```typescript
import { ScreenWrapper } from '@/app/(core)/_components/ScreenWrapper'

export const FamilyQuestsScreen = () => {
  return (
    <ScreenWrapper>
      <div>画面内容</div>
    </ScreenWrapper>
  )
}
```

### LoadingContext
ローディング状態をグローバルに管理するコンテキスト。通常は直接使用しない。

**フック:**
```typescript
const { isLoading, startLoading, stopLoading } = useLoadingContext()
```

**手動でローディングを制御する場合:**
```typescript
import { useLoadingContext } from '@/app/(core)/_components/LoadingContext'

const MyComponent = () => {
  const { startLoading, stopLoading } = useLoadingContext()
  
  const handleCustomAction = async () => {
    startLoading()
    try {
      await someAsyncOperation()
    } finally {
      stopLoading()
    }
  }
  
  return <button onClick={handleCustomAction}>実行</button>
}
```

### LoadingIndicator
画面右上にローディングインジケーターを表示する。AppShellContentで自動的に表示されるため、通常は直接使用しない。

**表示位置:**
- position: fixed
- top: 16px
- right: 16px
- z-index: 9999

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## FABビジュアルスタイル詳細

### Liquid Glass効果
すべてのFABコンポーネント（メインボタン・子アイテム）にiOS 26 Liquid Glass風のぼかし効果を適用。

**スタイル仕様:**
- `backdropFilter: "blur(12px)"` 
- `WebkitBackdropFilter: "blur(12px)"` (Safari対応)
- 半透明背景と組み合わせてガラスモーフィズム効果を実現

### メインボタンスタイル
- 不透明度: `opacity: 1` (完全不透明)
- サイズ: `FAB_SPACING.mainButtonSize` (56px)
- 影: `boxShadow: "0 8px 24px rgba(0,0,0,0.22)"`
- ボーダー: アクティブ時フォーカスカラー
- blur効果あり

### 子アイテムスタイル
- 不透明度: `theme.fab.opacity.inactive` (0.95)
- ラベル文字色: `#1a1a1a` (黒)
- ラベル影: `textShadow: "0 1px 2px rgba(255,255,255,0.8)"` (白のグロー効果)
- blur効果あり

**変更履歴:**
- 以前は白文字＋黒影だったが、blur背景では視認性が低いため黒文字＋白影に変更
- メインボタンの不透明度を上げて視認性向上

## ベストプラクティス

- 必要なPropsのみを渡す
- コンポーネントの責務を理解して使用
- 再利用可能性を考慮
- NavigationFABとSubMenuFABを優先的に使用（FloatingActionButtonは拡張用途のみ）

## 注意点

- Propsの型定義を確認
- Mantine UIのスタイル規約に従う
- 共通コンポーネントを直接編集しない
- backdrop-filterはブラウザサポートを確認（主要モダンブラウザは対応済み）

## Structuring This Skill

[TODO: Choose the structure that best fits this skill's purpose. Common patterns:

**1. Workflow-Based** (best for sequential processes)
- Works well when there are clear step-by-step procedures
- Example: DOCX skill with "Workflow Decision Tree" → "Reading" → "Creating" → "Editing"
- Structure: ## Overview → ## Workflow Decision Tree → ## Step 1 → ## Step 2...

**2. Task-Based** (best for tool collections)
- Works well when the skill offers different operations/capabilities
- Example: PDF skill with "Quick Start" → "Merge PDFs" → "Split PDFs" → "Extract Text"
- Structure: ## Overview → ## Quick Start → ## Task Category 1 → ## Task Category 2...

**3. Reference/Guidelines** (best for standards or specifications)
- Works well for brand guidelines, coding standards, or requirements
- Example: Brand styling with "Brand Guidelines" → "Colors" → "Typography" → "Features"
- Structure: ## Overview → ## Guidelines → ## Specifications → ## Usage...

**4. Capabilities-Based** (best for integrated systems)
- Works well when the skill provides multiple interrelated features
- Example: Product Management with "Core Capabilities" → numbered capability list
- Structure: ## Overview → ## Core Capabilities → ### 1. Feature → ### 2. Feature...

Patterns can be mixed and matched as needed. Most skills combine patterns (e.g., start with task-based, add workflow for complex operations).

Delete this entire "Structuring This Skill" section when done - it's just guidance.]

## [TODO: Replace with the first main section based on chosen structure]

[TODO: Add content here. See examples in existing skills:
- Code samples for technical skills
- Decision trees for complex workflows
- Concrete examples with realistic user requests
- References to scripts/templates/references as needed]

## Resources

This skill includes example resource directories that demonstrate how to organize different types of bundled resources:

### scripts/
Executable code (Python/Bash/etc.) that can be run directly to perform specific operations.

**Examples from other skills:**
- PDF skill: `fill_fillable_fields.py`, `extract_form_field_info.py` - utilities for PDF manipulation
- DOCX skill: `document.py`, `utilities.py` - Python modules for document processing

**Appropriate for:** Python scripts, shell scripts, or any executable code that performs automation, data processing, or specific operations.

**Note:** Scripts may be executed without loading into context, but can still be read by Claude for patching or environment adjustments.

### references/
Documentation and reference material intended to be loaded into context to inform Claude's process and thinking.

**Examples from other skills:**
- Product management: `communication.md`, `context_building.md` - detailed workflow guides
- BigQuery: API reference documentation and query examples
- Finance: Schema documentation, company policies

**Appropriate for:** In-depth documentation, API references, database schemas, comprehensive guides, or any detailed information that Claude should reference while working.

### assets/
Files not intended to be loaded into context, but rather used within the output Claude produces.

**Examples from other skills:**
- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
