

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
export const FAMILY_API_URL = `/api/families`
export const FAMILY_INVITE_API_URL = `${FAMILY_API_URL}/invite`

// プロジェクト
export const PROJECTS_URL = `/projects`
export const PROJECT_NEW_URL = `${PROJECTS_URL}/new`
export const PROJECT_API_URL = `${PROJECTS_URL}/api`

// ユーザ
export const USERS_URL = `/users`
export const USER_NEW_URL = `${USERS_URL}/new`
export const USER_API_URL = (userId: string) => `${USERS_URL}/${userId}`
export const USER_LOGIN_API_URL = `${USER_API_URL}/login`
// ユーザ（子供ID）
export const USERS_CHILD_URL = (childId: string) => `${USERS_URL}/child/${childId}`



// 子供
export const CHILDREN_URL = `/children`
export const CHILD_NEW_URL = `${CHILDREN_URL}/new`
export const CHILD_URL = (childId: string) => `${CHILDREN_URL}/${childId}`
export const CHILDREN_API_URL = `/api${CHILDREN_URL}`
export const CHILD_API_URL = (childId: string) => `${CHILDREN_API_URL}/${childId}`
