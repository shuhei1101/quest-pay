(2026年3月15日 14:30記載)

# 通知API シーケンス図

## API エンドポイント一覧（再掲）

### 通知管理
- `GET /api/notifications`: 通知一覧取得
- `PUT /api/notifications/read`: 既読マーク（複数）

### 将来実装予定
- `DELETE /api/notifications/[id]`: 通知削除
- `GET /api/notifications/unread-count`: 未読件数取得
- `PUT /api/notifications/read-all`: 全件既読マーク

## GET /api/notifications（通知一覧取得）

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant UserQuery as ユーザー情報取得
    participant NotifQuery as 通知取得
    participant DB as Database
    participant Logger as Logger
    
    C->>API: GET /api/notifications
    
    API->>Logger: info: 通知一覧取得API開始
    API->>Auth: ユーザー認証確認<br/>getAuthContext()
    Auth->>DB: セッション確認
    DB-->>Auth: ユーザーID
    Auth-->>API: {db, userId}
    API->>Logger: debug: 認証コンテキスト取得完了
    
    API->>UserQuery: fetchUserInfoByUserId({userId, db})
    UserQuery->>DB: SELECT users, profiles<br/>WHERE users.id = userId
    DB-->>UserQuery: ユーザー情報
    UserQuery-->>API: {profiles: {id: profileId}}
    
    alt プロフィールID取得失敗
        API->>API: throw ServerError<br/>"プロフィールIDの取得に失敗"
        API-->>C: 500 Internal Server Error
    end
    
    API->>Logger: debug: プロフィール情報取得完了
    
    API->>NotifQuery: fetchNotifications({db, profileId})
    NotifQuery->>DB: SELECT * FROM notifications<br/>WHERE recipient_profile_id = profileId<br/>ORDER BY created_at DESC
    DB-->>NotifQuery: 通知一覧
    NotifQuery-->>API: notifications[]
    
    API->>Logger: debug: 通知取得完了<br/>notificationsCount
    API->>Logger: info: 通知一覧取得API完了
    
    API-->>C: 200 OK<br/>{notifications: [...]}
```

### レスポンス詳細

**成功時 (200 OK)**:
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
    // ... more notifications
  ]
}
```

**エラー時**:
- `401 Unauthorized`: 認証失敗
- `500 Internal Server Error`: プロフィールID取得失敗またはDB エラー

## PUT /api/notifications/read（既読マーク）

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Validate as バリデーション
    participant UserQuery as ユーザー情報取得
    participant NotifQuery as 通知取得
    participant Service as readNotifications
    participant DB as Database
    participant Logger as Logger
    
    C->>API: PUT /api/notifications/read<br/>{notificationIds: [...], updatedAt: "..."}
    
    API->>Logger: info: 通知既読API開始
    API->>Auth: ユーザー認証確認<br/>getAuthContext()
    Auth->>DB: セッション確認
    DB-->>Auth: ユーザーID
    Auth-->>API: {db, userId}
    API->>Logger: debug: 認証コンテキスト取得完了
    
    API->>Validate: ReadNotificationsRequestScheme.parse(body)
    Validate-->>API: {notificationIds, updatedAt}
    API->>Logger: debug: リクエストボディ検証完了<br/>count
    
    API->>UserQuery: fetchUserInfoByUserId({userId, db})
    UserQuery->>DB: SELECT users, profiles<br/>WHERE users.id = userId
    DB-->>UserQuery: ユーザー情報
    UserQuery-->>API: {profiles: {id: profileId}}
    
    alt プロフィールID取得失敗
        API->>API: throw ServerError<br/>"プロフィールIDの取得に失敗"
        API-->>C: 500 Internal Server Error
    end
    
    API->>Logger: debug: プロフィール情報取得完了
    
    API->>NotifQuery: fetchNotifications({db, profileId})
    NotifQuery->>DB: SELECT * FROM notifications<br/>WHERE recipient_profile_id = profileId
    DB-->>NotifQuery: 現在の通知一覧
    NotifQuery-->>API: currentNotifications[]
    API->>Logger: debug: 通知一覧取得完了<br/>count
    
    API->>API: 権限チェック<br/>リクエストされた通知IDが<br/>全て自分の通知か確認
    
    alt 他人の通知が含まれる
        API->>Logger: warn: 他ユーザーの通知へのアクセス試行<br/>{userId, profileId}
        API->>API: throw ServerError<br/>"他のユーザの通知にアクセス"
        API-->>C: 500 Internal Server Error
    end
    
    API->>Service: readNotifications({<br/>  notificationIds,<br/>  updatedAt,<br/>  profileId<br/>})
    
    Service->>DB: BEGIN TRANSACTION
    
    loop 各通知ID
        Service->>DB: updateNotification({<br/>  db: tx,<br/>  id: notificationId,<br/>  updatedAt,<br/>  record: {<br/>    isRead: true,<br/>    readAt: NOW()<br/>  }<br/>})
        DB-->>Service: 更新完了
    end
    
    Service->>DB: COMMIT
    DB-->>Service: トランザクション完了
    Service-->>API: notificationIds[]
    
    API->>Logger: debug: 通知既読完了<br/>count
    API->>Logger: info: 通知既読成功<br/>count
    
    API-->>C: 200 OK<br/>{}
