(2026年3月記載)

# 子供管理API シーケンス図

## 1. GET /api/children - 子供一覧取得

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Route as route.ts<br/>GET handler
    participant Auth as 認証<br/>getAuthContext
    participant UserQuery as users/query.ts<br/>fetchUserInfoByUserId
    participant ChildQuery as children/query.ts
    participant DB as データベース
    
    Client->>Route: GET /api/children
    
    Route->>Auth: 認証確認
    Auth->>DB: ユーザー情報取得
    DB-->>Auth: auth userId
    Auth-->>Route: {userId, db}
    
    Route->>UserQuery: fetchUserInfoByUserId({userId, db})
    UserQuery->>DB: SELECT profiles WHERE user_id=?
    DB-->>UserQuery: profile data
    UserQuery-->>Route: {profiles: {familyId}}
    
    Route->>Route: familyId検証
    
    Route->>ChildQuery: fetchChildrenByFamilyId({db, familyId})
    ChildQuery->>DB: SELECT children JOIN profiles<br/>WHERE family_id=?
    DB-->>ChildQuery: children array
    ChildQuery-->>Route: children data
    
    par クエスト統計を並行取得
        loop 各子供に対して
            Route->>ChildQuery: fetchChildQuestStats({db, childId})
            ChildQuery->>DB: SELECT COUNT(*) FROM child_quests<br/>GROUP BY status
            DB-->>ChildQuery: quest stats
            ChildQuery-->>Route: {notStarted, inProgress, pendingReview, completed}
        end
    end
    
    Route->>Route: questStats をRecord型に変換
    
    Route-->>Client: 200 OK<br/>{children, questStats}
```

## 2. POST /api/children - 子供登録

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Route as route.ts<br/>POST handler
    participant Auth as 認証<br/>getAuthContext
    participant UserQuery as users/query.ts
    participant InviteService as invite/service.ts<br/>generateUniqueInviteCode
    participant ChildService as service.ts<br/>registerChild
    participant DB as データベース
    
    Client->>Route: POST /api/children<br/>{form: {name, iconId, iconColor, birthday}}
    
    Route->>Route: リクエストバリデーション<br/>PostChildRequestSchema.parse
    
    Route->>Auth: 認証確認
    Auth-->>Route: {userId, db}
    
    Route->>UserQuery: fetchUserInfoByUserId({userId, db})
    UserQuery->>DB: SELECT profiles WHERE user_id=?
    DB-->>UserQuery: profile data
    UserQuery-->>Route: {profiles: {familyId}}
    
    Route->>Route: familyId検証
    
    Route->>InviteService: generateUniqueInviteCode({db})
    loop 最大10回試行
        InviteService->>InviteService: 6桁ランダムコード生成
        InviteService->>DB: SELECT children WHERE invite_code=?
        DB-->>InviteService: 存在判定
        alt コード未使用
            InviteService-->>Route: inviteCode
        end
    end
    
    Route->>ChildService: registerChild({child, profile})
    ChildService->>DB: トランザクション開始
    
    ChildService->>DB: INSERT INTO profiles<br/>{name, iconId, iconColor, familyId, type='child', user_id=null, birthday}
    DB-->>ChildService: profileId
    
    ChildService->>DB: INSERT INTO children<br/>{profileId, inviteCode, minSavings=0, currentSavings=0, currentLevel=1, totalExp=0}
    DB-->>ChildService: childId
    
    ChildService->>DB: トランザクションコミット
    ChildService-->>Route: childId
    
    Route-->>Client: 200 OK<br/>{childId}
```

## 3. GET /api/children/[id] - 子供詳細取得

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Route as [id]/route.ts<br/>GET handler
    participant Auth as 認証<br/>getAuthContext
    participant UserQuery as users/query.ts
    participant ChildQuery as children/query.ts
    participant DB as データベース
    
    Client->>Route: GET /api/children/{childId}
    
    Route->>Route: パスパラメータ取得<br/>const childId = params.id
    
    Route->>Auth: 認証確認
    Auth-->>Route: {userId, db}
    
    Route->>UserQuery: fetchUserInfoByUserId({userId, db})
    UserQuery->>DB: SELECT profiles WHERE user_id=?
    DB-->>UserQuery: profile data
    UserQuery-->>Route: {profiles: {familyId}}
    
    Route->>ChildQuery: fetchChild({db, childId})
    ChildQuery->>DB: SELECT children JOIN profiles<br/>WHERE children.id=?
    DB-->>ChildQuery: child data
    ChildQuery-->>Route: child
    
    Route->>Route: 子供存在チェック
    Route->>Route: 家族ID一致チェック
    
    par 統計情報を並行取得
        Route->>ChildQuery: fetchChildQuestStats({db, childId})
        ChildQuery->>DB: クエスト統計クエリ
        DB-->>ChildQuery: quest stats
        ChildQuery-->>Route: questStats
    and
        Route->>ChildQuery: fetchChildRewardStats({db, childId})
        ChildQuery->>DB: 報酬統計クエリ
        DB-->>ChildQuery: reward stats
        ChildQuery-->>Route: rewardStats
    end
    
    Route->>Route: 年齢計算<br/>calculateAge(birthday)
    Route->>Route: レベル取得<br/>currentLevel
    
    Route->>ChildQuery: fetchChildFixedReward({db, childId, age, level})
    ChildQuery->>DB: 定額報酬クエリ
    DB-->>ChildQuery: fixed reward
    ChildQuery-->>Route: fixedReward
    
    Route-->>Client: 200 OK<br/>{child, questStats, rewardStats, fixedReward}
