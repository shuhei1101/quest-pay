---
name: child-management-edit
description: 子供編集画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。
---

# 子供編集 スキル

## 概要

このスキルは、子供アカウントの新規作成と編集を行う画面の知識を提供します。React Hook Form + Zodによるフォーム管理、アイコン選択、バリデーションを含みます。

## メインソースファイル

### ページコンポーネント
- `packages/web/app/(app)/children/[id]/page.tsx`: 子供編集ページ（編集時）
- `packages/web/app/(app)/children/new/page.tsx`: 子供新規登録ページ

### メインコンポーネント
- `packages/web/app/(app)/children/[id]/_components/ChildForm.tsx`: 子供フォーム（新規作成・編集共通）

### フォーム管理
- `packages/web/app/(app)/children/[id]/form.ts`: Zodスキーマ定義
- `packages/web/app/(app)/children/[id]/_hook/useChildForm.ts`: フォーム状態管理フック
- `packages/web/app/(app)/children/[id]/_hook/useRegisterChild.ts`: 登録・更新処理フック

### API
- `packages/web/app/api/children/[id]/client.ts`: APIクライアント関数

## 主要機能グループ

### 1. フォーム入力
- 名前、アイコン、誕生日の入力
- リアルタイムバリデーション
- アイコン選択ポップアップ

### 2. データ管理
- 新規作成時: デフォルト値でフォーム初期化
- 編集時: React Query でデータ取得 → フォーム設定

### 3. 送信処理
- 新規作成: POST /api/children
- 更新: PUT /api/children/[id]
- 成功時: トースト通知 → 一覧画面へ遷移

## Reference Files Usage

### コンポーネント構造を把握する場合
画面階層、使用コンポーネント、Props定義を確認：
```
references/component_structure.md
```

### フォーム管理を理解する場合
React Hook Form セットアップ、データフェッチング、送信処理を確認：
```
references/form_management.md
```

### 画面フローを把握する場合
初期化 → データ取得 → 編集 → バリデーション → 送信の流れを確認：
```
references/flow_diagram.md
```

### バリデーションルールを確認する場合
Zodスキーマ、フィールド別ルール、エラー表示パターンを確認：
```
references/validation_rules.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`で画面フロー確認
2. **フォーム構造の理解**: `references/component_structure.md`でコンポーネント階層確認
3. **実装時**: `references/form_management.md`でフォーム管理詳細確認
4. **バリデーション実装時**: `references/validation_rules.md`で検証ルール確認

## 実装上の注意点

### 必須パターン
- React Hook Form + Zod Resolver の使用
- エラーハンドリング（handleAppError）
- トースト通知（react-hot-toast）

### アイコン選択
- RenderIcon + IconSelectPopup コンポーネントの使用
- iconId と iconColor の両方を管理

### 状態管理
- isLoading: データ取得中
- isSubmitting: 送信中
- isValueChanged: 変更検知（未保存確認用）
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
