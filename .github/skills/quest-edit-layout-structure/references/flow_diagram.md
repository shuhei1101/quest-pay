(2026年3月15日 14:30記載)

# QuestEditLayout フロー図

## レイアウト初期化フロー

```mermaid
flowchart TD
    Start([QuestEditLayoutマウント]) --> CheckQuestId{questId<br/>存在する?}
    
    CheckQuestId -->|あり| EditMode[編集モード]
    CheckQuestId -->|なし| CreateMode[新規作成モード]
    
    EditMode --> SetEditTitle[タイトル: クエスト編集]
    CreateMode --> SetCreateTitle[タイトル: クエスト登録]
    
    SetEditTitle --> SetEditActions[editActions選択]
    SetCreateTitle --> SetCreateActions[createActions選択]
    
    SetEditActions --> SetEditFAB[fabEditActions選択]
    SetCreateActions --> SetCreateFAB[fabCreateActions選択]
    
    SetEditFAB --> InitTabs[タブ初期化]
    SetCreateFAB --> InitTabs
    
    InitTabs --> SetActiveTab[activeTab設定<br/>tabs[0]?.value ?? basic]
    
    SetActiveTab --> CheckLoading{isLoading?}
    
    CheckLoading -->|true| ShowOverlay[LoadingOverlay表示]
    CheckLoading -->|false| HideOverlay[LoadingOverlay非表示]
    
    ShowOverlay --> RenderLayout[レイアウト描画]
    HideOverlay --> RenderLayout
    
    RenderLayout --> Ready([準備完了])
    
    style Start fill:#e1f5e1
    style Ready fill:#b8daff
    style EditMode fill:#fff3cd
    style CreateMode fill:#d1ecf1
```

## フォームバインディングフロー

```mermaid
flowchart TD
    Start([親コンポーネント]) --> InitForm[フォーム初期化<br/>react-hook-form]
    
    InitForm --> FetchData{questId<br/>あり?}
    
    FetchData -->|あり| LoadQuest[クエストデータ取得]
    FetchData -->|なし| SetDefaults[デフォルト値設定]
    
    LoadQuest --> PopulateForm[フォームにデータ投入<br/>setValue]
    SetDefaults --> PopulateForm
    
    PopulateForm --> PassPropsToLayout[QuestEditLayoutに<br/>props渡す]
    
    PassPropsToLayout --> RenderTabs[タブコンテンツ描画]
    
    RenderTabs --> TabContent1[{"基本設定タブ<br/>(BasicSettings)"}]
    RenderTabs --> TabContent2[{"詳細設定タブ<br/>(DetailSettings)"}]
    RenderTabs --> TabContent3[{"子供設定タブ<br/>(ChildSettings)"}]
    
    TabContent1 --> BindFields1[フィールドバインディング<br/>register/setValue/watch]
    TabContent2 --> BindFields2[フィールドバインディング<br/>register/setValue/watch]
    TabContent3 --> BindFields3[フィールドバインディング<br/>register/setValue/watch]
    
    BindFields1 --> UserInput([ユーザー入力])
    BindFields2 --> UserInput
    BindFields3 --> UserInput
    
    style Start fill:#e1f5e1
    style UserInput fill:#b8daff
```

## バリデーションフロー

```mermaid
flowchart TD
    Start([ユーザーが入力]) --> TriggerValidation[バリデーション実行<br/>react-hook-form]
    
    TriggerValidation --> CheckErrors{エラー<br/>あり?}
    
    CheckErrors -->|あり| MarkTabErrors[タブエラーフラグ設定<br/>hasErrors: true]
    CheckErrors -->|なし| ClearTabErrors[タブエラーフラグクリア<br/>hasErrors: false]
    
    MarkTabErrors --> ShowErrorIcon[タブにエラーアイコン表示<br/>IconAlertCircle]
    ClearTabErrors --> HideErrorIcon[エラーアイコン非表示]
    
    ShowErrorIcon --> UpdateUI([UI更新])
    HideErrorIcon --> UpdateUI
    
    UpdateUI --> WaitInput([次の入力待ち])
    
    WaitInput --> Start
    
    style Start fill:#e1f5e1
    style UpdateUI fill:#b8daff
    style MarkTabErrors fill:#f5c6cb
    style ShowErrorIcon fill:#f5c6cb
```

