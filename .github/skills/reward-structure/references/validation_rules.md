# 報酬設定 - バリデーションルール

**2026年3月記載**

## Zodスキーマ定義

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

## フィールド別バリデーション

### rewards[].age（年齢）

**型:** `number`

**制約:**
- 必須
- 整数: `int()`
- 範囲: `min(0).max(100)`

**デフォルト値:** `0` 〜 `100` の配列（初期化時）

**テストケース:**
```typescript
✓ 0 → valid
✓ 50 → valid
✓ 100 → valid
✗ -1 → invalid (最小値未満)
✗ 101 → invalid (最大値超過)
✗ 5.5 → invalid (整数でない)
```

### rewards[].amount（報酬額: 年齢別）

**型:** `number`

**制約:**
- 必須
- 整数: `int()`
- 最小値: `min(0)`

**デフォルト値:** `0`

**テストケース:**
```typescript
✓ 0 → valid
✓ 100 → valid
✓ 10000 → valid
✗ -1 → invalid (負の数)
✗ 1.5 → invalid (整数でない)
```

### rewards[].level（レベル）

**型:** `number`

**制約:**
- 必須
- 整数: `int()`
- 範囲: `min(1).max(100)`

**デフォルト値:** `1` 〜 `100` の配列（初期化時）

**テストケース:**
```typescript
✓ 1 → valid
✓ 50 → valid
✓ 100 → valid
✗ 0 → invalid (最小値未満)
✗ 101 → invalid (最大値超過)
✗ 5.5 → invalid (整数でない)
```

### rewards[].amount（報酬額: レベル別）

**型:** `number`

**制約:**
- 必須
- 整数: `int()`
- 最小値: `min(0)`

**デフォルト値:** `0`

**テストケース:**
```typescript
✓ 0 → valid
✓ 100 → valid
✓ 10000 → valid
✗ -1 → invalid (負の数)
✗ 1.5 → invalid (整数でない)
```

## バリデーション実行タイミング

### クライアント側

1. **リアルタイムバリデーション**
   - NumberInput の onChange で自動検証
   - 最小値・最大値チェック

2. **送信時バリデーション**
   ```typescript
   handleSubmit((form) => {
     ageUpdateMutation.mutate(form)
   })
   ```
   - 保存ボタンクリック時に全フィールド検証
   - エラーがある場合は送信中止

### サーバー側

1. **APIハンドラーでの検証**
   ```typescript
   PUT /api/reward/by-age/table
   PUT /api/reward/by-level/table
   PUT /api/children/[id]/reward/by-age/table
   PUT /api/children/[id]/reward/by-level/table
   ```
   - リクエストボディをZodスキーマで検証
   - 不正データはステータス400で拒否

2. **DB保存前の検証**
   - Drizzle ORMの型チェック
   - 外部キー制約（family_id, child_id）
   - NOT NULL制約

## エラー表示

### フィールド単位のエラー

```typescript
<NumberInput
  value={form.watch().rewards[index]?.amount ?? 0}
  onChange={(value) => form.setValue(`rewards.${index}.amount`, value as number)}
  min={0}
  error={form.errors.rewards?.[index]?.amount?.message}
/>
```

- エラーメッセージはフィールド下部に赤字で表示
- エラーがある場合、フィールドが赤枠で強調

### グローバルエラー

- API エラー: トースト通知
- ネットワークエラー: トースト通知

## バリデーション無効化条件

### ローディング中

```typescript
disabled={isLoading}
```

- データ取得中: `isLoading=true`
- 送信中: `mutation.isPending=true`
- NumberInput が無効化され、入力不可

### 認証エラー

- authGuard で親ユーザー以外を弾く
- 子供・ゲストは画面自体にアクセス不可

## 配列バリデーション

### rewards 配列全体

**制約なし:**
- 年齢別: 0〜100歳の101要素
- レベル別: 1〜100レベルの100要素

**初期化時:**
```typescript
// 年齢別報酬の初期化
const defaultAgeRewards: AgeRewardFormType = {
  rewards: Array.from({ length: 101 }, (_, i) => ({
    age: i,
    amount: 0
  }))
}

// レベル別報酬の初期化
const defaultLevelRewards: LevelRewardFormType = {
  rewards: Array.from({ length: 100 }, (_, i) => ({
    level: i + 1,
    amount: 0
  }))
}
```

### 配列要素の整合性チェック

**年齢の連続性:**
- 0, 1, 2, ..., 100 の順で連続している必要がある
- フロントで自動生成されるため、通常は問題にならない

**レベルの連続性:**
- 1, 2, 3, ..., 100 の順で連続している必要がある
- フロントで自動生成されるため、通常は問題にならない

## 学年型の内部変換

### 学年→年齢変換

**学年型選択時の内部処理:**
```typescript
// 学年マッピング
const gradeToAgeMap: Record<string, number> = {
  "小1": 6,
  "小2": 7,
  "小3": 8,
  "小4": 9,
  "小5": 10,
  "小6": 11,
  "中1": 12,
  "中2": 13,
  "中3": 14,
  "高1": 15,
  "高2": 16,
  "高3": 17,
  "その他": 18 // または任意の年齢
}
```

**バリデーション:**
- 学年型でも内部的には年齢ベースで保存
- UI上は学年表示だが、DBには年齢で保存
- 学年→年齢変換は常に `min(0).max(100)` の範囲内

## カスタムバリデーション（将来拡張可能）

現在は使用していないが、将来的に追加可能な検証：

### 報酬額の最大値チェック（例）

```typescript
amount: z.number().int().min(0).max(100000, "報酬額は100,000円以下である必要があります")
```

### 報酬額の増加チェック（例）

```typescript
.refine((data) => {
  // 年齢が上がるごとに報酬額が増加することを検証
  for (let i = 1; i < data.rewards.length; i++) {
    if (data.rewards[i].amount < data.rewards[i - 1].amount) {
      return false
    }
  }
  return true
}, {
  message: "報酬額は年齢とともに増加する必要があります",
  path: ["rewards"]
})
```

### レベル報酬の上限チェック（例）

```typescript
.refine((data) => {
  // レベル100の報酬が異常値でないことを検証
  const maxReward = data.rewards[99].amount
  return maxReward <= 1000000
}, {
  message: "レベル100の報酬が高すぎます",
  path: ["rewards", 99, "amount"]
})
```

## DB整合性検証

### 外部キー制約

**家族全体:**
- `family_id` は families テーブルに存在する必要がある

**子供個別:**
- `family_id` は families テーブルに存在する必要がある
- `child_id` は children テーブルに存在する必要がある
- child が family に所属している必要がある

### ユニーク制約

**年齢別報酬:**
- `(family_id, child_id, age)` の組み合わせでユニーク
- 同じ年齢に複数レコード登録不可

**レベル別報酬:**
- `(family_id, child_id, level)` の組み合わせでユニーク
- 同じレベルに複数レコード登録不可
