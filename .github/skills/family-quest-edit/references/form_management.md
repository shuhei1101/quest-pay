# 家族クエスト編集 - フォーム管理

**2026年3月記載**

## フォームスキーマ

### FamilyQuestFormSchema

**ファイル:** `app/(app)/quests/family/[id]/form.ts`

```typescript
import { z } from "zod"
import { BaseQuestFormScheme } from "../../form"

export const ChildSettingScheme = z.object({
  childId: z.string(),
  isActivate: z.boolean(),
  hasQuestChildren: z.boolean(),
})

export const FamilyQuestFormScheme = addAgeMonthRefinements(
  BaseQuestFormScheme.extend({
    childSettings: z.array(ChildSettingScheme),
  })
)

export type FamilyQuestFormType = z.infer<typeof FamilyQuestFormScheme>
export type ChildSettingType = z.infer<typeof ChildSettingScheme>
```

### BaseQuestFormScheme

**継承元:** `app/(app)/quests/form.ts`

```typescript
export const BaseQuestFormScheme = z.object({
  name: z.string().min(1, "クエスト名を入力してください"),
  iconId: z.number(),
  iconColor: z.string(),
  categoryId: z.number().nullable(),
  tags: z.array(z.string()),
  client: z.string(),
  requestDetail: z.string(),
  ageFrom: z.number().nullable(),
  ageTo: z.number().nullable(),
  monthFrom: z.number().nullable(),
  monthTo: z.number().nullable(),
  details: z.array(QuestDetailScheme).min(1, "少なくとも1つの詳細設定が必要です"),
})

export const QuestDetailScheme = z.object({
  level: z.number().int().min(1).max(5),
  successCondition: z.string().min(1, "達成条件を入力してください"),
  requiredClearCount: z.number().int().min(1).nullable(),
  reward: z.number().int().min(0),
  childExp: z.number().int().min(0),
  requiredCompletionCount: z.number().int().min(1),
})
```

### カスタムリファインメント

**ageFrom/ageTo の相互検証:**
```typescript
export const addAgeMonthRefinements = (schema: z.ZodObject<any>) => 
  schema
    .refine((data) => {
      if (data.ageFrom !== null && data.ageTo !== null) {
        return data.ageFrom <= data.ageTo
      }
      return true
    }, {
      message: "開始年齢は終了年齢以下である必要があります",
      path: ["ageFrom"]
    })
    .refine((data) => {
      if (data.monthFrom !== null && data.monthTo !== null) {
        return data.monthFrom <= data.monthTo
      }
      return true
    }, {
      message: "開始月は終了月以下である必要があります",
      path: ["monthFrom"]
    })
```

## フォーム状態管理

### useFamilyQuestForm

**ファイル:** `app/(app)/quests/family/[id]/_hooks/useFamilyQuestForm.ts`

**引数:**
- `familyQuestId?: string` - 家族クエストID（編集時）

**戻り値:**
```typescript
{
  register: UseFormRegister<FamilyQuestFormType>
  setForm: (form: FamilyQuestFormType) => void
  errors: FieldErrors<FamilyQuestFormType>
  setValue: UseFormSetValue<FamilyQuestFormType>
  watch: UseFormWatch<FamilyQuestFormType>
  isValueChanged: boolean
  handleSubmit: (handler) => void
  isLoading: boolean
  fetchedEntity: FetchedEntity | undefined
}
```

**処理フロー:**

1. **初期化**
   - デフォルト値でuseFormを初期化
   - zodResolverでバリデーション設定
   - detailsのデフォルトはlevel 1の詳細設定

2. **データ取得（編集時）**
   - familyQuestIdが存在する場合のみ実行
   - `getFamilyQuest(familyQuestId)` APIを呼び出し
   - 取得データ（family_quests + family_quest_details + childSettings）をフォーム形式に変換
   - `reset(fetchedFamilyQuestForm)` でフォームに反映

3. **変更検出**
   - 現在の入力値と取得時の値をディープ比較
   - すべてのフィールドの変更を検知

4. **セッションストレージ統合**
   - 起動時に `appStorage.familyQuestForm.pop()` で前回のフォーム状態を復元

## フォーム送信

### useRegisterFamilyQuest（新規作成）

**ファイル:** `app/(app)/quests/family/[id]/_hooks/useRegisterFamilyQuest.ts`

**引数:**
- `setId: (id: string) => void` - ID更新関数

**戻り値:**
```typescript
{
  handleRegister: (params: {form: FamilyQuestFormType}) => Promise<void>
  isLoading: boolean
}
```

**処理フロー:**
```typescript
POST /api/quests/family
Body: {
  base: ベース情報
  details: レベル別詳細設定
  childSettings: 子供設定
}

成功:
  1. familyQuestId を取得
  2. setId(familyQuestId) 実行
  3. トースト表示: "家族クエストを作成しました"
  4. 編集画面へ遷移
  5. キャッシュ無効化
```

### useUpdateFamilyQuest（更新）

