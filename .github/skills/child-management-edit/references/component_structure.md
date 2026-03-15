# 子供編集画面 - コンポーネント構造

（2026年3月記載）

## 画面階層

```
page.tsx (children/[id])
  └─ ChildForm.tsx (メインフォーム)
      ├─ Input (名前)
      ├─ ActionIcon + IconSelectPopup (アイコン選択)
      └─ DateInput (誕生日)

page.tsx (children/new)
  └─ ChildForm.tsx (メインフォーム)
```

## 主要コンポーネント

### ChildForm.tsx

**ファイルパス**: `packages/web/app/(app)/children/[id]/_components/ChildForm.tsx`

**責務**: 子供情報の入力と送信

**使用コンポーネント**:
- `@mantine/core`: Input, Button, Group, ActionIcon, Box, LoadingOverlay
- `@mantine/dates`: DateInput
- `@mantine/hooks`: useDisclosure
- カスタム: RenderIcon, IconSelectPopup

**Props**:
```typescript
{
  id?: string  // 子供ID（編集時）
}
```

**内部状態**:
- `id`: 子供ID（新規作成時は undefined → 作成後にセット）
- `childIconOpened`: アイコン選択ポップアップの開閉状態

## フォーム要素

### 入力フィールド

1. **名前** (Input)
   - ラベル: "子供の名前"
   - 必須: Yes
   - バリデーション: ChildFormSchema.name

2. **アイコン** (ActionIcon + IconSelectPopup)
   - ラベル: "子供アイコン"
   - 必須: Yes
   - コンポーネント: RenderIcon, IconSelectPopup
   - バリデーション: ChildFormSchema.iconId, iconColor

3. **誕生日** (DateInput)
   - ラベル: "誕生日"
   - 必須: Yes
   - ロケール: ja (日本語)
   - バリデーション: ChildFormSchema.birthday

## ローディング状態

- `isLoading`: データ取得中
- `isSubmitting`: 送信中
- LoadingOverlay で全体を覆う

## ボタン

- **保存** (Button): フォーム送信
  - variant: "gradient"
  - disabled: isLoading || isSubmitting
  - loading: isSubmitting
