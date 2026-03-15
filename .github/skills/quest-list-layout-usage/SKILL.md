---
name: quest-list-layout-usage
description: クエスト一覧レイアウト使用方法を提供するスキル。Props定義、使用例を含む。
---

# クエスト一覧レイアウト使用方法 スキル

## 概要

このスキルは、クエスト一覧レイアウトコンポーネント群の使用方法を提供します。Props定義、実装パターン、React Queryとの統合、リスト状態管理の知識を含みます。

## メインソースファイル

### 使用例
- `packages/web/app/(app)/quests/family/_components/FamilyQuestList.tsx`: 家族クエスト一覧の実装例
- `packages/web/app/(app)/quests/public/PublicQuestList.tsx`: 公開クエスト一覧の実装例
- `packages/web/app/(app)/quests/template/_components/TemplateQuestList.tsx`: テンプレートクエスト一覧の実装例

### React Queryフック
- `packages/web/app/api/quests/family/query.ts`: React Queryフック定義
- `packages/web/app/api/quests/family/client.ts`: APIクライアント関数

## 主要機能グループ

### 1. Props統合
- 必須Props/オプションPropsの定義
- カスタムレンダリング関数の実装
- イベントハンドラの実装

### 2. React Query統合
- カスタムフックの構造
- QueryKey設計
- キャッシュ戦略

### 3. リスト状態管理
- フィルター/ソート状態の分離
- ページネーション管理
- クエリパラメータとの連動

### 4. ポップアップ統合
- フィルターポップアップの実装
- ソートポップアップの実装
- バッジカウント計算

## Reference Files Usage

### Props定義と使用例を確認する場合
必須/オプションProps、クエストタイプ別の実装パターンを確認：
```
references/component_structure.md
references/usage_examples.md
```

### React Query統合を理解する場合
カスタムフック構造、QueryKey設計、キャッシュ戦略、エラーハンドリングを確認：
```
references/integration_guide.md
```

### リスト状態管理を理解する場合
フィルター/ソート状態の分離理由、ページネーション、クエリパラメータ連動を確認：
```
references/integration_guide.md
```

## クイックスタート

1. **Props定義の確認**: `references/component_structure.md`で必須/オプションProps確認
2. **実装パターンの理解**: `references/usage_examples.md`でクエストタイプ別実装例確認
3. **React Query統合**: `references/integration_guide.md`でカスタムフック実装確認
4. **状態管理**: `references/integration_guide.md`でフィルター/ソート状態分離パターン確認

## 実装上の注意点

### 必須パターン
- **状態分離**: questFilter（編集用）とsearchFilter（検索用）を分ける
- **ページリセット**: 検索/カテゴリ変更時はpage=1に
- **バッジカウント**: useMemoで計算し、filterCount/sortCount propsに渡す
- **検索テキスト連動**: searchText propとonSearchTextChangeで双方向同期

### React Query
- **QueryKey**: すべての依存を含める（filter, sort, page, pageSize）
- **Stale Time**: データ更新頻度に応じて設定（マスターデータは長め）
- **エラーハンドリング**: retry, retryDelay, throwOnErrorを設定

### パフォーマンス最適化
- **メモ化**: useMemo/useCallbackでイベントハンドラと計算をメモ化
- **プリフェッチ**: 次ページをprefetchQueryで先読み
- **キャッシュ無効化**: ミューテーション成功時にinvalidateQueries

---

### バッジ表示機能

フィルターやソートが適用されている場合、検索バーのフィルターボタンとソートボタンにバッジが表示されます。

- `filterCount`: フィルターの適用数（検索テキスト、タグ、カテゴリの合計）
- `sortCount`: ソートの適用数（デフォルト以外のソートが適用されている場合は1）

バッジは`Indicator`コンポーネントを使用して表示され、カウントが0の場合は非表示になります。

### 無限スクロール

ページ最下層に到達すると、自動的に次のページを取得します。

### カテゴリタブ

クエストカテゴリごとにタブ表示され、タブ切り替えで絞り込みが可能です。

## 注意点

- データ表示のみ、API呼び出しは呼び出し側で実施
- レスポンシブデザイン対応済み
- フィルター・ソートのカウント計算は呼び出し側で実装すること
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
