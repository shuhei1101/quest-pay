(2026年3月15日 14:30記載)

# 公開クエスト一覧 フロー図

## 初期表示フロー

```mermaid
flowchart TD
    A[ユーザーが公開クエスト画面を開く] --> B[PublicQuestsScreen マウント]
    B --> C[usePublicQuests フック実行]
    C --> D{キャッシュ存在?}
    D -->|あり| E[キャッシュから表示]
    D -->|なし| F[API: GET /api/quests/public]
    F --> G[DB: public_quests テーブル照会]
    G --> H[JOIN quest_categories, families]
    H --> I[いいね・コメント数を集計]
    I --> J[公開クエストリスト取得]
    J --> K[React Query キャッシュ保存]
    E --> L[PublicQuestList レンダリング]
    K --> L
    L --> M[各 PublicQuestCard 表示]
```

## 検索フロー

```mermaid
flowchart TD
    A[ユーザーが検索バーに入力] --> B[デバウンス処理 500ms]
    B --> C[searchQuery State更新]
    C --> D[usePublicQuests 再実行]
    D --> E[新しいクエリキーで API呼び出し]
    E --> F[DB: WHERE条件付きクエリ]
    F --> G[タイトル・説明文をLIKE検索]
    G --> H[検索結果取得]
    H --> I[一覧を再レンダリング]
    I --> J{結果あり?}
    J -->|あり| K[クエストカード表示]
    J -->|なし| L[空状態表示]
```

## フィルタリングフロー

```mermaid
flowchart TD
    A[ユーザーがフィルタを選択] --> B{フィルタタイプ}
    B -->|カテゴリ| C[categoryId 更新]
    B -->|ソート| D[sortBy 更新]
    C --> E[usePublicQuests 再実行]
    D --> E
    E --> F[API: GET with params]
    F --> G{ソート条件}
    G -->|人気順| H[ORDER BY likeCount DESC]
    G -->|新着順| I[ORDER BY createdAt DESC]
    G -->|コメント数順| J[ORDER BY commentCount DESC]
    H --> K[フィルタ済みリスト取得]
    I --> K
    J --> K
    K --> L[一覧を再レンダリング]
```

## いいねフロー

```mermaid
flowchart TD
    A[ユーザーがいいねボタンをクリック] --> B{既にいいね済み?}
    B -->|いいえ| C[useLikePublicQuest.mutate]
    B -->|はい| D[useUnlikePublicQuest.mutate]
    C --> E[楽観的UI更新]
    D --> E
    E --> F[いいね数を +1/-1]
    F --> G[いいねアイコンを切り替え]
    G --> H{認証済み?}
    H -->|いいえ| I[ログインモーダル表示]
    H -->|はい| J[API: POST/DELETE /api/quests/public/id/like]
    J --> K{API成功?}
    K -->|成功| L[DB: public_quest_likes 追加/削除]
    K -->|失敗| M[UI をロールバック]
    L --> N[invalidateQueries: quests/public]
    N --> O[バックグラウンドで再取得]
    O --> P[最新のいいね数で再レンダリング]
    M --> Q[エラーメッセージ表示]
```

## コメントフロー

```mermaid
flowchart TD
    A[ユーザーがコメントボタンをクリック] --> B{認証済み?}
    B -->|いいえ| C[ログインモーダル表示]
    B -->|はい| D[コメントモーダル表示]
    D --> E[既存コメント一覧を取得]
    E --> F[API: GET /api/quests/public/id/comments]
    F --> G[コメント一覧表示]
    G --> H[ユーザーがコメント入力]
    H --> I[投稿ボタンをクリック]
    I --> J[API: POST /api/quests/public/id/comments]
    J --> K[DB: public_quest_comments 追加]
    K --> L[通知を作成]
    L --> M[コメント一覧を更新]
    M --> N[コメント数を +1]
    N --> O[モーダルは開いたまま]
```

## ページネーションフロー

```mermaid
flowchart TD
    A[ユーザーがページボタンをクリック] --> B[page State更新]
    B --> C[usePublicQuests 再実行]
    C --> D[keepPreviousData: true]
    D --> E[前のデータを表示したまま]
    E --> F[API: GET with offset/limit]
    F --> G[DB: LIMIT/OFFSET クエリ]
    G --> H[次のページデータ取得]
    H --> I[スムーズに次ページへ切り替え]
    I --> J[スクロールをトップへ]
```

## 無限スクロールフロー

```mermaid
flowchart TD
    A[ユーザーが下にスクロール] --> B[スクロール位置を監視]
    B --> C{底まで到達?}
    C -->|いいえ| A
    C -->|はい| D{hasNextPage?}
    D -->|なし| E[これ以上データなし表示]
    D -->|あり| F[fetchNextPage 実行]
    F --> G[API: GET with next offset]
    G --> H[次のページデータ取得]
    H --> I[既存リストに追加]
    I --> J[ローディングスピナー消去]
    J --> A
```

## クエスト詳細遷移フロー

```mermaid
flowchart TD
    A[ユーザーがクエストカードをクリック] --> B[クエストIDを取得]
    B --> C[/quests/public/id へ遷移]
    C --> D[クエスト詳細画面を表示]
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    A[API 呼び出し] --> B{レスポンス}
    B -->|200 OK| C[正常処理]
    B -->|401 Unauthorized| D[ログインモーダル表示]
    B -->|404 Not Found| E[クエストが見つかりません]
    B -->|500 Internal Error| F[サーバーエラーメッセージ]
    B -->|Network Error| G[ネットワークエラーメッセージ]
    D --> H[ログイン完了後にリトライ]
    E --> I[エラー画面表示]
    F --> I
    G --> I
    I --> J[リトライボタン表示]
    J --> K{ユーザーがリトライ}
    K -->|はい| A
```

## 状態遷移図

```mermaid
stateDiagram-v2
    [*] --> Loading: 画面表示
    Loading --> Success: データ取得成功
    Loading --> Error: データ取得失敗
    Success --> Filtering: フィルタ適用
    Filtering --> Loading: 再取得
    Success --> Searching: 検索実行
    Searching --> Loading: 再取得
    Success --> Paging: ページ変更
    Paging --> Loading: 再取得
    Success --> LikingQuest: いいねクリック
    LikingQuest --> Success: 更新成功
    LikingQuest --> Error: 更新失敗
    Error --> Loading: リトライ
    Success --> [*]: 画面離脱
```

## キャッシュ更新フロー

```mermaid
flowchart TD
    A[ユーザーアクション] --> B{アクション種類}
    B -->|いいね| C[Optimistic Update]
    B -->|コメント| D[invalidateQueries]
    B -->|フィルタ| E[新規クエリ実行]
    C --> F[UI即座反映]
    F --> G[API呼び出し]
    G --> H{成功?}
    H -->|成功| I[invalidateQueries]
    H -->|失敗| J[Rollback]
    D --> K[バックグラウンド再取得]
    E --> K
    I --> K
    K --> L[キャッシュ更新]
    L --> M[UI再レンダリング]
```
