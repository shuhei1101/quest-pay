---
name: quest-edit-layout-structure
description: クエスト編集レイアウト構造の知識を提供するスキル。ファイル構成、コンポーネントを含む。 Trigger Keywords: quest edit layout, edit layout structure, quest form layout
---

# クエスト編集レイアウト構造 スキル

## 概要

このスキルは、クエスト編集フォームの共通レイアウトコンポーネントの構造知識を提供します。タブベースのUIを提供し、基本設定・詳細設定・子供設定などの複数セクションを管理します。

## メインソースファイル

### コンポーネント
- `packages/web/app/(app)/quests/_components/QuestEditLayout.tsx`: クエスト編集レイアウトコンポーネント

## 主要機能グループ

### 1. レイアウト構造
- PageHeader: タイトル表示（編集/新規作成自動切り替え）
- ScrollableTabs: タブベースのフォームレイアウト
- LoadingOverlay: ローディング表示
- SubMenuFAB: フローティングアクションボタン

### 2. タブ管理
- タブヘッダーのスティッキー表示（上部固定）
- 横スクロール対応
- スワイプでのタブ切り替え（delta: 50px、duration: 500ms）
- バリデーションエラーアイコン表示

### 3. アクション管理
- 編集モード/新規作成モードの自動切り替え
- アクションボタン（デスクトップ向け）
- FABアクション（モバイル向け）

### 4. フォーム統合
- react-hook-formとの統合
- バリデーションエラー表示
- フォーム送信処理

## Reference Files Usage

### コンポーネント構造を把握する場合
コンポーネント階層、Props定義、状態管理を確認：
```
references/component_structure.md
```

### 使用例を確認する場合
家族/公開/テンプレート各クエストタイプの実装例を確認：
```
references/usage_examples.md
```

### 処理フローを理解する場合
初期化→フォームバインディング→バリデーション→送信フローを確認：
```
references/flow_diagram.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でコンポーネント階層確認
2. **実装時**: `references/usage_examples.md`で使用例確認
3. **フロー理解**: `references/flow_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン
- **TabConfig配列**: タブ設定を配列で渡す
- **hasErrors**: タブごとのエラーチェックフラグ
- **questId**: 編集/新規作成モード判定に使用
- **ScrollableTabs**: タブ固定化とスワイプ対応

### レイアウト仕様
- **Paper**: height: `var(--content-height)`
- **Tabs.Panel**: 詳細設定タブは`overflowY: hidden`、その他は`auto`
- **スワイプ**: delta 50px、duration 500ms

### 使用コンポーネント
- `PageHeader`: タイトル表示
- `ScrollableTabs`: タブ固定化
- `SubMenuFAB`: フローティングアクションボタン
- `LoadingOverlay`: ローディング表示
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


