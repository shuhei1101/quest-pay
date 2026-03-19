---
name: public-quest-list
description: 公開クエスト一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、処理フローを含む。 Trigger Keywords: public quest list, community quests, public quest screen
---

# 公開クエスト一覧 スキル

## 概要

このスキルは、世界中のユーザーが公開したクエストを閲覧できる画面の知識を提供します。検索、フィルタ、いいね、コメント機能を含みます。

## メインソースファイル

### 画面コンポーネント
- `packages/web/app/(app)/quests/public/page.tsx`: リダイレクト専用（サーバーコンポーネント）
- `packages/web/app/(app)/quests/public/PublicQuestsScreen.tsx`: 一覧画面のメイン実装

### 関連コンポーネント
- `packages/web/app/(app)/quests/public/_components/PublicQuestList.tsx`: 公開クエスト一覧表示コンポーネント
- `packages/web/app/(app)/quests/public/_components/PublicQuestCard.tsx`: クエストカード
- `packages/web/app/(app)/quests/public/_components/PublicQuestFilter.tsx`: フィルタコンポーネント

### フック
- `packages/web/app/(app)/quests/public/_hooks/usePublicQuests.ts`: 公開クエストデータ取得フック
- `packages/web/app/(app)/quests/public/_hooks/useLikePublicQuest.ts`: いいね処理フック

### API
- `packages/web/app/api/quests/public/route.ts`: 公開クエスト一覧取得
- `packages/web/app/api/quests/public/[id]/like/route.ts`: いいね/取り消し
- `packages/web/app/api/quests/public/[id]/comments/route.ts`: コメント取得/投稿
- `packages/web/app/api/quests/public/client.ts`: APIクライアント

## 主要機能グループ

### 1. 一覧表示
- 公開クエストの検索・表示
- カテゴリフィルタリング
- ソート（人気順、新着順、コメント数順）
- ページネーション/無限スクロール

### 2. いいね機能
- 公開クエストへのいいね
- いいね取り消し
- いいね数の表示
- 楽観的UI更新

### 3. コメント機能
- コメント一覧表示
- コメント投稿
- コメント数の表示

### 4. 検索機能
- キーワード検索（タイトル・説明文）
- デバウンス処理

## Reference Files Usage

### コンポーネント構造を把握する場合
画面レイアウト、カードデザイン、グリッドレイアウトを確認：
```
references/component_structure.md
```

### データ取得パターンを理解する場合
React Query フック、キャッシュ戦略、楽観的更新を確認：
```
references/data_fetching.md
```

### 処理フローを把握する場合
検索、フィルタ、いいね、コメントのフローを確認：
```
references/flow_diagram.md
```

### リスト操作を詳細に確認する場合
API仕様、検索、フィルタ、ソート、ページネーション、いいね処理を確認：
```
references/list_operations.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でフロー確認
2. **UI構造の理解**: `references/component_structure.md`でカードレイアウト確認
3. **実装時**: `references/data_fetching.md`でデータ取得パターン確認
4. **詳細仕様**: `references/list_operations.md`で操作詳細確認

## 実装上の注意点

### 必須パターン
- **React Query**: useQuery/useMutationでAPIアクセス
- **無限スクロール**: useInfiniteQueryで実装（モバイル）
- **楽観的更新**: いいね時の即座UI反映
- **デバウンス**: 検索入力の500ms遅延
- **Logger**: すべてのAPI処理でlogger使用

### 認証関連
- **一覧閲覧**: 認証不要
- **いいね・コメント**: 認証必須（未認証時はログインモーダル表示）
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


