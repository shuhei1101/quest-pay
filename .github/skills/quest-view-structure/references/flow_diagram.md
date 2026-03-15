# クエスト閲覧画面 レンダリング・インタラクションフロー

**最終更新: 2026年3月記載**

## 初期表示フロー

### 家族クエスト閲覧画面

```mermaid
sequenceDiagram
    participant User
    participant FamilyQuestViewScreen
    participant useFamilyQuest
    participant API
    participant DB

    User->>FamilyQuestViewScreen: 画面アクセス
    FamilyQuestViewScreen->>useFamilyQuest: questId指定
    useFamilyQuest->>API: GET /api/quests/family/{id}
    API->>DB: SELECT family_quests JOIN details
    DB-->>API: クエストデータ
    API-->>useFamilyQuest: レスポンス
    useFamilyQuest-->>FamilyQuestViewScreen: クエストデータ
    FamilyQuestViewScreen->>FamilyQuestViewScreen: レベル1を初期選択
    FamilyQuestViewScreen-->>User: 画面表示完了
```

**処理詳細:**
1. FamilyQuestViewScreen がマウント
2. useFamilyQuest フックで全レベルのクエスト詳細を取得
3. 初期表示レベル（level: 1）を設定
4. FamilyQuestViewLayoutに選択レベルのデータを渡して表示

---

### 公開クエスト閲覧画面

```mermaid
sequenceDiagram
    participant User
    participant PublicQuestViewScreen
    participant usePublicQuest
    participant API
    participant DB

    User->>PublicQuestViewScreen: 画面アクセス
    PublicQuestViewScreen->>usePublicQuest: questId指定
    usePublicQuest->>API: GET /api/quests/public/{id}
    API->>DB: SELECT public_quests JOIN details
    DB-->>API: クエストデータ
    API-->>usePublicQuest: レスポンス
    usePublicQuest-->>PublicQuestViewScreen: クエストデータ
    PublicQuestViewScreen-->>User: 画面表示完了
```

---

### テンプレートクエスト閲覧画面

```mermaid
sequenceDiagram
    participant User
    participant TemplateQuestViewScreen
    participant useTemplateQuest
    participant API
    participant DB

    User->>TemplateQuestViewScreen: 画面アクセス
    TemplateQuestViewScreen->>useTemplateQuest: questId指定
    useTemplateQuest->>API: GET /api/quests/template/{id}
    API->>DB: SELECT template_quests JOIN details
    DB-->>API: クエストデータ
    API-->>useTemplateQuest: レスポンス
    useTemplateQuest-->>TemplateQuestViewScreen: クエストデータ
    TemplateQuestViewScreen-->>User: 画面表示完了
```

---

### 子供クエスト閲覧画面

```mermaid
sequenceDiagram
    participant Child
    participant ChildQuestViewScreen
    participant useChildQuest
    participant API
    participant DB

    Child->>ChildQuestViewScreen: 画面アクセス
    ChildQuestViewScreen->>useChildQuest: questId, childId指定
    useChildQuest->>API: GET /api/quests/family/{id}/child/{childId}
    API->>DB: SELECT child_quests JOIN family_quest_details
    DB-->>API: 子供クエストデータ
    API-->>useChildQuest: レスポンス
    useChildQuest-->>ChildQuestViewScreen: 子供クエストデータ
    ChildQuestViewScreen-->>Child: 画面表示完了（ステータスに応じたフッター）
```

---

## レベル選択フロー（家族クエスト）

```mermaid
sequenceDiagram
    participant User
    participant SubMenuFAB
    participant FamilyQuestViewScreen
    participant FamilyQuestViewLayout

    User->>SubMenuFAB: レベル選択ボタンクリック
    SubMenuFAB->>SubMenuFAB: メニューを表示
    SubMenuFAB-->>User: レベル一覧表示
    User->>SubMenuFAB: レベルを選択
    SubMenuFAB->>FamilyQuestViewScreen: selectedLevel更新
    FamilyQuestViewScreen->>FamilyQuestViewLayout: 新しいレベルのデータを渡す
    FamilyQuestViewLayout-->>User: 選択レベルの詳細表示
```

**UI動作:**
- SubMenuFABにレベル選択ボタンと編集ボタンを統合
- レベル選択ボタン押下でPaperベースのメニューを表示
- メニューから選択したレベルに応じて画面内容を更新

---

## タブ切り替えフロー

