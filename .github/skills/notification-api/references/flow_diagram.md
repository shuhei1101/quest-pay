(2026年3月記載)

# 通知ライフサイクル フロー図

## 通知の全体ライフサイクル

```mermaid
flowchart TD
    Start([イベント発生]) --> EventType{イベント種別}
    
    EventType -->|子供が完了報告| ReviewRequest[family_quest_review通知]
    EventType -->|親が承認| Approved[quest_report_approved通知]
    EventType -->|親が却下| Rejected[quest_report_rejected通知]
    EventType -->|レベルアップ| LevelUp[quest_level_up通知]
    EventType -->|クエストクリア| Cleared[quest_cleared通知]
    EventType -->|その他| Other[other通知]
    
    ReviewRequest --> CreateNotif[notifications作成]
    Approved --> CreateNotif
    Rejected --> CreateNotif
    LevelUp --> CreateNotif
    Cleared --> CreateNotif
    Other --> CreateNotif
    
    CreateNotif --> SetFields[フィールド設定<br/>recipient_profile_id<br/>type, message, url<br/>is_read: false]
    SetFields --> SaveDB[DB保存]
    SaveDB --> PushNotif[プッシュ通知送信<br/>※将来実装]
    
    PushNotif --> UserView{ユーザーが通知確認?}
    UserView -->|未確認| Waiting[未読状態で待機]
    Waiting --> UserView
    UserView -->|確認| MarkRead[既読マーク<br/>is_read: true<br/>read_at: NOW()]
    
    MarkRead --> Complete[完了]
    
    style Start fill:#e1f5e1
    style Complete fill:#b8daff
    style CreateNotif fill:#fff3cd
    style MarkRead fill:#c3e6cb
```

## 通知ステータス遷移

```mermaid
stateDiagram-v2
    [*] --> 未読: 通知作成<br/>(is_read: false)
    
    未読 --> 既読: 既読マーク<br/>(is_read: true, read_at設定)
    
    既読 --> [*]: 表示継続または削除
    
    note right of 未読
        is_read: false
        read_at: null
        通知バッジに表示
    end note
    
    note right of 既読
        is_read: true
        read_at: 設定済み
        通知一覧には表示継続
    end note
```

## 通知作成フロー（イベント別）

### 1. 完了報告時（親への通知）

```mermaid
sequenceDiagram
    participant Child as 子供
    participant API as クエストAPI
    participant DB as Database
    participant NotifyAPI as 通知システム
    participant Parent as 親
    
    Child->>API: POST /api/quests/family/[id]/review-request
    API->>DB: child_quests更新<br/>(status: pending_review)
    API->>DB: 親のprofile_id取得
    
    API->>NotifyAPI: 通知作成リクエスト
    NotifyAPI->>DB: INSERT INTO notifications<br/>(type: family_quest_review<br/>recipient_profile_id: 親ID<br/>message: "〇〇クエストの完了報告"<br/>url: "/quests/family/[id]"<br/>is_read: false)
    
    DB-->>NotifyAPI: 通知作成完了
    NotifyAPI-->>API: 通知ID返却
    API-->>Child: 報告受付完了
    
    Note over Parent: プッシュ通知受信（将来実装）
    Parent->>API: GET /api/notifications
    API->>DB: SELECT * FROM notifications<br/>WHERE recipient_profile_id = 親ID
    DB-->>API: 通知一覧
    API-->>Parent: 通知データ表示
```

### 2. 承認/却下時（子供への通知）

```mermaid
sequenceDiagram
    participant Parent as 親
    participant API as クエストAPI
    participant DB as Database
    participant NotifyAPI as 通知システム
    participant Child as 子供
    
    Parent->>API: POST /api/quests/family/[id]/child/[childId]/approve<br/>または reject
    API->>DB: child_quests更新<br/>(status: completed または in_progress)
    API->>DB: 子供のprofile_id取得
    
    alt 承認の場合
        API->>NotifyAPI: 通知作成リクエスト<br/>(type: quest_report_approved)
    else 却下の場合
        API->>NotifyAPI: 通知作成リクエスト<br/>(type: quest_report_rejected)
    end
    
    NotifyAPI->>DB: INSERT INTO notifications<br/>(recipient_profile_id: 子供ID<br/>message: 承認または却下メッセージ<br/>url: "/quests/family/[id]/child/[childId]"<br/>is_read: false)
    
    DB-->>NotifyAPI: 通知作成完了
    NotifyAPI-->>API: 通知ID返却
    API-->>Parent: 処理完了
    
    Note over Child: プッシュ通知受信（将来実装）
    Child->>API: GET /api/notifications
    API-->>Child: 通知データ表示
```

