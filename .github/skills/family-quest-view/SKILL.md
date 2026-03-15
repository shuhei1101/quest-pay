---
name: family-quest-view
description: 家族クエスト閲覧画面の構造知識を提供するスキル。ファイル構成、表示内容、子供向け機能を含む。
---

# 家族クエスト閲覧 スキル

## 概要

このスキルは、家族クエストの閲覧画面の知識を提供します。親ビューと子供ビューの両方をサポートし、レベル選択、FAB操作、アクションボタンを含みます。

## メインソースファイル

### 画面コンポーネント
- `app/(app)/quests/family/[id]/view/page.tsx`: ルートページ（リダイレクト）
- `app/(app)/quests/family/[id]/view/FamilyQuestViewScreen.tsx`: 親用閲覧画面（ビジネスロジック + FAB）
- `app/(app)/quests/family/[id]/view/_components/FamilyQuestViewLayout.tsx`: レイアウト（プレゼンテーション）
- `app/(app)/quests/family/[id]/view/child/[childId]/page.tsx`: 子供専用ルート
- `app/(app)/quests/family/[id]/view/child/[childId]/ChildQuestViewScreen.tsx`: 子供専用画面

### フック
- `app/(app)/quests/family/[id]/view/_hooks/useFamilyQuest.ts`: クエスト詳細取得

### API Routes
- `app/api/quests/family/[id]/route.ts`: GET（詳細取得）
- `app/api/quests/family/[id]/child/[childId]/route.ts`: 子供クエスト操作
- `app/api/quests/family/[id]/review-request/route.ts`: 完了報告
- `app/api/quests/family/[id]/cancel-review/route.ts`: 報告キャンセル

## 主要機能グループ

### 1. 親ビュー
- クエスト詳細の3タブ表示（条件/依頼情報/その他）
- レベル選択機能（複数レベルがある場合）
- FABメニュー（編集、削除、公開、戻る）

### 2. 子供ビュー
- クエスト詳細の表示
- 受注・完了報告・報告キャンセルボタン
- ステータス別のアクション表示

### 3. レベル選択
- レベル選択ポップアップメニュー
- 選択レベルに応じた詳細表示の切り替え

## Reference Files Usage

### コンポーネント構造を把握する場合
画面構成、コンポーネント階層、ファイル配置を確認：
```
references/component_structure.md
```

### データ表示パターンを理解する場合
フック、データソース、表示形式、デフォルト値を確認：
```
references/data_display.md
```

### 画面フローを把握する場合
表示フロー、レベル選択、FAB操作、条件付きレンダリングを確認：
```
references/flow_diagram.md
```

### アクション実装を確認する場合
FABメニュー、モーダル、ボタン、通知の実装を確認：
```
references/action_components.md
```

## クイックスタート

1. **全体像の把握**: `references/component_structure.md`でコンポーネント構成確認
2. **データ構造の理解**: `references/data_display.md`で表示データ確認
3. **実装時**: `references/flow_diagram.md`で画面フロー確認
4. **アクション実装時**: `references/action_components.md`で具体的な実装確認

## 実装上の注意点

### 必須パターン
- **Screen + Layout**: ビジネスロジックとプレゼンテーションの分離
- **useFamilyQuest**: クエストデータ取得は専用フック使用
- **FABContext**: FAB開閉状態はコンテキストで管理
- **条件付きレンダリング**: レベル選択ボタンは複数レベル時のみ表示

### 権限管理
- **親のみ**: 編集、削除、公開アクション
- **子供のみ**: 受注、完了報告、報告キャンセル
- **両方**: クエスト詳細の閲覧

### レスポンシブ対応
- FAB位置: モバイル `right: 20px`、デスクトップ `right: 40px`
- レベル選択メニュー: FABの上部（`bottom: 90px`）に配置
- DOCX skill: `document.py`, `utilities.py` - Python modules for document processing

**Appropriate for:** Python scripts, shell scripts, or any executable code that performs automation, data processing, or specific operations.

**Note:** Scripts may be executed without loading into context, but can still be read by Claude for patching or environment adjustments.

### references/
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


