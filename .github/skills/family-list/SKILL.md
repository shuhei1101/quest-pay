---
name: family-list
description: 家族一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。
---

# 家族一覧 スキル

## 概要

このスキルは、家族一覧画面の構造、データフェッチング、リスト操作の知識を提供します。ユーザーが所属する家族の一覧表示と管理を担当します。

## メインソースファイル

### 画面コンポーネント
- `packages/web/app/(app)/families/page.tsx`: ルート（サーバーコンポーネント）
- `packages/web/app/(app)/families/FamiliesScreen.tsx`: 一覧画面メイン

### 関連コンポーネント
- `packages/web/app/(app)/families/_components/FamilyList.tsx`: 家族一覧表示
- `packages/web/app/(app)/families/_components/FamilyCard.tsx`: 家族カード

### フック
- `packages/web/app/(app)/families/_hooks/useFamilies.ts`: 家族データ取得

## 主要機能グループ

### 1. 家族一覧表示
- 所属家族の一覧表示
- カード形式のUI
- ローディング・エラーハンドリング

### 2. ナビゲーション
- 家族詳細画面への遷移
- 新規家族作成画面への遷移

### 3. データ管理
- React Queryによるキャッシュ管理
- プルリフレッシュ対応（モバイル）

## Reference Files Usage

### コンポーネント構造を把握する場合
レイアウト、コンポーネント階層、スタイリングを確認：
```
references/component_structure.md
```

### データ取得方法を理解する場合
APIエンドポイント、フック、キャッシュ戦略を確認：
```
references/data_fetching.md
```

### 画面フローを追う場合
初期表示、ユーザーインタラクション、更新フローを確認：
```
references/flow_diagram.md
```

### リスト操作を確認する場合
選択、ナビゲーション、UI状態管理を確認：
```
references/list_operations.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でレイアウト確認
2. **データフローの理解**: `references/data_fetching.md`でAPI仕様確認
3. **実装時**: `references/flow_diagram.md`で処理フロー確認
4. **操作実装時**: `references/list_operations.md`で操作パターン確認

## 実装上の注意点

### 必須パターン

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

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


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
