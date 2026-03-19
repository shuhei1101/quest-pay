---
name: quest-view-structure
description: クエスト閲覧画面の構造知識を提供するスキル。共通コンポーネント、各クエストタイプの閲覧画面構造を含む。 Trigger Keywords: クエスト閲覧画面、クエスト詳細画面、クエスト表示UI
---

# クエスト閲覧画面 スキル

## 概要

このスキルは、クエスト閲覧画面（QuestView）の構造に関する知識を提供します。すべてのクエストタイプ（家族、公開、テンプレート、子供）の閲覧画面で共通使用される再利用可能なコンポーネント群と、各画面固有の構造を網羅します。

## メインソースファイル

### 共通コンポーネント
- `app/(app)/quests/view/_components/QuestViewHeader.tsx`: ヘッダー
- `app/(app)/quests/view/_components/QuestViewIcon.tsx`: アイコン
- `app/(app)/quests/view/_components/QuestConditionTab.tsx`: 条件タブ
- `app/(app)/quests/view/_components/QuestDetailTab.tsx`: 依頼情報タブ
- `app/(app)/quests/view/_components/QuestOtherTab.tsx`: その他タブ
- `app/(app)/quests/view/_components/ChildQuestViewFooter.tsx`: 子供用フッター

### 画面タイプ別
- `app/(app)/quests/family/[id]/view/`: 家族クエスト閲覧
- `app/(app)/quests/public/[id]/view/`: 公開クエスト閲覧
- `app/(app)/quests/template/[id]/`: テンプレートクエスト閲覧
- `app/(app)/quests/family/[id]/view/child/[childId]/`: 子供クエスト閲覧

## 主要機能グループ

### 1. 共通コンポーネント
- QuestViewHeader: クエスト名表示
- QuestViewIcon: アイコン表示
- QuestConditionTab: 条件タブ（レベル、報酬、経験値等）
- QuestDetailTab: 依頼情報タブ
- QuestOtherTab: その他タブ（タグ、推奨年齢等）
- ChildQuestViewFooter: 子供用フッター

### 2. 画面タイプ別構造
- 家族クエスト閲覧: レベル選択、編集・削除機能
- 公開クエスト閲覧: いいね・コメント機能
- テンプレートクエスト閲覧: 採用機能
- 子供クエスト閲覧: 完了報告・取消機能

### 3. 表示制御
- ステータス別表示（not_started, in_progress, pending_review, completed）
- 権限別表示（親、子供）
- レスポンシブ対応（モバイル、タブレット、PC）

## Reference Files Usage

### コンポーネント構造を把握する場合
共通コンポーネント一覧、画面タイプ別構造、レイアウトパターンを確認：
```
references/component_structure.md
```

### レンダリング・インタラクションフローを理解する場合
初期表示、レベル選択、タブ切り替え、完了報告・採用フローを確認：
```
references/flow_diagram.md
```

### データ表示パターンを把握する場合
タブ別表示内容、ヘッダー・アイコン表示、ステータス・権限別表示を確認：
```
references/display_patterns.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でコンポーネント階層確認
2. **表示パターンの理解**: `references/display_patterns.md`でタブ別表示確認
3. **実装時**: `references/flow_diagram.md`で処理フロー確認
4. **デバッグ時**: `references/flow_diagram.md`でインタラクションフロー確認

## 実装上の注意点

### 必須パターン
- **共通コンポーネント使用**: QuestView系コンポーネントを再利用
- **タブ構成**: 条件・依頼情報・その他の3タブ構成を維持
- **レスポンシブ対応**: モバイルファーストで実装
- **Logger**: すべての画面でlogger使用
- **SubMenuFAB統合**: アクションボタン、レベル選択はSubMenuFABに統合

### 権限管理
- **親のみ**: 編集、削除（家族クエスト）
- **子供のみ**: 完了報告、報告取消（子供クエスト）
- **全ユーザー**: いいね、コメント（公開クエスト）、採用（テンプレートクエスト）

### ステータス制御
- **not_started/in_progress**: 完了報告ボタン有効
- **pending_review**: 報告取消ボタン表示
- **completed**: ボタン無効化

### レイアウト設計パターン
- **Screen**: データ取得、状態管理、イベントハンドラー、SubMenuFAB管理
- **Layout**: データ表示のみ、共通コンポーネント組み合わせ
- **レベル選択**: SubMenuFABに統合、Paperベースのメニューで提供
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


