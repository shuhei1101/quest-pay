(2026年3月記載)

# 家族メンバー子供閲覧画面 コンポーネント構造

## ファイル構成

```
app/(app)/families/members/child/[id]/view/
└── page.tsx                               # ページエントリーポイント（リダイレクト専用）

app/(app)/children/[id]/
├── page.tsx                               # 子供閲覧ページ
├── _components/
│   ├── ChildView.tsx                     # 子供閲覧メインコンポーネント
│   └── ChildViewLayout.tsx               # 子供情報表示レイアウト
└── _hook/
    └── useChild.ts                        # 子供データ取得フック

app/(core)/_components/
└── InviteCodePopup.tsx                    # 招待コードポップアップ（共通）
```

## コンポーネント階層

```mermaid
graph TD
    Page[families/.../view/page.tsx] -.リダイレクト.-> ChildPage[children/[id]/page.tsx]
    ChildPage --> ChildView[ChildView]
    
    ChildView --> Layout[ChildViewLayout]
    ChildView --> InviteButton[招待コードボタン]
    ChildView --> RewardButton[報酬履歴ボタン]
    
    Layout --> BasicInfo[子供基本情報]
    Layout --> Icon[アイコン表示]
    Layout --> Stats[統計情報]
    
    InviteButton --> Popup[InviteCodePopup]
    
    style Page fill:#f0f0f0
    style ChildPage fill:#e1f5e1
```

## 主要コンポーネント

### page.tsx (families/members/child/[id]/view/)
**責務:** リダイレクト専用ページ

**実装:**
```typescript
// families/members/child/[id]/view/page.tsx
export default function FamilyMemberChildViewPage({
  params: { id },
}: {
  params: { id: string }
}) {
  redirect(`/children/${id}`)
}
```

**注意点:**
- 実際の表示は `/children/[id]` に委譲
- URLの統一性のためのリダイレクト層

### ChildView
**責務:** 子供情報の表示とアクション管理

**ファイル:** `app/(app)/children/[id]/_components/ChildView.tsx`

**Props:**
```typescript
type Props = {
  childId: string
}
```

**使用コンポーネント:**
- `ChildViewLayout`: 子供情報の表示（データ表示専用）
- `InviteCodePopup`: 招待コードポップアップ
- `Button`: アクションボタン

**レイアウト構造:**
```
┌─────────────────────────────────────┐
│ Header (Title + Back Button)       │
├─────────────────────────────────────┤
│ ChildViewLayout                     │
│  - Avatar (Large)                   │
│  - Child Name                       │
│  - Age / Grade                      │
│  - Balance                          │
│  - Level & Experience               │
│  - Member Since                     │
├─────────────────────────────────────┤
│ Actions (user_idなしの場合)        │
│  [招待コード表示] ボタン           │
├─────────────────────────────────────┤
│ Actions                             │
│  [報酬履歴を見る] ボタン → /rewards│
└─────────────────────────────────────┘

FAB (Floating Action Button):
  - [編集] → /children/[id]/edit
  - 親のみ表示
```

**主要機能:**
- 子供詳細情報の表示
- 招待コード表示（user_idなしの場合）
- 招待コードの自動ポップアップ（初回表示時）
- 報酬履歴画面へ遷移
- 編集画面へ遷移（FAB）

### ChildViewLayout
**責務:** 子供情報の表示専用（プレゼンテーション）

**ファイル:** `app/(app)/children/[id]/_components/ChildViewLayout.tsx`

**Props:**
```typescript
type Props = {
  child: {
    id: string
    name: string
    icon: string
    age?: number
    grade?: string
    balance: number
    level: number
    experience_points: number
    next_level_experience: number
    created_at: string
    user_id: string | null
  }
}
```

**注意点:**
- **API呼び出し禁止**（データ表示のみ）
- プレゼンテーションロジックのみ
- 親コンポーネント（ChildView）からデータを受け取る

**表示項目:**
```
┌─────────────────────────┐
│    [Avatar Image]       │
│                         │
│      子供の名前         │
│    年齢: 10歳           │
│    学年: 小学4年生      │
├─────────────────────────┤
│ 残高: ¥1,500            │
├─────────────────────────┤
│ Level 5                 │
│ [■■■■■□□□□□] 50% │
│ 600 / 1200 XP           │
├─────────────────────────┤
│ 登録日: 2026年1月15日   │
└─────────────────────────┘
```

### InviteCodePopup
**責務:** 招待コードの表示とコピー機能

**ファイル:** `app/(core)/_components/InviteCodePopup.tsx`

**Props:**
```typescript
type Props = {
  opened: boolean
  onClose: () => void
  inviteCode: string
  childName: string
}
```

**表示内容:**
```
┌─────────────────────────────────┐
│ 招待コード                      │
├─────────────────────────────────┤
│ [子供の名前]さんの招待コード    │
│                                 │
│   ┌─────────────────┐          │
│   │  ABC-DEF-GHI    │          │
│   └─────────────────┘          │
│   [📋 コピー] ボタン           │
│                                 │
│ この招待コードを子供のアカウント│
│ 作成時に入力してもらってください│
│                                 │
│          [閉じる]               │
└─────────────────────────────────┘
```

**機能:**
- 招待コードの表示
- クリップボードへコピー
- コピー成功時のトースト通知

## FloatingActionButton (FAB)

### 編集FAB
**表示場所:** `app/(app)/children/[id]/layout.tsx`

**表示条件:**
- 親ユーザーのみ
- 子供閲覧画面（view）のみ

**実装:**
```typescript
// layout.tsx
{pathname.includes('/children/') && pathname.endsWith('/view') && (
  <FloatingActionButton
    icon={<IconEdit />}
    onClick={() => router.push(`/children/${id}/edit`)}
    position="bottom-right"
  />
)}
```

**デザイン:**
- 位置: 右下固定
- アイコン: 鉛筆アイコン
- 色: プライマリーカラー（青）

## 認証・権限管理

### アクセス制御
**ファイル:** `app/(app)/children/[id]/page.tsx`

```typescript
// authGuard設定
export const authGuard = {
  childNG: true,    // 子供アカウントはアクセス不可
  guestNG: true,    // ゲストアカウントはアクセス不可
}
```

**アクセス可能:**
- 親ユーザーのみ
- 自分の家族の子供のみ閲覧可能

## 共通UIコンポーネント使用

### Mantineコンポーネント
- `Avatar`: 子供アイコン
- `Card`: 情報カード
- `Stack`: 縦方向レイアウト
- `Group`: 横方向レイアウト
- `Text`: テキスト表示
- `Title`: タイトル表示
- `Button`: アクションボタン
- `Modal`: 招待コードポップアップ
- `Badge`: レベル・ステータス表示
- `Progress`: 経験値プログレスバー

### カスタム共通コンポーネント
- `FloatingActionButton`: FAB（編集ボタン）
- `InviteCodePopup`: 招待コードポップアップ
- `CopyButton`: クリップボードコピーボタン
