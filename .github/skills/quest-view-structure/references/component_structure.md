# クエスト閲覧画面 コンポーネント構造

**最終更新: 2026年3月記載**

## 共通コンポーネント一覧

### 1. QuestViewHeader

**パス:** `app/(app)/quests/view/_components/QuestViewHeader.tsx`

**役割:** クエスト名を表示する共通ヘッダー

**Props:**
```typescript
{
  questName: string                                     // クエスト名
  headerColor?: { light: string, dark: string }         // ヘッダー背景色（任意、デフォルトはblue）
}
```

**使用例:**
```tsx
<QuestViewHeader 
  questName="お部屋の掃除" 
  headerColor={{ light: 'emerald.2', dark: 'emerald.8' }}
/>
```

---

### 2. QuestViewIcon

**パス:** `app/(app)/quests/view/_components/QuestViewIcon.tsx`

**役割:** クエストアイコンを表示

**Props:**
```typescript
{
  iconName?: string      // アイコン名（Tabler Icons）
  iconSize?: number      // アイコンサイズ
  iconColor?: string     // アイコン色
}
```

---

### 3. QuestConditionTab

**パス:** `app/(app)/quests/view/_components/QuestConditionTab.tsx`

**役割:** クエスト条件タブ（レベル、カテゴリ、達成条件、報酬、経験値、必要完了回数）

**Props:**
```typescript
{
  level: number                         // クエストレベル
  maxLevel?: number                     // 最大レベル（デフォルト5）
  category: string                      // カテゴリ名
  successCondition: string              // 達成条件
  requiredCompletionCount: number       // 必要完了回数
  currentCompletionCount?: number       // 現在の完了回数（進捗表示用）
  reward: number                        // 報酬額
  exp: number                           // 獲得経験値
  type?: "parent" | "child" | "online"  // クエストタイプ
  currentClearCount?: number            // 現在のクリア回数（レベルアップ用）
  requiredClearCount?: number           // 次レベルまでの必要クリア回数
  iconName?: string                     // アイコン名
  iconSize?: number                     // アイコンサイズ
  iconColor?: string                    // アイコン色
}
```

---

### 4. QuestDetailTab

**パス:** `app/(app)/quests/view/_components/QuestDetailTab.tsx`

**役割:** 依頼情報タブ（依頼主、依頼内容）

**Props:**
```typescript
{
  client: string          // 依頼主
  requestDetail: string   // 依頼内容
}
```

---

### 5. QuestOtherTab

**パス:** `app/(app)/quests/view/_components/QuestOtherTab.tsx`

**役割:** その他情報タブ（タグ、推奨年齢・月齢）

**Props:**
```typescript
{
  tags: string[]            // タグリスト
  ageFrom?: number | null   // 推奨年齢（開始）
  ageTo?: number | null     // 推奨年齢（終了）
  monthFrom?: number | null // 推奨月齢（開始）
  monthTo?: number | null   // 推奨月齢（終了）
}
```

---

### 6. ChildQuestViewFooter（子供用）

**パス:** `app/(app)/quests/view/_components/ChildQuestViewFooter.tsx`

**役割:** 子供用クエスト閲覧フッター（戻る、完了報告、報告取消）

**主要機能:**
- 戻るボタン
- 完了報告ボタン（disabled/enabledの制御）
- 完了報告取消ボタン（pending_reviewの場合のみ表示）

**状態による表示制御:**
```
not_started / in_progress  → 完了報告ボタン有効
pending_review            → 完了報告取消ボタン表示
completed                 → ボタン無効化
```

---

### 7. ParentQuestViewFooter（親用）

**パス:** `app/(app)/quests/family/[id]/view/_components/ParentQuestViewFooter.tsx`

**役割:** 親用の家族クエスト閲覧フッター（編集、削除）

**主要機能:**
- 編集ボタン
- 削除ボタン（確認モーダル表示）

---

## 画面タイプ別構造

### 家族クエスト閲覧画面

**ファイル構成:**
```
app/(app)/quests/family/[id]/view/
  ├── page.tsx                           # ページエントリーポイント
  ├── FamilyQuestViewScreen.tsx          # メイン画面コンポーネント
  ├── _components/
  │   ├── FamilyQuestViewLayout.tsx      # レイアウトコンポーネント
  │   └── ParentQuestViewFooter.tsx      # 親用フッター
  └── _hooks/
      └── useFamilyQuest.ts              # クエストデータ取得フック
```

**コンポーネント構成:**
- FamilyQuestViewScreen（メイン）
  - FamilyQuestViewLayout（レイアウト）
    - QuestViewHeader
    - Tabs
      - QuestConditionTab
      - QuestDetailTab
      - QuestOtherTab
  - SubMenuFAB（レベル選択・編集）
  - ParentQuestViewFooter（親用のみ）

---

### 公開クエスト閲覧画面

**ファイル構成:**
```
app/(app)/quests/public/[id]/view/
  ├── page.tsx
  └── PublicQuestViewScreen.tsx
```

**コンポーネント構成:**
- PublicQuestViewScreen（メイン）
  - QuestViewHeader
  - Tabs
    - QuestConditionTab
    - QuestDetailTab
    - QuestOtherTab
  - いいねボタン
  - コメントモーダル

---

### テンプレートクエスト閲覧画面

**ファイル構成:**
```
app/(app)/quests/template/[id]/
  ├── page.tsx
  ├── TemplateQuestViewScreen.tsx
  └── _components/
      ├── TemplateQuestDetail.tsx
      └── AdoptButton.tsx
```

**コンポーネント構成:**
- TemplateQuestViewScreen（メイン）
  - TemplateQuestDetail
    - QuestViewHeader
    - Tabs
      - QuestConditionTab
      - QuestDetailTab
      - QuestOtherTab
  - AdoptButton（採用ボタン）

---

### 子供クエスト閲覧画面

**ファイル構成:**
```
app/(app)/quests/family/[id]/view/child/[childId]/
  ├── page.tsx
  └── ChildQuestViewScreen.tsx
```

**コンポーネント構成:**
- ChildQuestViewScreen（メイン）
  - QuestViewHeader
  - Tabs
    - QuestConditionTab
    - QuestDetailTab
    - QuestOtherTab
  - ChildQuestViewFooter（完了報告・取消）

---

## コンポーネント配置パターン

### 標準レイアウト
```
┌─────────────────────────────┐
│ QuestViewHeader             │ ← ヘッダー
├─────────────────────────────┤
│ Tabs (条件/依頼情報/その他)   │ ← タブナビゲーション
├─────────────────────────────┤
│                             │
│ Tab Content                 │ ← タブコンテンツ
│                             │
│                             │
└─────────────────────────────┘
│ Footer/Actions              │ ← フッター/アクション
└─────────────────────────────┘
```

### レベル選択付きレイアウト（家族クエスト）
```
┌─────────────────────────────┐
│ QuestViewHeader             │
├─────────────────────────────┤
│ Tabs                         │
├─────────────────────────────┤
│ Tab Content                 │
└─────────────────────────────┘
                    ┌─────────┐
                    │ SubMenu │ ← レベル選択・編集FAB
                    │   FAB   │
                    └─────────┘
```
