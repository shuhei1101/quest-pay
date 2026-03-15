(2026年3月15日 14:30記載)

# エラー処理フロー図

## 全体エラーハンドリングフロー

```mermaid
flowchart TD
    Start([アプリケーション実行]) --> Operation[ユーザー操作<br/>・API呼び出し<br/>・画面遷移]
    
    Operation --> CheckError{エラー発生?}
    
    CheckError -->|エラーなし| ContinueApp[通常処理継続]
    ContinueApp --> Operation
    
    CheckError -->|エラー発生| DetermineType{エラータイプ判定}
    
    DetermineType -->|認証エラー<br/>401 Unauthorized| AuthError[認証エラーパス]
    DetermineType -->|権限エラー<br/>403 Forbidden| PermissionError[権限エラーパス]
    DetermineType -->|その他<br/>予期しないエラー| UnknownError[グローバルエラー<br/>ハンドラー]
    
    AuthError --> SaveMessage[appStorage.feedbackMessage<br/>メッセージ保存]
    PermissionError --> SaveMessage
    SaveMessage --> RedirectUnauth[/error/unauthorized<br/>へリダイレクト]
    RedirectUnauth --> DisplayUnauth[UnauthorizedScreen<br/>表示]
    
    UnknownError --> CatchBoundary[Error Boundary<br/>がキャッチ]
    CatchBoundary --> DisplayError[error.tsx<br/>ErrorPage表示]
    
    DisplayUnauth --> UserActionUnauth{ユーザー操作}
    UserActionUnauth -->|前のページへ戻る| GoBack[router.back実行]
    UserActionUnauth -->|ログインページへ| GoLogin[router.push<br/>LOGIN_URL]
    
    DisplayError --> UserActionError{ユーザー操作}
    UserActionError -->|再読み込み| ResetError[reset実行<br/>エラー状態クリア]
    UserActionError -->|ホームへ戻る| GoHome[router.push<br/>HOME_URL]
    
    GoBack --> Operation
    GoLogin --> LoginPage[ログイン画面]
    ResetError --> Operation
    GoHome --> HomePage[ホーム画面]
    
    LoginPage --> Operation
    HomePage --> Operation
    
    style Start fill:#e1f5e1
    style AuthError fill:#f5c6cb
    style PermissionError fill:#f5c6cb
    style UnknownError fill:#f5c6cb
    style DisplayUnauth fill:#b8daff
    style DisplayError fill:#b8daff
```

## グローバルエラーハンドラーのライフサイクル

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant App as アプリケーション
    participant Boundary as Error Boundary
    participant ErrorPage as error.tsx
    participant Router as Next.js Router

    User->>App: 操作実行
    App->>App: 処理実行
    
    alt 予期しないエラー発生
        App--xBoundary: throw Error
        Boundary->>Boundary: エラーキャッチ
        Boundary->>ErrorPage: render({ error, reset })
        
        ErrorPage->>ErrorPage: エラー情報表示
        ErrorPage-->>User: UI表示<br/>(アイコン・メッセージ・ボタン)
        
        User->>ErrorPage: アクション選択
        
        alt 再読み込みボタン
            ErrorPage->>Boundary: reset() 実行
            Boundary->>Boundary: エラー状態クリア
            Boundary->>App: 再マウント
            App-->>User: 通常画面に戻る
        else ホームへ戻るボタン
            ErrorPage->>Router: router.push(HOME_URL)
            Router->>App: ホーム画面へ遷移
            App-->>User: ホーム画面表示
        end
    end
```

## 認証エラーフロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Page as ページ
    participant API as API Route
    participant Auth as getAuthContext
    participant Storage as appStorage
    participant Router as Next.js Router
    participant UnauthorizedScreen as UnauthorizedScreen

    User->>Page: 操作実行<br/>(認証が必要)
    Page->>API: API呼び出し
    API->>Auth: getAuthContext()
    
    alt 認証トークンなし or 無効
        Auth-->>API: throw ClientError(401)
        API-->>Page: 401 Unauthorized
        Page->>Page: handleAppError
        Page->>Storage: appStorage.feedbackMessage.in<br/>({ type: "error", message })
        Page->>Router: router.push(/error/unauthorized)
        Router->>UnauthorizedScreen: ページ表示
        
        UnauthorizedScreen->>UnauthorizedScreen: useEffect マウント
        UnauthorizedScreen->>Storage: appStorage.feedbackMessage.out()
        Storage-->>UnauthorizedScreen: feedbackMessage
        UnauthorizedScreen-->>User: toast.error表示<br/>"認証に失敗しました"
        
        UnauthorizedScreen-->>User: UI表示<br/>(ロックアイコン・メッセージ)
        
        User->>UnauthorizedScreen: アクション選択
        
        alt 前のページへ戻る
            UnauthorizedScreen->>Router: router.back()
            Router-->>User: 前のページ表示
        else ログインページへ
            UnauthorizedScreen->>Router: router.push(LOGIN_URL)
            Router-->>User: ログイン画面表示
        end
    end
```

