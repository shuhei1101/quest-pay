# Schema Guide - 詳細スキーマ構造

このドキュメントは`drizzle/schema.ts`の詳細な構造を説明する。
テストデータ生成時にこのガイドを参照して、正しいデータ構造を作成すること。

## 主要Enum型

### userType
```typescript
export const userType = pgEnum("user_type", ["parent", "child"])
```

### questType
```typescript
export const questType = pgEnum("quest_type", ["template", "public", "family"])
```

### childQuestStatus
```typescript
export const childQuestStatus = pgEnum("child_quest_status", [
  "not_started",     // 未着手
  "in_progress",     // 進行中
  "pending_review",  // 報告中
  "completed",       // 完了
])
```

### notificationType
```typescript
export const notificationType = pgEnum("notification_type", [
  "family_quest_review",
  "quest_report_rejected",
  "quest_report_approved",
  "quest_cleared",
  "quest_level_up",
  "quest_completed",
  "other",
])
```

### rewardType
```typescript
export const rewardType = pgEnum("reward_type", [
  "quest",          // クエスト報酬
  "age_monthly",    // 年齢別定期報酬
  "level_monthly",  // レベル別定期報酬
  "other",
])
```

### familyTimelineActionType
```typescript
export const familyTimelineActionType = pgEnum("family_timeline_action_type", [
  "quest_created",
  "quest_completed",
  "quest_cleared",
  "quest_level_up",
  "child_joined",
  "parent_joined",
  "reward_received",
  "savings_updated",
  "savings_milestone_reached",
  "quest_milestone_reached",
  "comment_posted",
  "other",
])
```

### publicTimelineActionType
```typescript
export const publicTimelineActionType = pgEnum("public_timeline_action_type", [
  "quest_published",
  "likes_milestone_reached",
  "posts_milestone_reached",
  "comments_milestone_reached",
  "comment_posted",
  "like_received",
  "other",
])
```

### ageRewardTableType
```typescript
export const ageRewardTableType = pgEnum("age_reward_table_type", [
  "template",
  "public",
  "family",
  "child"
])
```

### levelRewardTableType
```typescript
export const levelRewardTableType = pgEnum("level_reward_table_type", [
  "template",
  "public",
  "family",
  "child"
])
```

### commentUpvoteType
```typescript
export const commentUpvoteType = pgEnum("comment_upvote_type", [
  "upvote",
  "downvote",
])
```

## ユーザー・プロフィール関連テーブル

### auth.users (authUsers)
```typescript
{
  id: uuid (PK) - 認証ユーザーID
}
```

