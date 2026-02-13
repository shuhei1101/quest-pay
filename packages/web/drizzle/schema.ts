import {
  pgTable,
  uuid,
  text,
  date,
  timestamp,
  integer,
  pgEnum,
  pgSchema,
  boolean,
} from "drizzle-orm/pg-core"
import { sql, relations, getTableColumns } from "drizzle-orm"
import z from "zod"
import { SortOrder } from "@/app/(core)/schema"

/** 作成日時と更新日時のタイムスタンプ */
export const timestamps = {
  /** 作成日時 */
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  /** 更新日時 */
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
}

/** ユーザタイプ */
export const userType = pgEnum("user_type", [
  "parent",
  "child",
])
export type UserType = (typeof userType.enumValues)[number]

/** クエスト種別 */
export const questType = pgEnum("quest_type", [
  "template",
  "public",
  "family",
])

/** 子供クエストステータス */
export const childQuestStatus = pgEnum("child_quest_status", [
  "not_started",          // 未着手
  "in_progress",          // 進行中
  "pending_review",       // 報告中
  "completed",            // 完了
])

/** 通知タイプ */
export const notificationType = pgEnum("notification_type", [
  "family_quest_review",        // 家族クエスト承認依頼
  "quest_report_rejected",      // クエスト報告却下
  "quest_report_approved",      // クエスト報告承認
  "quest_cleared",              // クエストクリア
  "quest_level_up",             // クエストレベルアップ
  "quest_completed",            // クエスト完了
  "other",                      // その他
])

/** 報酬タイプ */
export const rewardType = pgEnum("reward_type", [
  "quest",                // クエスト報酬
  "age_monthly",          // お小遣い（年齢別定期報酬）
  "level_monthly",        // レベル別定期報酬（rewardByLevels）
  "other",                // その他
])

/** 家族タイムラインアクションタイプ */
export const familyTimelineActionType = pgEnum("family_timeline_action_type", [
  "quest_created",              // クエスト作成
  "quest_completed",            // クエスト完了
  "quest_cleared",              // クエストクリア
  "quest_level_up",             // クエストレベルアップ
  "child_joined",               // 子供が参加
  "parent_joined",              // 親が参加
  "reward_received",            // 報酬受け取り
  "savings_updated",            // 貯金額更新
  "savings_milestone_reached",  // 貯金額マイルストーン達成（100円、500円、1000円、5000円...）
  "quest_milestone_reached",    // クエスト達成マイルストーン（10回、50回、100回、500回...）
  "comment_posted",             // コメント投稿
  "other",                      // その他
])

/** 公開タイムラインアクションタイプ */
export const publicTimelineActionType = pgEnum("public_timeline_action_type", [
  "quest_published",            // クエスト公開
  "likes_milestone_reached",    // いいね数マイルストーン達成（初回、10、50、100、500、1000...）
  "posts_milestone_reached",    // 投稿数マイルストーン達成（初回、10、50、100、500、1000...）
  "comments_milestone_reached", // コメント数マイルストーン達成
  "comment_posted",             // コメント投稿
  "like_received",              // いいね受け取り
  "other",                      // その他
])

/** タイムラインタイプ */
export const timelineType = pgEnum("timeline_type", [
  "quest_registered",        // クエスト登録
  "quest_received",          // クエスト受注
  "quest_completed",         // クエスト達成
  "quest_level_up",          // クエストレベルアップ
  "penalty_received",        // ペナルティ受領
  "quest_published",         // クエスト公開
  "quest_like_milestone",    // お気に入り数突破
  "child_birthday",          // 子供の誕生日
  "other",                   // その他
])

/** authスキーマ */
const authSchema = pgSchema("auth")

/** auth.usersテーブル */
export const authUsers = authSchema.table("users", {
  /** ID */
  id: uuid("id").primaryKey().notNull(),
})
export type AuthUserSelect = typeof authUsers.$inferSelect

/** アイコンカテゴリテーブル（マスター） */
export const iconCategories = pgTable("icon_categories", {
  /** ID */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** アイコンカテゴリ名 */
  name: text("name").notNull().default("").unique(), 
  /** アイコン名 */
  iconName: text("icon_name").notNull().default(""), 
  /** アイコンサイズ */
  iconSize: integer("icon_size"), 
  /** 表示順 */
  sortOrder: integer("sort_order").notNull().default(999), 
})
export type IconCategorySelect = typeof iconCategories.$inferSelect


