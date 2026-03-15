(2026年3月記載)

# 通知API エンドポイント詳細

## ファイル構成

```
packages/web/app/api/notifications/
├── route.ts                        # GET（一覧取得）
├── client.ts                       # APIクライアント
├── query.ts                        # データベースクエリ（fetchNotifications, fetchNotification）
├── db.ts                           # 低レベルDB操作（updateNotification）
├── dbHelper.ts                     # 排他制御ヘルパー
├── service.ts                      # ビジネスロジック（readNotifications）
└── read/
    ├── route.ts                    # PUT（既読マーク）
    └── client.ts                   # APIクライアント（既読マーク用）
```

## 実装済みエンドポイント

### GET /api/notifications

**概要**: ログインユーザーに紐づく通知一覧を取得

**認証**: 必須（ログインユーザーのみ）

**Query Parameters**: なし

**Request Headers**:
```http
Authorization: Bearer <session-token>
```

**Request Example**:
```http
GET /api/notifications
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  notifications: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      recipientProfileId: "550e8400-e29b-41d4-a716-446655440002",
      url: "/quests/family/abc123",
      type: "family_quest_review",
      message: "お部屋の片付けクエストの完了報告がありました",
      isRead: false,
      readAt: null,
      createdAt: "2026-03-15T10:00:00Z",
      updatedAt: "2026-03-15T10:00:00Z"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      recipientProfileId: "550e8400-e29b-41d4-a716-446655440002",
      url: "/quests/family/def456/child/child123",
      type: "quest_report_approved",
      message: "洗濯クエストの報告が承認されました",
      isRead: true,
      readAt: "2026-03-15T12:30:00Z",
      createdAt: "2026-03-15T12:00:00Z",
      updatedAt: "2026-03-15T12:30:00Z"
    }
  ]
}
```

**通知タイプ一覧**:
| タイプ | 説明 | 対象者 |
|--------|------|--------|
| `family_quest_review` | 家族クエスト承認依頼 | 親 |
| `quest_report_rejected` | クエスト報告却下 | 子供 |
| `quest_report_approved` | クエスト報告承認 | 子供 |
| `quest_cleared` | クエストクリア | 子供 |
| `quest_level_up` | クエストレベルアップ | 子供 |
| `quest_completed` | クエスト完了 | 子供 |
| `other` | その他 | 汎用 |

**ソート順**:
- `createdAt` の降順（新しい通知が先頭）

**フィルタリング**:
- 現在: 自動的にログインユーザーのプロフィールIDで絞り込み
- 将来実装予定: 未読のみフィルタ（`?unreadOnly=true`）

**Errors**:
```typescript
// 401 Unauthorized
{
  error: "認証に失敗しました",
  status: 401
}

// 500 Internal Server Error（プロフィールID取得失敗）
{
  error: "プロフィールIDの取得に失敗しました。",
  status: 500
}

// 500 Internal Server Error（DB エラー）
{
  error: "通知一覧の取得に失敗しました。",
  status: 500
}
```

**実装ファイル**:
- Route: `packages/web/app/api/notifications/route.ts`
- Client: `packages/web/app/api/notifications/client.ts`
- Query: `packages/web/app/api/notifications/query.ts` (`fetchNotifications`)

---

### PUT /api/notifications/read

**概要**: 複数の通知を一括で既読にする

**認証**: 必須（ログインユーザーのみ）

**Request Body**:
```typescript
{
  notificationIds: string[]    // 既読にする通知IDの配列（必須）
  updatedAt: string            // 楽観的ロック用タイムスタンプ（必須、ISO 8601形式）
}
```

**Validation Rules**:
- `notificationIds`: 配列型、各要素はUUID文字列
- `updatedAt`: ISO 8601形式のタイムスタンプ文字列

**Request Example**:
```http
PUT /api/notifications/read
Authorization: Bearer <token>
Content-Type: application/json

{
  "notificationIds": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440003"
  ],
  "updatedAt": "2026-03-15T10:00:00Z"
}
```

**Response (200 OK)**:
```typescript
{}  // 空オブジェクト（成功時）
```

