# API Routes リファレンス
> 2026年3月記載

## 概要

Quest PayアプリケーションのすべてのAPIエンドポイントを網羅的にリスト化したドキュメント。

## 基本構造

### ベースURL
- ローカル開発: `http://localhost:3000`
- 本番: `APP_DOMAIN`環境変数で指定

### API共通パス
- `QUESTS_API_URL`: `/api/quests`
- `FAMILY_API_URL`: `/api/families`
- `CHILDREN_API_URL`: `/api/children`
- `USERS_API_URL`: `/api/users`

## クエスト関連API

### 家族クエスト
| エンドポイント | 関数名 | 説明 |
|--------------|--------|------|
| `/api/quests/family` | `FAMILY_QUESTS_API_URL` | 家族クエスト一覧・作成 |
| `/api/quests/family/:id` | `FAMILY_QUEST_API_URL(id)` | 家族クエスト詳細・更新・削除 |
| `/api/quests/family/:id/publish` | `FAMILY_QUEST_PUBLISH_API_URL(id)` | 公開クエストとして公開 |
| `/api/quests/family/:id/review-request` | `REVIEW_REQUEST_API_URL(id)` | 完了報告 |
| `/api/quests/family/:id/cancel-review` | `CANCEL_REVIEW_API_URL(id)` | 完了報告キャンセル |
| `/api/quests/family/:id/child/:childId/approve` | `APPROVE_REPORT_API_URL(id, childId)` | 報告承認 |
| `/api/quests/family/:id/child/:childId/reject` | `REJECT_REPORT_API_URL(id, childId)` | 報告却下 |
| `/api/quests/family/:id/public` | `PUBLIC_QUEST_BY_FAMILY_QUEST_ID_API_URL(id)` | 家族クエストに紐づく公開クエスト取得 |

### 公開クエスト
| エンドポイント | 関数名 | 説明 |
|--------------|--------|------|
| `/api/quests/public` | `PUBLIC_QUESTS_API_URL` | 公開クエスト一覧・作成 |
| `/api/quests/public/:id` | `PUBLIC_QUEST_API_URL(id)` | 公開クエスト詳細・更新・削除 |
| `/api/quests/public/:id/activate` | `PUBLIC_QUEST_ACTIVATE_API_URL(id)` | 公開クエスト有効化 |
| `/api/quests/public/:id/deactivate` | `PUBLIC_QUEST_DEACTIVATE_API_URL(id)` | 公開クエスト無効化 |
| `/api/quests/public/:id/like` | `PUBLIC_QUEST_LIKE_API_URL(id)` | いいね |
| `/api/quests/public/:id/like/cancel` | `PUBLIC_QUEST_LIKE_CANCEL_API_URL(id)` | いいね解除 |
| `/api/quests/public/:id/like/count` | `PUBLIC_QUEST_LIKE_COUNT_API_URL(id)` | いいね数取得 |

### 公開クエストコメント
| エンドポイント | 関数名 | 説明 |
|--------------|--------|------|
| `/api/quests/public/:id/comments` | `PUBLIC_QUEST_COMMENTS_API_URL(id)` | コメント一覧・投稿 |
| `/api/quests/public/:id/comments/:commentId` | `PUBLIC_QUEST_COMMENT_API_URL(id, commentId)` | コメント詳細・更新・削除 |
| `/api/quests/public/:id/comments/count` | `PUBLIC_QUEST_COMMENTS_COUNT_API_URL(id)` | コメント数取得 |
| `/api/quests/public/:id/comments/:commentId/upvote` | `PUBLIC_QUEST_COMMENT_UPVOTE_API_URL(id, commentId)` | コメント高評価 |
| `/api/quests/public/:id/comments/:commentId/downvote` | `PUBLIC_QUEST_COMMENT_DOWNVOTE_API_URL(id, commentId)` | コメント低評価 |
| `/api/quests/public/:id/comments/:commentId/report` | `PUBLIC_QUEST_COMMENT_REPORT_API_URL(id, commentId)` | コメント報告 |
| `/api/quests/public/:id/comments/:commentId/pin` | `PUBLIC_QUEST_COMMENT_PIN_API_URL(id, commentId)` | コメントピン留め |
| `/api/quests/public/:id/comments/:commentId/publisher-like` | `PUBLIC_QUEST_COMMENT_PUBLISHER_LIKE_API_URL(id, commentId)` | 公開者いいね |

### テンプレートクエスト
| エンドポイント | 関数名 | 説明 |
|--------------|--------|------|
| `/api/quests/template` | `TEMPLATE_QUESTS_API_URL` | テンプレートクエスト一覧・作成 |
| `/api/quests/template/:id` | `TEMPLATE_QUEST_API_URL(id)` | テンプレートクエスト詳細・更新・削除 |
| `/api/quests/template/public/:publicId` | `TEMPLATE_QUEST_BY_PUBLIC_QUEST_ID_API_URL(publicId)` | 公開クエストIDからテンプレート取得 |

### クエストカテゴリ
| エンドポイント | 関数名 | 説明 |
|--------------|--------|------|
| `/api/quests/category` | `QUEST_CATEGORIES_URL` | カテゴリ一覧取得 |

## 家族関連API

### 家族管理
| エンドポイント | 関数名 | 説明 |
|--------------|--------|------|
| `/api/families` | `FAMILY_API_URL` | 家族一覧・作成 |
| `/api/families/:id` | `FAMILY_DETAIL_API_URL(id)` | 家族詳細・更新・削除 |
| `/api/families/invite` | `FAMILY_INVITE_API_URL` | 招待処理 |

### 家族フォロー
| エンドポイント | 関数名 | 説明 |
|--------------|--------|------|
| `/api/families/:id/follow` | `FAMILY_FOLLOW_API_URL(id)` | フォロー・アンフォロー |
| `/api/families/:id/follow/status` | `FAMILY_FOLLOW_STATUS_API_URL(id)` | フォロー状態取得 |
| `/api/families/:id/follow/count` | `FAMILY_FOLLOW_COUNT_API_URL(id)` | フォロー数取得 |

## 子供関連API

| エンドポイント | 関数名 | 説明 |
|--------------|--------|------|
| `/api/children` | `CHILDREN_API_URL` | 子供一覧・作成 |
| `/api/children/:id` | `CHILD_API_URL(id)` | 子供詳細・更新・削除 |
| `/api/children/join` | `CHILD_JOIN_API_URL` | 招待コードで家族参加 |

## ユーザー関連API

| エンドポイント | 関数名 | 説明 |
|--------------|--------|------|
| `/api/users` | `USERS_API_URL` | ユーザー一覧・作成 |
| `/api/users/login` | `LOGIN_USER_API_URL` | ログインユーザー取得 |

## 使用例

```typescript
import { FAMILY_QUEST_API_URL, PUBLIC_QUEST_LIKE_API_URL } from '@/(core)/endpoints'

// 家族クエスト取得
const response = await fetch(FAMILY_QUEST_API_URL('quest-123'))

// 公開クエストにいいね
await fetch(PUBLIC_QUEST_LIKE_API_URL('public-456'), { method: 'POST' })
```
