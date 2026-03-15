# 家族クエスト編集 - フロー図

**2026年3月記載**

## 全体フロー

```mermaid
graph TD
    A[ユーザーアクセス] --> B{authGuard}
    B -->|親ユーザー| C[Page読み込み]
    B -->|子供/ゲスト| D[QUESTS_URLへリダイレクト]
    
    C --> E{id存在?}
    E -->|あり: 編集| F[FamilyQuestEdit マウント id指定]
    E -->|なし: 新規| G[FamilyQuestEdit マウント id未指定]
    
    F --> H[useFamilyQuestForm データ取得]
    H --> I[家族クエストデータ取得]
    I --> J[フォームに既存データ反映]
    J --> K[セッションストレージ確認]
    
    G --> L[useFamilyQuestForm 空フォーム初期化]
    L --> K
    
    K --> M{復元データあり?}
    M -->|あり| N[セッションデータでフォーム上書き]
    M -->|なし| O[現在のフォーム状態維持]
    
    N --> P[ユーザー入力待ち]
    O --> P
    
    P --> Q{入力イベント}
    Q -->|基本設定入力| R[register/setValue自動更新]
    Q -->|アイコン選択| S[IconSelectPopup表示]
    Q -->|タグ入力| T[handleTag実行]
    Q -->|詳細設定: レベル追加| U[handleAddLevel]
    Q -->|詳細設定: レベル削除| V[handleRemoveLevel]
    Q -->|子供設定: Switch切替| W[toggleChildActivate]
    Q -->|FAB: 保存| X[onSubmit実行]
    Q -->|FAB: 公開| Y[handlePublish実行]
    Q -->|FAB: 削除| Z[handleDelete実行]
    
    R --> P
    
    S --> AA[ユーザーがアイコン/カラー選択]
    AA --> AB[setIcon/setColor実行]
    AB --> AC[ポップアップクローズ]
    AC --> P
    
    T --> AD[タグ追加・重複チェック]
    AD --> P
    
    U --> AE[新レベル挿入・既存レベル繰り上げ]
    AE --> P
    
    V --> AF{デフォルト値?}
    AF -->|はい| AG[即座に削除]
    AF -->|いいえ| AH[確認モーダル表示]
    AH --> AI{ユーザー確認}
    AI -->|OK| AG
    AI -->|キャンセル| P
    AG --> AJ[レベル削除・既存レベル繰り下げ]
    AJ --> P
    
    W --> AK{hasQuestChildren?}
    AK -->|true| AL[isActivate切替のみ]
    AK -->|false + OFF| AM[設定削除]
    AK -->|false + ON| AN[設定追加]
    AL --> P
    AM --> P
    AN --> P
    
    X --> AO{バリデーション}
    AO -->|失敗| AP[エラー表示]
    AP --> P
    
    AO -->|成功| AQ{id存在?}
    AQ -->|あり: 更新| AR[PUT /api/quests/family/id]
    AQ -->|なし: 新規作成| AS[POST /api/quests/family]
    
    AR --> AT{API成功?}
    AS --> AU{API成功?}
    
    AT -->|成功| AV[トースト: 更新しました]
    AT -->|失敗| AW[エラーハンドリング]
    
    AU -->|成功| AX[ID取得]
    AU -->|失敗| AW
    
    AX --> AY[setFamilyQuestId実行]
    AY --> AZ[トースト: 作成しました]
    
    AV --> BA[キャッシュ無効化]
    AZ --> BA
    
    BA --> P
    
    Y --> BB[POST /api/quests/family/id/publish]
    BB --> BC{API成功?}
    BC -->|成功| BD[トースト: 公開しました]
    BC -->|失敗| AW
    BD --> BE[公開クエスト画面へリダイレクト]
    
    Z --> BF{確認モーダル}
    BF -->|キャンセル| P
    BF -->|OK| BG[DELETE /api/quests/family/id]
    BG --> BH{API成功?}
    BH -->|成功| BI[トースト: 削除しました]
    BH -->|失敗| AW
    BI --> BJ[家族クエスト一覧へリダイレクト]
    
    AW --> BK[エラー画面/トースト]
```