**処理フロー**:
1. リクエストボディのバリデーション
2. ログインユーザーのプロフィールID取得
3. 現在の通知一覧を取得
4. リクエストされた通知IDが全て自分の通知か確認
5. トランザクション開始
6. 各通知を既読に更新（`is_read = true`, `read_at = NOW()`）
7. トランザクションコミット

**権限チェック**:
- リクエストされた通知IDが全てログインユーザーの通知であることを確認
- 他人の通知IDが含まれている場合はエラー

**トランザクション**:
- 複数の通知更新を1つのトランザクションで実行
- 1つでも失敗した場合は全てロールバック

**Errors**:
```typescript
// 400 Bad Request（バリデーションエラー）
{
  error: "リクエスト形式が不正です",
  status: 400,
  details: {
    notificationIds: "配列形式である必要があります"
  }
}

// 401 Unauthorized
{
  error: "認証に失敗しました",
  status: 401
}

// 500 Internal Server Error（プロフィールID取得失敗）
{
  error: "プロフィールIDの取得に失敗しました。",
  status: 500
}

// 500 Internal Server Error（他人の通知へのアクセス）
{
  error: "他のユーザの通知にアクセスしました。",
  status: 500
}

// 500 Internal Server Error（DB エラー）
{
  error: "通知の既読処理に失敗しました。",
  status: 500
}
```

**実装ファイル**:
- Route: `packages/web/app/api/notifications/read/route.ts`
- Client: `packages/web/app/api/notifications/read/client.ts`
- Service: `packages/web/app/api/notifications/service.ts` (`readNotifications`)
- DB: `packages/web/app/api/notifications/db.ts` (`updateNotification`)

---

## 将来実装予定エンドポイント

以下のエンドポイントは現在未実装ですが、将来的に追加される可能性があります。

### DELETE /api/notifications/[id]

**概要**: 指定した通知を削除

**認証**: 必須（ログインユーザーのみ）

**Path Parameters**:
| パラメータ | 型 | 説明 |
|------------|-----|------|
| id | uuid | 削除する通知ID |

**Request Example**:
```http
DELETE /api/notifications/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  message: "通知を削除しました"
}
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 他人の通知にアクセス
- `404 Not Found`: 通知が見つからない
- `500 Internal Server Error`: サーバーエラー

---

### GET /api/notifications/unread-count

**概要**: 未読通知の件数を取得

**認証**: 必須（ログインユーザーのみ）

**Query Parameters**: なし

**Request Example**:
```http
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

**Response (200 OK)**:
```typescript
{
  count: 5  // 未読通知数
}
```

**実装案**:
```typescript
// クエリ
SELECT COUNT(*) as count
FROM notifications
WHERE recipient_profile_id = :profileId
  AND is_read = false
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `500 Internal Server Error`: サーバーエラー

---

### PUT /api/notifications/read-all

**概要**: 全ての通知を既読にする

**認証**: 必須（ログインユーザーのみ）

**Request Body**:
```typescript
{
  updatedAt: string  // 楽観的ロック用タイムスタンプ
}
```

**Request Example**:
```http
PUT /api/notifications/read-all
Authorization: Bearer <token>
Content-Type: application/json

{
  "updatedAt": "2026-03-15T10:00:00Z"
}
```

**Response (200 OK)**:
```typescript
{
  updatedCount: 10  // 既読にした通知数
}
```

**実装案**:
```typescript
// クエリ
UPDATE notifications
SET is_read = true,
    read_at = NOW(),
    updated_at = NOW()
WHERE recipient_profile_id = :profileId
  AND is_read = false
RETURNING id
```

**Errors**:
- `401 Unauthorized`: 認証失敗
- `500 Internal Server Error`: サーバーエラー

---

## クライアント側での使用方法

### getNotifications（通知一覧取得）

```typescript
import { getNotifications } from "@/app/api/notifications/client"

// 使用例
const fetchData = async () => {
  try {
    const response = await getNotifications()
    console.log(response.notifications)
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error.message, error.status)
    }
  }
}
```

### readNotifications（既読マーク）

```typescript
// 現在未実装（read/client.tsに定義が必要）
// 将来的な実装例:
import { readNotifications } from "@/app/api/notifications/read/client"

