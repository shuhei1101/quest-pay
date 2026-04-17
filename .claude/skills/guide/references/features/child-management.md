
# 子供管理スキル

## 概要

子供ユーザーの一覧表示・新規作成・編集・招待コードによる参加処理を管理する機能。親が子供を管理するためのCRUD操作と、招待コードを使った子供アカウントの紐付け処理を含む。

## メインソースファイル

### API Routes
- `packages/web/app/api/children/route.ts`: 子供一覧取得・新規作成 (GET/POST)
- `packages/web/app/api/children/[id]/route.ts`: 子供詳細取得・更新・削除 (GET/PUT/DELETE)
- `packages/web/app/api/children/invite/service.ts`: 招待コード生成・管理
- `packages/web/app/api/children/join/route.ts`: 招待コードで家族に参加 (POST)
- `packages/web/app/api/children/client.ts`: APIクライアント
- `packages/web/app/api/children/query.ts`: React Queryフック

### 画面・コンポーネント
- `packages/web/app/(app)/children/page.tsx`: 子供一覧ページ
- `packages/web/app/(app)/children/[id]/page.tsx`: 子供編集ページ
- `packages/web/app/(app)/children/new/page.tsx`: 子供新規作成ページ
- `packages/web/app/(app)/children/_components/ChildCardLayout.tsx`: 子供カード表示
- `packages/web/app/(app)/children/_components/ChildForm.tsx`: 子供フォーム
- `packages/web/app/(app)/children/_hooks/useChildren.ts`: 一覧取得フック
- `packages/web/app/(app)/children/[id]/_hooks/useChildForm.ts`: フォーム管理フック

## 主要機能

### 1. 子供一覧
- 家族に属する子供の一覧表示（ChildCardLayout）
- 新規作成・編集ページへのナビゲーション

### 2. 子供フォーム（新規作成・編集共通）
- 名前・アバター・アイコン設定
- 必須項目バリデーション

### 3. 招待コード機能
- 親が子供用招待コードを生成
- 子供がコードを入力して家族に参加
- 招待コードは有効期限あり

## APIエンドポイント

| Method | Path                 | 説明               |
| ------ | -------------------- | ------------------ |
| GET    | `/api/children`      | 家族の子供一覧取得 |
| POST   | `/api/children`      | 子供新規作成       |
| GET    | `/api/children/[id]` | 子供詳細取得       |
| PUT    | `/api/children/[id]` | 子供情報更新       |
| DELETE | `/api/children/[id]` | 子供削除           |
| POST   | `/api/children/join` | 招待コードで参加   |

## 実装上の注意点

- 子供プロフィールは `profiles` + `children` テーブル両方に作成
- 削除時は関連 child_quests, reward_histories も CASCADE 削除
- 親のみ子供を作成・編集・削除可能
