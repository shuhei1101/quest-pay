---
name: common-components-usage
description: 共通コンポーネントの使用方法を提供するスキル。Props定義、使用例を含む。
---

# 共通コンポーネント使用方法 スキル

## 概要

共通コンポーネントの使用方法を説明するスキル。Props定義、使用例、ベストプラクティスを含む。

## 基本的な使用パターン

### NavigationFAB
ナビゲーションメニューを表示する場合に使用。左下に固定され、右に展開される。

```typescript
<NavigationFAB
  items={[
    { icon: <IconHome />, label: "ホーム", onClick: () => router.push('/') },
    { icon: <IconClipboard />, label: "クエスト", onClick: () => router.push('/quests') },
    { icon: <IconUsers />, label: "メンバー", onClick: () => router.push('/members') }
  ]}
  activeIndex={0}
  defaultOpen={false}
/>
```

### SubMenuFAB
サブメニューを表示する場合に使用。右下に固定され、上に展開される。戻るボタンがデフォルトで追加される。

```typescript
<SubMenuFAB
  items={[
    { icon: <IconEdit />, label: "編集", onClick: handleEdit, color: "blue" },
    { icon: <IconPlus />, label: "新規", onClick: handleCreate, color: "green" }
  ]}
  showBackButton={true}  // デフォルトtrue、戻るボタンを表示
/>
```

### FloatingActionButton（基底コンポーネント）
カスタムなFAB動作が必要な場合に使用。NavigationFABやSubMenuFABでカバーできない場合のみ使用する。

```typescript
<FloatingActionButton
  items={items}
  pattern="radial-up"
  slideDirection="right"
  mainIcon={<IconMenu />}
  showBackButton={false}
/>
```

### SearchBar
検索機能を提供する場合に使用。

```typescript  
<SearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="クエストを検索"
/>
```

### QuestCard
クエストのカード表示。

```typescript
<QuestCard
  quest={quest}
  onClick={() => navigate(`/quests/${quest.id}`)}
  showActions={true}
/>
```

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
- showBackButtonはデフォルトtrueなので、不要な場合のみfalseを指定

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
