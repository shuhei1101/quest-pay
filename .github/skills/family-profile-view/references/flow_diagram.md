(2026年3月記載)

# 家族プロフィール閲覧画面 フロー図

## 画面表示フロー全体

```mermaid
flowchart TD
    Start([ユーザーがページアクセス]) --> Mount[FamilyProfileViewScreen マウント]
    Mount --> ParallelFetch[並列データ取得開始]
    
    ParallelFetch --> Fetch1[useFamilyDetail<br/>家族詳細取得]
    ParallelFetch --> Fetch2[useFollowStatus<br/>フォロー状態取得]
    ParallelFetch --> Fetch3[useFamilyTimeline<br/>タイムライン取得]
    
    Fetch1 --> CheckCache1{キャッシュ<br/>存在?}
    Fetch2 --> CheckCache2{キャッシュ<br/>存在?}
    Fetch3 --> CheckCache3{キャッシュ<br/>存在?}
    
    CheckCache1 -->|あり| UseCache1[キャッシュから表示]
    CheckCache1 -->|なし| API1[GET /api/families/:id]
    
    CheckCache2 -->|あり| UseCache2[キャッシュから表示]
    CheckCache2 -->|なし| API2[GET /api/families/:id/follow/status]
    
    CheckCache3 -->|あり| UseCache3[キャッシュから表示]
    CheckCache3 -->|なし| API3[GET /api/timeline/family/:id]
    
    API1 --> Auth1{認証<br/>チェック}
    API2 --> Auth2{認証<br/>チェック}
    API3 --> Auth3{認証<br/>チェック}
    
    Auth1 -->|失敗| AuthError[認証エラー]
    Auth2 -->|失敗| AuthError
    Auth3 -->|失敗| AuthError
    
    Auth1 -->|成功| DB1[DBから家族情報取得]
    Auth2 -->|成功| DB2[DBからフォロー状態取得]
    Auth3 -->|成功| DB3[DBからタイムライン取得]
    
    DB1 --> Transform1[データ変換]
    DB2 --> Transform2[データ変換]
    DB3 --> Transform3[データ変換]
    
    UseCache1 --> Transform1
    UseCache2 --> Transform2
    UseCache3 --> Transform3
    
    Transform1 --> WaitAll[すべてのデータ<br/>取得完了待ち]
    Transform2 --> WaitAll
    Transform3 --> WaitAll
    
    WaitAll --> Transform[useFamilyProfileViewModel<br/>統合データ変換]
    Transform --> Render[画面レンダリング]
    
    Render --> ShowLayout[FamilyProfileViewLayout表示]
    Render --> ShowTimeline[TimelineList表示]
    Render --> ShowFooter[FamilyProfileViewFooter表示]
    
    ShowFooter --> UserAction{ユーザー<br/>アクション}
    
    UserAction -->|フォロー切替| FollowFlow[フォロー切替フロー]
    UserAction -->|シェア| ShareFlow[シェアフロー]
    UserAction -->|タイムライン項目クリック| DetailFlow[詳細表示フロー]
    UserAction -->|待機| WaitUser[ユーザー待機]
    
    FollowFlow --> FollowAPI[フォロー/アンフォローAPI]
    FollowAPI --> UpdateFollow[フォロー状態更新]
    UpdateFollow --> InvalidateCache[キャッシュ無効化]
    InvalidateCache --> Refetch[データ再取得]
    Refetch --> Render
    
    ShareFlow --> ShowShareModal[シェアモーダル表示]
    ShowShareModal --> UserAction
    
    DetailFlow --> Navigate[詳細画面へ遷移]
    Navigate --> End([終了])
    
    WaitUser --> UserAction
    AuthError --> End
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style Render fill:#cfe2ff
    style FollowFlow fill:#fff3cd
```

