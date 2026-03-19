# 設定画面 処理フロー図

(2026年3月記載)

## 概要

設定画面の主要な処理フローを図解します。PC（2ペイン）とモバイル（シングルペイン）の違い、設定項目のクリックフロー、データ保存フローを含みます。

## 初期表示フロー（PC）

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Layout as layout.tsx
    participant List as SettingsList
    participant Page as profile/page.tsx
    
    User->>Browser: /settings にアクセス
    Browser->>Layout: レンダリング開始
    Layout->>Layout: useWindow().isTablet → true
    Layout->>Layout: getSelectedSettingFromPath() → null
    Layout->>Layout: useEffect でリダイレクト
    Browser->>Page: /settings/profile へ遷移
    
    Page->>Layout: レンダリング
    Layout->>Layout: getSelectedSettingFromPath() → 'profile'
    Layout->>List: 左ペインに表示（selectedSetting='profile'）
    Layout->>Page: 右ペインに表示（children）
    List->>List: プロフィール項目をハイライト表示
```

## 初期表示フロー（モバイル）

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Layout as layout.tsx
    participant List as SettingsList
    
    User->>Browser: /settings にアクセス
    Browser->>Layout: レンダリング開始
    Layout->>Layout: useWindow().isTablet → false
    Layout->>Layout: getSelectedSettingFromPath() → null
    Layout->>List: 全画面表示（selectedSetting=null）
    List->>User: 設定一覧を表示
```

## 設定項目クリックフロー（PC）

```mermaid
sequenceDiagram
    participant User
    participant List as SettingsList
    participant Item as SettingsListItem
    participant Router
    participant Layout
    participant Detail as 詳細ページ
    
    User->>Item: 通知設定をクリック
    Item->>Router: router.push('/settings/notifications')
    Router->>Layout: URLパス更新
    Layout->>Layout: getSelectedSettingFromPath() → 'notifications'
    Layout->>List: selectedSetting を更新
    Layout->>Detail: 右ペインに通知設定ページ表示
    List->>List: 通知設定項目をハイライト
```

## 設定項目クリックフロー（モバイル）

```mermaid
sequenceDiagram
    participant User
    participant List as SettingsList
    participant Item as SettingsListItem
    participant Router
    participant Layout
    participant Detail as 詳細ページ
    
    User->>Item: 通知設定をクリック
    Item->>Router: router.push('/settings/notifications')
    Router->>Layout: URLパス更新
    Layout->>Layout: getSelectedSettingFromPath() → 'notifications'
    Layout->>Layout: selectedSetting != null → 詳細表示
    Layout->>Detail: 全画面で通知設定ページ表示
    
    User->>Detail: 戻るボタンクリック
    Detail->>Router: router.back()
    Router->>Layout: URLパス更新 → '/settings'
    Layout->>Layout: getSelectedSettingFromPath() → null
    Layout->>List: 全画面で一覧表示
```

## スイッチ型設定項目の変更フロー

```mermaid
sequenceDiagram
    participant User
    participant Page as notifications/page.tsx
    participant Item as SettingsListItem (switch)
    participant State as React State
    participant API as API Route
    participant DB as Database
    
    User->>Item: プッシュ通知スイッチをON
    Item->>State: onChange(true) 実行
    State->>Page: pushEnabled = true に更新
    Page->>Page: 自動的に再レンダリング
    Item->>Item: スイッチが ON 状態で表示
    
    Page->>API: PUT /api/settings/notifications
    Note over API: { pushEnabled: true }
    API->>DB: UPDATE user_settings...
    DB-->>API: 更新成功
    API-->>Page: 200 OK
    Page->>User: トースト通知「設定を保存しました」
```

## フォーム型設定の保存フロー

