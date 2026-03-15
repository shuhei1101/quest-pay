(2026年3月記載)

# コメントAPI シーケンス図

## 1. コメント一覧取得 (GET /api/quests/public/[id]/comments)

```mermaid
sequenceDiagram
    participant Client
    participant API as GET /comments
    participant Auth
    participant DB
    
    Client->>API: GET /api/quests/public/[id]/comments
    API->>Auth: getAuthContext()
    Auth-->>API: { db, userId }
    
    API->>DB: fetchUserInfoByUserId()
    DB-->>API: userInfo
    
    API->>API: プロフィール検証
    
    API->>DB: fetchPublicQuestComments()<br/>(publicQuestId, profileId)
    Note over DB: 左外部結合:<br/>- comment_upvotes (ユーザの評価)<br/>- 評価集計 (upvotes_count, downvotes_count)
    DB-->>API: comments[]
    
    API-->>Client: { comments }
```

## 2. コメント投稿 (POST /api/quests/public/[id]/comments)

```mermaid
sequenceDiagram
    participant Client
    participant API as POST /comments
    participant Auth
    participant DB
    
    Client->>API: POST /api/quests/public/[id]/comments<br/>{ content }
    API->>Auth: getAuthContext()
    Auth-->>API: { db, userId }
    
    API->>DB: fetchUserInfoByUserId()
    DB-->>API: userInfo
    
    API->>API: 親ユーザ検証
    
    API->>DB: createPublicQuestComment()<br/>(publicQuestId, profileId, content)
    Note over DB: INSERT INTO<br/>public_quest_comments
    DB-->>API: comment
    
    API-->>Client: { comment }
```

## 3. コメント更新 (PUT /api/quests/public/[id]/comments/[commentId])

```mermaid
sequenceDiagram
    participant Client
    participant API as PUT /comments/[commentId]
    participant Auth
    participant DB
    
    Client->>API: PUT /comments/[commentId]<br/>{ content }
    API->>Auth: getAuthContext()
    Auth-->>API: { db, userId }
    
    API->>DB: fetchUserInfoByUserId()
    DB-->>API: userInfo
    
    API->>DB: getCommentById(commentId)
    DB-->>API: comment
    
    API->>API: 所有者検証<br/>(comment.profileId === userInfo.profiles.id)
    
    API->>DB: updateComment()<br/>(commentId, content)
    Note over DB: UPDATE<br/>public_quest_comments
    DB-->>API: updatedComment
    
    API-->>Client: { comment: updatedComment }
```

## 4. コメント削除 (DELETE /api/quests/public/[id]/comments/[commentId])

```mermaid
sequenceDiagram
    participant Client
    participant API as DELETE /comments/[commentId]
    participant Auth
    participant DB
    
    Client->>API: DELETE /comments/[commentId]
    API->>Auth: getAuthContext()
    Auth-->>API: { db, userId }
    
    API->>DB: fetchUserInfoByUserId()
    DB-->>API: userInfo
    
    API->>DB: getCommentById(commentId)
    DB-->>API: comment
    
    API->>API: 所有者検証<br/>(comment.profileId === userInfo.profiles.id)
    
    API->>DB: deleteComment(commentId)
    Note over DB: DELETE FROM<br/>public_quest_comments<br/>CASCADE DELETE:<br/>- comment_upvotes<br/>- comment_reports
    DB-->>API: success
    
    API-->>Client: {}
```

## 5. コメント高評価 (POST/DELETE /api/quests/public/[id]/comments/[commentId]/upvote)

```mermaid
sequenceDiagram
    participant Client
    participant API as POST /upvote
    participant Auth
    participant DB
    
    Client->>API: POST /upvote
    API->>Auth: getAuthContext()
    Auth-->>API: { db, userId }
    
    API->>DB: fetchUserInfoByUserId()
    DB-->>API: userInfo
    
    API->>API: 親ユーザ検証
    
    API->>DB: getCommentById(commentId)
    DB-->>API: comment
    
    API->>API: 自己評価チェック<br/>(comment.profileId !== userInfo.profiles.id)
    
    API->>DB: upvoteComment()<br/>(commentId, profileId)
    Note over DB: INSERT INTO comment_upvotes<br/>ON CONFLICT (commentId, profileId)<br/>DO UPDATE SET type = 'upvote'
    DB-->>API: success
    
    API-->>Client: {}
    
    Note over Client,DB: DELETE /upvote は同様のフローで<br/>removeCommentVote() を実行
```

