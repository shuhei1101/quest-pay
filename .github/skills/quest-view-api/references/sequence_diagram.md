(2026年3月記載)

# クエストビューAPI シーケンス図

## API エンドポイント一覧

### 家族クエスト閲覧
- `GET /api/quests/family/[id]`: 家族クエスト詳細取得
- `PUT /api/quests/family/[id]`: 家族クエスト更新
- `DELETE /api/quests/family/[id]`: 家族クエスト削除

### 公開クエスト閲覧
- `GET /api/quests/public/[id]`: 公開クエスト詳細取得
- `PUT /api/quests/public/[id]`: 公開クエスト更新
- `DELETE /api/quests/public/[id]`: 公開クエスト削除
- `GET /api/quests/public/[id]/like-count`: いいね数取得
- `GET /api/quests/public/[id]/is-like`: いいね状態取得
- `POST /api/quests/public/[id]/like`: いいね追加
- `DELETE /api/quests/public/[id]/like`: いいね解除

### テンプレートクエスト閲覧
- `GET /api/quests/template/[id]`: テンプレートクエスト詳細取得
- `PUT /api/quests/template/[id]`: テンプレートクエスト更新
- `DELETE /api/quests/template/[id]`: テンプレートクエスト削除

### 子供クエスト閲覧
- `GET /api/quests/family/[id]/child/[childId]`: 子供クエスト詳細取得（自動生成）

## GET /api/quests/family/[id]（家族クエスト詳細取得）

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Logger as Logger
    
    C->>API: GET /api/quests/family/[id]
    
    API->>Logger: info: 家族クエスト取得開始
    API->>Auth: ユーザー認証確認
    Auth-->>API: ログインユーザー情報
    
    API->>DB: SELECT family_quests<br/>WHERE id = [id]
    DB-->>API: family_quest
    
    alt クエストが存在しない
        API->>Logger: warn: クエストが見つからない
        API-->>C: 404 Not Found
    end
    
    API->>Auth: 家族メンバー権限確認
    Auth-->>API: 権限OK
    
    par 並列データ取得
        API->>DB: SELECT family_quest_details<br/>WHERE family_quest_id = [id]
        DB-->>API: details[]
        
        API->>DB: SELECT quests<br/>WHERE id = quest_id
        DB-->>API: quest (name, requestDetail, client)
        
        API->>DB: SELECT icons<br/>WHERE id = icon_id
        DB-->>API: icon (name, size)
        
        API->>DB: SELECT quest_categories<br/>WHERE id = category_id
        DB-->>API: category
        
        API->>DB: SELECT quest_tags<br/>JOIN family_quest_tags
        DB-->>API: tags[]
    end
    
    API->>API: レスポンス構築<br/>(fetchFamilyQuest型)
    API->>Logger: info: 家族クエスト取得完了
    API-->>C: 200 OK<br/>{familyQuest: {...}}
```

## GET /api/quests/public/[id]（公開クエスト詳細取得）

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Logger as Logger
    
    C->>API: GET /api/quests/public/[id]
    
    API->>Logger: info: 公開クエスト取得開始
    API->>Auth: ユーザー認証確認（オプション）
    Auth-->>API: ユーザー情報 or null
    
    API->>DB: SELECT public_quests<br/>WHERE id = [id]
    DB-->>API: public_quest
    
    alt クエストが存在しない
        API->>Logger: warn: 公開クエストが見つからない
        API-->>C: 404 Not Found
    end
    
    alt is_active = false
        API->>Logger: warn: 公開クエストが非アクティブ
        API-->>C: 410 Gone<br/>（公開終了）
    end
    
    par 並列データ取得
        API->>DB: SELECT family_quests<br/>WHERE id = family_quest_id
        DB-->>API: family_quest
        
        API->>DB: SELECT family_quest_details<br/>WHERE family_quest_id = family_quest_id
        DB-->>API: details[]
        
        API->>DB: SELECT quests + icon + category + tags
        DB-->>API: quest関連情報
        
        API->>DB: SELECT families<br/>WHERE id = family_id
        DB-->>API: family
        
        API->>DB: SELECT icons<br/>WHERE id = family.icon_id
        DB-->>API: familyIcon
        
        API->>DB: SELECT COUNT(*)<br/>FROM public_quest_likes<br/>WHERE public_quest_id = [id]
        DB-->>API: totalLikes
        
        alt ユーザーログイン中
            API->>DB: SELECT *<br/>FROM public_quest_likes<br/>WHERE public_quest_id = [id]<br/>AND profile_id = userId
            DB-->>API: isLiked (boolean)
        end
        
        API->>DB: SELECT public_quest_comments<br/>WHERE public_quest_id = [id]<br/>ORDER BY created_at DESC
        DB-->>API: comments[]
    end
    
    API->>API: レスポンス構築<br/>(fetchPublicQuest型)
    API->>Logger: info: 公開クエスト取得完了
    API-->>C: 200 OK<br/>{publicQuest: {...}}
```

