---
name: notification
description: '通知機能の知識を提供するスキル。通知取得・既読処理のAPI、通知一覧画面、ポーリング、通知タイプ一覧を含む。'
---

# 通知 スキル

## 概要

ユーザーへの通知の取得・表示・既読処理を管理する機能。5分ポーリングで新着通知を確認する。

## メインソースファイル

### API Routes
- `packages/web/app/api/notifications/route.ts`: 通知一覧取得 (GET)
- `packages/web/app/api/notifications/read/route.ts`: 既読処理 (POST)
- `packages/web/app/api/notifications/client.ts`: APIクライアント
- `packages/web/app/api/notifications/query.ts`: React Queryフック

### 画面・コンポーネント
- `packages/web/app/(app)/notifications/page.tsx`: 通知一覧ページ
- `packages/web/app/(app)/notifications/_components/NotificationsScreen.tsx`: 通知画面
- `packages/web/app/(app)/notifications/_components/NotificationList.tsx`: 通知リスト
- `packages/web/app/(app)/notifications/_components/NotificationItem.tsx`: 通知アイテム
- `packages/web/app/(app)/notifications/_hooks/useNotifications.ts`: 通知一覧取得（5分ポーリング）
- `packages/web/app/(app)/notifications/_hooks/useMarkAsRead.ts`: 既読処理フック

## 通知タイプ

- `family_quest_review`: 家族クエストのレビュー申請
- `quest_report_approved`: クエスト完了報告が承認された
- `quest_report_rejected`: クエスト完了報告が却下された
- `quest_report_cleared`: クエスト完了クリア
- `level_up`: レベルアップ
- `quest_completed`: クエスト完了

## 主要機能

### 1. 通知一覧
- 未読/全て の表示切り替え
- `NotificationItem` で通知内容・日時・ナビゲーションリンクを表示
- 5分間隔のポーリングで新着確認

### 2. 既読処理
- 通知クリック時に自動既読
- 全て既読ボタン

## APIエンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/notifications` | 通知一覧取得 |
| POST | `/api/notifications/read` | 既読処理 |

## 実装上の注意点

- ポーリング間隔は5分（`refetchInterval: 5 * 60 * 1000`）
- 通知生成は各機能のAPI側で実行（クエスト承認時など）
- 未読件数はヘッダーのバッジに表示
