---
name: template-quest-view
description: テンプレートクエスト閲覧画面の構造知識を提供するスキル。表示内容、採用機能を含む。
---

# テンプレートクエスト閲覧 スキル

## 概要

テンプレートクエスト閲覧画面は、特定のテンプレートクエストの詳細を表示し、家族クエストとして採用できる画面。

## ファイル構成

### メインファイル
- `app/(app)/quests/template/[id]/page.tsx`: テンプレートクエスト詳細ページ
- `app/(app)/quests/template/[id]/TemplateQuestViewScreen.tsx`: 閲覧画面実装

### 関連コンポーネント
- `app/(app)/quests/template/_components/TemplateQuestDetail.tsx`: テンプレート詳細表示
- `app/(app)/quests/template/_components/AdoptButton.tsx`: 採用ボタン

### フック
- `app/(app)/quests/template/_hooks/useTemplateQuest.ts`: テンプレートクエストデータ取得フック

## 主要コンポーネント

### TemplateQuestViewScreen
**責務:** テンプレートクエストの詳細表示と採用機能

**主要機能:**
- テンプレート詳細情報表示
- 家族クエストとして採用
- プレビュー機能

## 処理フロー

### 初期表示フロー
1. TemplateQuestViewScreen がマウント
2. useTemplateQuest フックでテンプレート詳細を取得
3. テンプレート詳細を表示

### 採用フロー
1. ユーザーが「採用」ボタンをクリック
2. テンプレートを基に家族クエストを作成
3. 家族クエスト編集画面にリダイレクト

## 注意点

- テンプレートは編集不可
- 採用時に家族クエストとしてコピーされる

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
