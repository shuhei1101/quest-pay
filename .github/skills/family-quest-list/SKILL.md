---
name: family-quest-list
description: 家族クエスト一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、処理フローを含む。 Trigger Keywords: family quest list, quest list, quest management screen
---

# 家族クエスト一覧 スキル

## 概要

このスキルは、家族クエスト一覧画面のタブ制御、フィルタリング・ソート、ページネーション機能の知識を提供します。公開/家族/違反リスト/テンプレートの4つのタブを持つ複雑な一覧画面です。

## メインソースファイル

### 画面コンポーネント
- `packages/web/app/(app)/quests/family/page.tsx`: リダイレクト専用（サーバーコンポーネント）
- `packages/web/app/(app)/quests/family/FamilyQuestsScreen.tsx`: 一覧画面のメイン実装

### 関連コンポーネント
- `packages/web/app/(app)/quests/family/_components/FamilyQuestList.tsx`: 家族クエスト一覧表示
- `packages/web/app/(app)/quests/family/_components/FamilyQuestCardLayout.tsx`: クエストカード
- `packages/web/app/(app)/quests/family/_components/FamilyQuestFilterPopup.tsx`: フィルタポップアップ
- `packages/web/app/(app)/quests/family/_components/FamilyQuestSortPopup.tsx`: ソートポップアップ
- `packages/web/app/(app)/quests/_components/QuestListLayout.tsx`: 共通一覧レイアウト

### フック
- `packages/web/app/(app)/quests/family/_hooks/useFamilyQuests.ts`: 家族クエストデータ取得
- `packages/web/app/(app)/quests/category/_hook/useQuestCategories.ts`: カテゴリデータ取得

### API
- `packages/web/app/api/quests/family/route.ts`: 家族クエスト一覧取得API
- `packages/web/app/api/quests/family/client.ts`: APIクライアント
- `packages/web/app/api/quests/family/query.ts`: React Queryフック

## 主要機能グループ

### 1. タブ制御
- 4つのタブ（公開/家族/違反リスト/テンプレート）
- URLクエリパラメータとの同期
- タブごとの色変更

### 2. フィルタリング・ソート
- クエスト名検索
- カテゴリ選択
- タグ選択
- 報酬範囲指定
- 複数カラムソート

### 3. ページネーション
- ページ切り替え
- オフセット計算
- keepPreviousDataによるちらつき防止

### 4. データ管理
- React Queryによるキャッシュ管理
- URLクエリパラメータによるフィルター永続化

## Reference Files Usage

### コンポーネント構造を把握する場合
タブ構造、QuestListLayout、フィルター/ソートポップアップを確認：
```
references/component_structure.md
```

### データ取得方法を理解する場合
フィルタリング、ソート、ページング付きAPI呼び出しを確認：
```
references/data_fetching.md
```

### 画面フローを追う場合
タブ切り替え、フィルタリング、ソート、ページネーションの各フローを確認：
```
references/flow_diagram.md
```

### リスト操作を確認する場合
タブ切り替え、フィルター操作、ソート操作、URL管理を確認：
```
references/list_operations.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でタブ構造確認
2. **データフローの理解**: `references/data_fetching.md`でフィルター・ソート仕様確認
3. **実装時**: `references/flow_diagram.md`でタブ・フィルター処理確認
4. **操作実装時**: `references/list_operations.md`でURL管理パターン確認

## 実装上の注意点

### 必須パターン

#### タブ制御
URLクエリパラメータとタブ状態の同期:
```typescript
const handleTabChange = (value: string | null) => {
  if (!value) return
  setTabValue(value)
  const params = new URLSearchParams(searchParams.toString())
  params.set('tab', value)
  router.replace(`?${params.toString()}`, { scroll: false })
}
```

#### フィルタリング
フィルター条件をURLに反映:
```typescript
const handleFilterSearch = (filter: FamilyQuestFilterType) => {
  const paramsObj = Object.fromEntries(
    Object.entries(filter)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  )
  const params = new URLSearchParams(paramsObj)
  router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
  setSearchFilter(filter)
}
```

### 主要機能

#### クエスト検索・フィルタリング
- ソート（名前、作成日、更新日など）
- ページネーション

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## API エンドポイント

### 家族クエスト一覧取得
**パス:** `/api/quests/family`
**メソッド:** GET
**用途:** 家族クエストの一覧を取得

**クエリパラメータ:**
- `tags`: タグフィルタ
- `name`: 名前検索
- `categoryId`: カテゴリフィルタ
- `sortColumn`: ソート列
- `sortOrder`: ソート順（ASC/DESC）
- `page`: ページ番号
- `pageSize`: 1ページあたりの件数

**レスポンス:**
```typescript
{
  rows: FamilyQuest[]
  totalRecords: number
}
```

## 処理フロー

### 初期表示フロー
1. FamilyQuestsScreen がマウント
2. クエリパラメータから `tab` を取得（デフォルト: 'public'）
3. タブに応じたコンポーネントを表示
4. 各タブコンポーネントがデータを取得・表示

### フィルタ・ソートフロー
1. ユーザーがフィルタ/ソート条件を変更
2. useFamilyQuests フックが再実行
3. APIリクエストが送信
4. 新しいデータで一覧が再レンダリング

## データフロー

```
User Action → FamilyQuestList → useFamilyQuests → API → Database
     ↓              ↓                 ↓           ↓        ↓
  フィルタ      状態管理         useQuery     route.ts   schema
```

## 注意点

- page.tsx はリダイレクト専用（アーキテクチャ原則）
- FamilyQuestsScreen が API 呼び出しを含む（Screen の役割）
- タブ切り替えは Suspense でラップして遅延ロード最適化
- クエリパラメータでタブ状態を管理（ブラウザバック対応）


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
