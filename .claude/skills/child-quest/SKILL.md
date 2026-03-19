---
name: child-quest
description: '子供クエスト機能の知識を提供するスキル。子供クエストのAPI、一覧画面、詳細閲覧、ステータス遷移、完了報告・取消処理を含む。'
---

# 子供クエスト スキル

## 概要

子供が取り組むクエストの一覧・詳細・完了報告・取消・親の承認/却下を管理する機能。クエストのライフサイクル管理（ステータス遷移）を含む。

## メインソースファイル

### API Routes
- `packages/web/app/api/quests/child/route.ts`: 子供クエスト一覧 (GET)
- `packages/web/app/api/quests/child/[id]/route.ts`: 詳細取得 (GET)
- `packages/web/app/api/quests/child/[id]/complete/route.ts`: 完了報告 (POST)
- `packages/web/app/api/quests/child/[id]/cancel/route.ts`: 完了取消 (POST)
- `packages/web/app/api/quests/child/[id]/approve/route.ts`: 親が承認 (POST)
- `packages/web/app/api/quests/child/[id]/reject/route.ts`: 親が却下 (POST)
- `packages/web/app/api/quests/child/client.ts`: APIクライアント
- `packages/web/app/api/quests/child/query.ts`: React Queryフック

### 画面・コンポーネント
- `packages/web/app/(app)/quests/child/page.tsx`: 子供クエスト一覧ページ
- `packages/web/app/(app)/quests/child/_components/ChildQuestsScreen.tsx`: 一覧画面
- `packages/web/app/(app)/quests/family/[id]/view/child/[childId]/page.tsx`: 詳細ページ
- `packages/web/app/(app)/quests/view/_components/ChildQuestViewFooter.tsx`: アクションフッター

## クエストステータス遷移

```
not_started → in_progress → pending_review → completed
                                  ↓ (reject)
                             in_progress
```

## 主要機能

### 1. 子供クエスト一覧
- ステータス別フィルター（進行中/完了/未着手）
- ソート: 期限順・作成日順
- `QuestListLayout` コンポーネントで表示

### 2. クエスト詳細閲覧
- 共通コンポーネント使用: `QuestViewHeader`, `QuestConditionTab`, `QuestDetailTab`, `QuestOtherTab`
- `ChildQuestViewFooter` でステータスに応じたアクションボタン

### 3. 完了報告・取消
- `not_started/in_progress`: 完了報告ボタン
- `pending_review`: 報告取消ボタン
- `completed`: ボタン無効

## 実装上の注意点

- ステータス遷移は API 側で制御（不正遷移は 400）
- 承認時: 報酬付与 → タイムライン投稿 → レベルアップ判定の順で処理
- 子供は自分に割り当てられたクエストのみ閲覧可能
