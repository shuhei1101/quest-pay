
# ホーム（ダッシュボード） スキル

## 概要

ホーム画面（ダッシュボード）の表示・データ取得を管理する機能。親と子供で異なるダッシュボード内容を表示する。

## メインソースファイル

### API Routes
- `packages/web/app/api/home/dashboard/route.ts`: ダッシュボードデータ取得 (GET)
  - 親: 家族統計・子供サマリー・最近のクエスト
  - 子供: 個人統計・クエストステータス

### 画面・コンポーネント
- `packages/web/app/(app)/home/page.tsx`: ホームページ
- `packages/web/app/(app)/home/_components/DashboardHeader.tsx`: ヘッダー（ユーザー情報）
- `packages/web/app/(app)/home/_components/DashboardSummary.tsx`: サマリーセクション
- `packages/web/app/(app)/home/_components/StatCard.tsx`: 統計カード
- `packages/web/app/(app)/home/_components/QuickActionCard.tsx`: クイックアクションカード
- `packages/web/app/(app)/home/_components/RecentQuests.tsx`: 最近のクエスト一覧

## 主要機能

### 1. 親ダッシュボード
- 家族全体の統計（完了クエスト数・総報酬額）
- 子供ごとのサマリー（進行中クエスト数・残高）
- 最近のクエスト一覧
- クイックアクション（クエスト作成・子供管理へのリンク）

### 2. 子供ダッシュボード
- 個人統計（獲得報酬・残高・レベル）
- クエストステータス別件数
- 進行中クエスト一覧

## APIエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/home/dashboard` | ダッシュボードデータ取得 |

## 実装上の注意点

- 認証ユーザーのロール（parent/child）で返却データを切り替え
- `StatCard` は汎用カードコンポーネント（数値・ラベル・アイコン）
- `QuickActionCard` はナビゲーションリンク付きカード
