---
name: family-quest
description: '家族クエスト機能の知識を提供するスキル。家族クエストのCRUD・公開・承認・一覧・詳細閲覧のAPI、画面構造、フォーム、レベル管理を含む。'
---

# 家族クエスト スキル

## 概要

家族クエストの作成・編集・一覧・詳細閲覧・公開・子供への承認/却下処理を管理する機能。レベル管理（1-5段階）と楽観的ロックを含む。

## メインソースファイル

### API Routes
- `packages/web/app/api/quests/family/route.ts`: クエスト一覧取得・作成 (GET/POST)
- `packages/web/app/api/quests/family/[id]/route.ts`: 詳細取得・更新・削除 (GET/PUT/DELETE)
- `packages/web/app/api/quests/family/[id]/publish/route.ts`: クエスト公開 (POST)
- `packages/web/app/api/quests/family/[id]/review-request/route.ts`: レビュー申請 (POST)
- `packages/web/app/api/quests/family/[id]/approve/route.ts`: 承認 (POST)
- `packages/web/app/api/quests/family/[id]/reject/route.ts`: 却下 (POST)
- `packages/web/app/api/quests/family/client.ts`: APIクライアント
- `packages/web/app/api/quests/family/query.ts`: React Queryフック

### 画面・コンポーネント（一覧）
- `packages/web/app/(app)/quests/family/page.tsx`: クエスト一覧ページ
- `packages/web/app/(app)/quests/family/_components/FamilyQuestListScreen.tsx`: 一覧画面
  - 4タブ: 公開中/家族のみ/違反/テンプレート
  - フィルター・ソート・ページネーション
  - URL クエリパラメータ同期

### 画面・コンポーネント（作成・編集）
- `packages/web/app/(app)/quests/family/new/page.tsx`: 新規作成ページ
- `packages/web/app/(app)/quests/family/[id]/edit/page.tsx`: 編集ページ
  - 3タブフォーム: 基本設定/詳細設定/子供設定
  - レベル管理（1-5段階、動的追加）
  - 楽観的ロック（version チェック）
  - セッションストレージでフォーム保持

### 画面・コンポーネント（詳細閲覧）
- `packages/web/app/(app)/quests/family/[id]/view/page.tsx`: 詳細ページ
- 親ビュー: 3タブ（条件/依頼情報/その他）+ レベル選択 + SubMenuFAB
- 子供ビュー: ステータスベースのアクションボタン

## 主要機能

### 1. クエスト一覧（4タブ）
- 公開中 / 家族のみ / 違反 / テンプレート
- `QuestListLayout` コンポーネントで一覧表示
- フィルター・ソートはURL クエリパラメータで管理

### 2. クエスト作成・編集（3タブフォーム）
- **基本設定**: タイトル・カテゴリ・アイコン・説明
- **詳細設定**: 期限・繰り返し設定・公開設定
- **子供設定**: 担当者割り当て・レベル設定（1-5）
- `QuestEditLayout` コンポーネントを使用

### 3. レベル管理
- レベル1-5まで動的に追加可能
- 各レベルに報酬・経験値を設定
- `SubMenuFAB` でレベル選択・変更

### 4. 公開・承認フロー
- 親がクエストを公開 → `publish`
- 子供が完了報告 → `review-request`
- 親が承認 → `approve` / 却下 → `reject`

## APIエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/quests/family` | 一覧取得 |
| POST | `/api/quests/family` | 作成 |
| GET | `/api/quests/family/[id]` | 詳細取得 |
| PUT | `/api/quests/family/[id]` | 更新 |
| DELETE | `/api/quests/family/[id]` | 削除 |
| POST | `/api/quests/family/[id]/publish` | 公開 |
| POST | `/api/quests/family/[id]/approve` | 承認 |
| POST | `/api/quests/family/[id]/reject` | 却下 |

## 実装上の注意点

- 楽観的ロック: PUT 時に `version` を送信し、サーバー側で `checkVersion()` を実行
- フォーム保持: セッションストレージを使用（ページ離脱後も復元）
- `QuestEditLayout` と `QuestListLayout` の共通コンポーネントを活用
