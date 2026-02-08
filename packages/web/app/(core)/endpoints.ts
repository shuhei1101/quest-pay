
// ドメインURL
export const APP_DOMAIN = process.env.APP_DOMAIN || `http://localhost:3000`

// ルートURL
export const ROOT_URL = `/`

// ホーム
export const HOME_URL = `/home`

// 権限エラー画面
export const ERROR_URL = `/error`
export const AUTH_ERROR_URL = `${ERROR_URL}/unauthorized`

// ログイン
export const LOGIN_URL = `/login`

// パスワードリセット
export const PASSWORD_URL = `/password`
export const FORGOT_PASSWORD_URL = `${PASSWORD_URL}/forgot`
export const RESET_PASSWORD_URL = `${PASSWORD_URL}/reset`

// サインアップ
export const SIGNUP_URL = `/signup`

// メール確認待ち画面
export const VERIFY_EMAIL_URL = `${SIGNUP_URL}/verify-email`

// クエスト
export const QUESTS_URL = `/quests`
export const QUESTS_NEW_URL = `${QUESTS_URL}/new`
export const QUEST_URL =(questId: string) => `${QUESTS_URL}/${questId}`
export const QUESTS_API_URL = `/api${QUESTS_URL}`
export const QUEST_API_URL = (questId: string) => `${QUESTS_API_URL}/${questId}`

// クエストカテゴリ
export const QUEST_CATEGORIES_URL = `${QUESTS_API_URL}/category`

// 家族クエスト
export const FAMILY_QUESTS_URL = `${QUESTS_URL}/family`
export const FAMILY_QUEST_EDIT_URL = (familyQuestId: string) => `${FAMILY_QUESTS_URL}/${familyQuestId}`
export const FAMILY_QUEST_VIEW_URL = (familyQuestId: string) => `${FAMILY_QUEST_EDIT_URL(familyQuestId)}/view`
export const FAMILY_QUEST_NEW_URL = `${FAMILY_QUESTS_URL}/new`
export const FAMILY_QUESTS_API_URL = `${QUESTS_API_URL}/family`
export const FAMILY_QUEST_API_URL = (familyQuestId: string) => `${FAMILY_QUESTS_API_URL}/${familyQuestId}`
export const FAMILY_QUEST_PUBLISH_API_URL = (familyQuestId: string) => `${FAMILY_QUEST_API_URL(familyQuestId)}/publish`

// 完了報告
export const REVIEW_REQUEST_API_URL = (familyQuestId: string) => `${FAMILY_QUEST_API_URL(familyQuestId)}/review-request`

// 完了報告キャンセル
export const CANCEL_REVIEW_API_URL = (familyQuestId: string) => `${FAMILY_QUEST_API_URL(familyQuestId)}/cancel-review`

// 報告却下
export const REJECT_REPORT_API_URL = (familyQuestId: string, childId: string) => `${FAMILY_QUEST_API_URL(familyQuestId)}/child/${childId}/reject`

// 報告受領
export const APPROVE_REPORT_API_URL = (familyQuestId: string, childId: string) => `${FAMILY_QUEST_API_URL(familyQuestId)}/child/${childId}/approve`

