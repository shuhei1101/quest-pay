(2026年3月15日 14:30記載)

# 家族クエストAPI シーケンス図

## API エンドポイント一覧（再掲）

### 基本CRUD
- `GET /api/quests/family`: 一覧取得
- `POST /api/quests/family`: 新規作成
- `GET /api/quests/family/[id]`: 詳細取得
- `PUT /api/quests/family/[id]`: 更新
- `DELETE /api/quests/family/[id]`: 削除

### 公開機能
- `POST /api/quests/family/[id]/publish`: 公開
- `GET /api/quests/family/[id]/public`: 公開クエスト取得

### 子供クエスト操作
- `GET /api/quests/family/[id]/child/[childId]`: 子供クエスト取得
- `POST /api/quests/family/[id]/review-request`: 完了報告
- `POST /api/quests/family/[id]/cancel-review`: 報告キャンセル
- `POST /api/quests/family/[id]/child/[childId]/approve`: 承認
- `POST /api/quests/family/[id]/child/[childId]/reject`: 却下

## GET /api/quests/family（一覧取得）

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    
    C->>API: GET /api/quests/family?familyId=xxx
    API->>Auth: ユーザー認証確認
    Auth-->>API: ログインユーザー情報
    API->>Auth: 家族メンバー権限確認
    Auth-->>API: 権限OK
    API->>DB: SELECT family_quests<br/>JOIN family_quest_details<br/>WHERE family_id = xxx
    DB-->>API: クエスト一覧データ
    API->>API: レスポンス整形
    API-->>C: 200 OK<br/>{quests: [...]}
```

## POST /api/quests/family（新規作成）

```mermaid
sequenceDiagram
    participant C as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Validate as バリデーション
    participant DB as Database
    participant TL as Timeline Service
    participant Logger as Logger
    
    C->>API: POST /api/quests/family<br/>{title, description, levels: [{level, reward}]}
    
    API->>Logger: info: クエスト作成開始
    API->>Auth: ユーザー認証確認（親のみ）
    Auth-->>API: 親ユーザー情報
    
    API->>Validate: リクエストボディ検証<br/>（title必須、levels配列形式等）
    Validate-->>API: 検証OK
    
    API->>DB: BEGIN TRANSACTION
    
    API->>DB: INSERT INTO family_quests<br/>(family_id, parent_id, title, ...)
    DB-->>API: family_quest.id
    
    loop 各レベル
        API->>DB: INSERT INTO family_quest_details<br/>(family_quest_id, level, reward)
        DB-->>API: 挿入完了
    end
    
    API->>DB: COMMIT
    DB-->>API: トランザクション完了
    
    API->>TL: タイムライン投稿<br/>（quest_created）
    TL-->>API: 投稿完了（非同期）
    
    API->>Logger: info: クエスト作成完了
    API-->>C: 201 Created<br/>{id, title, details: [...]}
    
    Note over API,DB: エラー時はROLLBACK
```

## GET /api/quests/family/[id]（詳細取得）

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Cache as キャッシュ
    
    C->>API: GET /api/quests/family/[id]
    
    API->>Auth: ユーザー認証確認
    Auth-->>API: ログインユーザー情報
    
    API->>Cache: キャッシュ確認（quest:[id]）
    Cache-->>API: キャッシュミス
    
    API->>DB: SELECT family_quests<br/>JOIN family_quest_details<br/>WHERE id = [id]
    DB-->>API: クエスト詳細
    
    API->>Auth: 家族メンバー権限確認
    Auth-->>API: 権限OK
    
    API->>Cache: キャッシュ保存（5分TTL）
    
    API-->>C: 200 OK<br/>{id, title, details: [...]}
```

## POST /api/quests/family/[id]/review-request（完了報告）

```mermaid
sequenceDiagram
    participant C as 子供クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Lock as 排他制御
    participant Notify as 通知サービス
    participant Logger as Logger
    
    C->>API: POST /api/quests/family/[id]/review-request<br/>{childId}
    
    API->>Logger: info: 完了報告受付
    API->>Auth: 子供ユーザー認証
    Auth-->>API: 子供ユーザー情報
    
    API->>Lock: 排他ロック取得<br/>child_quests:[childQuestId]
    Lock-->>API: ロック取得
    
    API->>DB: SELECT child_quests<br/>WHERE id = [childQuestId]<br/>FOR UPDATE
    DB-->>API: 現在のステータス
    
    alt ステータスが in_progress
        API->>DB: UPDATE child_quests<br/>SET status = 'pending_review'<br/>reported_at = NOW()
        DB-->>API: 更新完了
        
        API->>DB: SELECT親情報<br/>（通知先取得）
        DB-->>API: 親プロフィール
        
        API->>Notify: 親に通知送信<br/>（family_quest_review）
        Notify-->>API: 通知送信完了（非同期）
        
        API->>Logger: info: 完了報告完了
        API-->>C: 200 OK<br/>{status: 'pending_review'}
    else ステータスが not_started or completed
        API->>Logger: warn: 不正なステータス遷移
        API-->>C: 400 Bad Request<br/>{error: '報告できない状態'}
    end
    
    API->>Lock: ロック解放
```

## POST /api/quests/family/[id]/child/[childId]/approve（承認）

