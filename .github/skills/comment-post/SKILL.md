---
name: comment-post
description: コメント投稿機能の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、処理フローを含む。
---

# コメント投稿 スキル

## 概要

コメント投稿機能は、公開クエストに対してコメントを投稿・編集・削除する機能。

## ファイル構成

### 関連コンポーネント
- `app/(app)/quests/public/_components/CommentForm.tsx`: コメント投稿フォーム
- `app/(app)/quests/public/_components/CommentEditForm.tsx`: コメント編集フォーム

### フック
- `app/(app)/quests/public/_hooks/usePostComment.ts`: コメント投稿フック
- `app/(app)/quests/public/_hooks/useEditComment.ts`: コメント編集フック
- `app/(app)/quests/public/_hooks/useDeleteComment.ts`: コメント削除フック

## 主要コンポーネント

### CommentForm
**責務:** コメントの投稿フォーム管理

**主要機能:**
- コメント入力
- バリデーション
- 投稿処理

## 処理フロー

### コメント投稿フロー
1. ユーザーがコメントを入力
2. バリデーション実行
3. usePostComment フックで投稿
4. コメント一覧を更新

### コメント編集フロー
1. ユーザーが編集ボタンをクリック
2. 編集フォーム表示
3. useEditComment フックで更新
4. コメント一覧を更新

## 注意点

- 認証ユーザーのみ投稿可能
- 自分のコメントのみ編集・削除可能
- コメント長は最大1000文字

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
