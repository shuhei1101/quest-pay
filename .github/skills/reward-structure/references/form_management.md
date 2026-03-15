# 報酬設定 - フォーム管理

**2026年3月記載**

## フォームスキーマ

### AgeRewardFormSchema

**ファイル:** `app/(app)/reward/by-age/form.ts`

```typescript
import { z } from "zod"

export const AgeRewardFormSchema = z.object({
  rewards: z.array(
    z.object({
      age: z.number().int().min(0).max(100),
      amount: z.number().int().min(0)
    })
  )
})

export type AgeRewardFormType = z.infer<typeof AgeRewardFormSchema>
```

**構造:**
- `rewards`: 年齢別報酬の配列
  - `age`: 年齢（0〜100）
  - `amount`: 報酬額（0以上）

### LevelRewardFormSchema

**ファイル:** `app/(app)/reward/by-level/form.ts`

```typescript
import { z } from "zod"

export const LevelRewardFormSchema = z.object({
  rewards: z.array(
    z.object({
      level: z.number().int().min(1).max(100),
      amount: z.number().int().min(0)
    })
  )
})

export type LevelRewardFormType = z.infer<typeof LevelRewardFormSchema>
```

**構造:**
- `rewards`: レベル別報酬の配列
  - `level`: レベル（1〜100）
  - `amount`: 報酬額（0以上）

## フォーム状態管理

### useAgeRewardForm（家族全体）

**ファイル:** `app/(app)/reward/by-age/_hooks/useAgeRewardForm.ts`

**引数:** なし

**戻り値:**
```typescript
{
  register: UseFormRegister<AgeRewardFormType>
  errors: FieldErrors<AgeRewardFormType>
  setValue: UseFormSetValue<AgeRewardFormType>
  watch: UseFormWatch<AgeRewardFormType>
  isLoading: boolean
  handleSubmit: (handler) => void
}
```

**処理フロー:**

1. **初期化**
   - デフォルト値：rewards = []
   - zodResolver でバリデーション設定

2. **データ取得**
   - `GET /api/reward/by-age/table` で家族の年齢別報酬テーブル取得
   - rewards 配列に変換して reset

3. **変更検出**
   - 各報酬額の変更を監視

### useChildAgeRewardForm（子供個別）

**ファイル:** `app/(app)/children/[id]/reward/by-age/_hooks/useChildAgeRewardForm.ts`

**引数:**
- `childId: string` - 子供ID

**戻り値:** `useAgeRewardForm` と同じ

**処理フロー:**

1. **初期化**
   - デフォルト値：rewards = []

2. **データ取得**
   - `GET /api/children/[childId]/reward/by-age/table` で子供個別の年齢別報酬テーブル取得
   - rewards 配列に変換して reset

### useLevelRewardForm（家族全体）

**ファイル:** `app/(app)/reward/by-level/_hooks/useLevelRewardForm.ts`

**引数:** なし

**戻り値:**
```typescript
{
  register: UseFormRegister<LevelRewardFormType>
  errors: FieldErrors<LevelRewardFormType>
  setValue: UseFormSetValue<LevelRewardFormType>
  watch: UseFormWatch<LevelRewardFormType>
  isLoading: boolean
  handleSubmit: (handler) => void
}
```

**処理フロー:**

1. **初期化**
   - デフォルト値：rewards = []

2. **データ取得**
   - `GET /api/reward/by-level/table` で家族のレベル別報酬テーブル取得
   - rewards 配列に変換して reset

### useChildLevelRewardForm（子供個別）

**ファイル:** `app/(app)/children/[id]/reward/by-level/_hooks/useChildLevelRewardForm.ts`

**引数:**
- `childId: string` - 子供ID

**戻り値:** `useLevelRewardForm` と同じ

**処理フロー:**

1. **初期化**
   - デフォルト値：rewards = []

2. **データ取得**
   - `GET /api/children/[childId]/reward/by-level/table` で子供個別のレベル別報酬テーブル取得
   - rewards 配列に変換して reset

## フォーム送信

### 家族全体の年齢別報酬更新

**RewardEdit内のMutation:**
```typescript
const ageUpdateMutation = useMutation({
  mutationFn: async (data: AgeRewardFormType) => await putFamilyAgeRewardTable(data),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["ageRewardTable"] })
    toast.success("定額報酬を更新しました")
  },
  onError: () => {
    toast.error("定額報酬の更新に失敗しました")
  }
})
```

**処理フロー:**
```typescript
PUT /api/reward/by-age/table
Body: {
  rewards: [
    { age: 0, amount: 100 },
    { age: 1, amount: 200 },
    ...
  ]
}

成功:
  1. キャッシュ無効化: ["ageRewardTable"]
  2. トースト表示: "定額報酬を更新しました"
  3. データ再取得
```

