---
name: child-quest-list
description: 子供クエスト一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、処理フローを含む。
---

# 子供クエスト一覧 スキル

## 概要

子供クエスト一覧画面は、子供ユーザーが受注したクエストの一覧を表示する画面。進行状況、完了報告、報酬確認機能を提供。

## ファイル構成

### メインファイル
- `app/(app)/quests/child/page.tsx`: リダイレクト専用（サーバーコンポーネント）
- `app/(app)/quests/child/ChildQuestsScreen.tsx`: 一覧画面のメイン実装

### 関連コンポーネント
- `app/(app)/quests/child/_components/ChildQuestList.tsx`: 子供クエスト一覧表示
- `app/(app)/quests/child/_components/ChildQuestCard.tsx`: クエストカード
- `app/(app)/quests/child/_components/ChildQuestStatusBadge.tsx`: ステータスバッジ

### フック
- `app/(app)/quests/child/_hooks/useChildQuests.ts`: 子供クエストデータ取得フック

### API ルート
- `app/api/quests/child/route.ts`: 子供クエスト一覧取得API
- `app/api/quests/child/client.ts`: APIクライアント

## 主要コンポーネント

### ChildQuestsScreen
**責務:** 子供クエストの一覧表示とステータス管理

**主要機能:**
- 受注クエスト一覧表示
- ステータス別フィルタ（進行中、完了報告中、完了など）
- 完了報告機能
- 報酬履歴表示

## 処理フロー

### 初期表示フロー
1. ChildQuestsScreen がマウント
2. useChildQuests フックでデータ取得
3. 子供クエスト一覧を表示

### 完了報告フロー
1. ユーザーが「完了報告」ボタンをクリック
2. 完了報告APIを呼び出し
3. ステータスを「完了報告中」に更新
4. 親の承認待ち

## 注意点

- 子供ユーザーのみアクセス可能
- 完了報告後は親の承認が必要
- 報酬は承認後に付与

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
