---
name: timeline-structure
description: タイムライン画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。 Trigger Keywords: timeline screen, timeline UI, activity feed, timeline display
---

# タイムライン画面 スキル

## 概要

タイムライン画面は、家族内のアクティビティや公開クエストの活動を時系列で表示する画面。家族タブと公開タブ（親ユーザーのみ）で切り替え可能。

## メインソースファイル

### メインファイル
- `app/(app)/timeline/page.tsx`: エントリーポイント（認証チェック）
- `app/(app)/timeline/TimelinesScreen.tsx`: タイムライン画面実装

### コンポーネント
- `app/(app)/timeline/_components/TimelineItem.tsx`: 家族タイムラインアイテム
- `app/(app)/timeline/_components/PublicTimelineItem.tsx`: 公開タイムラインアイテム

### フック
- `app/(app)/timeline/_hooks/useFamilyTimelines.ts`: 家族タイムライン取得
- `app/(app)/timeline/_hooks/usePublicTimelines.ts`: 公開タイムライン取得

### ユーティリティ
- `app/(app)/timeline/_utils/timeUtils.ts`: 相対時間変換

## 主要機能グループ

### 1. タイムライン表示
- 家族タイムライン: 家族内アクティビティの時系列表示
- 公開タイムライン: 公開クエストの活動表示（親のみ）

### 2. タブ切り替え
- ScrollableTabsによるタブUI
- 権限ベースのタブ制御（子供は家族タブのみ）

### 3. アイテム表示
- Avatarとメッセージのカード表示
- 相対時間表示（"2分前"など）
- URLがある場合はクリック可能

## Reference Files Usage

### コンポーネント構造を理解する場合
ページ階層、タブ構造、アイテムレイアウトを確認：
```
references/component_structure.md
```

### データフローを把握する場合
API呼び出し、タブ切り替え、キャッシュ管理を確認：
```
references/flow_diagram.md
```

## クイックスタート

1. **全体構造の把握**: `references/component_structure.md` でコンポーネント階層確認
2. **データフロー理解**: `references/flow_diagram.md` でAPI呼び出しフロー確認
3. **実装時**: TimelinesScreen → TimelineItem の階層で実装
4. **権限制御**: isChild フラグでタブ表示制御

## 実装上の注意点

### 必須パターン
- **React Query**: useFamilyTimelines, usePublicTimelines でデータ取得
- **キャッシュ**: staleTime 5分でキャッシング
- **権限制御**: isChild フラグで公開タブの表示/非表示
- **相対時間**: getRelativeTime() で時刻を分かりやすく表示

### タブ制御
- **子供ユーザー**: 家族タブのみ表示
- **親ユーザー**: 家族タブ + 公開タブ表示
- **デフォルト**: 家族タブを初期選択

### インタラクション
- **カードクリック**: URL存在時のみルーティング
- **カーソル**: URL有り→"pointer", URL無し→"default"
- **ローディング**: Loader 表示でUX向上
- **空状態**: "タイムラインがありません" メッセージ
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


