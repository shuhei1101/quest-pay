(2026年3月記載)

# ログイン・認証 API エンドポイント詳細仕様

## GET /api/users/login

### 概要
ログイン済みユーザーの情報を取得する。初回ログイン判定にも使用。

### 認証
**必須** - Supabase認証後のみアクセス可能

### リクエスト
```
GET /api/users/login
Content-Type: application/json
```

**パラメータ**: なし

### レスポンス

#### 成功時（ユーザー情報あり）
```typescript
{
  userInfo: {
    userId: string
    familyId: string
    parentId: string | null
    childId: string | null
    profiles: {
      id: string
      userId: string
      name: string
      birthday: string | null
      familyId: string
      iconId: number
      iconColor: string
      type: "parent" | "child"
      createdAt: string
      updatedAt: string
    }
    parents?: {
      id: string
      profileId: string
      inviteCode: string
      createdAt: string
      updatedAt: string
    }
    children?: {
      id: string
      profileId: string
      inviteCode: string
      minSavings: number
      currentSavings: number
      currentLevel: number
      totalExp: number
      createdAt: string
      updatedAt: string
    }
    families: {
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
    icons: {
      id: number
      name: string
      categoryId: number | null
      size: number | null
    }
  }
}
```

#### 成功時（初回ログイン）
```typescript
{
  userInfo: null
}
```

#### エラー時
```typescript
{
  error: {
    message: string
    code: string
  }
}
```

### エラーコード
| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| AUTH_ERROR | 401 | 認証エラー（セッション無効） |
| DATABASE_ERROR | 500 | データベースエラー |

### 処理フロー
1. `getAuthContext()` で認証コンテキスト取得
2. `fetchUserInfoByUserId({db, userId})` でユーザー情報取得
3. レスポンス返却

### 使用例
```typescript
import { getLoginUser } from "@/app/api/users/login/client"

const { userInfo } = await getLoginUser()
if (!userInfo) {
  // 初回ログイン → タイプ選択ポップアップ表示
} else {
  // ログイン済み → ホーム画面へ遷移
}
```

---

## POST /api/parents/join

### 概要
招待コードを使用して既存の家族に親として参加する。

### 認証
**必須** - Supabase認証後のみアクセス可能

### リクエスト
```
POST /api/parents/join
Content-Type: application/json
```

```typescript
{
  inviteCode: string  // 家族の招待コード
  name: string        // 親の名前
  birthday?: string   // 生年月日（オプション）
  iconId: number      // アイコンID
  iconColor: string   // アイコンカラー
}
```

#### バリデーション
- `inviteCode`: 必須、文字列
- `name`: 必須、1-50文字
- `birthday`: オプション、日付形式（YYYY-MM-DD）
- `iconId`: 必須、正の整数
- `iconColor`: 必須、カラーコード形式

### レスポンス

#### 成功時
```typescript
{
  success: true
  parentId: string
  familyId: string
}
```

#### エラー時
```typescript
{
  error: {
    message: string
    code: string
  }
}
```

### エラーコード
| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| INVALID_INVITE_CODE | 400 | 招待コードが無効 |
| ALREADY_JOINED | 400 | すでに家族に参加済み |
| DATABASE_ERROR | 500 | データベースエラー |

### 処理フロー
1. 認証コンテキスト取得
2. 招待コードで家族を検索
3. トランザクション開始
4. `profiles` テーブルにレコード作成（type: parent）
5. `parents` テーブルにレコード作成
6. トランザクションコミット
7. レスポンス返却

### データベース操作
```sql
BEGIN TRANSACTION;

-- 家族検索
SELECT * FROM families WHERE invite_code = ?;

-- プロフィール作成
INSERT INTO profiles (user_id, family_id, name, birthday, icon_id, icon_color, type)
VALUES (?, ?, ?, ?, ?, ?, 'parent');

-- 親レコード作成
INSERT INTO parents (profile_id, invite_code)
VALUES (?, ?);

COMMIT;
```

---

## POST /api/children/join

### 概要
招待コードを使用して既存の家族に子として参加する。

### 認証
**必須** - Supabase認証後のみアクセス可能

### リクエスト
```
POST /api/children/join
Content-Type: application/json
```

```typescript
{
  inviteCode: string  // 家族の招待コード
  name: string        // 子の名前
  birthday?: string   // 生年月日（オプション）
  iconId: number      // アイコンID
  iconColor: string   // アイコンカラー
}
```