```mermaid
sequenceDiagram
    participant User
    participant Tabs
    participant TabPanel

    User->>Tabs: タブをクリック
    Tabs->>Tabs: activeTab更新
    Tabs->>TabPanel: 対応するタブコンテンツを表示
    alt 条件タブ
        TabPanel-->>User: QuestConditionTab表示
    else 依頼情報タブ
        TabPanel-->>User: QuestDetailTab表示
    else その他タブ
        TabPanel-->>User: QuestOtherTab表示
    end
```

**タブ種類:**
1. **条件タブ**: レベル、カテゴリ、達成条件、報酬、経験値、必要完了回数
2. **依頼情報タブ**: 依頼主、依頼内容
3. **その他タブ**: タグ、推奨年齢・月齢

---

## 完了報告フロー（子供クエスト）

```mermaid
sequenceDiagram
    participant Child
    participant ChildQuestViewFooter
    participant API
    participant DB
    participant Parent

    Child->>ChildQuestViewFooter: 完了報告ボタンクリック
    ChildQuestViewFooter->>ChildQuestViewFooter: 確認モーダル表示
    Child->>ChildQuestViewFooter: 確認
    ChildQuestViewFooter->>API: POST /api/quests/family/{id}/review-request
    API->>DB: UPDATE child_quests SET status = 'pending_review'
    DB-->>API: 更新完了
    API->>DB: INSERT notifications (親に通知)
    DB-->>API: 通知作成完了
    API-->>ChildQuestViewFooter: 成功レスポンス
    ChildQuestViewFooter-->>Child: 報告完了メッセージ表示
    Note over Parent: 通知を受け取る
```

**ステータス遷移:**
- `in_progress` → `pending_review`

---

## 完了報告取消フロー（子供クエスト）

```mermaid
sequenceDiagram
    participant Child
    participant ChildQuestViewFooter
    participant API
    participant DB

    Child->>ChildQuestViewFooter: 報告取消ボタンクリック
    ChildQuestViewFooter->>ChildQuestViewFooter: 確認モーダル表示
    Child->>ChildQuestViewFooter: 確認
    ChildQuestViewFooter->>API: DELETE /api/quests/family/{id}/review-request
    API->>DB: UPDATE child_quests SET status = 'in_progress'
    DB-->>API: 更新完了
    API-->>ChildQuestViewFooter: 成功レスポンス
    ChildQuestViewFooter-->>Child: 取消完了メッセージ表示
```

**ステータス遷移:**
- `pending_review` → `in_progress`

---

## 編集モードへの遷移（家族クエスト）

```mermaid
sequenceDiagram
    participant User
    participant SubMenuFAB
    participant FamilyQuestViewScreen
    participant Router

    User->>SubMenuFAB: 編集ボタンクリック
    SubMenuFAB->>FamilyQuestViewScreen: editModalOpened = true
    FamilyQuestViewScreen->>Router: navigate(/quests/family/{id}/edit)
    Router-->>User: 編集画面へ遷移
```

---

## 採用フロー（テンプレートクエスト）

```mermaid
sequenceDiagram
    participant User
    participant AdoptButton
    participant API
    participant DB
    participant Router

    User->>AdoptButton: 採用ボタンクリック
    AdoptButton->>AdoptButton: 確認モーダル表示
    User->>AdoptButton: 確認
    AdoptButton->>API: POST /api/quests/family (templateデータをコピー)
    API->>DB: INSERT family_quests, family_quest_details
    DB-->>API: 新規クエストID
    API-->>AdoptButton: 成功レスポンス
    AdoptButton->>Router: navigate(/quests/family/{newId}/edit)
    Router-->>User: 新規家族クエスト編集画面へ遷移
```

---

## いいね・コメント機能フロー（公開クエスト）

```mermaid
sequenceDiagram
    participant User
    participant PublicQuestViewScreen
    participant API
    participant DB

    User->>PublicQuestViewScreen: いいねボタンクリック
    PublicQuestViewScreen->>API: POST /api/quests/public/{id}/like
    API->>DB: INSERT quest_likes
    DB-->>API: いいね登録完了
    API-->>PublicQuestViewScreen: 成功レスポンス
    PublicQuestViewScreen-->>User: いいね数更新表示

    User->>PublicQuestViewScreen: コメントボタンクリック
    PublicQuestViewScreen->>PublicQuestViewScreen: コメントモーダル表示
    PublicQuestViewScreen->>API: GET /api/quests/public/{id}/comments
    API->>DB: SELECT quest_comments
    DB-->>API: コメント一覧
    API-->>PublicQuestViewScreen: コメントデータ
    PublicQuestViewScreen-->>User: コメント一覧表示
```
