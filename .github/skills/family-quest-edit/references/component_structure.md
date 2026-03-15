# 家族クエスト編集 - コンポーネント構造

**2026年3月記載**

## 画面コンポーネント階層

```
Page (page.tsx)
└── FamilyQuestEdit
    └── QuestEditLayout (共通レイアウト)
        ├── ScrollableTabs
        │   ├── Tab: 基本設定
        │   │   └── BasicSettings
        │   │       ├── Input (クエスト名)
        │   │       ├── ActionIcon + RenderIcon (アイコン選択)
        │   │       ├── QuestCategoryCombobox (カテゴリ)
        │   │       ├── PillsInput (タグ)
        │   │       ├── TextInput (依頼者氏名)
        │   │       ├── Textarea (依頼詳細)
        │   │       ├── Switch + NumberInput (対象年齢)
        │   │       └── Switch + Select (公開時期)
        │   ├── Tab: 詳細設定
        │   │   └── DetailSettings
        │   │       ├── ScrollableTabs (レベル別)
        │   │       │   └── LevelDetailForm (各レベル)
        │   │       │       ├── Textarea (達成条件)
        │   │       │       ├── NumberInput (必要クリア回数)
        │   │       │       ├── NumberInput (報酬)
        │   │       │       ├── NumberInput (経験値)
        │   │       │       └── NumberInput (必要完了回数)
        │   │       └── LevelCopyButton
        │   └── Tab: 子供設定
        │       └── ChildSettings
        │           └── Paper[] (子供リスト)
        │               ├── RenderIcon (子供アイコン)
        │               ├── Anchor (子供名)
        │               ├── ActionIcon (子供クエスト画面リンク)
        │               └── Switch (公開/非公開)
        │
        ├── FloatingActionButton (FAB)
        │   ├── 保存
        │   ├── 公開 (または 公開中確認)
        │   └── 削除
        │
        └── IconSelectPopup (モーダル)
```

## 主要コンポーネント詳細

### FamilyQuestEdit

**ファイル:** `app/(app)/quests/family/[id]/FamilyQuestEdit.tsx`

**Props:**
- `id?: string` - 家族クエストID（新規作成時はundefined）

**責務:**
- フォーム全体の管理
- タブ間のエラーチェック
- FABアクションの定義
- 保存・削除・公開の制御

**状態:**
- `familyQuestId` - 家族クエストID（登録成功時に更新）
- `iconPopupOpened` - アイコン選択ポップアップの開閉
- `submitLoading` - 送信中フラグ
- `activeLevel` - 詳細設定の現在のレベルタブ
- `tagInputValue` - タグ入力値
- `isComposing` - IME入力状態
- `levels` - レベル別保存状態

**使用フック:**
- `useFamilyQuestForm({familyQuestId})` - フォーム状態管理
- `useRegisterFamilyQuest({setId})` - 新規作成
- `useUpdateFamilyQuest()` - 更新
- `useDeleteFamilyQuest()` - 削除
- `usePublishFamilyQuest()` - 公開
- `usePublicQuest({familyQuestId})` - 公開クエスト取得

### BasicSettings

**ファイル:** `app/(app)/quests/family/[id]/_components/BasicSettings.tsx`

**Props:**
- react-hook-form の register, errors, setValue, watch
- openIconPopup: アイコン選択ポップアップを開く関数
- tagInputValue, setTagInputValue: タグ入力状態
- handleTag: タグ追加ハンドラ
- isComposing, setIsComposing: IME入力状態

**責務:**
- 基本情報の入力フォーム
- クエスト名、アイコン、カテゴリ、タグ、依頼情報、対象年齢、公開時期

**状態:**
- `hasTargetAge` - 対象年齢設定の有無
- `hasPublishedMonth` - 公開時期設定の有無

### DetailSettings

**ファイル:** `app/(app)/quests/family/[id]/_components/DetailSettings.tsx`

**Props:**
- activeLevel, setActiveLevel: 現在アクティブなレベルタブ
- levels: レベル別保存状態
- onSave: レベル保存ハンドラ
- react-hook-form の register, errors, setValue, watch

**責務:**
- レベル別の詳細設定
- 達成条件、必要クリア回数、報酬、経験値、必要完了回数
- レベルの追加・削除・コピー

**主要機能:**
- `handleAddLevel`: レベルを追加（最大5レベル）
- `handleRemoveLevel`: レベルを削除（最低1レベル）
- レベル間のデータコピー

### ChildSettings

**ファイル:** `app/(app)/quests/family/[id]/_components/ChildSettings.tsx`

**Props:**
- watch, setValue: react-hook-form
- familyQuestId?: 家族クエストID

**責務:**
- 子供ごとの公開/非公開設定
- 子供クエスト画面へのリンク

**主要機能:**
- `toggleChildActivate`: 子供の公開フラグ切り替え
- `getChildSetting`: 子供の現在の設定取得

**使用フック:**
- `useChildren()` - 家族の子供一覧取得

## フォームレイアウト

### 基本設定タブ

1. クエスト名 (必須)
2. アイコン
3. カテゴリ
4. タグ (複数入力可能)
5. 依頼者氏名
6. 依頼詳細
7. 対象年齢 (スイッチで有効化)
8. 公開時期 (スイッチで有効化)

### 詳細設定タブ

- レベル別タブ（1〜5レベル、動的追加・削除可能）
- 各レベル:
  1. 達成条件 (必須)
  2. 必要クリア回数 (レベル5以外は必須)
  3. 報酬
  4. 経験値
  5. 必要完了回数

### 子供設定タブ

- 子供ごとのSwitchコントロール
- 子供クエスト画面へのリンク（クエストが割り当てられている場合）

## ローディング状態

### LoadingOverlay

**QuestEditLayout内で管理:**
```typescript
visible={questLoading}
```

### FABボタンの無効化

**送信中の無効化:**
```typescript
disabled={submitLoading}
```

## エラー表示

### タブごとのエラーバッジ

```typescript
hasBasicErrors: name, iconId, iconColor, categoryId, tags, client, requestDetail, ageFrom, ageTo, monthFrom, monthTo
hasDetailErrors: details
hasChildErrors: childSettings
```

エラーがあるタブには赤いバッジが表示されます。
