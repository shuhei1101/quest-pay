(2026年3月15日 14:30記載)

# ホーム画面の処理フロー図

## 全体の初期表示フロー

```mermaid
flowchart TD
    Start([ユーザーがホーム<br/>画面にアクセス]) --> CheckAuth{認証済み?}
    
    CheckAuth -->|No| RedirectLogin[ログインページへ<br/>リダイレクト]
    RedirectLogin --> End1([終了])
    
    CheckAuth -->|Yes| RenderHome[HomeScreenレンダリング]
    RenderHome --> ParallelFetch[並列データ取得]
    
    ParallelFetch --> FetchUser[useLoginUserInfo<br/>ユーザー情報取得]
    ParallelFetch --> FetchSummary[useHomeSummary<br/>サマリーデータ取得]
    ParallelFetch --> FetchQuests[useRecentQuests<br/>最近のクエスト取得]
    ParallelFetch --> FetchNotifications[useRecentNotifications<br/>最近の通知取得]
    
    FetchUser --> CheckRole{ユーザーロール判定}
    
    CheckRole -->|parent| ParentView[親ビュー表示]
    CheckRole -->|child| ChildView[子供ビュー表示]
    
    ParentView --> DisplayParentCards[親用統計カード表示<br/>総クエスト数・アクティブ・完了]
    ChildView --> DisplayChildCards[子供用統計カード表示<br/>レベル・経験値・報酬]
    
    FetchSummary --> WaitSummary{データ取得完了?}
    WaitSummary -->|No| ShowLoading[LoadingOverlay表示]
    WaitSummary -->|Yes| DisplaySummary[DashboardSummary表示]
    
    DisplaySummary --> DisplayParentCards
    DisplaySummary --> DisplayChildCards
    
    FetchQuests --> DisplayRecentQuests[RecentQuests表示<br/>最大5件]
    FetchNotifications --> DisplayNotifications[RecentNotifications表示<br/>最大5件]
    
    DisplayParentCards --> Complete[画面表示完了]
    DisplayChildCards --> Complete
    DisplayRecentQuests --> Complete
    DisplayNotifications --> Complete
    ShowLoading --> WaitSummary
    
    Complete --> UserInteraction{ユーザー操作}
    
    UserInteraction -->|統計カードクリック| NavigateDetail[詳細ページへ遷移]
    UserInteraction -->|クエストカードクリック| NavigateQuest[クエスト詳細へ遷移]
    UserInteraction -->|通知クリック| NavigateNotification[通知関連ページへ遷移]
    UserInteraction -->|クイックアクション| ExecuteAction[アクション実行]
    UserInteraction -->|もっと見る| NavigateList[一覧ページへ遷移]
    
    NavigateDetail --> End2([ページ遷移])
    NavigateQuest --> End2
    NavigateNotification --> End2
    ExecuteAction --> End2
    NavigateList --> End2
    
    style Start fill:#e1f5e1
    style End1 fill:#ffe1e1
    style End2 fill:#ffe1e1
    style Complete fill:#b8daff
```

## データ取得のシーケンス

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Page as HomeScreen
    participant Auth as useLoginUserInfo
    participant Summary as useHomeSummary
    participant Quests as useRecentQuests
    participant Notifications as useRecentNotifications
    participant API as API Routes
    participant DB as Supabase DB
    participant Cache as QueryClient

    User->>Page: ホーム画面アクセス
    
    par 並列データ取得
        Page->>Auth: ユーザー情報取得
        Auth->>Cache: キャッシュ確認
        
        alt キャッシュあり
            Cache-->>Auth: キャッシュデータ返却
        else キャッシュなし
            Auth->>API: GET /api/users/me
            API->>DB: SELECT * FROM profiles
            DB-->>API: プロフィールデータ
            API-->>Auth: ユーザー情報
            Auth->>Cache: キャッシュ保存
        end
        
        Auth-->>Page: userInfo
        
    and
        Page->>Summary: サマリー取得
        Summary->>Cache: キャッシュ確認
        
        alt キャッシュあり & fresh
            Cache-->>Summary: キャッシュデータ返却
        else キャッシュなし or stale
            Summary->>API: GET /api/home/summary
            API->>DB: 複数のSELECT・集計クエリ
            DB-->>API: 集計結果
            API-->>Summary: サマリーデータ
            Summary->>Cache: キャッシュ保存 (staleTime: 5分)
        end
        
        Summary-->>Page: summary
        
    and
        Page->>Quests: 最近のクエスト取得
        Quests->>Cache: キャッシュ確認
        
        alt キャッシュあり
            Cache-->>Quests: キャッシュデータ返却
        else キャッシュなし
            Quests->>API: GET /api/quests/recent
            API->>DB: SELECT * FROM child_quests<br/>ORDER BY updated_at DESC LIMIT 10
            DB-->>API: 最近のクエスト
            API-->>Quests: クエストデータ
            Quests->>Cache: キャッシュ保存
        end
        
        Quests-->>Page: recentQuests
        
    and
        Page->>Notifications: 最近の通知取得
        Notifications->>Cache: キャッシュ確認
        
        alt キャッシュあり
            Cache-->>Notifications: キャッシュデータ返却
        else キャッシュなし
            Notifications->>API: GET /api/notifications/recent
            API->>DB: SELECT * FROM notifications<br/>ORDER BY created_at DESC LIMIT 10
            DB-->>API: 最近の通知
            API-->>Notifications: 通知データ
            Notifications->>Cache: キャッシュ保存
        end
        
        Notifications-->>Page: notifications
    end
    
    Page->>Page: ロールに応じたビューレンダリング
    Page-->>User: ホーム画面表示
