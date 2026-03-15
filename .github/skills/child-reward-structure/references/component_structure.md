# 子供個別の報酬設定画面 - コンポーネント構造

（2026年3月記載）

## 画面階層

```
page.tsx (children/[id]/reward)
  └─ ChildRewardEdit.tsx (メインコンポーネント)
      ├─ ScrollableTabs (タブ切り替え)
      │   ├─ Tabs.Panel (お小遣い)
      │   │   └─ AgeRewardEditLayout
      │   └─ Tabs.Panel (ランク報酬)
      │       └─ LevelRewardEditLayout
      └─ SubMenuFAB (保存/破棄/閲覧ボタン)

page.tsx (children/[id]/reward/view)
  └─ ChildRewardView.tsx (閲覧コンポーネント)
      ├─ ScrollableTabs
      │   ├─ Tabs.Panel (お小遣い)
      │   │   └─ AgeRewardViewLayout
      │   └─ Tabs.Panel (ランク報酬)
      │       └─ LevelRewardViewLayout
      └─ SubMenuFAB (編集ボタン)
```

## 主要コンポーネント

### ChildRewardEdit.tsx

**ファイルパス**: `packages/web/app/(app)/children/[id]/reward/_components/ChildRewardEdit.tsx`

**責務**: 子供個別の報酬設定編集管理

**使用コンポーネント**:
- `@mantine/core`: Box, Text, LoadingOverlay, Button, Group, ActionIcon, Tabs
- カスタム: ScrollableTabs, SubMenuFAB
- レイアウト: AgeRewardEditLayout, LevelRewardEditLayout

**Props**:
```typescript
{
  childId: string  // 子供ID
}
```

**内部状態**:
- `activeTab`: 現在のタブ ("age" | "level")

### 共通レイアウトコンポーネント

#### AgeRewardEditLayout

**ファイルパス**: `packages/web/app/(app)/reward/by-age/_components/AgeRewardEditLayout.tsx`

**責務**: 年齢別報酬の編集UI提供

**Props**:
```typescript
{
  form: UseFormReturn<AgeRewardFormType>
  onSubmit: (data: AgeRewardFormType) => void
}
```

#### LevelRewardEditLayout

**ファイルパス**: `packages/web/app/(app)/reward/by-level/_components/LevelRewardEditLayout.tsx`

**責務**: レベル別報酬の編集UI提供

**Props**:
```typescript
{
  form: UseFormReturn<LevelRewardFormType>
  onSubmit: (data: LevelRewardFormType) => void
}
```

## タブ構成

### お小遣いタブ (age)
- 年齢ごとの定額報酬設定
- AgeRewardEditLayout を使用

### ランク報酬タブ (level)
- レベルごとの報酬設定
- LevelRewardEditLayout を使用

## FABアクション

### 保存 (IconDeviceFloppy)
- 色: blue
- 動作: 現在のタブのフォームを送信
- 条件: activeTab に応じて age または level の mutation 実行

### 破棄 (IconRotate)
- 色: orange
- 動作: フォームを取得時の値にリセット
- 確認: window.confirm で破棄確認

### 閲覧 (IconEye)
- 色: violet
- 動作: 閲覧画面へ遷移
- 遷移先: CHILD_REWARD_VIEW_URL(childId)

## ローディング状態

```typescript
const isLoading = 
  ageForm.isLoading || 
  levelForm.isLoading || 
  ageUpdateMutation.isPending || 
  levelUpdateMutation.isPending
```

- データ取得中 or 更新中は LoadingOverlay 表示
- 初期ロード中（isLoading）は null を返して非表示
