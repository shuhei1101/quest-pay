(2026年3月記載)

# 通知一覧 コンポーネント構造

## ファイル構成

```
packages/web/app/(app)/notifications/
├── page.tsx                        # ルートページ
├── NotificationsScreen.tsx         # 画面メイン
└── _components/
    ├── NotificationList.tsx        # 一覧コンポーネント
    └── NotificationItem.tsx        # 個別アイテム
```

## コンポーネント階層

```
NotificationsScreen
├── タイトル＆ヘッダー
├── フィルタボタン (未読/既読)
└── NotificationList
    └── NotificationItem (複数)
        ├── アイコン
        ├── 通知タイトル
        ├── 通知本文
        ├── タイムスタンプ
        ├── 未読バッジ
        └── アクション (既読マーク、遷移)
```

## 主要コンポーネント詳細

### NotificationsScreen
**ファイル**: `NotificationsScreen.tsx`

**責務**:
- 全体レイアウト管理
- フィルタ状態管理
- 既読マーク実行

**State**:
- `filter`: 'all' | 'unread' | 'read'
- 選択中の通知ID

### NotificationList
**ファイル**: `_components/NotificationList.tsx`

**Props**:
```typescript
type NotificationListProps = {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onNavigate: (notification: Notification) => void
}
```

**責務**:
- 通知リストの描画
- スクロール管理
- 空状態の表示

### NotificationItem
**ファイル**: `_components/NotificationItem.tsx`

**Props**:
```typescript
type NotificationItemProps = {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onNavigate: () => void
}
```

**責務**:
- 個別通知の描画
- クリックイベント処理
- 未読状態の視覚化

## レイアウトパターン

### リストアイテムレイアウト
```
┌─────────────────────────────────────┐
│ [アイコン] タイトル      [未読]    │
│            本文テキスト...         │
│            2時間前                 │
└─────────────────────────────────────┘
```

### 空状態
```
┌─────────────────────────────────────┐
│                                     │
│        [アイコン]                   │
│     通知がありません                │
│                                     │
└─────────────────────────────────────┘
```

## 使用コンポーネント

### Mantine UI
- `Stack`: リスト縦積み
- `Group`: 水平配置
- `Text`: テキスト表示
- `Badge`: 未読バッジ
- `ActionIcon`: アクションボタン
- `ScrollArea`: スクロール可能領域

### カスタムコンポーネント
- なし（Mantine UIで完結）

## スタイリング

### 未読通知
- 背景色: 薄い青（`theme.colors.blue[0]`）
- フォントウェイト: bold

### 既読通知
- 背景色: 透明
- フォントウェイト: normal
- 透明度: 0.7
