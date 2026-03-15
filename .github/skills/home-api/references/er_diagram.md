(2026年3月記載)

# ホームダッシュボード関連テーブル ER図

## ダッシュボードデータ構造

```mermaid
erDiagram
    families ||--o{ children : "has"
    families ||--o{ family_quests : "owns"
    families ||--o{ notifications : "receives"
    families ||--o{ timeline_posts : "posts"
    
    children ||--o{ child_quests : "receives"
    children ||--o{ reward_history : "earns"
    
    family_quests ||--o{ family_quest_details : "has levels"
    family_quest_details ||--o{ child_quests : "spawns"
    
    family_quests ||--o{ timeline_posts : "generates"
    child_quests ||--o{ timeline_posts : "triggers"
    
    notifications }o--|| children : "targets"
    notifications }o--|| parents : "targets"
    
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
    
    children {
        uuid id PK
        uuid family_id FK
        uuid profile_id FK
        text display_name
        int total_earned
        int total_savings
        int level
        int exp
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
        uuid family_quest_id FK
        uuid family_quest_detail_id FK
        text status
        timestamp started_at
        timestamp reported_at
        timestamp completed_at
        timestamp reviewed_at
        timestamp created_at
        timestamp updated_at
    }
    
    notifications {
        uuid id PK
        uuid family_id FK
        uuid recipient_id FK
        text type
        text title
        text message
        jsonb metadata
        boolean is_read
        timestamp created_at
        timestamp updated_at
    }
    
    timeline_posts {
        uuid id PK
        uuid family_id FK
        uuid child_id FK
        uuid quest_id FK
        text post_type
        text content
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }
    
    reward_history {
        uuid id PK
        uuid child_id FK
        uuid quest_id FK
        int reward_amount
        int balance_after
        text reward_type
        timestamp created_at
    }
```

## 主要リレーション

### 統計データ集約
- **家族メンバー数**: `families` → `children` (count)
- **進行中クエスト**: `child_quests` (status: in_progress) (count)
- **完了待ちクエスト**: `child_quests` (status: pending_review) (count)
- **未読通知**: `notifications` (is_read: false) (count)

### 最近のアクティビティ
- **最近のクエスト**: `child_quests` (ORDER BY updated_at DESC)
- **最近の通知**: `notifications` (ORDER BY created_at DESC)
- **タイムライン**: `timeline_posts` (ORDER BY created_at DESC)

### 子供別サマリー
- **獲得報酬**: `children.total_earned`
- **貯金額**: `children.total_savings`
- **レベル**: `children.level`, `children.exp`
- **進行中クエスト**: `child_quests` (status: in_progress) by child_id
