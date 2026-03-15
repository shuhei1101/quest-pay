# 家族クエスト編集 - バリデーションルール

**2026年3月記載**

## Zodスキーマ定義

**ファイル:** `app/(app)/quests/family/[id]/form.ts`

```typescript
import { z } from "zod"
import { BaseQuestFormScheme } from "../../form"

export const FamilyQuestFormScheme = addAgeMonthRefinements(
  BaseQuestFormScheme.extend({
    childSettings: z.array(ChildSettingScheme),
  })
)

export const ChildSettingScheme = z.object({
  childId: z.string(),
  isActivate: z.boolean(),
  hasQuestChildren: z.boolean(),
})
```

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

## フィールド別バリデーション

### 基本設定タブ

#### name（クエスト名）

**型:** `string`

**制約:**
- 必須: `min(1)`
- エラーメッセージ: "クエスト名を入力してください"

**テストケース:**
```typescript
✓ "お皿洗い" → valid
✓ "a" → valid (1文字でもOK)
✗ "" → invalid (空文字)
✗ "   " → invalid (空白のみ)
```

#### iconId（アイコンID）

**型:** `number`

**制約:**
- 必須
- iconsテーブルの外部キー

**デフォルト値:** `1`

**テストケース:**
```typescript
✓ 1 → valid
✓ 100 → valid
✗ 0 → invalid (正の数でない)
```

#### iconColor（アイコンカラー）

**型:** `string`

**制約:**
- 必須
- カラーコード形式

**テストケース:**
```typescript
✓ "#ff0000" → valid
✓ "red" → valid
✗ "" → invalid (空文字)
```

#### categoryId（カテゴリID）

**型:** `number | null`

**制約:**
- nullable（null許可）
- quest_categoriesテーブルの外部キー

**デフォルト値:** `null`

**テストケース:**
```typescript
✓ null → valid
✓ 1 → valid
✓ 100 → valid
```

#### tags（タグ）

**型:** `string[]`

**制約:**
- 配列（空配列OK）
- 重複チェックはフロントで実施

**デフォルト値:** `[]`

**テストケース:**
```typescript
✓ [] → valid
✓ ["家事", "掃除"] → valid
✓ ["tag"] → valid
```

#### client（依頼者氏名）

**型:** `string`

**制約:**
- なし（空文字OK）

**デフォルト値:** `""`

#### requestDetail（依頼詳細）

**型:** `string`

**制約:**
- なし（空文字OK）

**デフォルト値:** `""`

#### ageFrom, ageTo（対象年齢）

**型:** `number | null`

**制約:**
- nullable
- カスタムリファインメント: `ageFrom <= ageTo`

**エラーメッセージ:**
- "開始年齢は終了年齢以下である必要があります"

**デフォルト値:** `null`

**テストケース:**
```typescript
✓ ageFrom: null, ageTo: null → valid
✓ ageFrom: 5, ageTo: 10 → valid
✓ ageFrom: 5, ageTo: 5 → valid
✗ ageFrom: 10, ageTo: 5 → invalid (ageFrom > ageTo)
✓ ageFrom: 5, ageTo: null → valid
✓ ageFrom: null, ageTo: 10 → valid
```

#### monthFrom, monthTo（公開時期）

**型:** `number | null`

**制約:**
- nullable
- カスタムリファインメント: `monthFrom <= monthTo`

**エラーメッセージ:**
- "開始月は終了月以下である必要があります"

**デフォルト値:** `null`

**テストケース:**
```typescript
✓ monthFrom: null, monthTo: null → valid
✓ monthFrom: 1, monthTo: 12 → valid
✓ monthFrom: 6, monthTo: 6 → valid
✗ monthFrom: 12, monthTo: 1 → invalid (monthFrom > monthTo)
✓ monthFrom: 1, monthTo: null → valid
✓ monthFrom: null, monthTo: 12 → valid
```

### 詳細設定タブ

#### details（レベル別詳細設定）

**型:** `QuestDetailScheme[]`

**制約:**
- 配列の長さ: `min(1)` "少なくとも1つの詳細設定が必要です"
- 最大5レベルまで（フロント制御）

**デフォルト値:** `[{ level: 1, successCondition: "", requiredClearCount: 1, reward: 0, childExp: 0, requiredCompletionCount: 1 }]`

#### details[].level（レベル）

**型:** `number`

**制約:**
- 整数: `int()`
- 範囲: `min(1).max(5)`

**テストケース:**
```typescript
✓ 1 → valid
✓ 5 → valid
✗ 0 → invalid (最小値未満)
✗ 6 → invalid (最大値超過)
✗ 1.5 → invalid (整数でない)
```

#### details[].successCondition（達成条件）

**型:** `string`

**制約:**
- 必須: `min(1)`
- エラーメッセージ: "達成条件を入力してください"

**テストケース:**
```typescript
✓ "お皿を5枚洗う" → valid
✓ "a" → valid
✗ "" → invalid (空文字)
```

#### details[].requiredClearCount（必要クリア回数）