```mermaid
sequenceDiagram
    participant User
    participant Page as profile/page.tsx
    participant Form as フォーム
    participant API as API Route
    participant DB as Database
    
    User->>Form: 名前を「太郎」に変更
    Form->>Page: useState で状態更新
    User->>Form: 自己紹介を入力
    Form->>Page: useState で状態更新
    
    User->>Page: 「保存」ボタンクリック
    Page->>Page: バリデーション実行
    alt バリデーションOK
        Page->>API: PUT /api/settings/profile
        Note over API: { name: "太郎", bio: "..." }
        API->>DB: UPDATE users SET name=...
        DB-->>API: 更新成功
        API-->>Page: 200 OK
        Page->>User: 成功トースト表示
    else バリデーションNG
        Page->>User: エラーメッセージ表示
    end
```

## レスポンシブ切り替えフロー

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Layout
    participant Window as useWindow
    
    Note over User,Window: 初期状態: PC表示（2ペイン）
    User->>Browser: ブラウザ幅を縮小
    Browser->>Window: resize イベント発火
    Window->>Window: innerWidth < 768 判定
    Window->>Layout: isTablet = false に更新
    Layout->>Layout: 再レンダリング
    
    alt URLが /settings のみ
        Layout->>Layout: 一覧を全画面表示
    else URLが /settings/xxx
        Layout->>Layout: 詳細ページを全画面表示
    end
```

## エラーハンドリングフロー

```mermaid
sequenceDiagram
    participant User
    participant Page
    participant API
    participant ErrorHandler
    
    User->>Page: 設定を変更して保存
    Page->>API: PUT リクエスト
    
    alt ネットワークエラー
        API-->>Page: エラーレスポンス
        Page->>ErrorHandler: catchブロック実行
        ErrorHandler->>User: エラートースト表示
        ErrorHandler->>Page: 元の状態にロールバック
    else サーバーエラー
        API-->>Page: 500 エラー
        Page->>ErrorHandler: エラーハンドリング
        ErrorHandler->>User: エラーメッセージ表示
    else 成功
        API-->>Page: 200 OK
        Page->>User: 成功トースト表示
    end
```

## ページ遷移の状態管理

```mermaid
graph TB
    Start[/settings/] --> Check{isTablet?}
    Check -->|true PC| Redirect[useEffect でリダイレクト]
    Check -->|false モバイル| ShowList[一覧表示]
    
    Redirect --> Profile[/settings/profile/]
    Profile --> PC_Layout[2ペインレイアウト]
    PC_Layout --> List[左: 設定一覧]
    PC_Layout --> Detail[右: プロフィール詳細]
    
    ShowList --> Click{項目クリック}
    Click --> Push[router.push()]
    Push --> Mobile_Detail[詳細ページ全画面表示]
    
    Mobile_Detail --> Back{戻るボタン}
    Back --> ShowList
```

## コンポーネント階層図

```mermaid
graph TD
    Layout[layout.tsx] --> Check{isTablet?}
    
    Check -->|true| TwoPane[2ペイン表示]
    TwoPane --> LeftPane[左ペイン: SettingsList]
    TwoPane --> RightPane[右ペイン: children]
    
    Check -->|false| SinglePane[シングルペイン]
    SinglePane --> CheckUrl{selectedSetting?}
    CheckUrl -->|null| ShowList[SettingsList]
    CheckUrl -->|あり| ShowDetail[children 詳細ページ]
    
    LeftPane --> Section1[SettingsSection]
    ShowList --> Section2[SettingsSection]
    
    Section1 --> Item1[SettingsListItem]
    Section2 --> Item2[SettingsListItem]
    
    RightPane --> ProfilePage[profile/page.tsx]
    RightPane --> NotifPage[notifications/page.tsx]
    RightPane --> PrivacyPage[privacy/page.tsx]
    RightPane --> AboutPage[about/page.tsx]
    
    ShowDetail --> DetailPages[各詳細ページ]
```

## ベストプラクティス

### ✅ DO
- URLパスから状態を復元する（ブラウザ戻る/進むに対応）
- レスポンシブ切り替えは`useWindow`フックに統一
- エラー時は元の状態にロールバック
- 保存成功時はトースト通知で明示

### ❌ DON'T
- クライアント側の状態とURLが乖離しないようにする
- `window.innerWidth`を直接使用しない（SSR対応のため）
- 保存中のローディング状態を省略しない
- 戻るボタンの動作をカスタマイズしすぎない（標準動作を維持）