### profiles
```typescript
{
  id: uuid (PK, auto-generated) - プロフィールID
  userId: uuid (FK → auth.users.id, unique, cascade delete) - 認証ユーザーID
  name: text (required) - プロフィール名
  birthday: date - 生年月日
  familyId: uuid (FK → families.id, required) - 家族ID
  iconId: integer (FK → icons.id, required) - アイコンID
  iconColor: text (required) - アイコンカラー
  type: userType (required) - ユーザータイプ（parent/child）
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### parents
```typescript
{
  id: uuid (PK, auto-generated)
  profileId: uuid (FK → profiles.id, unique, required) - プロフィールID
  inviteCode: text (unique, required) - 招待コード
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### children
```typescript
{
  id: uuid (PK, auto-generated)
  profileId: uuid (FK → profiles.id, unique, required) - プロフィールID
  inviteCode: text (unique, required) - 招待コード
  minSavings: integer (default: 0) - 最低貯金額
  currentSavings: integer (default: 0) - 現在の貯金額
  currentLevel: integer (default: 1) - 現在のレベル
  totalExp: integer (default: 0) - 総獲得経験値
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

## 家族関連テーブル

### families
```typescript
{
  id: uuid (PK, auto-generated)
  displayId: text (unique, required) - 表示ID
  localName: text (required) - ローカル名
  onlineName: text - オンライン名
  introduction: text (default: "") - 紹介文
  iconId: integer (FK → icons.id, required) - アイコンID
  iconColor: text (required) - アイコンカラー
  inviteCode: text (unique, default: "") - 招待コード
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

## アイコン・カテゴリテーブル（マスターデータ）

### iconCategories
```typescript
{
  id: integer (PK, auto-increment)
  name: text (unique, default: "")
  iconName: text (default: "")
  iconSize: integer
  sortOrder: integer (default: 999)
}
```

### icons
```typescript
{
  id: integer (PK, auto-increment)
  name: text (unique, default: "")
  categoryId: integer (FK → iconCategories.id)
  size: integer
}
```

### questCategories
```typescript
{
  id: integer (PK, auto-increment)
  name: text (unique, default: "")
  iconName: text (default: "")
  iconSize: integer
  iconColor: text
  sortOrder: integer (default: 999)
}
```

## クエスト関連テーブル

### quests
```typescript
{
  id: uuid (PK, auto-generated)
  name: text (default: "") - クエスト名
  type: questType (required) - クエスト種別
  categoryId: integer (FK → questCategories.id) - カテゴリID
  iconId: integer (FK → icons.id, required) - アイコンID
  iconColor: text (required) - アイコンカラー
  ageFrom: integer - 年齢制限開始
  ageTo: integer - 年齢制限終了
  monthFrom: integer - 月指定開始月
  monthTo: integer - 月指定終了月
  client: text (default: "") - 依頼者氏名
  requestDetail: text (default: "") - 依頼詳細
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### familyQuests
```typescript
{
  id: uuid (PK, auto-generated)
  questId: uuid (FK → quests.id, unique, required)
  familyId: uuid (FK → families.id, required)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### questDetails
```typescript
{
  id: uuid (PK, auto-generated)
  questId: uuid (FK → quests.id, required)
  level: integer (default: 1)
  successCondition: text (default: "")
  requiredCompletionCount: integer (default: 1)
  reward: integer (default: 0)
  childExp: integer (default: 0)
  requiredClearCount: integer
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
  
  // 複合主キー: (id, questId, level)
}
```

### questTags
```typescript
{
  id: uuid (PK, auto-generated)
  name: text (default: "")
  questId: uuid (FK → quests.id, required)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
  
  // 複合主キー: (id, name, questId)
}
```

### questChildren
```typescript
{
  id: uuid (PK, auto-generated)
  familyQuestId: uuid (FK → familyQuests.id, required)
  childId: uuid (FK → children.id, required)
  level: integer (default: 1)
  status: childQuestStatus (default: "not_started")
  requestMessage: text - 子供の申請メッセージ
  lastApprovedBy: uuid (FK → profiles.id) - 最後に承認/却下した親のプロフィールID
  currentCompletionCount: integer (default: 0)
  currentClearCount: integer (default: 0)
  isActivate: boolean (default: true)
  statusUpdatedAt: timestamp
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### templateQuests
```typescript
{
  id: uuid (PK, auto-generated)
  questId: uuid (FK → quests.id, unique, required)
  publicQuestId: uuid (FK → publicQuests.id) - 保存元の共有クエストID
  familyId: uuid (FK → families.id, required)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### publicQuests
```typescript
{
  id: uuid (PK, auto-generated)
  questId: uuid (FK → quests.id, unique, required)
  familyQuestId: uuid (FK → familyQuests.id, required)
  familyId: uuid (FK → families.id, required)
  isActivate: boolean (default: false)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

## 通知関連テーブル

### notifications
```typescript
{
  id: uuid (PK, auto-generated)
  recipientProfileId: uuid (FK → profiles.id, required, cascade delete)
  url: text (default: "")
  type: notificationType (default: "other")
  message: text (default: "")
  isRead: boolean (default: false)
  readAt: timestamp
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

## 報酬関連テーブル

### rewardHistories
```typescript
{
  id: uuid (PK, auto-generated)
  childId: uuid (FK → children.id, required, cascade delete)
  type: rewardType (required)
  title: text (default: "")
  amount: integer (required)
  exp: integer (default: 0)
  rewardedAt: timestamp (default: now)
  scheduledPaymentDate: date
  isPaid: boolean (default: false)
  paidAt: timestamp
  url: text
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### rewardByAges (年齢別お小遣い額)
```typescript
{
  id: uuid (PK, auto-generated)
  type: ageRewardTableType (default: "template")
  ageRewardTableId: uuid (required)
  age: integer (required)
  amount: integer (required)
  
  // ユニーク制約: (type, ageRewardTableId, age)
}
```

### familyAgeRewardTables
```typescript
{
  id: uuid (PK, auto-generated)
  familyId: uuid (FK → families.id, required, cascade delete)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### publicAgeRewardTables
```typescript
{
  id: uuid (PK, auto-generated)
  familyAgeRewardTableId: uuid (FK → familyAgeRewardTables.id, required, cascade delete)
  familyId: uuid (FK → families.id, required)
  isActivate: boolean (default: false)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### childAgeRewardTables
```typescript
{
  id: uuid (PK, auto-generated)
  childId: uuid (FK → children.id, required, cascade delete)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### templateAgeRewardTables
```typescript
{
  id: uuid (PK, auto-generated)
  publicAgeRewardTableId: uuid (FK → publicAgeRewardTables.id, required)
  familyId: uuid (FK → families.id, required)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### rewardByLevels (レベル別お小遣い額)
```typescript
{
  id: uuid (PK, auto-generated)
  type: levelRewardTableType (default: "template")
  levelRewardTableId: uuid (required)
  level: integer (required)
  amount: integer (required)
  
  // ユニーク制約: (type, levelRewardTableId, level)
}
```

### familyLevelRewardTables
```typescript
{
  id: uuid (PK, auto-generated)
  familyId: uuid (FK → families.id, required, cascade delete)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### publicLevelRewardTables
```typescript
{
  id: uuid (PK, auto-generated)
  familyLevelRewardTableId: uuid (FK → familyLevelRewardTables.id, required, cascade delete)
  familyId: uuid (FK → families.id, required)
  isActivate: boolean (default: false)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### childLevelRewardTables
```typescript
{
  id: uuid (PK, auto-generated)
  childId: uuid (FK → children.id, required, cascade delete)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### templateLevelRewardTables
```typescript
{
  id: uuid (PK, auto-generated)
  publicLevelRewardTableId: uuid (FK → publicLevelRewardTables.id, required)
  familyId: uuid (FK → families.id, required)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

## コメント関連テーブル

### publicQuestComments
```typescript
{
  id: uuid (PK, auto-generated)
  publicQuestId: uuid (FK → publicQuests.id, required, cascade delete)
  profileId: uuid (FK → profiles.id, required, cascade delete)
  content: text (default: "")
  isPinned: boolean (default: false)
  isLikedByPublisher: boolean (default: false)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
  
  // ユニーク制約: publicQuestIdに対してisPinned=trueは1件のみ
}
```

### commentLikes
```typescript
{
  commentId: uuid (required)
  profileId: uuid (FK → profiles.id, required, cascade delete)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
  
  // 複合主キー: (commentId, profileId)
}
```

### commentReports
```typescript
{
  commentId: uuid (required)
  profileId: uuid (FK → profiles.id, required, cascade delete)
  reason: text (default: "")
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
  
  // 複合主キー: (commentId, profileId)
}
```

### commentUpvotes
```typescript
{
  commentId: uuid (required)
  profileId: uuid (FK → profiles.id, required, cascade delete)
  type: commentUpvoteType (required)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
  
  // 複合主キー: (commentId, profileId)
}
```

## タイムライン関連テーブル

### familyTimelines
```typescript
{
  id: uuid (PK, auto-generated)
  familyId: uuid (FK → families.id, required, cascade delete)
  type: familyTimelineActionType (required)
  profileId: uuid (FK → profiles.id, required, cascade delete)
  message: text (default: "")
  url: text
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

### publicTimelines
```typescript
{
  id: uuid (PK, auto-generated)
  familyId: uuid (FK → families.id, required, cascade delete)
  type: publicTimelineActionType (required)
  message: text (default: "")
  url: text
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
}
```

## フォロー関連テーブル

### follows
```typescript
{
  followerFamilyId: uuid (FK → families.id, required, cascade delete)
  followFamilyId: uuid (FK → families.id, required, cascade delete)
  createdAt: timestamp (auto)
  updatedAt: timestamp (auto)
  
  // 複合主キー: (followerFamilyId, followFamilyId)
}
```

## テーブル間リレーション概要

```
families (家族)
├── profiles (プロフィール)
│   ├── parents (親)
│   └── children (子供)
│       ├── rewardHistories (報酬履歴)
│       ├── childAgeRewardTables (子供個別年齢別報酬テーブル)
│       └── childLevelRewardTables (子供個別レベル別報酬テーブル)
├── familyQuests (家族クエスト)
│   ├── quests (クエスト)
│   │   ├── questDetails (クエスト詳細)
│   │   └── questTags (クエストタグ)
│   └── questChildren (子供クエスト受注)
├── publicQuests (公開クエスト)
│   └── publicQuestComments (コメント)
│       ├── commentLikes (いいね)
│       ├── commentReports (報告)
│       └── commentUpvotes (評価)
├── templateQuests (テンプレートクエスト)
├── familyAgeRewardTables (家族年齢別報酬テーブル)
├── familyLevelRewardTables (家族レベル別報酬テーブル)
├── familyTimelines (家族タイムライン)
└── notifications (通知)

マスターデータ:
- iconCategories → icons
- questCategories
```

## テストデータ作成時の注意点

### 外部キー依存関係の順序

テーブルへのINSERT順序は依存関係を考慮すること：

1. **マスターデータ** (iconCategories, icons, questCategories)
2. **families** (家族)
3. **profiles** (プロフィール)
4. **parents / children** (親/子供)
5. **quests** (クエスト)
6. **familyQuests, templateQuests, publicQuests** (各種クエスト)
7. **questDetails, questTags** (クエスト詳細・タグ)
8. **questChildren** (子供クエスト受注)
9. **rewardHistories** (報酬履歴)
10. **notifications** (通知)
11. **publicQuestComments** (コメント)
12. **commentLikes, commentReports, commentUpvotes** (コメント関連)
13. **familyTimelines, publicTimelines** (タイムライン)
14. **各種報酬テーブル** (familyAgeRewardTables, rewardByAges, etc.)

### 複合主キーを持つテーブル

以下のテーブルは複合主キーを持つため、重複に注意：

- `questDetails`: (id, questId, level)
- `questTags`: (id, name, questId)
- `commentLikes`: (commentId, profileId)
- `commentReports`: (commentId, profileId)
- `commentUpvotes`: (commentId, profileId)
- `follows`: (followerFamilyId, followFamilyId)

### ユニーク制約

以下のフィールドは一意である必要がある：

- `families.displayId`
- `families.inviteCode`
- `profiles.userId`
- `parents.profileId`
- `parents.inviteCode`
- `children.profileId`
- `children.inviteCode`
- `iconCategories.name`
- `icons.name`
- `questCategories.name`
- `familyQuests.questId`
- `templateQuests.questId`
- `publicQuests.questId`
- `rewardByAges`: (type, ageRewardTableId, age)
- `rewardByLevels`: (type, levelRewardTableId, level)

## 参考リンク

- メインスキーマ定義: `drizzle/schema.ts`
- エンドポイント定義: `app/(core)/endpoints.ts`
- DB操作ガイド: `.github/skills/database-operations/SKILL.md`