```

## ユーザーロール別の表示フロー

```mermaid
stateDiagram-v2
    [*] --> CheckRole: ホーム画面表示
    
    CheckRole --> ParentView: role === "parent"
    CheckRole --> ChildView: role === "child"
    
    state ParentView {
        [*] --> ShowParentStats: 親用統計カード表示
        ShowParentStats --> StatCard1: 総クエスト数
        ShowParentStats --> StatCard2: アクティブクエスト数
        ShowParentStats --> StatCard3: 完了済みクエスト数
        ShowParentStats --> ActionCard: 新規クエスト作成
        
        StatCard1 --> [*]
        StatCard2 --> [*]
        StatCard3 --> [*]
        ActionCard --> CreateQuest: クリック時
        CreateQuest --> [*]: 新規作成画面へ遷移
    }
    
    state ChildView {
        [*] --> ShowChildStats: 子供用統計カード表示
        ShowChildStats --> StatCard4: 現在のレベル
        ShowChildStats --> StatCard5: 経験値
        ShowChildStats --> StatCard6: 獲得報酬額
        ShowChildStats --> ActionCard2: クエスト探す
        
        StatCard4 --> [*]
        StatCard5 --> [*]
        StatCard6 --> [*]
        ActionCard2 --> SearchQuest: クリック時
        SearchQuest --> [*]: クエスト一覧へ遷移
    }
    
    ParentView --> ShowCommon: 共通コンテンツ表示
    ChildView --> ShowCommon
    
    state ShowCommon {
        [*] --> RecentQuests: 最近のクエスト
        [*] --> RecentNotifications: 最近の通知
        
        RecentQuests --> QuestCard: クリック
        QuestCard --> [*]: クエスト詳細へ
        
        RecentNotifications --> NotificationItem: クリック
        NotificationItem --> [*]: 通知関連ページへ
    }
    
    ShowCommon --> [*]
```

## クイックアクションフロー

```mermaid
flowchart TD
    Start([ユーザーが<br/>クイックアクション選択]) --> CheckRole{ユーザーロール}
    
    CheckRole -->|parent| ParentActions[親用アクション]
    CheckRole -->|child| ChildActions[子供用アクション]
    
    ParentActions --> ParentAction1{アクション種類}
    ParentAction1 -->|新規クエスト作成| CreateQuest[新規作成画面へ遷移<br/>FAMILY_QUEST_NEW_URL]
    ParentAction1 -->|子供管理| ManageChildren[子供管理画面へ遷移<br/>CHILD_MANAGEMENT_URL]
    
    ChildActions --> ChildAction1{アクション種類}
    ChildAction1 -->|クエスト探す| SearchQuest[クエスト一覧へ遷移<br/>FAMILY_QUEST_LIST_URL]
    ChildAction1 -->|報酬確認| CheckRewards[報酬履歴画面へ遷移<br/>REWARD_HISTORY_URL]
    
    CreateQuest --> ValidatePermission{権限チェック}
    ManageChildren --> ValidatePermission
    SearchQuest --> ValidatePermission
    CheckRewards --> ValidatePermission
    
    ValidatePermission -->|OK| Navigate[ページ遷移実行]
    ValidatePermission -->|NG| ShowError[エラーメッセージ表示]
    
    Navigate --> End1([遷移完了])
    ShowError --> End2([エラー表示])
    
    style Start fill:#e1f5e1
    style End1 fill:#b8daff
    style End2 fill:#f5c6cb
