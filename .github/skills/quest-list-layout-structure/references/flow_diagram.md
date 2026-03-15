# クエストリストレイアウト - フロー図

**最終更新:** 2026年3月記載

## データローディングフロー

```mermaid
flowchart TD
    A[初期化] --> B[useSearchParams<br/>クエリパラメータ取得]
    B --> C{クエリパラメータあり?}
    C -->|Yes| D[questFilterを初期化]
    C -->|No| E[デフォルト状態]
    D --> F[searchFilterを設定]
    E --> F
    F --> G[useFamilyQuests<br/>APIデータ取得]
    G --> H[QuestListLayout<br/>renderQuestCard実行]
    H --> I[画面描画]
```

## フィルタリングフロー

```mermaid
flowchart TD
    A[検索バー入力] --> B[onSearchTextChange実行]
    B --> C[questFilter.name更新]
    C --> D{Enter or 検索ボタン?}
    D -->|No| E[待機<br/>フィルターポップアップで編集可能]
    D -->|Yes| F[onSearch実行]
    F --> G[クエリパラメータを生成]
    G --> H[router.push<br/>URLに反映]
    H --> I[searchFilter更新]
    I --> J[page = 1にリセット]
    J --> K[APIデータ再取得]
    K --> L[displayQuestsリセット]
    L --> M[画面描画]
```

## フィルターポップアップフロー

```mermaid
flowchart TD
    A[フィルターボタンクリック] --> B[onFilterOpen実行]
    B --> C[filterOpened = true]
    C --> D[FamilyQuestFilterPopup表示]
    D --> E[currentFilter<br/>questFilterを反映]
    E --> F[ユーザーが項目編集]
    F --> G{検索ボタンクリック?}
    G -->|No| H[キャンセル<br/>close実行]
    G -->|Yes| I[handleFilterSearch実行]
    I --> J[questFilter更新]
    J --> K[クエリパラメータ生成]
    K --> L[router.push]
    L --> M[searchFilter更新]
    M --> N[APIデータ再取得]
    N --> O[close実行]
    O --> P[画面描画]
```

## ソートフロー

```mermaid
flowchart TD
    A[ソートボタンクリック] --> B[onSortOpen実行]
    B --> C[sortOpened = true]
    C --> D[FamilyQuestSortPopup表示]
    D --> E[currentSort<br/>sortを反映]
    E --> F[ユーザーがソート項目/順序選択]
    F --> G{適用ボタンクリック?}
    G -->|No| H[キャンセル<br/>close実行]
    G -->|Yes| I[handleSortSearch実行]
    I --> J[sort更新]
    J --> K[クエリパラメータ生成]
    K --> L[router.push]
    L --> M[APIデータ再取得]
    M --> N[close実行]
    N --> O[画面描画]
```

## カテゴリタブ切替フロー

```mermaid
flowchart TD
    A[タブクリック] --> B[handleTabChange実行]
    B --> C{タブ値は?}
    C -->|すべて| D[categoryId = undefined]
    C -->|その他| E[categoryId = null]
    C -->|カテゴリ名| F[questCategoryByIdから<br/>categoryIdを取得]
    D --> G[onCategoryChange実行]
    E --> G
    F --> G
    G --> H[searchFilter.categoryId更新]
    H --> I[page = 1にリセット]
    I --> J[APIデータ再取得]
    J --> K[displayQuestsリセット]
    K --> L[画面描画]
```

## 無限スクロールフロー

```mermaid
flowchart TD
    A[ページ描画] --> B[Intersection Observer<br/>sentinelRefを監視]
    B --> C{センチネル要素が<br/>画面内に入った?}
    C -->|No| B
    C -->|Yes| D{page < maxPage?}
    D -->|No| E[スクロール終了]
    D -->|Yes| F{isLoading?}
    F -->|Yes| G[待機]
    F -->|No| H[onPageChange<br/>page + 1]
    H --> I[親コンポーネントが<br/>次ページデータ取得]
    I --> J[quests配列更新]
    J --> K[useEffect監視]
    K --> L{page === 1?}
    L -->|Yes| M[displayQuestsリセット]
    L -->|No| N[displayQuestsに<br/>追加ロード分を結合]
    M --> O[QuestGrid再描画]
    N --> O
    O --> B
```

## ページネーション処理詳細

```mermaid
flowchart TD
    A[quests配列更新] --> B{page === 1?}
    B -->|Yes| C[新規検索<br/>setDisplayQuests<br/>quests]
    B -->|No| D[追加ロード<br/>setDisplayQuests<br/>prev + quests]
    C --> E[QuestGridに反映]
    D --> E
    E --> F[各クエストに<br/>renderQuestCard実行]
    F --> G[カード描画完了]
```

## 検索テキスト連動フロー

```mermaid
flowchart TD
    A[検索バー入力] --> B[onChange<br/>event.currentTarget.value]
    B --> C[trim処理]
    C --> D[internalSearchText更新]
    D --> E[onSearchTextChange<br/>コールバック実行]
    E --> F[親: questFilter.name更新]
    F --> G[searchText propで<br/>検索バーに反映]
    G --> H[フィルターポップアップ開く]
    H --> I[currentFilter.nameとして<br/>検索テキスト表示]
    I --> J[ユーザーが編集]
    J --> K[検索実行]
    K --> L[questFilter.name更新]
    L --> G
```

## バッジ表示ロジック

```mermaid
flowchart TD
    A[searchFilter変更] --> B[useMemoで再計算]
    B --> C{searchFilter.name?}
    C -->|Yes| D[count++]
    C -->|No| E[count変更なし]
    D --> F{searchFilter.tags.length?}
    E --> F
    F -->|> 0| G[count += tags.length]
    F -->|0| H[count変更なし]
    G --> I{searchFilter.categoryId?}
    H --> I
    I -->|Yes| J[count++]
    I -->|No| K[filterCountをpropsに渡す]
    J --> K
    K --> L[QuestSearchBar<br/>Indicator badges表示]
```

## ローディング状態管理

```mermaid
flowchart TD
    A[API呼び出し開始] --> B[isLoading = true]
    B --> C[QuestListLayout<br/>ローディング判定]
    C --> D{isLoading?}
    D -->|Yes| E[Mantine Loader表示<br/>高さ: calc100vh - 200px]
    D -->|No| F[QuestGrid表示]
    F --> G[APIレスポンス受信]
    G --> H[isLoading = false]
    H --> I[Loader非表示]
    I --> J[クエストカード描画]
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    A[API呼び出し] --> B{成功?}
    B -->|Yes| C[データ取得]
    B -->|No| D[エラー発生]
    D --> E[useQueryのerror状態]
    E --> F[ErrorBoundary]
    F --> G[error.tsxで表示]
    C --> H[QuestListLayout描画]
```

## データ同期フロー（全体像）

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant SearchBar as 検索バー
    participant Parent as 親コンポーネント
    participant API as API
    participant Layout as QuestListLayout
    
    User->>SearchBar: テキスト入力
    SearchBar->>Parent: onSearchTextChange(text)
    Parent->>Parent: questFilter.name更新
    Parent->>Layout: searchText prop更新
    User->>SearchBar: Enter押下
    SearchBar->>Parent: onSearch()
    Parent->>Parent: URLクエリパラメータ生成
    Parent->>API: データ再取得
    API-->>Parent: クエスト一覧返却
    Parent->>Layout: quests prop更新
    Layout->>Layout: displayQuests更新
    Layout->>User: 画面再描画
```