## 初期表示シーケンス

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Page as page.tsx
    participant Screen as FamilyProfileViewScreen
    participant Hook1 as useFamilyDetail
    participant Hook2 as useFollowStatus
    participant Hook3 as useFamilyTimeline
    participant API as API Routes
    participant DB as Database
    
    User->>Page: /families/[id]/view アクセス
    Page->>Page: 認証・権限チェック
    
    alt 認証失敗または権限エラー
        Page-->>User: エラー画面
    else OK
        Page->>Screen: familyId を渡してマウント
        
        par 並列データ取得
            Screen->>Hook1: useFamilyDetail(id)
            Screen->>Hook2: useFollowStatus(id)
            Screen->>Hook3: useFamilyTimeline(id)
        end
        
        Hook1->>API: GET /api/families/:id
        Hook2->>API: GET /api/families/:id/follow/status
        Hook3->>API: GET /api/timeline/family/:id
        
        par 並列DB取得
            API->>DB: families 取得
            API->>DB: follow_relationships 取得
            API->>DB: timeline_events 取得
        end
        
        DB-->>API: データ返却1
        DB-->>API: データ返却2
        DB-->>API: データ返却3
        
        API-->>Hook1: 家族詳細レスポンス
        API-->>Hook2: フォロー状態レスポンス
        API-->>Hook3: タイムラインレスポンス
        
        Hook1->>Screen: 家族データ
        Hook2->>Screen: フォロー状態
        Hook3->>Screen: タイムライン
        
        Screen->>Screen: useFamilyProfileViewModel<br/>データ統合・変換
        Screen->>Screen: レンダリング
        Screen-->>User: 画面表示
    end
```

## フォロー切替フロー

```mermaid
flowchart TD
    Start([ユーザーがフォローボタンクリック]) --> CheckStatus{現在の<br/>フォロー状態}
    
    CheckStatus -->|フォロー中| ConfirmUnfollow{確認<br/>ダイアログ}
    CheckStatus -->|未フォロー| DirectFollow[フォロー処理へ]
    
    ConfirmUnfollow -->|キャンセル| Cancel([キャンセル])
    ConfirmUnfollow -->|OK| Unfollow[アンフォロー処理へ]
    
    DirectFollow --> SetLoading1[ローディング開始]
    Unfollow --> SetLoading2[ローディング開始]
    
    SetLoading1 --> OptimisticUpdate1[楽観的更新<br/>isFollowing: true]
    SetLoading2 --> OptimisticUpdate2[楽観的更新<br/>isFollowing: false]
    
    OptimisticUpdate1 --> FollowAPI[POST /api/families/:id/follow]
    OptimisticUpdate2 --> UnfollowAPI[DELETE /api/families/:id/follow]
    
    FollowAPI --> CheckFollowResult{API<br/>成功?}
    UnfollowAPI --> CheckUnfollowResult{API<br/>成功?}
    
    CheckFollowResult -->|失敗| Rollback1[ロールバック<br/>元の状態に戻す]
    CheckUnfollowResult -->|失敗| Rollback2[ロールバック<br/>元の状態に戻す]
    
    Rollback1 --> ShowError1[エラートースト表示]
    Rollback2 --> ShowError2[エラートースト表示]
    
    CheckFollowResult -->|成功| UpdateDB1[DB更新<br/>follow_relationships作成]
    CheckUnfollowResult -->|成功| UpdateDB2[DB更新<br/>follow_relationships削除]
    
    UpdateDB1 --> InvalidateCache1[キャッシュ無効化]
    UpdateDB2 --> InvalidateCache2[キャッシュ無効化]
    
    InvalidateCache1 --> Refetch[データ再取得]
    InvalidateCache2 --> Refetch
    
    Refetch --> UpdateUI[UI更新<br/>ボタン表示切替]
    UpdateUI --> ShowSuccess[成功トースト表示]
    ShowSuccess --> End([完了])
    
    ShowError1 --> End
    ShowError2 --> End
    Cancel --> End
    
    style Start fill:#e1f5e1
    style End fill:#cfe2ff
    style ShowError1 fill:#f8d7da
    style ShowError2 fill:#f8d7da
    style ShowSuccess fill:#d1e7dd