/** アイコンテーブル（マスター） */
export const icons = pgTable("icons", {
  /** ID */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** アイコン名 */
  name: text("name").notNull().default("").unique(), 
  /** カテゴリID */
  categoryId: integer("category_id").references(() => iconCategories.id, { onDelete: "restrict" }), 
  /** アイコンサイズ */
  size: integer("size"), 
})
export type IconSelect = typeof icons.$inferSelect

/** ファミリーテーブル */
export const families = pgTable("families", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 表示ID */
  displayId: text("display_id").notNull().unique(),
  /** ローカル名 */
  localName: text("local_name").notNull(),
  /** オンライン名 */
  onlineName: text("online_name"),
  /** 紹介文 */
  introduction: text("introduction").notNull().default(""),
  /** アイコンID */
  iconId: integer("icon_id").notNull().references(() => icons.id, { onDelete: "restrict" }),
  /** アイコンカラー */
  iconColor: text("icon_color").notNull(),
  /** 招待コード */
  inviteCode: text("invite_code").notNull().default("").unique(),
  /** タイムスタンプ */
  ...timestamps,
})
export type FamilySelect = typeof families.$inferSelect
export type FamilyInsert = Omit<typeof families.$inferInsert, "id" | "createdAt" | "updatedAt">
export type FamilyUpdate = Partial<FamilyInsert>

/** プロフィールテーブル */
export const profiles = pgTable("profiles", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** ユーザID */
  userId: uuid("user_id").unique().references(() => authUsers.id, { onDelete: "cascade" }),
  /** プロフィール名 */
  name: text("name").notNull(),
  /** 生年月日 */
  birthday: date("birthday"),
  /** 家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "restrict" }),
  /** アイコンID */
  iconId: integer("icon_id").notNull().references(() => icons.id, { onDelete: "restrict" }),
  /** アイコンカラー */
  iconColor: text("icon_color").notNull(),
  /** ユーザタイプ */
  type: userType("type").notNull(),
  /** タイムスタンプ */
  ...timestamps,
})
export type ProfileSelect = typeof profiles.$inferSelect
export type ProfileInsert = Omit<typeof profiles.$inferInsert, "id" | "createdAt" | "updatedAt">
export type ProfileUpdate = Partial<ProfileInsert>



/** 親テーブル */
export const parents = pgTable("parents", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** プロフィールID */
  profileId: uuid("profile_id").notNull().unique().references(() => profiles.id, { onDelete: "restrict" }),
  /** 招待コード */
  inviteCode: text("invite_code").notNull().unique(),
  /** タイムスタンプ */
  ...timestamps,
})
export type ParentSelect = typeof parents.$inferSelect
export type ParentInsert = Omit<typeof parents.$inferInsert, "id" | "createdAt" | "updatedAt">
export type ParentUpdate = Partial<ParentInsert>



/** 子供テーブル */
export const children = pgTable("children", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** プロフィールID */
  profileId: uuid("profile_id").notNull().unique().references(() => profiles.id, { onDelete: "restrict" }),
  /** 招待コード */
  inviteCode: text("invite_code").notNull().unique(),
  /** 最低貯金額 */
  minSavings: integer("min_savings").notNull().default(0),
  /** 現在の貯金額 */
  currentSavings: integer("current_savings").notNull().default(0),
  /** 現在のレベル */
  currentLevel: integer("current_level").notNull().default(1),
  /** 総獲得経験値 */
  totalExp: integer("total_exp").notNull().default(0),
  /** タイムスタンプ */
  ...timestamps,
})
export type ChildSelect = typeof children.$inferSelect
export type ChildInsert = Omit<typeof children.$inferInsert, "id" | "createdAt" | "updatedAt">
export type ChildUpdate = Partial<ChildInsert>


