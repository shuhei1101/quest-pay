# ログイン画面 認証フロー

**最終更新:** 2026年3月記載

## Supabase認証統合

### 認証クライアント作成

**ファイル:** `app/(core)/_supabase/client.ts`（推定）

**rememberMe フラグによる永続化設定:**
```typescript
createClient(rememberMe: boolean)
```

- `rememberMe = true`: 永続セッション（ブラウザを閉じても保持）
- `rememberMe = false`: セッションオンリー（ブラウザを閉じると破棄）

### 認証処理

**ファイル:** `app/(auth)/login/_hooks/useLogin.ts`

**実装:**
```typescript
const mutation = useMutation({
  mutationFn: async (form: LoginFormType) => 
    createClient(form.rememberMe).auth.signInWithPassword({
      email: form.email,
      password: form.password
    }),
  onError: (err) => {
    toast.error("ログインに失敗しました。")
  },
  onSuccess: async () => {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    const { userInfo } = await getLoginUser()
    onSuccess(userInfo)
  }
})
```

**処理フロー:**
1. `signInWithPassword` で Supabase 認証実行
2. 成功時: `currentUser` キャッシュを無効化
3. `getLoginUser()` API でユーザー情報取得
4. `onSuccess` コールバック実行（画面遷移判定）

## セッション管理

### セッションストレージクリア

**タイミング:** LoginScreen 初回レンダリング時

**実装:**
```typescript
useEffect(() => {
  sessionStorage.clear()
}, [])
```

**目的:**
- 前回のセッションデータをクリア
- クエリパラメータエラー情報のリセット
- Access Tokenなどの一時データのクリア

### React Query キャッシュ管理

**ログイン成功時:**
```typescript
queryClient.invalidateQueries({ queryKey: ["currentUser"] })
```

- キャッシュを無効化して再取得を促す
- ログインユーザー情報を最新化

## ユーザー情報取得API

### getLoginUser

**ファイル:** `app/api/users/login/client.ts`

**エンドポイント:** `GET /api/users/login`

**レスポンス:**
```typescript
{
  userInfo: UserInfo | null
}
```

**UserInfo型（推定）:**
```typescript
{
  id: string
  email: string
  families?: {
    id: string
    localName: string
  }
  // その他のユーザー情報
}
```

### ユーザー情報の判定

**家族未登録の判定:**
```typescript
if (!userInfo) {
  openPopup() // タイプ選択ポップアップを開く
}
```

**家族登録済みの判定:**
```typescript
if (userInfo?.families?.id) {
  // 家族名表示 + ロール選択画面
}
```

## 親/子として参加のAPI

### useJoinAsParent

**ファイル:** `app/(auth)/login/_hooks/useJoinAsParent.ts`

**処理:**
```typescript
const { handleJoinAsParent, isLoading: isJoiningAsParent } = useJoinAsParent({
  refetch,                      // ユーザー情報再取得関数
  setParentInviteCodeError     // エラー設定関数
})
```

**API呼び出し:**
- 親招待コードを送信
- 成功時: `refetch()` でユーザー情報を再取得
- エラー時: `setParentInviteCodeError()` でエラー表示

### useJoinAsChild

**ファイル:** `app/(auth)/login/_hooks/useJoinAsChild.ts`

**処理:**
```typescript
const { handleJoinAsChild, isLoading: isJoiningAsChild } = useJoinAsChild({
  refetch,                      // ユーザー情報再取得関数
  setChildInviteCodeError       // エラー設定関数
})
```

**API呼び出し:**
- 子招待コードを送信
- 成功時: `refetch()` でユーザー情報を再取得
- エラー時: `setChildInviteCodeError()` でエラー表示

## ログイン状態確認

### checkIsLoggedIn

**ファイル:** `app/(auth)/login/page.tsx`（推定）

**処理フロー:**
```typescript
// ログイン状態を確認
const isLoggedIn = await checkIsLoggedIn()

if (isLoggedIn) {
  // ログイン済みの場合はクエスト画面へリダイレクト
  redirect(QUESTS_URL)
}

// 未ログインの場合はログイン画面を表示
return <LoginScreen />
```

**実装詳細（推定）:**
- Supabase の `getSession()` または `getUser()` を使用
- セッション有無で判定
- サーバーサイドで実行（Server Component）

## React Query 統合

### useLoginUserInfo

**ファイル:** `app/(auth)/login/_hooks/useLoginUserInfo.ts`

**責務:** ログインユーザー情報の取得と再取得

**提供する値:**
```typescript
{
  userInfo: UserInfo | null     // ユーザー情報
  refetch: () => void            // 再取得関数
}
```

**使用例:**
```typescript
const { userInfo, refetch } = useLoginUserInfo()

// 親/子参加成功後にユーザー情報を再取得
handleJoinAsParent({inviteCode}).then(() => {
  refetch()
})
```

## エラーハンドリング

### 認証エラー

**ケース:**
- メールアドレス/パスワードが間違っている
- アカウントが存在しない
- アカウントがロックされている

**処理:**
```typescript
onError: (err) => {
  toast.error("ログインに失敗しました。")
}
```

### 招待コードエラー

**ケース:**
- 招待コードが無効
- 既に使用済み
- 期限切れ

**処理:**
```typescript
// 親招待コードエラー
setParentInviteCodeError("招待コードが無効です")

// 子招待コードエラー
setChildInviteCodeError("招待コードが無効です")
```

### ネットワークエラー

**処理:**
- React Query の `onError` で捕捉
- `react-hot-toast` でエラートースト表示

## セキュリティ考慮事項

### パスワード保護
- `PasswordInput` コンポーネント使用
- デフォルトでマスク表示
- 表示/非表示トグル機能

### セッション管理
- `rememberMe` フラグでセッション永続化制御
- セッションストレージ初期化でデータ漏洩防止

### HTTPS通信
- Supabase 認証は HTTPS 必須
- トークンは暗号化された通信路で送信

### トークン管理
- Access Token: Supabase が自動管理
- Refresh Token: `rememberMe=true` の場合のみ保存
- セッションストレージ: LoginScreen レンダリング時にクリア
