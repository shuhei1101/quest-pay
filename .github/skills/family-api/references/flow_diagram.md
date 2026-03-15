(2026年3月記載)

# 家族管理フロー図

## 家族作成からメンバー参加までのフロー

```mermaid
flowchart TD
    Start([親が家族作成開始]) --> RegisterForm[家族登録フォーム入力]
    RegisterForm --> GenerateInvite[招待コード生成<br/>generateUniqueInviteCode]
    GenerateInvite --> CreateFamily[families レコード作成]
    CreateFamily --> CreateProfile[profiles レコード作成<br/>type: parent]
    CreateProfile --> CreateParent[parents レコード作成]
    CreateParent --> ShowInvite[招待コード表示]
    
    ShowInvite --> InviteFlow{メンバー招待}
    
    InviteFlow -->|親を招待| ParentJoin[親が招待コード入力]
    ParentJoin --> ValidateParentCode[招待コード検証<br/>parents.invite_code]
    ValidateParentCode -->|有効| CreateParentProfile[profiles + parents作成]
    ValidateParentCode -->|無効| ParentJoinError[エラー: 無効なコード]
    
    InviteFlow -->|子供を招待| ChildJoin[子供が招待コード入力]
    ChildJoin --> ValidateChildCode[招待コード検証<br/>children.invite_code]
    ValidateChildCode -->|有効| CreateChildProfile[profiles + children作成]
    ValidateChildCode -->|無効| ChildJoinError[エラー: 無効なコード]
    
    CreateParentProfile --> FamilyComplete[家族メンバー追加完了]
    CreateChildProfile --> FamilyComplete
    
    FamilyComplete --> End([完了])
```

## 家族情報更新・削除フロー

```mermaid
flowchart TD
    Start([親が家族管理画面アクセス]) --> CheckAuth{親権限チェック}
    CheckAuth -->|親| ShowFamily[家族情報表示]
    CheckAuth -->|非親| AuthError[エラー: 権限なし]
    
    ShowFamily --> Action{操作選択}
    
    Action -->|編集| EditForm[家族情報編集フォーム]
    EditForm --> Validate[バリデーション]
    Validate -->|OK| UpdateFamily[families レコード更新]
    Validate -->|NG| ValidationError[バリデーションエラー]
    UpdateFamily --> Success1[更新成功]
    
    Action -->|削除| ConfirmDelete{削除確認}
    ConfirmDelete -->|確認| CheckRestrictions{制約チェック}
    CheckRestrictions -->|制約あり| RestrictError[エラー: 削除不可<br/>子供、クエストなど存在]
    CheckRestrictions -->|制約なし| DeleteFamily[families レコード削除]
    DeleteFamily --> CascadeDelete[関連レコードの削除<br/>CASCADE制約による]
    CascadeDelete --> Success2[削除成功]
    
    ConfirmDelete -->|キャンセル| ShowFamily
    
    Success1 --> End([完了])
    Success2 --> End
```

## メンバー管理フロー

```mermaid
flowchart TD
    Start([家族メンバー一覧表示]) --> ShowMembers[profiles取得<br/>by family_id]
    ShowMembers --> Action{操作選択}
    
    Action -->|子供追加| ChildInvite[子供招待コード表示]
    ChildInvite --> ChildJoin[子供がコード入力]
    ChildJoin --> CreateChild[profiles + children作成]
    CreateChild --> RefreshList[メンバー一覧更新]
    
    Action -->|親追加| ParentInvite[親招待コード表示]
    ParentInvite --> ParentJoin[親がコード入力]
    ParentJoin --> CreateParent[profiles + parents作成]
    CreateParent --> RefreshList
    
    Action -->|メンバー削除| DeleteConfirm{削除確認}
    DeleteConfirm -->|確認| CheckConstraints{制約チェック}
    CheckConstraints -->|制約あり| ConstraintError[エラー: 削除不可<br/>クエスト担当など]
    CheckConstraints -->|制約なし| DeleteProfile[profiles削除]
    DeleteProfile --> CascadeProfileDelete[CASCADE削除<br/>parents/children]
    CascadeProfileDelete --> RefreshList
    
    DeleteConfirm -->|キャンセル| ShowMembers
    
    RefreshList --> End([完了])
```

## ロール（親・子供）管理の概念

### 親の責務
- 家族作成・編集・削除
- 子供の招待コード生成・管理
- 親の招待コード生成・管理
- クエスト作成・承認・却下
- 報酬設定

### 子供の責務
- クエスト受注
- 完了報告
- 報酬受け取り
- 貯金管理

### 権限の判定方法
```typescript
// profiles.typeで判定
if (profile.type === 'parent') {
  // 親の権限
} else if (profile.type === 'child') {
  // 子供の権限
}

// parents/childrenテーブルの存在でも判定可能
const parent = await db.query.parents.findFirst({
  where: eq(parents.profileId, profileId)
})
if (parent) {
  // 親確認
}
```

## 家族フォロー機能フロー

```mermaid
flowchart TD
    Start([家族詳細画面表示]) --> CheckFollowStatus[フォロー状態取得<br/>GET /api/families/[id]/follow/status]
    CheckFollowStatus --> ShowButton{フォロー状態}
    
    ShowButton -->|未フォロー| ShowFollow[フォローボタン表示]
    ShowButton -->|フォロー中| ShowUnfollow[フォロー解除ボタン表示]
    
    ShowFollow --> ClickFollow[フォロークリック]
    ClickFollow --> CreateFollow[POST /api/families/[id]/follow<br/>family_follows作成]
    CreateFollow --> UpdateCount1[フォロー数更新]
    UpdateCount1 --> ShowUnfollow
    
    ShowUnfollow --> ClickUnfollow[フォロー解除クリック]
    ClickUnfollow --> DeleteFollow[DELETE /api/families/[id]/follow<br/>family_follows削除]
    DeleteFollow --> UpdateCount2[フォロー数更新]
    UpdateCount2 --> ShowFollow
    
    UpdateCount1 --> End([完了])
    UpdateCount2 --> End
```

## エラーハンドリング

### 招待コード検証エラー
- 無効な招待コード
- 既に使用済みの招待コード
- 期限切れ（必要な場合）

### 権限エラー
- 親でないユーザーが編集・削除を試みる
- 他の家族の情報にアクセスしようとする

### 制約エラー
- 子供が存在する家族の削除
- クエストが存在する家族の削除
- プロフィール削除時の外部キー制約違反