/** クエストカテゴリテーブル（マスター） */
export const questCategories = pgTable("quest_categories", {
  /** ID */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** クエストカテゴリ名 */
  name: text("name").notNull().default("").unique(),
  /** アイコン名 */
  iconName: text("icon_name").notNull().default(""),
  /** アイコンサイズ */
  iconSize: integer("icon_size"),
  /** アイコンカラー */
  iconColor: text("icon_color"),
  /** 表示順 */
  sortOrder: integer("sort_order").notNull().default(999),
})
export type QuestCategorySelect = typeof questCategories.$inferSelect

/** クエストテーブル */
export const quests = pgTable("quests", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** クエスト名 */
  name: text("name").notNull().default(""),
  /** クエスト種別 */
  type: questType("type").notNull(),
  /** カテゴリID */
  categoryId: integer("category_id").references(() => questCategories.id, { onDelete: "restrict" }),
  /** アイコンID */
  iconId: integer("icon_id").notNull().references(() => icons.id, { onDelete: "restrict" }),
  /** アイコンカラー */
  iconColor: text("icon_color").notNull(),
  /** 年齢制限開始 */
  ageFrom: integer("age_from"),
  /** 年齢制限終了 */
  ageTo: integer("age_to"),
  /** 月指定開始月 */
  monthFrom: integer("month_from"),
  /** 月指定終了月 */
  monthTo: integer("month_to"),
  /** 依頼者氏名（任意の名前を設定可能） */
  client: text("client").notNull().default(""),
  /** 依頼詳細 */
  requestDetail: text("request_detail").notNull().default(""),
  /** タイムスタンプ */
  ...timestamps,
})
export type QuestSelect = typeof quests.$inferSelect
export type QuestInsert = Omit<typeof quests.$inferInsert, "id" | "createdAt" | "updatedAt">
export type QuestUpdate = Omit<Partial<QuestInsert>, "type">
export const questColumns = getTableColumns(quests)
export const QuestColumnSchema = z.enum(
  Object.keys(questColumns) as [keyof typeof questColumns, ...(keyof typeof questColumns)[]]
)
export type QuestColumn = z.infer<typeof QuestColumnSchema>
export type QuestSort = {column: QuestColumn, order: SortOrder}


/** ファミリークエストテーブル */
export const familyQuests = pgTable("family_quests", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** クエストID */
  questId: uuid("quest_id").notNull().unique().references(() => quests.id, { onDelete: "restrict" }),
  /** 家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "restrict" }),
  /** タイムスタンプ */
  ...timestamps,
})
export type FamilyQuestSelect = typeof familyQuests.$inferSelect
export type FamilyQuestInsert = Omit<typeof familyQuests.$inferInsert, "id" | "createdAt" | "updatedAt">
export type FamilyQuestUpdate = Omit<Partial<FamilyQuestInsert>, "questId">


/** クエスト詳細テーブル */
export const questDetails = pgTable("quest_details", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** クエストID */
  questId: uuid("quest_id").notNull().references(() => quests.id, { onDelete: "restrict" }),
  /** レベル */
  level: integer("level").notNull().default(1),
  /** 成功条件 */
  successCondition: text("success_condition").notNull().default(""),
  /** 必要達成回数 */
  requiredCompletionCount: integer("required_completion_count").notNull().default(1),
  /** 報酬 */
  reward: integer("reward").notNull().default(0),
  /** 獲得経験値 */
  childExp: integer("child_exp").notNull().default(0),
  /** 次レベルに必要なクリア回数 */
  requiredClearCount: integer("required_clear_count"),
  /** タイムスタンプ */
  ...timestamps,
}, (table) => [
  sql`PRIMARY KEY (${table.id}, ${table.questId}, ${table.level})`,
])
export type QuestDetailSelect = typeof questDetails.$inferSelect
export type QuestDetailInsert = Omit<typeof questDetails.$inferInsert, "id" | "createdAt" | "updatedAt">

/** クエストタグテーブル */
export const questTags = pgTable("quest_tags", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** クエストタグ名 */
  name: text("name").notNull().default(""),
  /** クエストID */
  questId: uuid("quest_id").notNull().references(() => quests.id, { onDelete: "restrict" }),
  /** タイムスタンプ */
  ...timestamps,
}, (table) => [
  sql`PRIMARY KEY (${table.id}, ${table.name}, ${table.questId})`,
])
export type QuestTagSelect = typeof questTags.$inferSelect
export type QuestTagInsert = Omit<typeof questTags.$inferInsert, "id" | "createdAt" | "updatedAt">

