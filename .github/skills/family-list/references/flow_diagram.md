(2026年3月記載)

# 家族一覧画面 フロー図

## 初期表示フロー

```mermaid
flowchart TD
    Start([ページアクセス]) --> CheckAuth{認証済み?}
    CheckAuth -->|No| RedirectLogin[ログイン画面へ]
    CheckAuth -->|Yes| CheckRole{親ユーザー?}
    CheckRole -->|No| AccessDenied[アクセス拒否]
    CheckRole -->|Yes| MountScreen[FamiliesScreen<br/>マウント]
    
    MountScreen --> CallHook[useFamilies<br/>フック呼び出し]
    CallHook --> ShowLoading[ローディング表示<br/>Loader表示]
    ShowLoading --> FetchAPI[API呼び出し<br/>GET /api/families]
    
    FetchAPI --> CheckResponse{レスポンス確認}
    CheckResponse -->|Success| RenderList[FamilyList<br/>レンダリング]
    CheckResponse -->|Error| ShowError[エラーメッセージ<br/>表示]
    
    RenderList --> MapCards[FamilyCard<br/>をmap生成]
    MapCards --> Complete([表示完了])
    ShowError --> RetryButton{リトライ?}
    RetryButton -->|Yes| FetchAPI
    RetryButton -->|No| Complete
    
    RedirectLogin --> End([終了])
    AccessDenied --> End
    
    style Start fill:#e1f5e1
    style Complete fill:#b8daff
    style ShowError fill:#f5c6cb
    style End fill:#ffe1e1
```

---

## リストレンダリング詳細フロー

```mermaid
flowchart TD
    Start([families配列取得]) --> CheckEmpty{配列が空?}
    CheckEmpty -->|Yes| ShowEmpty[空メッセージ表示<br/>「家族がありません」]
    CheckEmpty -->|No| MapLoop[families.map<br/>ループ開始]
    
    MapLoop --> RenderCard[FamilyCard<br/>レンダリング]
    RenderCard --> BindClick[onClick<br/>イベント設定]
    BindClick --> BindStyle[選択状態<br/>スタイル適用]
    BindStyle --> NextItem{次の要素?}
    
    NextItem -->|Yes| RenderCard
    NextItem -->|No| RenderStack[Stackで<br/>縦並び表示]
    RenderStack --> Complete([レンダリング完了])
    
    ShowEmpty --> Complete
    
    style Start fill:#e1f5e1
    style Complete fill:#b8daff
```

---

## ユーザーインタラクションフロー

```mermaid
flowchart TD
    Start([ユーザー操作]) --> CheckAction{アクション種別}
    
    CheckAction -->|家族カードクリック| NavigateView[家族詳細画面へ遷移<br/>router.push]
    CheckAction -->|FABクリック| NavigateNew[新規作成画面へ遷移<br/>router.push]
    CheckAction -->|プルリフレッシュ| RefetchData[データ再取得<br/>refetch()]
    
    NavigateView --> UpdateURL[URL更新<br/>/families/{id}]
    NavigateNew --> UpdateURLNew[URL更新<br/>/families/new]
    RefetchData --> ShowLoader[ローディング表示]
    
    UpdateURL --> End([画面遷移])
    UpdateURLNew --> End
    ShowLoader --> FetchAPI[API再呼び出し]
    FetchAPI --> UpdateList[一覧更新]
    UpdateList --> End
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
```

---

## 新規作成後の更新フロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant NewScreen as 新規作成画面
    participant API as API
    participant Cache as React Query Cache
    participant ListScreen as 一覧画面

    User->>NewScreen: 家族情報入力・保存
    NewScreen->>API: POST /api/families
    API-->>NewScreen: { id: "new-id" }
    NewScreen->>Cache: invalidateQueries(['families'])
    NewScreen->>ListScreen: router.push('/families')
    ListScreen->>Cache: キャッシュ無効化を検知
    Cache->>API: GET /api/families (再取得)
    API-->>Cache: 最新データ
    Cache-->>ListScreen: 更新データ返却
    ListScreen->>User: 最新一覧表示
```

---

## エラーハンドリングフロー

```mermaid
flowchart TD
    Start([API呼び出し]) --> FetchAPI[GET /api/families]
    FetchAPI --> CheckStatus{ステータス確認}
    
    CheckStatus -->|200 OK| Success[データ取得成功]
    CheckStatus -->|401| AuthError[認証エラー]
    CheckStatus -->|500| ServerError[サーバーエラー]
    CheckStatus -->|Network Error| NetworkError[ネットワークエラー]
    
    AuthError --> RedirectLogin[ログイン画面へ<br/>リダイレクト]
    ServerError --> ShowErrorMsg[エラーメッセージ表示<br/>「サーバーエラーが発生」]
    NetworkError --> ShowNetworkMsg[エラーメッセージ表示<br/>「通信エラー」]
    
    ShowErrorMsg --> RetryOption[リトライボタン表示]
    ShowNetworkMsg --> RetryOption
    RetryOption --> UserRetry{ユーザーがリトライ?}
    
    UserRetry -->|Yes| FetchAPI
    UserRetry -->|No| End([エラー状態維持])
    
    Success --> RenderList[一覧表示]
    RenderList --> End2([正常完了])
    RedirectLogin --> End3([終了])
    
    style Success fill:#c3e6cb
    style AuthError fill:#f5c6cb
    style ServerError fill:#f5c6cb
    style NetworkError fill:#f5c6cb
    style End fill:#ffe1e1
    style End2 fill:#b8daff
    style End3 fill:#ffe1e1
```

---

## データ更新イベントフロー

```mermaid
flowchart TD
    Start([更新イベント発生]) --> CheckEvent{イベント種別}
    
    CheckEvent -->|作成| CreateEvent[家族作成完了]
    CheckEvent -->|編集| EditEvent[家族編集完了]
    CheckEvent -->|削除| DeleteEvent[家族削除完了]
    
    CreateEvent --> Invalidate[キャッシュ無効化<br/>invalidateQueries]
    EditEvent --> Invalidate
    DeleteEvent --> Invalidate
    
    Invalidate --> Refetch[自動再取得<br/>React Query]
    Refetch --> UpdateUI[UI更新]
    UpdateUI --> End([更新完了])
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
```
