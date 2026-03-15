(2026年3月記載)

# 家族API エンドポイント詳細仕様

## 基本情報

### ベースパス
```
/api/families
```

### 認証
すべてのエンドポイントで認証が必要（`getAuthContext`）

### 共通レスポンスヘッダー
```
Content-Type: application/json
```

---

## 1. 家族一覧取得

### エンドポイント
```http
GET /api/families
```

### 概要
認証ユーザーが所属する家族の一覧を取得する。

### クエリパラメータ
| パラメータ | 型 | 必須 | 説明 | デフォルト |
|-----------|-----|------|------|-----------|
| query | string | × | 検索クエリ（display_id, local_nameで部分一致） | - |
| sort | string | × | ソート対象カラム | "createdAt" |
| order | "asc"/"desc" | × | ソート順 | "desc" |
| limit | number | × | 取得件数 | 50 |
| offset | number | × | オフセット | 0 |

### レスポンス
```typescript
{
  families: Array<{
    id: string
    displayId: string
    localName: string
    onlineName: string | null
    introduction: string
    iconId: number
    iconColor: string
    inviteCode: string
    createdAt: string
    updatedAt: string
    memberCount: number
  }>
  total: number
}
```

### エラー
- `401 Unauthorized`: 認証失敗
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/route.ts`
- Client: `packages/web/app/api/families/client.ts`
- Query Hook: `packages/web/app/api/families/query.ts`

---

## 2. 家族登録

### エンドポイント
```http
POST /api/families
```

### 概要
新規家族と親プロフィールを登録する。

### リクエストボディ
```typescript
{
  form: {
    displayId: string           // 表示ID（一意）
    localName: string           // ローカル名
    onlineName: string | null   // オンライン名
    introduction: string        // 紹介文
    familyIconId: number        // 家族アイコンID
    familyIconColor: string     // 家族アイコンカラー
    parentName: string          // 親名前
    parentBirthday: string      // 親誕生日 (YYYY-MM-DD)
    parentIconId: number        // 親アイコンID
    parentIconColor: string     // 親アイコンカラー
  }
}
```

### バリデーション
- `displayId`: 必須、一意、3-30文字、英数字とハイフン
- `localName`: 必須、1-50文字
- `onlineName`: NULL可、1-50文字
- `introduction`: 0-500文字
- `familyIconId`, `parentIconId`: 必須、正の整数
- `parentName`: 必須、1-50文字
- `parentBirthday`: 必須、有効な日付

### レスポンス
```typescript
{
  // Empty object on success
}
```

### 副作用
- `families`テーブルにレコード作成
- `profiles`テーブルに親レコード作成（type: "parent"）
- `parents`テーブルにレコード作成
- 招待コード自動生成（`generateUniqueInviteCode`）

### エラー
- `400 Bad Request`: バリデーションエラー
- `401 Unauthorized`: 認証失敗
- `409 Conflict`: displayID重複
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/route.ts`
- Service: `packages/web/app/api/families/service.ts` (`registerFamilyAndParent`)
- Invite Service: `packages/web/app/api/families/invite/service.ts`

---

## 3. 家族詳細取得

### エンドポイント
```http
GET /api/families/:id
```

### 概要
指定された家族の詳細情報と所属メンバーを取得する。

### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string (uuid) | 家族ID |

### レスポンス
```typescript
{
  family: {
    id: string
    displayId: string
    localName: string
    onlineName: string | null
    introduction: string
    iconId: number
    iconColor: string
    inviteCode: string
    createdAt: string
    updatedAt: string
  }
  members: Array<{
    id: string                    // profile ID
    userId: string | null
    name: string
    birthday: string | null
    familyId: string
    iconId: number
    iconColor: string
    type: "parent" | "child"
    createdAt: string
    updatedAt: string
    parentInfo?: {                // type="parent"の場合
      id: string
      inviteCode: string
    }
    childInfo?: {                 // type="child"の場合
      id: string
      inviteCode: string
      minSavings: number
      currentSavings: number
      currentLevel: number
      totalExp: number
    }
  }>
}
```