**ファイル:** `app/(app)/quests/family/[id]/_hooks/useUpdateFamilyQuest.ts`

**戻り値:**
```typescript
{
  handleUpdate: (params: {
    form: FamilyQuestFormType
    familyQuestId: string
    updatedAt?: string
    questUpdatedAt?: string
  }) => Promise<void>
  isLoading: boolean
}
```

**処理フロー:**
```typescript
PUT /api/quests/family/[id]
Body: {
  base: ベース情報 + updatedAt（楽観的ロック）
  details: レベル別詳細設定 + questUpdatedAt（楽観的ロック）
  childSettings: 子供設定
}

成功:
  1. トースト表示: "家族クエストを更新しました"
  2. キャッシュ無効化
  3. データ再取得
```

### useDeleteFamilyQuest（削除）

**ファイル:** `app/(app)/quests/family/[id]/_hooks/useDeleteFamilyQuest.ts`

**戻り値:**
```typescript
{
  handleDelete: (params: {
    familyQuestId: string
    updatedAt?: string
  }) => Promise<void>
  isLoading: boolean
}
```

**処理フロー:**
```typescript
DELETE /api/quests/family/[id]
Query: updatedAt（楽観的ロック）

成功前に確認モーダル表示:
  "この家族クエストを削除しますか？"

成功:
  1. トースト表示: "家族クエストを削除しました"
  2. 家族クエスト一覧へリダイレクト
  3. キャッシュ無効化
```

### usePublishFamilyQuest（公開）

**ファイル:** `app/(app)/quests/family/[id]/_hooks/usePublishFamilyQuest.ts`

**戻り値:**
```typescript
{
  handlePublish: (params: {
    familyQuestId: string
  }) => Promise<void>
}
```

**処理フロー:**
```typescript
POST /api/quests/family/[id]/publish

成功:
  1. トースト表示: "家族クエストを公開しました"
  2. 公開クエスト画面へリダイレクト
  3. キャッシュ無効化
```

## React Query統合

### キャッシュキー

```typescript
["FamilyQuest", familyQuestId]
["FamilyQuests"]
["PublicQuest", familyQuestId]
```

### 無効化タイミング

- 家族クエスト作成成功時: `["FamilyQuests"]` 無効化
- 家族クエスト更新成功時: `["FamilyQuest", id]`, `["FamilyQuests"]` 無効化
- 家族クエスト削除成功時: `["FamilyQuests"]` 無効化
- 公開成功時: `["PublicQuest", familyQuestId]` 無効化

## 特殊なフォーム入力ハンドリング

### tags（タグ）

**PillsInputによる複数入力:**
```typescript
const [tagInputValue, setTagInputValue] = useState("")
const [isComposing, setIsComposing] = useState(false)

const handleTag = () => {
  const newTag = tagInputValue.trim()
  if (newTag && !watch().tags.includes(newTag)) {
    setValue("tags", [...watch().tags, newTag])
  }
  setTagInputValue("")
}

<PillsInput.Field 
  value={tagInputValue}
  onChange={(e) => setTagInputValue(e.target.value)}
  onBlur={() => handleTag()}
  onCompositionStart={() => setIsComposing(true)}
  onCompositionEnd={() => setIsComposing(false)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault()
      handleTag()
    }
  }}
/>
```

### details（レベル別詳細設定）

**配列の動的管理:**
```typescript
// レベル追加
const handleAddLevel = () => {
  const currentDetails = watch().details
  const newDetail = {
    level: newLevel,
    successCondition: "",
    requiredClearCount: willBeMaxLevel ? null : 1,
    reward: 0,
    childExp: 0,
    requiredCompletionCount: 1,
  }
  setValue("details", [...currentDetails, newDetail].sort((a, b) => a.level - b.level))
}

// レベル削除
const handleRemoveLevel = () => {
  const newDetails = currentDetails
    .filter(d => d.level !== currentLevel)
    .map(d => d.level > currentLevel ? { ...d, level: d.level - 1 } : d)
  setValue("details", newDetails)
}
```

### childSettings（子供設定）

**スイッチによるON/OFF管理:**
```typescript
const toggleChildActivate = (childId: string) => {
  const currentSettings = watch().childSettings
  const existingSetting = currentSettings.find(s => s.childId === childId)
  
  if (existingSetting) {
    if (!existingSetting.hasQuestChildren && existingSetting.isActivate) {
      // OFFにする場合、設定を削除
      const updatedSettings = currentSettings.filter(setting => setting.childId !== childId)
      setValue("childSettings", updatedSettings)
    } else {
      // isActivateを切り替え
      const updatedSettings = currentSettings.map(setting => 
        setting.childId === childId 
          ? { ...setting, isActivate: !setting.isActivate }
          : setting
      )
      setValue("childSettings", updatedSettings)
    }
  } else {
    // 新規追加
    setValue("childSettings", [...currentSettings, { childId, isActivate: true, hasQuestChildren: false }])
  }
}
```
