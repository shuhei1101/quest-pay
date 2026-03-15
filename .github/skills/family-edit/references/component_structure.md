# 家族編集画面 - コンポーネント構造

（2026年3月記載）

## 画面階層

```
page.tsx (families/new)
  └─ FamilyNewScreen.tsx (メインコンポーネント)
      ├─ Input (ローカル家族名)
      ├─ Input (オンライン家族名)
      ├─ Input (家族ID)
      ├─ ActionIcon + IconSelectPopup (家紋選択)
      ├─ Input (親名)
      ├─ ActionIcon + IconSelectPopup (親アイコン選択)
      └─ DateInput (親の誕生日)
```

## 主要コンポーネント

### FamilyNewScreen.tsx

**ファイルパス**: `packages/web/app/(app)/families/new/FamilyNewScreen.tsx`

**責務**: 家族情報の新規作成

**使用コンポーネント**:
- `@mantine/core`: Input, Button, Group, ActionIcon, Box, LoadingOverlay
- `@mantine/dates`: DateInput
- `@mantine/hooks`: useDisclosure
- `@tabler/icons-react`: IconAt
- カスタム: RenderIcon, IconSelectPopup

**Props**: なし（新規作成専用）

**内部状態**:
- `familyIconOpened`: 家紋選択ポップアップの開閉状態
- `parentIconOpened`: 親アイコン選択ポップアップの開閉状態

## フォーム要素

### 入力フィールド

1. **ローカル家族名** (Input)
   - ラベル: "家族名"
   - 説明: "家族にのみ表示されます。"
   - 必須: Yes
   - バリデーション: FamilyRegisterFormSchema.localName

2. **オンライン家族名** (Input)
   - ラベル: "オンライン家族名"
   - 説明: "世界中に公開されます。"
   - 必須: No
   - バリデーション: FamilyRegisterFormSchema.onlineName

3. **家族ID** (Input)
   - ラベル: "家族ID"
   - 必須: Yes
   - leftSection: IconAt（@マーク）
   - バリデーション: FamilyRegisterFormSchema.displayId

4. **家紋** (ActionIcon + IconSelectPopup)
   - ラベル: "家紋"
   - 必須: Yes
   - コンポーネント: RenderIcon, IconSelectPopup
   - バリデーション: FamilyRegisterFormSchema.familyIconId, familyIconColor

5. **親の名前** (Input)
   - ラベル: "親の名前"
   - 説明: "あなたの名前を入力してください。"
   - 必須: Yes
   - バリデーション: FamilyRegisterFormSchema.parentName

6. **親アイコン** (ActionIcon + IconSelectPopup)
   - ラベル: "親アイコン"
   - 必須: Yes
   - コンポーネント: RenderIcon, IconSelectPopup
   - バリデーション: FamilyRegisterFormSchema.parentIconId, parentIconColor

7. **親の誕生日** (DateInput)
   - ラベル: "誕生日"
   - 必須: Yes
   - ロケール: ja (日本語)
   - バリデーション: FamilyRegisterFormSchema.parentBirthday

## アイコン選択ポップアップ

### 家紋選択ポップアップ

```tsx
<IconSelectPopup 
  opened={familyIconOpened} 
  close={closeFamilyIcon} 
  setIcon={(iconId: number) => setFamilyValue("familyIconId", iconId)}
  setColor={(iconColor: string) => setFamilyValue("familyIconColor", iconColor)}
  currentIconId={watchFamily().familyIconId} 
  currentColor={watchFamily().familyIconColor} 
/>
```

### 親アイコン選択ポップアップ

```tsx
<IconSelectPopup 
  opened={parentIconOpened} 
  close={closeParentIcon} 
  setIcon={(iconId: number) => setFamilyValue("parentIconId", iconId)}
  setColor={(iconColor: string) => setFamilyValue("parentIconColor", iconColor)}
  currentIconId={watchFamily().parentIconId} 
  currentColor={watchFamily().parentIconColor} 
/>
```

## ボタン

- **保存** (Button): フォーム送信
  - variant: "gradient"
  - type: "submit"

## ローディング状態

- LoadingOverlay: 現時点では未使用（実装予定）
- フォーム送信中の状態管理が今後必要
