---
name: child-quest-view
description: 子供クエスト閲覧画面の構造知識を提供するスキル。表示内容、完了報告機能を含む。
---

# 子供クエスト閲覧 スキル

## 概要

子供クエスト閲覧画面は、子供ユーザーが受注したクエストの詳細を表示し、完了報告を行う画面。

## ファイル構成

### メインファイル
- `app/(app)/quests/child/[id]/page.tsx`: 子供クエスト詳細ページ
- `app/(app)/quests/child/[id]/ChildQuestViewScreen.tsx`: 閲覧画面実装

### 関連コンポーネント
- `app/(app)/quests/child/_components/ChildQuestDetail.tsx`: クエスト詳細表示
- `app/(app)/quests/child/_components/ReportButton.tsx`: 完了報告ボタン
- `app/(app)/quests/child/_components/ProgressTracker.tsx`: 進捗トラッカー

### フック
- `app/(app)/quests/child/_hooks/useChildQuest.ts`: 子供クエストデータ取得フック
- `app/(app)/quests/child/_hooks/useReportCompletion.ts`: 完了報告フック

## 主要コンポーネント

### ChildQuestViewScreen
**責務:** 子供クエストの詳細表示と完了報告管理

**主要機能:**
- クエスト詳細情報表示
- 完了報告
- 報告キャンセル
- 進捗状況表示

## 処理フロー

### 初期表示フロー
1. ChildQuestViewScreen がマウント
2. useChildQuest フックでクエスト詳細を取得
3. クエスト詳細と進捗を表示

### 完了報告フロー
1. ユーザーが「完了報告」ボタンをクリック
2. useReportCompletion フックで完了報告
3. ステータスを「完了報告中」に更新
4. 親に通知

## 注意点

- 子供ユーザーのみアクセス可能
- 完了報告後は親の承認が必要
- 報告後のキャンセルも可能

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