## GET /api/quests/template/[id]（テンプレートクエスト詳細取得）

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Logger as Logger
    
    C->>API: GET /api/quests/template/[id]
    
    API->>Logger: info: テンプレートクエスト取得開始
    API->>Auth: ユーザー認証確認
    Auth-->>API: ログインユーザー情報
    
    API->>DB: SELECT template_quests<br/>WHERE id = [id]
    DB-->>API: template_quest
    
    alt クエストが存在しない
        API->>Logger: warn: テンプレートが見つからない
        API-->>C: 404 Not Found
    end
    
    par 並列データ取得
        API->>DB: SELECT template_quest_details<br/>WHERE template_quest_id = [id]
        DB-->>API: details[]
        
        API->>DB: SELECT quests + icon + category + tags
        DB-->>API: quest関連情報
    end
    
    API->>API: レスポンス構築<br/>(fetchTemplateQuest型)
    API->>Logger: info: テンプレートクエスト取得完了
    API-->>C: 200 OK<br/>{templateQuest: {...}}
```

## GET /api/quests/family/[id]/child/[childId]（子供クエスト取得/生成）

```mermaid
sequenceDiagram
    participant C as クライアント（子供/親）
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Notif as 通知サービス
    participant Logger as Logger
    
    C->>API: GET /api/quests/family/[id]/child/[childId]
    
    API->>Logger: info: 子供クエスト取得開始
    API->>Auth: ユーザー認証確認
    Auth-->>API: ログインユーザー情報
    
    API->>DB: SELECT family_quests<br/>WHERE id = [id]
    DB-->>API: family_quest
    
    alt クエストが存在しない
        API->>Logger: warn: 家族クエストが見つからない
        API-->>C: 404 Not Found
    end
    
    API->>Auth: 子供本人または親権限確認
    Auth-->>API: 権限OK
    
    API->>DB: SELECT children<br/>WHERE id = [childId]
    DB-->>API: child (level)
    
    API->>DB: SELECT family_quest_details<br/>WHERE family_quest_id = [id]<br/>AND level = child.level
    DB-->>API: family_quest_detail
    
    API->>DB: SELECT child_quests<br/>WHERE child_id = [childId]<br/>AND family_quest_detail_id = family_quest_detail.id
    DB-->>API: child_quest or null
    
    alt child_questが存在しない（初回受注）
        API->>Logger: info: 新規子供クエスト生成
        API->>DB: BEGIN TRANSACTION
        
        API->>DB: INSERT INTO child_quests<br/>(child_id, family_quest_detail_id,<br/>status: 'not_started')
        DB-->>API: 新規child_quest
        
        API->>DB: SELECT family_quests.parent_id
        DB-->>API: parent_id
        
        API->>Notif: 親に通知送信<br/>(child_quest_received)
        Notif-->>API: 通知送信完了（非同期）
        
        API->>DB: COMMIT
        DB-->>API: トランザクション完了
    end
    
    par 並列データ取得
        API->>DB: SELECT family_quest_details
        DB-->>API: detail (level, reward, child_exp)
        
        API->>DB: SELECT family_quests + quests<br/>+ icon + category
        DB-->>API: quest関連情報
    end
    
    API->>API: レスポンス構築<br/>(fetchChildQuest型)<br/>+ status情報付与
    API->>Logger: info: 子供クエスト取得完了
    API-->>C: 200 OK<br/>{childQuest: {...}}
```

## POST /api/quests/public/[id]/like（いいね追加）

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Lock as 排他制御
    participant Logger as Logger
    
    C->>API: POST /api/quests/public/[id]/like
    
    API->>Logger: info: いいね追加開始
    API->>Auth: ユーザー認証確認
    Auth-->>API: ログインユーザー情報
    
    API->>Lock: 排他ロック取得<br/>public_quest:[id]
    Lock-->>API: ロック取得
    
    API->>DB: SELECT public_quest_likes<br/>WHERE public_quest_id = [id]<br/>AND profile_id = userId
    DB-->>API: 既存いいね or null
    
    alt 既にいいね済み
        API->>Logger: warn: 既にいいね済み
        API-->>C: 409 Conflict
    end
    
    API->>DB: BEGIN TRANSACTION
    
    API->>DB: INSERT INTO public_quest_likes<br/>(public_quest_id, profile_id)
    DB-->>API: 挿入完了
    
    API->>DB: UPDATE public_quests<br/>SET total_likes = total_likes + 1<br/>WHERE id = [id]
    DB-->>API: 更新完了
    
    API->>DB: COMMIT
    DB-->>API: トランザクション完了
    
    API->>Lock: ロック解放
    Lock-->>API: 解放完了
    
    API->>Logger: info: いいね追加完了
    API-->>C: 200 OK<br/>{success: true}
```

