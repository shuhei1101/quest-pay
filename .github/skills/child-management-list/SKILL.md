---
name: child-management-list
description: 子供一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。
---

# 子供管理一覧 スキル

## 概要

このスキルは、家族内の子供アカウント一覧を表示し、子供の作成・編集・削除を管理する画面の知識を提供します。

## メインソースファイル

### ページファイル
- `app/(app)/children/page.tsx`: 子供一覧ルートページ
- `app/(app)/children/[id]/page.tsx`: 子供詳細ページ

### コンポーネント
- `app/(app)/children/_components/ChildCardLayout.tsx`: 子供カードレイアウト

### フック
- `app/(app)/children/_hook/useChildren.ts`: 子供データ取得フック

### API
- `app/api/children/client.ts`: APIクライアント関数
- `app/api/children/route.ts`: 一覧取得、新規作成
- `app/api/children/[id]/route.ts`: 詳細取得、更新、削除

### データベース
- `drizzle/schema.ts`: children テーブル

## 主要機能グループ

### 1. 基本CRUD
- 子供一覧取得、新規作成、詳細表示、更新、削除

### 2. クエスト統計表示
- 子供ごとのクエスト進行状況（進行中、完了など）
- 総クエスト数、完了数の表示

### 3. 子供詳細管理
- 子供情報の詳細表示
- 報酬履歴表示
- アバター管理

## Reference Files Usage

### コンポーネント構造を確認する場合
子供カードレイアウト、リスト構造、フィルター機能を確認：
```
references/component_structure.md
```

### データ取得方法を確認する場合
React Queryフック、APIクライアント、キャッシュ戦略を確認：
```
references/data_fetching.md
```

### 処理フローを理解する場合
初期表示、作成、編集、削除のフローを確認：
```
references/flow_diagram.md
```

### CRUD操作を確認する場合
各種操作のAPIエンドポイント、リクエスト/レスポンス、ナビゲーションパターンを確認：
```
references/list_operations.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でレイアウト確認
2. **データ取得の理解**: `references/data_fetching.md`でReact Queryフック確認
3. **実装時**: `references/flow_diagram.md`で処理フロー確認
4. **デバッグ時**: `references/list_operations.md`でCRUD操作確認

## 実装上の注意点

### 必須パターン
- **useChildren フック**: 子供データとクエスト統計を取得
- **React Query**: useQuery/useMutationでAPIアクセス
- **権限管理**: 親ユーザーのみがアクセス可能
- **Logger**: すべてのAPI処理でlogger使用

### CRUD操作
- **作成**: POST /api/children
- **読み取り**: GET /api/children
- **更新**: PUT /api/children/[id]
- **削除**: DELETE /api/children/[id] (進行中クエストがある場合は削除不可)

### 権限管理
- **親ユーザー**: すべての操作が可能
- **子供ユーザー**: この画面へのアクセス不可

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


