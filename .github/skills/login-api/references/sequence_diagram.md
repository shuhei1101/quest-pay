(2026年3月記載)

# ログインAPIシーケンス図

## POST /api/auth/login (親ログイン)

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant UI as LoginScreen
    participant Hook as useLogin
    participant Supabase as Supabase Client
    participant Auth as Supabase Auth
    participant API as GET /api/users/login
    participant DB as Database
    
    User->>UI: メールアドレス・パスワード入力
    User->>UI: ログインボタンクリック
    UI->>Hook: login({email, password, rememberMe})
    
    Hook->>Supabase: auth.signInWithPassword({email, password})
    Supabase->>Auth: 認証リクエスト
    Auth->>Auth: パスワード検証
    
    alt 認証成功
        Auth-->>Supabase: セッション + auth.users レコード
        Supabase-->>Hook: {data: {user, session}, error: null}
        
        Hook->>API: GET /api/users/login
        API->>API: getAuthContext()
        API->>DB: SELECT profiles, parents WHERE user_id = ?
        
        alt ユーザー情報存在
            DB-->>API: profiles + parents データ
            API-->>Hook: {userInfo: {...}}
            Hook->>Hook: currentUserクエリ無効化
            Hook->>UI: ホーム画面へ遷移
        else ユーザー情報なし（初回ログイン）
            DB-->>API: null
            API-->>Hook: {userInfo: null}
            Hook->>UI: タイプ選択ポップアップ表示
        end
        
    else 認証失敗
        Auth-->>Supabase: エラー
        Supabase-->>Hook: {data: null, error: {...}}
        Hook->>UI: エラーメッセージ表示
    end
```

## POST /api/parents/join (親として参加)

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant UI as LoginTypeSelectPopup
    participant Hook as useJoinAsParent
    participant API as POST /api/parents/join
    participant DB as Database
    participant Families as families table
    participant Profiles as profiles table
    participant Parents as parents table
    
    User->>UI: 招待コード入力
    User->>UI: 参加ボタンクリック
    UI->>Hook: joinAsParent({inviteCode})
    
    Hook->>API: POST /api/parents/join
    API->>API: getAuthContext()
    API->>API: バリデーション
    
    API->>DB: BEGIN TRANSACTION
    
    API->>Families: SELECT * WHERE invite_code = ?
    
    alt 家族見つかる
        Families-->>API: family データ
        
        API->>Profiles: INSERT (user_id, family_id, type: parent, ...)
        Profiles-->>API: profile_id
        
        API->>Parents: INSERT (profile_id, invite_code)
        Parents-->>API: parent_id
        
        API->>DB: COMMIT
        DB-->>API: 成功
        
        API-->>Hook: {success: true, parentId}
        Hook->>Hook: currentUserクエリ無効化
        Hook->>UI: ホーム画面へ遷移
        
    else 家族見つからない
        Families-->>API: null
        API->>DB: ROLLBACK
        API-->>Hook: {error: "招待コードが無効です"}
        Hook->>UI: エラーメッセージ表示
    end
```

## POST /api/children/join (子として参加)

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant UI as LoginTypeSelectPopup
    participant Hook as useJoinAsChild
    participant API as POST /api/children/join
    participant DB as Database
    participant Families as families table
    participant Profiles as profiles table
    participant Children as children table
    
    User->>UI: 招待コード入力
    User->>UI: 参加ボタンクリック
    UI->>Hook: joinAsChild({inviteCode, name, birthday})
    
    Hook->>API: POST /api/children/join
    API->>API: getAuthContext()
    API->>API: バリデーション
    
    API->>DB: BEGIN TRANSACTION
    
    API->>Families: SELECT * WHERE invite_code = ?
    
    alt 家族見つかる
        Families-->>API: family データ
        
        API->>Profiles: INSERT (user_id, family_id, type: child, ...)
        Profiles-->>API: profile_id
        
        API->>Children: INSERT (profile_id, invite_code, current_level: 1, total_exp: 0, ...)
        Children-->>API: child_id
        
        API->>DB: COMMIT
        DB-->>API: 成功
        
        API-->>Hook: {success: true, childId}
        Hook->>Hook: currentUserクエリ無効化
        Hook->>UI: ホーム画面へ遷移
        
    else 家族見つからない
        Families-->>API: null
        API->>DB: ROLLBACK
        API-->>Hook: {error: "招待コードが無効です"}
        Hook->>UI: エラーメッセージ表示
    end