// 公開クエスト
export const PUBLIC_QUESTS_URL = `${QUESTS_URL}/public`
export const PUBLIC_QUEST_EDIT_URL = (publicQuestId: string) => `${PUBLIC_QUESTS_URL}/${publicQuestId}`
export const PUBLIC_QUEST_VIEW_URL = (publicQuestId: string) => `${PUBLIC_QUEST_EDIT_URL(publicQuestId)}/view`
export const PUBLIC_QUEST_URL = (publicQuestId: string) => `${PUBLIC_QUEST_VIEW_URL(publicQuestId)}`
export const PUBLIC_QUESTS_API_URL = `${QUESTS_API_URL}/public`
export const PUBLIC_QUEST_API_URL = (publicQuestId: string) => `${PUBLIC_QUESTS_API_URL}/${publicQuestId}`
// 有効化・無効化API
export const PUBLIC_QUEST_ACTIVATE_API_URL = (publicQuestId: string) => `${PUBLIC_QUEST_API_URL(publicQuestId)}/activate`
export const PUBLIC_QUEST_DEACTIVATE_API_URL = (publicQuestId: string) => `${PUBLIC_QUEST_API_URL(publicQuestId)}/deactivate`
// いいね、いいね解除API
export const PUBLIC_QUEST_LIKE_API_URL = (publicQuestId: string) => `${PUBLIC_QUEST_API_URL(publicQuestId)}/like`
export const PUBLIC_QUEST_LIKE_CANCEL_API_URL = (publicQuestId: string) => `${PUBLIC_QUEST_LIKE_API_URL(publicQuestId)}/cancel`
// いいね数取得API
export const PUBLIC_QUEST_LIKE_COUNT_API_URL = (publicQuestId: string) => `${PUBLIC_QUEST_LIKE_API_URL(publicQuestId)}/count`
// 家族クエストIDに紐づく公開クエスト取得API
export const PUBLIC_QUEST_BY_FAMILY_QUEST_ID_API_URL = (familyQuestId: string) => `${FAMILY_QUEST_API_URL(familyQuestId)}/public`
// 公開クエストコメント画面
export const PUBLIC_QUEST_COMMENTS_URL = (publicQuestId: string) => `${PUBLIC_QUEST_URL(publicQuestId)}/comments`
// 公開クエストコメントAPI
export const PUBLIC_QUEST_COMMENTS_API_URL = (publicQuestId: string) => `${PUBLIC_QUEST_API_URL(publicQuestId)}/comments`
export const PUBLIC_QUEST_COMMENT_API_URL = (publicQuestId: string, commentId: string) => `${PUBLIC_QUEST_COMMENTS_API_URL(publicQuestId)}/${commentId}`
// コメント数取得API
export const PUBLIC_QUEST_COMMENTS_COUNT_API_URL = (publicQuestId: string) => `${PUBLIC_QUEST_COMMENTS_API_URL(publicQuestId)}/count`
// コメント高評価API
export const PUBLIC_QUEST_COMMENT_UPVOTE_API_URL = (publicQuestId: string, commentId: string) => `${PUBLIC_QUEST_COMMENT_API_URL(publicQuestId, commentId)}/upvote`
// コメント低評価API
export const PUBLIC_QUEST_COMMENT_DOWNVOTE_API_URL = (publicQuestId: string, commentId: string) => `${PUBLIC_QUEST_COMMENT_API_URL(publicQuestId, commentId)}/downvote`
// コメント報告API
export const PUBLIC_QUEST_COMMENT_REPORT_API_URL = (publicQuestId: string, commentId: string) => `${PUBLIC_QUEST_COMMENT_API_URL(publicQuestId, commentId)}/report`
// コメントピン留めAPI
export const PUBLIC_QUEST_COMMENT_PIN_API_URL = (publicQuestId: string, commentId: string) => `${PUBLIC_QUEST_COMMENT_API_URL(publicQuestId, commentId)}/pin`
// コメント公開者いいねAPI
export const PUBLIC_QUEST_COMMENT_PUBLISHER_LIKE_API_URL = (publicQuestId: string, commentId: string) => `${PUBLIC_QUEST_COMMENT_API_URL(publicQuestId, commentId)}/publisher-like`


// テンプレートクエスト
export const TEMPLATE_QUESTS_URL = `${QUESTS_URL}/template`
export const TEMPLATE_QUEST_URL = (templateQuestId: string) => `${TEMPLATE_QUESTS_URL}/${templateQuestId}`
export const TEMPLATE_QUESTS_API_URL = `${QUESTS_API_URL}/template`
export const TEMPLATE_QUEST_API_URL = (templateQuestId: string) => `${TEMPLATE_QUESTS_API_URL}/${templateQuestId}`
// 公開クエストIDからテンプレートクエストを取得するAPI
export const TEMPLATE_QUEST_BY_PUBLIC_QUEST_ID_API_URL = (publicQuestId: string) => `${TEMPLATE_QUESTS_API_URL}/public/${publicQuestId}`


// ゲストクエスト
export const GUEST_QUESTS_URL = `${QUESTS_URL}/guest`


