# 家族クエスト閲覧画面 - フロー図

**(2026年3月記載)**

## 画面表示フロー

```mermaid
graph TD
    A[ページアクセス] --> B{ユーザータイプ判定}
    B -->|親| C[FamilyQuestViewScreen]
    B -->|子供| D[ChildQuestViewScreen]
    
    C --> E[useFamilyQuest実行]
    E --> F[クエスト詳細取得]
    F --> G[selectedLevel=1に初期化]
    G --> H{レベル数確認}
    H -->|複数レベル| I[レベル選択ボタン表示]
    H -->|単一レベル| J[レベル選択ボタン非表示]
    I --> K[FamilyQuestViewLayout表示]
    J --> K
    
    D --> L[子供専用データ取得]
    L --> M[ChildQuestViewLayout表示]
```

## データ取得フロー

```mermaid
sequenceDiagram
    participant Screen as FamilyQuestViewScreen
    participant Hook as useFamilyQuest
    participant API as GET /api/quests/family/[id]
    participant DB as Database
    
    Screen->>Hook: クエスト詳細取得要求
    Hook->>API: APIリクエスト
    API->>DB: クエスト情報クエリ
    DB->>DB: family_quests JOIN
    DB->>DB: family_quest_details JOIN
    DB->>DB: tags JOIN
    DB-->>API: クエストデータ
    API-->>Hook: レスポンス
    Hook-->>Screen: familyQuest, isLoading
    Screen->>Screen: selectedDetail計算
    Screen->>Screen: availableLevels計算
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
    
    B -->|戻る| C[router.back実行]
    
    B -->|編集| D[編集権限チェック]
    D -->|OK| E[編集画面へ遷移]
    D -->|NG| F[エラー表示]
    
    B -->|削除| G[削除確認ダイアログ]
    G -->|確認| H[DELETE APIコール]
    H --> I[ホーム画面へ遷移]
    G -->|キャンセル| J[何もしない]
    
    B -->|公開| K[公開確認ダイアログ]
    K -->|確認| L[POST /publish APIコール]
    L --> M[成功通知]
    K -->|キャンセル| J
    
    B -->|レベル選択| N[FAB閉じる]
    N --> O[レベル選択メニュー表示]
```

## 子供専用ビューフロー

```mermaid
graph TD
    A[子供専用ページアクセス] --> B[ChildQuestViewScreen]
    B --> C[クエスト詳細取得]
    C --> D[子供クエスト状態取得]
    D --> E{クエスト状態}
    
    E -->|not_started| F[受注ボタン表示]
    F --> G[受注ボタンクリック]
    G --> H[POST /child/[childId]/start]
    H --> I[状態をin_progressに更新]
    
    E -->|in_progress| J[完了報告ボタン表示]
    J --> K[完了報告ボタンクリック]
    K --> L[POST /review-request]
    L --> M[状態をpending_reviewに更新]
    
    E -->|pending_review| N[報告キャンセルボタン表示]
    N --> O[キャンセルボタンクリック]
    O --> P[POST /cancel-review]
    P --> Q[状態をin_progressに更新]
    
    E -->|completed| R[完了済み表示]
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

### 編集・削除・公開ボタンの表示条件
```typescript
// 親ユーザーのみ表示
userInfo?.profiles?.role === 'parent'
```

### 子供専用アクションの表示条件
```typescript
// 子供IDが存在し、子供ユーザーの場合
childId && userInfo?.profiles?.role === 'child'
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
    
    E --> H[エラー画面表示]
    F --> H
    G --> H
    
    H --> I[戻るボタン]
    I --> J[前の画面へ]
```

## ローディング状態の管理

```typescript
// ローディング中の表示
isLoading: boolean

// FamilyQuestViewLayoutに渡す
<FamilyQuestViewLayout
  isLoading={isLoading}
  // ...other props
/>

// Loading Overlayが表示される
```
