(2026年3月記載)

# コメント投稿フロー図

## 全体フロー

```mermaid
flowchart TD
    Start([ユーザーがコメント<br/>モーダルを開く]) --> OpenModal[PublicQuestComments<br/>レンダリング]
    OpenModal --> LoadComments[usePublicQuestComments<br/>コメント一覧取得]
    LoadComments --> DisplayModal[CommentsModalLayout表示<br/>85vh Modal]
    DisplayModal --> DisplayLayout[CommentsLayout表示<br/>一覧 + 入力欄]
    
    DisplayLayout --> UserInput{ユーザー操作}
    
    UserInput -->|コメント入力| InputText[Textarea onChange<br/>setComment実行]
    InputText --> UserInput
    
    UserInput -->|投稿ボタン<br/>クリック| ValidateInput{バリデーション}
    
    ValidateInput -->|空白のみ| DoNothing[何もしない<br/>early return]
    DoNothing --> UserInput
    
    ValidateInput -->|内容あり| PostComment[handlePostComment実行]
    PostComment --> ApiCall[POST /api/quests/public<br/>/[id]/comments]
    
    ApiCall --> ServerValidation{サーバー側<br/>バリデーション}
    
    ServerValidation -->|認証失敗| AuthError[401 Unauthorized]
    ServerValidation -->|権限不足<br/>子供ユーザー| PermissionError["親ユーザのみ<br/>コメント可能"エラー]
    ServerValidation -->|成功| InsertDB[public_quest_comments<br/>テーブルに挿入]
    
    AuthError --> HandleError[handleAppError<br/>エラー表示]
    PermissionError --> HandleError
    HandleError --> UserInput
    
    InsertDB --> ApiSuccess[200 OK<br/>レスポンス返却]
    ApiSuccess --> InvalidateCache[QueryClient<br/>キャッシュ無効化]
    InvalidateCache --> ClearInput[setComment("")<br/>入力欄クリア]
    ClearInput --> RefetchComments[コメント一覧再取得<br/>refetch実行]
    RefetchComments --> ShowToast[toast.success<br/>"コメントを投稿しました"]
    ShowToast --> UpdateUI[UI更新<br/>新コメント表示]
    UpdateUI --> UserInput
    
    UserInput -->|モーダルを閉じる| CloseModal[onClose実行]
    CloseModal --> End([終了])
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style InsertDB fill:#c3e6cb
    style AuthError fill:#f5c6cb
    style PermissionError fill:#f5c6cb
    style ShowToast fill:#b8daff
```

## コメント投稿の詳細ステートマシン

```mermaid
stateDiagram-v2
    [*] --> Idle: 初期状態
    
    Idle --> Typing: ユーザーが入力開始
    Typing --> Idle: 全文削除
    Typing --> Typing: 継続入力
    
    Typing --> ValidationCheck: 投稿ボタンクリック
    Idle --> ValidationCheck: 投稿ボタンクリック
    
    ValidationCheck --> Idle: バリデーション失敗<br/>(空白のみ)
    ValidationCheck --> Posting: バリデーション成功
    
    Posting --> ServerValidation: API呼び出し
    
    ServerValidation --> Posting: リクエスト処理中
    ServerValidation --> Error: 認証失敗 or 権限不足
    ServerValidation --> Success: DB挿入成功
    
    Error --> Idle: エラー表示後
    
    Success --> CacheUpdate: キャッシュ無効化
    CacheUpdate --> Refetching: コメント一覧再取得
    Refetching --> Idle: 完了・入力欄クリア
    
    Idle --> [*]: モーダルを閉じる
```

## API呼び出しシーケンス

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant UI as UI (PublicQuestComments)
    participant Hook as usePostComment
    participant API as POST /api/quests/public/[id]/comments
    participant Auth as getAuthContext
    participant DB as Supabase DB
    participant Profile as fetchUserInfoByUserId
    participant Service as createPublicQuestComment
    participant Cache as QueryClient

    User->>UI: コメント入力
    User->>UI: 投稿ボタンクリック
    
    UI->>UI: trim() でバリデーション
    
    alt 空白のみ
        UI-->>User: 何も起こらない
    else 内容あり
        UI->>Hook: handlePostComment({ publicQuestId, content })
        Hook->>API: POST request
        
        API->>Auth: getAuthContext()
        Auth-->>API: { db, userId }
        
        API->>Profile: fetchUserInfoByUserId({ userId, db })
        Profile->>DB: SELECT profiles WHERE user_id = ?
        DB-->>Profile: プロフィール情報
        Profile-->>API: userInfo
        
        alt プロフィール未取得
            API-->>Hook: ServerError("プロフィール情報の取得に失敗")
            Hook-->>User: handleAppError (エラー表示)
        else プロフィール取得成功
            API->>API: プロフィールタイプチェック
            
            alt 子供ユーザー
                API-->>Hook: ServerError("親ユーザのみコメント可能")
                Hook-->>User: handleAppError (エラー表示)
            else 親ユーザー
                API->>Service: createPublicQuestComment({ publicQuestId, profileId, content, db })
                Service->>DB: INSERT INTO public_quest_comments
                DB-->>Service: 挿入されたコメント
                Service-->>API: comment
                
                API-->>Hook: NextResponse.json({ comment })
                Hook->>Cache: invalidateQueries(["publicQuestComments", publicQuestId])
                Hook->>Cache: invalidateQueries(["publicQuestCommentsCount", publicQuestId])
                Hook->>UI: onSuccess callback
                UI->>UI: setComment("") 入力欄クリア
                UI->>UI: refetch() コメント一覧再取得
                Hook-->>User: toast.success("コメントを投稿しました")
            end
        end
    end
