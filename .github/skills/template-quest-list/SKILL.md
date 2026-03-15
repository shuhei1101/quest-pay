---
name: template-quest-list
description: テンプレートクエスト一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、処理フローを含む。
---

# テンプレートクエスト一覧 スキル

## 概要

このスキルは、システムが提供するクエストテンプレートを閲覧し、家族クエストとして採用できる画面の知識を提供します。

## メインソースファイル

### 画面コンポーネント
- `packages/web/app/(app)/quests/template/page.tsx`: リダイレクト専用（サーバーコンポーネント）
- `packages/web/app/(app)/quests/template/TemplateQuestsScreen.tsx`: 一覧画面のメイン実装

### 関連コンポーネント
- `packages/web/app/(app)/quests/template/_components/TemplateQuestList.tsx`: テンプレートクエスト一覧表示
- `packages/web/app/(app)/quests/template/_components/TemplateQuestCard.tsx`: クエストカード

### フック
- `packages/web/app/(app)/quests/template/_hooks/useTemplateQuests.ts`: テンプレートクエストデータ取得フック
- `packages/web/app/(app)/quests/template/_hooks/useAdoptTemplateQuest.ts`: 採用処理フック

### API
- `packages/web/app/api/quests/template/route.ts`: テンプレートクエスト一覧取得
- `packages/web/app/api/quests/template/[id]/route.ts`: テンプレート詳細取得
- `packages/web/app/api/quests/family/adopt/route.ts`: テンプレート採用
- `packages/web/app/api/quests/template/client.ts`: APIクライアント

## 主要機能グループ

### 1. 一覧表示
- テンプレートクエストの表示
- カテゴリフィルタリング
- 難易度・推奨年齢の表示

### 2. テンプレート採用
- 家族クエストとして採用
- カスタマイズ機能（将来実装）
- 採用後の編集画面遷移

### 3. 詳細表示
- テンプレート詳細モーダル
- やり方のヒント表示
- 推奨事項の表示

## Reference Files Usage

### コンポーネント構造を把握する場合
画面レイアウト、カードデザイン、採用ボタンの配置を確認：
```
references/component_structure.md
```

### データ取得パターンを理解する場合
React Query フック、キャッシュ戦略、採用処理を確認：
```
references/data_fetching.md
```

### 処理フローを把握する場合
フィルタリング、採用、詳細表示のフローを確認：
```
references/flow_diagram.md
```

### リスト操作を詳細に確認する場合
API仕様、フィルタ、採用処理、プリフェッチを確認：
```
references/list_operations.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でフロー確認
2. **UI構造の理解**: `references/component_structure.md`でレイアウト確認
3. **実装時**: `references/data_fetching.md`でデータ取得パターン確認
4. **詳細仕様**: `references/list_operations.md`で操作詳細確認

## 実装上の注意点

### 必須パターン
- **React Query**: useQuery/useMutationでAPIアクセス
- **長時間キャッシュ**: 1時間（テンプレートは頻繁に変更されない）
- **プリフェッチ**: カテゴリタブホバー時にプリフェッチ
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- **閲覧**: 認証ユーザー全員
- **採用**: 親のみ（子供は閲覧のみ）

### キャッシュ戦略
- StaleTime: 1時間
- refetchOnWindowFocus: false
- テンプレートは静的なのでアグレッシブにキャッシュ

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