```

## 統計データの集計フロー

```mermaid
flowchart TD
    Start([サマリーデータ<br/>取得リクエスト]) --> GetUserInfo[ユーザー情報取得]
    
    GetUserInfo --> CheckRole{ユーザーロール判定}
    
    CheckRole -->|parent| ParentAggregation[親用集計処理]
    CheckRole -->|child| ChildAggregation[子供用集計処理]
    
    ParentAggregation --> QueryFamilyQuests[family_quests集計<br/>COUNT, GROUP BY status]
    QueryFamilyQuests --> QueryChildProgress[子供の進捗集計<br/>child_quests集計]
    QueryChildProgress --> QueryRewardHistory[報酬履歴集計<br/>reward_history集計]
    
    ChildAggregation --> QueryChildQuests[child_quests集計<br/>自分のクエスト]
    QueryChildQuests --> QueryRewards[獲得報酬合計<br/>reward_history集計]
    QueryRewards --> QueryLevel[レベル・経験値取得<br/>profiles.level, experience]
    
    QueryRewardHistory --> AggregateParent[親用データ整形]
    QueryLevel --> AggregateChild[子供用データ整形]
    
    AggregateParent --> ReturnData[サマリーデータ返却]
    AggregateChild --> ReturnData
    
    ReturnData --> CacheData[QueryClientに<br/>5分間キャッシュ]
    CacheData --> End([終了])
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
```

## 最近のクエスト表示フロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Component as RecentQuests
    participant Hook as useRecentQuests
    participant API as GET /api/quests/recent
    participant DB as Supabase DB

    User->>Component: ホーム画面表示
    Component->>Hook: クエスト取得
    Hook->>API: GET リクエスト
    
    API->>API: getAuthContext()
    API->>DB: SELECT * FROM child_quests<br/>WHERE profile_id = ?<br/>ORDER BY updated_at DESC<br/>LIMIT 10
    DB-->>API: 最近のクエスト
    
    API->>API: データ整形<br/>status, reward, dueDateを含む
    API-->>Hook: クエストデータ
    
    Hook-->>Component: recentQuests
    
    Component->>Component: slice(0, 5) で最大5件
    Component->>Component: QuestCard生成
    Component-->>User: クエスト一覧表示
    
    User->>Component: クエストカードクリック
    Component->>Component: router.push(`/quests/${quest.id}`)
    Component-->>User: クエスト詳細画面へ遷移
```

## 通知表示フロー

```mermaid
flowchart TD
    Start([通知データ取得開始]) --> FetchNotifications[GET /api/notifications/recent]
    
    FetchNotifications --> QueryDB[SELECT * FROM notifications<br/>WHERE profile_id = ?<br/>ORDER BY created_at DESC<br/>LIMIT 10]
    
    QueryDB --> SortPriority[未読通知を優先ソート]
    
    SortPriority --> CheckUnread{未読通知あり?}
    
    CheckUnread -->|Yes| UnreadFirst[未読を先頭配置<br/>is_read = false]
    CheckUnread -->|No| AllRead[既読のみ表示]
    
    UnreadFirst --> SliceData[最大5件に制限<br/>slice 0, 5]
    AllRead --> SliceData
    
    SliceData --> MapToComponents[NotificationItem生成<br/>type別のアイコン設定]
    
    MapToComponents --> DisplayList[通知一覧表示]
    
    DisplayList --> UserClick{ユーザー操作}
    
    UserClick -->|通知クリック| MarkAsRead[既読化処理<br/>UPDATE notifications<br/>SET is_read = true]
    UserClick -->|もっと見る| NavigateList[通知一覧ページへ遷移]
    
    MarkAsRead --> NavigateRelated[関連ページへ遷移]
    NavigateRelated --> End1([終了])
    NavigateList --> End2([ページ遷移])
    
    style Start fill:#e1f5e1
    style End1 fill:#b8daff
    style End2 fill:#b8daff
```

## キャッシュ戦略のフロー

