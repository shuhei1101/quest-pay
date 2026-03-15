# 家族編集画面 - バリデーションルール

（2026年3月記載）

## Zodスキーマ定義

**ファイルパス**: `packages/web/app/(app)/families/new/form.ts`

```typescript
import { z } from "zod"
import { 
  BirthdaySchema, 
  DisplayIdSchema, 
  IconColorSchema, 
  IconIdSchema, 
  LocalNameSchema, 
  OnlineNameSchema, 
  UserNameSchema 
} from "@/app/(core)/schema"

export const FamilyRegisterFormSchema = z.object({
  displayId: DisplayIdSchema,
  localName: LocalNameSchema,
  onlineName: OnlineNameSchema,
  familyIconId: IconIdSchema,
  familyIconColor: IconColorSchema,
  parentName: UserNameSchema,
  parentIconId: IconIdSchema,
  parentIconColor: IconColorSchema,
  parentBirthday: BirthdaySchema,
})

export type FamilyRegisterFormType = z.infer<typeof FamilyRegisterFormSchema>
```

## フィールド別バリデーションルール

### 1. displayId (家族ID)

**型**: `string`

**ルール**: DisplayIdSchema（共通スキーマ）
```typescript
// @/app/(core)/schema より
z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/)
```

**検証項目**:
- 必須チェック
- 最小文字数: 3
- 最大文字数: 20
- 使用可能文字: 半角英数字、アンダースコア、ハイフン

**エラーメッセージ**:
- 長さ不足: "3文字以上必要です"
- 長さ超過: "20文字以内で入力してください"
- 不正文字: "半角英数字、アンダースコア、ハイフンのみ使用可能です"

---

### 2. localName (ローカル家族名)

**型**: `string`

**ルール**: LocalNameSchema（共通スキーマ）
```typescript
// @/app/(core)/schema より
z.string().min(1).max(50)
```

**検証項目**:
- 必須チェック
- 最小文字数: 1
- 最大文字数: 50

**エラーメッセージ**:
- 未入力: "家族名は必須です"
- 長さ超過: "50文字以内で入力してください"

---

### 3. onlineName (オンライン家族名)

**型**: `string | null`

**ルール**: OnlineNameSchema（共通スキーマ）
```typescript
// @/app/(core)/schema より
z.string().min(1).max(50).nullable()
```

**検証項目**:
- 任意入力（null 許容）
- 入力時: 最小文字数 1、最大文字数 50

**エラーメッセージ**:
- 長さ超過: "50文字以内で入力してください"

---

### 4. familyIconId (家紋ID)

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

### 5. familyIconColor (家紋カラー)

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

### 6. parentName (親の名前)

**型**: `string`

**ルール**: UserNameSchema（共通スキーマ）
```typescript
// @/app/(core)/schema より
z.string().min(1).max(50)
```

**検証項目**:
- 必須チェック
- 最小文字数: 1
- 最大文字数: 50

**エラーメッセージ**:
- 未入力: "名前は必須です"
- 長さ超過: "50文字以内で入力してください"

---

### 7. parentIconId (親アイコンID)

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

### 8. parentIconColor (親アイコンカラー)

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

### 9. parentBirthday (親の誕生日)

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

API側で追加のバリデーション実施（詳細は family-api スキル参照）:
- displayId の重複チェック
- 親アカウントの認証状態チェック
- ユーザーあたりの家族作成数制限チェック

---

## エラー表示パターン

### フィールドごとのエラー

```tsx
<Input.Wrapper 
  label="家族名" 
  required 
  error={errors.localName?.message}
  description="家族にのみ表示されます。"
>
  <Input {...familyRegister("localName")} />
</Input.Wrapper>
```

- `errors.localName?.message`: Zodでバリデーション失敗時に自動設定
- `Input.Wrapper`の`error` propでエラーメッセージ表示

### 送信時のエラー

```typescript
try {
  await postFamily(form)
  toast.success("家族を作成しました")
} catch (error) {
  toast.error("家族の作成に失敗しました")
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

---

## 今後の拡張予定

### 追加検証ルール候補

1. **displayId の即時重複チェック**
   - APIを呼び出してリアルタイムで重複確認
   - onBlur または debounce で実装

2. **パスワード関連**
   - 家族作成時にパスワード設定が必要な場合
   - パスワード強度チェック

3. **メールアドレス**
   - 親のメールアドレス登録
   - メールアドレス形式チェック

これらは現時点では未実装だが、将来的に追加する可能性がある。