## 新規作成フロー詳細

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant P as Page
    participant FQE as FamilyQuestEdit
    participant UFQF as useFamilyQuestForm
    participant URFQ as useRegisterFamilyQuest
    participant API as API Client
    participant SS as SessionStorage
    
    U->>P: /quests/family/new アクセス
    P->>P: authGuard実行
    P->>FQE: マウント (id=undefined)
    FQE->>UFQF: useFamilyQuestForm({familyQuestId: undefined})
    UFQF->>UFQF: デフォルト値で初期化（level 1のみ）
    FQE->>SS: appStorage.familyQuestForm.pop()
    SS-->>FQE: 復元データ or null
    FQE->>UFQF: setForm(復元データ)
    UFQF-->>FQE: フォーム操作関数返却
    FQE->>U: フォーム表示
    
    U->>FQE: 基本設定入力
    FQE->>UFQF: register/setValue経由で更新
    
    U->>FQE: 詳細設定: レベル2追加
    FQE->>FQE: handleAddLevel実行
    FQE->>UFQF: setValue("details", [...])
    
    U->>FQE: 子供設定: スイッチON
    FQE->>FQE: toggleChildActivate実行
    FQE->>UFQF: setValue("childSettings", [...])
    
    U->>FQE: FAB: 保存ボタンクリック
    FQE->>UFQF: handleSubmit実行
    UFQF->>UFQF: Zodバリデーション
    UFQF-->>FQE: バリデーション成功
    
    FQE->>URFQ: handleRegister({form})
    URFQ->>API: POST /api/quests/family
    API-->>URFQ: {familyQuestId: "xxx"}
    URFQ->>FQE: setFamilyQuestId("xxx")
    URFQ->>URFQ: トースト表示
    URFQ->>P: router.push(編集画面URL)
    P->>U: 編集画面へ遷移
```

## 更新フロー詳細

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant P as Page
    participant FQE as FamilyQuestEdit
    participant UFQF as useFamilyQuestForm
    participant UUFQ as useUpdateFamilyQuest
    participant API as API Client
    participant QC as QueryClient
    
    U->>P: /quests/family/[id] アクセス
    P->>P: authGuard実行
    P->>FQE: マウント (id="xxx")
    FQE->>UFQF: useFamilyQuestForm({familyQuestId: "xxx"})
    UFQF->>API: GET /api/quests/family/xxx
    API-->>UFQF: 家族クエストデータ (base + details + childSettings)
    UFQF->>UFQF: フォーム形式に変換
    UFQF->>UFQF: reset(fetchedFamilyQuestForm)
    UFQF-->>FQE: フォーム操作関数返却
    FQE->>U: 既存データ表示
    
    U->>FQE: データ編集
    FQE->>UFQF: register/setValue経由で更新
    
    U->>FQE: FAB: 保存ボタンクリック
    FQE->>UFQF: handleSubmit実行
    UFQF->>UFQF: Zodバリデーション
    UFQF-->>FQE: バリデーション成功
    
    FQE->>UUFQ: handleUpdate({form, familyQuestId, updatedAt, questUpdatedAt})
    UUFQ->>API: PUT /api/quests/family/xxx (with updatedAt)
    API-->>UUFQ: 成功
    UUFQ->>UUFQ: トースト表示: "更新しました"
    UUFQ->>QC: invalidateQueries
    QC->>API: データ再取得
    API-->>QC: 最新データ
    QC-->>FQE: データ更新
    FQE->>U: 最新データ表示
```

## 削除フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant FQE as FamilyQuestEdit
    participant UDFQ as useDeleteFamilyQuest
    participant Modal as Mantine Modal
    participant API as API Client
    participant Router as Next Router
    
    U->>FQE: FAB: 削除ボタンクリック
    FQE->>UDFQ: handleDelete({familyQuestId, updatedAt})
    UDFQ->>Modal: modals.openConfirmModal
    Modal->>U: "この家族クエストを削除しますか？"
    
    U->>Modal: "削除" クリック
    Modal-->>UDFQ: 確認
    UDFQ->>API: DELETE /api/quests/family/xxx?updatedAt=...
    API-->>UDFQ: 成功
    UDFQ->>UDFQ: トースト表示: "削除しました"
    UDFQ->>Router: router.push(家族クエスト一覧URL)
    Router->>U: 一覧へリダイレクト