/** クエスト子供テーブル */
export const questChildren = pgTable("quest_children", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** ファミリークエストID */
  familyQuestId: uuid("family_quest_id").notNull().references(() => familyQuests.id, { onDelete: "restrict" }),
  /** 子供ID */
  childId: uuid("child_id").notNull().references(() => children.id, { onDelete: "restrict" }),
  /** 現在のレベル */
  level: integer("level").notNull().default(1),
  /** ステータス */
  status: childQuestStatus("status").notNull().default("not_started"),
  /** 子供の申請メッセージ（申請時のメッセージ用カラム） */
  requestMessage: text("request_message"),
  /** 最後に承認/却下した親のプロフィールID */
  lastApprovedBy: uuid("last_approved_by").references(() => profiles.id, { onDelete: "set null" }),
  /** 現在の達成回数 */
  currentCompletionCount: integer("current_completion_count").notNull().default(0),
  /** 現在のクリア回数 */
  currentClearCount: integer("current_clear_count").notNull().default(0),
  /** 有効フラグ */
  isActivate: boolean("is_activate").notNull().default(true),
  /** ステータス更新日時 */
  statusUpdatedAt: timestamp("status_updated_at", { withTimezone: true, mode: "string" }),
  /** タイムスタンプ */
  ...timestamps,
})
export type QuestChildrenSelect = typeof questChildren.$inferSelect
export type QuestChildrenInsert = Omit<typeof questChildren.$inferInsert, "id" | "createdAt" | "updatedAt">
export type QuestChildrenUpdate = Omit<Partial<QuestChildrenInsert>, "familyQuestId" | "childId" | "statusUpdatedAt">

/** テンプレートクエストテーブル */
export const templateQuests = pgTable("template_quests", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** クエストID */
  questId: uuid("quest_id").notNull().unique().references(() => quests.id, { onDelete: "restrict" }),
  /** 保存元の共有クエストID */
  publicQuestId: uuid("public_quest_id").references(() => publicQuests.id, { onDelete: "restrict" }), 
  /** 保存した家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "restrict" }),
  /** タイムスタンプ */
  ...timestamps,
})
export type TemplateQuestSelect = typeof templateQuests.$inferSelect
export type TemplateQuestInsert = Omit<typeof templateQuests.$inferInsert, "id" | "createdAt" | "updatedAt">
export type TemplateQuestUpdate = Partial<TemplateQuestInsert>

/** 公開クエストテーブル */
export const publicQuests = pgTable("public_quests", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** クエストID */
  questId: uuid("quest_id").notNull().unique().references(() => quests.id, { onDelete: "restrict" }),
  /** 共有元の家族クエストID */
  familyQuestId: uuid("family_quest_id").notNull().references(() => familyQuests.id, { onDelete: "no action" }),
  /** 共有元の家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "restrict" }),
  /** ピン留めコメントID */
  // TODO: 将来的に実装（コメントテーブル作成後）
  /** 有効フラグ */
  isActivate: boolean("is_activate").notNull().default(false),
  /** タイムスタンプ */
  ...timestamps,
})
export type PublicQuestSelect = typeof publicQuests.$inferSelect
export type PublicQuestInsert = Omit<typeof publicQuests.$inferInsert, "id" | "createdAt" | "updatedAt">
export type PublicQuestUpdate = Partial<PublicQuestInsert>

/** 通知テーブル */
export const notifications = pgTable("notifications", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 通知者 */
  recipientProfileId: uuid("recipient_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  /** 遷移先URL */
  url: text("url").notNull().default(""),
  /** 通知タイプ */
  type: notificationType("type").notNull().default("other"),
  /** 通知メッセージ */
  message: text("message").notNull().default(""),
  /** 既読フラグ */
  isRead: boolean("is_read").notNull().default(false),
  /** 既読日時 */
  readAt: timestamp("read_at", { withTimezone: true, mode: "string" }),
  /** タイムスタンプ */
  ...timestamps,
})
export type NotificationSelect = typeof notifications.$inferSelect
export type NotificationInsert = Omit<typeof notifications.$inferInsert, "id" | "createdAt" | "updatedAt">
export type NotificationUpdate = Partial<NotificationInsert>

