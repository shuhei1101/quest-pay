(2026年3月記載)

# コメント関連テーブル ER図

## コメントのデータ構造

```mermaid
erDiagram
    public_quests ||--o{ public_quest_comments : "contains"
    profiles ||--o{ public_quest_comments : "posts"
    
    public_quest_comments ||--o{ comment_upvotes : "receives votes"
    public_quest_comments ||--o{ comment_reports : "receives reports"
    
    profiles ||--o{ comment_upvotes : "votes"
    profiles ||--o{ comment_reports : "reports"
    
    public_quests {
        uuid id PK
        uuid family_id FK
        uuid quest_id FK
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    profiles {
        uuid id PK
        uuid user_id FK
        uuid family_id FK
        text name
        date birthday
        int icon_id FK
        text icon_color
        user_type type
        timestamp created_at
        timestamp updated_at
    }
    
    public_quest_comments {
        uuid id PK
        uuid public_quest_id FK
        uuid profile_id FK
        text content
        boolean is_pinned
        boolean is_liked_by_publisher
        timestamp created_at
        timestamp updated_at
    }
    
    comment_upvotes {
        uuid comment_id PK_FK
        uuid profile_id PK_FK
        comment_upvote_type type
        timestamp created_at
        timestamp updated_at
    }
    
    comment_reports {
        uuid comment_id PK_FK
        uuid profile_id PK_FK
        text reason
        timestamp created_at
        timestamp updated_at
    }
```

## 主要なリレーション

### public_quest_comments
- **public_quest_id → public_quests.id**: カスケード削除（公開クエスト削除時にコメントも削除）
- **profile_id → profiles.id**: カスケード削除（プロフィール削除時にコメントも削除）
- **制約**: 各公開クエストにつき1つのコメントのみピン留め可能 (`UNIQUE (public_quest_id) WHERE is_pinned = true`)

### comment_upvotes
- **comment_id, profile_id**: 複合主キー（1ユーザ1コメントにつき1評価）
- **profile_id → profiles.id**: カスケード削除
- **type**: 'upvote'（高評価）または 'downvote'（低評価）

### comment_reports
- **comment_id, profile_id**: 複合主キー（1ユーザ1コメントにつき1報告）
- **profile_id → profiles.id**: カスケード削除
- **reason**: 報告理由（テキスト）

## データ整合性のルール

1. **評価の排他性**: ユーザは同じコメントに対して高評価または低評価のどちらか1つのみ
2. **自己評価禁止**: コメント投稿者は自分のコメントに評価できない（アプリケーションレベルで制御）
3. **ピン留めの一意性**: 1つの公開クエストにつき1つのコメントのみピン留め可能（DB制約）
4. **家族権限**: ピン留めと公開者いいねは公開クエストの家族メンバーのみ実行可能
5. **親のみ操作**: コメント投稿、評価、報告、ピン留めは親ユーザのみ実行可能
