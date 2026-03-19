---
name: comment-api
description: コメントAPI操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。 Trigger Keywords: comment API, comment CRUD, comment operations, post comment
---

# コメントAPI スキル

## 概要

このスキルは、公開クエストに対するコメント機能を管理するAPI群の知識を提供します。基本的なCRUD操作に加えて、評価（高評価・低評価）、ピン留め、公開者いいね、報告といったモデレーション機能を含みます。

## メインソースファイル

### API Routes
- `packages/web/app/api/quests/public/[id]/comments/route.ts`: 一覧取得、新規作成
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/route.ts`: 更新、削除
- `packages/web/app/api/quests/public/[id]/comments/count/route.ts`: コメント数取得
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/upvote/route.ts`: 高評価
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/downvote/route.ts`: 低評価
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/pin/route.ts`: ピン留め
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/publisher-like/route.ts`: 公開者いいね
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/report/route.ts`: 報告

### クライアント側
- `packages/web/app/api/quests/public/[id]/comments/client.ts`: APIクライアント関数（基本CRUD、カウント）
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/client.ts`: APIクライアント関数（編集・削除）
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/upvote/client.ts`: 高評価クライアント
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/downvote/client.ts`: 低評価クライアント
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/pin/client.ts`: ピン留めクライアント
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/publisher-like/client.ts`: 公開者いいねクライアント
- `packages/web/app/api/quests/public/[id]/comments/[commentId]/report/client.ts`: 報告クライアント

### データベース
- `drizzle/schema.ts`: public_quest_comments, comment_upvotes, comment_reports

## 主要機能グループ

### 1. 基本CRUD
- コメント一覧取得、新規投稿、更新、削除、コメント数取得

### 2. 評価機能
- 高評価（upvote）、低評価（downvote）、評価取消
- 自分のコメントには評価不可

### 3. モデレーション機能
- **ピン留め**: 公開クエストの家族メンバーのみ実行可能、1クエストにつき1コメントのみ
- **公開者いいね**: 公開クエストの家族メンバーのみ実行可能
- **報告**: 不適切なコメントの報告（親ユーザのみ）

## Reference Files Usage

### データベース構造を把握する場合
コメント関連テーブルのER図と主要リレーションを確認：
```
references/er_diagram.md
```

### コメントライフサイクルを理解する場合
投稿から削除まで、モデレーション機能を含むフロー図を確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、バリデーションロジックを確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、エラーコード、権限制御を確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でライフサイクル確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン
- **client.ts + route.ts**: セットで実装
- **React Query**: useQuery/useMutationでAPIアクセス
- **トランザクション**: ピン留めで既存解除+新規設定時に使用
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- **親のみ**: コメント投稿、評価、報告、ピン留め、公開者いいね
- **投稿者のみ**: 自分のコメントの更新・削除
- **家族メンバー**: ピン留め、公開者いいね（公開クエストの家族のみ）

### バリデーション
- **自己評価禁止**: 自分のコメントには高評価・低評価不可
- **家族チェック**: ピン留めと公開者いいねは公開クエストの家族メンバーのみ
- **ピン留め制約**: 1つの公開クエストにつき1つのコメントのみピン留め可能（DB制約）

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