### エラー
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 家族が存在しない
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/[id]/route.ts`
- Service: `packages/web/app/api/families/[id]/service.ts` (`fetchFamilyDetail`)

---

## 4. 家族情報更新

### エンドポイント
```http
PUT /api/families/:id
```

### 概要
家族の基本情報を更新する。親権限が必要。

### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string (uuid) | 家族ID |

### リクエストボディ
```typescript
{
  localName?: string
  onlineName?: string | null
  introduction?: string
  iconId?: number
  iconColor?: string
}
```

### 権限
- 認証ユーザーが当該家族の親であることが必要
- `checkIsParentInFamily`で検証

### レスポンス
```typescript
{
  // Empty object on success
}
```

### エラー
- `400 Bad Request`: バリデーションエラー
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親権限なし
- `404 Not Found`: 家族が存在しない
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/[id]/route.ts`

---

## 5. 家族削除

### エンドポイント
```http
DELETE /api/families/:id
```

### 概要
家族とその関連データを削除する。親権限が必要。

### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string (uuid) | 家族ID |

### 権限
- 認証ユーザーが当該家族の親であることが必要
- `checkIsParentInFamily`で検証

### レスポンス
```typescript
{
  // Empty object on success
}
```

### CASCADE削除対象
- `profiles` (onDelete: cascade)
- `family_quests` (onDelete: restrict → エラー)
- `family_follows` (onDelete: cascade)
- `public_quests` (onDelete: restrict → エラー)

### エラー
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親権限なし
- `404 Not Found`: 家族が存在しない
- `409 Conflict`: 外部キー制約違反（クエスト等が存在）
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/[id]/route.ts`

---

## 6. メンバー一覧取得

### エンドポイント
```http
GET /api/families/:id/members
```

### 概要
指定された家族に所属するメンバー一覧を取得する。

### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string (uuid) | 家族ID |

### クエリパラメータ
| パラメータ | 型 | 必須 | 説明 | デフォルト |
|-----------|-----|------|------|-----------|
| type | "parent"/"child" | × | メンバータイプフィルタ | - |

### レスポンス
```typescript
{
  members: Array<{
    id: string
    userId: string | null
    name: string
    birthday: string | null
    familyId: string
    iconId: number
    iconColor: string
    type: "parent" | "child"
    createdAt: string
    updatedAt: string
    // type="parent"の場合
    parentInfo?: {
      id: string
      inviteCode: string
    }
    // type="child"の場合
    childInfo?: {
      id: string
      inviteCode: string
      minSavings: number
      currentSavings: number
      currentLevel: number
      totalExp: number
    }
  }>
}
```

### エラー
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 家族が存在しない
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/[id]/members/route.ts`

---

## 7. メンバー追加

### エンドポイント
```http
POST /api/families/:id/members
```

### 概要
招待コードを使用してメンバーを追加する。親権限が必要。

### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string (uuid) | 家族ID |

### リクエストボディ
```typescript
{
  inviteCode: string           // 招待コード
  type: "parent" | "child"     // メンバータイプ
  name: string                 // 名前
  birthday: string | null      // 誕生日 (YYYY-MM-DD)
  iconId: number               // アイコンID
  iconColor: string            // アイコンカラー
  // type="child"の場合のみ
  minSavings?: number          // 最低貯金額
}
```

### バリデーション
- `inviteCode`: 必須、有効な招待コード
- `type`: 必須、"parent" or "child"
- `name`: 必須、1-50文字
- `birthday`: NULL可、有効な日付
- `iconId`: 必須、正の整数
- `minSavings`: type="child"の場合0以上

### 権限
- 認証ユーザーが当該家族の親であることが必要

### レスポンス
```typescript
{
  member: {
    id: string
    userId: string | null
    name: string
    birthday: string | null
    familyId: string
    iconId: number
    iconColor: string
    type: "parent" | "child"
    createdAt: string
    updatedAt: string
  }
}
```

### 副作用
- `profiles`テーブルにレコード作成
- `parents`または`children`テーブルにレコード作成
- 招待コードの`inviteCode`を設定

### エラー
- `400 Bad Request`: バリデーションエラー、無効な招待コード
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親権限なし
- `409 Conflict`: 招待コード重複
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/[id]/members/route.ts`

---

## 8. メンバー削除

### エンドポイント
```http
DELETE /api/families/:id/members/:memberId
```

### 概要
指定されたメンバーを削除する。親権限が必要。

### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string (uuid) | 家族ID |
| memberId | string (uuid) | メンバー（profile）ID |

### 権限
- 認証ユーザーが当該家族の親であることが必要
- 自分自身の削除は不可（最後の親は削除不可）

### レスポンス
```typescript
{
  // Empty object on success
}
```

### CASCADE削除対象
- `parents`または`children` (onDelete: restrict)
- `quest_children` (子供の場合、onDelete: restrict → エラー)

### エラー
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親権限なし、自己削除
- `404 Not Found`: メンバーが存在しない
- `409 Conflict`: 外部キー制約違反（クエスト受注中など）
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/[id]/members/[memberId]/route.ts`

