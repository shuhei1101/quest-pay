(2026年3月記載)

# 報酬API シーケンス図

## POST /api/children/[id]/reward/pay/complete - 報酬支払い完了

```mermaid
sequenceDiagram
    participant Client
    participant API as POST /api/children/[id]/reward/pay/complete
    participant Auth as getAuthContext
    participant UserQ as fetchUserInfoByUserId
    participant ChildQ as fetchChild
    participant DB as updateRewardHistoriesPaymentStatus
    
    Client->>API: POST { yearMonth: "2026-03" }
    API->>Auth: 認証情報取得
    Auth-->>API: { db, userId }
    
    API->>UserQ: fetchUserInfoByUserId({ userId, db })
    UserQ-->>API: userInfo { profiles, families }
    
    alt 家族ID取得失敗
        API-->>Client: Error 500: 家族IDの取得に失敗
    end
    
    API->>ChildQ: fetchChild({ db, childId })
    ChildQ-->>API: child { children, profiles }
    
    alt 子供情報取得失敗
        API-->>Client: Error 500: 子供情報の取得に失敗
    end
    
    alt 家族不一致
        API-->>Client: Error 500: 同じ家族に所属していません
    end
    
    alt 親ユーザーの場合
        API-->>Client: Error 500: 子供ユーザのみ実行可能
    end
    
    alt 他の子供の報酬
        API-->>Client: Error 500: 自分自身の報酬のみ受取可能
    end
    
    API->>DB: updateRewardHistoriesPaymentStatus({<br/>  childId, yearMonth,<br/>  isPaid: true, paidAt: now<br/>})
    DB-->>API: success
    
    API-->>Client: 200 { success: true }
```

## GET /api/children/[id]/reward/histories - 報酬履歴取得

```mermaid
sequenceDiagram
    participant Client
    participant API as GET /api/children/[id]/reward/histories
    participant Auth as getAuthContext
    participant UserQ as fetchUserInfoByUserId
    participant ChildQ as fetchChild
    participant HistQ as fetchRewardHistories
    participant StatsQ as fetchRewardHistoryMonthlyStats
    
    Client->>API: GET ?yearMonth=2026-03
    API->>Auth: 認証情報取得
    Auth-->>API: { db, userId }
    
    API->>UserQ: fetchUserInfoByUserId({ userId, db })
    UserQ-->>API: userInfo { profiles, families }
    
    alt 家族ID取得失敗
        API-->>Client: Error 500: 家族IDの取得に失敗
    end
    
    API->>ChildQ: fetchChild({ db, childId })
    ChildQ-->>API: child { children, profiles }
    
    alt 子供情報取得失敗
        API-->>Client: Error 500: 子供情報の取得に失敗
    end
    
    alt 家族不一致
        API-->>Client: Error 500: 同じ家族に所属していません
    end
    
    API->>HistQ: fetchRewardHistories({<br/>  db, childId, yearMonth<br/>})
    HistQ-->>API: histories[]
    
    API->>StatsQ: fetchRewardHistoryMonthlyStats({<br/>  db, childId<br/>})
    StatsQ-->>API: monthlyStats[]
    
    API-->>Client: 200 {<br/>  histories,<br/>  monthlyStats<br/>}
```

## approveReport (内部) - クエスト承認時の報酬付与

```mermaid
sequenceDiagram
    participant API as PUT /api/quests/family/[id]/child/[childId]/approve
    participant Service as approveReport
    participant DB as Database
    participant QC as quest_children
    participant C as children
    participant RH as reward_histories
    participant N as notifications
    
    API->>Service: approveReport({<br/>  db, familyQuestId, childId,<br/>  responseMessage, profileId, updatedAt<br/>})
    
    Service->>DB: BEGIN TRANSACTION
    
    Service->>QC: fetchChildQuest({ db, familyQuestId, childId })
    QC-->>Service: questChild { children, details, quest }
    
    Service->>C: fetchChild({ db, childId })
    C-->>Service: child { children, profiles }
    
    Note over Service: 達成回数計算<br/>nextCompletionCount = current + 1
    Note over Service: クリア到達判定<br/>isCompletionAchieved = nextCount >= required
    Note over Service: レベルアップ判定<br/>isClearAchieved = clearCount >= requiredClear
    
    alt 達成回数未到達
        Service->>QC: UPDATE quest_children<br/>SET current_completion_count++
        Service->>N: INSERT notification<br/>type: quest_report_approved
    else 達成到達 & クリア未到達
        Service->>C: UPDATE children<br/>current_savings += reward<br/>total_exp += exp
        Service->>RH: INSERT reward_history<br/>type: quest, title, amount, exp, url
        Service->>QC: UPDATE quest_children<br/>current_clear_count++<br/>current_completion_count = 0
        Service->>N: INSERT notification<br/>type: quest_cleared
    else 達成到達 & クリア到達 & 最大レベル
        Service->>C: UPDATE children<br/>current_savings += reward<br/>total_exp += exp
        Service->>RH: INSERT reward_history<br/>type: quest, title, amount, exp, url
        Service->>QC: UPDATE quest_children<br/>status = 'completed'
        Service->>N: INSERT notification<br/>type: quest_completed
    else 達成到達 & クリア到達 & 次レベルあり
        Service->>C: UPDATE children<br/>current_savings += reward<br/>total_exp += exp
        Service->>RH: INSERT reward_history<br/>type: quest_level_up, title, amount, exp, url
        Service->>QC: UPDATE quest_children<br/>level++<br/>current_clear_count = 0<br/>current_completion_count = 0
        Service->>N: INSERT notification<br/>type: quest_level_up
    end
    
    Service->>DB: COMMIT
    Service-->>API: success
```

## レベル計算ロジック（TODO実装予定）

```mermaid
sequenceDiagram
    participant S as Service
    participant C as children table
    participant LevelCalc as calculateChildLevel
    
    Note over S: 経験値加算後
    S->>C: fetch child.total_exp
    C-->>S: total_exp
    
    S->>LevelCalc: calculateChildLevel(total_exp)
    Note over LevelCalc: 経験値テーブル参照<br/>（未実装）
    LevelCalc-->>S: new_level
    
    alt レベルアップした場合
        S->>C: UPDATE children<br/>SET current_level = new_level
        Note over S: 報酬履歴記録<br/>type: level_up
        Note over S: レベルアップ通知送信
    end
```

## 年齢別/レベル別報酬設定取得

```mermaid
sequenceDiagram
    participant Client
    participant API as GET /api/reward/by-age/table
    participant Auth as getAuthContext
    participant UserQ as fetchUserInfoByUserId
    participant TableQ as fetchFamilyAgeRewardTable
    participant RewardQ as fetchAgeRewards
    
    Client->>API: GET
    API->>Auth: 認証情報取得
    Auth-->>API: { db, userId }
    
    API->>UserQ: fetchUserInfoByUserId({ userId, db })
    UserQ-->>API: userInfo { profiles, families }
    
    API->>TableQ: fetchFamilyAgeRewardTable({<br/>  db, familyId<br/>})
    TableQ-->>API: ageRewardTable { id }
    
    API->>RewardQ: fetchAgeRewards({<br/>  db, ageRewardTableId,<br/>  type: "family"<br/>})
    RewardQ-->>API: rewards[]
    
    API-->>Client: 200 { rewards }
```