```mermaid
sequenceDiagram
    participant P as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Lock as 排他制御
    participant Reward as 報酬サービス
    participant Notify as 通知サービス
    participant TL as Timeline Service
    participant Logger as Logger
    
    P->>API: POST /api/quests/family/[id]/child/[childId]/approve
    
    API->>Logger: info: 承認処理開始
    API->>Auth: 親ユーザー認証
    Auth-->>API: 親ユーザー情報
    
    API->>Lock: 排他ロック取得<br/>child_quests:[childQuestId]
    Lock-->>API: ロック取得
    
    API->>DB: BEGIN TRANSACTION
    
    API->>DB: SELECT child_quests<br/>JOIN family_quest_details<br/>WHERE child_quests.id = [childQuestId]<br/>FOR UPDATE
    DB-->>API: クエスト情報（報酬額含む）
    
    alt ステータスが pending_review
        API->>DB: UPDATE child_quests<br/>SET status = 'completed'<br/>completed_at = NOW()<br/>reviewed_at = NOW()
        DB-->>API: 更新完了
        
        API->>Reward: 報酬付与処理
        Reward->>DB: INSERT INTO reward_history<br/>(child_id, reward_type: 'quest', amount)
        Reward->>DB: UPDATE children<br/>SET total_earned += amount<br/>    exp += amount
        Reward->>DB: レベルアップ判定
        DB-->>Reward: 報酬付与完了
        Reward-->>API: レベル情報（level, levelUp）
        
        API->>DB: COMMIT
        DB-->>API: トランザクション完了
        
        API->>Notify: 子供に通知<br/>（quest_report_approved）
        Notify-->>API: 通知完了（非同期）
        
        alt レベルアップした場合
            API->>Notify: レベルアップ通知<br/>（quest_level_up）
            API->>TL: タイムライン投稿<br/>（quest_level_up）
        end
        
        alt 最終レベル完了の場合
            API->>Notify: クエストクリア通知<br/>（quest_cleared）
            API->>TL: タイムライン投稿<br/>（quest_cleared）
        end
        
        API->>Logger: info: 承認完了
        API-->>P: 200 OK<br/>{status: 'completed', reward, level}
    else ステータスが pending_review以外
        API->>DB: ROLLBACK
        API->>Logger: warn: 不正なステータス
        API-->>P: 400 Bad Request<br/>{error: '承認できない状態'}
    end
    
    API->>Lock: ロック解放
    
    Note over API,DB: エラー時は自動ROLLBACK
```

## POST /api/quests/family/[id]/publish（公開）

```mermaid
sequenceDiagram
    participant P as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant TL as Public Timeline
    participant Logger as Logger
    
    P->>API: POST /api/quests/family/[id]/publish
    
    API->>Logger: info: 公開処理開始
    API->>Auth: 親ユーザー認証
    Auth-->>API: 親ユーザー情報
    
    API->>DB: SELECT family_quests<br/>WHERE id = [id]<br/>AND family_id = [user.familyId]
    DB-->>API: クエスト情報
    
    alt クエストが存在し、親の家族に属している
        API->>DB: SELECT public_quests<br/>WHERE family_quest_id = [id]
        DB-->>API: 既存公開クエスト
        
        alt 未公開の場合
            API->>DB: INSERT INTO public_quests<br/>(family_quest_id, family_id, is_active: true)
            DB-->>API: 公開クエストID
            
            API->>TL: 公開タイムライン投稿<br/>（quest_published）
            TL-->>API: 投稿完了（非同期）
            
            API->>Logger: info: 公開完了
            API-->>P: 201 Created<br/>{publicQuestId, isActive: true}
        else 既に公開済み
            API->>DB: UPDATE public_quests<br/>SET is_active = true
            DB-->>API: 更新完了
            
            API->>Logger: info: 再公開完了
            API-->>P: 200 OK<br/>{publicQuestId, isActive: true}
        end
    else クエストが存在しない or 権限なし
        API->>Logger: warn: 公開権限なし
        API-->>P: 403 Forbidden<br/>{error: '公開権限がありません'}
    end
```

## エラーハンドリングパターン

### 認証エラー
```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Logger as Logger
    
    C->>API: リクエスト（認証トークンなし/無効）
    API->>Auth: 認証確認
    Auth-->>API: 認証失敗
    API->>Logger: warn: 認証エラー
    API-->>C: 401 Unauthorized<br/>{error: '認証が必要です'}
```

### バリデーションエラー
```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Validate as バリデーション
    participant Logger as Logger
    
    C->>API: POST（不正なボディ）
    API->>Validate: リクエスト検証
    Validate-->>API: 検証エラー
    API->>Logger: warn: バリデーションエラー
    API-->>C: 400 Bad Request<br/>{error: '入力値が不正', details: [...]}
```

### データベースエラー
```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant DB as Database
    participant Logger as Logger
    
    C->>API: リクエスト
    API->>DB: クエリ実行
    DB-->>API: エラー（接続失敗、制約違反等）
    API->>Logger: error: DBエラー詳細
    API-->>C: 500 Internal Server Error<br/>{error: 'サーバーエラー'}
    
    Note over API: ユーザーに詳細は返さない
```

## ファイル構成参照

### API Route Files
- `packages/web/app/api/quests/family/route.ts`: 一覧取得、作成
- `packages/web/app/api/quests/family/[id]/route.ts`: 詳細、更新、削除
- `packages/web/app/api/quests/family/[id]/publish/route.ts`: 公開
- `packages/web/app/api/quests/family/[id]/review-request/route.ts`: 完了報告
- `packages/web/app/api/quests/family/[id]/child/[childId]/approve/route.ts`: 承認
- `packages/web/app/api/quests/family/[id]/child/[childId]/reject/route.ts`: 却下

### クライアント側
- `packages/web/app/api/quests/family/client.ts`: APIクライアント
- `packages/web/app/api/quests/family/query.ts`: React Queryフック
