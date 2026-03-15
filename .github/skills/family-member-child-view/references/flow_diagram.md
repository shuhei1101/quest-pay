(2026年3月記載)

# 家族メンバー子供閲覧画面 フロー図

## 画面表示フロー全体

```mermaid
flowchart TD
    Start([ユーザーがページアクセス]) --> CheckPath{アクセス<br/>パス?}
    
    CheckPath -->|/families/.../view| RedirectPage[リダイレクトページ]
    CheckPath -->|/children/[id]| DirectAccess[直接アクセス]
    
    RedirectPage --> Redirect[redirect to /children/:id]
    Redirect --> DirectAccess
    
    DirectAccess --> Mount[ChildView マウント]
    Mount --> FetchData[useChild<br/>データ取得開始]
    
    FetchData --> CheckCache{キャッシュ<br/>存在?}
    CheckCache -->|あり| UseCache[キャッシュから表示]
    CheckCache -->|なし| APICall[API呼び出し<br/>GET /api/children/:id]
    
    APICall --> CheckAuth{認証<br/>チェック}
    CheckAuth -->|失敗| AuthError[認証エラー表示<br/>ログイン画面へ]
    CheckAuth -->|成功| CheckRole{ロール<br/>チェック}
    
    CheckRole -->|子供| RoleError[権限エラー表示<br/>親のみアクセス可能]
    CheckRole -->|親| CheckFamily{家族<br/>チェック}
    
    CheckFamily -->|別家族| FamilyError[権限エラー表示<br/>別の家族の子供は閲覧不可]
    CheckFamily -->|同家族| FetchDB[DBからデータ取得]
    
    FetchDB --> Transform[データ変換<br/>useChildViewModel]
    UseCache --> Transform
    
    Transform --> Render[画面レンダリング]
    
    Render --> ShowLayout[ChildViewLayout表示]
    Render --> CheckUserLink{user_id<br/>存在?}
    
    CheckUserLink -->|なし| ShowInviteAuto[招待コードポップアップ<br/>自動表示]
    CheckUserLink -->|あり| ShowActions[アクションボタン表示]
    
    ShowInviteAuto --> ShowInviteButton[招待コードボタン表示]
    ShowInviteButton --> ShowActions
    
    ShowActions --> UserAction{ユーザー<br/>アクション}
    
    UserAction -->|招待コード表示| InviteFlow[招待コード表示フロー]
    UserAction -->|報酬履歴| RewardFlow[報酬履歴画面へ遷移]
    UserAction -->|編集FAB| EditFlow[編集画面へ遷移]
    UserAction -->|待機| WaitUser[ユーザー待機]
    
    InviteFlow --> ShowPopup[InviteCodePopup表示]
    ShowPopup --> CopyAction{コピー<br/>クリック?}
    CopyAction -->|Yes| CopyCode[クリップボードにコピー]
    CopyAction -->|No| ClosePopup[ポップアップ閉じる]
    CopyCode --> ShowToast[成功トースト表示]
    ShowToast --> ClosePopup
    ClosePopup --> UserAction
    
    RewardFlow --> NavReward[navigate to /children/:id/rewards]
    EditFlow --> NavEdit[navigate to /children/:id/edit]
    
    WaitUser --> UserAction
    
    AuthError --> End([終了])
    RoleError --> End
    FamilyError --> End
    NavReward --> End
    NavEdit --> End
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style Render fill:#cfe2ff
    style ShowInviteAuto fill:#fff3cd
```

## 初期表示シーケンス

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Page as page.tsx
    participant View as ChildView
    participant Hook as useChild
    participant API as API Route
    participant DB as Database
    
    User->>Page: /children/[id] アクセス
    Page->>Page: 認証・権限チェック
    
    alt 認証失敗
        Page-->>User: 認証エラー画面
    else 権限エラー（子供アカウント）
        Page-->>User: 権限エラー画面
    else 別家族の子供
        Page-->>User: 権限エラー画面
    else OK
        Page->>View: childId を渡してマウント
        View->>Hook: useChild(childId)
        Hook->>API: GET /api/children/:id
        
        API->>API: 認証チェック
        API->>API: 家族メンバーチェック
        API->>DB: children 取得
        API->>DB: families 取得
        
        DB-->>API: データ返却
        API->>API: データ結合・整形
        API-->>Hook: JSON レスポンス
        
        Hook->>Hook: useChildViewModel<br/>データ変換
        Hook-->>View: 表示用データ
        
        View->>View: レンダリング
        
        alt user_id が null
            View->>View: 招待コードポップアップ<br/>自動表示
            View-->>User: 画面表示 + ポップアップ
        else user_id あり
            View-->>User: 画面表示
        end
    end
