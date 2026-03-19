---
name: comment-post
description: コメント投稿機能の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、処理フローを含む。 Trigger Keywords: コメント投稿、コメントフォーム、コメント送信、コメント書き込み
---

# コメント投稿 スキル

## 概要

このスキルは、公開クエストに対するコメント投稿機能の知識を提供します。モーダル内でのコメント入力、バリデーション、投稿処理、エラーハンドリングを含みます。

## メインソースファイル

### コンポーネント
- `packages/web/app/(app)/quests/public/[id]/comments/PublicQuestComments.tsx`: コメント統合管理
- `packages/web/app/(app)/quests/public/[id]/comments/_components/CommentsModalLayout.tsx`: モーダルレイアウト
- `packages/web/app/(app)/quests/public/[id]/comments/_components/CommentsLayout.tsx`: コメント一覧 + 入力欄

### フック
- `packages/web/app/(app)/quests/public/[id]/comments/_hooks/usePostComment.ts`: コメント投稿
- `packages/web/app/(app)/quests/public/[id]/comments/_hooks/usePublicQuestComments.ts`: コメント一覧取得

### API
- `packages/web/app/api/quests/public/[id]/comments/route.ts`: コメント投稿API
- `packages/web/app/api/quests/public/[id]/comments/client.ts`: APIクライアント

## 主要機能グループ

### 1. コメント入力
- Textarea での複数行入力（最大4行まで自動拡張）
- 空白のみのコメントは投稿不可
- リアルタイムバリデーション

### 2. コメント投稿
- 親ユーザーのみ投稿可能
- 投稿中の二重送信防止
- 成功時の入力欄クリア + コメント一覧更新

### 3. UI/UX
- モーダル内での85vh固定高さ表示
- スクロール可能なコメント一覧
- 下部固定の入力エリア

## Reference Files Usage

### コンポーネント構造を把握する場合
モーダル・レイアウト・入力欄の階層構造を確認：
```
references/component_structure.md
```

### 投稿処理フローを理解する場合
バリデーション、API呼び出し、キャッシュ更新の流れを確認：
```
references/flow_diagram.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でコンポーネント階層確認
2. **処理フローの理解**: `references/flow_diagram.md`で投稿フロー確認
3. **実装時**: 各ファイルの責務・Props定義を参照

## 実装上の注意点

### 必須パターン
- **バリデーション**: `!comment.trim()` で空白のみのコメントを拒否
- **二重送信防止**: `isPostingComment` フラグで投稿中はボタン無効化
- **キャッシュ無効化**: 投稿成功時に `queryClient.invalidateQueries` 実行

### 推奨パターン
- **楽観的更新は避ける**: コメント投稿では正確性を優先し、成功後にrefetch
- **toast通知**: 投稿成功時に `toast.success("コメントを投稿しました")`
- **エラーハンドリング**: `handleAppError` でエラータイプに応じた処理

### レイアウト設計
- **入力エリアの固定**: `flexShrink: 0` + `borderTop` で下部固定
- **スクロールエリア**: `flex: 1` + `overflow: auto` でコメント一覧を可変高さに
- **レスポンシブ**: Textarea は `flex: 1` で横幅いっぱいに拡張
- コメント長は最大1000文字

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