## DELETE /api/quests/public/[id]/like（いいね解除）

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Lock as 排他制御
    participant Logger as Logger
    
    C->>API: DELETE /api/quests/public/[id]/like
    
    API->>Logger: info: いいね解除開始
    API->>Auth: ユーザー認証確認
    Auth-->>API: ログインユーザー情報
    
    API->>Lock: 排他ロック取得<br/>public_quest:[id]
    Lock-->>API: ロック取得
    
    API->>DB: SELECT public_quest_likes<br/>WHERE public_quest_id = [id]<br/>AND profile_id = userId
    DB-->>API: 既存いいね or null
    
    alt いいねしていない
        API->>Logger: warn: いいねが存在しない
        API-->>C: 404 Not Found
    end
    
    API->>DB: BEGIN TRANSACTION
    
    API->>DB: DELETE FROM public_quest_likes<br/>WHERE public_quest_id = [id]<br/>AND profile_id = userId
    DB-->>API: 削除完了
    
    API->>DB: UPDATE public_quests<br/>SET total_likes = total_likes - 1<br/>WHERE id = [id]
    DB-->>API: 更新完了
    
    API->>DB: COMMIT
    DB-->>API: トランザクション完了
    
    API->>Lock: ロック解放
    Lock-->>API: 解放完了
    
    API->>Logger: info: いいね解除完了
    API-->>C: 200 OK<br/>{success: true}
```

## PUT /api/quests/family/[id]（家族クエスト更新）

```mermaid
sequenceDiagram
    participant C as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Validate as バリデーション
    participant DB as Database
    participant Lock as 排他制御
    participant Logger as Logger
    
    C->>API: PUT /api/quests/family/[id]<br/>{form, familyQuestUpdatedAt, questUpdatedAt}
    
    API->>Logger: info: 家族クエスト更新開始
    API->>Auth: 親ユーザー認証確認
    Auth-->>API: 親ユーザー情報
    
    API->>Validate: リクエストボディ検証
    Validate-->>API: 検証OK
    
    API->>Lock: 排他ロック取得<br/>family_quest:[id]
    Lock-->>API: ロック取得
    
    API->>DB: SELECT family_quests<br/>WHERE id = [id]<br/>FOR UPDATE
    DB-->>API: 現在のfamily_quest
    
    alt updated_at不一致（楽観的排他制御）
        API->>Logger: warn: 更新競合発生
        API-->>C: 409 Conflict<br/>（別のユーザーが更新済み）
    end
    
    API->>DB: BEGIN TRANSACTION
    
    API->>DB: UPDATE family_quests<br/>SET title=..., description=..., updated_at=NOW()
    DB-->>API: 更新完了
    
    API->>DB: UPDATE quests<br/>SET name=..., requestDetail=..., updated_at=NOW()
    DB-->>API: 更新完了
    
    API->>DB: DELETE FROM family_quest_details<br/>WHERE family_quest_id = [id]
    DB-->>API: 削除完了
    
    loop 各レベル
        API->>DB: INSERT INTO family_quest_details<br/>(family_quest_id, level, reward)
        DB-->>API: 挿入完了
    end
    
    API->>DB: COMMIT
    DB-->>API: トランザクション完了
    
    API->>Lock: ロック解放
    Lock-->>API: 解放完了
    
    API->>Logger: info: 家族クエスト更新完了
    API-->>C: 200 OK<br/>{success: true}
```

## DELETE /api/quests/family/[id]（家族クエスト削除）

```mermaid
sequenceDiagram
    participant C as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Lock as 排他制御
    participant Logger as Logger
    
    C->>API: DELETE /api/quests/family/[id]<br/>{updatedAt}
    
    API->>Logger: info: 家族クエスト削除開始
    API->>Auth: 親ユーザー認証確認
    Auth-->>API: 親ユーザー情報
    
    API->>Lock: 排他ロック取得<br/>family_quest:[id]
    Lock-->>API: ロック取得
    
    API->>DB: SELECT family_quests<br/>WHERE id = [id]<br/>FOR UPDATE
    DB-->>API: 現在のfamily_quest
    
    alt updated_at不一致
        API->>Logger: warn: 削除競合発生
        API-->>C: 409 Conflict
    end
    
    API->>DB: SELECT child_quests<br/>WHERE family_quest_detail_id IN (...)
    DB-->>API: 関連child_quests[]
    
    alt 完了していない子供クエストが存在
        API->>Logger: warn: 進行中クエストあり
        API-->>C: 400 Bad Request<br/>（進行中のクエストがあるため削除不可）
    end
    
    API->>DB: BEGIN TRANSACTION
    
    API->>DB: DELETE FROM family_quest_details<br/>WHERE family_quest_id = [id]
    DB-->>API: 削除完了
    
    API->>DB: DELETE FROM family_quests<br/>WHERE id = [id]
    DB-->>API: 削除完了
    
    API->>DB: DELETE FROM quests<br/>WHERE id = quest_id
    DB-->>API: 削除完了
    
    API->>DB: COMMIT
    DB-->>API: トランザクション完了
    
    API->>Lock: ロック解放
    Lock-->>API: 解放完了
    
    API->>Logger: info: 家族クエスト削除完了
    API-->>C: 200 OK<br/>{success: true}
```
