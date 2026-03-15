(2026年3月記載)

# 子供管理フロー図

## 子供ライフサイクル全体フロー

```mermaid
flowchart TB
    Start([親ユーザーログイン]) --> CheckFamily{家族登録<br/>済み?}
    CheckFamily -->|No| CreateFamily[家族作成]
    CheckFamily -->|Yes| ChildList[子供一覧表示]
    CreateFamily --> ChildList
    
    ChildList --> AddChild[子供追加ボタン]
    AddChild --> RegisterChild[子供登録フロー]
    
    RegisterChild --> InputProfile[プロフィール入力<br/>名前/アイコン/生年月日]
    InputProfile --> GenerateCode[招待コード生成]
    GenerateCode --> CreateProfile[profilesレコード作成<br/>type=child, user_id=null]
    CreateProfile --> CreateChild[childrenレコード作成<br/>invite_code設定]
    CreateChild --> DisplayCode[招待コード表示]
    
    DisplayCode --> ChildCreated([子供登録完了])
    ChildCreated --> ChildLogin[子供ログインフロー]
    
    ChildLogin --> EnterCode[招待コード入力]
    EnterCode --> ValidateCode{コード<br/>有効?}
    ValidateCode -->|No| CodeError[エラー表示]
    ValidateCode -->|Yes| CreateAuth[auth.usersレコード作成]
    CreateAuth --> LinkProfile[profiles.user_id更新]
    LinkProfile --> ChildLoggedIn([子供ログイン完了])
    
    ChildList --> ViewDetail[子供詳細表示]
    ViewDetail --> EditChild[子供編集フロー]
    EditChild --> UpdateProfile[プロフィール更新]
    UpdateProfile --> ProfileUpdated([更新完了])
    
    ViewDetail --> DeleteChild[子供削除フロー]
    DeleteChild --> ConfirmDelete{削除確認}
    ConfirmDelete -->|No| ViewDetail
    ConfirmDelete -->|Yes| DeleteProfile[profilesレコード削除]
    DeleteProfile --> DeleteCascade[children削除<br/>カスケード]
    DeleteCascade --> ChildDeleted([削除完了])
    
    CodeError --> EnterCode
```

## 子供登録詳細フロー

```mermaid
sequenceDiagram
    participant Parent as 親ユーザー
    participant UI as 子供登録画面
    participant API as POST /api/children
    participant Auth as 認証サービス
    participant DB as データベース
    
    Parent->>UI: 新規登録ボタンクリック
    UI->>Parent: フォーム表示
    Parent->>UI: 名前/アイコン/生年月日入力
    UI->>API: POST {form}
    
    API->>Auth: 認証コンテキスト取得
    Auth-->>API: userId, db
    
    API->>DB: ユーザー情報取得<br/>fetchUserInfoByUserId
    DB-->>API: userInfo (familyId含む)
    
    API->>API: 家族ID検証
    
    API->>API: 招待コード生成<br/>generateUniqueInviteCode
    loop 最大10回試行
        API->>API: ランダムコード生成
        API->>DB: 重複チェック<br/>fetchChildByInviteCode
        DB-->>API: 存在判定
    end
    
    API->>DB: トランザクション開始
    API->>DB: profilesレコード作成<br/>{name, iconId, iconColor, familyId, type='child', user_id=null}
    DB-->>API: profileId
    
    API->>DB: childrenレコード作成<br/>{profileId, inviteCode}
    DB-->>API: childId
    API->>DB: トランザクションコミット
    
    API-->>UI: {childId}
    UI->>Parent: 招待コード表示画面へ遷移
```

## プロフィール更新フロー

```mermaid
sequenceDiagram
    participant Parent as 親ユーザー
    participant UI as 子供編集画面
    participant GETAPI as GET /api/children/[id]
    participant PUTAPI as PUT /api/children/[id]
    participant DB as データベース
    
    Parent->>UI: 編集ボタンクリック
    UI->>GETAPI: GET /api/children/{id}
    
    GETAPI->>DB: 子供情報取得<br/>fetchChild
    DB-->>GETAPI: child data
    GETAPI->>DB: クエスト統計取得<br/>fetchChildQuestStats
    DB-->>GETAPI: questStats
    GETAPI->>DB: 報酬統計取得<br/>fetchChildRewardStats
    DB-->>GETAPI: rewardStats
    GETAPI->>DB: 定額報酬取得<br/>fetchChildFixedReward
    DB-->>GETAPI: fixedReward
    
    GETAPI-->>UI: {child, questStats, rewardStats, fixedReward}
    UI->>Parent: フォーム表示（既存値）
    
    Parent->>UI: 情報変更
    UI->>PUTAPI: PUT /api/children/{id} {form}
    
    PUTAPI->>DB: 家族ID検証
    PUTAPI->>DB: profilesレコード更新<br/>{name, iconId, iconColor, birthday}
    DB-->>PUTAPI: 更新成功
    
    PUTAPI-->>UI: {success}
    UI->>Parent: 完了メッセージ表示
```

## 子供削除フロー

```mermaid
sequenceDiagram
    participant Parent as 親ユーザー
    participant UI as 子供一覧/詳細
    participant API as DELETE /api/children/[id]
    participant DB as データベース
    
    Parent->>UI: 削除ボタンクリック
    UI->>Parent: 確認ダイアログ表示
    Parent->>UI: 削除確定
    
    UI->>API: DELETE /api/children/{id}
    
    API->>DB: 家族ID検証
    API->>DB: トランザクション開始
    
    API->>DB: profilesレコード削除
    Note over DB: ON DELETE CASCADEにより<br/>auth.usersも削除（存在すれば）
    
    Note over DB: ON DELETE RESTRICTにより<br/>childrenレコードは手動削除
    API->>DB: childrenレコード削除
    
    Note over DB: カスケード削除:<br/>- child_quests<br/>- reward_history<br/>その他関連レコード
    
    API->>DB: トランザクションコミット
    
    API-->>UI: {success}
    UI->>Parent: 子供一覧へ遷移
```

## ステータス遷移なし

子供管理APIにはステータス遷移はありません。主な状態変化：

1. **未認証 → 認証済み**: 子供が招待コードでログイン
2. **レベル/経験値/貯金額**: クエスト完了時に更新
3. **プロフィール情報**: いつでも更新可能

## エラーハンドリング

### 1. 家族ID検証失敗
- 原因: ユーザーが家族に所属していない
- 処理: ServerError例外をスロー
- UI: エラーメッセージ表示

### 2. 招待コード生成失敗
- 原因: 10回試行しても重複
- 処理: ServerError例外をスロー
- UI: エラーメッセージ表示、再試行促す

### 3. 権限不正
- 原因: 別家族の子供にアクセス
- 処理: ServerError例外をスロー
- UI: 403エラー表示

### 4. データ不整合
- 原因: profileIdとchildIdの不一致
- 処理: トランザクションロールバック
- UI: エラーメッセージ表示
