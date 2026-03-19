---
name: notification-list
description: 通知一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。 Trigger Keywords: notification list, notifications screen, notification UI
---

# 通知一覧 スキル

## 概要

このスキルは、ユーザーに対する通知を一覧表示し、既読管理を行う画面の知識を提供します。

## メインソースファイル

### 画面コンポーネント
- `packages/web/app/(app)/notifications/page.tsx`: 通知一覧ページ
- `packages/web/app/(app)/notifications/NotificationsScreen.tsx`: 画面メイン実装

### 関連コンポーネント
- `packages/web/app/(app)/notifications/_components/NotificationList.tsx`: 通知リスト表示
- `packages/web/app/(app)/notifications/_components/NotificationItem.tsx`: 個別通知アイテム

### フック
- `packages/web/app/(app)/notifications/_hooks/useNotifications.ts`: 通知データ取得
- `packages/web/app/(app)/notifications/_hooks/useMarkAsRead.ts`: 既読マーク処理

### API
- `packages/web/app/api/notifications/route.ts`: 通知一覧取得、作成
- `packages/web/app/api/notifications/[id]/read/route.ts`: 既読マーク
- `packages/web/app/api/notifications/read-all/route.ts`: 全件既読

## 主要機能グループ

### 1. 一覧表示
- 通知の一覧取得と表示
- フィルタリング（全て/未読/既読）
- ページネーション/無限スクロール

### 2. 既読管理
- 個別既読マーク
- 全件既読マーク
- 未読数バッジ更新

### 3. 遷移機能
- 通知タイプに応じた画面遷移
- 遷移前の既読マーク実行

## Reference Files Usage

### コンポーネント構造を把握する場合
画面レイアウト、コンポーネント階層、使用UIライブラリを確認：
```
references/component_structure.md
```

### データ取得パターンを理解する場合
React Query フック、キャッシュ戦略、APIクライアントを確認：
```
references/data_fetching.md
```

### 処理フローを把握する場合
初期表示、フィルタリング、既読マークのフローを確認：
```
references/flow_diagram.md
```

### リスト操作を詳細に確認する場合
API仕様、フィルタ、ソート、ページネーション、一括操作を確認：
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
- **楽観的更新**: 既読マーク時の即座UI反映
- **定期更新**: 5分間隔での自動リフレッシュ
- **Logger**: すべてのAPI処理でlogger使用

### リアルタイム性
- 定期的なポーリング（5分間隔）
- 将来的にSupabase Realtimeで即座反映

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


