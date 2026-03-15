(2026年3月記載)

# ログインフロー図

## 標準ログインフロー

```mermaid
flowchart TD
    Start([ログイン画面アクセス]) --> CheckSession{セッション確認}
    CheckSession -->|セッションあり| RedirectHome[ホーム画面へリダイレクト]
    CheckSession -->|セッションなし| ShowLoginForm[ログインフォーム表示]
    
    ShowLoginForm --> InputCreds[メールアドレス・パスワード入力]
    InputCreds --> ClickLogin[ログインボタンクリック]
    ClickLogin --> SupabaseAuth[Supabase認証実行]
    
    SupabaseAuth -->|認証失敗| ShowError[エラー表示]
    ShowError --> ShowLoginForm
    
    SupabaseAuth -->|認証成功| GetUserInfo[GET /api/users/login]
    GetUserInfo --> CheckUserInfo{ユーザー情報存在?}
    
    CheckUserInfo -->|存在する| NavigateHome[ホーム画面へ遷移]
    CheckUserInfo -->|存在しない| ShowTypeSelect[タイプ選択ポップアップ]
    
    ShowTypeSelect --> SelectType{タイプ選択}
    SelectType -->|新規家族作成| CreateFamily[家族作成画面へ]
    SelectType -->|親として参加| InputParentCode[親招待コード入力]
    SelectType -->|子として参加| InputChildCode[子招待コード入力]
    
    InputParentCode --> JoinAsParent[POST /api/parents/join]
    InputChildCode --> JoinAsChild[POST /api/children/join]
    
    JoinAsParent --> NavigateHome
    JoinAsChild --> NavigateHome
    CreateFamily --> NavigateHome
    
    NavigateHome --> End([終了])
    RedirectHome --> End
```

## ロール検出とリダイレクトフロー

```mermaid
flowchart TD
    Start([認証成功]) --> GetUserInfo[GET /api/users/login]
    GetUserInfo --> ParseResponse{レスポンス解析}
    
    ParseResponse -->|userInfo: null| FirstLogin[初回ログイン]
    ParseResponse -->|userInfo: exists| CheckType{profiles.type確認}
    
    FirstLogin --> ShowPopup[タイプ選択ポップアップ]
    
    CheckType -->|type: parent| ParentHome[親ホーム画面]
    CheckType -->|type: child| ChildHome[子ホーム画面]
    
    ShowPopup --> TypeSelection{選択}
    TypeSelection -->|新規家族| FamilyCreate[/families/new]
    TypeSelection -->|親参加| ParentJoin[招待コード入力 → useJoinAsParent]
    TypeSelection -->|子参加| ChildJoin[招待コード入力 → useJoinAsChild]
    
    ParentJoin --> ParentHome
    ChildJoin --> ChildHome
    FamilyCreate --> ParentHome
    
    ParentHome --> End([終了])
    ChildHome --> End
```

## 招待コードログインフロー

```mermaid
flowchart TD
    Start([タイプ選択ポップアップ]) --> SelectRole{ロール選択}
    
    SelectRole -->|親として参加| ParentFlow[親参加フロー]
    SelectRole -->|子として参加| ChildFlow[子参加フロー]
    
    subgraph ParentFlow [親参加フロー]
        InputParentCode[親招待コード入力]
        ClickParentJoin[参加ボタンクリック]
        CallParentJoin[POST /api/parents/join]
        ValidateParentCode{招待コード検証}
        CreateParentProfile[プロフィール作成]
        CreateParent[親レコード作成]
        
        InputParentCode --> ClickParentJoin
        ClickParentJoin --> CallParentJoin
        CallParentJoin --> ValidateParentCode
        ValidateParentCode -->|無効| ParentError[エラー表示]
        ValidateParentCode -->|有効| CreateParentProfile
        CreateParentProfile --> CreateParent
        CreateParent --> ParentSuccess[親ホーム画面へ]
    end
    
    subgraph ChildFlow [子参加フロー]
        InputChildCode[子招待コード入力]
        ClickChildJoin[参加ボタンクリック]
        CallChildJoin[POST /api/children/join]
        ValidateChildCode{招待コード検証}
        CreateChildProfile[プロフィール作成]
        CreateChild[子レコード作成]
        
        InputChildCode --> ClickChildJoin
        ClickChildJoin --> CallChildJoin
        CallChildJoin --> ValidateChildCode
        ValidateChildCode -->|無効| ChildError[エラー表示]
        ValidateChildCode -->|有効| CreateChildProfile
        CreateChildProfile --> CreateChild
        CreateChild --> ChildSuccess[子ホーム画面へ]
    end
    
    ParentSuccess --> End([終了])
    ChildSuccess --> End
    ParentError -.-> InputParentCode
    ChildError -.-> InputChildCode
```

## セッション管理フロー

```mermaid
flowchart TD
    Start([アプリ起動]) --> CheckCookie{Supabaseセッションクッキー確認}
    
    CheckCookie -->|存在する| ValidateSession[セッション検証]
    CheckCookie -->|存在しない| ShowLogin[ログイン画面]
    
    ValidateSession -->|有効| GetUser[GET /api/users/login]
    ValidateSession -->|無効| ClearSession[セッションクリア]
    ClearSession --> ShowLogin
    
    GetUser --> CheckProfile{プロフィール存在?}
    CheckProfile -->|存在| RedirectHome[ホーム画面]
    CheckProfile -->|存在しない| ShowTypeSelect[タイプ選択]
    
    ShowLogin --> End([終了])
    RedirectHome --> End
    ShowTypeSelect --> End
```

## サインアウトフロー

```mermaid
flowchart TD
    Start([サインアウトボタンクリック]) --> Confirm{確認ダイアログ}
    
    Confirm -->|キャンセル| End([終了])
    Confirm -->|OK| ClearSession[セッションクリア]
    
    ClearSession --> SupabaseSignOut[Supabase signOut実行]
    SupabaseSignOut --> ClearCache[キャッシュクリア]
    ClearCache --> RedirectLogin[ログイン画面へリダイレクト]
    
    RedirectLogin --> End
```