## 通知取得・既読管理フロー

### 通知一覧取得

```mermaid
flowchart TD
    User[ユーザー] --> Request[GET /api/notifications]
    Request --> Auth[認証チェック]
    Auth --> GetProfile[プロフィールID取得]
    GetProfile --> Query[SELECT * FROM notifications<br/>WHERE recipient_profile_id = ユーザーID<br/>ORDER BY created_at DESC]
    Query --> Format[データ整形]
    Format --> Response[通知一覧返却]
    
    style Auth fill:#fff3cd
    style Query fill:#e1f5e1
    style Response fill:#b8daff
```

### 既読マーク（複数）

```mermaid
flowchart TD
    User[ユーザー] --> Select[通知選択]
    Select --> Request[PUT /api/notifications/read<br/>{notificationIds, updatedAt}]
    Request --> Auth[認証チェック]
    Auth --> Verify{通知ID検証}
    
    Verify -->|所有者確認OK| Begin[BEGIN TRANSACTION]
    Verify -->|他人の通知| Error[エラー返却]
    
    Begin --> Loop[各通知IDループ]
    Loop --> Update[UPDATE notifications<br/>SET is_read = true<br/>read_at = NOW()<br/>WHERE id = notificationId]
    Update --> Next{次の通知あり?}
    Next -->|あり| Loop
    Next -->|なし| Commit[COMMIT]
    
    Commit --> Response[完了返却]
    Error --> End[処理終了]
    Response --> End
    
    style Auth fill:#fff3cd
    style Begin fill:#e1f5e1
    style Commit fill:#c3e6cb
    style Error fill:#f5c6cb
```

## 通知バッジ表示フロー

```mermaid
flowchart TD
    User[ユーザー] --> AppLoad[アプリ起動]
    AppLoad --> Request[GET /api/notifications]
    Request --> GetAll[全通知取得]
    GetAll --> Filter[未読通知フィルタ<br/>is_read = false]
    Filter --> Count[未読数カウント]
    Count --> Badge[バッジ表示<br/>※未読数]
    
    Badge --> UserAction{ユーザー操作}
    UserAction -->|通知タップ| MarkRead[既読マーク]
    UserAction -->|放置| Wait[待機]
    
    MarkRead --> UpdateBadge[バッジ更新]
    UpdateBadge --> Badge
    Wait --> Refresh{定期更新?}
    Refresh -->|あり| Request
    Refresh -->|なし| Wait
    
    style Filter fill:#e1f5e1
    style Badge fill:#fff3cd
    style MarkRead fill:#c3e6cb
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    Request[APIリクエスト] --> Try{エラー発生?}
    
    Try -->|認証エラー| Auth401[401 Unauthorized<br/>認証失敗]
    Try -->|権限エラー| Forbidden403[403 Forbidden<br/>他人の通知にアクセス]
    Try -->|DBエラー| DB500[500 Internal Server Error<br/>データベースエラー]
    Try -->|バリデーションエラー| Validation400[400 Bad Request<br/>リクエスト形式エラー]
    Try -->|正常| Success200[200 OK<br/>処理成功]
    
    Auth401 --> Log[エラーログ記録]
    Forbidden403 --> Log
    DB500 --> Log
    Validation400 --> Log
    
    Log --> Response[エラーレスポンス返却]
    Success200 --> SuccessResponse[成功レスポンス返却]
    
    style Auth401 fill:#f5c6cb
    style Forbidden403 fill:#f5c6cb
    style DB500 fill:#f5c6cb
    style Validation400 fill:#fff3cd
    style Success200 fill:#c3e6cb
```

## 将来実装予定の機能

### プッシュ通知
```mermaid
flowchart LR
    Create[通知作成] --> DB[(Database保存)]
    DB --> Push[プッシュ通知サービス]
    Push --> FCM[Firebase Cloud Messaging]
    FCM --> Device[ユーザーデバイス]
    Device --> Display[通知バナー表示]
```

### 通知の自動削除
```mermaid
flowchart TD
    Schedule[定期実行<br/>深夜2時] --> Check[古い通知チェック]
    Check --> Filter[作成から90日以上<br/>かつ既読]
    Filter --> Archive[アーカイブテーブルへ移動]
    Archive --> Delete[通知テーブルから削除]
    Delete --> Complete[完了]
    
    style Schedule fill:#e1f5e1
    style Archive fill:#fff3cd
    style Delete fill:#f5c6cb
```
