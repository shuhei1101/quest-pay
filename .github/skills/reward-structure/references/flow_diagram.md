# 報酬設定 - フロー図

**2026年3月記載**

## 全体フロー

```mermaid
graph TD
    A[ユーザーアクセス] --> B{authGuard}
    B -->|親ユーザー| C{画面タイプ}
    B -->|子供/ゲスト| D[HOMEへリダイレクト]
    
    C -->|家族全体| E[RewardEdit 表示]
    C -->|子供個別| F[ChildRewardEdit 表示]
    
    E --> G[家族報酬データ取得]
    F --> H[子供報酬データ取得]
    
    G --> I[フォーム初期化]
    H --> J[フォーム初期化: 子供設定 or 家族設定]
    
    I --> K[ユーザー入力待ち]
    J --> K
    
    K --> L{入力イベント}
    L -->|タブ切替| M[activeTab更新]
    L -->|年齢型切替| N[ageSettingType更新]
    L -->|報酬額入力| O[setValue実行]
    L -->|FAB: 保存| P[onSubmit実行]
    L -->|FAB: リセット| Q[handleReset実行] 子供個別のみ
    
    M --> K
    N --> R[テーブル再描画]
    R --> K
    
    O --> K
    
    P --> S{バリデーション}
    S -->|失敗| T[エラー表示]
    T --> K
    
    S -->|成功| U{タブ?}
    U -->|お小遣い| V[PUT /api/reward/by-age/table]
    U -->|ランク報酬| W[PUT /api/reward/by-level/table]
    
    V --> X{API成功?}
    W --> Y{API成功?}
    
    X -->|成功| Z[トースト: 定額報酬を更新しました]
    X -->|失敗| AA[エラートースト]
    
    Y -->|成功| AB[トースト: ランク報酬を更新しました]
    Y -->|失敗| AA
    
    Z --> AC[キャッシュ無効化]
    AB --> AC
    
    AC --> AD[データ再取得]
    AD --> K
    
    AA --> K
    
    Q --> AE{確認モーダル}
    AE -->|キャンセル| K
    AE -->|OK| AF[DELETE /api/children/id/reward/by-age/table]
    AF --> AG{API成功?}
    AG -->|成功| AH[家族全体データ取得]
    AG -->|失敗| AA
    AH --> AI[フォームリセット]
    AI --> AJ[トースト: 家族全体の設定にリセットしました]
    AJ --> K
```

## 家族全体の報酬設定フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant P as Page
    participant RE as RewardEdit
    participant UARF as useAgeRewardForm
    participant ULRF as useLevelRewardForm
    participant API as API Client
    participant QC as QueryClient
    
    U->>P: /reward アクセス
    P->>P: authGuard実行
    P->>RE: マウント
    RE->>UARF: useAgeRewardForm()
    RE->>ULRF: useLevelRewardForm()
    
    UARF->>API: GET /api/reward/by-age/table
    API-->>UARF: 家族の年齢別報酬データ
    UARF->>UARF: rewards配列に変換
    UARF->>UARF: reset(fetchedData)
    
    ULRF->>API: GET /api/reward/by-level/table
    API-->>ULRF: 家族のレベル別報酬データ
    ULRF->>ULRF: rewards配列に変換
    ULRF->>ULRF: reset(fetchedData)
    
    UARF-->>RE: フォーム操作関数返却
    ULRF-->>RE: フォーム操作関数返却
    RE->>U: 2タブ表示（お小遣い、ランク報酬）
    
    U->>RE: お小遣いタブ: 報酬額変更
    RE->>UARF: setValue経由で更新
    
    U->>RE: FAB: 保存ボタンクリック
    RE->>UARF: handleSubmit実行
    UARF->>UARF: Zodバリデーション
    UARF-->>RE: バリデーション成功
    
    RE->>API: PUT /api/reward/by-age/table
    API-->>RE: 成功
    RE->>RE: トースト表示: "定額報酬を更新しました"
    RE->>QC: invalidateQueries(["ageRewardTable"])
    QC->>API: データ再取得
    API-->>QC: 最新データ
    QC-->>RE: データ更新
    RE->>U: 最新データ表示