#### バリデーション
- `inviteCode`: 必須、文字列
- `name`: 必須、1-50文字
- `birthday`: オプション、日付形式（YYYY-MM-DD）
- `iconId`: 必須、正の整数
- `iconColor`: 必須、カラーコード形式

### レスポンス

#### 成功時
```typescript
{
  success: true
  childId: string
  familyId: string
}
```

#### エラー時
```typescript
{
  error: {
    message: string
    code: string
  }
}
```

### エラーコード
| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| INVALID_INVITE_CODE | 400 | 招待コードが無効 |
| ALREADY_JOINED | 400 | すでに家族に参加済み |
| DATABASE_ERROR | 500 | データベースエラー |

### 処理フロー
1. 認証コンテキスト取得
2. 招待コードで家族を検索
3. トランザクション開始
4. `profiles` テーブルにレコード作成（type: child）
5. `children` テーブルにレコード作成（初期レベル1、経験値0）
6. トランザクションコミット
7. レスポンス返却

### データベース操作
```sql
BEGIN TRANSACTION;

-- 家族検索
SELECT * FROM families WHERE invite_code = ?;

-- プロフィール作成
INSERT INTO profiles (user_id, family_id, name, birthday, icon_id, icon_color, type)
VALUES (?, ?, ?, ?, ?, ?, 'child');

-- 子レコード作成
INSERT INTO children (
  profile_id, 
  invite_code, 
  min_savings, 
  current_savings, 
  current_level, 
  total_exp
)
VALUES (?, ?, 0, 0, 1, 0);

COMMIT;
```

---

## Supabase認証エンドポイント（クライアント側）

### auth.signInWithPassword

#### 概要
メールアドレスとパスワードでSupabaseにログインする。

#### 使用方法
```typescript
import { createClient } from "@/app/(core)/_auth/supabase/client"

const supabase = createClient()
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123"
})

if (error) {
  // 認証エラー処理
} else {
  // 認証成功 → GET /api/users/login を呼び出し
}
```

#### レスポンス
```typescript
{
  data: {
    user: {
      id: string
      email: string
      // ... その他のSupabaseユーザー情報
    }
    session: {
      access_token: string
      refresh_token: string
      expires_at: number
      // ...
    }
  } | null
  error: AuthError | null
}
```

---

## auth.signOut

#### 概要
現在のセッションからサインアウトする。

#### 使用方法
```typescript
import { createClient } from "@/app/(core)/_auth/supabase/client"

const supabase = createClient()
const { error } = await supabase.auth.signOut()

if (error) {
  // エラー処理
} else {
  // サインアウト成功 → ログイン画面へリダイレクト
}
```

---

## クライアント側関数

### getLoginUser

**ファイル**: `app/api/users/login/client.ts`

```typescript
export const getLoginUser = async (): Promise<GetLoginUserResponse>
```

**実装**:
- `GET /api/users/login` を呼び出し
- エラー時は `AppError.fromResponse` で例外スロー
- 正常時は `GetLoginUserResponse` 型で返却

---

## React Queryフック

### useLoginUserInfo

**ファイル**: `app/(auth)/login/_hooks/useLoginUserInfo.ts`

```typescript
export const useLoginUserInfo = () => {
  return useQuery({
    queryKey: ["loginUser"],
    queryFn: getLoginUser,
    retry: false,
    staleTime: Infinity
  })
}
```

**使用例**:
```typescript
const { data, isLoading, error } = useLoginUserInfo()

if (isLoading) return <Loading />
if (error) return <Error />
if (!data?.userInfo) return <LoginTypeSelectPopup />

return <Navigate to="/home" />
```

---

## 認証ヘルパー関数

### getAuthContext

**ファイル**: `app/(core)/_auth/withAuth.ts`

```typescript
export const getAuthContext = async (): Promise<{
  db: Db
  userId: string
}> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data.user) {
    throw new AuthError("認証が必要です")
  }
  
  return {
    db,
    userId: data.user.id
  }
}
```

**用途**: API Route内で認証状態を確認し、データベースとユーザーIDを取得

---

## セキュリティ考慮事項

### 認証トークン
- Supabaseのアクセストークンは自動的にHTTP-onlyクッキーに保存
- クライアント側でトークンを直接扱わない

### セッション管理
- セッションの有効期限はSupabaseの設定に従う（デフォルト: 7日間）
- リフレッシュトークンによる自動更新をサポート

### CSRF対策
- Next.js + Supabaseによる組み込みCSRF保護
- Originヘッダーの検証

### エラーハンドリング
- 認証エラーは401 Unauthorizedを返す
- 詳細なエラーメッセージはログのみに記録（クライアントには送信しない）
