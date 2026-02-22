---
name: family-quest-edit
description: 家族クエスト編集画面の構造知識を提供するスキル。ファイル構成、フォーム管理、バリデーション、処理フローを含む。
---

# 家族クエスト編集 スキル

## 概要

家族クエスト編集画面は、家族クエストの作成・更新を行う画面。基本設定、詳細設定、子供設定の3つのセクションで構成される。

## ファイル構成

### メインファイル
- `app/(app)/quests/family/[id]/page.tsx`: リダイレクト専用
- `app/(app)/quests/family/[id]/FamilyQuestEdit.tsx`: 編集画面のメイン実装
- `app/(app)/quests/family/[id]/form.ts`: フォームスキーマ（Zod）
- `app/(app)/quests/family/new/page.tsx`: 新規作成のリダイレクト

### 関連コンポーネント
- `_components/BasicSettings.tsx`: 基本設定コンポーネント
- `_components/DetailSettings.tsx`: 詳細設定コンポーネント
- `_components/ChildSettings.tsx`: 子供設定コンポーネント

### フック
- `_hooks/useFamilyQuestForm.ts`: フォーム状態管理
- `_hooks/useRegisterFamilyQuest.ts`: 新規作成
- `_hooks/useUpdateFamilyQuest.ts`: 更新
- `_hooks/useDeleteFamilyQuest.ts`: 削除
- `_hooks/usePublishFamilyQuest.ts`: 公開

### API ルート
- `app/api/quests/family/route.ts`: POST（新規作成）
- `app/api/quests/family/[id]/route.ts`: GET（取得）、PUT（更新）、DELETE（削除）
- `app/api/quests/family/[id]/publish/route.ts`: POST（公開）

## 主要コンポーネント

### FamilyQuestEdit
**責務:** フォーム全体の管理、保存・削除・公開の制御
**使用レイアウト:** QuestEditLayout

## 処理フロー

### 新規作成フロー
1. 新規作成ボタンクリック
2. FamilyQuestEdit（id なし）がマウント
3. フォーム入力
4. 保存ボタンクリック → useRegisterFamilyQuest
5. API POST → DB INSERT
6. IDを取得して編集画面に遷移

### 更新フロー
1. クエストクリック
2. FamilyQuestEdit（id あり）がマウント
3. useFamilyQuestForm でデータ取得
4. フォーム編集
5. 保存ボタンクリック → useUpdateFamilyQuest
6. API PUT → DB UPDATE

## 注意点

- フォームスキーマは Zod で定義
- レベル別の詳細設定を保持
- セッションストレージでフォーム状態を保持（画面遷移時）
- アイコン選択ポップアップを使用

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