### 家族全体のレベル別報酬更新

**RewardEdit内のMutation:**
```typescript
const levelUpdateMutation = useMutation({
  mutationFn: async (data: LevelRewardFormType) => await putFamilyLevelRewardTable(data),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["levelRewardTable"] })
    toast.success("ランク報酬を更新しました")
  },
  onError: () => {
    toast.error("ランク報酬の更新に失敗しました")
  }
})
```

**処理フロー:**
```typescript
PUT /api/reward/by-level/table
Body: {
  rewards: [
    { level: 1, amount: 10 },
    { level: 2, amount: 20 },
    ...
  ]
}

成功:
  1. キャッシュ無効化: ["levelRewardTable"]
  2. トースト表示: "ランク報酬を更新しました"
  3. データ再取得
```

### 子供個別の報酬更新

**子供個別の場合も同じパターン:**
- API エンドポイントが `/api/children/[id]/reward/...` に変わるだけ
- キャッシュキーに childId を含める: `["childAgeRewardTable", childId]`

## React Query統合

### キャッシュキー

**家族全体:**
```typescript
["ageRewardTable"]
["levelRewardTable"]
```

**子供個別:**
```typescript
["childAgeRewardTable", childId]
["childLevelRewardTable", childId]
```

### 無効化タイミング

- 年齢別報酬更新成功時: 該当のキャッシュ無効化
- レベル別報酬更新成功時: 該当のキャッシュ無効化

## フォーム入力ハンドリング

### 年齢別報酬（AgeRewardEditLayout）

**NumberInput による配列管理:**
```typescript
<NumberInput
  value={form.watch().rewards[index]?.amount ?? 0}
  onChange={(value) => form.setValue(`rewards.${index}.amount`, value as number)}
  min={0}
/>
```

- 配列の各要素に対して個別にNumberInputを配置
- onChange で setValue を使って配列要素を更新

### レベル別報酬（LevelRewardEditLayout）

**NumberInput による配列管理:**
```typescript
<NumberInput
  value={form.watch().rewards[index]?.amount ?? 0}
  onChange={(value) => form.setValue(`rewards.${index}.amount`, value as number)}
  min={0}
/>
```

- 配列の各要素に対して個別にNumberInputを配置
- onChange で setValue を使って配列要素を更新

### 年齢型切替（年齢型 or 学年型）

**AgeRewardEditLayout内の状態:**
```typescript
const [ageSettingType, setAgeSettingType] = useState<"age" | "grade">("age")
```

- 切り替え時にテーブル行数と表示ラベルが変わる
- フォームデータ自体は年齢ベースで保持（内部的に学年→年齢変換）

## リセット機能

**子供個別画面のみ:**
```typescript
const handleReset = async () => {
  // 家族全体の設定を取得
  const familyRewards = await getFamilyAgeRewardTable()
  // 子供個別設定を削除
  await deleteChildAgeRewardTable(childId)
  // フォームを家族全体設定でリセット
  form.reset(familyRewards)
  toast.success("家族全体の設定にリセットしました")
}
```

- 子供個別設定を削除し、家族全体の設定に戻す
- トースト表示 + データ再取得

## データ構造の変換

### DB → フォーム形式

**年齢別報酬:**
```typescript
// DB: age_reward_tables { age: number, amount: number }
// フォーム: { rewards: { age: number, amount: number }[] }

const formData: AgeRewardFormType = {
  rewards: dbRecords.map(record => ({
    age: record.age,
    amount: record.amount
  }))
}
```

**レベル別報酬:**
```typescript
// DB: level_reward_tables { level: number, amount: number }
// フォーム: { rewards: { level: number, amount: number }[] }

const formData: LevelRewardFormType = {
  rewards: dbRecords.map(record => ({
    level: record.level,
    amount: record.amount
  }))
}
```

### フォーム → DB保存形式

**年齢別報酬:**
```typescript
// フォーム: { rewards: { age: number, amount: number }[] }
// DB: age_reward_tables { family_id, child_id?, age, amount }

const dbRecords = formData.rewards.map(reward => ({
  familyId,
  childId: childId ?? null,
  age: reward.age,
  amount: reward.amount
}))
```

**レベル別報酬:**
```typescript
// フォーム: { rewards: { level: number, amount: number }[] }
// DB: level_reward_tables { family_id, child_id?, level, amount }

const dbRecords = formData.rewards.map(reward => ({
  familyId,
  childId: childId ?? null,
  level: reward.level,
  amount: reward.amount
}))
```