```

## 4. PUT /api/children/[id] - 子供情報更新

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Route as [id]/route.ts<br/>PUT handler
    participant Auth as 認証<br/>getAuthContext
    participant UserQuery as users/query.ts
    participant ChildQuery as children/query.ts
    participant ChildService as service.ts<br/>updateChild
    participant DB as データベース
    
    Client->>Route: PUT /api/children/{childId}<br/>{form: {name, iconId, iconColor, birthday}}
    
    Route->>Route: パスパラメータ取得
    Route->>Route: リクエストバリデーション
    
    Route->>Auth: 認証確認
    Auth-->>Route: {userId, db}
    
    Route->>UserQuery: fetchUserInfoByUserId({userId, db})
    UserQuery-->>Route: {profiles: {familyId}}
    
    Route->>ChildQuery: fetchChild({db, childId})
    ChildQuery->>DB: SELECT children JOIN profiles
    DB-->>ChildQuery: child data
    ChildQuery-->>Route: child
    
    Route->>Route: 家族ID一致チェック
    
    Route->>ChildService: updateChild({db, childId, profile})
    ChildService->>DB: トランザクション開始
    
    ChildService->>DB: UPDATE profiles<br/>SET name=?, iconId=?, iconColor=?, birthday=?<br/>WHERE id=profileId
    DB-->>ChildService: 更新成功
    
    Note over ChildService,DB: childrenテーブルは<br/>システム管理カラムのみ<br/>なので更新不要
    
    ChildService->>DB: トランザクションコミット
    ChildService-->>Route: 成功
    
    Route-->>Client: 200 OK<br/>{success: true}
```

## 5. DELETE /api/children/[id] - 子供削除

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Route as [id]/route.ts<br/>DELETE handler
    participant Auth as 認証<br/>getAuthContext
    participant UserQuery as users/query.ts
    participant ChildQuery as children/query.ts
    participant ChildService as service.ts<br/>deleteChild
    participant DB as データベース
    
    Client->>Route: DELETE /api/children/{childId}
    
    Route->>Route: パスパラメータ取得
    
    Route->>Auth: 認証確認
    Auth-->>Route: {userId, db}
    
    Route->>UserQuery: fetchUserInfoByUserId({userId, db})
    UserQuery-->>Route: {profiles: {familyId}}
    
    Route->>ChildQuery: fetchChild({db, childId})
    ChildQuery->>DB: SELECT children JOIN profiles
    DB-->>ChildQuery: child data
    ChildQuery-->>Route: child
    
    Route->>Route: 家族ID一致チェック
    
    Route->>ChildService: deleteChild({db, childId})
    ChildService->>DB: トランザクション開始
    
    ChildService->>DB: DELETE FROM children<br/>WHERE id=?
    DB-->>ChildService: 削除成功
    Note over DB: カスケード削除:<br/>- child_quests<br/>- reward_history
    
    ChildService->>DB: DELETE FROM profiles<br/>WHERE id=profileId
    DB-->>ChildService: 削除成功
    Note over DB: ON DELETE CASCADEで<br/>auth.usersも削除<br/>(存在すれば)
    
    ChildService->>DB: トランザクションコミット
    ChildService-->>Route: 成功
    
    Route-->>Client: 200 OK<br/>{success: true}
```

## 6. POST /api/children/invite - 招待コード生成（独立エンドポイント）

**注**: 現在、招待コードは POST /api/children 内で自動生成されます。独立したエンドポイントはありません。

```mermaid
sequenceDiagram
    participant Service as invite/service.ts<br/>generateUniqueInviteCode
    participant Util as util.ts<br/>generateInviteCode
    participant Query as children/query.ts<br/>fetchChildByInviteCode
    participant DB as データベース
    
    Note over Service: POST /api/children 内で呼ばれる
    
    loop 最大10回試行
        Service->>Util: generateInviteCode()
        Util->>Util: ランダム6桁コード生成<br/>(0-9, A-Z)
        Util-->>Service: inviteCode
        
        Service->>Query: fetchChildByInviteCode({invite_code, db})
        Query->>DB: SELECT children WHERE invite_code=?
        DB-->>Query: child or null
        Query-->>Service: 存在判定
        
        alt コード未使用
            Service-->>Service: コード確定
        else コード重複
            Service->>Service: 再試行
        end
    end
    
    alt 10回試行後も重複
        Service->>Service: ServerError例外スロー
    end
```

## エラーレスポンス統一形式

すべてのエンドポイントで以下のエラーレスポンスを返します：

```typescript
{
  error: string           // エラーメッセージ
  code?: string          // エラーコード（オプション）
  details?: unknown      // 詳細情報（オプション）
}
```

### 共通エラーコード

- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 権限不足（別家族の子供にアクセス）
- `404 Not Found`: リソース未発見
- `422 Unprocessable Entity`: バリデーションエラー
- `500 Internal Server Error`: サーバー内部エラー
