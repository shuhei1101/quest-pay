---
name: child-reward
description: '子供の報酬設定機能の知識を提供するスキル。子供個別の年齢別・レベル別報酬API、設定画面、フックを含む。'
---

# 子供報酬設定 スキル

## 概要

子供ごとの個別報酬設定（年齢別・レベル別）を管理する機能。家族のデフォルト報酬設定からフォールバックする仕組みを持つ。

## メインソースファイル

### API Routes
- `packages/web/app/api/children/[id]/reward/by-age/table/route.ts`: 年齢別報酬テーブル (GET/PUT)
- `packages/web/app/api/children/[id]/reward/by-level/table/route.ts`: レベル別報酬テーブル (GET/PUT)

### 画面・コンポーネント
- `packages/web/app/(app)/children/[id]/reward/page.tsx`: 子供報酬設定ページ
- `packages/web/app/(app)/reward/_components/AgeRewardEditLayout.tsx`: 年齢別報酬編集（共有）
- `packages/web/app/(app)/reward/_components/LevelRewardEditLayout.tsx`: レベル別報酬編集（共有）
- `packages/web/app/(app)/children/[id]/reward/_hooks/useChildAgeRewardForm.ts`: 年齢別フォーム管理
- `packages/web/app/(app)/children/[id]/reward/_hooks/useChildLevelRewardForm.ts`: レベル別フォーム管理

## 主要機能

### 1. 年齢別報酬設定
- 子供の年齢に応じた月額報酬を設定
- 未設定の場合は家族のデフォルト設定にフォールバック
- `AgeRewardEditLayout` コンポーネントを使用（家族設定画面と共有）

### 2. レベル別報酬設定
- クエストレベル（1-5）に応じた報酬金額・経験値を設定
- `LevelRewardEditLayout` コンポーネントを使用（家族設定画面と共有）

### 3. タブ切り替えUI
- 年齢別タブ / レベル別タブ を `ScrollableTabs` で切り替え

## APIエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/children/[id]/reward/by-age/table` | 年齢別報酬テーブル取得 |
| PUT | `/api/children/[id]/reward/by-age/table` | 年齢別報酬テーブル更新 |
| GET | `/api/children/[id]/reward/by-level/table` | レベル別報酬テーブル取得 |
| PUT | `/api/children/[id]/reward/by-level/table` | レベル別報酬テーブル更新 |

## 実装上の注意点

- 共有コンポーネントは `type` パラメータで `"child"` / `"family"` を渡して切り替え
- 保存時は全テーブルを一括 PUT（行ごとの更新ではない）
- 親のみ子供の報酬設定を変更可能
