# 家族メンバー子供編集 - コンポーネント構造

**2026年3月記載**

## 画面コンポーネント階層

```
Page (page.tsx)
└── ChildForm (ChildEdit.tsx)
    ├── Input.Wrapper (子供名)
    │   └── Input
    ├── Input.Wrapper (アイコン)
    │   └── ActionIcon
    │       └── RenderIcon
    ├── Input.Wrapper (誕生日)
    │   └── DateInput (@mantine/dates)
    ├── Button (保存)
    └── IconSelectPopup (モーダル)
        ├── アイコン種類選択
        └── カラー選択
```

## 主要コンポーネント詳細

### ChildForm

**ファイル:** `app/(app)/children/[id]/_components/ChildEdit.tsx`

**Props:**
- `id?: string` - 子供ID（新規作成時はundefined）

**責務:**
- 子供情報の入力フォーム管理
- アイコン選択ポップアップの制御
- フォーム送信処理

**状態:**
- `id` - 子供ID（登録成功時に更新）
- `childIconOpened` - アイコン選択ポップアップの開閉状態

**使用フック:**
- `useChildForm({childId})` - フォーム状態管理
- `useRegisterChild({setId})` - 登録/更新処理
- `useIcons()` - アイコンマスタデータ

### IconSelectPopup

**ファイル:** `app/(app)/icons/_components/IconSelectPopup.tsx`

**Props:**
- `opened: boolean` - モーダルの開閉状態
- `close: () => void` - モーダルを閉じる関数
- `setIcon: (iconId: number) => void` - アイコンIDセッター
- `setColor: (iconColor: string) => void` - カラーセッター
- `currentIconId: number` - 現在選択中のアイコンID
- `currentColor: string | null` - 現在選択中のカラー

## フォームレイアウト

### 入力項目の順序

1. **子供の名前** (必須)
   - テキスト入力
   - バリデーション: 必須チェック

2. **子供アイコン** (必須)
   - アイコンボタン（クリックでモーダル表示）
   - モーダル内でアイコン種類とカラーを選択
   - バリデーション: iconId, iconColor共に必須

3. **誕生日** (必須)
   - DatePicker（日本語ロケール）
   - バリデーション: 必須チェック

### ボタン配置

- **保存ボタン** (グラデーション、左寄せ)
  - ローディング状態表示
  - 送信中/データ読み込み中は無効化

## ローディング状態

### LoadingOverlay

**表示条件:**
```typescript
visible={isLoading || isSubmitting}
```

- `isLoading`: useChildFormのデータ取得中
- `isSubmitting`: useRegisterChildの送信中

**スタイル:**
- zIndex: 1000
- radius: "sm"
- blur: 2
