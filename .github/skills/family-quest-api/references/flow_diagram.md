(2026年3月記載)

# 家族クエストライフサイクル フロー図

## クエスト全体のライフサイクル

```mermaid
flowchart TD
    Start([親がクエスト作成]) --> CreateQuest[family_quests作成]
    CreateQuest --> CreateDetails[family_quest_details作成<br/>レベル1-n]
    CreateDetails --> WaitingChild{子供が受注?}
    
    WaitingChild -->|受注| CreateChildQuest[child_quests作成<br/>status: not_started]
    WaitingChild -->|公開| PublishQuest[public_quests作成<br/>is_active: true]
    WaitingChild -->|待機| WaitingChild
    
    CreateChildQuest --> ChildStart[子供: クエスト開始<br/>status: in_progress<br/>started_at設定]
    ChildStart --> ChildWorking{子供が作業中}
    
    ChildWorking -->|完了報告| ReportComplete[status: pending_review<br/>reported_at設定]
    ChildWorking -->|リセット| CreateChildQuest
    
    ReportComplete --> ParentReview{親が確認}
    
    ParentReview -->|承認| Approve[status: completed<br/>completed_at設定<br/>reviewed_at設定]
    ParentReview -->|却下| Reject[status: in_progress<br/>reviewed_at設定]
    
    Reject --> ChildWorking
    
    Approve --> RewardGiven[報酬付与<br/>reward_history作成]
    RewardGiven --> CheckLevel{レベルアップ?}
    
    CheckLevel -->|次レベルあり| NextLevel[次レベルの<br/>child_quests作成]
    CheckLevel -->|最終レベル| QuestCleared[クエストクリア<br/>通知・タイムライン投稿]
    
    NextLevel --> ChildStart
    QuestCleared --> End([完了])
    
    PublishQuest --> PublicActive{公開中}
    PublicActive -->|他家族が採用| AdoptQuest[採用元に<br/>family_quests作成]
    PublicActive -->|非公開化| Deactivate[is_active: false]
    AdoptQuest --> CreateDetails
    Deactivate --> End
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style Approve fill:#c3e6cb
    style Reject fill:#f5c6cb
    style QuestCleared fill:#b8daff
```

## 子供クエストステータス遷移詳細

```mermaid
stateDiagram-v2
    [*] --> not_started: 子供がクエスト受注
    
    not_started --> in_progress: 子供: 開始ボタン押下<br/>(started_at設定)
    
    in_progress --> pending_review: 子供: 完了報告<br/>(reported_at設定)
    in_progress --> not_started: 子供: リセット
    
    pending_review --> completed: 親: 承認<br/>(completed_at, reviewed_at設定)
    pending_review --> in_progress: 親: 却下<br/>(reviewed_at設定)
    
    completed --> [*]: 報酬付与後、次レベルまたは終了
    
    note right of not_started
        未着手状態
        started_at: null
    end note
    
    note right of in_progress
        進行中
        started_at: 設定済み
        completed_at: null
    end note
    
    note right of pending_review
        報告中（承認待ち）
        reported_at: 設定済み
        reviewed_at: null
    end note
    
    note right of completed
        完了
        completed_at: 設定済み
        reviewed_at: 設定済み
    end note
```

## API呼び出しフロー

### クエスト作成フロー
```mermaid
sequenceDiagram
    participant P as 親（クライアント）
    participant API as POST /api/quests/family
    participant DB as Database
    participant TL as Timeline
    
    P->>API: クエスト情報（title, description, levels）
    API->>DB: family_quests作成
    API->>DB: family_quest_details作成（各レベル）
    DB-->>API: 作成完了
    API->>TL: タイムライン投稿（quest_created）
    API-->>P: クエスト情報返却
```

### クエスト受注～完了フロー
```mermaid
sequenceDiagram
    participant C as 子供（クライアント）
    participant P as 親（クライアント）
    participant API as API
    participant DB as Database
    participant N as Notification
    
    Note over C: 1. クエスト受注
    C->>API: GET /api/quests/family/[id]/child/[childId]
    API->>DB: child_quests作成（not_started）
    DB-->>C: 子供クエスト返却
    
    Note over C: 2. クエスト開始
    C->>API: PUT child_quests（status: in_progress）
    API->>DB: started_at設定
    DB-->>C: 更新完了
    
    Note over C: 3. 完了報告
    C->>API: POST /api/quests/family/[id]/review-request
    API->>DB: child_quests（status: pending_review）
    API->>DB: reported_at設定
    API->>N: 親に通知（family_quest_review）
    DB-->>C: 報告完了
    N-->>P: プッシュ通知
    
    Note over P: 4a. 承認
    P->>API: POST /api/quests/family/[id]/child/[childId]/approve
    API->>DB: child_quests（status: completed）
    API->>DB: completed_at, reviewed_at設定
    API->>DB: reward_history作成
    API->>DB: children（total_earned, exp更新）
    API->>N: 子供に通知（quest_report_approved）
    DB-->>P: 承認完了
    N-->>C: プッシュ通知
    
    Note over P: 4b. 却下
    P->>API: POST /api/quests/family/[id]/child/[childId]/reject
    API->>DB: child_quests（status: in_progress）
    API->>DB: reviewed_at設定
    API->>N: 子供に通知（quest_report_rejected）
    DB-->>P: 却下完了
    N-->>C: プッシュ通知
```

### クエスト公開フロー
```mermaid
sequenceDiagram
    participant P as 親（クライアント）
    participant API as POST /api/quests/family/[id]/publish
    participant DB as Database
    participant TL as Public Timeline
    
    P->>API: クエストID
    API->>DB: public_quests作成<br/>（is_active: true）
    DB-->>API: 公開完了
    API->>TL: 公開タイムライン投稿<br/>（quest_published）
    API-->>P: 公開クエスト情報返却
```

## 処理の注意点

### トランザクション必須箇所
1. **クエスト作成**: family_quests + family_quest_details（複数レベル）
2. **承認処理**: child_quests更新 + reward_history作成 + children更新
3. **レベルアップ**: children更新 + 次レベルchild_quests作成

### 排他制御が必要な処理
1. **承認/却下**: 同時に複数の親が操作しないように排他制御
2. **報酬付与**: total_earnedの加算処理

### 非同期処理推奨
1. **通知送信**: API応答を遅延させない
2. **タイムライン投稿**: メイン処理と並行実行
