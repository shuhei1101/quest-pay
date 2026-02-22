---
name: common-components-catalog
description: 共通コンポーネント一覧を提供するスキル。再利用可能なコンポーネントのカタログ。
---

# 共通コンポーネントカタログ スキル

## 概要

共通コンポーネントカタログは、アプリ全体で再利用されるコンポーネントの一覧。

## ファイル構成

### 共通コンポーネント
- `app/(app)/_components/`: 共通コンポーネントディレクトリ

## 主要コンポーネント一覧

### レイアウト関連
- SideMenu: サイドメニュー
- BottomBar: フッター（モバイル）
- NavigationItem: ナビゲーションアイテム
- UserInfo: ユーザー情報表示

### クエスト関連
- QuestCard: クエストカード
- QuestDetail: クエスト詳細表示
- QuestForm: クエストフォーム
- QuestStatusBadge: ステータスバッジ

### ボタン関連
- FloatingActionButton: フローティングアクションボタン
- LikeButton: いいねボタン
- ReportButton: 完了報告ボタン

### フィルター・検索
- SearchBar: 検索バー
- FilterPopup: フィルタポップアップ
- SortPopup: ソートポップアップ

### その他
- LoadingSpinner: ローディング表示
- ErrorMessage: エラーメッセージ
- EmptyState: 空状態表示

## 注意点

- すべての共通コンポーネントは`app/(app)/_components/`に配置
- Mantine UIを基本コンポーネントとして使用
- 再利用性を考慮した設計

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
