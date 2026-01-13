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
  "family_quest_review",
  "other",
])

/** authスキーマ */
const authSchema = pgSchema("auth")

/** auth.usersテーブル */
export const authUsers = authSchema.table("users", {
  /** ID */
  id: uuid("id").primaryKey().notNull(),
})
export type AuthUsersSelect = typeof authUsers.$inferSelect

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
  requiredClearCount: integer("required_clear_count").notNull().default(1),
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
