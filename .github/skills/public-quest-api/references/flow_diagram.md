(2026年3月15日 14:30記載)

# 公開クエスト機能フロー図

## クエスト公開から採用までのライフサイクル

```mermaid
flowchart TD
    Start([家族クエスト作成済み]) --> CheckPublish{公開する?}
    
    CheckPublish -->|Yes| Publish[POST /api/quests/family/:id/publish]
    CheckPublish -->|No| End1([非公開のまま])
    
    Publish --> CreatePublicQuest[public_quests作成<br/>is_active: true<br/>likes_count: 0<br/>comments_count: 0]
    CreatePublicQuest --> PublicActive[公開中]
    
    PublicActive --> Discovery{他家族が発見}
    
    Discovery -->|いいね| LikeFlow[いいね処理フロー<br/>へ遷移]
    Discovery -->|コメント| CommentFlow[コメント処理フロー<br/>へ遷移]
    Discovery -->|採用| Adopt[採用処理<br/>family_questsにコピー]
    Discovery -->|閲覧のみ| Discovery
    
    LikeFlow --> PublicActive
    CommentFlow --> PublicActive
    Adopt --> AdoptersQuest[採用家族の<br/>家族クエストとして登録]
    
    PublicActive --> DeactivateCheck{公開者が非公開化?}
    DeactivateCheck -->|Yes| Deactivate[POST /api/quests/public/:id/deactivate<br/>is_active: false]
    DeactivateCheck -->|No| PublicActive
    
    Deactivate --> InactiveState[非公開状態<br/>一覧に表示されない]
    InactiveState --> ReactivateCheck{再公開?}
    
    ReactivateCheck -->|Yes| Reactivate[POST /api/quests/public/:id/activate<br/>is_active: true]
    ReactivateCheck -->|No| End2([非公開のまま])
    
    Reactivate --> PublicActive
    
    AdoptersQuest --> End3([採用家族で利用])
    
    style Start fill:#e1f5e1
    style End1 fill:#ffe1e1
    style End2 fill:#ffe1e1
    style End3 fill:#b8daff
    style PublicActive fill:#c3e6cb
```

## いいね処理フロー

```mermaid
flowchart TD
    UserView([ユーザーが公開クエスト閲覧]) --> CheckLiked{既にいいね済み?}
    
    CheckLiked -->|No| Like[POST /api/quests/public/:id/like]
    CheckLiked -->|Yes| Unlike[POST /api/quests/public/:id/like/cancel]
    
    Like --> CheckDuplicate{重複チェック}
    CheckDuplicate -->|重複なし| CreateLike[public_quest_likes作成]
    CheckDuplicate -->|重複あり| Error1[409 Conflict]
    
    CreateLike --> IncrementCount[likes_count++]
    IncrementCount --> Success1[200 OK]
    
    Unlike --> FindLike{いいね記録検索}
    FindLike -->|見つかった| DeleteLike[public_quest_likes削除]
    FindLike -->|見つからない| Error2[404 Not Found]
    
    DeleteLike --> DecrementCount[likes_count--]
    DecrementCount --> Success2[200 OK]
    
    Success1 --> Refresh[クライアント画面更新]
    Success2 --> Refresh
    Error1 --> End1([エラー表示])
    Error2 --> End2([エラー表示])
    
    Refresh --> End3([完了])
    
    style Success1 fill:#c3e6cb
    style Success2 fill:#c3e6cb
    style Error1 fill:#f5c6cb
    style Error2 fill:#f5c6cb
```

## コメント投稿・管理フロー

