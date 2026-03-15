# 報酬設定 - コンポーネント構造

**2026年3月記載**

## 画面コンポーネント階層

### 家族全体の報酬設定

```
Page (/reward/page.tsx)
└── RewardEdit
    └── Box (相対配置)
        ├── LoadingOverlay
        ├── PageHeader (定額報酬の編集)
        ├── ScrollableTabs
        │   ├── Tab: お小遣い
        │   │   └── AgeRewardEditLayout
        │   │       ├── AgeSettingTypeSegmentedControl (年齢型選択)
        │   │       ├── Table (年齢別報酬テーブル)
        │   │       │   └── NumberInput[] (報酬額入力)
        │   │       └── Button (保存)
        │   └── Tab: ランク報酬
        │       └── LevelRewardEditLayout
        │           ├── Table (レベル別報酬テーブル)
        │           │   └── NumberInput[] (報酬額入力)
        │           └── Button (保存)
        └── SubMenuFAB (保存・リセット)
```

### 子供個別の報酬設定

```
Page (/children/[id]/reward/page.tsx)
└── ChildRewardEdit
    └── Box (相対配置)
        ├── LoadingOverlay
        ├── PageHeader (子供名 + 定額報酬の編集)
        ├── ScrollableTabs
        │   ├── Tab: お小遣い
        │   │   └── AgeRewardEditLayout
        │   └── Tab: ランク報酬
        │       └── LevelRewardEditLayout
        └── SubMenuFAB (保存・リセット)
```

## 主要コンポーネント詳細

### RewardEdit（家族全体）

**ファイル:** `app/(app)/reward/_components/RewardEdit.tsx`

**責務:**
- 家族全体の年齢別・レベル別報酬テーブルの表示と編集
- タブ切り替え（お小遣い/ランク報酬）
- 保存・リセット操作

**状態:**
- `activeTab` - 現在アクティブなタブ ("age" | "level")

**使用フック:**
- `useAgeRewardForm()` - 年齢別報酬フォーム管理
- `useLevelRewardForm()` - レベル別報酬フォーム管理

**Mutation:**
- `ageUpdateMutation` - 年齢別報酬更新
- `levelUpdateMutation` - レベル別報酬更新

### ChildRewardEdit（子供個別）

**ファイル:** `app/(app)/children/[id]/reward/_components/ChildRewardEdit.tsx`

**Props:**
- `childId: string` - 子供ID

**責務:**
- 子供個別の年齢別・レベル別報酬テーブルの表示と編集
- タブ切り替え（お小遣い/ランク報酬）
- 保存・リセット操作

**状態:**
- `activeTab` - 現在アクティブなタブ ("age" | "level")

**使用フック:**
- `useChildAgeRewardForm({childId})` - 子供の年齢別報酬フォーム管理
- `useChildLevelRewardForm({childId})` - 子供のレベル別報酬フォーム管理

### AgeRewardEditLayout（共通レイアウト）

**ファイル:** `app/(app)/reward/by-age/_components/AgeRewardEditLayout.tsx`

**Props:**
```typescript
{
  form: {
    register: UseFormRegister<AgeRewardFormType>
    errors: FieldErrors<AgeRewardFormType>
    setValue: UseFormSetValue<AgeRewardFormType>
    watch: UseFormWatch<AgeRewardFormType>
    isLoading: boolean
  }
  onSubmit: (data: AgeRewardFormType) => void
}
```

**責務:**
- 年齢型選択（年齢型 or 学年型）
- 年齢別報酬テーブル表示
- 各行の報酬額入力

**機能:**
- 年齢型切替でテーブル行が再計算
- 数値入力（報酬額）

### LevelRewardEditLayout（共通レイアウト）

**ファイル:** `app/(app)/reward/by-level/_components/LevelRewardEditLayout.tsx`

**Props:**
```typescript
{
  form: {
    register: UseFormRegister<LevelRewardFormType>
    errors: FieldErrors<LevelRewardFormType>
    setValue: UseFormSetValue<LevelRewardFormType>
    watch: UseFormWatch<LevelRewardFormType>
    isLoading: boolean
  }
  onSubmit: (data: LevelRewardFormType) => void
}
```

**責務:**
- レベル別報酬テーブル表示（1〜100レベル）
- 各レベルの報酬額入力

**機能:**
- 100レベル分のテーブル表示
- 数値入力（報酬額）

## フォームレイアウト

### お小遣いタブ（年齢別報酬）

1. **年齢型選択** (SegmentedControl)
   - 年齢型（0歳〜100歳）
   - 学年型（小1〜高3、その他）

2. **報酬テーブル**
   - 左列: 年齢 or 学年
   - 右列: 報酬額（NumberInput）

3. **保存ボタン**

### ランク報酬タブ（レベル別報酬）

1. **報酬テーブル**
   - 左列: レベル（1〜100）
   - 右列: 報酬額（NumberInput）

2. **保存ボタン**

## ローディング状態

### LoadingOverlay

**表示条件:**
```typescript
visible={isLoading}
```

- `isLoading`: フォームデータ取得中 or 送信中

**スタイル:**
- zIndex: 1000
- radius: "sm"
- blur: 2

## FABアクション

### SubMenuFAB

**アクション:**
- **保存**: 現在のタブのフォームを送信
- **リセット**: 家族全体設定にリセット（子供個別画面のみ）

## 共通化戦略

### レイアウトコンポーネントの共通化

- `AgeRewardEditLayout` と `LevelRewardEditLayout` は家族・子供両方で使用
- Props経由でフォームとonSubmitを渡すだけで再利用可能

### フォームスキーマの共通化

- `by-age/form.ts` と `by-level/form.ts` は家族・子供共通
- 家族: `useAgeRewardForm` / `useLevelRewardForm`
- 子供: `useChildAgeRewardForm` / `useChildLevelRewardForm`

### API統合の違い

**家族全体:**
- `PUT /api/reward/by-age/table` (家族全体の年齢別報酬)
- `PUT /api/reward/by-level/table` (家族全体のレベル別報酬)

**子供個別:**
- `PUT /api/children/[id]/reward/by-age/table` (子供個別の年齢別報酬)
- `PUT /api/children/[id]/reward/by-level/table` (子供個別のレベル別報酬)
