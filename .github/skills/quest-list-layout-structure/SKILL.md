---
name: quest-list-layout-structure
description: クエスト一覧レイアウト構造の知識を提供するスキル。ファイル構成、コンポーネントを含む。
---

# クエスト一覧レイアウト構造 スキル

## 概要

このスキルは、クエスト一覧表示の共通レイアウトコンポーネント群の構造知識を提供します。カテゴリタブ、検索バー、無限スクロール、フィルター/ソート機能を統合した再利用可能なレイアウトシステムです。

## メインソースファイル

### レイアウトコンポーネント
- `packages/web/app/(app)/quests/_components/QuestListLayout.tsx`: メインレイアウト
- `packages/web/app/(app)/quests/_components/QuestSearchBar.tsx`: 検索バー
- `packages/web/app/(app)/quests/_components/QuestCategoryTabs.tsx`: カテゴリタブ
- `packages/web/app/(app)/quests/_components/QuestGrid.tsx`: グリッド表示

### 使用箇所
- `packages/web/app/(app)/quests/family/_components/FamilyQuestList.tsx`: 家族クエスト一覧
- `packages/web/app/(app)/quests/public/PublicQuestList.tsx`: 公開クエスト一覧
- `packages/web/app/(app)/quests/template/_components/TemplateQuestList.tsx`: テンプレートクエスト一覧

## 主要機能グループ

### 1. レイアウト統合
- カテゴリタブ、検索バー、クエストグリッドの統合
- 無限スクロール制御
- ページネーション管理

### 2. フィルタリング・ソート
- 検索テキストとフィルターの双方向同期
- バッジ表示による適用状態の可視化
- カテゴリタブ切替

### 3. レンダリング制御
- カスタムレンダリング関数対応
- ポップアップコンポーネントの統合管理

## Reference Files Usage

### コンポーネント構造を把握する場合
コンポーネント階層、Props定義、内部実装を確認：
```
references/component_structure.md
```

### 使用例を確認する場合
クエストタイプ別の実装パターン、カスタムレンダリング例を確認：
```
references/usage_examples.md
```

### データフローを理解する場合
無限スクロール、フィルタリング、ページネーションのフローを確認：
```
references/flow_diagram.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でコンポーネント階層確認
2. **データフローの理解**: `references/flow_diagram.md`で無限スクロール/フィルタリングフロー確認
3. **実装時**: `references/usage_examples.md`で実装パターン確認

## 実装上の注意点

### 必須パターン
- **カスタムレンダリング関数**: renderQuestCardで各クエストタイプに応じたカード描画
- **検索テキスト連動**: searchText propとonSearchTextChangeで双方向同期
- **バッジカウント**: filterCount/sortCountをuseMemoで計算
- **ページリセット**: 検索/カテゴリ変更時はpage=1に

### レスポンシブ対応
- **グリッドレイアウト**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **ローディング高さ**: `calc(100vh - 200px)`

### パフォーマンス最適化
- **メモ化**: memo, useMemo, useCallbackで再レンダリング抑制
- **無限スクロール**: Intersection Observer APIで段階的データ取得

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
