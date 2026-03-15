# 家族編集画面 - フォーム管理

（2026年3月記載）

## React Hook Form セットアップ

### フォームフック: useFamilyRegisterForm

**ファイルパス**: `packages/web/app/(app)/families/new/_hooks/useFamilyRegisterForm.ts`

**依存関係**:
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FamilyRegisterFormSchema, FamilyRegisterFormType } from "../form"
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
} = useForm<FamilyRegisterFormType>({
  resolver: zodResolver(FamilyRegisterFormSchema),
  defaultValues: defaultFamily
})
```

### デフォルト値

```typescript
const thema = useMantineTheme()

const defaultFamily: FamilyRegisterFormType = {
  displayId: "",
  localName: "",
  parentName: "",
  parentIconId: 1,
  parentBirthday: "",
  onlineName: null,
  familyIconId: 1,
  familyIconColor: thema.colors.blue[5],
  parentIconColor: thema.colors.blue[5]
}
```

**特徴**:
- テーマカラーをデフォルトアイコンカラーに使用
- onlineName は null 許容（オプショナル）

## フォーム送信処理

### 送信フック: useRegisterFamily

**ファイルパス**: `packages/web/app/(app)/families/new/_hooks/useRegisterFamily.ts`

**送信ハンドラ**:
```typescript
const handleRegister = async ({ form }: { form: FamilyRegisterFormType }) => {
  // 新規作成処理
  const { family } = await postFamily(form)
  toast.success("家族を作成しました")
  router.push(FAMILIES_LIST_URL())
}
```

**特徴**:
- 新規作成専用（編集機能なし）
- 成功時は家族一覧へリダイレクト
- エラー時はトースト通知

## フォーム状態管理

### 変更検知

```typescript
const isValueChanged = 
  current.displayId !== defaultFamily.displayId
```

**特徴**:
- displayId の変更のみを検知
- 他のフィールドは現時点では未チェック（今後拡張予定）

### リセット

```typescript
setForm: reset  // フォームを初期化
```

## データフェッチング

現時点ではデータフェッチングなし（新規作成専用）。

**今後の拡張予定**:
- 編集モードの実装
- 家族データの取得と初期値設定
- 更新処理の実装

## API呼び出し

### 新規作成 API

```typescript
const { family } = await postFamily(form)
```

**エンドポイント**: `POST /api/families`

**リクエストボディ**: FamilyRegisterFormType
```typescript
{
  displayId: string
  localName: string
  onlineName: string | null
  familyIconId: number
  familyIconColor: string
  parentName: string
  parentIconId: number
  parentIconColor: string
  parentBirthday: string | Date
}
```

**レスポンス**:
```typescript
{
  family: Family
}
```

## エラーハンドリング

```typescript
try {
  await postFamily(form)
  toast.success("家族を作成しました")
  router.push(FAMILIES_LIST_URL())
} catch (error) {
  toast.error("家族の作成に失敗しました")
}
```

- API呼び出し失敗時はtoastでエラー通知
- handleAppErrorでグローバルエラーハンドリング

## バリデーション

Zodスキーマによる自動バリデーション:
- resolver: zodResolver(FamilyRegisterFormSchema)
- エラーは errors オブジェクトに自動格納
- 各フィールドに error prop を渡してエラー表示

## 複数アイコンの管理

### 家紋選択

```typescript
setIcon: () => (iconId: number) => setFamilyValue("familyIconId", iconId)
setColor: () => (iconColor: string) => setFamilyValue("familyIconColor", iconColor)
```

### 親アイコン選択

```typescript
setIcon: () => (iconId: number) => setFamilyValue("parentIconId", iconId)
setColor: () => (iconColor: string) => setFamilyValue("parentIconColor", iconColor)
```

**特徴**:
- 2つの独立したアイコン選択（家紋と親アイコン）
- それぞれ異なる状態管理（familyIconOpened, parentIconOpened）
