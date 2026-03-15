# 家族クエスト閲覧画面 - コンポーネント構造

**(2026年3月15日 14:30記載)**

## ファイル構成

### メイン画面コンポーネント
```
app/(app)/quests/family/[id]/view/
├── page.tsx                          # ルートページ（リダイレクト）
├── FamilyQuestViewScreen.tsx         # 閲覧画面メイン（ビジネスロジック + FAB制御）
└── _components/
    └── FamilyQuestViewLayout.tsx     # レイアウト（プレゼンテーション）
```

### 子供専用ビュー
```
app/(app)/quests/family/[id]/view/child/[childId]/
├── page.tsx                           # 子供専用ルート
└── ChildQuestViewScreen.tsx           # 子供専用画面
```

### 共通コンポーネント
```
app/(app)/quests/_components/
├── QuestDetailDisplay.tsx             # クエスト詳細表示
└── ChildQuestActions.tsx              # 子供用アクションボタン
```

## コンポーネント階層

```
FamilyQuestViewScreen (Container)
├── FamilyQuestViewLayout (Presentation)
│   ├── Header (タイトル + アイコン)
│   ├── Tabs (クエスト条件/依頼情報/その他)
│   │   ├── Tab 1: クエスト条件
│   │   │   ├── レベル表示
│   │   │   ├── 成功条件
│   │   │   ├── 報酬・経験値
│   │   │   └── 対象年齢
│   │   ├── Tab 2: 依頼情報
│   │   │   ├── クライアント
│   │   │   └── 詳細説明
│   │   └── Tab 3: その他
│   │       ├── タグ一覧
│   │       └── 推奨年齢
│   └── Loading Overlay
├── SubMenuFAB (FAB制御)
│   ├── 戻るボタン
│   ├── 編集ボタン（親のみ）
│   ├── 削除ボタン（親のみ）
│   ├── 公開ボタン（親のみ）
│   └── レベル選択ボタン（複数レベルがある場合）
└── Level Selection Menu (ポップアップ)
    └── レベル選択リスト
```

## 主要コンポーネント詳細

### FamilyQuestViewScreen
**責務:** ビジネスロジック、状態管理、FAB制御

**State:**
- `selectedLevel`: 選択中のレベル
- `levelMenuOpened`: レベル選択メニューの開閉状態

**主要機能:**
- クエストデータの取得（useFamilyQuest）
- レベル選択の管理
- FABメニューの制御（SubMenuFAB）
- 編集・削除・公開アクションのハンドリング

**Props:**
```typescript
{
  id: string  // 家族クエストID
}
```

### FamilyQuestViewLayout
**責務:** プレゼンテーション、タブ切り替え

**Props:**
```typescript
{
  questName: string
  backgroundColor: { light: string, dark: string }
  iconName?: string
  iconSize?: number
  iconColor?: string
  isLoading: boolean
  level: number
  category: string
  successCondition: string
  reward: number
  exp: number
  requiredCompletionCount: number
  client: string
  requestDetail: string
  tags: string[]
  ageFrom?: number
  ageTo?: number
  monthFrom?: number
  monthTo?: number
  requiredClearCount: number | null
  availableLevels: number[]
  onLevelChange: (level: number) => void
}
```

### ChildQuestViewScreen
**責務:** 子供専用ビューの制御

**主要機能:**
- 子供クエスト詳細の表示
- 受注・完了報告・キャンセルアクション
- 子供専用FABメニュー

**Props:**
```typescript
{
  id: string        // 家族クエストID
  childId: string   // 子供ID
}
```

## レイアウト構造

### タブ構造
- **クエスト条件タブ:** レベル、成功条件、報酬・経験値、必須完了回数
- **依頼情報タブ:** クライアント、詳細説明
- **その他タブ:** タグ、対象年齢

### FABボタン配置
- 画面右下に固定配置
- メインFAB + サブメニュー（展開式）
- レベル選択メニューは独立したポップアップ

### レスポンシブ対応
- モバイル: FAB位置 right: 20px
- デスクトップ: FAB位置 right: 40px
