(2026年3月15日 14:30記載)

# 家族クエスト一覧画面 フロー図

## 初期表示フロー

```mermaid
flowchart TD
    Start([ページアクセス]) --> CheckAuth{認証済み?}
    CheckAuth -->|No| RedirectLogin[ログイン画面へ]
    CheckAuth -->|Yes| MountScreen[FamilyQuestsScreen<br/>マウント]
    
    MountScreen --> GetQueryParams[クエリパラメータ取得<br/>tab = ?]
    GetQueryParams --> CheckQueryTab{tabパラメータ確認}
    
    CheckQueryTab -->|あり| SetTabFromQuery[tabValue設定]
    CheckQueryTab -->|なし| SetDefaultTab[デフォルトtab='public'<br/>URLに追加]
    
    SetTabFromQuery --> CheckTabValue{タブ値確認}
    SetDefaultTab --> CheckTabValue
    
    CheckTabValue -->|'public'| MountPublicList[PublicQuestList<br/>マウント]
    CheckTabValue -->|'family'| MountFamilyList[FamilyQuestList<br/>マウント]
    CheckTabValue -->|'penalty'| ShowPenalty[違反リスト表示<br/>（未実装）]
    CheckTabValue -->|'template'| MountTemplateList[TemplateQuestList<br/>マウント]
    
    MountFamilyList --> ParseFilter[フィルター条件パース<br/>from URL]
    ParseFilter --> CallHook[useFamilyQuests<br/>フック呼び出し]
    CallHook --> ShowLoading[ローディング表示]
    ShowLoading --> FetchAPI[GET /api/quests/family]
    
    FetchAPI --> CheckResponse{レスポンス確認}
    CheckResponse -->|Success| RenderList[QuestListLayout<br/>レンダリング]
    CheckResponse -->|Error| ShowError[エラーメッセージ<br/>表示]
    
    RenderList --> MapCards[FamilyQuestCardLayout<br/>をmap生成]
    MapCards --> Complete([表示完了])
    ShowError --> RetryButton{リトライ?}
    RetryButton -->|Yes| FetchAPI
    RetryButton -->|No| Complete
    
    MountPublicList --> Complete
    ShowPenalty --> Complete
    MountTemplateList --> Complete
    
    RedirectLogin --> End([終了])
    
    style Start fill:#e1f5e1
    style Complete fill:#b8daff
    style ShowError fill:#f5c6cb
    style End fill:#ffe1e1
```

---

## タブ切り替えフロー

```mermaid
flowchart TD
    Start([ユーザーがタブクリック]) --> GetTabValue[タブ値取得]
    GetTabValue --> UpdateState[tabValue状態更新]
    UpdateState --> UpdateQuery[URLクエリパラメータ更新<br/>?tab={value}]
    UpdateQuery --> ScrollToTab[タブ自動スクロール<br/>（横スクロール時）]
    
    ScrollToTab --> CheckTab{タブ値確認}
    CheckTab -->|'public'| ShowPublic[PublicQuestList表示]
    CheckTab -->|'family'| ShowFamily[FamilyQuestList表示]
    CheckTab -->|'penalty'| ShowPenalty[違反リスト表示]
    CheckTab -->|'template'| ShowTemplate[TemplateQuestList表示]
    
    ShowPublic --> ChangeColor1[タブカラー変更<br/>青色]
    ShowFamily --> ChangeColor2[タブカラー変更<br/>緑色]
    ShowPenalty --> ChangeColor3[タブカラー変更<br/>赤色]
    ShowTemplate --> ChangeColor4[タブカラー変更<br/>黄色]
    
    ChangeColor1 --> ResetScroll[スクロール位置リセット]
    ChangeColor2 --> ResetScroll
    ChangeColor3 --> ResetScroll
    ChangeColor4 --> ResetScroll
    
    ResetScroll --> End([完了])
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
```

---

## リストレンダリング詳細フロー

