---
name: child-quest-list
description: 子供クエスト一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、処理フローを含む。 Trigger Keywords: 子供クエスト一覧、マイクエスト、子供クエスト画面
---

# 子供クエスト一覧 スキル

## 概要

このスキルは、子供ユーザーが受注したクエストの一覧を表示し、フィルター・ソート・ページネーション機能を提供し、完了報告を行う画面の知識を提供します。

## メインソースファイル

### ページファイル
- `app/(app)/quests/child/page.tsx`: リダイレクト専用（サーバーコンポーネント）
- `app/(app)/quests/child/ChildQuestsScreen.tsx`: メイン画面

### コンポーネント
- `app/(app)/quests/child/_components/ChildQuestList.tsx`: クエストリスト
- `app/(app)/quests/child/_components/ChildQuestCardLayout.tsx`: クエストカード
- `app/(app)/quests/child/_components/ChildQuestFilter.tsx`: フィルター
- `app/(app)/quests/child/_components/ChildQuestFilterPopup.tsx`: フィルターポップアップ
- `app/(app)/quests/child/_components/ChildQuestSortPopup.tsx`: ソートポップアップ

### フック
- `app/(app)/quests/child/_hooks/useChildQuests.ts`: クエストデータ取得フック

### API
- `app/api/children/[id]/quests/client.ts`: APIクライアント関数
- `app/api/children/[id]/quests/route.ts`: 子供クエスト一覧取得

### データベース
- `drizzle/schema.ts`: child_quests, family_quests テーブル

## 主要機能グループ

### 1. リスト表示
- 子供が受注したクエストの一覧表示
- ページネーション（30件/ページ）
- ステータスバッジ表示（not_started, in_progress, pending_review, completed）

### 2. フィルター機能
- クエスト名での部分一致検索
- タグによるフィルタリング（複数選択可能）

### 3. ソート機能
- ソート可能な列：ID、クエスト名、カテゴリ、報酬額、期限
- ソート順：昇順、降順

### 4. クエスト操作
- クエスト詳細への遷移
- 完了報告（status = in_progress の場合のみ）

## Reference Files Usage

### コンポーネント構造を確認する場合
画面レイアウト、リストコンポーネント、フィルター、ソートの構造を確認：
```
references/component_structure.md
```

### データ取得方法を確認する場合
React Queryフック、ページネーション、フィルター、ソートのデータ取得を確認：
```
references/data_fetching.md
```

### 処理フローを理解する場合
初期表示、フィルター適用、ソート変更、ページ変更、完了報告のフローを確認：
```
references/flow_diagram.md
```

### リスト操作を確認する場合
閲覧操作、クエスト操作、フィルター・ソート・ページネーション操作を確認：
```
references/list_operations.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でレイアウトとコンポーネント確認
2. **データ取得の理解**: `references/data_fetching.md`でReact Queryフックとキャッシュ戦略確認
3. **実装時**: `references/flow_diagram.md`で各種操作のフロー確認
4. **デバッグ時**: `references/list_operations.md`でAPI仕様とエラーケース確認

## 実装上の注意点

### 必須パターン
- **useChildQuests フック**: フィルター、ソート、ページネーション付きでクエスト取得
- **React Query**: useQuery/useMutationでAPIアクセス
- **QuestListLayout**: 共通レイアウトコンポーネントを使用
- **URLクエリパラメータ**: フィルター条件をURLに反映
- **Logger**: すべてのAPI処理でlogger使用

### フィルター・ソート
- **フィルター**: クエスト名、タグ
- **ソート**: ID、クエスト名、カテゴリ、報酬額、期限
- **ページネーション**: 30件/ページ、最大ページ数計算

### ステータス遷移
- **not_started → in_progress**: クエスト開始
- **in_progress → pending_review**: 完了報告
- **pending_review → completed**: 承認（親側の操作）
- **pending_review → in_progress**: 却下（親側の操作）

### 権限管理
- **子供ユーザー**: 自分のクエストのみ表示・閲覧、完了報告可能
- **親ユーザー**: この画面へのアクセス不可
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
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


