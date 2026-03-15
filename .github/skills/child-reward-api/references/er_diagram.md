(2026年3月15日 14:30記載)

# 子供報酬設定関連テーブル ER図

## 子供報酬設定のデータ構造

```mermaid
erDiagram
    children ||--o| child_age_reward_tables : "has custom age rewards"
    children ||--o| child_level_reward_tables : "has custom level rewards"
    children ||--o{ child_quests : "receives"
    
    child_age_reward_tables ||--o{ reward_by_ages : "contains"
    child_level_reward_tables ||--o{ reward_by_levels : "contains"
    
    families ||--o| family_age_reward_tables : "has default age rewards"
    families ||--o| family_level_reward_tables : "has default level rewards"
    family_age_reward_tables ||--o{ reward_by_ages : "contains"
    family_level_reward_tables ||--o{ reward_by_levels : "contains"
    
    family_quests ||--o{ family_quest_details : "has levels"
    family_quest_details ||--o{ child_quests : "spawns"
    
    children {
        uuid id PK
        uuid profile_id FK
        uuid family_id FK
        text display_name
        int total_earned
        int total_savings
        int level
        int exp
        timestamp created_at
        timestamp updated_at
    }
    
    child_age_reward_tables {
        uuid id PK
        uuid child_id FK,UK
        timestamp created_at
        timestamp updated_at
    }
    
    child_level_reward_tables {
        uuid id PK
        uuid child_id FK,UK
        timestamp created_at
        timestamp updated_at
    }
    
    reward_by_ages {
        uuid id PK
        text type "child or family"
        uuid age_reward_table_id FK
        int age "5-22 years"
        int amount
        timestamp created_at
        timestamp updated_at
    }
    
    reward_by_levels {
        uuid id PK
        text type "child or family"
        uuid level_reward_table_id FK
        int level "1-12"
        int amount
        timestamp created_at
        timestamp updated_at
    }
    
    family_age_reward_tables {
        uuid id PK
        uuid family_id FK,UK
        timestamp created_at
        timestamp updated_at
    }
    
    family_level_reward_tables {
        uuid id PK
        uuid family_id FK,UK
        timestamp created_at
        timestamp updated_at
    }
    
    families {
        uuid id PK
        text display_id UK
        text local_name
        text online_name
        int icon_id FK
        text invite_code UK
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
    }
    
    family_quest_details {
        uuid id PK
        uuid family_quest_id FK
        int level
        int reward
    }
    
    child_quests {
        uuid id PK
        uuid child_id FK
        uuid family_quest_id FK
        uuid family_quest_detail_id FK
        text status "not_started, in_progress, pending_review, completed"
        int reward_multiplier
        timestamp started_at
        timestamp reported_at
        timestamp completed_at
        timestamp reviewed_at
    }
```

## テーブル関係の説明

### 報酬設定の優先順位
1. **子供個別設定**: `child_age_reward_tables` / `child_level_reward_tables`
2. **家族デフォルト設定**: `family_age_reward_tables` / `family_level_reward_tables`
3. **システムデフォルト**: コード内で定義

### 報酬計算のフロー
1. クエスト完了時: `family_quest_details.reward` × `child_quests.reward_multiplier`
2. 報酬倍率の決定:
   - 子供個別の年齢別報酬設定を確認
   - 存在しない場合は家族の年齢別報酬設定を使用
   - 年齢に応じた倍率を適用

### 共通テーブル設計
- `reward_by_ages` と `reward_by_levels` は `type` カラムで "child" / "family" を区別
- DB操作の共通化により、コード重複を最小化