/** 報酬履歴テーブル */
export const rewardHistories = pgTable("reward_histories", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 子供ID */
  childId: uuid("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  /** 報酬タイプ */
  type: rewardType("type").notNull(),
  /** タイトル（〇〇クエスト達成など） */
  title: text("title").notNull().default(""),
  /** 報酬額 */
  amount: integer("amount").notNull(),
  /** 経験値 */
  exp: integer("exp").notNull().default(0),
  /** 報酬付与日時 */
  rewardedAt: timestamp("rewarded_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  /** 支払い予定日（年齢別報酬などで使用） */
  scheduledPaymentDate: date("scheduled_payment_date"),
  /** 支払い済みフラグ */
  isPaid: boolean("is_paid").notNull().default(false),
  /** 支払い日時 */
  paidAt: timestamp("paid_at", { withTimezone: true, mode: "string" }),
  /** 関連URL */
  url: text("url"),
  /** タイムスタンプ */
  ...timestamps,
})
export type RewardHistorySelect = typeof rewardHistories.$inferSelect
export type RewardHistoryInsert = Omit<typeof rewardHistories.$inferInsert, "id" | "createdAt" | "updatedAt">
export type RewardHistoryUpdate = Partial<RewardHistoryInsert>

/** コメント共通カラム */
const commentCommonColumns = {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** プロフィールID */
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  /** コメント内容 */
  content: text("content").notNull().default(""),
  /** タイムスタンプ */
  ...timestamps,
}

/** 公開クエストコメントテーブル */
export const publicQuestComments = pgTable("public_quest_comments", {
  /** 公開クエストID */
  publicQuestId: uuid("public_quest_id").notNull().references(() => publicQuests.id, { onDelete: "cascade" }),
  /** ピン留めフラグ */
  isPinned: boolean("is_pinned").notNull().default(false),
  /** 公開者ユーザがコメントにいいねするフラグ */
  isLikedByPublisher: boolean("is_liked_by_publisher").notNull().default(false),
  /** コメント共通カラム */
  ...commentCommonColumns,
}, (table) => [
  sql`UNIQUE (${table.publicQuestId}) WHERE ${table.isPinned} = true`,
])


/** コメントいいねエンティティ */
export const commentLikes = pgTable("comment_likes", {
  /** コメントID */
  commentId: uuid("comment_id").notNull(),
  /** プロフィールID */
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  /** タイムスタンプ */
  ...timestamps,
}, (table) => [
  sql`PRIMARY KEY (${table.commentId}, ${table.profileId})`,
])

/** コメント報告テーブル */
export const commentReports = pgTable("comment_reports", {
  /** コメントID */
  commentId: uuid("comment_id").notNull(),
  /** プロフィールID */
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  /** 理由 */
  reason: text("reason").notNull().default(""),
  /** タイムスタンプ */
  ...timestamps,
}, (table) => [
  sql`PRIMARY KEY (${table.commentId}, ${table.profileId})`,
])

/** コメント評価タイプ（Enum） */
export const commentUpvoteType = pgEnum("comment_upvote_type", [
  "upvote",
  "downvote",
])

/** コメント評価テーブル（高評価／低評価） */
export const commentUpvotes = pgTable("comment_upvotes", {
  /** コメントID */
  commentId: uuid("comment_id").notNull(),
  /** プロフィールID */
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  /** タイプ */
  type: commentUpvoteType("type").notNull(),
  /** タイムスタンプ */
  ...timestamps,
}, (table) => [
  sql`PRIMARY KEY (${table.commentId}, ${table.profileId})`,
])

/** タイムライン共通フィールド */
export const timelineCommonFields = {
  /** 表示メッセージ */
  message: text("message").notNull().default(""),
  /** URL */
  url: text("url"), // nullの場合は、表示のみのタイムライン
}

/** 家族タイムラインテーブル */
export const familyTimelines = pgTable("family_timeline", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
  /** アクションタイプ */
  type: familyTimelineActionType("type").notNull(),
  /** 対象ユーザのプロフィールID */
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  /** タイムライン共通フィールド */
  ...timelineCommonFields,
  /** タイムスタンプ */
  ...timestamps,
})
export type FamilyTimelineSelect = typeof familyTimelines.$inferSelect
export type FamilyTimelineInsert = Omit<typeof familyTimelines.$inferInsert, "id" | "createdAt" | "updatedAt">
export type FamilyTimelineUpdate = Partial<FamilyTimelineInsert>