```mermaid
flowchart TD
    Start([データ取得リクエスト]) --> CheckCache{QueryClient<br/>キャッシュあり?}
    
    CheckCache -->|なし| FetchFromServer[サーバーから取得]
    CheckCache -->|あり| CheckStale{キャッシュが<br/>stale?}
    
    CheckStale -->|Yes| BackgroundRevalidate[バックグラウンドで<br/>再検証]
    CheckStale -->|No| ReturnCache[キャッシュデータ返却]
    
    BackgroundRevalidate --> ReturnCache
    BackgroundRevalidate --> FetchFromServer
    
    FetchFromServer --> APICall[API呼び出し]
    APICall --> DBQuery[DB クエリ実行]
    DBQuery --> ProcessData[データ整形]
    ProcessData --> UpdateCache[キャッシュ更新]
    
    UpdateCache --> SetStaleTime{staleTime設定}
    
    SetStaleTime -->|homeSummary| Stale5Min[5分間fresh]
    SetStaleTime -->|recentQuests| StaleDefault[デフォルト<br/>staleTime]
    SetStaleTime -->|notifications| StaleDefault
    
    Stale5Min --> ReturnData[データ返却]
    StaleDefault --> ReturnData
    ReturnCache --> ReturnData
    
    ReturnData --> End([終了])
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    Start([データ取得中]) --> CheckError{エラー発生?}
    
    CheckError -->|なし| Success[データ取得成功]
    CheckError -->|あり| DetermineType{エラータイプ}
    
    DetermineType -->|401 Unauthorized| AuthError[認証エラー]
    DetermineType -->|Network Error| NetworkError[ネットワークエラー]
    DetermineType -->|Server Error| ServerError[サーバーエラー]
    
    AuthError --> RedirectLogin[ログインページへ<br/>リダイレクト]
    NetworkError --> ShowRetry[リトライボタン表示<br/>"再読み込み"]
    ServerError --> ShowError[エラーメッセージ表示<br/>"データ取得失敗"]
    
    ShowRetry --> UserRetry{ユーザーが<br/>リトライ?}
    UserRetry -->|Yes| Start
    UserRetry -->|No| ShowFallback[フォールバックUI表示]
    
    ShowError --> ShowFallback
    
    Success --> End1([正常終了])
    RedirectLogin --> End2([ログイン画面])
    ShowFallback --> End3([エラー状態])
    
    style Start fill:#e1f5e1
    style Success fill:#c3e6cb
    style End1 fill:#b8daff
    style End2 fill:#ffe1e1
    style End3 fill:#f5c6cb
    style AuthError fill:#f5c6cb
    style NetworkError fill:#f5c6cb
    style ServerError fill:#f5c6cb
```

## レスポンシブ表示フロー

```mermaid
stateDiagram-v2
    [*] --> DetectScreenSize: 画面サイズ検出
    
    DetectScreenSize --> Mobile: width < 768px
    DetectScreenSize --> Tablet: 768px ≤ width < 1024px
    DetectScreenSize --> Desktop: width ≥ 1024px
    
    state Mobile {
        [*] --> Layout1Column: 1列レイアウト
        Layout1Column --> Stack1: 統計カード縦並び
        Stack1 --> List1: クエスト・通知も縦並び
    }
    
    state Tablet {
        [*] --> Layout2Column: 2列レイアウト
        Layout2Column --> Grid2: 統計カード 2x2
        Grid2 --> List2: クエスト・通知は1列
    }
    
    state Desktop {
        [*] --> Layout4Column: 4列レイアウト
        Layout4Column --> Grid4: 統計カード 1x4
        Grid4 --> List3: クエスト・通知は広く表示
    }
    
    Mobile --> Rendered: レンダリング完了
    Tablet --> Rendered
    Desktop --> Rendered
    
    Rendered --> [*]
```

## データリフレッシュのタイミング

```mermaid
gantt
    title ホーム画面のデータリフレッシュサイクル
    dateFormat s
    axisFormat %S秒

    section 初期表示
    ページアクセス              :done, 0, 1s
    並列データ取得              :active, 1s, 2s
    UI表示                     :active, 3s, 1s

    section キャッシュ期間
    キャッシュfresh (5分間)     :crit, 4s, 300s
    バックグラウンド再検証      :active, 304s, 2s

    section ユーザー操作
    クエスト完了後の再取得      :milestone, 150s, 0s
    通知クリック後の既読化      :milestone, 200s, 0s
```