```

## シェア機能フロー

```mermaid
flowchart TD
    Start([ユーザーがシェアボタンクリック]) --> CheckShare{Web Share API<br/>サポート?}
    
    CheckShare -->|Yes| NativeShare[navigator.share()<br/>ネイティブシェア]
    CheckShare -->|No| ShowModal[シェアモーダル表示]
    
    NativeShare --> ShareSuccess{シェア<br/>成功?}
    ShareSuccess -->|Yes| ShowToast1[成功トースト]
    ShareSuccess -->|No| ShowModal
    
    ShowModal --> ModalContent[モーダル内容表示<br/>- URL<br/>- コピーボタン<br/>- SNSリンク]
    
    ModalContent --> UserSelect{ユーザー<br/>選択}
    
    UserSelect -->|URLコピー| CopyURL[クリップボードにコピー]
    UserSelect -->|SNS| OpenSNS[SNSアプリ/ブラウザ起動]
    UserSelect -->|閉じる| CloseModal[モーダル閉じる]
    
    CopyURL --> ShowToast2[コピー成功トースト]
    ShowToast2 --> ModalContent
    
    OpenSNS --> End([終了])
    CloseModal --> End
    ShowToast1 --> End
    
    style Start fill:#e1f5e1
    style End fill:#cfe2ff
```

## タイムライン表示フロー

```mermaid
flowchart TD
    Start([タイムラインセクション]) --> FetchTimeline[useFamilyTimeline<br/>データ取得]
    
    FetchTimeline --> CheckData{データ<br/>存在?}
    
    CheckData -->|なし| ShowEmpty[EmptyState表示<br/>「タイムラインはまだありません」]
    CheckData -->|あり| RenderList[TimelineList レンダリング]
    
    RenderList --> MapItems[items.map でループ]
    MapItems --> RenderItem[TimelineItem × N]
    
    RenderItem --> FormatEvent[イベントメッセージ<br/>フォーマット]
    FormatEvent --> ShowIcon[イベントアイコン表示]
    ShowIcon --> ShowTime[相対時間表示]
    
    ShowTime --> UserClick{ユーザー<br/>クリック?}
    
    UserClick -->|Yes| CheckType{イベント<br/>タイプ}
    UserClick -->|No| WaitUser[待機]
    
    CheckType -->|quest_completed| NavQuest[クエスト詳細へ]
    CheckType -->|quest_published| NavPublic[公開クエストへ]
    CheckType -->|level_up| NavChild[子供詳細へ]
    
    NavQuest --> End([終了])
    NavPublic --> End
    NavChild --> End
    ShowEmpty --> End
    WaitUser --> UserClick
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
```

## 楽観的更新フロー（Optimistic Update）

```mermaid
flowchart TD
    Start([フォロー切替開始]) --> SaveCurrent[現在の状態を保存<br/>previousData]
    
    SaveCurrent --> CancelQuery[進行中のクエリをキャンセル<br/>cancelQueries]
    
    CancelQuery --> UpdateCache[キャッシュを即座に更新<br/>setQueryData]
    
    UpdateCache --> UIUpdate[UI即座に更新<br/>ユーザーに反映]
    
    UIUpdate --> APICall[バックグラウンドで<br/>API呼び出し]
    
    APICall --> CheckResult{API<br/>結果}
    
    CheckResult -->|成功| KeepUpdate[更新を維持<br/>キャッシュ無効化で再取得]
    CheckResult -->|失敗| Rollback[ロールバック<br/>previousDataで復元]
    
    KeepUpdate --> InvalidateCache[invalidateQueries<br/>最新データ取得]
    Rollback --> RestoreUI[UI復元]
    
    InvalidateCache --> End([完了])
    RestoreUI --> ShowError[エラー通知]
    ShowError --> End
    
    style Start fill:#e1f5e1
    style End fill:#cfe2ff
    style Rollback fill:#f8d7da
    style KeepUpdate fill:#d1e7dd
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    Error([エラー発生]) --> CheckType{エラー種別}
    
    CheckType -->|認証エラー| AuthError[認証エラー画面表示]
    CheckType -->|権限エラー| PermError[権限エラー表示<br/>「親のみアクセスできます」]
    CheckType -->|データ不在| NotFound[404エラー表示<br/>「家族が見つかりません」]
    CheckType -->|ネットワークエラー| NetError[ネットワークエラー表示<br/>リトライボタン表示]
    CheckType -->|フォロー失敗| FollowError[楽観的更新ロールバック<br/>エラートースト表示]
    CheckType -->|その他| GenError[一般エラー表示]
    
    AuthError --> RedirectLogin[ログイン画面へリダイレクト]
    PermError --> BackButton[一覧へ戻るボタン表示]
    NotFound --> BackButton
    NetError --> RetryButton[リトライボタン表示]
    FollowError --> RestoreState[元の状態に復元]
    GenError --> BackButton
    
    RedirectLogin --> End([終了])
    BackButton --> End
    RetryButton --> Retry{ユーザー<br/>リトライ?}
    RestoreState --> End
    
    Retry -->|Yes| RefetchData[データ再取得]
    Retry -->|No| End
    
    RefetchData --> Success{成功?}
    Success -->|Yes| ShowData[データ表示]
    Success -->|No| Error
    
    ShowData --> End
    
    style Error fill:#f8d7da
    style End fill:#ffe1e1