/** 公開タイムラインテーブル */
export const publicTimelines = pgTable("public_timeline", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
  /** アクションタイプ */
  type: publicTimelineActionType("type").notNull(),
  /** タイムライン共通フィールド */
  ...timelineCommonFields,
  /** タイムスタンプ */
  ...timestamps,
})
export type PublicTimelineSelect = typeof publicTimelines.$inferSelect
export type PublicTimelineInsert = Omit<typeof publicTimelines.$inferInsert, "id" | "createdAt" | "updatedAt">
export type PublicTimelineUpdate = Partial<PublicTimelineInsert>

/** お小遣いテーブルタイプ */
export const ageRewardTableType = pgEnum("age_reward_table_type", [
  "template",
  "public",
  "family",
  "child"
])

/** 年齢別お小遣い額（idと年齢で一意） */
export const rewardByAges = pgTable("reward_by_ages", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** お小遣いテーブルタイプ */
  type: ageRewardTableType("type").notNull().default("template"),
  /** お小遣いテーブルID（外部参照先テーブルはtypeによって決まる） */
  ageRewardTableId: uuid("age_reward_table_id").notNull(),
  /** 年齢 */
  age: integer("age").notNull(),
  /** お小遣い額 */
  amount: integer("amount").notNull(),
}, (table) => [
  sql`UNIQUE (${table.type}, ${table.ageRewardTableId}, ${table.age})`,
])
export type RewardByAgeSelect = typeof rewardByAges.$inferSelect
export type RewardByAgeInsert = Omit<typeof rewardByAges.$inferInsert, "id">

/** お小遣いテーブル（家族）  */
export const familyAgeRewardTables = pgTable("family_age_reward_tables", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
  /** タイムスタンプ */
  ...timestamps,
})
export type FamilyAgeRewardTableSelect = typeof familyAgeRewardTables.$inferSelect
export type FamilyAgeRewardTableInsert = Omit<typeof familyAgeRewardTables.$inferInsert, "id" | "createdAt" | "updatedAt">

/** お小遣いテーブル（オンライン） */
export const publicAgeRewardTables = pgTable("public_age_reward_tables", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 家族お小遣いテーブルID */
  familyAgeRewardTableId: uuid("family_age_reward_table_id").notNull().references(() => familyAgeRewardTables.id, { onDelete: "cascade" }),
  /** 共有元の家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "restrict" }),
  /** 有効フラグ */
  isActivate: boolean("is_activate").notNull().default(false),
  /** タイムスタンプ */
  ...timestamps,
}) 
export type PublicAgeRewardTableSelect = typeof publicAgeRewardTables.$inferSelect
export type PublicAgeRewardTableInsert = Omit<typeof publicAgeRewardTables.$inferInsert, "id" | "createdAt" | "updatedAt">

/** お小遣いテーブル（子供） */
export const childAgeRewardTables = pgTable("child_age_reward_tables", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 子供ID */
  childId: uuid("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  /** タイムスタンプ */
  ...timestamps,
})
export type ChildAgeRewardTableSelect = typeof childAgeRewardTables.$inferSelect
export type ChildAgeRewardTableInsert = Omit<typeof childAgeRewardTables.$inferInsert, "id" | "createdAt" | "updatedAt">

/** お小遣いテーブル（テンプレート） */
export const templateAgeRewardTables = pgTable("template_age_reward_tables", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 保存元の共有お小遣いテーブルID */
  publicAgeRewardTableId: uuid("public_age_reward_table_id").notNull().references(() => publicAgeRewardTables.id, { onDelete: "restrict" }),
  /** 保存した家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "restrict" }),
  /** タイムスタンプ */
  ...timestamps,
})
export type TemplateAgeRewardTableSelect = typeof templateAgeRewardTables.$inferSelect
export type TemplateAgeRewardTableInsert = Omit<typeof templateAgeRewardTables.$inferInsert, "id" | "createdAt" | "updatedAt">

