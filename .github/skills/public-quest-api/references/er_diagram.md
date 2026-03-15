(2026年3月15日 14:30記載)

# 公開クエスト関連テーブル ER図

## 公開クエストのデータ構造

```mermaid
erDiagram
    families ||--o{ family_quests : "creates"
    families ||--o{ public_quests : "publishes"
    family_quests ||--o| public_quests : "can be published"
    
    public_quests ||--o{ public_quest_likes : "receives"
    public_quests ||--o{ public_quest_comments : "contains"
    families ||--o{ public_quest_likes : "gives"
    families ||--o{ public_quest_comments : "posts"
    
    families {
        uuid id PK
        text display_id UK
        text local_name
        text online_name
        int icon_id FK
        text invite_code UK
        timestamp created_at
        timestamp updated_at
    }
    
    family_quests {
        uuid id PK
        uuid family_id FK
        uuid parent_id FK
        text title
        text description
        int category_id FK
        int icon_id FK
        text icon_color
        timestamp created_at
        timestamp updated_at
    }
    
    public_quests {
        uuid id PK
        uuid family_quest_id FK UK
        uuid family_id FK
        text title
        text description
        int category_id FK
        int icon_id FK
        text icon_color
        jsonb levels
        boolean is_active
        int likes_count
        int comments_count
        timestamp created_at
        timestamp updated_at
    }
    
    public_quest_likes {
        uuid id PK
        uuid public_quest_id FK
        uuid family_id FK
        timestamp created_at
    }
    
    public_quest_comments {
        uuid id PK
        uuid public_quest_id FK
        uuid family_id FK
        text content
        int upvotes
        int downvotes
        boolean is_pinned
        boolean is_reported
        boolean publisher_liked
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
```

## 主要リレーション

### 公開元管理
- `family_quests.id` ← `public_quests.family_quest_id` (1:0..1)
  - 家族クエストは0個または1個の公開クエストを持つ
  - 重複公開を防止（UK制約）

### 所有権管理
- `families.id` ← `public_quests.family_id` (1:N)
  - どの家族が公開したかを追跡
  - 公開者のみが非公開化可能

### いいね機能
- `public_quests.id` ← `public_quest_likes.public_quest_id` (1:N)
- `families.id` ← `public_quest_likes.family_id` (1:N)
  - 1家族が1クエストに1いいねのみ（UK制約: public_quest_id + family_id）
  - likes_countでカウンタキャッシュ

### コメント機能
- `public_quests.id` ← `public_quest_comments.public_quest_id` (1:N)
- `families.id` ← `public_quest_comments.family_id` (1:N)
  - コメント投稿者を追跡
  - comments_countでカウンタキャッシュ
  - deleted_atでソフトデリート

## インデックス戦略

### public_quests
- `idx_public_quests_family_quest_id`: family_quest_id（UK）
- `idx_public_quests_family_id`: family_id（公開者検索）
- `idx_public_quests_category_id`: category_id（カテゴリ検索）
- `idx_public_quests_is_active`: is_active（アクティブフィルタ）
- `idx_public_quests_likes_count`: likes_count（人気順ソート）
- `idx_public_quests_created_at`: created_at（新着順ソート）

### public_quest_likes
- `idx_public_quest_likes_public_quest_id`: public_quest_id（クエスト別いいね取得）
- `uk_public_quest_likes_quest_family`: (public_quest_id, family_id)（重複防止）

### public_quest_comments
- `idx_public_quest_comments_public_quest_id`: public_quest_id（クエスト別コメント取得）
- `idx_public_quest_comments_family_id`: family_id（投稿者別コメント）
- `idx_public_quest_comments_is_pinned`: is_pinned（ピン留めコメント）
- `idx_public_quest_comments_created_at`: created_at（時系列ソート）
