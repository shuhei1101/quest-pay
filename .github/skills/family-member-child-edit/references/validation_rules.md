# 家族メンバー子供編集 - バリデーションルール

**2026年3月記載**

## Zodスキーマ定義

**ファイル:** `app/(app)/children/[id]/form.ts`

```typescript
import { z } from "zod"

export const ChildFormSchema = z.object({
  name: z.string().min(1, "子供の名前を入力してください"),
  iconId: z.number().int().positive("アイコンを選択してください"),
  iconColor: z.string().min(1, "アイコンカラーを選択してください"),
  birthday: z.string().min(1, "誕生日を入力してください")
})

export type ChildFormType = z.infer<typeof ChildFormSchema>
```

## フィールド別バリデーション

### name（子供の名前）

**型:** `string`

**制約:**
- 必須: `min(1)`
- エラーメッセージ: "子供の名前を入力してください"

**フロントエンド検証:**
- Input.Wrapper の error prop で表示
- 送信時に Zod でバリデーション

**バックエンド検証:**
- API側でも同じ検証を実施
- DB保存前に再検証

**テストケース:**
```typescript
✓ "太郎" → valid
✓ "a" → valid (1文字でもOK)
✗ "" → invalid (空文字)
✗ "   " → invalid (空白のみ)
```

### iconId（アイコンID）

**型:** `number`

**制約:**
- 必須
- 整数: `int()`
- 正の数: `positive()`
- エラーメッセージ: "アイコンを選択してください"

**デフォルト値:** `1`

**フロントエンド検証:**
- IconSelectPopup でマスタから選択
- 不正な値を入力できない仕組み

**バックエンド検証:**
- iconsテーブルの外部キー制約
- 存在しないアイコンIDの場合はエラー

**テストケース:**
```typescript
✓ 1 → valid
✓ 100 → valid
✗ 0 → invalid (正の数でない)
✗ -1 → invalid (正の数でない)
✗ 1.5 → invalid (整数でない)
```

### iconColor（アイコンカラー）

**型:** `string`

**制約:**
- 必須: `min(1)`
- エラーメッセージ: "アイコンカラーを選択してください"

**フロントエンド検証:**
- IconSelectPopup でカラーパレットから選択
- 不正な値を入力できない仕組み

**バックエンド検証:**
- 文字列形式の検証（#から始まるカラーコード等）

**テストケース:**
```typescript
✓ "#ff0000" → valid
✓ "red" → valid
✗ "" → invalid (空文字)
```

### birthday（誕生日）

**型:** `string`

**制約:**
- 必須: `min(1)`
- エラーメッセージ: "誕生日を入力してください"

**フォーマット:**
- ISO 8601形式: "YYYY-MM-DD"
- DateInput コンポーネントで自動変換

**フロントエンド検証:**
- DateInput で日付選択
- 未来日の選択も可能（制約なし）

**バックエンド検証:**
- 日付形式の妥当性検証
- DB保存時に date 型に変換

**テストケース:**
```typescript
✓ "2020-01-01" → valid
✓ "1950-12-31" → valid
✗ "" → invalid (空文字)
✗ "2020/01/01" → invalid (フォーマット違い)
✗ "invalid-date" → invalid
```

## バリデーション実行タイミング

### クライアント側

1. **リアルタイムバリデーション**
   - デフォルトでは無効
   - エラー後は各フィールドでリアルタイム検証

2. **送信時バリデーション**
   ```typescript
   handleSubmit((form) => handleRegister({form}))
   ```
   - 送信ボタンクリック時に全フィールド検証
   - エラーがある場合は送信中止

### サーバー側

1. **APIハンドラーでの検証**
   ```typescript
   POST /api/children
   PUT /api/children/[id]
   ```
   - リクエストボディをZodスキーマで検証
   - 不正データはステータス400で拒否

2. **DB保存前の検証**
   - Drizzle ORMの型チェック
   - 外部キー制約
   - NOT NULL制約

## エラー表示

### フィールド単位のエラー

```typescript
<Input.Wrapper 
  label="子供の名前" 
  required 
  error={errors.name?.message}
>
  <Input {...childRegister("name")} />
</Input.Wrapper>
```

- エラーメッセージはフィールド下部に赤字で表示
- エラーがある場合、フィールドが赤枠で強調

### グローバルエラー

- API エラー: トースト通知
- ネットワークエラー: トースト通知

## バリデーション無効化条件

### ローディング中

```typescript
disabled={isLoading || isSubmitting}
```

- データ取得中: `isLoading=true`
- 送信中: `isSubmitting=true`
- ボタンが無効化され、送信不可

### 認証エラー

- authGuard で親ユーザー以外を弾く
- 子供・ゲストは画面自体にアクセス不可

## カスタムバリデーション

現在は使用していないが、将来的に追加可能な検証：

```typescript
// 年齢範囲チェック（例）
birthday: z.string().refine((val) => {
  const age = calculateAge(val)
  return age >= 0 && age <= 18
}, "0歳から18歳までの誕生日を入力してください")

// 名前の長さチェック（例）
name: z.string().min(1).max(50, "名前は50文字以内で入力してください")
```
