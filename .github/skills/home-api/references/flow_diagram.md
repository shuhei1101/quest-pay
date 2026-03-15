(2026年3月15日 14:30記載)

# ホームダッシュボード データ集約フロー図

## ダッシュボードデータ取得フロー

```mermaid
flowchart TD
    Start([ダッシュボード表示リクエスト]) --> CheckAuth{認証確認}
    
    CheckAuth -->|未認証| RedirectLogin[ログイン画面へリダイレクト]
    CheckAuth -->|認証済| CheckRole{ロール確認}
    
    CheckRole -->|親| ParentDashboard[親ダッシュボード]
    CheckRole -->|子供| ChildDashboard[子供ダッシュボード]
    
    ParentDashboard --> FetchFamilyInfo[家族情報取得<br/>families]
    FetchFamilyInfo --> FetchChildren[子供一覧取得<br/>children]
    
    FetchChildren --> ParallelFetch{並列データ取得}
    
    ParallelFetch -->|統計| FetchStats[統計情報集約]
    ParallelFetch -->|クエスト| FetchRecentQuests[最近のクエスト取得]
    ParallelFetch -->|通知| FetchNotifications[通知取得]
    ParallelFetch -->|タイムライン| FetchTimeline[タイムライン取得]
    
    FetchStats --> CalcChildrenCount[子供数カウント]
    FetchStats --> CalcActiveQuests[進行中クエスト数<br/>child_quests<br/>status: in_progress]
    FetchStats --> CalcPendingReview[完了待ちクエスト数<br/>child_quests<br/>status: pending_review]
    FetchStats --> CalcUnreadNotif[未読通知数<br/>notifications<br/>is_read: false]
    
    CalcChildrenCount --> AggregateStats[統計データ集約]
    CalcActiveQuests --> AggregateStats
    CalcPendingReview --> AggregateStats
    CalcUnreadNotif --> AggregateStats
    
    FetchRecentQuests --> JoinQuests[クエスト結合<br/>child_quests + family_quests<br/>+ children]
    JoinQuests --> LimitQuests[上位5件取得<br/>ORDER BY updated_at DESC]
    
    FetchNotifications --> FilterUnread[未読優先ソート<br/>is_read: false + created_at DESC]
    FilterUnread --> LimitNotifications[上位10件取得]
    
    FetchTimeline --> JoinTimeline[タイムライン結合<br/>timeline_posts + children<br/>+ family_quests]
    JoinTimeline --> LimitTimeline[上位10件取得<br/>ORDER BY created_at DESC]
    
    AggregateStats --> MergeData[データ統合]
    LimitQuests --> MergeData
    LimitNotifications --> MergeData
    LimitTimeline --> MergeData
    
    MergeData --> ReturnParent[親ダッシュボードレスポンス]
    ReturnParent --> End([表示])
    
    ChildDashboard --> FetchChildInfo[子供情報取得<br/>children]
    FetchChildInfo --> ChildParallel{並列データ取得}
    
    ChildParallel -->|クエスト| FetchChildQuests[自分のクエスト取得<br/>child_quests<br/>child_id = current_child]
    ChildParallel -->|統計| FetchChildStats[自分の統計<br/>total_earned, level, exp]
    ChildParallel -->|通知| FetchChildNotif[自分の通知<br/>notifications<br/>recipient_id = current_child]
    
    FetchChildQuests --> FilterByStatus{ステータス別集計}
    FilterByStatus -->|進行中| CountInProgress[in_progress カウント]
    FilterByStatus -->|完了待ち| CountPending[pending_review カウント]
    FilterByStatus -->|完了| CountCompleted[completed カウント]
    
    CountInProgress --> AggregateChild[子供統計集約]
    CountPending --> AggregateChild
    CountCompleted --> AggregateChild
    FetchChildStats --> AggregateChild
    
    FetchChildNotif --> FilterChildUnread[未読優先ソート]
    FilterChildUnread --> LimitChildNotif[上位10件取得]
    
    AggregateChild --> MergeChildData[データ統合]
    LimitChildNotif --> MergeChildData
    
    MergeChildData --> ReturnChild[子供ダッシュボードレスポンス]
    ReturnChild --> End
    
    RedirectLogin --> End
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style ParallelFetch fill:#fff3cd
    style ChildParallel fill:#fff3cd
    style MergeData fill:#d1ecf1
    style MergeChildData fill:#d1ecf1
```

## データ集約ポイント

### 親ダッシュボード統計
- **家族メンバー**: `children` テーブルの count
- **進行中クエスト**: `child_quests.status = 'in_progress'` の count
- **完了待ちクエスト**: `child_quests.status = 'pending_review'` の count
- **未読通知**: `notifications.is_read = false` の count

### 子供ダッシュボード統計
- **獲得報酬合計**: `children.total_earned`
- **現在の貯金**: `children.total_savings`
- **レベル**: `children.level`
- **経験値**: `children.exp`
- **進行中クエスト数**: `child_quests.status = 'in_progress' AND child_id = current_child`
- **完了待ちクエスト数**: `child_quests.status = 'pending_review' AND child_id = current_child`

### キャッシュ戦略
- 統計データは5分間キャッシュ推奨
- リアルタイム更新が必要な場合はキャッシュ無効化
- 通知はキャッシュなし（常に最新取得）
