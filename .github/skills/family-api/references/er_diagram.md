(2026年3月記載)

# 家族関連テーブル ER図

## 家族・ユーザー・プロフィールのデータ構造

```mermaid
erDiagram
    authUsers ||--o| profiles : "has"
    families ||--o{ profiles : "belongs to"
    profiles ||--o| parents : "is"
    profiles ||--o| children : "is parent ||--o{ family_quests : "creates"
    
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
    
    profiles {
        uuid id PK
        uuid user_id FK UK
        text name
        date birthday
        uuid family_id FK
        int icon_id FK
        text icon_color
        user_type type
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
    
    authUsers {
        uuid id PK
    }
    
    icons {
        int id PK
        text name UK
        int category_id FK
        int size
    }
    
    family_follows {
        uuid id PK
        uuid family_id FK
        uuid follower_family_id FK
        timestamp created_at
        timestamp updated_at
    }
```

## リレーション概要

### 1. ユーザー認証とプロフィール
- `auth.users` → `profiles`: 1対1（ユーザーIDで紐付け）
- `profiles.user_id`: auth.usersへの外部キー、CASCADE削除
- `profiles.type`: 'parent' or 'child'（親・子供の判別）

### 2. 家族と家族メンバー
- `families` → `profiles`: 1対多（家族に複数のメンバーが所属）
- `profiles.family_id`: familiesへの外部キー、RESTRICT削除
- `families.invite_code`: 新規メンバー招待用の一意コード

### 3. プロフィールと親・子供
- `profiles` → `parents`: 1対0..1（親プロフィール）
- `profiles` → `children`: 1対0..1（子供プロフィール）
- `parents.profile_id`, `children.profile_id`: UNIQUE制約
- `parents.invite_code`, `children.invite_code`: 個別の招待コード

### 4. 家族フォロー機能
- `family_follows`: 家族間のフォロー関係
- `family_id`: フォローされる家族
- `follower_family_id`: フォローする家族
- 同一家族IDの組み合わせに対してUNIQUE制約

## 主要カラム詳細

### families
- `display_id`: 表示用識別子（UK）
- `local_name`: 家族内表示名
- `online_name`: 公開表示名（NULL可）
- `introduction`: 紹介文
- `invite_code`: 招待コード（UK）

### profiles
- `type`: `user_type` enum ('parent', 'child')
- `birthday`: 年齢計算、年齢制限クエストに使用
- アイコン: `icon_id` + `icon_color`で装飾

### children
- `min_savings`: 最低貯金額（使用制限）
- `current_savings`: 現在の貯金額
- `current_level`: レベル（報酬計算に影響）
- `total_exp`: 累計経験値