## 送信フロー

```mermaid
flowchart TD
    Start([送信トリガー]) --> TriggerSource{トリガー元}
    
    TriggerSource -->|FABボタン| FABClick[FABアクション<br/>onClick実行]
    TriggerSource -->|アクションボタン| ActionClick[アクションボタン<br/>onClick実行]
    TriggerSource -->|フォームsubmit| FormSubmit[form.onSubmit実行]
    
    FABClick --> CallOnSubmit[onSubmit関数呼び出し]
    ActionClick --> CallOnSubmit
    FormSubmit --> CallOnSubmit
    
    CallOnSubmit --> HandleSubmit[handleSubmit実行<br/>react-hook-form]
    
    HandleSubmit --> ValidateAll[全フィールド検証]
    
    ValidateAll --> HasErrors{バリデーション<br/>エラー?}
    
    HasErrors -->|あり| ShowErrors[エラー表示<br/>送信中断]
    HasErrors -->|なし| CheckMode{モード確認}
    
    ShowErrors --> UpdateErrorTabs[エラータブにアイコン表示]
    UpdateErrorTabs --> End1([送信失敗])
    
    CheckMode -->|questIdあり| UpdateQuest[更新API呼び出し<br/>handleUpdate]
    CheckMode -->|questIdなし| CreateQuest[作成API呼び出し<br/>handleRegister]
    
    UpdateQuest --> ShowLoading[ローディング表示<br/>submitLoading: true]
    CreateQuest --> ShowLoading
    
    ShowLoading --> APICall[API通信]
    
    APICall --> CheckResponse{API<br/>成功?}
    
    CheckResponse -->|成功| HideLoading[ローディング非表示]
    CheckResponse -->|失敗| ShowAPIError[APIエラー表示]
    
    ShowAPIError --> HideLoading2[ローディング非表示]
    HideLoading2 --> End2([送信失敗])
    
    HideLoading --> Navigate[画面遷移 or 通知]
    Navigate --> End3([送信完了])
    
    style Start fill:#e1f5e1
    style End1 fill:#f5c6cb
    style End2 fill:#f5c6cb
    style End3 fill:#c3e6cb
    style ShowLoading fill:#fff3cd
```

## タブ切り替えフロー

```mermaid
flowchart TD
    Start([タブ切り替えトリガー]) --> TriggerType{トリガー種類}
    
    TriggerType -->|タブクリック| ClickTab[Tabs.Tab<br/>クリック]
    TriggerType -->|スワイプ| Swipe[左右スワイプ<br/>delta: 50px]
    
    ClickTab --> UpdateActiveTab[activeTab更新<br/>setActiveTab]
    Swipe --> CheckSwipe{スワイプ<br/>有効?}
    
    CheckSwipe -->|有効| SwipeDirection{スワイプ方向}
    CheckSwipe -->|無効| End1([タブ維持])
    
    SwipeDirection -->|左| NextTab[次タブへ]
    SwipeDirection -->|右| PrevTab[前タブへ]
    
    NextTab --> UpdateActiveTab
    PrevTab --> UpdateActiveTab
    
    UpdateActiveTab --> HideCurrentPanel[現在のパネル非表示<br/>display: none]
    HideCurrentPanel --> ShowNewPanel[新しいパネル表示<br/>display: flex]
    
    ShowNewPanel --> ScrollToTop[パネル内スクロール<br/>トップに戻る]
    
    ScrollToTop --> End2([タブ切り替え完了])
    
    style Start fill:#e1f5e1
    style End1 fill:#ffe1e1
    style End2 fill:#b8daff
```

## ScrollableTabs仕様

### スワイプ検出パラメータ
- **delta**: 50ピクセル（スワイプと認識する最小移動距離）
- **swipeDuration**: 500ミリ秒（スワイプと認識する最大時間）
- 縦スクロール中でもスワイプ検出可能

### タブ固定化
- タブヘッダーがスティッキー（画面上部に固定）
- 横スクロール対応（タブが多い場合）
- コンテンツはタブヘッダーの下でスクロール

### レイアウト構造
```
ScrollableTabs
├── Tabs.List (sticky, 上部固定)
│   └── Tabs.Tab[] (横スクロール可能)
└── スワイプエリア (flex: 1, 残り全高)
    └── Tabs.Panel[] (コンテンツ)
```
