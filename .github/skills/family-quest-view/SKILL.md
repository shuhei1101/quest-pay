---
name: family-quest-view
description: 家族クエスト閲覧画面の構造知識を提供するスキル。ファイル構成、表示内容、子供向け機能を含む。
---

# 家族クエスト閲覧 スキル

## 概要

家族クエスト閲覧画面は、クエストの詳細を読み取り専用で表示する画面。子供がクエストを受注・報告する機能も含む。

## ファイル構成

### メインファイル
- `app/(app)/quests/family/[id]/view/page.tsx`: リダイレクト専用
- `app/(app)/quests/family/[id]/view/FamilyQuestViewScreen.tsx`: 閲覧画面のメイン実装
- `app/(app)/quests/family/[id]/view/child/[childId]/page.tsx`: 子供専用ビュー
- `app/(app)/quests/family/[id]/view/child/[childId]/ChildQuestViewScreen.tsx`: 子供専用画面

### 関連コンポーネント
- `_components/QuestDetailDisplay.tsx`: クエスト詳細表示（共通）
- `_components/ChildQuestActions.tsx`: 子供用アクションボタン

### API ルート
- `app/api/quests/family/[id]/route.ts`: GET（クエスト詳細取得）
- `app/api/quests/family/[id]/child/[childId]/route.ts`: 子供クエスト操作
- `app/api/quests/family/[id]/review-request/route.ts`: 完了報告
- `app/api/quests/family/[id]/cancel-review/route.ts`: 報告キャンセル
- `app/api/quests/family/[id]/child/[childId]/approve/route.ts`: 報告承認
- `app/api/quests/family/[id]/child/[childId]/reject/route.ts`: 報告却下

## 主要機能

### 親ビュー
- クエスト詳細の表示
- 編集ボタン → 編集画面へ遷移
- 削除ボタン
- 公開ボタン

### 子供ビュー
- クエスト詳細の表示
- 受注ボタン
- 完了報告ボタン
- 報告キャンセルボタン

### 親による子供クエスト管理
- 完了報告の承認
- 完了報告の却下

## 注意点

- 閲覧画面はAPI呼び出しを含む（Screen の役割）
- 親と子供でビューが異なる
- 子供IDがある場合は子供専用ビューを表示

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