```

## バリデーションフロー

```mermaid
flowchart TD
    Start([投稿ボタンクリック]) --> ClientValidation[クライアント側<br/>バリデーション]
    
    ClientValidation --> CheckEmpty{comment.trim()<br/>が空?}
    
    CheckEmpty -->|Yes| ReturnEarly[early return<br/>何もしない]
    ReturnEarly --> End1([終了])
    
    CheckEmpty -->|No| CheckPosting{isPostingComment<br/>= true?}
    
    CheckPosting -->|Yes| ButtonDisabled[ボタン無効化<br/>二重送信防止]
    ButtonDisabled --> End2([終了])
    
    CheckPosting -->|No| SendRequest[API リクエスト送信]
    
    SendRequest --> ServerValidation[サーバー側<br/>バリデーション]
    
    ServerValidation --> CheckAuth{認証済み?}
    CheckAuth -->|No| AuthError[401 Unauthorized]
    AuthError --> End3([終了])
    
    CheckAuth -->|Yes| CheckProfile{プロフィール<br/>取得成功?}
    CheckProfile -->|No| ProfileError[ServerError<br/>プロフィール取得失敗]
    ProfileError --> End4([終了])
    
    CheckProfile -->|Yes| CheckType{type === "parent"?}
    CheckType -->|No| TypeError["親ユーザのみ<br/>コメント可能"エラー]
    TypeError --> End5([終了])
    
    CheckType -->|Yes| InsertDB[DB挿入実行]
    InsertDB --> Success[投稿成功]
    Success --> End6([終了])
    
    style Success fill:#c3e6cb
    style AuthError fill:#f5c6cb
    style ProfileError fill:#f5c6cb
    style TypeError fill:#f5c6cb
```

## キャッシュ無効化フロー

```mermaid
flowchart TD
    Start([コメント投稿成功]) --> Invalidate1[invalidateQueries<br/>publicQuestComments]
    Invalidate1 --> Invalidate2[invalidateQueries<br/>publicQuestCommentsCount]
    Invalidate2 --> Refetch[refetch実行]
    Refetch --> CheckStale{キャッシュが<br/>stale?}
    
    CheckStale -->|Yes| FetchFromServer[サーバーから<br/>最新データ取得]
    CheckStale -->|No| UseCache[キャッシュを使用]
    
    FetchFromServer --> UpdateUI[UI更新]
    UseCache --> UpdateUI
    UpdateUI --> End([終了])
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style UpdateUI fill:#b8daff
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    Start([エラー発生]) --> DetermineType{エラータイプ判定}
    
    DetermineType -->|ClientError| ClientHandler[handleAppError<br/>クライアント側]
    DetermineType -->|ServerError| ServerHandler[withRouteErrorHandling<br/>サーバー側]
    DetermineType -->|NetworkError| NetworkHandler[ネットワークエラー<br/>ハンドリング]
    
    ClientHandler --> ShowToast1[toast.error表示]
    ServerHandler --> LogError[logger.error記録]
    NetworkHandler --> ShowToast2[toast.error表示]
    
    ShowToast1 --> UserNotify1[ユーザーに通知]
    LogError --> ReturnError[エラーレスポンス返却]
    ShowToast2 --> UserNotify2[ユーザーに通知]
    
    ReturnError --> ClientReceive[クライアントで受信]
    ClientReceive --> ShowToast3[toast.error表示]
    ShowToast3 --> UserNotify3[ユーザーに通知]
    
    UserNotify1 --> End([ユーザーが再操作可能])
    UserNotify2 --> End
    UserNotify3 --> End
    
    style Start fill:#f5c6cb
    style End fill:#e1f5e1
```

## ユーザーインタラクションタイムライン

```mermaid
gantt
    title コメント投稿のユーザー体験タイムライン
    dateFormat s
    axisFormat %S秒

    section ユーザー操作
    モーダルを開く          :done, 0, 1s
    コメント入力            :done, 1s, 5s
    投稿ボタンクリック      :done, 6s, 1s

    section システム処理
    バリデーション           :active, 7s, 0.1s
    API呼び出し             :active, 7.1s, 0.5s
    DB挿入                  :active, 7.6s, 0.3s
    キャッシュ無効化         :active, 7.9s, 0.1s

    section UI更新
    入力欄クリア            :crit, 8s, 0.1s
    トースト表示            :crit, 8.1s, 2s
    コメント一覧更新        :crit, 8s, 0.5s
```

## 主要な状態遷移

### isPostingComment (ローディング状態)
```
false (初期状態)
  ↓ (投稿ボタンクリック)
true (投稿中)
  ↓ (API レスポンス受信)
false (完了 or エラー)
```

### comment (入力内容)
```
"" (初期状態・空)
  ↓ (ユーザー入力)
"ユーザーの入力内容"
  ↓ (投稿成功)
"" (クリア)
```

### comments (コメント一覧)
```
undefined (初期状態)
  ↓ (usePublicQuestComments)
CommentItem[] (取得済み)
  ↓ (refetch after post)
CommentItem[] (新コメント含む)
```
