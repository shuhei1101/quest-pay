---
name: reward
description: '報酬設定・管理機能の知識を提供するスキル。報酬履歴・お小遣い支払い・家族の年齢別/レベル別報酬テーブル・報酬計算フローのAPI、画面構造を含む。'
---

# 報酬設定・管理 スキル

## 概要

家族全体の報酬設定（年齢別・レベル別テーブル）と報酬履歴・支払い処理を管理する機能。クエスト完了 → レベルアップ → 通知の処理フローを含む。

## メインソースファイル

### API Routes
- `packages/web/app/api/reward/histories/route.ts`: 報酬履歴一覧 (GET)
- `packages/web/app/api/reward/pay/complete/route.ts`: お小遣い支払い完了 (POST)
- `packages/web/app/api/reward/pay/start/route.ts`: お小遣い支払い開始 (POST)
- `packages/web/app/api/reward/family/by-age/table/route.ts`: 家族の年齢別報酬テーブル (GET/PUT)
- `packages/web/app/api/reward/family/by-level/table/route.ts`: 家族のレベル別報酬テーブル (GET/PUT)
- `packages/web/app/api/reward/client.ts`: APIクライアント
- `packages/web/app/api/reward/query.ts`: React Queryフック

### 画面・コンポーネント（家族報酬設定）
- `packages/web/app/(app)/reward/page.tsx`: 報酬設定ページ（家族デフォルト）
- `packages/web/app/(app)/reward/_components/AgeRewardEditLayout.tsx`: 年齢別報酬編集（子供設定と共有）
- `packages/web/app/(app)/reward/_components/LevelRewardEditLayout.tsx`: レベル別報酬編集（子供設定と共有）

## 主要機能

### 1. 家族の報酬設定（デフォルト）
- 年齢別報酬テーブル: 年齢ごとの月額お小遣い
- レベル別報酬テーブル: クエストレベル(1-5)ごとの報酬金額・経験値
- 設定は子供設定のフォールバックとして使用

### 2. 報酬履歴
- 報酬付与・支払いの履歴一覧
- 報酬タイプ: `quest`（クエスト完了）/ `age_monthly`（年齢別月次）/ `level_monthly`（レベル別月次）/ `other`

### 3. お小遣い支払い
- 支払い開始（`pay/start`）→ 支払い完了（`pay/complete`）の2段階

### 4. 報酬計算フロー
```
クエスト完了承認
→ 報酬付与（reward_histories に INSERT）
→ レベルアップ判定
→ 通知送信
→ タイムライン投稿
```

## APIエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/reward/histories` | 報酬履歴一覧 |
| POST | `/api/reward/pay/start` | 支払い開始 |
| POST | `/api/reward/pay/complete` | 支払い完了 |
| GET/PUT | `/api/reward/family/by-age/table` | 家族年齢別報酬テーブル |
| GET/PUT | `/api/reward/family/by-level/table` | 家族レベル別報酬テーブル |

## 実装上の注意点

- 子供の個別報酬設定は `child-reward` スキルを参照
- 共有コンポーネント `AgeRewardEditLayout` / `LevelRewardEditLayout` は `type` パラメータで `"family"` / `"child"` を渡す
- 報酬計算はクエスト承認API内でトランザクション処理