## 6. コメント低評価 (POST/DELETE /api/quests/public/[id]/comments/[commentId]/downvote)

```mermaid
sequenceDiagram
    participant Client
    participant API as POST /downvote
    participant Auth
    participant DB
    
    Note over Client,DB: フローは upvote と同様<br/>type = 'downvote' で動作
    
    Client->>API: POST /downvote
    API->>Auth: getAuthContext()
    Auth-->>API: { db, userId }
    
    API->>DB: fetchUserInfoByUserId()
    DB-->>API: userInfo
    
    API->>API: 親ユーザ検証
    
    API->>DB: getCommentById(commentId)
    DB-->>API: comment
    
    API->>API: 自己評価チェック
    
    API->>DB: downvoteComment()<br/>(commentId, profileId)
    Note over DB: INSERT INTO comment_upvotes<br/>type = 'downvote'
    DB-->>API: success
    
    API-->>Client: {}
```

## 7. コメント報告 (POST /api/quests/public/[id]/comments/[commentId]/report)

```mermaid
sequenceDiagram
    participant Client
    participant API as POST /report
    participant Auth
    participant DB
    
    Client->>API: POST /report<br/>{ reason }
    API->>Auth: getAuthContext()
    Auth-->>API: { db, userId }
    
    API->>DB: fetchUserInfoByUserId()
    DB-->>API: userInfo
    
    API->>API: 親ユーザ検証
    
    API->>DB: reportComment()<br/>(commentId, profileId, reason)
    Note over DB: INSERT INTO comment_reports<br/>(commentId, profileId, reason)<br/>ON CONFLICT DO NOTHING
    DB-->>API: success
    
    API-->>Client: {}
```

## 8. コメントピン留め (POST/DELETE /api/quests/public/[id]/comments/[commentId]/pin)

```mermaid
sequenceDiagram
    participant Client
    participant API as POST /pin
    participant Auth
    participant DB
    
    Client->>API: POST /pin
    API->>Auth: getAuthContext()
    Auth-->>API: { db, userId }
    
    API->>DB: fetchUserInfoByUserId()
    DB-->>API: userInfo
    
    API->>API: 親ユーザ検証
    
    API->>DB: fetchPublicQuest(publicQuestId)
    DB-->>API: publicQuest
    
    API->>API: 家族メンバー検証<br/>(publicQuest.familyId === userInfo.profiles.familyId)
    
    API->>DB: pinComment()<br/>(commentId, publicQuestId)
    Note over DB: BEGIN TRANSACTION<br/>1. 既存ピン留め解除<br/>   UPDATE is_pinned = false<br/>2. 新規ピン留め設定<br/>   UPDATE is_pinned = true<br/>COMMIT
    DB-->>API: success
    
    API-->>Client: {}
    
    Note over Client,DB: DELETE /pin は同様のフローで<br/>unpinComment() を実行
```

## 9. 公開者いいね (POST/DELETE /api/quests/public/[id]/comments/[commentId]/publisher-like)

```mermaid
sequenceDiagram
    participant Client
    participant API as POST /publisher-like
    participant Auth
    participant DB
    
    Client->>API: POST /publisher-like
    API->>Auth: getAuthContext()
    Auth-->>API: { db, userId }
    
    API->>DB: fetchUserInfoByUserId()
    DB-->>API: userInfo
    
    API->>API: 親ユーザ検証
    
    API->>DB: fetchPublicQuest(publicQuestId)
    DB-->>API: publicQuest
    
    API->>API: 家族メンバー検証<br/>(publicQuest.familyId === userInfo.profiles.familyId)
    
    API->>DB: likeCommentByPublisher(commentId)
    Note over DB: UPDATE<br/>is_liked_by_publisher = true
    DB-->>API: success
    
    API-->>Client: {}
    
    Note over Client,DB: DELETE /publisher-like は<br/>is_liked_by_publisher = false
```

## 10. コメント数取得 (GET /api/quests/public/[id]/comments/count)

```mermaid
sequenceDiagram
    participant Client
    participant API as GET /comments/count
    participant Auth
    participant DB
    
    Client->>API: GET /comments/count
    API->>Auth: getAuthContext()
    Auth-->>API: { db, userId }
    
    API->>DB: fetchPublicQuestCommentCount(publicQuestId)
    Note over DB: SELECT COUNT(*)<br/>FROM public_quest_comments<br/>WHERE public_quest_id = ?
    DB-->>API: count
    
    API-->>Client: { count }
```