## エラータイプ別のルーティング

```mermaid
stateDiagram-v2
    [*] --> Normal: アプリケーション起動
    
    Normal --> ErrorOccurred: エラー発生
    
    ErrorOccurred --> AuthError: 401 Unauthorized
    ErrorOccurred --> PermissionError: 403 Forbidden
    ErrorOccurred --> NetworkError: Network Error
    ErrorOccurred --> UnknownError: その他のエラー
    
    AuthError --> UnauthorizedPage: /error/unauthorized
    PermissionError --> UnauthorizedPage
    NetworkError --> GlobalErrorHandler: error.tsx
    UnknownError --> GlobalErrorHandler
    
    UnauthorizedPage --> UserAction1: UI表示
    GlobalErrorHandler --> UserAction2: UI表示
    
    UserAction1 --> LoginPage: ログインへ
    UserAction1 --> PreviousPage: 前のページへ
    
    UserAction2 --> Retry: 再読み込み
    UserAction2 --> HomePage: ホームへ
    
    LoginPage --> Normal: ログイン成功
    PreviousPage --> Normal
    Retry --> Normal: エラー解消
    HomePage --> Normal
    
    Retry --> GlobalErrorHandler: エラー継続
```

## エラー回復フロー

```mermaid
flowchart TD
    Start([エラー発生]) --> DisplayError[エラー画面表示]
    
    DisplayError --> UserChoice{ユーザーの<br/>回復戦略選択}
    
    UserChoice -->|再読み込み| ResetAttempt[reset実行]
    UserChoice -->|ホームへ戻る| NavigateHome[HOME_URLへ遷移]
    UserChoice -->|前のページへ| NavigateBack[router.back実行]
    UserChoice -->|ログインへ| NavigateLogin[LOGIN_URLへ遷移]
    
    ResetAttempt --> CheckFixed{エラー解消?}
    
    CheckFixed -->|Yes| RecoverSuccess[通常状態へ復帰]
    CheckFixed -->|No| SameError[同じエラー再表示]
    
    SameError --> UserChoice
    
    NavigateHome --> LoadHome[ホーム画面読み込み]
    NavigateBack --> LoadPrevious[前のページ読み込み]
    NavigateLogin --> LoadLogin[ログイン画面読み込み]
    
    LoadHome --> CheckHomeError{エラー発生?}
    LoadPrevious --> CheckPrevError{エラー発生?}
    LoadLogin --> CheckLoginError{エラー発生?}
    
    CheckHomeError -->|No| RecoverSuccess
    CheckHomeError -->|Yes| DisplayError
    
    CheckPrevError -->|No| RecoverSuccess
    CheckPrevError -->|Yes| DisplayError
    
    CheckLoginError -->|No| RecoverSuccess
    CheckLoginError -->|Yes| DisplayError
    
    RecoverSuccess --> End([回復完了])
    
    style Start fill:#f5c6cb
    style RecoverSuccess fill:#c3e6cb
    style End fill:#e1f5e1
    style SameError fill:#f5c6cb
```

## セッションストレージとの連携フロー

```mermaid
sequenceDiagram
    participant Page1 as 操作元ページ
    participant Storage as SessionStorage
    participant Page2 as /error/unauthorized
    participant Toast as react-hot-toast
    participant Component as FeedbackMessage

    Page1->>Page1: エラー検知<br/>(401/403)
    Page1->>Storage: appStorage.feedbackMessage.in<br/>({ type: "error", message })
    Storage->>Storage: sessionStorage.setItem
    
    Page1->>Page2: router.push(/error/unauthorized)
    
    Page2->>Page2: useEffect マウント
    Page2->>Storage: appStorage.feedbackMessage.out()
    Storage->>Storage: sessionStorage.getItem
    Storage-->>Page2: feedbackMessage
    
    alt メッセージあり
        Page2->>Component: FeedbackMessage表示
        Component->>Toast: toast.error(message)
        Toast-->>Page2: トースト表示
        
        Page2->>Storage: sessionStorage.removeItem
    else メッセージなし
        Page2-->>Page2: 何もしない
    end
```

## Error Boundary の動作原理

