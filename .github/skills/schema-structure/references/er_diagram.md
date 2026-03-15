(2026年3月記載)

# データベーススキーマ ER図

## 全体構造

```mermaid
erDiagram
    %% 認証・プロフィール
    auth_users ||--o| profiles : "has"
    profiles ||--o| parents : "extends if parent"
    profiles ||--o| children : "extends if child"
    families ||--o{ profiles : "contains"
    
    %% アイコン
    icon_categories ||--o{ icons : "categorizes"
    icons ||--o{ families : "used by"
    icons ||--o{ profiles : "used by"
    
    %% 家族クエスト
    families ||--o{ family_quests : "owns"
    quest_categories ||--o{ family_quests : "categorizes"
    family_quests ||--o{ family_quest_details : "has levels"
    family_quests ||--o{ child_quests : "spawns"
    family_quests ||--o| public_quests : "can publish"
    
    %% 子供クエスト
    children ||--o{ child_quests : "receives"
    child_quests }o--|| family_quest_details : "references level"
    
    %% 公開クエスト
    public_quests ||--o{ public_quest_likes : "receives"
    public_quests ||--o{ public_quest_comments : "has"
    profiles ||--o{ public_quest_likes : "gives"
    profiles ||--o{ public_quest_comments : "posts"
    public_quest_comments ||--o{ comment_votes : "receives"
    profiles ||--o{ comment_votes : "casts"
    
    %% テンプレートクエスト
    quest_categories ||--o{ template_quests : "categorizes"
    template_quests ||--o{ template_quest_details : "has levels"
    
    %% 報酬
    families ||--o{ reward_tables : "defines"
    children ||--o{ reward_history : "receives"
    
    %% 通知・タイムライン
    profiles ||--o{ notifications : "receives"
    families ||--o{ timeline_posts : "generates"
    
    auth_users {
        uuid id PK
    }
    
    profiles {
        uuid id PK
        uuid user_id FK
        text name
        date birthday
        uuid family_id FK
        int icon_id FK
        text icon_color
        enum type
        timestamp created_at
        timestamp updated_at
    }
    
    parents {
        uuid id PK
        uuid profile_id FK
    }
    
    children {
        uuid id PK
        uuid profile_id FK
        int total_earned
        int total_savings
        int level
        int exp
    }
    
    families {
        uuid id PK
        text display_id UK
        text local_name
        text online_name
        text introduction
        int icon_id FK
        text icon_color
        text invite_code UK
        timestamp created_at
        timestamp updated_at
    }
    
    icons {
        int id PK
        text name UK
        int category_id FK
        int size
    }
    
    icon_categories {
        int id PK
        text name UK
        text icon_name
        int icon_size
        int sort_order
    }
    
    quest_categories {
        int id PK
        text name UK
        text icon_name UK
        int icon_size
        int sort_order
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
    
    family_quest_details {
        uuid id PK
        uuid family_quest_id FK
        int level
        int reward
        timestamp created_at
        timestamp updated_at
    }
    
    child_quests {
        uuid id PK
        uuid child_id FK
        uuid family_quest_detail_id FK
        enum status
        timestamp started_at
        timestamp completed_at
        timestamp reported_at
        timestamp reviewed_at
        timestamp created_at
        timestamp updated_at
    }
    
    public_quests {
        uuid id PK
        uuid family_quest_id FK
        uuid family_id FK
        boolean is_active
        int total_likes
        int total_comments
        timestamp created_at
        timestamp updated_at
    }
    
    template_quests {
        uuid id PK
        text title
        text description
        int category_id FK
        int icon_id FK
        text icon_color
        timestamp created_at
        timestamp updated_at
    }
    
    template_quest_details {
        uuid id PK
        uuid template_quest_id FK
        int level
        int reward
        timestamp created_at
        timestamp updated_at
    }
    
    public_quest_likes {
        uuid id PK
        uuid public_quest_id FK
        uuid profile_id FK
        timestamp created_at
    }
    
    public_quest_comments {
        uuid id PK
        uuid public_quest_id FK
        uuid profile_id FK
        text content
        int upvotes
        int downvotes
        boolean is_pinned
        boolean is_publisher_liked
        timestamp created_at
        timestamp updated_at
    }
    
    comment_votes {
        uuid id PK
        uuid comment_id FK
        uuid profile_id FK
        int vote
        timestamp created_at
        timestamp updated_at
    }
    
    reward_tables {
        uuid id PK
        uuid family_id FK
        int level
        int reward
        timestamp created_at
        timestamp updated_at
    }
    
    reward_history {
        uuid id PK
        uuid child_id FK
        enum reward_type
        int amount
        uuid source_id
        timestamp created_at
    }
    
    notifications {
        uuid id PK
        uuid profile_id FK
        enum notification_type
        text title
        text message
        text link
        boolean is_read
        timestamp created_at
    }
    
    timeline_posts {
        uuid id PK
        uuid family_id FK
        uuid profile_id FK
        enum action_type
        text content
        text metadata
        timestamp created_at
    }
```

## 主要なリレーション

### 1. ユーザーと家族
- `auth.users` → `profiles`: 1対1（Supabase認証からプロフィールへ）
- `profiles` → `parents` or `children`: 1対1（タイプに応じて親または子供に拡張）
- `families` → `profiles`: 1対多（家族は複数のプロフィールを持つ）

### 2. クエストのライフサイクル
- `family_quests` → `family_quest_details`: 1対多（クエストは複数のレベル詳細を持つ）
- `family_quest_details` → `child_quests`: 1対多（レベル詳細から子供クエストが生成される）
- `family_quests` → `public_quests`: 1対0..1（家族クエストは公開クエストとして公開可能）

### 3. 公開クエストのエンゲージメント
- `public_quests` → `public_quest_likes`: 1対多（公開クエストは複数のいいねを受ける）
- `public_quests` → `public_quest_comments`: 1対多（公開クエストは複数のコメントを受ける）
- `public_quest_comments` → `comment_votes`: 1対多（コメントは複数の投票を受ける）

### 4. 報酬システム
- `families` → `reward_tables`: 1対多（家族ごとのレベル別報酬テーブル）
- `children` → `reward_history`: 1対多（子供は複数の報酬履歴を持つ）

### 5. 通知とタイムライン
- `profiles` → `notifications`: 1対多（プロフィールは複数の通知を受ける）
- `families` → `timeline_posts`: 1対多（家族は複数のタイムライン投稿を生成）

## カスケード削除ルール

### restrict（削除不可）
- `families` → `profiles.family_id`: 家族にプロフィールが紐づいている場合は削除不可
- `icons` → `families.icon_id`, `profiles.icon_id`: アイコンが使用中の場合は削除不可
- `quest_categories` → 各クエストテーブル: カテゴリが使用中の場合は削除不可

### cascade（連鎖削除）
- `auth.users` → `profiles`: ユーザー削除時にプロフィールも削除
- `profiles` → `parents`, `children`: プロフィール削除時に親/子供レコードも削除
- `family_quests` → `family_quest_details`, `child_quests`: クエスト削除時に関連データも削除
- `public_quests` → `public_quest_likes`, `public_quest_comments`: 公開クエスト削除時に関連データも削除
