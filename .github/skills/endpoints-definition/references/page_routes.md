# Page Routes リファレンス
> 2026年3月記載

## 概要

Quest PayアプリケーションのすべてのページURLルートを網羅的にリスト化したドキュメント。

## 認証関連ページ

| URL | 関数名 | 説明 |
|-----|--------|------|
| `/` | `ROOT_URL` | ルートページ |
| `/login` | `LOGIN_URL` | ログイン画面 |
| `/signup` | `SIGNUP_URL` | サインアップ画面 |
| `/signup/verify-email` | `VERIFY_EMAIL_URL` | メール確認待ち画面 |
| `/password` | `PASSWORD_URL` | パスワード関連ページ |
| `/password/forgot` | `FORGOT_PASSWORD_URL` | パスワードリセット要求 |
| `/password/reset` | `RESET_PASSWORD_URL` | パスワードリセット |

## エラーページ

| URL | 関数名 | 説明 |
|-----|--------|------|
| `/error` | `ERROR_URL` | エラー画面 |
| `/error/unauthorized` | `AUTH_ERROR_URL` | 権限エラー画面 |

## メイン画面

| URL | 関数名 | 説明 |
|-----|--------|------|
| `/home` | `HOME_URL` | ホーム画面 |

## クエスト関連ページ

### 家族クエスト
| URL | 関数名 | 説明 |
|-----|--------|------|
| `/quests/family` | `FAMILY_QUESTS_URL` | 家族クエスト一覧 |
| `/quests/family/new` | `FAMILY_QUEST_NEW_URL` | 家族クエスト新規作成 |
| `/quests/family/:id` | `FAMILY_QUEST_EDIT_URL(id)` | 家族クエスト編集 |
| `/quests/family/:id/view` | `FAMILY_QUEST_VIEW_URL(id)` | 家族クエスト閲覧 |

### 公開クエスト
| URL | 関数名 | 説明 |
|-----|--------|------|
| `/quests/public` | `PUBLIC_QUESTS_URL` | 公開クエスト一覧 |
| `/quests/public/:id` | `PUBLIC_QUEST_EDIT_URL(id)` | 公開クエスト編集 |
| `/quests/public/:id/view` | `PUBLIC_QUEST_VIEW_URL(id)` | 公開クエスト閲覧 |
| `/quests/public/:id/view/comments` | `PUBLIC_QUEST_COMMENTS_URL(id)` | コメント一覧・投稿画面 |

### テンプレートクエスト
| URL | 関数名 | 説明 |
|-----|--------|------|
| `/quests/template` | `TEMPLATE_QUESTS_URL` | テンプレートクエスト一覧 |
| `/quests/template/:id` | `TEMPLATE_QUEST_URL(id)` | テンプレートクエスト詳細 |

### ゲストクエスト
| URL | 関数名 | 説明 |
|-----|--------|------|
| `/quests/guest` | `GUEST_QUESTS_URL` | ゲストクエスト一覧 |

## 家族関連ページ

### 家族管理
| URL | 関数名 | 説明 |
|-----|--------|------|
| `/families` | `FAMILIES_URL` | 家族一覧 |
| `/families/new` | `FAMILY_NEW_URL` | 家族新規作成 |
| `/families/:id` | `FAMILY_URL(id)` | 家族編集 |
| `/families/:id/view` | `FAMILY_VIEW_URL(id)` | 家族閲覧 |

### 家族メンバー
| URL | 関数名 | 説明 |
|-----|--------|------|
| `/families/members` | `FAMILY_MEMBERS_URL` | 家族メンバー一覧 |

### 家族メンバー（親）
| URL | 関数名 | 説明 |
|-----|--------|------|
| `/families/members/parent` | `FAMILIES_MEMBERS_PARENT_URL` | 親一覧 |
| `/families/members/parent/new` | `FAMILIES_MEMBERS_PARENT_NEW_URL` | 親新規作成 |
| `/families/members/parent/:id` | `FAMILIES_MEMBERS_PARENT_EDIT_URL(id)` | 親編集 |
| `/families/members/parent/:id/view` | `FAMILIES_MEMBERS_PARENT_VIEW_URL(id)` | 親閲覧 |

### 家族メンバー（子）
| URL | 関数名 | 説明 |
|-----|--------|------|
| `/families/members/child` | `FAMILIES_MEMBERS_CHILD_URL` | 子供一覧 |
| `/families/members/child/new` | `FAMILIES_MEMBERS_CHILD_NEW_URL` | 子供新規作成 |
| `/families/members/child/:id` | `FAMILIES_MEMBERS_CHILD_EDIT_URL(id)` | 子供編集 |
| `/families/members/child/:id/view` | `FAMILIES_MEMBERS_CHILD_VIEW_URL(id)` | 子供閲覧 |

## 子供関連ページ

| URL | 関数名 | 説明 |
|-----|--------|------|
| `/children` | `CHILDREN_URL` | 子供一覧 |
| `/children/new` | `CHILD_NEW_URL` | 子供新規作成 |
| `/children/:id` | `CHILD_URL(id)` | 子供詳細 |
| `/children/:id/reward` | `CHILD_REWARDS_URL(id)` | 子供報酬設定 |

## ユーザー関連ページ

| URL | 関数名 | 説明 |
|-----|--------|------|
| `/users` | `USERS_URL` | ユーザー一覧 |
| `/users/new` | `USER_NEW_URL` | ユーザー新規作成 |

## 使用例

```typescript
import { FAMILY_QUESTS_URL, PUBLIC_QUEST_VIEW_URL } from '@/(core)/endpoints'
import { useRouter } from 'next/navigation'

const router = useRouter()

// 家族クエスト一覧へ遷移
router.push(FAMILY_QUESTS_URL)

// 公開クエスト閲覧画面へ遷移
router.push(PUBLIC_QUEST_VIEW_URL('quest-123'))
```
