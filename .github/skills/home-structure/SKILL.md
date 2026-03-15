---
name: home-structure
description: ホーム画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。
---

# ホーム画面 スキル

## 概要

このスキルは、Quest Payアプリのホーム画面（ダッシュボード）の知識を提供します。ユーザーロール（親 or 子供）に応じた統計情報、最近のクエスト、通知表示、クイックアクションを含みます。

## メインソースファイル

### ページ・画面
- `packages/web/app/(app)/home/page.tsx`: ホームページ

### コンポーネント
- `packages/web/app/(app)/home/_components/DashboardHeader.tsx`: ヘッダー（タイトル + ロールバッジ）
- `packages/web/app/(app)/home/_components/DashboardSummary.tsx`: 統計情報カード群
- `packages/web/app/(app)/home/_components/StatCard.tsx`: 統計カード
- `packages/web/app/(app)/home/_components/QuickActionCard.tsx`: クイックアクションカード
- `packages/web/app/(app)/home/_components/RecentQuests.tsx`: 最近のクエスト一覧
- `packages/web/app/(app)/home/_components/QuestCard.tsx`: クエストカード
- `packages/web/app/(app)/home/_components/RecentNotifications.tsx`: 最近の通知一覧
- `packages/web/app/(app)/home/_components/NotificationItem.tsx`: 通知アイテム

### フック
- `packages/web/app/(app)/home/_hooks/useHomeSummary.ts`: サマリーデータ取得
- `packages/web/app/(app)/home/_hooks/useRecentQuests.ts`: 最近のクエスト取得
- `packages/web/app/(app)/home/_hooks/useRecentNotifications.ts`: 最近の通知取得

### API
- `packages/web/app/api/home/summary/route.ts`: サマリーデータAPI
- `packages/web/app/api/quests/recent/route.ts`: 最近のクエストAPI
- `packages/web/app/api/notifications/recent/route.ts`: 最近の通知API

## 主要機能グループ

### 1. ユーザーロール別表示
- **親**: 総クエスト数、アクティブクエスト、完了済み、新規作成アクション
- **子供**: レベル、経験値、獲得報酬、クエスト探すアクション

### 2. 統計情報
- カード形式での視覚的な統計表示
- アイコン + 数値 + ラベルの構成
- レスポンシブグリッドレイアウト（モバイル1列、タブレット2列、デスクトップ4列）

### 3. 最近のアクティビティ
- 最近のクエスト（最大5件）
- 最近の通知（最大5件、未読優先）
- "もっと見る"リンクで一覧ページへ遷移

## Reference Files Usage

### コンポーネント構造を把握する場合
画面階層、カードレイアウト、ロール別表示を確認：
```
references/component_structure.md
```

### データ取得フローを理解する場合
並列データ取得、キャッシュ戦略、エラーハンドリングを確認：
```
references/flow_diagram.md
```

### ダッシュボードデータ詳細を確認する場合
集計ロジック、データ型、パフォーマンス最適化を確認：
```
references/dashboard_data.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でコンポーネント階層確認
2. **データフローの理解**: `references/flow_diagram.md`で初期表示フロー確認
3. **実装時**: `references/dashboard_data.md`でデータ構造・集計方法確認

## 実装上の注意点

### 必須パターン
- **ロール判定**: `userInfo?.profiles?.type` で親 or 子供を判定
- **並列データ取得**: useHomeSummary、useRecentQuests、useRecentNotifications を同時実行
- **キャッシュ**: サマリーデータは5分間fresh、staleTime設定

### 推奨パターン
- **ローディング状態**: サマリー取得中は LoadingOverlay 表示
- **レスポンシブ**: Grid breakpoints （base: 12, sm: 6, md: 3）で対応
- **エラーハンドリング**: 部分的なデータ取得失敗でも表示可能なデータは表示

### データ集計の最適化
- **並列実行**: Promise.all でDB クエリを並列化
- **キャッシュ戦略**: React Query のstaleTime/cacheTime活用
- **楽観的更新**: クエスト完了時にサマリーを即座に更新

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