```

## 招待コード表示フロー

```mermaid
flowchart TD
    Start([ユーザーが「招待コード表示」クリック]) --> OpenPopup[InviteCodePopup<br/>opened: true]
    
    OpenPopup --> ShowModal[モーダル表示<br/>- 招待コード<br/>- コピーボタン<br/>- 説明文]
    
    ShowModal --> UserAction{ユーザー<br/>アクション}
    
    UserAction -->|コピーボタン| CopyAction[navigator.clipboard.writeText]
    UserAction -->|閉じる| CloseModal[opened: false]
    UserAction -->|背景クリック| CloseModal
    
    CopyAction --> CheckCopy{コピー<br/>成功?}
    
    CheckCopy -->|成功| ShowSuccess[成功トースト表示<br/>「コピーしました」]
    CheckCopy -->|失敗| ShowError[エラートースト表示<br/>「コピーに失敗しました」]
    
    ShowSuccess --> KeepOpen[モーダル開いたまま]
    ShowError --> KeepOpen
    
    KeepOpen --> UserAction
    CloseModal --> End([完了])
    
    style Start fill:#e1f5e1
    style End fill:#cfe2ff
    style ShowSuccess fill:#d1e7dd
    style ShowError fill:#f8d7da
```

## 自動ポップアップフロー

```mermaid
flowchart TD
    Start([初回レンダリング]) --> CheckMount{コンポーネント<br/>マウント?}
    
    CheckMount -->|Yes| CheckData{データ<br/>取得完了?}
    CheckMount -->|No| Wait[待機]
    
    CheckData -->|No| Wait
    CheckData -->|Yes| CheckUserId{user_id<br/>存在?}
    
    CheckUserId -->|あり| NoPopup[ポップアップ表示しない]
    CheckUserId -->|なし| ShowAuto[招待コードポップアップ<br/>自動表示<br/>showInvitePopup: true]
    
    ShowAuto --> UserSees[ユーザーが招待コード確認]
    UserSees --> UserClose{ユーザーが<br/>閉じる?}
    
    UserClose -->|Yes| ClosePopup[showInvitePopup: false]
    UserClose -->|再度開く| ManualOpen[招待コードボタン<br/>クリックで再表示]
    
    ClosePopup --> End([完了])
    ManualOpen --> End
    NoPopup --> End
    Wait --> CheckMount
    
    style Start fill:#e1f5e1
    style End fill:#ffe1e1
    style ShowAuto fill:#fff3cd
```

### useEffect による自動表示実装

```typescript
// ChildView.tsx
useEffect(() => {
  if (data && !data.child.user_id) {
    setShowInvitePopup(true)
  }
}, [data])
```

## 報酬履歴画面遷移フロー

```mermaid
flowchart TD
    Start([ユーザーが「報酬履歴を見る」クリック]) --> Navigate[router.push<br/>/children/:id/rewards]
    
    Navigate --> NewPage[報酬履歴画面<br/>ページ遷移]
    NewPage --> End([完了])
    
    style Start fill:#e1f5e1
    style End fill:#cfe2ff
```

## 編集画面遷移フロー（FAB）

```mermaid
flowchart TD
    Start([ユーザーがFABクリック]) --> CheckPermission{親ユーザー?}
    
    CheckPermission -->|No| NotShown[FAB自体が非表示]
    CheckPermission -->|Yes| Navigate[router.push<br/>/children/:id/edit]
    
    Navigate --> NewPage[編集画面<br/>ページ遷移]
    NewPage --> End([完了])
    NotShown --> End
    
    style Start fill:#e1f5e1
    style End fill:#cfe2ff
```

## リダイレクトフロー

```mermaid
flowchart TD
    Start([ユーザーが<br/>/families/members/child/:id/view<br/>にアクセス]) --> RedirectPage[page.tsx<br/>リダイレクト専用]
    
    RedirectPage --> Execute[redirect関数実行<br/>'/children/:id']
    
    Execute --> NewURL[URL変更<br/>/children/:id]
    NewURL --> LoadPage[子供閲覧ページ読み込み]
    LoadPage --> End([完了])
    
    style Start fill:#e1f5e1
    style End fill:#cfe2ff
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    Error([エラー発生]) --> CheckType{エラー種別}
    
    CheckType -->|認証エラー| AuthError[認証エラー画面表示]
    CheckType -->|権限エラー（子供）| RoleError[権限エラー表示<br/>「親のみアクセスできます」]
    CheckType -->|権限エラー（別家族）| FamilyError[権限エラー表示<br/>「別の家族の子供は閲覧できません」]
    CheckType -->|データ不在| NotFound[404エラー表示<br/>「子供が見つかりません」]
    CheckType -->|ネットワークエラー| NetError[ネットワークエラー表示<br/>リトライボタン表示]
    CheckType -->|その他| GenError[一般エラー表示]
    
    AuthError --> RedirectLogin[ログイン画面へリダイレクト]
    RoleError --> BackButton[一覧へ戻るボタン表示]
    FamilyError --> BackButton
    NotFound --> BackButton
    NetError --> RetryButton[リトライボタン表示]
    GenError --> BackButton
    
    RedirectLogin --> End([終了])
    BackButton --> End
    RetryButton --> Retry{ユーザー<br/>リトライ?}
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
    
    Success --> DisplayingNoInvite: user_id なし
    Success --> DisplayingLinked: user_id あり
    
    DisplayingNoInvite --> PopupOpen: 自動または手動
    PopupOpen --> DisplayingNoInvite: ポップアップ閉じる
    
    DisplayingLinked --> Navigation: アクション実行
    DisplayingNoInvite --> Navigation: アクション実行
    
    Navigation --> [*]: 遷移完了
    Error --> [*]: エラー終了
```