```mermaid
flowchart TD
    Start([コンポーネントツリー]) --> RenderTree[通常レンダリング]
    
    RenderTree --> CheckError{エラー発生?}
    
    CheckError -->|なし| DisplayNormal[通常UI表示]
    CheckError -->|あり| BoundaryCheck{Error Boundary<br/>が存在?}
    
    BoundaryCheck -->|なし| PropagateUp[親コンポーネントへ<br/>エラー伝播]
    BoundaryCheck -->|あり| CatchError[Error Boundaryが<br/>エラーをキャッチ]
    
    PropagateUp --> WindowError[window.onerror<br/>未処理エラー]
    WindowError --> FatalError[アプリケーション<br/>クラッシュ]
    
    CatchError --> RenderError[error.tsx<br/>ErrorPageレンダリング]
    RenderError --> DisplayError[エラーUI表示]
    
    DisplayError --> UserAction{ユーザー操作}
    
    UserAction -->|reset| ClearError[エラー状態クリア]
    ClearError --> RenderTree
    
    UserAction -->|navigate| Navigate[別ページへ遷移]
    Navigate --> NewPage[新しいページ表示]
    
    DisplayNormal --> End([正常終了])
    NewPage --> End
    FatalError --> Crash([アプリ停止])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style FatalError fill:#f5c6cb
    style Crash fill:#f5c6cb
    style DisplayError fill:#b8daff
```

## エラーメッセージの表示タイミング

```mermaid
gantt
    title エラー発生からメッセージ表示までのタイムライン
    dateFormat s
    axisFormat %S秒

    section エラー発生
    API呼び出しエラー      :done, 0, 0.5s
    エラー検知             :done, 0.5s, 0.1s

    section ストレージ操作
    feedbackMessage保存     :active, 0.6s, 0.1s

    section ページ遷移
    router.push実行         :active, 0.7s, 0.2s
    UnauthorizedScreen表示  :active, 0.9s, 0.3s

    section メッセージ表示
    useEffect実行           :crit, 1.2s, 0.1s
    feedbackMessage取得     :crit, 1.3s, 0.1s
    toast.error表示         :crit, 1.4s, 3s
```

## グローバルエラーとローカルエラーの判別

```mermaid
flowchart TD
    Start([エラー発生]) --> CheckHandled{エラーが<br/>catch済み?}
    
    CheckHandled -->|Yes| LocalError[ローカルエラー<br/>ハンドリング]
    CheckHandled -->|No| GlobalError[グローバルエラー<br/>Error Boundary]
    
    LocalError --> CheckType{エラータイプ判定}
    
    CheckType -->|ClientError<br/>401/403| RedirectAuth[認証エラーページへ]
    CheckType -->|ServerError<br/>500系| ShowToast[toast.error表示]
    CheckType -->|ValidationError| ShowInline[インラインエラー表示]
    
    GlobalError --> BoundaryRender[error.tsx<br/>レンダリング]
    
    RedirectAuth --> UnauthorizedPage[/error/unauthorized]
    ShowToast --> StayPage[同じページに留まる]
    ShowInline --> StayPage
    
    BoundaryRender --> ErrorPage[ErrorPage表示]
    
    UnauthorizedPage --> End1([ユーザー操作待ち])
    StayPage --> End2([ユーザー操作待ち])
    ErrorPage --> End3([ユーザー操作待ち])
    
    style Start fill:#f5c6cb
    style LocalError fill:#fff4e6
    style GlobalError fill:#ffe4e6
```

## リカバリー戦略の決定ツリー

```mermaid
flowchart TD
    Start([エラー画面表示]) --> DetermineError{エラータイプ}
    
    DetermineError -->|認証エラー| AuthRecovery[認証が必要]
    DetermineError -->|データエラー| DataRecovery[データ再取得]
    DetermineError -->|ネットワークエラー| NetworkRecovery[接続回復待ち]
    DetermineError -->|不明なエラー| UnknownRecovery[安全な場所へ避難]
    
    AuthRecovery --> ShowLogin[ログインページ表示]
    
    DataRecovery --> RetryFetch{再取得可能?}
    RetryFetch -->|Yes| ExecuteRetry[reset実行<br/>再取得試行]
    RetryFetch -->|No| NavigateHome[ホームへ遷移]
    
    NetworkRecovery --> UserRetry{ユーザーが<br/>再試行?}
    UserRetry -->|Yes| ExecuteRetry
    UserRetry -->|No| NavigateHome
    
    UnknownRecovery --> SafeOption{安全な選択肢}
    SafeOption -->|ホームへ| NavigateHome
    SafeOption -->|前のページへ| NavigateBack[router.back]
    
    ShowLogin --> End1([ログイン待ち])
    ExecuteRetry --> CheckSuccess{成功?}
    CheckSuccess -->|Yes| End2([回復完了])
    CheckSuccess -->|No| NavigateHome
    NavigateHome --> End3([ホーム画面表示])
    NavigateBack --> End4([前のページ表示])
    
    style Start fill:#f5c6cb
    style End2 fill:#c3e6cb
```
