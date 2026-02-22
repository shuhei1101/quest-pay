---
name: family-quest-list
description: 家族クエスト一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、処理フローを含む。
---

# 家族クエスト一覧 スキル

## 概要

家族クエスト一覧画面は、家族内で作成されたクエストの一覧を表示する画面。タブで公開クエスト、家族クエスト、違反リスト、テンプレートクエストを切り替え可能。

## ファイル構成

### メインファイル
- `app/(app)/quests/family/page.tsx`: リダイレクト専用（サーバーコンポーネント）
- `app/(app)/quests/family/FamilyQuestsScreen.tsx`: 一覧画面のメイン実装

### 関連コンポーネント
- `app/(app)/quests/family/_components/FamilyQuestList.tsx`: 家族クエスト一覧表示コンポーネント
- `app/(app)/quests/family/_components/FamilyQuestCardLayout.tsx`: クエストカードレイアウト
- `app/(app)/quests/family/_components/FamilyQuestFilter.tsx`: フィルタコンポーネント
- `app/(app)/quests/family/_components/FamilyQuestFilterPopup.tsx`: フィルタポップアップ
- `app/(app)/quests/family/_components/FamilyQuestSortPopup.tsx`: ソートポップアップ
- `app/(app)/quests/public/PublicQuestList.tsx`: 公開クエスト一覧（タブで表示）
- `app/(app)/quests/template/_components/TemplateQuestList.tsx`: テンプレートクエスト一覧（タブで表示）

### フック
- `app/(app)/quests/family/_hooks/useFamilyQuests.ts`: 家族クエストデータ取得フック

### API ルート
- `app/api/quests/family/route.ts`: 家族クエスト一覧取得API
- `app/api/quests/family/client.ts`: APIクライアント

## 主要コンポーネント

### FamilyQuestsScreen
**パス:** `app/(app)/quests/family/FamilyQuestsScreen.tsx`
**責務:** タブ制御、各タブパネルの表示管理

**主要機能:**
- タブ切り替え（public, family, penalty, template）
- クエリパラメータによるタブ状態管理
- FloatingActionButton による新規クエスト作成ボタン

### FamilyQuestList
**パス:** `app/(app)/quests/family/_components/FamilyQuestList.tsx`
**責務:** 家族クエストの一覧取得・表示・フィルタリング・ソート

**主要機能:**
- クエスト検索・フィルタリング
- ソート（名前、作成日、更新日など）
- ページネーション

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
