---
name: family-edit
description: 家族編集画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。 Trigger Keywords: 家族編集、家族フォーム、家族更新
---

# 家族編集 スキル

## 概要

このスキルは、家族の新規作成を行う画面の知識を提供します。React Hook Form + Zodによるフォーム管理、複数アイコン選択（家紋と親アイコン）、displayId検証を含みます。

**注意**: 現時点では新規作成専用。編集機能は未実装。

## メインソースファイル

### ページコンポーネント
- `packages/web/app/(app)/families/new/page.tsx`: 家族新規作成ページ

### メインコンポーネント
- `packages/web/app/(app)/families/new/FamilyNewScreen.tsx`: 家族新規作成画面

### フォーム管理
- `packages/web/app/(app)/families/new/form.ts`: Zodスキーマ定義
- `packages/web/app/(app)/families/new/_hooks/useFamilyRegisterForm.ts`: フォーム状態管理フック
- `packages/web/app/(app)/families/new/_hooks/useRegisterFamily.ts`: 登録処理フック

### API
- `packages/web/app/api/families/client.ts`: APIクライアント関数

## 主要機能グループ

### 1. フォーム入力
- 家族情報: ローカル名、オンライン名、displayId
- 家紋選択: アイコンID + カラー
- 親情報: 名前、アイコン、誕生日

### 2. アイコン選択
- 家紋選択ポップアップ
- 親アイコン選択ポップアップ
- それぞれ独立した状態管理

### 3. バリデーション
- Zodスキーマによるリアルタイム検証
- displayId: 3〜20文字、半角英数字/アンダースコア/ハイフン
- 各フィールドの型・長さチェック

### 4. 送信処理
- POST /api/families
- 成功時: トースト通知 → 家族一覧へ遷移
- 失敗時: トースト通知

## Reference Files Usage

### コンポーネント構造を把握する場合
画面階層、入力フィールド、アイコン選択ポップアップを確認：
```
references/component_structure.md
```

### フォーム管理を理解する場合
React Hook Form セットアップ、複数アイコン管理、送信処理を確認：
```
references/form_management.md
```

### 画面フローを把握する場合
初期化 → 入力 → アイコン選択 → バリデーション → 送信の流れを確認：
```
references/flow_diagram.md
```

### バリデーションルールを確認する場合
Zodスキーマ、フィールド別ルール（displayIdなど）、エラー表示パターンを確認：
```
references/validation_rules.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`で画面フロー確認
2. **フォーム構造の理解**: `references/component_structure.md`で入力フィールド確認
3. **実装時**: `references/form_management.md`で複数アイコン管理詳細確認
4. **バリデーション実装時**: `references/validation_rules.md`でdisplayIdルール確認

## 実装上の注意点

### 必須パターン
- React Hook Form + Zod Resolver の使用
- 複数アイコン選択の独立した状態管理
- displayId の重複チェック（サーバー側）

### テーマカラー
- デフォルトアイコンカラーにMantineテーマカラーを使用
- `useMantineTheme()` で取得

### 今後の拡張予定
- 編集機能の実装
- データフェッチングと初期値設定
- 更新処理（PUT /api/families/[id]）
- ローディング状態の管理

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


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
