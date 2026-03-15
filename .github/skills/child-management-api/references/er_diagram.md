(2026年3月15日 14:30記載)

# 子供管理関連テーブル ER図

## 子供管理のデータ構造

```mermaid
erDiagram
    auth_users ||--o| profiles : "has"
    families ||--o{ profiles : "contains"
    icons ||--o{ profiles : "decorates"
    profiles ||--o| children : "is"
    profiles ||--o| parents : "is"
    
    families ||--o{ children : "contains"
    children ||--o{ child_quests : "receives"
    children ||--o{ reward_history : "earns"
    
    auth_users {
        uuid id PK
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
    
    profiles {
        uuid id PK
        uuid user_id FK "auth.users"
        text name
        date birthday
        uuid family_id FK
        int icon_id FK
        text icon_color
        enum type "parent/child"
        timestamp created_at
        timestamp updated_at
    }
    
    parents {
        uuid id PK
        uuid profile_id FK UK
        text invite_code UK
        timestamp created_at
        timestamp updated_at
    }
    
    children {
        uuid id PK
        uuid profile_id FK UK
        text invite_code UK
        int min_savings
        int current_savings
        int current_level
        int total_exp
        timestamp created_at
        timestamp updated_at
    }
    
    child_quests {
        uuid id PK
        uuid child_id FK
        uuid family_quest_detail_id FK
        enum status "not_started/in_progress/pending_review/completed"
        timestamp started_at
        timestamp completed_at
        timestamp reported_at
        timestamp reviewed_at
        timestamp created_at
        timestamp updated_at
    }
    
    reward_history {
        uuid id PK
        uuid child_id FK
        enum reward_type "quest/age_monthly/level_monthly/other"
        int reward_amount
        text description
        timestamp created_at
    }
```

## テーブル間のリレーション詳細

### 1. 認証とプロフィール
- **auth.users → profiles**: 1対0..1（Supabase Auth認証情報とアプリプロフィール）
- **profiles.user_id**: auth.usersへの外部キー（カスケード削除）
- 子供アカウントは認証なし（user_id null）で登録可能

### 2. 家族とプロフィール
- **families → profiles**: 1対多（家族は複数のプロフィールを持つ）
- **profiles.family_id**: familiesへの外部キー（削除制限）
- すべてのプロフィールは1つの家族に所属

### 3. プロフィールと親/子供
- **profiles → parents**: 1対0..1（親プロフィール）
- **profiles → children**: 1対0..1（子供プロフィール）
- **profiles.type**: "parent" または "child" で区別
- 親・子供テーブルは排他的（1プロフィールは親または子供のどちらか）

### 4. 招待コード
- **families.invite_code**: 家族への参加用（親が招待）
- **children.invite_code**: 子供アカウント作成時に生成（親がログイン情報を子供に渡す）
- すべてユニーク制約あり

### 5. 子供と報酬
- **children → reward_history**: 1対多（報酬履歴）
- **children → child_quests**: 1対多（受注したクエスト）
- current_savings, total_exp, current_level は集計値

## 主要なインデックス

### プライマリキー
- id: すべてのテーブル（UUID）

### ユニークキー
- families.display_id: 家族表示ID
- families.invite_code: 家族招待コード
- profiles.user_id: 認証ユーザとの1対1関係
- parents.profile_id: プロフィールとの1対1関係
- parents.invite_code: 親招待コード
- children.profile_id: プロフィールとの1対1関係
- children.invite_code: 子供招待コード

### 外部キー（検索最適化）
- profiles.family_id: 家族メンバー検索
- profiles.icon_id: アイコン参照
- children.profile_id: 子供プロフィール参照
- reward_history.child_id: 報酬履歴検索
- child_quests.child_id: 子供のクエスト検索
