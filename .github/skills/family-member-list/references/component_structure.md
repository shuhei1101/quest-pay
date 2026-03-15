(2026年3月15日 14:30記載)

# 家族メンバー一覧画面 コンポーネント構造

## ファイル構成

```
packages/web/app/(app)/families/members/
├── page.tsx                            # ルート（親のみアクセス可）
├── layout.tsx                          # 2ペインレイアウト実装
├── FamilyMemberListScreen.tsx          # 一覧画面（空実装）
└── _components/
    └── FamilyMemberList.tsx            # メンバー一覧表示

packages/web/app/(app)/children/_components/
└── ChildCardLayout.tsx                 # 子供カード

packages/web/app/(app)/parents/_components/
└── ParentCardLayout.tsx                # 親カード
```

## コンポーネント階層

```
page.tsx (Server Component)
└── layout.tsx (Client Component)
    ├── FamilyMemberList (左ペイン)
    │   ├── ParentCardLayout × N (親一覧)
    │   └── ChildCardLayout × N (子供一覧)
    └── {children} (右ペイン - 詳細画面)
```

## 2ペイン設計

### layout.tsx
**パス**: `app/(app)/families/members/layout.tsx`  
**タイプ**: Client Component (`"use client"`)

**責務**:
- PC/モバイルでの表示切り替え
- 2ペインレイアウト管理（PC時）
- FAB配置制御

**レイアウトパターン**:

#### デスクトップ（タブレット以上）
```
┌────────────────────────────────────────────┐
│  ┌─────────────┐ │ ┌──────────────────┐  │
│  │ 左ペイン    │ │ │  右ペイン         │  │
│  │ (一覧)      │ │ │  (詳細)          │  │
│  │             │ │ │                  │  │
│  │ ParentCard  │ │ │  選択メンバーの  │  │
│  │ ParentCard  │ │ │  詳細情報        │  │
│  │ ChildCard   │ │ │                  │  │
│  │ ChildCard   │ │ │                  │  │
│  └─────────────┘ │ └──────────────────┘  │
│                                            │
│  [FAB: 追加]        [FAB: 編集]           │
└────────────────────────────────────────────┘
```

#### モバイル・タブレット
```
# 一覧表示時
┌────────────────┐
│ ヘッダー        │
├────────────────┤
│ ParentCard     │
│ ParentCard     │
│ ChildCard      │
│ ChildCard      │
│                │
│  [FAB: 追加]   │
└────────────────┘

# 詳細表示時
┌────────────────┐
│ ← 戻る         │
├────────────────┤
│ メンバー詳細    │
│                │
│  [FAB: 編集]   │
└────────────────┘
```

### スタイル仕様

#### 2ペインスタイル
```typescript
<div className="flex h-full" style={{ gap: "1rem" }}>
  {/* 左ペイン */}
  <aside 
    className="w-1/3" 
    style={{ 
      borderRight: "1px solid #e0e0e0",
      paddingRight: "1rem",
      overflowY: "auto"
    }}
  >
    <FamilyMemberList />
  </aside>
  
  {/* 右ペイン */}
  <main 
    className="flex-1" 
    style={{ 
      paddingLeft: "1rem",
      overflowY: "auto"
    }}
  >
    {children}
  </main>
</div>
```

**ポイント**:
- ペイン間のgap: `1rem`
- 仕切り線: `1px solid #e0e0e0`（明るいグレー）
- 左ペイン幅: 画面の1/3
- 右ペイン幅: 残りの幅（flex-1）
- 各ペイン独立スクロール

---

## 主要コンポーネント

### FamilyMemberList
**パス**: `app/(app)/families/members/_components/FamilyMemberList.tsx`  
**タイプ**: Client Component

**責務**:
- 親と子供の一覧表示
- セクション分割表示
- 選択状態管理

**Props**:
```typescript
{
  selectedId: string | null    // 選択中のメンバーID
}
```

**使用するフック**:
- `useParents()`: 親データ取得
- `useChildren()`: 子供データ取得

**表示構造**:
```tsx
<PageHeader title="家族メンバー" />
<Card>
  <Stack gap={4}>
    {/* 親セクション */}
    <Text>親</Text>
    {parents.map(parent => <ParentCardLayout />)}
    
    <Divider />
    
    {/* 子供セクション */}
    <Text>子供</Text>
    {children.map(child => <ChildCardLayout />)}
  </Stack>
</Card>
```

---

### ParentCardLayout
**パス**: `app/(app)/parents/_components/ParentCardLayout.tsx`

**責務**:
- 親情報の表示
- クリックイベントハンドリング

**Props**:
```typescript
{
  parent: Parent
  isSelected: boolean
  onClick: (parentId: string) => void
}
```

**表示項目**:
- 名前
- アバター
- ロール情報

---

### ChildCardLayout
**パス**: `app/(app)/children/_components/ChildCardLayout.tsx`

**責務**:
- 子供情報の表示
- クエスト統計表示

**Props**:
```typescript
{
  child: Child
  questStats?: QuestStats      // 完了数/進行中数
  isSelected: boolean
  onClick: (childId: string) => void
}
```

**表示項目**:
- 名前
- アバター
- レベル/経験値
- クエスト統計（完了/進行中）

---

## FloatingActionButton配置

### 左ペイン（一覧）FAB
```typescript
const leftPaneActionItems = [
  { 
    icon: <IconPlus size={20} />,
    onClick: () => router.push('/families/members/child/new')
  }
]
```

### 右ペイン（詳細）FAB
子供閲覧画面の場合のみ表示:
```typescript
const rightPaneActionItems = [
  {
    icon: <IconEdit size={20} />,
    onClick: () => router.push(`/families/members/child/${childId}/edit`)
  }
]
```

---

## 選択状態管理

### URLベース選択状態
```typescript
const getSelectedIdFromPath = (): string | null => {
  const parentMatch = pathname.match(/\/families\/members\/parent\/([^\/]+)/)
  const childMatch = pathname.match(/\/families\/members\/child\/([^\/]+)/)
  return parentMatch?.[1] || childMatch?.[1] || null
}
```

### カードのisSelected設定
```typescript
<ParentCardLayout 
  isSelected={selectedId === parent.id}
  onClick={handleClick}
/>
```

---

## レスポンシブ制御

### デバイス判定
```typescript
const { isTablet } = useWindow()

if (isTablet) {
  // シングルペイン（モバイル/タブレット）
  if (!selectedId) {
    return <FamilyMemberList />
  }
  return children
}

// 2ペイン（PC）
return (
  <div className="flex h-full">
    <aside><FamilyMemberList /></aside>
    <main>{children}</main>
  </div>
)
```

### ブレイクポイント
- **isTablet**: 1024px以下
- **isMobile**: 768px以下

---

## スタイリング

### Mantineコンポーネント
- `Card`: 一覧ラッパー
- `Stack`: カード縦並び配置
- `Divider`: セクション区切り線
- `Text`: ラベル表示

### カスタムスタイル
```css
.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}
```
