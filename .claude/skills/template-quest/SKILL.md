---
name: template-quest
description: 'テンプレートクエスト機能の知識を提供するスキル。テンプレートクエストの閲覧・採用のAPI、一覧・詳細画面を含む。'
---

# テンプレートクエスト スキル

## 概要

公式テンプレートクエストの一覧表示・詳細閲覧・家族への採用処理を管理する機能。読み取り専用API（キャッシュ1時間）と採用処理を含む。

## メインソースファイル

### API Routes
- `packages/web/app/api/quests/template/route.ts`: テンプレート一覧 (GET) - staleTime: 30分
- `packages/web/app/api/quests/template/[id]/route.ts`: テンプレート詳細 (GET)
- `packages/web/app/api/quests/template/[id]/adopt/route.ts`: 家族への採用 (POST)
- `packages/web/app/api/quests/template/client.ts`: APIクライアント
- `packages/web/app/api/quests/template/query.ts`: React Queryフック

### 画面・コンポーネント（一覧）
- `packages/web/app/(app)/quests/template/page.tsx`: テンプレート一覧ページ
- `packages/web/app/(app)/quests/template/_components/TemplateQuestsScreen.tsx`: 一覧画面
- `packages/web/app/(app)/quests/template/_hooks/useTemplateQuests.ts`: テンプレート一覧取得（1時間キャッシュ）
- `packages/web/app/(app)/quests/template/_hooks/useAdoptTemplateQuest.ts`: 採用処理フック

### 画面・コンポーネント（詳細）
- `packages/web/app/(app)/quests/template/[id]/page.tsx`: テンプレート詳細ページ
- `packages/web/app/(app)/quests/template/[id]/_components/TemplateQuestViewScreen.tsx`: 詳細画面
  - 採用ボタン
  - 確認モーダル

## 主要機能

### 1. テンプレート一覧
- `QuestListLayout` コンポーネントで表示
- カテゴリフィルター・検索対応
- 1時間キャッシュ（データが頻繁に変わらないため）

### 2. テンプレート詳細閲覧
- 共通コンポーネント使用: `QuestViewHeader`, `QuestConditionTab`, `QuestDetailTab`, `QuestOtherTab`
- 採用ボタン → 確認モーダル → `adopt` API

### 3. 採用処理
- テンプレートを元に家族クエストを作成
- 採用後は家族クエスト一覧へリダイレクト

## APIエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/quests/template` | テンプレート一覧 |
| GET | `/api/quests/template/[id]` | テンプレート詳細 |
| POST | `/api/quests/template/[id]/adopt` | 採用（家族クエスト作成） |

## 実装上の注意点

- テンプレートは読み取り専用（作成・編集・削除なし）
- staleTime: 30分（`useTemplateQuests`）
- キャッシュ時間: 1時間（`cacheTime`）
- 採用時はテンプレートの内容をコピーして family_quests に INSERT
