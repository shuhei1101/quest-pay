(2026年3月記載)

# テンプレートクエスト一覧 フロー図

## 初期表示フロー

```mermaid
flowchart TD
    A[ユーザーがテンプレート画面を開く] --> B[TemplateQuestsScreen マウント]
    B --> C[useTemplateQuests フック実行]
    C --> D{キャッシュ存在?}
    D -->|あり| E[キャッシュから表示]
    D -->|なし| F[API: GET /api/quests/template]
    F --> G[DB: template_quests テーブル照会]
    G --> H[JOIN quest_categories]
    H --> I[テンプレートリスト取得]
    I --> J[React Query キャッシュ保存 1時間]
    E --> K[TemplateQuestList レンダリング]
    J --> K
    K --> L[各 TemplateQuestCard 表示]
```

## カテゴリフィルタフロー

```mermaid
flowchart TD
    A[ユーザーがカテゴリタブをクリック] --> B[categoryId State更新]
    B --> C[useTemplateQuests 再実行]
    C --> D{該当カテゴリのキャッシュ存在?}
    D -->|あり| E[キャッシュから表示]
    D -->|なし| F[API: GET /api/quests/template?categoryId=X]
    F --> G[DB: WHERE categoryId = X]
    G --> H[フィルタ済みテンプレート取得]
    H --> I[キャッシュ保存]
    E --> J[一覧を再レンダリング]
    I --> J
    J --> K{結果あり?}
    K -->|あり| L[クエストカード表示]
    K -->|なし| M[空状態表示]
```

## テンプレート採用フロー

```mermaid
flowchart TD
    A[ユーザーが採用ボタンをクリック] --> B{認証済み?}
    B -->|いいえ| C[ログイン画面へリダイレクト]
    B -->|はい| D{親ユーザー?}
    D -->|いいえ| E[権限エラー表示]
    D -->|はい| F[確認ダイアログ表示]
    F --> G{ユーザー確認}
    G -->|キャンセル| H[処理中止]
    G -->|OK| I[useAdoptTemplateQuest.mutate]
    I --> J[ローディング状態表示]
    J --> K[API: POST /api/quests/family/adopt]
    K --> L[DB Transaction開始]
    L --> M[INSERT into family_quests]
    M --> N[INSERT into family_quest_details]
    N --> O[COMMIT]
    O --> P{成功?}
    P -->|成功| Q[invalidateQueries: quests/family]
    P -->|失敗| R[ROLLBACK]
    Q --> S[成功通知表示]
    R --> T[エラー通知表示]
    S --> U[家族クエスト編集画面へ遷移]
```

## プリフェッチフロー

```mermaid
flowchart TD
    A[ユーザーがカテゴリタブにホバー] --> B[prefetchCategory 実行]
    B --> C{該当カテゴリのキャッシュ存在?}
    C -->|あり| D[何もしない]
    C -->|なし| E[バックグラウンドでAPI呼び出し]
    E --> F[DB: WHERE categoryId = X]
    F --> G[テンプレート取得]
    G --> H[キャッシュに保存]
    H --> I[ユーザーがクリック時に即座表示]
```

## 詳細モーダル表示フロー

```mermaid
flowchart TD
    A[ユーザーがクエストカードをクリック] --> B[テンプレートIDを取得]
    B --> C[詳細モーダルを開く]
    C --> D[useTemplateQuest 詳細取得]
    D --> E{詳細キャッシュ存在?}
    E -->|あり| F[キャッシュから表示]
    E -->|なし| G[API: GET /api/quests/template/id]
    G --> H[DB: テンプレート詳細取得]
    H --> I[キャッシュ保存]
    F --> J[詳細情報を表示]
    I --> J
    J --> K[採用ボタン表示]
```

## カスタマイズ後採用フロー（将来実装）

```mermaid
flowchart TD
    A[ユーザーが採用ボタンをクリック] --> B[カスタマイズモーダル表示]
    B --> C[タイトル・説明・報酬を編集可能]
    C --> D[ユーザーが内容を編集]
    D --> E[保存ボタンをクリック]
    E --> F[バリデーション]
    F --> G{バリデーション成功?}
    G -->|失敗| H[エラー表示]
    G -->|成功| I[API: POST /api/quests/family/adopt]
    I --> J[カスタマイズ内容を含めて採用]
    J --> K[家族クエスト作成]
    K --> L[成功通知表示]
    L --> M[家族クエスト一覧へ遷移]
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    A[API 呼び出し] --> B{レスポンス}
    B -->|200 OK| C[正常処理]
    B -->|401 Unauthorized| D[ログイン画面へリダイレクト]
    B -->|403 Forbidden| E[権限エラーメッセージ]
    B -->|404 Not Found| F[テンプレートが見つかりません]
    B -->|500 Internal Error| G[サーバーエラーメッセージ]
    B -->|Network Error| H[ネットワークエラーメッセージ]
    D --> I[エラー通知表示]
    E --> I
    F --> I
    G --> I
    H --> I
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
    Success --> Filtering: カテゴリ選択
    Filtering --> Loading: 再取得
    Success --> AdoptingQuest: 採用ボタンクリック
    AdoptingQuest --> Success: 採用成功
    AdoptingQuest --> Error: 採用失敗
    Error --> Loading: リトライ
    Success --> ViewingDetail: 詳細モーダル表示
    ViewingDetail --> Success: モーダルを閉じる
    ViewingDetail --> AdoptingQuest: 採用ボタンクリック
    Success --> [*]: 画面離脱
```

## キャッシュ管理フロー

```mermaid
flowchart TD
    A[テンプレート一覧取得] --> B[React Query キャッシュに保存]
    B --> C[Stale Time: 1時間]
    C --> D{1時間経過?}
    D -->|いいえ| E[キャッシュから即座表示]
    D -->|はい| F[バックグラウンドで再取得]
    F --> G[キャッシュ更新]
    G --> H[UI再レンダリング]
    E --> I[ユーザーは待たずに閲覧可能]
```

## 複数テンプレート同時採用フロー（将来実装）

```mermaid
flowchart TD
    A[ユーザーが複数のテンプレートを選択] --> B[選択モードを有効化]
    B --> C[チェックボックス表示]
    C --> D[複数のテンプレートをチェック]
    D --> E[一括採用ボタンをクリック]
    E --> F[確認ダイアログ表示]
    F --> G{ユーザー確認}
    G -->|キャンセル| H[処理中止]
    G -->|OK| I[Promise.all で並列採用]
    I --> J[各テンプレートを家族クエストに変換]
    J --> K{全て成功?}
    K -->|成功| L[成功通知表示]
    K -->|一部失敗| M[エラー一覧表示]
    L --> N[家族クエスト一覧へ遷移]
    M --> N
```

## 検索機能フロー（将来実装）

```mermaid
flowchart TD
    A[ユーザーが検索バーに入力] --> B[デバウンス処理 500ms]
    B --> C[searchQuery State更新]
    C --> D[useTemplateQuests 再実行]
    D --> E[API: GET with search param]
    E --> F[DB: WHERE title/description LIKE]
    F --> G[検索結果取得]
    G --> H[一覧を再レンダリング]
    H --> I{結果あり?}
    I -->|あり| J[クエストカード表示]
    I -->|なし| K[空状態表示]
```
