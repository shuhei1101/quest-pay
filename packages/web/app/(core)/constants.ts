
// ルートURL
export const ROOT_URL = `/`

// ホーム
export const HOME_URL = `/home`

// 権限エラー画面
export const ERROR_URL = `/error`
export const AUTH_ERROR_URL = `${ERROR_URL}/authorized`

// ログイン
export const LOGIN_URL = `/login`

// クエスト
export const QUESTS_URL = `/quests`
export const QUESTS_NEW_URL = `${QUESTS_URL}/new`
export const QUEST_URL =(questId: string) => `${QUESTS_URL}/${questId}`
export const QUESTS_API_URL = `/api${QUESTS_URL}`
export const QUEST_API_URL = (questId: string) => `${QUESTS_API_URL}/${questId}`

// 家族クエスト
export const FAMILY_QUESTS_URL = `${QUESTS_URL}/family`
export const FAMILY_QUEST_NEW_URL = `${FAMILY_QUESTS_URL}/new`
export const FAMILY_QUEST_URL = (questId: string) => `${FAMILY_QUESTS_URL}/${questId}`
export const FAMILY_QUESTS_API_URL = `${QUESTS_API_URL}/family`
export const FAMILY_QUEST_API_URL = (questId: string) => `${QUEST_API_URL(questId)}/family`

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
export const FAMILIES_MEMBERS_CHILD_NEW_URL = `${FAMILIES_MEMBERS_CHILD_URL}/new`
export const FAMILIES_MEMBERS_CHILD_VIEW_URL = (childId: string) => `${FAMILIES_MEMBERS_CHILD_EDIT_URL(childId)}/view`
export const FAMILIES_MEMBERS_CHILD_EDIT_URL = (childId: string) => `${FAMILIES_MEMBERS_CHILD_URL}/${childId}`

// ユーザ
export const USERS_URL = `/users`
export const USER_NEW_URL = `${USERS_URL}/new`
export const USERS_API_URL = `/api${USERS_URL}`
export const LOGIN_USER_API_URL = `${USERS_API_URL}/login`
export const JOIN_CHILD_API_URL = `${USERS_API_URL}/join/child`

// 子供
export const CHILDREN_URL = `/children`
export const CHILD_NEW_URL = `${CHILDREN_URL}/new`
export const CHILD_URL = (childId: string) => `${CHILDREN_URL}/${childId}`
export const CHILDREN_API_URL = `/api${CHILDREN_URL}`
export const CHILD_API_URL = (childId: string) => `${CHILDREN_API_URL}/${childId}`
// 親
export const PARENTS_URL = `/parents`
export const PARENT_NEW_URL = `${PARENTS_URL}/new`
export const PARENT_URL = (parentId: string) => `${PARENTS_URL}/${parentId}`
export const PARENTS_API_URL = `/api${PARENTS_URL}`
export const PARENT_API_URL = (parentId: string) => `${PARENTS_API_URL}/${parentId}`

// アイコン
export const ICONS_API_URL = `/api/icons`
// アイコン
export const ICON_CATEGORIES_API_URL = `/api/icons/category`
