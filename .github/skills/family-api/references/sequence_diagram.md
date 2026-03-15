(2026年3月記載)

# 家族API シーケンス図

## 1. 家族登録（POST /api/families）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as POST /api/families
    participant Auth as getAuthContext
    participant Invite as generateUniqueInviteCode
    participant Service as registerFamilyAndParent
    participant DB as Database
    
    Client->>API: POST /api/families<br/>{form: FamilyRegisterForm}
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId}
    API->>Invite: 招待コード生成
    Invite->>DB: SELECT (重複チェック)
    DB-->>Invite: 一意性確認
    Invite-->>API: inviteCode
    API->>Service: 家族+親登録
    Service->>DB: BEGIN TRANSACTION
    Service->>DB: INSERT INTO families
    Service->>DB: INSERT INTO profiles (type: parent)
    Service->>DB: INSERT INTO parents
    Service->>DB: COMMIT
    DB-->>Service: 成功
    Service-->>API: 完了
    API-->>Client: 200 OK {}
```

## 2. 家族一覧取得（GET /api/families）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as GET /api/families
    participant Auth as getAuthContext
    participant DB as Database
    
    Client->>API: GET /api/families?query=xxx&sort=createdAt&order=desc
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId}
    API->>DB: SELECT families<br/>WHERE display_id LIKE %query%<br/>OR local_name LIKE %query%<br/>ORDER BY sort order
    DB-->>API: families[]
    API-->>Client: 200 OK {families: [...]}
```

## 3. 家族詳細取得（GET /api/families/[id]）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as GET /api/families/[id]
    participant Auth as getAuthContext
    participant Service as fetchFamilyDetail
    participant DB as Database
    
    Client->>API: GET /api/families/{familyId}
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId}
    API->>Service: 家族詳細取得
    Service->>DB: SELECT families<br/>LEFT JOIN profiles<br/>LEFT JOIN children<br/>LEFT JOIN parents<br/>WHERE families.id = familyId
    DB-->>Service: familyDetail
    Service-->>API: FamilyDetailResponse
    API-->>Client: 200 OK {family: {...}, members: [...]}
```

## 4. 家族情報更新（PUT /api/families/[id]）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as PUT /api/families/[id]
    participant Auth as getAuthContext
    participant ParentCheck as checkIsParentInFamily
    participant DB as Database
    
    Client->>API: PUT /api/families/{familyId}<br/>{localName, onlineName, ...}
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId}
    API->>ParentCheck: 親権限チェック
    ParentCheck->>DB: SELECT profiles, parents<br/>WHERE user_id = userId<br/>AND family_id = familyId
    DB-->>ParentCheck: parent確認
    ParentCheck-->>API: 権限OK
    API->>DB: UPDATE families<br/>SET local_name = ?, ...<br/>WHERE id = familyId
    DB-->>API: 更新成功
    API-->>Client: 200 OK {}
    
    Note over ParentCheck,DB: 権限がない場合は<br/>403 Forbiddenエラー
```

## 5. 家族削除（DELETE /api/families/[id]）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as DELETE /api/families/[id]
    participant Auth as getAuthContext
    participant ParentCheck as checkIsParentInFamily
    participant DB as Database
    
    Client->>API: DELETE /api/families/{familyId}
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId}
    API->>ParentCheck: 親権限チェック
    ParentCheck->>DB: 権限確認
    DB-->>ParentCheck: parent確認
    ParentCheck-->>API: 権限OK
    API->>DB: BEGIN TRANSACTION
    API->>DB: DELETE FROM families<br/>WHERE id = familyId
    Note over DB: CASCADE削除:<br/>- profiles<br/>- family_quests<br/>- family_follows
    DB-->>API: 削除成功
    API->>DB: COMMIT
    API-->>Client: 200 OK {}
    
    Note over API,DB: 制約違反時は409エラー
```

## 6. メンバー一覧取得（GET /api/families/[id]/members）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as GET /api/families/[id]/members
    participant Auth as getAuthContext
    participant DB as Database
    
    Client->>API: GET /api/families/{familyId}/members
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId}
    API->>DB: SELECT profiles<br/>LEFT JOIN children<br/>LEFT JOIN parents<br/>WHERE family_id = familyId
    DB-->>API: members[]
    API-->>Client: 200 OK {members: [...]}
```