**型:** `number | null`

**制約:**
- nullable（レベル5の場合はnull）
- レベル5以外: 整数、最小値1
- エラーメッセージ: なし（フロントで制御）

**デフォルト値:** `1` (レベル5の場合は `null`)

**テストケース:**
```typescript
✓ 1 → valid
✓ 100 → valid
✓ null → valid (レベル5のみ)
✗ 0 → invalid (レベル5以外で最小値未満)
✗ -1 → invalid
```

#### details[].reward（報酬）

**型:** `number`

**制約:**
- 整数: `int()`
- 最小値: `min(0)`

**デフォルト値:** `0`

**テストケース:**
```typescript
✓ 0 → valid
✓ 100 → valid
✗ -1 → invalid (負の数)
✗ 1.5 → invalid (整数でない)
```

#### details[].childExp（経験値）

**型:** `number`

**制約:**
- 整数: `int()`
- 最小値: `min(0)`

**デフォルト値:** `0`

**テストケース:**
```typescript
✓ 0 → valid
✓ 100 → valid
✗ -1 → invalid (負の数)
✗ 1.5 → invalid (整数でない)
```

#### details[].requiredCompletionCount（必要完了回数）

**型:** `number`

**制約:**
- 整数: `int()`
- 最小値: `min(1)`

**デフォルト値:** `1`

**テストケース:**
```typescript
✓ 1 → valid
✓ 100 → valid
✗ 0 → invalid (最小値未満)
✗ -1 → invalid
✗ 1.5 → invalid (整数でない)
```

### 子供設定タブ

#### childSettings（子供設定）

**型:** `ChildSettingScheme[]`

**制約:**
- 配列（空配列OK）

**デフォルト値:** `[]`

#### childSettings[].childId（子供ID）

**型:** `string`

**制約:**
- 必須
- childrenテーブルの外部キー

#### childSettings[].isActivate（公開フラグ）

**型:** `boolean`

**制約:**
- 必須

**デフォルト値:** `true`

#### childSettings[].hasQuestChildren（子供クエスト存在フラグ）

**型:** `boolean`

**制約:**
- 必須
- 読み取り専用（DB側で管理）

**デフォルト値:** `false`

## バリデーション実行タイミング

### クライアント側

1. **リアルタイムバリデーション**
   - エラー後は各フィールドでリアルタイム検証

2. **送信時バリデーション**
   ```typescript
   handleSubmit((form) => {
     if (familyQuestId) {
       handleUpdate({ form, familyQuestId, updatedAt, questUpdatedAt })
     } else {
       handleRegister({ form })
     }
   })
   ```

3. **タブエラーチェック**
   - 各タブに対してエラーフラグを設定
   - エラーがある場合、タブに赤いバッジ表示

### サーバー側

1. **APIハンドラーでの検証**
   ```typescript
   POST /api/quests/family
   PUT /api/quests/family/[id]
   ```
   - リクエストボディをZodスキーマで検証
   - 不正データはステータス400で拒否

2. **DB保存前の検証**
   - Drizzle ORMの型チェック
   - 外部キー制約
   - NOT NULL制約

3. **楽観的ロック検証**
   - updatedAt, questUpdatedAt で競合チェック
   - 競合時はステータス409で拒否

## エラー表示

### フィールド単位のエラー

```typescript
<Input.Wrapper 
  label={<>クエスト名 <RequiredMark /></>}
  error={errors.name?.message}
>
  <Input {...register("name")} />
</Input.Wrapper>
```

### タブ単位のエラー

```typescript
const hasBasicErrors = !!(errors.name || errors.iconId || ...)
const hasDetailErrors = !!(errors.details)
const hasChildErrors = !!(errors.childSettings)

tabs={[
  { value: "basic", label: "基本設定", hasErrors: hasBasicErrors, ... },
  { value: "details", label: "詳細設定", hasErrors: hasDetailErrors, ... },
  { value: "children", label: "子供設定", hasErrors: hasChildErrors, ... },
]}
```

エラーがあるタブには赤いバッジが表示されます。

### グローバルエラー

- API エラー: トースト通知
- ネットワークエラー: トースト通知
- 楽観的ロック競合: トースト通知 + データ再取得

## カスタムバリデーション

### 年齢範囲の検証

```typescript
.refine((data) => {
  if (data.ageFrom !== null && data.ageTo !== null) {
    return data.ageFrom <= data.ageTo
  }
  return true
}, {
  message: "開始年齢は終了年齢以下である必要があります",
  path: ["ageFrom"]
})
```

### 月範囲の検証

```typescript
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

### デフォルト値チェック（レベル削除時）

```typescript
export const isDefaultDetail = (detail: QuestDetailType): boolean => {
  return (
    detail.successCondition === "" &&
    (detail.requiredClearCount === null || detail.requiredClearCount === 1) &&
    detail.reward === 0 &&
    detail.childExp === 0 &&
    detail.requiredCompletionCount === 1
  )
}
```

デフォルト値のままのレベルは、確認なしで即座に削除可能です。
