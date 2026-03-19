---
name: template-quest-view
description: テンプレートクエスト閲覧画面の構造知識を提供するスキル。表示内容、採用機能を含む。 Trigger Keywords: テンプレートクエスト閲覧、テンプレート閲覧、テンプレート詳細、テンプレート採用
---

# テンプレートクエスト閲覧 スキル

## 概要

このスキルは、テンプレートクエスト閲覧画面の構造知識を提供します。テンプレートクエストの詳細を表示し、家族クエストとして採用する機能を管理します。

## メインソースファイル

### 画面ファイル
- `app/(app)/quests/template/[id]/page.tsx`: ページエントリーポイント
- `app/(app)/quests/template/[id]/TemplateQuestViewScreen.tsx`: メイン画面コンポーネント

### コンポーネント
- `app/(app)/quests/template/_components/TemplateQuestDetail.tsx`: テンプレート詳細表示
- `app/(app)/quests/template/_components/AdoptButton.tsx`: 採用ボタン

### フック
- `app/(app)/quests/template/_hooks/useTemplateQuest.ts`: テンプレートクエストデータ取得

### 共通コンポーネント（quest-view-structure）
- `app/(app)/quests/view/_components/QuestViewHeader.tsx`
- `app/(app)/quests/view/_components/QuestConditionTab.tsx`
- `app/(app)/quests/view/_components/QuestDetailTab.tsx`
- `app/(app)/quests/view/_components/QuestOtherTab.tsx`

## 主要機能グループ

### 1. 閲覧機能
- テンプレート詳細情報表示
- タブ切り替え（条件・依頼情報・その他）
- プレビュー機能

### 2. 採用機能
- テンプレートを基に家族クエスト作成
- 採用確認モーダル表示
- 家族クエスト編集画面へリダイレクト

### 3. データ表示
- レベル、カテゴリ、達成条件、報酬、経験値
- 依頼主、依頼内容
- タグ、推奨年齢・月齢

## Reference Files Usage

### コンポーネント構造を把握する場合
ファイル構成、コンポーネント階層、共通コンポーネント使用を確認：
```
references/component_structure.md
```

### レンダリング・インタラクションフローを理解する場合
初期表示、タブ切り替え、採用フロー、エラーハンドリングを確認：
```
references/flow_diagram.md
```

### データ表示パターンを把握する場合
タブ別表示内容、採用ボタン表示、ローディング・エラー状態を確認：
```
references/display_patterns.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でコンポーネント階層確認
2. **表示パターンの理解**: `references/display_patterns.md`でタブ別表示確認
3. **実装時**: `references/flow_diagram.md`で採用フロー確認
4. **デバッグ時**: `references/flow_diagram.md`でデータ変換フロー確認

## 実装上の注意点

### 必須パターン
- **共通コンポーネント使用**: quest-view-structure の共通コンポーネントを再利用
- **採用確認モーダル**: 採用前に必ず確認モーダル表示
- **データ変換**: テンプレートデータを家族クエストデータに正確に変換
- **Logger**: すべての画面でlogger使用

### 編集制限
- **テンプレートは編集不可**: 読み取り専用
- **編集・削除ボタンなし**: 表示のみ
- **採用後は家族クエスト**: 採用後は通常の家族クエストとして編集可能

### 権限管理
- **全ユーザー閲覧可能**: 権限チェック不要
- **採用は親のみ**: 家族クエスト作成権限が必要
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


