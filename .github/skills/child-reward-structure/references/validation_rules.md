# 子供個別の報酬設定画面 - バリデーションルール

（2026年3月記載）

## Zodスキーマ定義

### 年齢別報酬フォームスキーマ

**ファイルパス**: `packages/web/app/(app)/reward/by-age/form.ts`

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

### レベル別報酬フォームスキーマ

**ファイルパス**: `packages/web/app/(app)/reward/by-level/form.ts`

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

## フィールド別バリデーションルール

### 年齢別報酬: rewards

**型**: `array`

**配列要素スキーマ**:
```typescript
z.object({
  age: z.number().int().min(0).max(100),
  amount: z.number().int().min(0)
})
```

#### age (年齢)

**検証項目**:
- 型: number (整数)
- 最小値: 0
- 最大値: 100

**エラーメッセージ**:
- デフォルトエラー（Zodのデフォルト）

#### amount (金額)

**検証項目**:
- 型: number (整数)
- 最小値: 0

**エラーメッセージ**:
- デフォルトエラー（Zodのデフォルト）

---

### レベル別報酬: rewards

**型**: `array`

**配列要素スキーマ**:
```typescript
z.object({
  level: z.number().int().min(1).max(100),
  amount: z.number().int().min(0)
})
```

#### level (レベル)

**検証項目**:
- 型: number (整数)
- 最小値: 1
- 最大値: 100

**エラーメッセージ**:
- デフォルトエラー（Zodのデフォルト）

#### amount (金額)

**検証項目**:
- 型: number (整数)
- 最小値: 0

**エラーメッセージ**:
- デフォルトエラー（Zodのデフォルト）

---

## ビジネスロジックバリデーション

### クライアント側

現時点で特別なビジネスロジックバリデーションなし。
Zodスキーマによる型チェックと範囲検証のみ。

### サーバー側

API側で追加のバリデーション実施（詳細は child-reward-api スキル参照）:
- 配列の重複チェック（同じ年齢/レベルが複数存在しないか）
- 権限チェック（親のみ設定可能）
- 子供の存在チェック

---

## エラー表示パターン

### レイアウトコンポーネント内のエラー

AgeRewardEditLayout / LevelRewardEditLayout 内で管理:

```tsx
<Input.Wrapper 
  label="年齢" 
  error={errors.rewards?.[index]?.age?.message}
>
  <NumberInput {...register(`rewards.${index}.age`)} />
</Input.Wrapper>
```

- 配列の各要素ごとにエラー表示
- `errors.rewards?.[index]?.field?.message` で取得

### 送信時のエラー

```typescript
onError: () => {
  toast.error("定額報酬の更新に失敗しました")
}
```

- API呼び出し失敗時はtoastでエラー通知
- handleAppErrorでグローバルエラーハンドリング

---

## 検証タイミング

1. **リアルタイム検証**: フィールド変更時
   - React Hook Form + Zod Resolver により自動実行
   - `errors`オブジェクトが自動更新

2. **送信時検証**: フォーム送信時
   - `handleSubmit`内でバリデーション実行
   - バリデーション失敗時は mutation スキップ

3. **サーバー検証**: API呼び出し時
   - サーバー側でも同様のスキーマで再検証
   - セキュリティとデータ整合性のため

---

## 追加の検証ルール候補

### 今後実装が想定される検証

1. **重複チェック**（クライアント側）
   - 同じ年齢/レベルが複数行に存在しないか
   - カスタムバリデータで実装可能

2. **連続性チェック**
   - 年齢/レベルが連続しているか
   - 欠損がないか

3. **金額の妥当性チェック**
   - 異常に大きな金額でないか
   - 前後の金額と比較して不自然でないか

これらは現時点では未実装だが、将来的に追加する可能性がある。