```

## 公開フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant FQE as FamilyQuestEdit
    participant UPFQ as usePublishFamilyQuest
    participant API as API Client
    participant Router as Next Router
    
    U->>FQE: FAB: 公開ボタンクリック
    FQE->>UPFQ: handlePublish({familyQuestId})
    UPFQ->>API: POST /api/quests/family/xxx/publish
    API-->>UPFQ: {publicQuestId: "yyy"}
    UPFQ->>UPFQ: トースト表示: "公開しました"
    UPFQ->>Router: router.push(公開クエスト画面URL)
    Router->>U: 公開クエスト画面へリダイレクト
```

## エラーハンドリングフロー

```mermaid
graph TD
    A[エラー発生] --> B{エラータイプ}
    
    B -->|バリデーションエラー| C[errors表示]
    C --> D[タブにエラーバッジ表示]
    D --> E[該当フィールドにエラーメッセージ表示]
    E --> F[ユーザー修正待ち]
    
    B -->|API取得エラー| G[handleAppError]
    G --> H{エラー種別}
    H -->|401/403| I[認証エラー画面]
    H -->|404| J[Not Found画面]
    H -->|その他| K[エラートースト]
    
    BデータベーススキーマAPI送信エラー| L[handleAppError]
    L --> M[エラートースト表示]
    M --> F
    
    B -->|楽観的ロック競合| N[409 Conflict]
    N --> O[トースト: "データが更新されています"]
    O --> P[データ再取得]
    P --> Q[最新データでフォーム更新]
    Q --> F
    
    B -->|ネットワークエラー| R[handleAppError]
    R --> S[ネットワークエラートースト]
    S --> F
```

## レベル管理フロー

```mermaid
stateDiagram-v2
    [*] --> Level1: 初期状態
    Level1 --> Level1_Level2: レベル追加
    Level1_Level2 --> Level1_Level2_Level3: レベル追加
    Level1_Level2_Level3 --> Level1_Level2_Level3_Level4: レベル追加
    Level1_Level2_Level3_Level4 --> Level1_Level2_Level3_Level4_Level5: レベル追加（最大）
    
    Level1_Level2_Level3_Level4_Level5 --> Level1_Level2_Level3_Level4: レベル削除
    Level1_Level2_Level3_Level4 --> Level1_Level2_Level3: レベル削除
    Level1_Level2_Level3 --> Level1_Level2: レベル削除
    Level1_Level2 --> Level1: レベル削除
    Level1 --> [*]: 保存
    
    note right of Level1_Level2_Level3_Level4_Level5
        最大5レベル
        レベル5の削除確認モーダル表示
    end note
    
    note left of Level1
        最低1レベル
        削除不可
    end note
```

## タグ入力フロー

```mermaid
stateDiagram-v2
    [*] --> WaitingInput: 入力待ち
    WaitingInput --> IMEComposing: IME入力開始
    IMEComposing --> IMEComposing: onCompositionStart
    IMEComposing --> WaitingInput: onCompositionEnd
    
    WaitingInput --> ValidateTag: Enter キー or onBlur
    ValidateTag --> CheckDuplicate: タグトリム
    CheckDuplicate --> AddTag: 重複なし
    CheckDuplicate --> WaitingInput: 重複あり（追加しない）
    AddTag --> ClearInput: setValue("tags", [...])
    ClearInput --> WaitingInput
    
    note right of IMEComposing
        IME入力中はEnterキーを無視
    end note
    
    note left of CheckDuplicate
        空文字や既存タグは追加しない
    end note
```

## 認証ガードフロー

```mermaid
graph LR
    A[ページアクセス] --> B{authGuard}
    B -->|親ユーザー| C[画面表示]
    B -->|子供ユーザー| D[QUESTS_URLリダイレクト]
    B -->|ゲストユーザー| D
    B -->|未ログイン| E[ログイン画面リダイレクト]
```
