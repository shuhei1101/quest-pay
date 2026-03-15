# 公開クエスト閲覧画面 - フロー図

**(2026年3月記載)**

## 画面表示フロー

```mermaid
graph TD
    A[ページアクセス] --> B[PublicQuestView表示]
    B --> C[並列データ取得開始]
    
    C --> D[usePublicQuest]
    C --> E[useLikeCount]
    C --> F[useIsLike]
    C --> G[useCommentsCount]
    
    D --> H{データ取得完了}
    E --> H
    F --> H
    G --> H
    
    H --> I[selectedLevel=1に初期化]
    I --> J{レベル数確認}
    J -->|複数レベル| K[レベル選択ボタン表示]
    J -->|単一レベル| L[レベル選択ボタン非表示]
    K --> M[PublicQuestViewLayout表示]
    L --> M
```

## データ取得シーケンス

```mermaid
sequenceDiagram
    participant Screen as PublicQuestView
    participant Hook1 as usePublicQuest
    participant Hook2 as useLikeCount
    participant Hook3 as useIsLike
    participant Hook4 as useCommentsCount
    participant API as API Server
    participant DB as Database
    
    par 並列データ取得
        Screen->>Hook1: クエスト詳細取得
        Hook1->>API: GET /api/quests/public/[id]
        API->>DB: クエリ実行
        DB-->>API: クエストデータ
        API-->>Hook1: レスポンス
        Hook1-->>Screen: publicQuest
    and
        Screen->>Hook2: いいね数取得
        Hook2->>API: GET /api/quests/public/[id]/likes/count
        API->>DB: クエリ実行
        DB-->>API: いいね数
        API-->>Hook2: レスポンス
        Hook2-->>Screen: likeCount
    and
        Screen->>Hook3: いいね状態取得
        Hook3->>API: GET /api/quests/public/[id]/likes/status
        API->>DB: クエリ実行
        DB-->>API: いいね状態
        API-->>Hook3: レスポンス
        Hook3-->>Screen: isLike
    and
        Screen->>Hook4: コメント数取得
        Hook4->>API: GET /api/quests/public/[id]/comments/count
        API->>DB: クエリ実行
        DB-->>API: コメント数
        API-->>Hook4: レスポンス
        Hook4-->>Screen: commentCount
    end
    
    Screen->>Screen: selectedDetail計算
    Screen->>Screen: availableLevels計算
    Screen->>Screen: PublicQuestViewLayout表示
```

## いいね操作フロー

```mermaid
graph TD
    A[いいねボタンクリック] --> B{現在の状態}
    B -->|isLike === true| C[handleCancelLike実行]
    B -->|isLike === false| D[handleLike実行]
    
    C --> E[DELETE /api/quests/public/[id]/likes]
    D --> F[POST /api/quests/public/[id]/likes]
    
    E --> G{API結果}
    F --> H{API結果}
    
    G -->|成功| I[いいね状態更新]
    G -->|エラー| J[エラー通知]
    
    H -->|成功| K[いいね状態更新]
    H -->|エラー| L[エラー通知]
    
    I --> M[useLikeCount, useIsLike再取得]
    K --> M
    
    M --> N[画面再レンダリング]
```

## コメントモーダルフロー

```mermaid
graph TD
    A[コメントボタンクリック] --> B[openCommentModal実行]
    B --> C[commentModalOpened = true]
    C --> D[PublicQuestComments表示]
    
    D --> E[並列データ取得]
    E --> F[usePublicQuestComments]
    E --> G[usePublicQuest]
    E --> H[useIsLike]
    
    F --> I[コメント一覧表示]
    G --> I
    H --> I
    
    I --> J{ユーザー操作}
    J -->|コメント投稿| K[handlePostComment]
    J -->|高評価| L[handleUpvote]
    J -->|低評価| M[handleDownvote]
    J -->|報告| N[handleReport]
    J -->|削除| O[handleDelete]
    J -->|ピン留め| P[handlePin]
    J -->|公開者いいね| Q[handlePublisherLike]
    J -->|閉じる| R[closeCommentModal]
    
    K --> S[refetch実行]
    L --> S
    M --> S
    N --> S
    O --> S
    P --> S
    Q --> S
    
    S --> I
    R --> T[commentModalOpened = false]
```

## コメント投稿フロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Modal as PublicQuestComments
    participant Hook as usePostComment
    participant API as API Server
    participant DB as Database
    
    User->>Modal: コメントを入力
    User->>Modal: 投稿ボタンクリック
    Modal->>Modal: comment.trim()チェック
    Modal->>Hook: handlePostComment実行
    Hook->>API: POST /api/quests/public/[id]/comments
    API->>DB: INSERT INTO comments
    DB-->>API: 成功
    API-->>Hook: レスポンス
    Hook->>Modal: onSuccess コールバック
    Modal->>Modal: setComment("")
    Modal->>Modal: refetch実行
    Modal->>API: GET /api/quests/public/[id]/comments
    API->>DB: SELECT comments
    DB-->>API: コメント一覧
    API-->>Modal: レスポンス
    Modal->>Modal: 画面再レンダリング
