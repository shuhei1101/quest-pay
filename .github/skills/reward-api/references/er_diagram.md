(2026年3月記載)

# 報酬関連テーブル ER図

## 報酬システムのデータ構造

```mermaid
erDiagram
    children ||--o{ reward_histories : "receives"
    quest_children ||--o{ reward_histories : "generates"
    quest_details ||--|| reward_histories : "defines amount"
    profiles ||--o{ children : "has"
    families ||--o{ children : "belongs to"
    
    reward_by_ages ||--|| family_age_reward_tables : "family_config"
    reward_by_ages ||--|| child_age_reward_tables : "child_config"
    reward_by_levels ||--|| family_level_reward_tables : "family_config"
    reward_by_levels ||--|| child_level_reward_tables : "child_config"
    
    children {
        uuid id PK
        uuid profile_id FK
        text invite_code UK
        int min_savings
        int current_savings
        int current_level
        int total_exp
        timestamp created_at
        timestamp updated_at
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
    
    reward_histories {
        uuid id PK
        uuid child_id FK
        enum type
        text title
        int amount
        int exp
        timestamp rewarded_at
        date scheduled_payment_date
        boolean is_paid
        timestamp paid_at
        text url
        timestamp created_at
        timestamp updated_at
    }
    
    quest_children {
        uuid id PK
        uuid family_quest_id FK
        uuid child_id FK
        int level
        enum status
        text request_message
        uuid last_approved_by FK
        int current_completion_count
        int current_clear_count
        boolean is_activate
        timestamp status_updated_at
        timestamp created_at
        timestamp updated_at
    }
    
    quest_details {
        uuid id PK
        uuid quest_id FK
        int level
        text success_condition
        int required_completion_count
        int reward
        int child_exp
        int required_clear_count
        timestamp created_at
        timestamp updated_at
    }
    
    reward_by_ages {
        uuid id PK
        enum type
        uuid age_reward_table_id FK
        int age
        int amount
        timestamp created_at
        timestamp updated_at
    }
    
    reward_by_levels {
        uuid id PK
        enum type
        uuid level_reward_table_id FK
        int level
        int amount
        timestamp created_at
        timestamp updated_at
    }
    
    family_age_reward_tables {
        uuid id PK
        uuid family_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    child_age_reward_tables {
        uuid id PK
        uuid child_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    family_level_reward_tables {
        uuid id PK
        uuid family_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    child_level_reward_tables {
        uuid id PK
        uuid child_id FK
        timestamp created_at
        timestamp updated_at
    }
```

## 主要なリレーション

### 報酬履歴
- `reward_histories.child_id` → `children.id`: 報酬を受け取る子供
- `reward_histories.url`: クエスト完了時はクエスト詳細URLを参照

### 子供テーブル
- `children.profile_id` → `profiles.id`: 子供のプロフィール情報
- `children.current_savings`: 現在の貯金額（報酬付与時に加算）
- `children.total_exp`: 総獲得経験値（報酬付与時に加算）
- `children.current_level`: 現在のレベル（経験値に基づき計算、TODO実装）

### クエスト子供
- `quest_children.child_id` → `children.id`: クエスト受注子供
- `quest_children.current_completion_count`: 現在の達成回数
- `quest_children.current_clear_count`: 現在のクリア回数
- `quest_children.level`: クエストの現在レベル（1-5）

### クエスト詳細
- `quest_details.reward`: 報酬額（承認時に付与）
- `quest_details.child_exp`: 獲得経験値（承認時に付与）
- `quest_details.required_completion_count`: 必要達成回数
- `quest_details.required_clear_count`: 次レベルに必要なクリア回数（nullの場合は最大レベル）

### 報酬テーブル
- `reward_by_ages.type`: "family" | "child" で家族/子供設定を区別
- `reward_by_levels.type`: "family" | "child" | "template" で設定タイプを区別
- `reward_by_ages.age_reward_table_id`: 対応する報酬テーブルマスタへの参照
- `reward_by_levels.level_reward_table_id`: 対応する報酬テーブルマスタへの参照

## 報酬タイプ（reward_type enum）

```typescript
type RewardType = 
  | "quest"                   // クエスト達成
  | "quest_level_up"          // クエストレベルアップ
  | "level_up"                // 子供レベルアップ
  | "age_monthly"             // 年齢別定期報酬（rewardByAges）
  | "level_monthly"           // レベル別定期報酬（rewardByLevels）
  | "child_day"               // こどもの日
  | "quest_like_milestone"    // お気に入り数突破
  | "child_birthday"          // 子供の誕生日
  | "other"                   // その他
```
