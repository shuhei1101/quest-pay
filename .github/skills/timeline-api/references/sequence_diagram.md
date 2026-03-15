(2026年3月記載)

# タイムラインAPI シーケンス図

## GET /api/timeline/family (家族タイムライン取得)

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as /api/timeline/family
    participant Auth as getAuthContext
    participant UserQuery as fetchUserInfoByUserId
    participant Query as fetchFamilyTimelines
    participant DB as Supabase Database
    
    Client->>API: GET /api/timeline/family
    Note over API: withRouteErrorHandling
    
    API->>Auth: 認証コンテキスト取得
    Auth->>DB: ユーザー認証確認
    DB-->>Auth: userId, db
    Auth-->>API: { userId, db }
    
    API->>UserQuery: fetchUserInfoByUserId(userId, db)
    UserQuery->>DB: SELECT FROM users<br/>JOIN profiles
    DB-->>UserQuery: userInfo
    UserQuery-->>API: { profiles.familyId }
    
    Note over API: familyIdチェック
    
    API->>Query: fetchFamilyTimelines(db, familyId)
    Query->>DB: SELECT FROM family_timeline<br/>WHERE family_id = :familyId<br/>JOIN profiles, families<br/>ORDER BY created_at DESC
    DB-->>Query: timelines[]
    Query-->>API: timelines
    
    API-->>Client: 200 OK<br/>{ timelines }
    
    Note over Client,DB: エラーケース
    alt 認証失敗
        Auth-->>API: 認証エラー
        API-->>Client: 401 Unauthorized
    end
    
    alt familyId取得失敗
        UserQuery-->>API: ServerError
        API-->>Client: 500 Internal Server Error
    end
    
    alt DB接続エラー
        DB-->>Query: Database Error
        Query-->>API: DatabaseError
        API-->>Client: 500 Internal Server Error
    end
```

## GET /api/timeline/public (公開タイムライン取得)

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as /api/timeline/public
    participant Auth as getAuthContext
    participant Query as fetchPublicTimelines
    participant DB as Supabase Database
    
    Client->>API: GET /api/timeline/public
    Note over API: withRouteErrorHandling
    
    API->>Auth: 認証コンテキスト取得
    Auth->>DB: ユーザー認証確認
    DB-->>Auth: userId, db
    Auth-->>API: { db }
    
    API->>Query: fetchPublicTimelines(db)
    Query->>DB: SELECT FROM public_timeline<br/>JOIN families<br/>ORDER BY created_at DESC
    DB-->>Query: timelines[]
    Query-->>API: timelines
    
    API-->>Client: 200 OK<br/>{ timelines }
    
    Note over Client,DB: エラーケース
    alt 認証失敗
        Auth-->>API: 認証エラー
        API-->>Client: 401 Unauthorized
    end
    
    alt DB接続エラー
        DB-->>Query: Database Error
        Query-->>API: DatabaseError
        API-->>Client: 500 Internal Server Error
    end
```

## GET /api/timeline/family/[id] (個別タイムライン詳細取得)

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as /api/timeline/family/[id]
    participant Auth as getAuthContext
    participant Query as fetchFamilyTimelineById
    participant DB as Supabase Database
    
    Client->>API: GET /api/timeline/family/{timelineId}
    Note over API: withRouteErrorHandling
    
    API->>Auth: 認証コンテキスト取得
    Auth->>DB: ユーザー認証確認
    DB-->>Auth: userId, db
    Auth-->>API: { db }
    
    API->>Query: fetchFamilyTimelineById(db, timelineId)
    Query->>DB: SELECT FROM family_timeline<br/>WHERE id = :timelineId<br/>JOIN profiles, families
    DB-->>Query: timeline
    Query-->>API: timeline
    
    API-->>Client: 200 OK<br/>{ timeline }
    
    Note over Client,DB: エラーケース
    alt 認証失敗
        Auth-->>API: 認証エラー
        API-->>Client: 401 Unauthorized
    end
    
    alt タイムライン未発見
        Query-->>API: null
        API-->>Client: 404 Not Found
    end
    
    alt DB接続エラー
        DB-->>Query: Database Error
        Query-->>API: DatabaseError
        API-->>Client: 500 Internal Server Error
    end
```

## タイムライン投稿作成（クエスト完了時）

```mermaid
sequenceDiagram
    participant Quest as クエスト承認API
    participant Timeline as insertFamilyTimeline
    participant DB as Supabase Database
    participant Notification as 通知システム
    
    Quest->>Quest: 子供クエスト承認処理
    Quest->>DB: UPDATE quest_children<br/>SET status = completed
    DB-->>Quest: 承認完了
    
    Quest->>Timeline: insertFamilyTimeline({<br/>  familyId,<br/>  type: quest_completed,<br/>  profileId,<br/>  message,<br/>  url<br/>})
    Timeline->>DB: INSERT INTO family_timeline
    DB-->>Timeline: { id }
    Timeline-->>Quest: { id }
    
    alt クエストクリア時
        Quest->>Timeline: insertFamilyTimeline({<br/>  type: quest_cleared<br/>})
        Timeline->>DB: INSERT INTO family_timeline
        DB-->>Timeline: { id }
    end
    
    alt マイルストーン達成時
        Quest->>DB: SELECT COUNT(*) FROM quest_children<br/>WHERE status = completed
        DB-->>Quest: count
        
        opt count が 10, 50, 100...
            Quest->>Timeline: insertFamilyTimeline({<br/>  type: quest_milestone_reached<br/>})
            Timeline->>DB: INSERT INTO family_timeline
        end
    end
    
    Quest->>Notification: 通知送信
```

## クライアント側フェッチフロー（React Query無限スクロール）

```mermaid
sequenceDiagram
    participant UI as 画面コンポーネント
    participant Hook as useFamilyTimelines
    participant Query as React Query
    participant API as /api/timeline/family
    
    UI->>Hook: useFamilyTimelines()
    Hook->>Query: useInfiniteQuery({<br/>  queryKey,<br/>  queryFn,<br/>  getNextPageParam<br/>})
    
    Query->>API: GET /api/timeline/family
    API-->>Query: { timelines }
    Query-->>Hook: { data, fetchNextPage }
    Hook-->>UI: timelines[]
    
    Note over UI: ユーザーがスクロール
    
    UI->>Hook: fetchNextPage()
    Hook->>Query: 次ページ取得リクエスト
    Query->>API: GET /api/timeline/family<br/>?cursor=lastId
    API-->>Query: { timelines }
    Query-->>Hook: 追加データ
    Hook-->>UI: 既存 + 新規timelines[]
```

## フィルタリング・ページネーション最適化

### カーソルベースページネーション

```sql
SELECT * FROM family_timeline
WHERE family_id = :familyId
  AND created_at < :cursor
ORDER BY created_at DESC
LIMIT :pageSize
```

### アクションタイプフィルタリング

```sql
SELECT * FROM family_timeline
WHERE family_id = :familyId
  AND type IN (:types[])
ORDER BY created_at DESC
LIMIT :pageSize
```

### プロフィールフィルタリング（特定メンバーのアクティビティ）

```sql
SELECT * FROM family_timeline
WHERE family_id = :familyId
  AND profile_id = :profileId
ORDER BY created_at DESC
LIMIT :pageSize
```
