(2026年3月記載)

# 報酬システム フロー図

## 報酬付与フロー（クエスト承認時）

```mermaid
flowchart TD
    Start([親がクエスト承認]) --> FetchQuestChild[子供クエスト取得]
    FetchQuestChild --> FetchChild[子供情報取得]
    FetchChild --> FetchDetail[現在レベル詳細取得]
    
    FetchDetail --> CalcCompletion{達成回数計算}
    CalcCompletion -->|達成回数+1| CheckCompletion{達成条件到達?}
    
    CheckCompletion -->|未到達| UpdateCount[達成回数のみ更新]
    UpdateCount --> Notify1[承認通知]
    Notify1 --> End1([完了])
    
    CheckCompletion -->|到達| CalcClear[クリア回数+1]
    CalcClear --> CheckClear{次レベル到達?}
    
    CheckClear -->|未到達| ClearReward[報酬・経験値付与]
    ClearReward --> RecordClear[報酬履歴記録<br/>type: quest]
    RecordClear --> UpdateClearCount[クリア回数更新<br/>達成回数リセット]
    UpdateClearCount --> NotifyClear[クリア通知]
    NotifyClear --> End2([完了])
    
    CheckClear -->|到達| CheckMaxLevel{最大レベル?}
    
    CheckMaxLevel -->|Lv5到達| CompleteReward[報酬・経験値付与]
    CompleteReward --> RecordComplete[報酬履歴記録<br/>type: quest]
    RecordComplete --> SetCompleted[status: completed]
    SetCompleted --> NotifyComplete[完全クリア通知]
    NotifyComplete --> End3([完了])
    
    CheckMaxLevel -->|次レベルあり| LevelUpReward[報酬・経験値付与]
    LevelUpReward --> RecordLevelUp[報酬履歴記録<br/>type: quest_level_up]
    RecordLevelUp --> LevelUp[レベル+1<br/>達成・クリア回数リセット]
    LevelUp --> CheckChildLevel{子供レベル判定}
    
    CheckChildLevel -->|TODO実装| ChildLevelUp[子供レベルアップ]
    ChildLevelUp --> NotifyLevelUp[レベルアップ通知]
    CheckChildLevel -->|現状| NotifyLevelUp
    NotifyLevelUp --> End4([完了])
    
    style Start fill:#e1f5e1
    style End1 fill:#ffe1e1
    style End2 fill:#ffe1e1
    style End3 fill:#ffe1e1
    style End4 fill:#ffe1e1
    style LevelUpReward fill:#c3e6cb
    style CompleteReward fill:#b8daff
```

## 報酬履歴取得フロー

```mermaid
flowchart TD
    Start([GET /api/children/[id]/reward/histories]) --> Auth[認証チェック]
    Auth --> FetchUser[ユーザー情報取得]
    FetchUser --> FetchChild[子供情報取得]
    FetchChild --> CheckFamily{家族一致?}
    
    CheckFamily -->|不一致| Error[エラー: 権限なし]
    CheckFamily -->|一致| GetParam[クエリパラメータ取得<br/>yearMonth]
    
    GetParam --> FetchHistories[報酬履歴取得<br/>fetchRewardHistories]
    FetchHistories --> FetchStats[月別統計取得<br/>fetchRewardHistoryMonthlyStats]
    
    FetchStats --> Response[レスポンス返却<br/>histories + monthlyStats]
    Response --> End([完了])
    
    Error --> End
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style Error fill:#f5c6cb
```

## 報酬支払い完了フロー

```mermaid
flowchart TD
    Start([POST /api/children/[id]/reward/pay/complete]) --> Auth[認証チェック]
    Auth --> FetchUser[ユーザー情報取得]
    FetchUser --> FetchChild[子供情報取得]
    FetchChild --> CheckFamily{家族一致?}
    
    CheckFamily -->|不一致| Error1[エラー: 権限なし]
    CheckFamily -->|一致| CheckUserType{ユーザータイプ?}
    
    CheckUserType -->|parent| Error2[エラー: 子供のみ実行可]
    CheckUserType -->|child| CheckOwner{自分の報酬?}
    
    CheckOwner -->|他人| Error3[エラー: 自分の報酬のみ]
    CheckOwner -->|自分| UpdateStatus[報酬履歴更新<br/>is_paid: true<br/>paid_at: now]
    
    UpdateStatus --> Response[レスポンス返却<br/>success: true]
    Response --> End([完了])
    
    Error1 --> End
    Error2 --> End
    Error3 --> End
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style Error1 fill:#f5c6cb
    style Error2 fill:#f5c6cb
    style Error3 fill:#f5c6cb
```

## レベルアップ判定ロジック

```mermaid
flowchart TD
    Start([承認処理開始]) --> GetCounts[現在の達成・クリア回数取得]
    GetCounts --> NextCompletion[次の達成回数 = current + 1]
    NextCompletion --> CheckReqCompletion{達成回数 >= 必要達成回数?}
    
    CheckReqCompletion -->|No| UpdateCompletionOnly[達成回数のみ更新]
    UpdateCompletionOnly --> End1([完了: 承認通知])
    
    CheckReqCompletion -->|Yes| NextClear[次のクリア回数 = current + 1]
    NextClear --> CheckReqClear{クリア回数 >= 必要クリア回数?}
    
    CheckReqClear -->|No| GrantReward1[報酬・経験値付与]
    GrantReward1 --> UpdateClear[クリア回数更新<br/>達成回数リセット]
    UpdateClear --> End2([完了: クリア通知])
    
    CheckReqClear -->|Yes| CheckNull{必要クリア回数 = null?}
    
    CheckNull -->|Yes 最大Lv| GrantReward2[報酬・経験値付与]
    GrantReward2 --> SetCompleted[status: completed]
    SetCompleted --> End3([完了: 完全クリア通知])
    
    CheckNull -->|No 次Lvあり| GrantReward3[報酬・経験値付与]
    GrantReward3 --> LevelUp[level + 1<br/>達成・クリア回数リセット]
    LevelUp --> End4([完了: レベルアップ通知])
    
    style Start fill:#e1f5e1
    style End1 fill:#ffeaa7
    style End2 fill:#74b9ff
    style End3 fill:#a29bfe
    style End4 fill:#55efc4
```

## 報酬計算と更新の詳細

```mermaid
sequenceDiagram
    participant A as approveReport
    participant DB as Database
    participant C as children table
    participant RH as reward_histories
    participant QC as quest_children
    
    A->>DB: BEGIN TRANSACTION
    A->>QC: fetch quest_child
    A->>C: fetch child
    A->>DB: fetch quest_detail
    
    Note over A: 達成回数・クリア回数計算
    
    alt 報酬付与条件満たす
        A->>C: UPDATE children<br/>current_savings += reward<br/>total_exp += exp
        A->>RH: INSERT reward_history<br/>(type, title, amount, exp, url)
    end
    
    A->>QC: UPDATE quest_children<br/>(status, level, counts)
    
    A->>DB: COMMIT
```