```

## GET /api/users/login (セッション確認)

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant Page as page.tsx
    participant Hook as useLoginUserInfo
    participant API as GET /api/users/login
    participant Auth as getAuthContext
    participant DB as Database
    
    User->>Page: ページアクセス
    Page->>Page: checkIsLoggedIn()
    Page->>Hook: useLoginUserInfo()
    
    Hook->>API: GET /api/users/login
    API->>Auth: getAuthContext()
    
    alt セッション有効
        Auth-->>API: {db, userId}
        
        API->>DB: fetchUserInfoByUserId({db, userId})
        DB->>DB: JOIN profiles, parents, children, families, icons
        
        alt プロフィール存在
            DB-->>API: userInfo (profiles + parents/children)
            API-->>Hook: {userInfo: {...}}
            Hook-->>Page: userInfo
            Page->>Page: ホーム画面へリダイレクト
            
        else プロフィール不存在
            DB-->>API: null
            API-->>Hook: {userInfo: null}
            Hook-->>Page: null
            Page->>Page: ログイン画面表示（タイプ選択待ち）
        end
        
    else セッション無効
        Auth-->>API: AuthError
        API-->>Hook: 401 Unauthorized
        Hook-->>Page: エラー
        Page->>Page: ログイン画面表示
    end
```

## POST /api/auth/logout (サインアウト)

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant UI as Header/Menu
    participant Hook as useSignOut
    participant Supabase as Supabase Client
    participant Auth as Supabase Auth
    participant Cache as React Query Cache
    
    User->>UI: サインアウトボタンクリック
    UI->>UI: 確認ダイアログ表示
    User->>UI: OK
    
    UI->>Hook: signOut()
    Hook->>Supabase: auth.signOut()
    Supabase->>Auth: サインアウトリクエスト
    
    Auth->>Auth: セッション削除
    Auth-->>Supabase: 成功
    Supabase-->>Hook: {error: null}
    
    Hook->>Cache: queryClient.clear()
    Cache->>Cache: 全キャッシュクリア
    
    Hook->>Hook: ログイン画面へリダイレクト
    Hook-->>UI: 完了
```

## 初回ログイン → 家族作成フロー

```mermaid
sequenceDiagram
    actor User as ユーザー
    participant Login as LoginScreen
    participant Popup as LoginTypeSelectPopup
    participant Router as Next Router
    participant CreatePage as /families/new
    participant API as POST /api/families
    participant DB as Database
    
    User->>Login: ログイン実行
    Login->>Login: getLoginUser()
    Login->>Login: userInfo = null
    Login->>Popup: タイプ選択ポップアップ表示
    
    User->>Popup: 「新しい家族を作成する」選択
    Popup->>Router: router.push("/families/new")
    Router->>CreatePage: ページ遷移
    
    User->>CreatePage: 家族情報入力
    User->>CreatePage: 作成ボタンクリック
    
    CreatePage->>API: POST /api/families
    API->>DB: BEGIN TRANSACTION
    
    API->>DB: INSERT families
    API->>DB: INSERT profiles (type: parent)
    API->>DB: INSERT parents
    
    API->>DB: COMMIT
    DB-->>API: 成功
    
    API-->>CreatePage: {familyId, parentId}
    CreatePage->>Router: router.push("/")
    Router->>Router: ホーム画面へ遷移
```
