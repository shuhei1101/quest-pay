(2026年3月記載)

# クエスト閲覧 統合ER図

## クエストビュー統合のデータ構造

```mermaid
erDiagram
    %% 家族クエスト系
    families ||--o{ family_quests : "owns"
    parents ||--o{ family_quests : "creates"
    family_quests ||--o{ family_quest_details : "has levels"
    family_quest_details ||--o{ child_quests : "spawns"
    children ||--o{ child_quests : "owns"
    
    %% 公開クエスト系
    family_quests ||--o| public_quests : "can publish"
    families ||--o{ public_quests : "publishes"
    public_quests ||--o{ public_quest_likes : "receives likes"
    public_quests ||--o{ public_quest_comments : "has comments"
    profiles ||--o{ public_quest_likes : "likes"
    profiles ||--o{ public_quest_comments : "comments"
    
    %% テンプレートクエスト系
    template_quests ||--o{ template_quest_details : "has levels"
    
    %% 共通要素
    quest_categories ||--o{ family_quests : "categorizes"
    quest_categories ||--o{ template_quests : "categorizes"
    icons ||--o{ family_quests : "decorates"
    icons ||--o{ template_quests : "decorates"
    icons ||--o{ families : "represents"
    quest_tags ||--o{ family_quest_tags : "tags"
    quest_tags ||--o{ template_quest_tags : "tags"
    family_quests ||--o{ family_quest_tags : "tagged by"
    template_quests ||--o{ template_quest_tags : "tagged by"
    
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
        uuid quest_id FK
        int category_id FK
        int icon_id FK
        text icon_color
        enum icon_size
        timestamp created_at
        timestamp updated_at
    }
    
    family_quest_details {
        uuid id PK
        uuid family_quest_id FK
        int level
        text success_condition
        int reward
        int child_exp
        timestamp created_at
        timestamp updated_at
    }
    
    child_quests {
        uuid id PK
        uuid child_id FK
        uuid family_quest_detail_id FK
        enum status
        text completion_note
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
        int total_adoptions
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
        text comment
        timestamp created_at
        timestamp updated_at
    }
    
    template_quests {
        uuid id PK
        uuid quest_id FK
        int category_id FK
        int icon_id FK
        text icon_color
        enum icon_size
        boolean is_official
        timestamp created_at
        timestamp updated_at
    }
    
    template_quest_details {
        uuid id PK
        uuid template_quest_id FK
        int level
        text success_condition
        int reward
        int child_exp
        timestamp created_at
        timestamp updated_at
    }
    
    children {
        uuid id PK
        uuid profile_id FK
        uuid family_id FK
        int total_earned
        int total_savings
        int level
        int exp
        timestamp created_at
        timestamp updated_at
    }
    
    profiles {
        uuid id PK
        text display_name
        text avatar_url
        timestamp created_at
        timestamp updated_at
    }
    
    quest_categories {
        int id PK
        text name UK
        text icon_name UK
        int sort_order
    }
    
    icons {
        int id PK
        text name UK
        int category_id FK
        int sort_order
    }
    
    quest_tags {
        int id PK
        text name UK
        int sort_order
    }
    
    family_quest_tags {
        uuid family_quest_id FK
        int tag_id FK
    }
    
    template_quest_tags {
        uuid template_quest_id FK
        int tag_id FK
    }
```

## ビュー統合の概念モデル

```mermaid
graph TB
    subgraph "クエストビュー統合"
        UnifiedView[統合クエストビュー]
        UnifiedView --> FamilyView[家族クエストビュー]
        UnifiedView --> PublicView[公開クエストビュー]
        UnifiedView --> TemplateView[テンプレートビュー]
        UnifiedView --> ChildView[子供クエストビュー]
    end
    
    subgraph "データソース"
        FamilyView --> FamilyData[(family_quests<br/>+ details)]
        PublicView --> PublicData[(public_quests<br/>+ family_quests)]
        TemplateView --> TemplateData[(template_quests<br/>+ details)]
        ChildView --> ChildData[(child_quests<br/>+ family_quest_details)]
    end
    
    subgraph "共通要素"
        FamilyData --> QuestInfo[quests]
        PublicData --> QuestInfo
        TemplateData --> QuestInfo
        ChildData --> QuestInfo
        
        FamilyData --> IconInfo[icons]
        PublicData --> IconInfo
        TemplateData --> IconInfo
        
        FamilyData --> CategoryInfo[quest_categories]
        PublicData --> CategoryInfo
        TemplateData --> CategoryInfo
        
        FamilyData --> TagInfo[quest_tags]
        PublicData --> TagInfo
        TemplateData --> TagInfo
    end
    
    style UnifiedView fill:#e1f5e1
    style FamilyView fill:#fff3cd
    style PublicView fill:#cfe2ff
    style TemplateView fill:#f8d7da
    style ChildView fill:#d1ecf1
```

## 共通フィールド構造

各クエストタイプの閲覧ビューは以下の共通構造を持つ：

| フィールド | 家族 | 公開 | テンプレート | 子供 | 説明 |
|-----------|-----|-----|-------------|-----|------|
| base | ✓ | ✓ | ✓ | ✓ | 基本情報（ID、更新日時等） |
| quest | ✓ | ✓ | ✓ | ✓ | クエスト詳細（タイトル、説明等） |
| details | ✓ | ✓ | ✓ | ✓ | レベル別詳細（報酬、経験値等） |
| icon | ✓ | ✓ | ✓ | ✓ | アイコン情報（名前、サイズ、色） |
| category | ✓ | ✓ | ✓ | ✓ | カテゴリ情報 |
| tags | ✓ | ✓ | ✓ | - | タグ一覧 |
| familyIcon | - | ✓ | - | - | 公開元家族のアイコン |
| childQuestStatus | - | - | - | ✓ | 子供クエストのステータス情報 |
| likes | - | ✓ | - | - | いいね関連情報 |
| comments | - | ✓ | - | - | コメント関連情報 |
