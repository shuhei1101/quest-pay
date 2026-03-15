(2026年3月記載)

# 子供報酬API シーケンス図

## API エンドポイント一覧（再掲）

### 年齢別報酬
- `GET /api/children/[id]/reward/by-age/table`: 年齢別報酬テーブル取得
- `PUT /api/children/[id]/reward/by-age/table`: 年齢別報酬テーブル更新

### レベル別報酬
- `GET /api/children/[id]/reward/by-level/table`: レベル別報酬テーブル取得
- `PUT /api/children/[id]/reward/by-level/table`: レベル別報酬テーブル更新

## GET /api/children/[id]/reward/by-age/table（年齢別報酬テーブル取得）

```mermaid
sequenceDiagram
    participant C as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Service as Service Layer
    participant Query as Query Layer
    participant DB as Database
    participant Logger as Logger
    
    C->>API: GET /api/children/[id]/reward/by-age/table
    
    API->>Logger: info: 年齢別報酬テーブル取得開始
    API->>Auth: ユーザー認証確認
    Auth-->>API: ユーザーID
    
    API->>Auth: 親権限確認<br/>fetchUserInfoByUserId
    Auth->>DB: SELECT profiles WHERE id = userId
    DB-->>Auth: profile.type
    
    alt 親ではない
        Auth-->>API: type !== "parent"
        API-->>C: 400 Bad Request<br/>"親のみアクセス可能です。"
    end
    
    Auth-->>API: 親ユーザー確認OK
    
    API->>Service: getOrCreateChildAgeRewardTable({db, childId})
    Service->>Query: fetchChildAgeRewardTable({db, childId})
    Query->>DB: SELECT * FROM child_age_reward_tables<br/>WHERE child_id = ?
    DB-->>Query: table or null
    
    alt テーブルが存在しない
        Query-->>Service: null
        Service->>DB: BEGIN TRANSACTION
        Service->>DB: INSERT INTO child_age_reward_tables<br/>(child_id)
        DB-->>Service: table.id
        Service->>DB: INSERT INTO reward_by_ages<br/>(type="child", age=5-22, amount)
        DB-->>Service: 挿入完了
        Service->>DB: COMMIT
    end
    
    Service-->>API: table
    API->>Query: fetchAgeRewards({db, ageRewardTableId, type="child"})
    Query->>DB: SELECT * FROM reward_by_ages<br/>WHERE type="child"<br/>AND age_reward_table_id = ?<br/>ORDER BY age ASC
    DB-->>Query: rewards[]
    Query-->>API: rewards
    
    API->>Logger: info: 年齢別報酬テーブル取得完了
    API-->>C: 200 OK<br/>{ageRewardTable: {table, rewards}}
```

## PUT /api/children/[id]/reward/by-age/table（年齢別報酬テーブル更新）

```mermaid
sequenceDiagram
    participant C as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Validate as バリデーション
    participant Service as Service Layer
    participant DB as Database
    participant Logger as Logger
    
    C->>API: PUT /api/children/[id]/reward/by-age/table<br/>{rewards: [{age: 5, amount: 100}, ...]}
    
    API->>Logger: info: 年齢別報酬テーブル更新開始
    API->>Auth: ユーザー認証確認（親のみ）
    Auth->>DB: SELECT profiles WHERE id = userId
    DB-->>Auth: profile.type
    
    alt 親ではない
        Auth-->>API: type !== "parent"
        API-->>C: 400 Bad Request
    end
    
    Auth-->>API: 親ユーザー確認OK
    
    API->>Validate: リクエストボディ検証<br/>PutChildAgeRewardTableRequestSchema
    
    alt バリデーションエラー
        Validate-->>API: Zod validation error
        API-->>C: 400 Bad Request<br/>{message, errors}
    end
    
    Validate-->>API: 検証OK: {rewards}
    
    API->>Service: getOrCreateChildAgeRewardTable({db, childId})
    Service->>DB: SELECT or INSERT child_age_reward_tables
    DB-->>Service: table
    Service-->>API: table
    
    API->>Service: updateAgeRewards({db, ageRewardTableId, rewards, type="child"})
    Service->>DB: BEGIN TRANSACTION
    
    loop 各年齢の報酬
        Service->>DB: UPDATE reward_by_ages<br/>SET amount = ?<br/>WHERE type="child"<br/>AND age_reward_table_id = ?<br/>AND age = ?
        DB-->>Service: 更新完了
    end
    
    Service->>DB: COMMIT
    DB-->>Service: トランザクション完了
    Service-->>API: 更新完了
    
    API->>Logger: info: 年齢別報酬テーブル更新完了
    API-->>C: 200 OK<br/>{}
```

## GET /api/children/[id]/reward/by-level/table（レベル別報酬テーブル取得）