```

## 高評価・低評価フロー

```mermaid
graph TD
    A[高評価/低評価ボタンクリック] --> B[commentId取得]
    B --> C[comments配列から該当コメント検索]
    C --> D{コメント存在?}
    
    D -->|No| E[何もしない]
    D -->|Yes| F{現在の状態}
    
    F -->|高評価済み| G[高評価解除API]
    F -->|未評価| H[高評価API]
    F -->|低評価済み| I[低評価解除API]
    
    G --> J[PUT /api/comments/[commentId]/upvote]
    H --> J
    I --> K[PUT /api/comments/[commentId]/downvote]
    
    J --> L{API結果}
    K --> L
    
    L -->|成功| M[onSuccess コールバック]
    L -->|エラー| N[エラー通知]
    
    M --> O[refetch実行]
    O --> P[コメント一覧再取得]
```

## レベル選択フロー

```mermaid
graph TD
    A[レベル選択ボタンクリック] --> B[FAB閉じる]
    B --> C[levelMenuOpened = true]
    C --> D[レベル選択メニュー表示]
    D --> E[ユーザーがレベル選択]
    E --> F[handleLevelChange実行]
    F --> G[selectedLevel更新]
    G --> H[levelMenuOpened = false]
    H --> I[selectedDetail再計算]
    I --> J[画面再レンダリング]
    
    D --> K[メニュー外クリック]
    K --> L[levelMenuOpened = false]
    L --> M[メニュー閉じる]
```

## FAB操作フロー

```mermaid
graph TD
    A[FABメニューボタン] --> B{選択されたアクション}
    
    B -->|いいね| C[likeToggleHandle実行]
    C --> D{isLike}
    D -->|true| E[handleCancelLike]
    D -->|false| F[handleLike]
    
    B -->|コメント| G[openCommentModal実行]
    G --> H[コメントモーダル表示]
    
    B -->|家族| I[家族ページへ遷移]
    
    B -->|レベル選択| J[FAB閉じる]
    J --> K[レベル選択メニュー表示]
```

## コメントソート切り替えフロー

```mermaid
graph TD
    A[ソートボタンクリック] --> B{現在のソート}
    B -->|newest| C[sortType = "likes"に変更]
    B -->|likes| D[sortType = "newest"に変更]
    
    C --> E[コメント配列を再ソート]
    D --> E
    
    E --> F{sortType}
    F -->|newest| G[createdAt DESC]
    F -->|likes| H[likeCount DESC]
    
    G --> I[画面再レンダリング]
    H --> I
```

## 条件付きレンダリング

### レベル選択ボタンの表示条件
```typescript
availableLevels.length > 1
```

### レベル選択メニューの表示条件
```typescript
availableLevels.length > 1 && levelMenuOpened
```

### コメント削除ボタンの表示条件
```typescript
isOwnComment === true
```

### ピン留めボタンの表示条件
```typescript
isPublisher === true
```

### 公開者いいねの表示条件
```typescript
isPublisher === true
```

## エラーハンドリングフロー

```mermaid
graph TD
    A[API呼び出し] --> B{レスポンス}
    B -->|成功| C[データ表示]
    B -->|エラー| D{エラータイプ}
    
    D -->|404 Not Found| E[クエストが見つかりません]
    D -->|403 Forbidden| F[アクセス権限がありません]
    D -->|500 Server Error| G[サーバーエラー]
    
    E --> H[エラー通知表示]
    F --> H
    G --> H
    
    H --> I{リトライ可能?}
    I -->|Yes| J[リトライボタン表示]
    I -->|No| K[戻るボタン表示]
```

## ローディング状態の管理

### 画面全体のローディング
```typescript
// 画面表示時のローディング
isLoading: boolean (usePublicQuest)

// PublicQuestViewLayoutに渡す
<PublicQuestViewLayout
  isLoading={isLoading}
  // ...other props
/>
```

### コメントモーダルのローディング
```typescript
// すべてのローディング状態を統合
const isLoading = 
  isPostingComment || 
  isUpvoting || 
  isDownvoting || 
  isReporting || 
  isDeleting || 
  isPinning || 
  isPublisherLiking

// モーダル全体にローディングオーバーレイ
<LoadingOverlay visible={isLoading} />
```

### ボタン個別のローディング
```typescript
<Button
  loading={isPostingComment}
  disabled={isPostingComment}
>
  投稿
</Button>
```
