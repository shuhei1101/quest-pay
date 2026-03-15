(2026年3月記載)

# 子供クエストAPI シーケンス図

## API エンドポイント一覧（再掲）

### 基本CRUD
- `GET /api/quests/child`: 子供クエスト一覧取得
- `GET /api/quests/child/[id]`: 子供クエスト詳細取得

### 受注・報告
- `POST /api/quests/family/[familyQuestId]/review-request`: 完了報告
- `POST /api/quests/family/[familyQuestId]/cancel-review`: 報告キャンセル

### 親の承認処理
- `POST /api/quests/family/[familyQuestId]/child/[childId]/approve`: 報告承認
- `POST /api/quests/family/[familyQuestId]/child/[childId]/reject`: 報告却下

## GET /api/quests/child（一覧取得）

```mermaid
sequenceDiagram
    participant C as 子供クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Logger as Logger
    
    C->>API: GET /api/quests/child?childId=xxx
    
    API->>Logger: info: 子供クエスト一覧取得開始
    API->>Auth: ユーザー認証確認
    Auth-->>API: ログインユーザー情報
    
    API->>Auth: 子供本人または親権限確認
    Auth-->>API: 権限OK
    
    API->>DB: SELECT child_quests<br/>JOIN family_quest_details<br/>JOIN family_quests<br/>WHERE child_id = xxx
    DB-->>API: 子供クエスト一覧データ
    
    API->>API: レスポンス整形<br/>（title, level, reward含む）
    
    API->>Logger: info: 一覧取得完了（件数: N）
    API-->>C: 200 OK<br/>{quests: [{id, status, title, level, reward, ...}]}
```

## GET /api/quests/child/[id]（詳細取得）

```mermaid
sequenceDiagram
    participant C as 子供クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Logger as Logger
    
    C->>API: GET /api/quests/child/[id]
    
    API->>Logger: info: 子供クエスト詳細取得開始
    API->>Auth: ユーザー認証確認
    Auth-->>API: ログインユーザー情報
    
    API->>DB: SELECT child_quests<br/>JOIN family_quest_details<br/>JOIN family_quests<br/>WHERE child_quests.id = [id]
    DB-->>API: 子供クエスト詳細
    
    alt データが存在しない
        API->>Logger: warn: クエストが見つからない
        API-->>C: 404 Not Found
    else データ存在
        API->>Auth: 子供本人または親権限確認
        
        alt 権限なし
            API->>Logger: warn: 権限なし
            API-->>C: 403 Forbidden
        else 権限あり
            API->>API: レスポンス整形
            API->>Logger: info: 詳細取得完了
            API-->>C: 200 OK<br/>{id, status, title, description, level, reward, ...}
        end
    end
```

## POST /api/quests/family/[familyQuestId]/review-request（完了報告）

```mermaid
sequenceDiagram
    participant C as 子供クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Validate as バリデーション
    participant DB as Database
    participant Lock as 排他ロック
    participant Notify as 通知サービス
    participant Logger as Logger
    
    C->>API: POST /api/quests/family/[familyQuestId]/review-request<br/>{childId}
    
    API->>Logger: info: 完了報告受付
    API->>Auth: 子供ユーザー認証
    Auth-->>API: 子供ユーザー情報
    
    API->>Validate: childId検証
    Validate-->>API: 検証OK
    
    API->>Auth: 本人確認（childId一致）
    
    alt 本人でない
        API->>Logger: warn: 本人以外の報告試行
        API-->>C: 403 Forbidden
    else 本人確認OK
        API->>Lock: 排他ロック取得<br/>child_quests:[familyQuestId]:[childId]
        Lock-->>API: ロック取得成功
        
        API->>DB: SELECT child_quests<br/>WHERE family_quest_detail_id IN<br/>(SELECT id FROM family_quest_details WHERE family_quest_id = xxx)<br/>AND child_id = xxx<br/>FOR UPDATE
        DB-->>API: 現在の子供クエスト
        
        alt ステータスが in_progress でない
            API->>Logger: warn: 不正なステータス遷移
            API->>Lock: ロック解放
            API-->>C: 409 Conflict<br/>{error: "クエストは作業中ではありません"}
        else ステータスが in_progress
            API->>DB: UPDATE child_quests<br/>SET status = 'pending_review',<br/>reported_at = NOW()
            DB-->>API: 更新完了
            
            API->>DB: SELECT 親情報<br/>（family_quests→parent_id）
            DB-->>API: 親プロフィール
            
            API->>Notify: 親に通知送信<br/>type: family_quest_review<br/>title: "{child_name}が完了報告"
            Notify-->>API: 通知送信完了（非同期）
            
            API->>Lock: ロック解放
            API->>Logger: info: 完了報告成功
            API-->>C: 200 OK<br/>{id, status: "pending_review", reported_at}
        end
    end
```

