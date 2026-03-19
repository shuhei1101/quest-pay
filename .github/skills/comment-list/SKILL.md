---
name: comment-list
description: コメント一覧表示の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、処理フローを含む。 Trigger Keywords: comment list, comment section, display comments, comment thread
---

# コメント一覧 スキル

## 概要

このスキルは、公開クエストに投稿されたコメントの一覧を表示し、評価（高評価・低評価）、ピン留め、公開者いいね、不適切コメント報告機能を提供する画面の知識を提供します。

## メインソースファイル

### ページファイル
- `app/(app)/quests/public/[id]/comments/page.tsx`: コメントページ
- `app/(app)/quests/public/[id]/comments/CommentsScreen.tsx`: メイン画面

### コンポーネント
- `app/(app)/quests/public/_components/CommentList.tsx`: コメント一覧
- `app/(app)/quests/public/_components/CommentItem.tsx`: コメントアイテム
- `app/(app)/quests/public/_components/CommentActions.tsx`: コメントアクション

### フック
- `app/(app)/quests/public/_hooks/useComments.ts`: コメントデータ取得フック

### API
- `app/api/quests/public/[publicQuestId]/comments/client.ts`: APIクライアント関数
- `app/api/quests/public/[publicQuestId]/comments/route.ts`: コメント一覧取得、投稿
- `app/api/quests/public/[publicQuestId]/comments/[commentId]/route.ts`: 削除
- `app/api/quests/public/[publicQuestId]/comments/[commentId]/like/route.ts`: 評価
- `app/api/quests/public/[publicQuestId]/comments/[commentId]/pin/route.ts`: ピン留め
- `app/api/quests/public/[publicQuestId]/comments/[commentId]/creator-like/route.ts`: 公開者いいね
- `app/api/quests/public/[publicQuestId]/comments/[commentId]/report/route.ts`: 報告

### データベース
- `drizzle/schema.ts`: comments, comment_likes, comment_reports テーブル

## 主要機能グループ

### 1. コメント表示
- ピン留めコメントの優先表示
- 通常コメントの投稿日時順表示
- 自分のコメントと他人のコメントの区別

### 2. 評価機能
- 高評価（いいね）
- 低評価（よくないね）
- 評価取り消し
- 楽観的更新によるUI即時反映

### 3. ピン留め機能
- 公開者によるコメントのピン留め
- ピン留め解除
- ピン留めコメントの最上部表示

### 4. 公開者いいね機能
- 公開者による特別ないいね
- 公開者いいねバッジ表示

### 5. 報告機能
- 不適切コメントの報告
- 報告理由の選択
- 管理者によるモデレーション

## Reference Files Usage

### コンポーネント構造を確認する場合
画面レイアウト、コメントアイテム、アクションボタン、ピン留め表示を確認：
```
references/component_structure.md
```

### データ取得方法を確認する場合
React Queryフック、APIクライアント、キャッシュ戦略、楽観的更新を確認：
```
references/data_fetching.md
```

### 処理フローを理解する場合
初期表示、投稿、評価、ピン留め、報告、削除のフローを確認：
```
references/flow_diagram.md
```

### リスト操作を確認する場合
CRUD操作、評価操作、ピン留め操作、報告操作、ナビゲーションパターンを確認：
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
- **useComments フック**: 公開クエストIDに紐づくコメント取得
- **React Query**: useQuery/useMutationでAPIアクセス
- **楽観的更新**: 評価操作で即座にUIを反映
- **表示制御**: 自分のコメントには評価・報告ボタンを表示しない
- **Logger**: すべてのAPI処理でlogger使用

### 評価機能
- **高評価**: POST /api/quests/public/[publicQuestId]/comments/[commentId]/like
- **低評価**: POST /api/quests/public/[publicQuestId]/comments/[commentId]/dislike
- **評価取り消し**: DELETE /api/quests/public/[publicQuestId]/comments/[commentId]/like
- **楽観的更新**: 評価時に即座にUIを更新、エラー時にロールバック

### ピン留め機能
- **ピン留め**: POST /api/quests/public/[publicQuestId]/comments/[commentId]/pin
- **ピン留め解除**: DELETE /api/quests/public/[publicQuestId]/comments/[commentId]/pin
- **権限**: 公開クエストの作成者（公開者）のみ

### 権限管理
- **すべてのユーザー**: コメント閲覧
- **認証済みユーザー**: 投稿、他人のコメントへの評価、報告、自分のコメントの削除
- **公開クエスト作成者**: ピン留め、公開者いいね
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