## 7. メンバー追加（POST /api/families/[id]/members）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as POST /api/families/[id]/members
    participant Auth as getAuthContext
    participant ParentCheck as checkIsParentInFamily
    participant Validate as validateInviteCode
    participant DB as Database
    
    Client->>API: POST /api/families/{familyId}/members<br/>{inviteCode, type}
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId}
    API->>ParentCheck: 親権限チェック
    ParentCheck-->>API: 権限OK
    API->>Validate: 招待コード検証
    Validate->>DB: SELECT parents/children<br/>WHERE invite_code = ?
    DB-->>Validate: コード検証結果
    Validate-->>API: 検証OK
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO profiles
    API->>DB: INSERT INTO parents/children
    API->>DB: COMMIT
    DB-->>API: 作成成功
    API-->>Client: 201 Created {member: {...}}
    
    Note over Validate,DB: 無効なコードの場合は<br/>400 Bad Requestエラー
```

## 8. メンバー削除（DELETE /api/families/[id]/members/[memberId]）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as DELETE /api/families/[id]/members/[memberId]
    participant Auth as getAuthContext
    participant ParentCheck as checkIsParentInFamily
    participant DB as Database
    
    Client->>API: DELETE /api/families/{familyId}/members/{memberId}
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId}
    API->>ParentCheck: 親権限チェック
    ParentCheck-->>API: 権限OK
    API->>DB: BEGIN TRANSACTION
    API->>DB: DELETE FROM profiles<br/>WHERE id = memberId<br/>AND family_id = familyId
    Note over DB: CASCADE削除:<br/>- parents/children<br/>- quest_children (子供の場合)
    DB-->>API: 削除成功
    API->>DB: COMMIT
    API-->>Client: 200 OK {}
    
    Note over API,DB: 制約違反時は409エラー
```

## 9. 家族フォロー（POST /api/families/[id]/follow）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as POST /api/families/[id]/follow
    participant Auth as getAuthContext
    participant DB as Database
    
    Client->>API: POST /api/families/{familyId}/follow
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId, currentFamilyId}
    API->>DB: INSERT INTO family_follows<br/>{family_id: familyId,<br/>follower_family_id: currentFamilyId}
    DB-->>API: 作成成功
    API-->>Client: 200 OK {}
    
    Note over API,DB: 既存の場合は409エラー<br/>または無視
```

## 10. 家族フォロー解除（DELETE /api/families/[id]/follow）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as DELETE /api/families/[id]/follow
    participant Auth as getAuthContext
    participant DB as Database
    
    Client->>API: DELETE /api/families/{familyId}/follow
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId, currentFamilyId}
    API->>DB: DELETE FROM family_follows<br/>WHERE family_id = familyId<br/>AND follower_family_id = currentFamilyId
    DB-->>API: 削除成功
    API-->>Client: 200 OK {}
```

## 11. フォロー状態取得（GET /api/families/[id]/follow/status）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as GET /api/families/[id]/follow/status
    participant Auth as getAuthContext
    participant DB as Database
    
    Client->>API: GET /api/families/{familyId}/follow/status
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId, currentFamilyId}
    API->>DB: SELECT family_follows<br/>WHERE family_id = familyId<br/>AND follower_family_id = currentFamilyId
    DB-->>API: followStatus
    API-->>Client: 200 OK {isFollowing: true/false}
```

## 12. フォロー数取得（GET /api/families/[id]/follow/count）

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as GET /api/families/[id]/follow/count
    participant Auth as getAuthContext
    participant DB as Database
    
    Client->>API: GET /api/families/{familyId}/follow/count
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: {db, userId}
    API->>DB: SELECT COUNT(*)<br/>FROM family_follows<br/>WHERE family_id = familyId
    DB-->>API: count
    API-->>Client: 200 OK {count: 123}
```

## エラーハンドリングパターン

### 認証エラー (401 Unauthorized)
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Auth as getAuthContext
    
    Client->>API: API Request
    API->>Auth: 認証チェック
    Auth-->>API: 認証失敗
    API-->>Client: 401 Unauthorized<br/>{message: "認証が必要です"}
```

### 権限エラー (403 Forbidden)
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant ParentCheck
    
    Client->>API: 親限定操作
    API->>ParentCheck: 親権限チェック
    ParentCheck-->>API: 権限なし
    API-->>Client: 403 Forbidden<br/>{message: "親権限が必要です"}
```

### バリデーションエラー (400 Bad Request)
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Validate
    
    Client->>API: 不正なデータ
    API->>Validate: バリデーション
    Validate-->>API: 検証失敗
    API-->>Client: 400 Bad Request<br/>{errors: {...}}
```

### 制約違反エラー (409 Conflict)
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB
    
    Client->>API: 削除リクエスト
    API->>DB: DELETE
    DB-->>API: 外部キー制約違反
    API-->>Client: 409 Conflict<br/>{message: "削除できません"}
```