## POST /api/quests/family/[familyQuestId]/cancel-review（報告キャンセル）

```mermaid
sequenceDiagram
    participant C as 子供クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Lock as 排他ロック
    participant Logger as Logger
    
    C->>API: POST /api/quests/family/[familyQuestId]/cancel-review<br/>{childId}
    
    API->>Logger: info: 報告キャンセル受付
    API->>Auth: 子供ユーザー認証
    Auth-->>API: 子供ユーザー情報
    
    API->>Auth: 本人確認（childId一致）
    Auth-->>API: 本人確認OK
    
    API->>Lock: 排他ロック取得
    Lock-->>API: ロック取得成功
    
    API->>DB: SELECT child_quests<br/>WHERE family_quest_detail_id IN ...<br/>AND child_id = xxx<br/>FOR UPDATE
    DB-->>API: 現在の子供クエスト
    
    alt ステータスが pending_review でない
        API->>Logger: warn: キャンセル不可のステータス
        API->>Lock: ロック解放
        API-->>C: 409 Conflict
    else ステータスが pending_review
        API->>DB: UPDATE child_quests<br/>SET status = 'in_progress',<br/>reported_at = NULL
        DB-->>API: 更新完了
        
        API->>Lock: ロック解放
        API->>Logger: info: 報告キャンセル成功
        API-->>C: 200 OK<br/>{id, status: "in_progress"}
    end
```

## POST /api/quests/family/[familyQuestId]/child/[childId]/approve（承認）

```mermaid
sequenceDiagram
    participant P as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Lock as 排他ロック
    participant Reward as 報酬サービス
    participant Notify as 通知サービス
    participant TL as Timeline Service
    participant Logger as Logger
    
    P->>API: POST /api/quests/family/[familyQuestId]/child/[childId]/approve
    
    API->>Logger: info: 承認処理開始
    API->>Auth: 親ユーザー認証
    Auth-->>API: 親ユーザー情報
    
    API->>DB: SELECT family_quests<br/>WHERE id = [familyQuestId]
    DB-->>API: 家族クエスト情報
    
    API->>Auth: 親権限確認（parent_id一致）
    
    alt 親でない
        API->>Logger: warn: 親以外の承認試行
        API-->>C: 403 Forbidden
    else 親確認OK
        API->>Lock: 排他ロック取得
        Lock-->>API: ロック取得成功
        
        API->>DB: BEGIN TRANSACTION
        
        API->>DB: SELECT child_quests<br/>JOIN family_quest_details<br/>WHERE child_id = [childId]<br/>AND family_quest_id = [familyQuestId]<br/>FOR UPDATE
        DB-->>API: 現在の子供クエスト + レベル情報
        
        alt ステータスが pending_review でない
            API->>DB: ROLLBACK
            API->>Lock: ロック解放
            API->>Logger: warn: 承認不可のステータス
            API-->>P: 409 Conflict
        else ステータスが pending_review
            API->>DB: UPDATE child_quests<br/>SET status = 'completed',<br/>completed_at = NOW(),<br/>reviewed_at = NOW()
            DB-->>API: 更新完了
            
            API->>Reward: 報酬付与処理<br/>(childId, reward_amount)
            
            Reward->>DB: INSERT reward_history<br/>(child_id, family_quest_id, amount)
            DB-->>Reward: 報酬履歴作成
            
            Reward->>DB: UPDATE children<br/>SET total_earned += amount,<br/>exp += amount
            DB-->>Reward: 更新完了
            
            Reward->>DB: SELECT children<br/>(level, exp取得)
            DB-->>Reward: 現在のレベルと経験値
            
            Reward->>Reward: レベルアップ判定<br/>(exp >= level * 100)
            
            alt レベルアップ
                Reward->>DB: UPDATE children<br/>SET level = level + 1
                DB-->>Reward: レベルアップ完了
                Reward->>TL: タイムライン投稿<br/>type: level_up
                TL-->>Reward: 投稿完了
            end
            
            Reward-->>API: 報酬付与完了
            
            API->>DB: SELECT family_quest_details<br/>WHERE family_quest_id = xxx<br/>AND level = 現在 + 1
            DB-->>API: 次レベル情報
            
            alt 次レベル存在
                API->>DB: INSERT child_quests<br/>(child_id, family_quest_detail_id,<br/>status: 'not_started')
                DB-->>API: 次レベルクエスト作成
                API->>Notify: 次レベル通知送信
            else 最終レベル
                API->>TL: タイムライン投稿<br/>type: quest_completed
                TL-->>API: 投稿完了
            end
            
            API->>Notify: 子供に承認通知送信<br/>type: quest_report_approved
            Notify-->>API: 通知送信完了
            
            API->>DB: COMMIT
            DB-->>API: トランザクション完了
            
            API->>Lock: ロック解放
            API->>Logger: info: 承認処理完了
            API-->>P: 200 OK<br/>{message: "承認しました"}
        end
    end
```

