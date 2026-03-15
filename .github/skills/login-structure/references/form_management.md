# ログイン画面 フォーム管理

**最終更新:** 2026年3月記載

## フォームスキーマ定義

### ファイル
`app/(auth)/login/form.ts`

### LoginFormType
```typescript
{
  email: string          // メールアドレス（必須）
  password: string       // パスワード（必須、6-20文字）
  rememberMe: boolean    // ログイン状態保持（デフォルト: false）
}
```

## バリデーション

### email
- **必須チェック**: 空文字不可
- **形式チェック**: メールアドレス形式

### password
- **必須チェック**: 空文字不可
- **文字数制限**: 6文字以上、20文字以下

### rememberMe
- **デフォルト値**: `false`
- **必須チェック**: なし（任意）

## フォーム管理フック

### useLoginForm

**ファイル:** `app/(auth)/login/_hooks/useLoginForm.ts`

**責務:**
- ログインフォームの状態管理
- バリデーション実行
- フォーム送信処理

**提供する値:**
```typescript
{
  register: (name) => ({ onChange, onBlur, name, ref })
  handleSubmit: (onValid) => (e) => void
  watch: (name?) => value
  setValue: (name, value) => void
}
```

**使用例:**
```typescript
const { register, handleSubmit, watch, setValue } = useLoginForm()

// フォーム送信
<form onSubmit={handleSubmit((form) => login(form))}>
  
// 入力フィールド登録
<TextInput {...register("email")} />

// 値の監視
<Checkbox checked={watch("rememberMe")} />

// 値の更新
setValue("rememberMe", event.currentTarget.checked)
```

## 招待コード入力

### 親招待コード

**状態管理:**
```typescript
const [parentInviteCode, setParentInviteCode] = useState("")
const [parentInviteCodeError, setParentInviteCodeError] = useState("")
```

**入力フィールド:**
```typescript
<Input.Wrapper error={parentInviteCodeError}>
  <Input
    placeholder="親招待コード"
    value={parentInviteCode}
    onChange={(e) => {
      setParentInviteCode(e.currentTarget.value)
      setParentInviteCodeError("") // エラーをクリア
    }}
  />
</Input.Wrapper>
```

**送信:**
```typescript
<Button onClick={() => handleJoinAsParent({inviteCode: parentInviteCode})}>
  親として家族に参加する
</Button>
```

### 子招待コード

**状態管理:**
```typescript
const [childInviteCode, setChildInviteCode] = useState("")
const [childInviteCodeError, setChildInviteCodeError] = useState("")
```

**入力フィールド:**
```typescript
<Input.Wrapper error={childInviteCodeError}>
  <Input
    placeholder="子招待コード"
    value={childInviteCode}
    onChange={(e) => {
      setChildInviteCode(e.currentTarget.value)
      setChildInviteCodeError("") // エラーをクリア
    }}
  />
</Input.Wrapper>
```

**送信:**
```typescript
<Button onClick={() => handleJoinAsChild({inviteCode: childInviteCode})}>
  子として家族に参加する
</Button>
```

## フォーム関連フック

### useJoinAsParent

**ファイル:** `app/(auth)/login/_hooks/useJoinAsParent.ts`

**責務:** 親として既存家族に参加

**パラメータ:**
```typescript
{
  refetch: () => void                    // ユーザー情報再取得関数
  setParentInviteCodeError: (error: string) => void  // エラー設定関数
}
```

**提供する値:**
```typescript
{
  handleJoinAsParent: ({inviteCode}) => void
  isLoading: boolean
}
```

### useJoinAsChild

**ファイル:** `app/(auth)/login/_hooks/useJoinAsChild.ts`

**責務:** 子として既存家族に参加

**パラメータ:**
```typescript
{
  refetch: () => void                    // ユーザー情報再取得関数
  setChildInviteCodeError: (error: string) => void  // エラー設定関数
}
```

**提供する値:**
```typescript
{
  handleJoinAsChild: ({inviteCode}) => void
  isLoading: boolean
}
```

## エラー表示

### フォームエラー
- バリデーションエラーは各入力フィールドの下に表示
- Mantine の `Input.Wrapper` の `error` プロパティを使用

### APIエラー
- `react-hot-toast` でトースト通知
- 招待コードエラーは `Input.Wrapper` の `error` プロパティで表示

### エラークリア
- 入力値変更時に対応するエラーをクリア
- ポップアップ起動時に全エラーをリセット