/** レベルテーブルタイプ */
export const levelRewardTableType = pgEnum("level_reward_table_type", [
  "template",
  "public",
  "family",
  "child"
])

/** レベル別お小遣い額 */
export const rewardByLevels = pgTable("reward_by_levels", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** レベルテーブルタイプ */
  type: levelRewardTableType("type").notNull().default("template"),
  /** レベルテーブルID（外部参照先テーブルはtypeによって決まる） */
  levelRewardTableId: uuid("level_reward_table_id").notNull(),
  /** レベル */
  level: integer("level").notNull(),
  /** 報酬 */
  amount: integer("amount").notNull(),
} , (table) => [
  sql`UNIQUE (${table.type}, ${table.levelRewardTableId}, ${table.level})`,
])
export type RewardByLevelSelect = typeof rewardByLevels.$inferSelect
export type RewardByLevelInsert = Omit<typeof rewardByLevels.$inferInsert, "id">

/** レベルテーブル（家族）  */
export const familyLevelRewardTables = pgTable("family_level_reward_tables", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
  /** タイムスタンプ */
  ...timestamps,
})
export type FamilyLevelRewardTableSelect = typeof familyLevelRewardTables.$inferSelect
export type FamilyLevelRewardTableInsert = Omit<typeof familyLevelRewardTables.$inferInsert, "id" | "createdAt" | "updatedAt">

/** レベルテーブル（オンライン） */
export const publicLevelRewardTables = pgTable("public_level_reward_tables", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 家族レベルテーブルID */
  familyLevelRewardTableId: uuid("family_level_reward_table_id").notNull().references(() => familyLevelRewardTables.id, { onDelete: "cascade" }),
  /** 共有元の家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "restrict" }),
  /** 有効フラグ */
  isActivate: boolean("is_activate").notNull().default(false),
  /** タイムスタンプ */
  ...timestamps,
})
export type PublicLevelRewardTableSelect = typeof publicLevelRewardTables.$inferSelect
export type PublicLevelRewardTableInsert = Omit<typeof publicLevelRewardTables.$inferInsert, "id" | "createdAt" | "updatedAt">

/** レベルテーブル（子供） */
export const childLevelRewardTables = pgTable("child_level_reward_tables", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 子供ID */
  childId: uuid("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  /** タイムスタンプ */
  ...timestamps,
})
export type ChildLevelRewardTableSelect = typeof childLevelRewardTables.$inferSelect
export type ChildLevelRewardTableInsert = Omit<typeof childLevelRewardTables.$inferInsert, "id" | "createdAt" | "updatedAt">

/** レベルテーブル（テンプレート） */
export const templateLevelRewardTables = pgTable("template_level_reward_tables", {
  /** ID */
  id: uuid("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  /** 保存元の共有レベルテーブルID */
  publicLevelRewardTableId: uuid("public_level_reward_table_id").notNull().references(() => publicLevelRewardTables.id, { onDelete: "restrict" }),
  /** 保存した家族ID */
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "restrict" }),
  /** タイムスタンプ */
  ...timestamps,
})
export type TemplateLevelRewardTableSelect = typeof templateLevelRewardTables.$inferSelect
export type TemplateLevelRewardTableInsert = Omit<typeof templateLevelRewardTables.$inferInsert, "id" | "createdAt" | "updatedAt">

/** フォローテーブル */
export const follows = pgTable("follows", {
  /** フォロー元の家族ID */
  followerFamilyId: uuid("follower_family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
  /** フォロー先の家族ID */
  followFamilyId: uuid("follow_family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
  /** タイムスタンプ */
  ...timestamps,
}, (table) => [
  sql`PRIMARY KEY (${table.followerFamilyId}, ${table.followFamilyId})`,
])
export type FollowSelect = typeof follows.$inferSelect
export type FollowInsert = Omit<typeof follows.$inferInsert, "createdAt" | "updatedAt">