```mermaid
flowchart TD
    Start([ユーザーがコメント画面表示]) --> LoadComments[GET /api/quests/public/:id/comments]
    LoadComments --> DisplayComments[コメント一覧表示<br/>ピン留め優先]
    
    DisplayComments --> UserAction{ユーザー操作}
    
    UserAction -->|新規投稿| PostComment[POST /api/quests/public/:id/comments]
    UserAction -->|編集| EditComment[PUT /api/quests/public/:id/comments/:commentId]
    UserAction -->|削除| DeleteComment[DELETE /api/quests/public/:id/comments/:commentId]
    UserAction -->|高評価| Upvote[POST /api/quests/public/:id/comments/:commentId/upvote]
    UserAction -->|低評価| Downvote[POST /api/quests/public/:id/comments/:commentId/downvote]
    UserAction -->|報告| Report[POST /api/quests/public/:id/comments/:commentId/report]
    UserAction -->|ピン留め| Pin[POST /api/quests/public/:id/comments/:commentId/pin]
    UserAction -->|公開者いいね| PublisherLike[POST /api/quests/public/:id/comments/:commentId/publisher-like]
    
    PostComment --> ValidateContent{入力検証}
    ValidateContent -->|OK| CreateComment[public_quest_comments作成]
    ValidateContent -->|NG| Error1[400 Bad Request]
    
    CreateComment --> IncrementCommentCount[comments_count++]
    IncrementCommentCount --> Success1[201 Created]
    
    EditComment --> CheckOwner1{投稿者本人?}
    CheckOwner1 -->|Yes| UpdateComment[コメント更新]
    CheckOwner1 -->|No| Error2[403 Forbidden]
    UpdateComment --> Success2[200 OK]
    
    DeleteComment --> CheckOwner2{投稿者本人 or<br/>公開者 or<br/>管理者?}
    CheckOwner2 -->|Yes| SoftDelete[deleted_at設定]
    CheckOwner2 -->|No| Error3[403 Forbidden]
    SoftDelete --> DecrementCommentCount[comments_count--]
    DecrementCommentCount --> Success3[200 OK]
    
    Upvote --> IncrementUpvote[upvotes++]
    IncrementUpvote --> Success4[200 OK]
    
    Downvote --> IncrementDownvote[downvotes++]
    IncrementDownvote --> Success5[200 OK]
    
    Report --> SetReported[is_reported: true]
    SetReported --> Success6[200 OK]
    
    Pin --> CheckPublisher1{クエスト公開者?}
    CheckPublisher1 -->|Yes| TogglePin[is_pinned トグル]
    CheckPublisher1 -->|No| Error4[403 Forbidden]
    TogglePin --> Success7[200 OK]
    
    PublisherLike --> CheckPublisher2{クエスト公開者?}
    CheckPublisher2 -->|Yes| TogglePublisherLike[publisher_liked トグル]
    CheckPublisher2 -->|No| Error5[403 Forbidden]
    TogglePublisherLike --> Success8[200 OK]
    
    Success1 --> Reload[コメント一覧再取得]
    Success2 --> Reload
    Success3 --> Reload
    Success4 --> Reload
    Success5 --> Reload
    Success6 --> Reload
    Success7 --> Reload
    Success8 --> Reload
    
    Reload --> DisplayComments
    
    Error1 --> End([エラー表示])
    Error2 --> End
    Error3 --> End
    Error4 --> End
    Error5 --> End
    
    style Success1 fill:#c3e6cb
    style Success2 fill:#c3e6cb
    style Success3 fill:#c3e6cb
    style Success4 fill:#c3e6cb
    style Success5 fill:#c3e6cb
    style Success6 fill:#c3e6cb
    style Success7 fill:#c3e6cb
    style Success8 fill:#c3e6cb
    style Error1 fill:#f5c6cb
    style Error2 fill:#f5c6cb
    style Error3 fill:#f5c6cb
    style Error4 fill:#f5c6cb
    style Error5 fill:#f5c6cb
```

## モデレーション権限マトリクス

| 操作 | 投稿者本人 | クエスト公開者 | 他家族 | 管理者 |
|------|-----------|--------------|--------|--------|
| コメント投稿 | ✅ | ✅ | ✅ | ✅ |
| コメント編集 | ✅ | ❌ | ❌ | ✅ |
| コメント削除 | ✅ | ✅ | ❌ | ✅ |
| 高評価/低評価 | ✅ | ✅ | ✅ | ✅ |
| コメント報告 | ✅ | ✅ | ✅ | ✅ |
| ピン留め | ❌ | ✅ | ❌ | ✅ |
| 公開者いいね | ❌ | ✅ | ❌ | ✅ |
| クエスト非公開化 | ❌ | ✅ | ❌ | ✅ |

## ステータス管理

### 公開クエストステータス
```mermaid
stateDiagram-v2
    [*] --> draft: 家族クエストのみ存在
    
    draft --> active: 公開処理<br/>(is_active: true)
    
    active --> inactive: 非公開化<br/>(is_active: false)
    
    inactive --> active: 再公開<br/>(is_active: true)
    
    active --> [*]: 家族クエスト削除時
    inactive --> [*]: 家族クエスト削除時
    
    note right of draft
        public_questsレコードなし
        家族内でのみ利用可能
    end note
    
    note right of active
        is_active: true
        一覧に表示
        いいね・コメント可能
    end note
    
    note right of inactive
        is_active: false
        一覧に非表示
        いいね・コメント不可
    end note
```