// 家族
export const FAMILIES_URL = `/families`
export const FAMILY_NEW_URL = `${FAMILIES_URL}/new`
export const FAMILY_API_URL = `/api${FAMILIES_URL}`
export const FAMILY_INVITE_API_URL = `${FAMILY_API_URL}/invite`
// 家族メンバー
export const FAMILY_MEMBERS_URL = `${FAMILIES_URL}/members`
// 家族メンバー（親）
export const FAMILIES_MEMBERS_PARENT_URL = `${FAMILY_MEMBERS_URL}/parent`
export const FAMILIES_MEMBERS_PARENT_NEW_URL = `${FAMILIES_MEMBERS_PARENT_URL}/new`
export const FAMILIES_MEMBERS_PARENT_VIEW_URL = (parentId: string) => `${FAMILIES_MEMBERS_PARENT_EDIT_URL(parentId)}/view`
export const FAMILIES_MEMBERS_PARENT_EDIT_URL = (parentId: string) => `${FAMILIES_MEMBERS_PARENT_URL}/${parentId}`

// 家族メンバー（子）
export const FAMILIES_MEMBERS_CHILD_URL = `${FAMILY_MEMBERS_URL}/child`
export const FAMILIES_MEMBERS_CHILD_NEW_URL = `$${FAMILIES_MEMBERS_CHILD_URL}/new`
export const FAMILIES_MEMBERS_CHILD_VIEW_URL = (childId: string) => `${FAMILIES_MEMBERS_CHILD_EDIT_URL(childId)}/view`
export const FAMILIES_MEMBERS_CHILD_EDIT_URL = (childId: string) => `${FAMILIES_MEMBERS_CHILD_URL}/${childId}`

// ユーザ
export const USERS_URL = `/users`
export const USER_NEW_URL = `${USERS_URL}/new`
export const USERS_API_URL = `/api${USERS_URL}`
export const LOGIN_USER_API_URL = `${USERS_API_URL}/login`

// 子供
export const CHILDREN_URL = `/children`
export const CHILD_NEW_URL = `${CHILDREN_URL}/new`
export const CHILD_URL = (childId: string) => `${CHILDREN_URL}/${childId}`
export const CHILDREN_API_URL = `/api${CHILDREN_URL}`
export const CHILD_API_URL = (childId: string) => `${CHILDREN_API_URL}/${childId}`
export const CHILD_JOIN_API_URL = `${CHILDREN_API_URL}/join`

// 子供クエスト
export const CHILD_QUESTS_URL = `${QUESTS_URL}/child`
export const CHILD_QUEST_VIEW_URL = (familyQuestId: string, childId: string) => `${FAMILY_QUEST_VIEW_URL(familyQuestId)}/child/${childId}`
export const CHILD_QUESTS_API_URL = (childId: string) => `${CHILD_API_URL(childId)}/quests`
export const CHILD_QUEST_API_URL = (familyQuestId: string, childId: string) => `${FAMILY_QUEST_API_URL(familyQuestId)}/child/${childId}`

// 親
export const PARENTS_URL = `/parents`
export const PARENT_NEW_URL = `${PARENTS_URL}/new`
export const PARENT_URL = (parentId: string) => `${PARENTS_URL}/${parentId}`
export const PARENTS_API_URL = `/api${PARENTS_URL}`
export const PARENT_API_URL = (parentId: string) => `${PARENTS_API_URL}/${parentId}`

// アイコン
export const ICONS_API_URL = `/api/icons`
// アイコンカテゴリ
export const ICON_CATEGORIES_API_URL = `/api/icons/category`

// 通知
export const NOTIFICATIONS_URL = `/notifications`
export const NOTIFICATION_URL = (notificationId: string) => `${NOTIFICATIONS_URL}/${notificationId}`
export const NOTIFICATIONS_API_URL = `/api${NOTIFICATIONS_URL}`

// プロフィール
export const PROFILE_URL = `/profile`

// 設定
export const SETTINGS_URL = `/settings`

// 報酬設定（定額報酬）
export const REWARD_URL = `/reward`
export const REWARD_VIEW_URL = `${REWARD_URL}/view`
export const REWARD_API_URL = `/api${REWARD_URL}`
// 年齢別報酬テーブル
export const FAMILY_AGE_REWARD_TABLE_API_URL = `${REWARD_API_URL}/by-age/table`
// レベル別報酬テーブル
export const FAMILY_LEVEL_REWARD_TABLE_API_URL = `${REWARD_API_URL}/by-level/table`