const markAsRead = async (notificationIds: string[]) => {
  try {
    await readNotifications({
      notificationIds,
      updatedAt: new Date().toISOString()
    })
    console.log("既読にしました")
  } catch (error) {
    if (error instanceof AppError) {
      console.error(error.message, error.status)
    }
  }
}
```

## React Query フック（将来実装）

### useNotifications（通知一覧取得）

```typescript
// packages/web/app/api/notifications/query.ts
import { useQuery } from "@tanstack/react-query"
import { getNotifications } from "./client"

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 1000 * 60 * 5,  // 5分間はキャッシュを使用
  })
}
```

### useReadNotifications（既読マーク）

```typescript
// packages/web/app/api/notifications/query.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { readNotifications } from "./read/client"

export const useReadNotifications = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: readNotifications,
    onSuccess: () => {
      // 通知一覧を再取得
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
```

## データベーススキーマ

### notifications テーブル

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL DEFAULT '',
  type notification_type NOT NULL DEFAULT 'other',
  message TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_notifications_recipient_profile_id ON notifications(recipient_profile_id);
CREATE INDEX idx_notifications_recipient_is_read ON notifications(recipient_profile_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

### notification_type ENUM

```sql
CREATE TYPE notification_type AS ENUM (
  'family_quest_review',
  'quest_report_rejected',
  'quest_report_approved',
  'quest_cleared',
  'quest_level_up',
  'quest_completed',
  'other'
);
```

## エラーハンドリング

### AppError クラス

```typescript
import { AppError } from "@/app/(core)/error/appError"

// クライアント側エラーハンドリング
try {
  const response = await getNotifications()
} catch (error) {
  if (error instanceof AppError) {
    // AppError の場合
    console.error(error.message)    // "通知一覧の取得に失敗しました"
    console.error(error.status)     // 500
    console.error(error.statusText) // "Internal Server Error"
  } else {
    // その他のエラー
    console.error("予期しないエラーが発生しました")
  }
}
```

### ServerError クラス

```typescript
import { ServerError } from "@/app/(core)/error/appError"

// サーバー側エラーハンドリング
if (!userInfo?.profiles?.id) {
  throw new ServerError("プロフィールIDの取得に失敗しました。")
}
```

### withRouteErrorHandling

すべてのAPIエンドポイントは `withRouteErrorHandling` でラップされており、以下のエラーを自動的に処理します:

- **AppError**: クライアント向けエラーメッセージを返却
- **ZodError**: バリデーションエラーを400で返却
- **その他のエラー**: 500エラーでログ出力

## ログ記録

### Logger の使用

```typescript
import { logger } from "@/app/(core)/logger"

// APIハンドラー内でのログ記録例
logger.info('通知一覧取得API開始', { method: 'GET' })
logger.debug('認証コンテキスト取得完了', { userId })
logger.debug('通知取得完了', { notificationsCount: notifications.length })
logger.info('通知一覧取得API完了', { notificationsCount: notifications.length })

// 警告ログ
logger.warn('他ユーザーの通知へのアクセス試行', { userId, profileId })

// エラーログ（withRouteErrorHandlingが自動的に記録）
```

### ログレベル
- **info**: API開始・完了
- **debug**: 中間処理の詳細
- **warn**: 権限エラーなどの警告
- **error**: 例外発生時（自動記録）

## パフォーマンス考慮事項

### キャッシング戦略
- React Query: `staleTime: 5分` で通知一覧をキャッシュ
- 既読マーク後は `invalidateQueries` でキャッシュ無効化

### ページネーション（将来実装）
```typescript
// 大量の通知がある場合のページネーション例
GET /api/notifications?limit=20&offset=0
```

### インデックス活用
- `recipient_profile_id`: プロフィールごとの通知検索に使用
- `(recipient_profile_id, is_read)`: 未読通知フィルタに使用
- `created_at DESC`: 作成日時での並び替えに使用
