# 家族プロフィール閲覧画面 - フロー図

**(2026年3月15日 14:30記載)**

## 画面表示フロー

```mermaid
graph TD
    A[ページアクセス] --> B[authGuard実行]
    B --> C{権限チェック}
    C -->|子供| D[HOME_URLへリダイレクト]
    C -->|ゲスト| D
    C -->|親| E[FamilyProfileViewScreen表示]
    
    E --> F[並列データ取得開始]
    F --> G[useFamilyDetail]
    F --> H[useFollowStatus]
    F --> I[useFamilyTimeline]
    F --> J[useLoginUserInfo]
    
    G --> K{データ取得完了}
    H --> K
    I --> K
    J --> K
    
    K --> L[isOwnFamily判定]
    L --> M{自家族?}
    M -->|Yes| N[フォローボタン非表示]
    M -->|No| O[フォローボタン表示]
    
    N --> P[FamilyProfileViewLayout表示]
    O --> P
```

## データ取得シーケンス

```mermaid
sequenceDiagram
    participant Screen as FamilyProfileViewScreen
    participant Hook1 as useFamilyDetail
    participant Hook2 as useFollowStatus
    participant Hook3 as useFamilyTimeline
    participant API as API Server
    participant DB as Database
    
    par 並列データ取得
        Screen->>Hook1: 家族詳細取得
        Hook1->>API: GET /api/families/[id]/profile
        API->>DB: クエリ実行
        DB-->>API: 家族データ
        API-->>Hook1: レスポンス
        Hook1-->>Screen: familyDetail
    and
        Screen->>Hook2: フォロー状態取得
        Hook2->>API: GET /api/families/[id]/follow/status
        API->>DB: クエリ実行
        DB-->>API: フォロー状態
        API-->>Hook2: レスポンス
        Hook2-->>Screen: isFollowing
    and
        Screen->>Hook3: タイムライン取得
        Hook3->>API: GET /api/families/[id]/timeline
        API->>DB: クエリ実行
        DB-->>API: タイムラインデータ
        API-->>Hook3: レスポンス
        Hook3-->>Screen: timelines
    end
    
    Screen->>Screen: データ整形
    Screen->>Screen: isOwnFamily判定
    Screen->>Screen: FamilyProfileViewLayout表示
```

## フォロー切り替えフロー

```mermaid
graph TD
    A[フォローボタンクリック] --> B{現在の状態}
    B -->|isFollowing === true| C[unfollow実行]
    B -->|isFollowing === false| D[follow実行]
    
    C --> E[DELETE /api/families/[id]/follow]
    D --> F[POST /api/families/[id]/follow]
    
    E --> G{API結果}
    F --> H{API結果}
    
    G -->|成功| I[フォロー状態更新]
    G -->|エラー| J[エラー通知]
    
    H -->|成功| K[フォロー状態更新]
    H -->|エラー| L[エラー通知]
    
    I --> M[useFollowStatus再取得]
    K --> M
    
    M --> N[画面再レンダリング]
```

## タイムライン表示フロー

```mermaid
graph TD
    A[useFamilyTimeline実行] --> B[タイムラインデータ取得]
    B --> C[timelines配列を取得]
    C --> D[データ整形処理開始]
    
    D --> E[timelines.map実行]
    E --> F{各タイムラインアイテム}
    
    F --> G[timeline.family_timeline取得]
    G --> H[message抽出]
    G --> I[createdAt抽出]
    
    H --> J{message存在?}
    J -->|Yes| K[messageを使用]
    J -->|No| L["" を使用]
    
    I --> M{createdAt存在?}
    M -->|Yes| N[formatTime変換]
    M -->|No| O["" を使用]
    
    K --> P[formattedTimeline作成]
    L --> P
    N --> P
    O --> P
    
    P --> Q[formattedTimelines配列]
    Q --> R[FamilyProfileViewLayoutへ渡す]
```

## 自家族判定フロー

```mermaid
graph TD
    A[useLoginUserInfo実行] --> B[userInfo取得]
    B --> C[ログインユーザーのfamilyId取得]
    C --> D[画面のid取得]
    D --> E{familyId === id?}
    
    E -->|Yes| F[isOwnFamily = true]
    E -->|No| G[isOwnFamily = false]
    
    F --> H[フォローボタン非表示]
    G --> I[フォローボタン表示]
    
    I --> J{isFollowing?}
    J -->|true| K["フォロー解除"ボタン]
    J -->|false| L["フォローする"ボタン]
```

## 条件付きレンダリング

### フォローボタンの表示条件
```typescript
isOwnFamily === false
```

### フォローボタンのラベル
```typescript
isFollowing ? "フォロー解除" : "フォローする"
```

### ローディングオーバーレイの表示条件
```typescript
isFamilyLoading || isFollowLoading || isTimelineLoading || isFollowToggleLoading
```

## エラーハンドリングフロー

```mermaid
graph TD
    A[API呼び出し] --> B{レスポンス}
    B -->|成功| C[データ表示]
    B -->|エラー| D{エラータイプ}
    
    D -->|404 Not Found| E[家族が見つかりません]
    D -->|403 Forbidden| F[アクセス権限がありません]
    D -->|500 Server Error| G[サーバーエラー]
    
    E --> H[エラー通知表示]
    F --> H
    G --> H
    
    H --> I{リトライ可能?}
    I -->|Yes| J[リトライボタン表示]
    I -->|No| K[戻るボタン表示]
```

## authGuard フロー

```mermaid
graph TD
    A[page.tsx アクセス] --> B[authGuard実行]
    B --> C{ユーザータイプ判定}
    
    C -->|子供| D[childNG: true]
    C -->|ゲスト| E[guestNG: true]
    C -->|親| F[権限OK]
    
    D --> G[redirect to HOME_URL]
    E --> G
    
    F --> H[FamilyProfileViewScreen表示]
```

**authGuard設定:**
```typescript
await authGuard({ 
  childNG: true,  // 子供はアクセス不可
  guestNG: true,  // ゲストはアクセス不可
  redirectUrl: HOME_URL 
})
```

## ページ遷移フロー

```mermaid
graph TD
    A[家族一覧画面] --> B[家族選択]
    B --> C[/families/[id]/view アクセス]
    C --> D[authGuard]
    D --> E{権限チェック}
    
    E -->|親| F[プロフィール画面表示]
    E -->|子供/ゲスト| G[ホーム画面へリダイレクト]
    
    F --> H{ユーザー操作}
    H -->|編集ボタン| I[/families/[id]/edit へ遷移]
    H -->|フォローボタン| J[フォロー処理]
    H -->|タイムライン項目| K[詳細画面へ遷移]
    H -->|戻るボタン| L[前の画面へ戻る]
```

## ローディング状態の管理

```typescript
// すべてのローディング状態を統合
const isLoading = 
  isFamilyLoading || 
  isFollowLoading || 
  isTimelineLoading || 
  isFollowToggleLoading

// Layoutに渡す
<FamilyProfileViewLayout
  isLoading={isLoading}
  // ...other props
/>
```
