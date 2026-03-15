# 子供編集画面 - フォーム管理

（2026年3月記載）

## React Hook Form セットアップ

### フォームフック: useChildForm

**ファイルパス**: `packages/web/app/(app)/children/[id]/_hook/useChildForm.ts`

**依存関係**:
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChildFormSchema, ChildFormType } from "../form"
```

**初期化**:
```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  setValue,
  watch,
  reset,
} = useForm<ChildFormType>({
  resolver: zodResolver(ChildFormSchema),
  defaultValues: defaultChild
})
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

## データフェッチング（編集時）

### React Query による取得

```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ["Child", childId],
  retry: false,
  queryFn: async () => {
    const { child } = await getChild(childId!)
    // フォームデータに変換
    const fetchedChildForm: ChildFormType = {
      name: child.profiles?.name || "",
      iconId: child.icons?.id || 1,
      iconColor: child.profiles?.iconColor || "",
      birthday: child.profiles?.birthday || ""
    }
    setFetchedChild(fetchedChildForm)
    reset(fetchedChildForm)
    return { childEntity: child }
  },
  enabled: !!childId
})
```

## フォーム送信処理

### 送信フック: useRegisterChild

**ファイルパス**: `packages/web/app/(app)/children/[id]/_hook/useRegisterChild.ts`

**送信ハンドラ**:
```typescript
const handleRegister = async ({ form }: { form: ChildFormType }) => {
  // 新規作成または更新
  if (id) {
    // 更新処理
    await putChild(id, form)
    toast.success("子供情報を更新しました")
  } else {
    // 新規作成処理
    const { child } = await postChild(form)
    setId(child.id)
    toast.success("子供を登録しました")
  }
  router.push(CHILDREN_LIST_URL())
}
```

## フォーム状態管理

### 変更検知

```typescript
const isValueChanged = 
  current.name !== fetchedChild.name ||
  current.birthday !== fetchedChild.birthday ||
  current.iconColor !== fetchedChild.iconColor ||
  current.iconId !== fetchedChild.iconId
```

### リセット

```typescript
setForm: reset  // フォームを初期化
```

## バリデーション

Zodスキーマによる自動バリデーション:
- resolver: zodResolver(ChildFormSchema)
- エラーは errors オブジェクトに自動格納
- 各フィールドに error prop を渡してエラー表示
