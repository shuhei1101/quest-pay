---
name: quest-list-layout-structure
description: クエスト一覧レイアウト構造の知識を提供するスキル。ファイル構成、コンポーネントを含む。
---

# クエスト一覧レイアウト構造 スキル

## 概要

クエスト一覧レイアウトは、クエスト一覧表示の共通レイアウトコンポーネント。

## ファイル構成

### 関連コンポーネント
- `app/(app)/quests/_components/QuestListLayout.tsx`: クエスト一覧レイアウト
- `app/(app)/quests/_components/QuestSearchBar.tsx`: クエスト検索バー
- `app/(app)/quests/_components/QuestCategoryTabs.tsx`: カテゴリタブ
- `app/(app)/quests/_components/QuestGrid.tsx`: クエストグリッド表示
- `app/(app)/quests/_components/QuestCardLayout.tsx`: クエストカードレイアウト

## 主要コンポーネント

### QuestListLayout
**責務:** クエスト一覧のレイアウト管理

**主要機能:**
- カテゴリタブ表示
- 検索バー（フィルター・ソートボタン付き）
- 無限スクロール対応
- ページネーション
- レスポンシブ対応

**Props:**
- クエスト一覧データ
- ページング情報（現在ページ、最大ページ、総レコード数）
- ローディング状態
- イベントハンドラ（ページ変更、検索、フィルター、ソート、カテゴリ変更）
- レンダリング関数（クエストカード描画）
- カテゴリ情報
- ポップアップコンポーネント（フィルター、ソート）
- **バッジ表示用カウント（filterCount, sortCount）**

### QuestSearchBar
**責務:** 検索バーとフィルター・ソートボタンの表示

**主要機能:**
- クエスト名検索
- フィルターボタン（**バッジ表示対応**）
- ソートボタン（**バッジ表示対応**）
- Enterキー対応
- IME入力対応
- **制御コンポーネント対応（`value`プロパティで検索テキストを制御）**

**Props:**
- 検索実行ハンドラ
- フィルター・ソートボタンクリックハンドラ
- **検索テキスト変更ハンドラ（`onSearchTextChange`）**
- プレースホルダー
- **検索テキスト値（`value`）- 制御コンポーネントとして使用**
- **filterCount: フィルター適用数（バッジ表示用）**
- **sortCount: ソート適用数（バッジ表示用）**

### バッジ表示機能

フィルターやソートが適用されている場合、検索バーのボタンにバッジが表示されます。

- `Indicator`コンポーネントを使用してバッジを表示
- カウントが0の場合は非表示
- フィルターカウント: 検索テキスト、タグ、カテゴリの合計数
- ソートカウント: デフォルト以外のソートが適用されている場合は1

### 検索テキストとフィルターの連動機能

検索バーで入力したクエスト名とフィルターポップアップのクエスト名は完全に連動しています。

**動作フロー:**
1. 検索バーで入力 → `onSearchTextChange`でリアルタイムに`questFilter.name`を更新
2. フィルターポップアップを開く → `currentFilter`（= `questFilter`）から現在の検索テキストを取得
3. フィルターポップアップで変更 → 検索ボタンで`questFilter`を更新 → 検索バーの`value`も自動更新

**実装詳細:**
- `QuestSearchBar`は制御コンポーネント（`value`プロパティで値を外部から制御）
- 未制御モード（`value`未指定時）では内部状態を使用してフォールバック
- リアルタイムで親に変更を通知（`onSearchTextChange`）

## 使用箇所

- `app/(app)/quests/family/_components/FamilyQuestList.tsx`: 家族クエスト一覧
- `app/(app)/quests/public/PublicQuestList.tsx`: 公開クエスト一覧
- `app/(app)/quests/template/_components/TemplateQuestList.tsx`: テンプレートクエスト一覧

## 注意点

- 家族クエスト、公開クエスト、テンプレートクエストで共通使用
- データは受け取るが、API呼び出しはしない
- フィルター・ソートのカウント計算は呼び出し側で実装すること

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