```

### リクエスト詳細

**Request Body**:
```typescript
{
  notificationIds: [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002"
  ],
  updatedAt: "2026-03-15T10:00:00Z"  // 楽観的ロック用
}
```

**成功時 (200 OK)**:
```typescript
{}  // 空オブジェクト
```

**エラー時**:
- `401 Unauthorized`: 認証失敗
- `400 Bad Request`: リクエストボディのバリデーションエラー
- `500 Internal Server Error`: 
  - プロフィールID取得失敗
  - 他人の通知へのアクセス試行
  - データベースエラー

## データベース操作詳細

### fetchNotifications（通知取得）

```mermaid
sequenceDiagram
    participant API as API Handler
    participant Query as fetchNotifications
    participant DB as Database
    
    API->>Query: fetchNotifications({db, profileId})
    Query->>DB: db.select()<br/>  .from(notifications)<br/>  .where(recipient_profile_id = profileId)<br/>  .orderBy(created_at DESC)
    
    alt クエリ成功
        DB-->>Query: notifications[]
        Query-->>API: notifications[]
    else DBエラー
        DB-->>Query: Error
        Query->>Query: throw DatabaseError<br/>"通知一覧の取得に失敗"
        Query-->>API: DatabaseError
    end
```

### updateNotification（既読更新）

```mermaid
sequenceDiagram
    participant Service as readNotifications
    participant Update as updateNotification
    participant DB as Database (Transaction)
    
    Service->>Update: updateNotification({<br/>  db: tx,<br/>  id: notificationId,<br/>  updatedAt,<br/>  record: {isRead: true, readAt: NOW()}<br/>})
    
    Update->>DB: UPDATE notifications<br/>SET is_read = true,<br/>    read_at = NOW(),<br/>    updated_at = NOW()<br/>WHERE id = notificationId<br/>  AND updated_at = updatedAt
    
    alt 楽観的ロックOK（1件更新）
        DB-->>Update: 更新成功
        Update-->>Service: 成功
    else 楽観的ロック失敗（0件更新）
        DB-->>Update: 更新0件
        Update->>Update: throw DatabaseError<br/>"楽観的ロック失敗"
        Update-->>Service: DatabaseError
    end
```

## エラーハンドリングパターン

### 認証エラー

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as API Handler
    participant Auth as getAuthContext
    
    C->>API: リクエスト
    API->>Auth: 認証チェック
    Auth->>Auth: セッション確認失敗
    Auth-->>API: throw AuthError
    API->>API: withRouteErrorHandling<br/>でキャッチ
    API-->>C: 401 Unauthorized<br/>{error: "認証に失敗しました"}
```

### バリデーションエラー

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as API Handler
    participant Validate as Zod Schema
    
    C->>API: PUT /api/notifications/read<br/>{notificationIds: "invalid"}
    API->>Validate: ReadNotificationsRequestScheme.parse(body)
    Validate->>Validate: バリデーション失敗
    Validate-->>API: ZodError
    API->>API: withRouteErrorHandling<br/>でキャッチ
    API-->>C: 400 Bad Request<br/>{error: "リクエスト形式が不正です"}
```

### データベースエラー

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as API Handler
    participant DB as Database
    
    C->>API: リクエスト
    API->>DB: クエリ実行
    DB->>DB: 接続エラー
    DB-->>API: Error
    API->>API: throw DatabaseError<br/>"通知一覧の取得に失敗"
    API->>API: withRouteErrorHandling<br/>でキャッチ
    API-->>C: 500 Internal Server Error<br/>{error: "データベースエラー"}
```

### 権限エラー（他人の通知へのアクセス）

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as API Handler
    participant NotifQuery as 通知取得
    participant Logger as Logger
    
    C->>API: PUT /api/notifications/read<br/>{notificationIds: ["他人の通知ID"]}
    API->>NotifQuery: 自分の通知一覧取得
    NotifQuery-->>API: myNotifications[]
    API->>API: 権限チェック<br/>リクエストIDが自分の通知か?
    API->>API: 他人の通知を検出
    API->>Logger: warn: 他ユーザーの通知へのアクセス試行
    API->>API: throw ServerError<br/>"他のユーザの通知にアクセス"
    API->>API: withRouteErrorHandling<br/>でキャッチ
    API-->>C: 500 Internal Server Error<br/>{error: "権限がありません"}
```

## トランザクション管理

### 複数通知の既読処理

```mermaid
sequenceDiagram
    participant Service as readNotifications
    participant DB as Database
    
    Service->>DB: db.transaction(async (tx) => {...})
    DB->>DB: BEGIN TRANSACTION
    
    loop 各通知ID
        Service->>DB: tx.update(notifications)<br/>  .set({isRead: true, readAt: NOW()})<br/>  .where(id = notificationId)
        
        alt 更新成功
            DB-->>Service: 1件更新
        else 更新失敗
            DB-->>Service: Error
            Service->>DB: ROLLBACK
            DB-->>Service: トランザクション破棄
            Service-->>Service: throw DatabaseError
        end
    end
    
    Service->>DB: COMMIT
    DB-->>Service: トランザクション確定
    Service-->>Service: 成功
```

## ログ記録パターン

### 正常系ログ

```mermaid
sequenceDiagram
    participant API as API Handler
    participant Logger as Logger
    
    Note over API: リクエスト開始
    API->>Logger: info: "通知一覧取得API開始"<br/>{method: 'GET'}
    
    Note over API: 認証完了
    API->>Logger: debug: "認証コンテキスト取得完了"<br/>{userId}
    
    Note over API: データ取得
    API->>Logger: debug: "通知取得完了"<br/>{notificationsCount}
    
    Note over API: リクエスト完了
    API->>Logger: info: "通知一覧取得API完了"<br/>{notificationsCount}
```

### エラー系ログ

```mermaid
sequenceDiagram
    participant API as API Handler
    participant Logger as Logger
    
    Note over API: 権限エラー発生
    API->>Logger: warn: "他ユーザーの通知へのアクセス試行"<br/>{userId, profileId}
    
    Note over API: サーバーエラー発生
    API->>Logger: error: "通知一覧の取得に失敗"<br/>{error, userId}
```