```mermaid
flowchart TD
    Start([クエストデータ取得完了]) --> RenderLayout[QuestListLayout<br/>レンダリング開始]
    
    RenderLayout --> SearchBar[検索バー表示]
    SearchBar --> CategoryTabs[カテゴリタブ表示]
    CategoryTabs --> FilterSortBtn[フィルター/ソートボタン表示]
    
    FilterSortBtn --> CheckEmpty{クエスト配列が空?}
    CheckEmpty -->|Yes| ShowEmpty[空メッセージ表示<br/>「クエストがありません」]
    CheckEmpty -->|No| MapLoop[fetchedQuests.map<br/>ループ開始]
    
    MapLoop --> RenderCard[FamilyQuestCardLayout<br/>レンダリング]
    RenderCard --> BindClick[onClick<br/>イベント設定]
    BindClick --> NextItem{次の要素?}
    
    NextItem -->|Yes| RenderCard
    NextItem -->|No| RenderPagination[Pagination<br/>レンダリング]
    
    RenderPagination --> Complete([レンダリング完了])
    ShowEmpty --> Complete
    
    style Start fill:#e1f5e1
    style Complete fill:#b8daff
```

---

## フィルタリングフロー

```mermaid
flowchart TD
    Start([フィルターボタンクリック]) --> OpenPopup[FamilyQuestFilterPopup<br/>表示]
    
    OpenPopup --> ShowForm[フィルターフォーム表示]
    ShowForm --> UserInput[ユーザー入力]
    
    UserInput --> SetName[クエスト名入力]
    UserInput --> SelectCategory[カテゴリ選択]
    UserInput --> SelectTags[タグ選択]
    UserInput --> SetReward[報酬範囲指定]
    
    SetName --> ClickSearch{検索ボタン?}
    SelectCategory --> ClickSearch
    SelectTags --> ClickSearch
    SetReward --> ClickSearch
    
    ClickSearch -->|Yes| ClosePopup[ポップアップ閉じる]
    ClickSearch -->|キャンセル| CancelFilter[フィルタークリア]
    
    ClosePopup --> UpdateFilter[questFilter更新]
    UpdateFilter --> UpdateURL[URLクエリパラメータ更新]
    UpdateURL --> UpdateSearchFilter[searchFilter更新]
    UpdateSearchFilter --> ResetPage[page = 1にリセット]
    ResetPage --> TriggerRefetch[useFamilyQuests<br/>再実行]
    
    TriggerRefetch --> FetchAPI[GET /api/quests/family<br/>フィルター付き]
    FetchAPI --> UpdateList[一覧更新]
    UpdateList --> End([完了])
    
    CancelFilter --> End
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
```

---

## ソートフロー

```mermaid
flowchart TD
    Start([ソートボタンクリック]) --> OpenPopup[FamilyQuestSortPopup<br/>表示]
    
    OpenPopup --> ShowOptions[ソート選択肢表示]
    ShowOptions --> UserSelect[ユーザー選択]
    
    UserSelect --> SelectColumn[ソート列選択<br/>id/title/createdAt/reward]
    UserSelect --> SelectOrder[ソート順選択<br/>asc/desc]
    
    SelectColumn --> ClickSearch{検索ボタン?}
    SelectOrder --> ClickSearch
    
    ClickSearch -->|Yes| ClosePopup[ポップアップ閉じる]
    ClickSearch -->|キャンセル| CancelSort[ソートクリア]
    
    ClosePopup --> UpdateSort[sort状態更新]
    UpdateSort --> UpdateURL[URLクエリパラメータ更新<br/>sortColumn&sortOrder]
    UpdateURL --> TriggerRefetch[useFamilyQuests<br/>再実行]
    
    TriggerRefetch --> FetchAPI[GET /api/quests/family<br/>ソート付き]
    FetchAPI --> UpdateList[一覧更新]
    UpdateList --> End([完了])
    
    CancelSort --> End
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
```

---

## ページネーションフロー

```mermaid
flowchart TD
    Start([ページ番号クリック]) --> GetPageNum[ページ番号取得]
    GetPageNum --> UpdatePage[page状態更新]
    UpdatePage --> ScrollTop[ページトップへ<br/>スムーススクロール]
    
    ScrollTop --> CalcOffset[オフセット計算<br/>offset = (page-1) * pageSize]
    CalcOffset --> TriggerRefetch[useFamilyQuests<br/>再実行]
    
    TriggerRefetch --> FetchAPI[GET /api/quests/family<br/>offset&limit付き]
    FetchAPI --> CheckResponse{レスポンス確認}
    
    CheckResponse -->|Success| UpdateList[一覧更新]
    CheckResponse -->|Error| ShowError[エラー表示]
    
    UpdateList --> End([完了])
    ShowError --> RetryOption{リトライ?}
    RetryOption -->|Yes| FetchAPI
    RetryOption -->|No| End
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
    style ShowError fill:#f5c6cb
```

---

## 検索フロー

