# 家族メンバー子供編集 - フォーム管理

**2026年3月記載**

## フォームスキーマ

### ChildFormSchema

**ファイル:** `app/(app)/children/[id]/form.ts`

```typescript
export const ChildFormSchema = z.object({
  name: z.string().min(1, "子供の名前を入力してください"),
  iconId: z.number().int().positive("アイコンを選択してください"),
  iconColor: z.string().min(1, "アイコンカラーを選択してください"),
  birthday: z.string().min(1, "誕生日を入力してください")
})

export type ChildFormType = z.infer<typeof ChildFormSchema>
```

### デフォルト値

```typescript
const defaultChild: ChildFormType = {
  name: "",
  iconId: 1,
  iconColor: "",
  birthday: ""
}
```

## フォーム状態管理

### useChildForm

**ファイル:** `app/(app)/children/[id]/_hook/useChildForm.ts`

**引数:**
- `childId?: string` - 子供ID（編集時）

**戻り値:**
```typescript
{
  register: UseFormRegister<ChildFormType>
  errors: FieldErrors<ChildFormType>
  setValue: UseFormSetValue<ChildFormType>
  watch: UseFormWatch<ChildFormType>
  isValueChanged: boolean
  setForm: (form: ChildFormType) => void
  handleSubmit: (handler) => void
  isLoading: boolean
  fetchedChild: ChildFormType
  fetchedEntity: ChildEntity | undefined
}
```

**処理フロー:**

1. **初期化**
   - デフォルト値でuseFormを初期化
   - zodResolverでバリデーション設定

2. **データ取得（編集時）**
   - childIdが存在する場合のみ実行
   - `getChild(childId)` APIを呼び出し
   - 取得データをフォーム形式に変換
   - `reset(fetchedChildForm)` でフォームに反映

3. **変更検出**
   - 現在の入力値と取得時の値を比較
   - name, birthday, iconColor, iconIdの変更を検知

## フォーム送信

### useRegisterChild

**ファイル:** `app/(app)/children/[id]/_hook/useRegisterChild.ts`

**引数:**
- `setId: (id: string) => void` - ID更新関数

**戻り値:**
```typescript
{
  handleRegister: (params: {form: ChildFormType}) => Promise<void>
  isLoading: boolean
}
```

**処理フロー:**

1. **新規作成 (id未設定時)**
   ```typescript
   POST /api/children
   Body: {
     name: string
     iconId: number
     iconColor: string
     birthday: string
   }
   ```
   - 成功: 作成されたIDを取得してsetId実行
   - トースト表示: "登録しました"
   - 編集画面へリダイレクト

2. **更新 (id設定済み時)**
   ```typescript
   PUT /api/children/[id]
   Body: {
     name: string
     iconId: number
     iconColor: string
     birthday: string
   }
   ```
   - 成功: トースト表示: "保存しました"
   - リダイレクトなし

3. **エラー処理**
   - handleAppError でエラーハンドリング
   - トースト表示とエラー画面遷移

## React Query統合

### キャッシュキー

```typescript
["Child", childId]
```

### 無効化タイミング

- 子供登録成功時: `["children"]` キャッシュ無効化
- 子供更新成功時: `["Child", id]` と `["children"]` キャッシュ無効化

## フォーム入力ハンドリング

### name（子供名）

```typescript
<Input {...childRegister("name")} />
```

- react-hook-formのregisterで自動管理

### iconId, iconColor（アイコン）

```typescript
setIcon={(iconId: number) => setChildValue("iconId", iconId)}
setColor={(iconColor: string) => setChildValue("iconColor", iconColor)}
```

- IconSelectPopupから setValue経由で更新

### birthday（誕生日）

```typescript
<DateInput
  value={watchChild().birthday ? new Date(watchChild().birthday) : null}
  onChange={(value) => setChildValue("birthday", value ?? "")}
  locale="ja"
/>
```

- DateInputコンポーネントで日本語ロケール使用
- setValue経由で更新
