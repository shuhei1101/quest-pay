# 子供編集画面 - バリデーションルール

（2026年3月記載）

## Zodスキーマ定義

**ファイルパス**: `packages/web/app/(app)/children/[id]/form.ts`

```typescript
import { z } from "zod"
import { BirthdaySchema, IconColorSchema, IconIdSchema } from "@/app/(core)/schema"

export const ChildFormSchema = z.object({
  name: z.string({error: "氏名は必須です。"}),
  iconId: IconIdSchema,
  iconColor: IconColorSchema,
  birthday: BirthdaySchema,
})
```

## フィールド別バリデーションルール

### 1. name (名前)

**型**: `string`

**ルール**:
```typescript
z.string({error: "氏名は必須です。"})
```

**検証項目**:
- 必須チェック (required)
- 型チェック (string)

**エラーメッセージ**:
- カスタムエラー: "氏名は必須です。"

---

### 2. iconId (アイコンID)

**型**: `number`

**ルール**: IconIdSchema（共通スキーマ）
```typescript
// @/app/(core)/schema より
z.number().int().min(1)
```

**検証項目**:
- 必須チェック
- 整数チェック
- 最小値: 1

**エラーメッセージ**:
- デフォルトエラー（Zodのデフォルト）

---

### 3. iconColor (アイコンカラー)

**型**: `string`

**ルール**: IconColorSchema（共通スキーマ）
```typescript
// @/app/(core)/schema より
z.string()
```

**検証項目**:
- 必須チェック
- 型チェック (string)

**エラーメッセージ**:
- デフォルトエラー（Zodのデフォルト）

---

### 4. birthday (誕生日)

**型**: `string | Date`

**ルール**: BirthdaySchema（共通スキーマ）
```typescript
// @/app/(core)/schema より
z.union([z.string(), z.date()])
```

**検証項目**:
- 必須チェック
- 型チェック (string または Date)

**エラーメッセージ**:
- デフォルトエラー（Zodのデフォルト）

---

## ビジネスロジックバリデーション

### クライアント側

現時点で特別なビジネスロジックバリデーションなし。
Zodスキーマによる型チェックとフォーマット検証のみ。

### サーバー側

API側で追加のバリデーション実施（詳細は child-management-api スキル参照）:
- displayId の重複チェック
- 家族メンバー数制限チェック
- 権限チェック（親のみ作成・編集可能）

---

## エラー表示パターン

### フィールドごとのエラー

```tsx
<Input.Wrapper 
  label="子供の名前" 
  required 
  error={errors.name?.message}
>
  <Input {...childRegister("name")} />
</Input.Wrapper>
```

- `errors.name?.message`: Zodでバリデーション失敗時に自動設定
- `Input.Wrapper`の`error` propでエラーメッセージ表示

### 送信時のエラー

```typescript
try {
  await postChild(form)
  toast.success("子供を登録しました")
} catch (error) {
  toast.error("子供の登録に失敗しました")
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
   - バリデーション失敗時は送信処理スキップ

3. **サーバー検証**: API呼び出し時
   - サーバー側でも同様のスキーマで再検証
   - セキュリティとデータ整合性のため
