# ログイン画面 フロー図

**最終更新:** 2026年3月記載

## 全体フロー

```
初回アクセス
    ↓
page.tsx: ログイン状態確認
    ↓
    ├─ [ログイン済み] → クエスト画面へリダイレクト
    └─ [未ログイン] → LoginScreen表示
              ↓
        ユーザー入力（email, password, rememberMe）
              ↓
        「ログイン」ボタンクリック
              ↓
        useLogin.login実行
              ↓
        Supabase認証
              ↓
        ├─ [失敗] → トーストエラー表示
        └─ [成功] → currentUserクエリ無効化
                  ↓
            getLoginUserでユーザー情報取得
                  ↓
                  ├─ [userInfo存在] → ホーム画面へ遷移
                  └─ [userInfo不在] → LoginTypeSelectPopupを開く
                              ↓
                        タイプ選択画面表示
                              ↓
                              ├─ [新規家族作成] → 新規家族作成画面へ遷移
                              ├─ [親として参加] → 親招待コード入力 → useJoinAsParent → ユーザー情報再取得 → ホーム画面へ遷移
                              └─ [子として参加] → 子招待コード入力 → useJoinAsChild → ユーザー情報再取得 → ホーム画面へ遷移
```

## 初回アクセスフロー

### page.tsx処理
```
1. checkIsLoggedInでログイン状態確認
2. ログイン済み → redirect(クエスト画面URL)
3. 未ログイン → <LoginScreen />表示
```

### セッションストレージクリア
```
LoginScreen初回レンダリング時
    ↓
useEffect(() => {
  sessionStorage.clear()
}, [])
```

## ログイン処理フロー

### 基本フロー
```
1. ユーザーがフォーム入力
   - email: メールアドレス
   - password: パスワード
   - rememberMe: ログイン状態保持（チェックボックス）

2. 「ログイン」ボタンクリック
   ↓
3. handleSubmit実行
   ↓
4. useLogin.login(form)呼び出し
   ↓
5. createClient(form.rememberMe).auth.signInWithPassword({
     email: form.email,
     password: form.password
   })

6. 認証結果
   ├─ [エラー] → toast.error("ログインに失敗しました。")
   └─ [成功] → queryClient.invalidateQueries({ queryKey: ["currentUser"] })
             ↓
         getLoginUser()でユーザー情報取得
             ↓
         onSuccess(userInfo)コールバック実行
```

### onSuccessコールバック処理
```
onSuccess: (userInfo) => {
  if (!userInfo) {
    openPopup() // LoginTypeSelectPopupを開く
  } else {
    router.push(HOME_URL) // ホーム画面へ遷移
  }
}
```

## 初回ログイン（タイプ選択）フロー

### LoginTypeSelectPopupの起動
```
1. ポップアップが開く（opened=trueになる）
   ↓
2. useEffect実行
   - refetch(): ユーザー情報を再取得
   - 全ての状態をリセット
     - parentInviteCode = ""
     - parentInviteCodeError = ""
     - childInviteCode = ""
     - childInviteCodeError = ""
```

### 表示分岐
```
userInfo?.families?.id
    ↓
    ├─ [存在する] → 家族登録済み画面
    │                ├─ 家族名表示
    │                ├─ 「親でログイン」ボタン
    │                └─ 「子でログイン」ボタン
    └─ [存在しない] → 初回登録画面
                       ├─ 「家族を作成する」ボタン
                       ├─ 親招待コード入力 + 「親として家族に参加する」ボタン
                       └─ 子招待コード入力 + 「子として家族に参加する」ボタン
```

### 各選択肢のフロー

#### 1. 新規家族作成（親）
```
「家族を作成する」ボタンクリック
    ↓
router.push(FAMILY_NEW_URL)
    ↓
新規家族作成画面へ遷移
```

#### 2. 親として既存家族に参加
```
1. 親招待コード入力
2. 「親として家族に参加する」ボタンクリック
   ↓
3. handleJoinAsParent({inviteCode: parentInviteCode})
   ↓
4. API呼び出し（親として家族に参加）
   ↓
   ├─ [エラー] → setParentInviteCodeError(エラーメッセージ)
   └─ [成功] → refetch() // ユーザー情報再取得
             ↓
         ポップアップのuseEffectが再実行され、
         userInfo?.families?.id が存在するようになる
             ↓
         「親でログイン」ボタンクリック → router.push(FAMILY_QUESTS_URL)
         または
         ポップアップを閉じて、再度ログイン処理 → ホーム画面へ遷移
```

#### 3. 子として既存家族に参加
```
1. 子招待コード入力
2. 「子として家族に参加する」ボタンクリック
   ↓
3. handleJoinAsChild({inviteCode: childInviteCode})
   ↓
4. API呼び出し（子として家族に参加）
   ↓
   ├─ [エラー] → setChildInviteCodeError(エラーメッセージ)
   └─ [成功] → refetch() // ユーザー情報再取得
             ↓
         ポップアップのuseEffectが再実行され、
         userInfo?.families?.id が存在するようになる
             ↓
         「子でログイン」ボタンクリック → （実装待ち）
         または
         ポップアップを閉じて、再度ログイン処理 → ホーム画面へ遷移
```

## リダイレクト先

### 画面URL
- `LOGIN_URL`: `/login` - ログイン画面
- `HOME_URL`: `/` - ホーム画面（ログイン後のデフォルト遷移先）
- `FAMILY_NEW_URL`: `/families/new` - 新規家族作成画面
- `FAMILY_QUESTS_URL`: `/quests/family` - 家族クエスト一覧画面
- `SIGNUP_URL`: `/signup` - サインアップ画面
- `FORGOT_PASSWORD_URL`: `/forgot-password` - パスワード忘れ画面
- `QUESTS_URL`: `/quests` - クエスト画面（ログイン済みの場合のリダイレクト先）

## 状態管理

### React Query
- **currentUser**: ログインユーザー情報のキャッシュ
- **invalidateQueries**: ログイン成功時にキャッシュを無効化

### ローカル状態
- **popupOpened**: LoginTypeSelectPopupの表示状態
- **isLoading**: ログイン処理中フラグ
- **parentInviteCode**: 親招待コード
- **parentInviteCodeError**: 親招待コードのエラーメッセージ
- **childInviteCode**: 子招待コード
- **childInviteCodeError**: 子招待コードのエラーメッセージ

## エラーハンドリング

### ログインエラー
```
Supabase認証失敗
    ↓
toast.error("ログインに失敗しました。")
```

### 招待コードエラー
```
親/子として参加失敗
    ↓
setParentInviteCodeError(エラーメッセージ)
または
setChildInviteCodeError(エラーメッセージ)
    ↓
Input.Wrapperのerrorプロパティに表示
```

### 入力値変更時のエラークリア
```
onChange={(e) => {
  setValue(e.currentTarget.value)
  setError("") // エラーをクリア
}}
```
