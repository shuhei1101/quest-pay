---
name: quest-edit-layout-usage
description: クエスト編集レイアウト使用方法を提供するスキル。Props定義、使用例を含む。 Trigger Keywords: クエスト編集レイアウト使用方法、編集レイアウトの使い方、レイアウトProps
---

# クエスト編集レイアウト使用方法 スキル

## 概要

このスキルは、クエスト編集レイアウトコンポーネントの使用方法を提供します。タイトル表示、タブベース編集フォーム、FAB対応を含みます。

## メインソースファイル

### コンポーネント
- `packages/web/app/(app)/quests/_components/QuestEditLayout.tsx`: クエスト編集レイアウトコンポーネント

### 使用例
- `packages/web/app/(app)/quests/family/[id]/FamilyQuestEdit.tsx`: 家族クエスト編集での使用例

## 主要機能グループ

### 1. Props設定
- questId: 編集/新規作成モード判定
- isLoading: ローディング状態
- tabs: タブ設定配列
- editActions/createActions: アクションボタン
- fabEditActions/fabCreateActions: FABアクション

### 2. タブ設定
- value: タブ識別子
- label: タブラベル
- hasErrors: エラーフラグ
- content: タブコンテンツ

### 3. エラーハンドリング
- タブごとのエラーチェック
- エラーアイコン表示
- バリデーション結果の可視化

### 4. アクション定義
- 保存/更新/削除ボタン
- 公開/非公開ボタン
- カスタムアクション

## Reference Files Usage

### Props定義とコンポーネント構造を確認する場合
型定義、状態管理、レイアウト仕様を確認：
```
references/component_structure.md
```

### 実装例を確認する場合
家族/公開/テンプレート各クエストタイプの実装例を確認：
```
references/usage_examples.md
```

### 親コンポーネントとの統合方法を確認する場合
React Hook Form、カスタムフック、セッションストレージとの統合パターンを確認：
```
references/integration_guide.md
```

## クイックスタート

1. **Props理解**: `references/component_structure.md`でProps定義確認
2. **実装時**: `references/usage_examples.md`で使用例確認
3. **統合時**: `references/integration_guide.md`で統合パターン確認

## 実装上の注意点

### 必須設定
- **questId**: 編集/新規作成モード判定に必須
- **tabs配列**: 最低1つ以上のタブ設定が必要
- **hasErrors**: タブごとのエラーチェック必須
- **onSubmit**: フォーム送信ハンドラー必須

### タブ設定
- **value**: ユニークな識別子
- **label**: ユーザー向け表示名
- **hasErrors**: エラー集約フラグ
- **content**: ReactNodeとしてタブ内容を渡す

### アクション設定
- **editActions/createActions**: 空配列可（FABのみ使用可能）
- **fabEditActions/fabCreateActions**: オプショナル
- **popups**: モーダル/ダイアログ等をまとめて渡す

### 統合パターン
- **react-hook-form**: register/setValue/watch/errorsを渡す
- **カスタムフック**: useRegister/useUpdate/useDeleteを使用
- **セッションストレージ**: フォームデータの永続化に使用
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