```mermaid
sequenceDiagram
    participant C as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Service as Service Layer
    participant Query as Query Layer
    participant DB as Database
    participant Logger as Logger
    
    C->>API: GET /api/children/[id]/reward/by-level/table
    
    API->>Logger: info: レベル別報酬テーブル取得開始
    API->>Auth: ユーザー認証確認（親のみ）
    Auth->>DB: SELECT profiles WHERE id = userId
    DB-->>Auth: profile.type
    Auth-->>API: 親ユーザー確認OK
    
    API->>Service: getOrCreateChildLevelRewardTable({db, childId})
    Service->>Query: fetchChildLevelRewardTable({db, childId})
    Query->>DB: SELECT * FROM child_level_reward_tables<br/>WHERE child_id = ?
    DB-->>Query: table or null
    
    alt テーブルが存在しない
        Query-->>Service: null
        Service->>DB: BEGIN TRANSACTION
        Service->>DB: INSERT INTO child_level_reward_tables<br/>(child_id)
        DB-->>Service: table.id
        Service->>DB: INSERT INTO reward_by_levels<br/>(type="child", level=1-12, amount)
        DB-->>Service: 挿入完了
        Service->>DB: COMMIT
    end
    
    Service-->>API: table
    API->>Query: fetchLevelRewards({db, levelRewardTableId, type="child"})
    Query->>DB: SELECT * FROM reward_by_levels<br/>WHERE type="child"<br/>AND level_reward_table_id = ?<br/>ORDER BY level ASC
    DB-->>Query: rewards[]
    Query-->>API: rewards
    
    API->>Logger: info: レベル別報酬テーブル取得完了
    API-->>C: 200 OK<br/>{levelRewardTable: {table, rewards}}
```

## PUT /api/children/[id]/reward/by-level/table（レベル別報酬テーブル更新）

```mermaid
sequenceDiagram
    participant C as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Validate as バリデーション
    participant Service as Service Layer
    participant DB as Database
    participant Logger as Logger
    
    C->>API: PUT /api/children/[id]/reward/by-level/table<br/>{rewards: [{level: 1, amount: 50}, ...]}
    
    API->>Logger: info: レベル別報酬テーブル更新開始
    API->>Auth: ユーザー認証確認（親のみ）
    Auth->>DB: SELECT profiles WHERE id = userId
    DB-->>Auth: profile.type
    Auth-->>API: 親ユーザー確認OK
    
    API->>Validate: リクエストボディ検証<br/>PutChildLevelRewardTableRequestSchema
    Validate-->>API: 検証OK: {rewards}
    
    API->>Service: getOrCreateChildLevelRewardTable({db, childId})
    Service->>DB: SELECT or INSERT child_level_reward_tables
    DB-->>Service: table
    Service-->>API: table
    
    API->>Service: updateLevelRewards({db, levelRewardTableId, rewards, type="child"})
    Service->>DB: BEGIN TRANSACTION
    
    loop 各レベルの報酬
        Service->>DB: UPDATE reward_by_levels<br/>SET amount = ?<br/>WHERE type="child"<br/>AND level_reward_table_id = ?<br/>AND level = ?
        DB-->>Service: 更新完了
    end
    
    Service->>DB: COMMIT
    DB-->>Service: トランザクション完了
    Service-->>API: 更新完了
    
    API->>Logger: info: レベル別報酬テーブル更新完了
    API-->>C: 200 OK<br/>{}
```

## 報酬計算ロジック（クエスト完了時）

```mermaid
sequenceDiagram
    participant Quest as クエスト承認API
    participant Service as Reward Service
    participant Query as Query Layer
    participant DB as Database
    
    Quest->>Service: calculateReward({childId, baseReward})
    
    Service->>Query: fetchChildAgeRewardTable({db, childId})
    Query->>DB: SELECT child_age_reward_tables<br/>WHERE child_id = ?
    DB-->>Query: table or null
    
    alt 子供個別設定あり
        Query-->>Service: childTable
        Service->>Query: fetchAgeRewards({db, tableId, type="child"})
        Query->>DB: SELECT reward_by_ages<br/>WHERE type="child"<br/>AND age_reward_table_id = ?
        DB-->>Query: childRewards
        Query-->>Service: childRewards
    else 子供個別設定なし
        Query-->>Service: null
        Service->>Query: fetchFamilyAgeRewardTable({db, familyId})
        Query->>DB: SELECT family_age_reward_tables<br/>WHERE family_id = ?
        DB-->>Query: familyTable
        Query-->>Service: familyTable
        Service->>Query: fetchAgeRewards({db, tableId, type="family"})
        Query->>DB: SELECT reward_by_ages<br/>WHERE type="family"<br/>AND age_reward_table_id = ?
        DB-->>Query: familyRewards
        Query-->>Service: familyRewards
    end
    
    Service->>Service: 子供の現在年齢取得
    Service->>Service: 年齢に対応する倍率取得<br/>（見つからない場合1.0）
    Service->>Service: 最終報酬 = baseReward × 倍率
    
    Service-->>Quest: finalReward
    Quest->>DB: INSERT INTO reward_history<br/>(child_id, amount, ...)
    DB-->>Quest: 報酬記録完了
```