## POST /api/quests/family/[familyQuestId]/child/[childId]/reject（却下）

```mermaid
sequenceDiagram
    participant P as 親クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Validate as バリデーション
    participant DB as Database
    participant Lock as 排他ロック
    participant Notify as 通知サービス
    participant Logger as Logger
    
    P->>API: POST /api/quests/family/[familyQuestId]/child/[childId]/reject<br/>{reason: "理由（任意）"}
    
    API->>Logger: info: 却下処理開始
    API->>Auth: 親ユーザー認証
    Auth-->>API: 親ユーザー情報
    
    API->>Validate: リクエストボディ検証
    Validate-->>API: 検証OK
    
    API->>DB: SELECT family_quests<br/>WHERE id = [familyQuestId]
    DB-->>API: 家族クエスト情報
    
    API->>Auth: 親権限確認（parent_id一致）
    
    alt 親でない
        API->>Logger: warn: 親以外の却下試行
        API-->>P: 403 Forbidden
    else 親確認OK
        API->>Lock: 排他ロック取得
        Lock-->>API: ロック取得成功
        
        API->>DB: SELECT child_quests<br/>WHERE child_id = [childId]<br/>AND family_quest_detail_id IN ...<br/>FOR UPDATE
        DB-->>API: 現在の子供クエスト
        
        alt ステータスが pending_review でない
            API->>Lock: ロック解放
            API->>Logger: warn: 却下不可のステータス
            API-->>P: 409 Conflict
        else ステータスが pending_review
            API->>DB: UPDATE child_quests<br/>SET status = 'in_progress',<br/>reviewed_at = NOW()
            DB-->>API: 更新完了
            
            API->>Notify: 子供に却下通知送信<br/>type: quest_report_rejected<br/>reason: "{reason}"
            Notify-->>API: 通知送信完了
            
            API->>Lock: ロック解放
            API->>Logger: info: 却下処理完了
            API-->>P: 200 OK<br/>{message: "却下しました"}
        end
    end
```

## エラーハンドリングシーケンス

### 認証エラー

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant Logger as Logger
    
    C->>API: API リクエスト（認証情報なし）
    API->>Auth: ユーザー認証確認
    Auth-->>API: 認証失敗
    API->>Logger: warn: 未認証アクセス
    API-->>C: 401 Unauthorized<br/>{error: "ログインが必要です"}
```

### 権限エラー

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant Auth as 認証チェック
    participant DB as Database
    participant Logger as Logger
    
    C->>API: API リクエスト
    API->>Auth: ユーザー認証確認
    Auth-->>API: 認証成功
    API->>DB: リソース取得
    DB-->>API: データ返却
    API->>Auth: 権限確認
    Auth-->>API: 権限なし
    API->>Logger: warn: 権限なしアクセス
    API-->>C: 403 Forbidden<br/>{error: "権限がありません"}
```

### データベースエラー

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant DB as Database
    participant Logger as Logger
    
    C->>API: API リクエスト
    API->>DB: BEGIN TRANSACTION
    API->>DB: UPDATE child_quests
    DB-->>API: DBエラー（接続切断等）
    API->>DB: ROLLBACK
    API->>Logger: error: DB処理失敗
    API-->>C: 500 Internal Server Error<br/>{error: "一時的なエラーが発生しました"}
```

### ステータス競合エラー

```mermaid
sequenceDiagram
    participant C as クライアント
    participant API as Route Handler
    participant DB as Database
    participant Lock as 排他ロック
    participant Logger as Logger
    
    C->>API: POST /review-request
    API->>Lock: ロック取得
    Lock-->>API: 取得成功
    API->>DB: SELECT FOR UPDATE
    DB-->>API: status: pending_review（既に報告済み）
    API->>API: ステータス検証失敗
    API->>Lock: ロック解放
    API->>Logger: warn: 不正なステータス遷移
    API-->>C: 409 Conflict<br/>{error: "既に完了報告されています"}
```
