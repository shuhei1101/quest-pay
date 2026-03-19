---
name: family
description: '家族機能の知識を提供するスキル。家族の作成・一覧・プロフィール閲覧・フォロー、メンバー管理のAPI、画面構造を含む。'
---

# 家族 スキル

## 概要

家族の作成・一覧表示・プロフィール閲覧・フォロー/アンフォロー・メンバー管理を行う機能。

## メインソースファイル

### API Routes
- `packages/web/app/api/families/route.ts`: 家族一覧取得・作成 (GET/POST)
- `packages/web/app/api/families/[id]/route.ts`: 家族詳細取得・更新・削除 (GET/PUT/DELETE)
- `packages/web/app/api/families/[id]/members/route.ts`: 家族メンバー一覧 (GET)
- `packages/web/app/api/families/[id]/follow/route.ts`: フォロー/アンフォロー (POST/DELETE)
- `packages/web/app/api/families/client.ts`: APIクライアント
- `packages/web/app/api/families/query.ts`: React Queryフック

### 画面・コンポーネント（家族一覧）
- `packages/web/app/(app)/families/page.tsx`: 家族一覧ページ
- `packages/web/app/(app)/families/_components/FamiliesScreen.tsx`: 一覧画面
- `packages/web/app/(app)/families/_components/FamilyList.tsx`: 家族リスト
- `packages/web/app/(app)/families/_hooks/useFamilies.ts`: 一覧取得フック

### 画面・コンポーネント（家族作成）
- `packages/web/app/(app)/families/new/page.tsx`: 家族新規作成ページ
- `packages/web/app/(app)/families/new/_components/FamilyNewScreen.tsx`: 作成画面
  - デュアルアイコン選択（家紋アイコン + 親アイコン）
  - displayId バリデーション（一意性チェック）

### 画面・コンポーネント（家族プロフィール閲覧）
- `packages/web/app/(app)/families/[id]/view/page.tsx`: 家族プロフィールページ
- `packages/web/app/(app)/families/[id]/view/_components/FamilyProfileViewScreen.tsx`: プロフィール画面
  - フォロー/アンフォロー（楽観的更新）
  - タイムライン表示
  - シェアモーダル

## 主要機能

### 1. 家族一覧
- 参加中の家族・フォロー中の家族を表示
- `FamilyList` で家族カード一覧

### 2. 家族新規作成
- 家族名・displayId・説明・アイコン（家紋 + 親）設定
- displayId の重複チェック

### 3. 家族プロフィール閲覧
- メンバー一覧・クエスト統計・タイムライン
- フォロー/アンフォロー（楽観的更新）
- シェア機能

## APIエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/families` | 家族一覧取得 |
| POST | `/api/families` | 家族作成 |
| GET | `/api/families/[id]` | 家族詳細取得 |
| PUT | `/api/families/[id]` | 家族情報更新 |
| DELETE | `/api/families/[id]` | 家族削除 |
| GET | `/api/families/[id]/members` | メンバー一覧 |
| POST | `/api/families/[id]/follow` | フォロー |
| DELETE | `/api/families/[id]/follow` | アンフォロー |

## 実装上の注意点

- displayId は URL に使用されるため英数字のみ許可
- フォロー状態は楽観的更新で即時反映
- 家族削除時はメンバー・クエスト・タイムライン全て CASCADE 削除