---

## 9. 家族フォロー

### エンドポイント
```http
POST /api/families/:id/follow
```

### 概要
指定された家族をフォローする。

### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string (uuid) | フォロー対象の家族ID |

### リクエストボディ
```typescript
{
  // Empty object
}
```

### レスポンス
```typescript
{
  // Empty object on success
}
```

### 副作用
- `family_follows`テーブルにレコード作成
  - `family_id`: フォロー対象の家族ID
  - `follower_family_id`: 認証ユーザーの家族ID

### エラー
- `400 Bad Request`: 自分の家族をフォロー
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 家族が存在しない
- `409 Conflict`: 既にフォロー済み
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/[id]/follow/route.ts`

---

## 10. 家族フォロー解除

### エンドポイント
```http
DELETE /api/families/:id/follow
```

### 概要
指定された家族のフォローを解除する。

### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string (uuid) | フォロー解除対象の家族ID |

### レスポンス
```typescript
{
  // Empty object on success
}
```

### 副作用
- `family_follows`テーブルからレコード削除

### エラー
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: フォロー関係が存在しない
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/[id]/follow/route.ts`

---

## 11. フォロー状態取得

### エンドポイント
```http
GET /api/families/:id/follow/status
```

### 概要
認証ユーザーが指定された家族をフォローしているかを取得する。

### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string (uuid) | 対象の家族ID |

### レスポンス
```typescript
{
  isFollowing: boolean
}
```

### エラー
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 家族が存在しない
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/[id]/follow/status/route.ts`

---

## 12. フォロー数取得

### エンドポイント
```http
GET /api/families/:id/follow/count
```

### 概要
指定された家族のフォロワー数を取得する。

### パスパラメータ
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string (uuid) | 対象の家族ID |

### レスポンス
```typescript
{
  count: number
}
```

### エラー
- `401 Unauthorized`: 認証失敗
- `404 Not Found`: 家族が存在しない
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/[id]/follow/count/route.ts`

---

## 13. 招待コード生成

### エンドポイント
```http
POST /api/families/invite
```

### 概要
新規招待コードを生成する。内部使用（家族作成時など）。

### リクエストボディ
```typescript
{
  type: "parent" | "child"     // 招待対象タイプ
  familyId: string             // 家族ID
}
```

### レスポンス
```typescript
{
  inviteCode: string
}
```

### 副作用
- 一意な6桁の招待コードを生成

### エラー
- `401 Unauthorized`: 認証失敗
- `403 Forbidden`: 親権限なし
- `500 Internal Server Error`: サーバーエラー

### 実装ファイル
- Route: `packages/web/app/api/families/invite/route.ts`
- Service: `packages/web/app/api/families/invite/service.ts` (`generateUniqueInviteCode`)

---

## 共通エラーレスポンス形式

### 400 Bad Request
```typescript
{
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}
```

### 401 Unauthorized
```typescript
{
  message: "認証が必要です"
}
```

### 403 Forbidden
```typescript
{
  message: "権限がありません"
}
```

### 404 Not Found
```typescript
{
  message: "リソースが見つかりません"
}
```

### 409 Conflict
```typescript
{
  message: "制約違反またはリソースの競合"
  detail?: string
}
```

### 500 Internal Server Error
```typescript
{
  message: "サーバーエラーが発生しました"
}
```

---

## React Query フック

### 一覧取得
```typescript
const { data, isLoading } = useQueryFamilies({
  query: "検索語",
  sort: "createdAt",
  order: "desc"
})
```

### 詳細取得
```typescript
const { data, isLoading } = useQueryFamilyDetail(familyId)
```

### 登録
```typescript
const { mutate } = useMutationCreateFamily()
mutate({ form: {...} })
```

### 更新
```typescript
const { mutate } = useMutationUpdateFamily(familyId)
mutate({ localName: "..." })
```

### 削除
```typescript
const { mutate } = useMutationDeleteFamily(familyId)
mutate()
```

### フォロー／解除
```typescript
const { mutate: follow } = useMutationFollowFamily(familyId)
const { mutate: unfollow } = useMutationUnfollowFamily(familyId)
follow()
unfollow()
```

### 実装ファイル
- Query Hooks: `packages/web/app/api/families/query.ts`
- Client Functions: `packages/web/app/api/families/client.ts`