```

## 子供個別の報酬設定フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant P as Page
    participant CRE as ChildRewardEdit
    participant UCARF as useChildAgeRewardForm
    participant UCLRF as useChildLevelRewardForm
    participant API as API Client
    participant QC as QueryClient
    
    U->>P: /children/[id]/reward アクセス
    P->>P: authGuard実行
    P->>CRE: マウント (childId指定)
    CRE->>UCARF: useChildAgeRewardForm({childId})
    CRE->>UCLRF: useChildLevelRewardForm({childId})
    
    UCARF->>API: GET /api/children/[id]/reward/by-age/table
    API-->>UCARF: 子供個別の年齢別報酬データ（なければ家族全体）
    UCARF->>UCARF: rewards配列に変換
    UCARF->>UCARF: reset(fetchedData)
    
    UCLRF->>API: GET /api/children/[id]/reward/by-level/table
    API-->>UCLRF: 子供個別のレベル別報酬データ（なければ家族全体）
    UCLRF->>UCLRF: rewards配列に変換
    UCLRF->>UCLRF: reset(fetchedData)
    
    UCARF-->>CRE: フォーム操作関数返却
    UCLRF-->>CRE: フォーム操作関数返却
    CRE->>U: 2タブ表示（お小遣い、ランク報酬）
    
    U->>CRE: お小遣いタブ: 報酬額変更
    CRE->>UCARF: setValue経由で更新
    
    U->>CRE: FAB: 保存ボタンクリック
    CRE->>UCARF: handleSubmit実行
    UCARF->>UCARF: Zodバリデーション
    UCARF-->>CRE: バリデーション成功
    
    CRE->>API: PUT /api/children/[id]/reward/by-age/table
    API-->>CRE: 成功
    CRE->>CRE: トースト表示: "定額報酬を更新しました"
    CRE->>QC: invalidateQueries(["childAgeRewardTable", childId])
    QC->>API: データ再取得
    API-->>QC: 最新データ
    QC-->>CRE: データ更新
    CRE->>U: 最新データ表示
```

## リセットフロー（子供個別のみ）

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant CRE as ChildRewardEdit
    participant Modal as Mantine Modal
    participant API as API Client
    participant QC as QueryClient
    
    U->>CRE: FAB: リセットボタンクリック
    CRE->>Modal: modals.openConfirmModal
    Modal->>U: "家族全体の設定にリセットしますか？"
    
    U->>Modal: "リセット" クリック
    Modal-->>CRE: 確認
    CRE->>API: DELETE /api/children/[id]/reward/by-age/table
    API-->>CRE: 成功（子供個別設定削除）
    
    CRE->>API: GET /api/reward/by-age/table
    API-->>CRE: 家族全体の年齢別報酬データ
    
    CRE->>CRE: form.reset(家族データ)
    CRE->>CRE: トースト表示: "家族全体の設定にリセットしました"
    CRE->>QC: invalidateQueries(["childAgeRewardTable", childId])
    QC-->>CRE: キャッシュ無効化
    CRE->>U: 家族全体設定で表示
```

## 年齢型切替フロー

```mermaid
stateDiagram-v2
    [*] --> AgeType: 初期表示（年齢型）
    AgeType --> GradeType: SegmentedControl切替
    GradeType --> AgeType: SegmentedControl切替
    
    AgeType --> DisplayAgeTable: テーブル描画
    GradeType --> ConvertToAge: 学年→年齢変換
    ConvertToAge --> DisplayAgeTable
    
    DisplayAgeTable --> [*]: 保存
    
    note right of AgeType
        0歳〜100歳をテーブル表示
    end note
    
    note left of GradeType
        小1〜高3、その他を表示
        内部データは年齢変換して保持
    end note
```

## エラーハンドリングフロー

```mermaid
graph TD
    A[エラー発生] --> B{エラータイプ}
    
    B -->|バリデーションエラー| C[errors表示]
    C --> D[NumberInput error表示]
    D --> E[ユーザー修正待ち]
    
    B -->|API取得エラー| F[handleAppError]
    F --> G{エラー種別}
    G -->|401/403| H[認証エラー画面]
    G -->|404| I[Not Found画面]
    G -->|その他| J[エラートースト]
    
    B -->|API送信エラー| K[handleAppError]
    K --> L[エラートースト表示]
    L --> E
    
    B -->|ネットワークエラー| M[handleAppError]
    M --> N[ネットワークエラートースト]
    N --> E
```

## データ取得の優先順位（子供個別）

```mermaid
graph TD
    A[子供個別画面アクセス] --> B[GET /api/children/id/reward/by-age/table]
    B --> C{子供個別設定あり?}
    C -->|あり| D[子供個別設定を表示]
    C -->|なし| E[GET /api/reward/by-age/table]
    E --> F[家族全体設定を表示]
    
    D --> G[保存時: 子供個別設定を更新/作成]
    F --> H[保存時: 子供個別設定を作成]
```

**優先順位:**
1. 子供個別設定が存在すればそれを表示
2. なければ家族全体設定を表示（フォールバック）
3. 保存時は必ず子供個別設定として保存

## 認証ガードフロー

```mermaid
graph LR
    A[ページアクセス] --> B{authGuard}
    B -->|親ユーザー| C[画面表示]
    B -->|子供ユーザー| D[HOMEリダイレクト]
    B -->|ゲストユーザー| D
    B -->|未ログイン| E[ログイン画面リダイレクト]
```
