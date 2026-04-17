
# クエスト詳細閲覧 スキル

## 概要

全クエストタイプの詳細閲覧画面で使用する共通コンポーネント群と、各タイプ別のAPIを管理する。3タブ構成（条件/依頼情報/その他）を共通化。

## 共通コンポーネント

- `packages/web/app/(app)/quests/view/_components/QuestViewHeader.tsx`: クエスト名・アイコン表示
- `packages/web/app/(app)/quests/view/_components/QuestViewIcon.tsx`: アイコン表示
- `packages/web/app/(app)/quests/view/_components/QuestConditionTab.tsx`: 条件タブ（レベル・報酬・経験値）
- `packages/web/app/(app)/quests/view/_components/QuestDetailTab.tsx`: 依頼情報タブ（説明・期限・繰り返し）
- `packages/web/app/(app)/quests/view/_components/QuestOtherTab.tsx`: その他タブ（タグ・推奨年齢）
- `packages/web/app/(app)/quests/view/_components/ChildQuestViewFooter.tsx`: 子供用アクションフッター

## タイプ別APIとビュー

### 家族クエスト閲覧
- API: `packages/web/app/api/quests/family/[id]/route.ts` (GET)
- 画面: `packages/web/app/(app)/quests/family/[id]/view/`
- 機能: レベル選択（SubMenuFAB）・編集・削除（親のみ）

### 公開クエスト閲覧
- API: `packages/web/app/api/quests/public/[id]/route.ts` (GET)
- 画面: `packages/web/app/(app)/quests/public/[id]/`
- 機能: いいね・コメントモーダル・家族採用

### テンプレートクエスト閲覧
- API: `packages/web/app/api/quests/template/[id]/route.ts` (GET)
- 画面: `packages/web/app/(app)/quests/template/[id]/`
- 機能: 採用ボタン・確認モーダル（staleTime: 30分）

### 子供クエスト閲覧
- API: `packages/web/app/api/quests/child/[id]/route.ts` (GET)
- 画面: `packages/web/app/(app)/quests/family/[id]/view/child/[childId]/`
- 機能: 完了報告・報告取消（`ChildQuestViewFooter`）

## タブ構成（全タイプ共通）

```
タブ1: 条件（QuestConditionTab）
  - レベル・報酬金額・経験値

タブ2: 依頼情報（QuestDetailTab）
  - 説明・期限・繰り返し設定・担当者

タブ3: その他（QuestOtherTab）
  - タグ・推奨年齢・カテゴリ
```

## 実装上の注意点

- 共通コンポーネントを必ず使用（独自実装禁止）
- SubMenuFAB でアクションボタンをまとめる（親クエスト詳細）
- ステータスによるアクション制御:
  - `not_started/in_progress`: 完了報告ボタン有効
  - `pending_review`: 報告取消ボタン表示
  - `completed`: ボタン無効化
- 権限制御: 親のみ編集/削除、子供のみ完了報告/取消