```

## 状態管理フロー

```mermaid
stateDiagram-v2
    [*] --> Loading: ページアクセス
    Loading --> Error: 取得失敗
    Loading --> Success: 取得成功
    
    Success --> DisplayingNotFollowing: フォローしていない
    Success --> DisplayingFollowing: フォロー中
    
    DisplayingNotFollowing --> OptimisticFollow: フォローボタンクリック
    OptimisticFollow --> DisplayingFollowing: 楽観的更新
    DisplayingFollowing --> ConfirmingUnfollow: アンフォローボタンクリック
    
    ConfirmingUnfollow --> DisplayingFollowing: キャンセル
    ConfirmingUnfollow --> OptimisticUnfollow: 確認OK
    OptimisticUnfollow --> DisplayingNotFollowing: 楽観的更新
    
    DisplayingFollowing --> APIFollowFailed: API失敗
    DisplayingNotFollowing --> APIUnfollowFailed: API失敗
    
    APIFollowFailed --> DisplayingNotFollowing: ロールバック
    APIUnfollowFailed --> DisplayingFollowing: ロールバック
    
    DisplayingFollowing --> [*]: 遷移
    DisplayingNotFollowing --> [*]: 遷移
    Error --> [*]: エラー終了
```

## リアルタイム更新フロー（ポーリング）

```mermaid
flowchart TD
    Start([画面表示中]) --> WaitInterval{5分経過?}
    
    WaitInterval -->|No| Wait[待機]
    WaitInterval -->|Yes| AutoRefetch[自動でデータ再取得<br/>refetchInterval]
    
    AutoRefetch --> FetchLatest[最新データ取得<br/>- Timeline<br/>- Stats]
    
    FetchLatest --> CompareData{データ<br/>変更あり?}
    
    CompareData -->|Yes| UpdateUI[UI自動更新]
    CompareData -->|No| NoUpdate[更新なし]
    
    UpdateUI --> Wait
    NoUpdate --> Wait
    
    Wait --> CheckUnmount{画面<br/>アンマウント?}
    CheckUnmount -->|No| WaitInterval
    CheckUnmount -->|Yes| Cleanup[ポーリング停止]
    Cleanup --> End([終了])
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
```