```mermaid
flowchart TD
    Start([検索バー入力]) --> UserType[ユーザーがテキスト入力]
    UserType --> UpdateFilter[questFilter.name更新]
    UpdateFilter --> CheckTrigger{検索トリガー}
    
    CheckTrigger -->|Enterキー| ExecuteSearch[検索実行]
    CheckTrigger -->|検索ボタン| ExecuteSearch
    CheckTrigger -->|入力中| Wait[待機]
    
    Wait --> UserType
    
    ExecuteSearch --> UpdateURL[URLクエリパラメータ更新]
    UpdateURL --> UpdateSearchFilter[searchFilter更新]
    UpdateSearchFilter --> ResetPage[page = 1にリセット]
    ResetPage --> TriggerRefetch[useFamilyQuests<br/>再実行]
    
    TriggerRefetch --> FetchAPI[GET /api/quests/family<br/>name付き]
    FetchAPI --> CheckResult{結果確認}
    
    CheckResult -->|結果あり| UpdateList[一覧更新]
    CheckResult -->|結果なし| ShowEmpty[空メッセージ表示<br/>「該当なし」]
    
    UpdateList --> End([完了])
    ShowEmpty --> End
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
```

---

## カテゴリ切り替えフロー

```mermaid
flowchart TD
    Start([カテゴリタブクリック]) --> GetCategoryId[カテゴリID取得]
    GetCategoryId --> UpdateFilter[searchFilter.categoryId更新]
    UpdateFilter --> ResetPage[page = 1にリセット]
    ResetPage --> TriggerRefetch[useFamilyQuests<br/>再実行]
    
    TriggerRefetch --> FetchAPI[GET /api/quests/family<br/>categoryId付き]
    FetchAPI --> CheckResponse{レスポンス確認}
    
    CheckResponse -->|Success| UpdateList[一覧更新]
    CheckResponse -->|Error| ShowError[エラー表示]
    
    UpdateList --> HighlightTab[カテゴリタブ<br/>ハイライト]
    HighlightTab --> End([完了])
    
    ShowError --> End
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
    style ShowError fill:#f5c6cb
```

---

## クエスト選択フロー

```mermaid
flowchart TD
    Start([クエストカードクリック]) --> GetQuestId[questId取得]
    GetQuestId --> Navigate[router.push<br/>/quests/family/{id}/view]
    Navigate --> UpdateURL[URL更新]
    UpdateURL --> MountDetailScreen[詳細画面マウント]
    MountDetailScreen --> FetchDetail[GET /api/quests/family/{id}]
    FetchDetail --> ShowDetail[詳細情報表示]
    ShowDetail --> End([完了])
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
```

---

## 新規作成フロー

```mermaid
flowchart TD
    Start([FABクリック]) --> Navigate[router.push<br/>/quests/family/new]
    Navigate --> MountCreateScreen[新規作成画面マウント]
    MountCreateScreen --> ShowForm[フォーム表示]
    ShowForm --> UserInput[ユーザー入力]
    UserInput --> Submit[保存ボタン]
    Submit --> PostAPI[POST /api/quests/family]
    PostAPI --> CheckResponse{レスポンス確認}
    
    CheckResponse -->|Success| InvalidateCache[キャッシュ無効化<br/>invalidateQueries]
    CheckResponse -->|Error| ShowError[エラー表示]
    
    InvalidateCache --> BackToList[一覧画面に戻る]
    BackToList --> AutoRefetch[自動再取得]
    AutoRefetch --> UpdateList[一覧更新]
    UpdateList --> End([完了])
    
    ShowError --> RetryOption{リトライ?}
    RetryOption -->|Yes| Submit
    RetryOption -->|No| End
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
    style ShowError fill:#f5c6cb
```

---

## データ更新イベントフロー

```mermaid
flowchart TD
    Start([更新イベント発生]) --> CheckEvent{イベント種別}
    
    CheckEvent -->|作成| CreateEvent[クエスト作成完了]
    CheckEvent -->|編集| EditEvent[クエスト編集完了]
    CheckEvent -->|削除| DeleteEvent[クエスト削除完了]
    
    CreateEvent --> Invalidate[キャッシュ無効化<br/>invalidateQueries(['familyQuests'])]
    EditEvent --> Invalidate
    DeleteEvent --> Invalidate
    
    Invalidate --> Refetch[自動再取得<br/>useFamilyQuests]
    Refetch --> UpdateUI[UI更新]
    UpdateUI --> End([完了])
    
    style Start fill:#e1f5e1
    style End fill:#b8daff
```
