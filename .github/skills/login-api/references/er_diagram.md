(2026年3月記載)

# ログイン・認証関連テーブル ER図

## 認証とユーザー管理のデータ構造

```mermaid
erDiagram
    auth_users ||--o| profiles : "has"
    families ||--o{ profiles : "contains"
    profiles ||--o| parents : "extends"
    profiles ||--o| children : "extends"
    icons ||--o{ profiles : "decorates"
    
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
    
    profiles {
        uuid id PK
        uuid user_id UK "FK → auth.users"
        text name
        date birthday
        uuid family_id FK "→ families"
        int icon_id FK "→ icons"
        text icon_color
        enum type "parent | child"
        timestamp created_at
        timestamp updated_at
    }
    
    parents {
        uuid id PK
        uuid profile_id UK "FK → profiles ON DELETE RESTRICT"
        text invite_code UK
        timestamp created_at
        timestamp updated_at
    }
    
    children {
        uuid id PK
        uuid profile_id UK "FK → profiles ON DELETE RESTRICT"
        text invite_code UK
        int min_savings
        int current_savings
        int current_level
        int total_exp
        timestamp created_at
        timestamp updated_at
    }
    
    icons {
        int id PK
        text name UK
        int category_id FK
        int size
    }
```

## テーブル関係性

### 認証フロー
1. **Supabase認証**: `auth.users` テーブルにユーザー登録
2. **プロフィール作成**: `profiles` テーブルに基本情報登録
3. **ロール拡張**: `parents` または `children` テーブルに詳細情報登録

### リレーション詳細

#### auth.users → profiles (1対0..1)
- `profiles.user_id` = `auth.users.id`
- 初回ログイン時は `profiles` レコードなし
- タイプ選択後に `profiles` レコード作成

#### profiles → parents/children (1対0..1)
- `profiles.type` により、`parents` または `children` のどちらかのみ存在
- `parents.profile_id` = `profiles.id` (親の場合)
- `children.profile_id` = `profiles.id` (子の場合)

#### families → profiles (1対多)
- 1つの家族に複数のプロフィール（親・子）が所属
- 招待コード (`families.invite_code`) 経由で家族に参加

## 招待コード関連

### 家族招待コード
- `families.invite_code`: 家族全体の招待コード（既存家族への親/子参加時に使用）

### 個別招待コード
- `parents.invite_code`: 親個別の招待コード
- `children.invite_code`: 子個別の招待コード

## セッション管理

- Supabaseの組み込みセッション管理を使用
- `auth.users` テーブルで認証状態を管理
- クライアント側: `@supabase/supabase-js` でセッション取得
