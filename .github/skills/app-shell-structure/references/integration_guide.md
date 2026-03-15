# AppShell統合ガイド

**作成日: 2026年3月記載**

## 概要

AppShellContentを異なるレイアウトやページに統合する際のガイドラインと実装パターンを提供します。

---

## 基本統合パターン

### 1. 標準的なページ統合

#### app/(app)/layout.tsx
```typescript
import { getAuthContext } from '../(core)/_auth/withAuth'
import { AppShellContent } from './_components/AppShellContent'

export default async function AppLayout({ children }: {
  children: React.ReactNode
}) {
  // 認証チェック（未認証の場合はリダイレクト）
  await getAuthContext()

  return (
    <AppShellContent>
      {children}
    </AppShellContent>
  )
}
```

#### 子ページ例: app/(app)/home/page.tsx
```typescript
export default function HomePage() {
  return (
    <div>
      <h1>ホーム画面</h1>
      {/* ページコンテンツ */}
    </div>
  )
}
```

**ポイント**:
- **サーバーコンポーネント**: layout.tsxはasync function
- **認証ガード必須**: getAuthContext()で未認証をブロック
- **子ページは自由**: AppShellContentに自動でラップされる

---

### 2. カスタムレイアウト統合

#### ネストされたレイアウト例: app/(app)/quests/layout.tsx
```typescript
export default function QuestsLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <div className="quests-layout">
      {/* クエスト共通ヘッダー */}
      <header>
        <h1>クエスト管理</h1>
      </header>
      
      {/* ページコンテンツ */}
      <main>
        {children}
      </main>
    </div>
  )
}
```

**レイアウトの入れ子構造**:
```
app/(app)/layout.tsx
└── AppShellContent
    └── app/(app)/quests/layout.tsx
        └── QuestsLayout
            └── app/(app)/quests/family/page.tsx
                └── FamilyQuestsPage
```

**ポイント**:
- **ネスト可能**: AppShellContentの中にさらにレイアウトを配置
- **共通ヘッダー**: 特定セクションの共通UIをネストレイアウトで提供
- **レスポンシブ対応**: AppShellContentのレスポンシブ機能は維持される

---

### 3. モーダルとの統合

#### モーダル付きページ例
```typescript
"use client"

import { useState } from 'react'
import { Modal, Button } from '@mantine/core'

export default function PageWithModal() {
  const [opened, setOpened] = useState(false)

  return (
    <div>
      <h1>ページコンテンツ</h1>
      <Button onClick={() => setOpened(true)}>
        モーダルを開く
      </Button>

      {/* モーダルはAppShellの外側に表示される */}
      <Modal 
        opened={opened} 
        onClose={() => setOpened(false)}
        title="モーダルタイトル"
      >
        <p>モーダルコンテンツ</p>
      </Modal>
    </div>
  )
}
```

**ポイント**:
- **z-indexの競合なし**: Mantineのモーダルは自動的に最前面に表示
- **スクロール制御**: モーダル表示中は背景スクロール無効化
- **レスポンシブ**: モバイルでもデスクトップでも適切に表示

---

## レスポンシブ統合パターン

### 1. デバイス別コンテンツ表示

```typescript
"use client"

import { useWindow } from '@/app/(core)/useConstants'

export default function ResponsivePage() {
  const { isMobile } = useWindow()

  return (
    <div>
      {isMobile ? (
        <div>
          {/* モバイル専用コンテンツ */}
          <h1>モバイルビュー</h1>
          <p>タップしやすいUI</p>
        </div>
      ) : (
        <div>
          {/* デスクトップ専用コンテンツ */}
          <h1>デスクトップビュー</h1>
          <p>広い画面を活用したUI</p>
        </div>
      )}
    </div>
  )
}
```

**ポイント**:
- **useWindowフック**: isMobile（≤600px）でデバイス判定
- **条件分岐**: isMobileでUI切り替え
- **AppShellと連動**: AppShellのレスポンシブと同じブレークポイント

---

### 2. グリッドレイアウト統合

```typescript
"use client"

import { Grid } from '@mantine/core'
import { useWindow } from '@/app/(core)/useConstants'

export default function GridPage() {
  const { isMobile } = useWindow()

  return (
    <Grid gutter="md">
      <Grid.Col span={isMobile ? 12 : 6}>
        <div>左側コンテンツ</div>
      </Grid.Col>
      <Grid.Col span={isMobile ? 12 : 6}>
        <div>右側コンテンツ</div>
      </Grid.Col>
    </Grid>
  )
}
```

**ポイント**:
- **Mantine Grid**: レスポンシブグリッドシステム
- **span調整**: モバイルで全幅、デスクトップで半分
- **自動調整**: AppShellのNavbar幅に応じて自動調整

---

## FAB統合パターン

### 1. SubMenuFABの追加

```typescript
"use client"

import { useState } from 'react'
import { FloatingActionButton } from '@/app/(core)/_components/FloatingActionButton'
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react'
import { useFABContext } from '@/app/(core)/_components/FABContext'

export default function PageWithSubMenuFAB() {
  const { openFab, closeFab, isOpen } = useFABContext()

  const items = [
    { icon: <IconPlus />, label: "新規作成", onClick: () => handleCreate() },
    { icon: <IconEdit />, label: "編集", onClick: () => handleEdit() },
    { icon: <IconTrash />, label: "削除", onClick: () => handleDelete() },
  ]

  return (
    <div>
      <h1>ページコンテンツ</h1>

      {/* SubMenuFAB */}
      <FloatingActionButton
        id="submenu-fab"
        items={items}
        position={{ bottom: 160, right: 16 }}  // NavigationFABの上
        onToggle={(open) => {
          if (open) {
            closeFab("navigation-fab")  // NavigationFABを閉じる
            openFab("submenu-fab")
          } else {
            closeFab("submenu-fab")
          }
        }}
      />
    </div>
  )
}
```

**ポイント**:
- **FAB ID**: "submenu-fab"で識別
- **位置調整**: NavigationFABの上に配置（bottom: 160）
- **競合制御**: 開く時にNavigationFABを自動で閉じる

---

### 2. FAB表示条件

```typescript
"use client"

import { useWindow } from '@/app/(core)/useConstants'
import { FloatingActionButton } from '@/app/(core)/_components/FloatingActionButton'

export default function ConditionalFABPage() {
  const { isMobile } = useWindow()

  return (
    <div>
      <h1>ページコンテンツ</h1>

      {/* モバイルのみFAB表示 */}
      {isMobile && (
        <FloatingActionButton
          id="custom-fab"
          items={[/* アイテム */]}
          position={{ bottom: 160, right: 16 }}
        />
      )}
    </div>
  )
}
```

**ポイント**:
- **条件表示**: isMobileでモバイル時のみ表示
- **デスクトップ**: 通常のボタンやメニューで代替

---

## ローディング統合パターン

### 1. グローバルローディング

```typescript
"use client"

import { useLoading } from '@/app/(core)/_components/LoadingContext'

export default function PageWithLoading() {
  const { setLoading } = useLoading()

  const handleSubmit = async () => {
    setLoading(true)  // ローディング開始
    try {
      await submitData()
      // 成功処理
    } catch (error) {
      // エラー処理
    } finally {
      setLoading(false)  // ローディング終了
    }
  }

  return (
    <div>
      <h1>フォーム</h1>
      <button onClick={handleSubmit}>送信</button>
    </div>
  )
}
```

**ポイント**:
- **useLoading**: LoadingContextから取得
- **finally**: 成功/失敗問わず必ずsetLoading(false)
- **表示**: 画面左上にLoadingIndicator自動表示

---

### 2. ローカルローディング

```typescript
"use client"

import { useState } from 'react'
import { Button, Loader } from '@mantine/core'

export default function PageWithLocalLoading() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await submitData()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1>フォーム</h1>
      <Button 
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader size="xs" /> : "送信"}
      </Button>
    </div>
  )
}
```

**ポイント**:
- **ローカル状態**: useStateで管理
- **ボタン内ローディング**: Mantineのloadingプロパティ
- **使い分け**: ページ全体はグローバル、部分的な操作はローカル

---

## ナビゲーション統合

### 1. プログラマティックナビゲーション

```typescript
"use client"

import { useRouter } from 'next/navigation'
import { HOME_URL, FAMILY_QUESTS_URL } from '@/app/(core)/endpoints'

export default function NavigationPage() {
  const router = useRouter()

  const handleNavigate = () => {
    router.push(HOME_URL)
  }

  const handleNavigateWithQuery = () => {
    router.push(`${FAMILY_QUESTS_URL}?tab=public`)
  }

  return (
    <div>
      <button onClick={handleNavigate}>ホームへ</button>
      <button onClick={handleNavigateWithQuery}>公開クエストへ</button>
    </div>
  )
}
```

**ポイント**:
- **useRouter**: Next.jsのルーター
- **endpoints.ts**: URL定数を使用（直接文字列記述禁止）
- **クエリパラメータ**: テンプレートリテラルで追加

---

### 2. アクティブ状態の取得

```typescript
"use client"

import { usePathname } from 'next/navigation'
import { HOME_URL, FAMILY_QUESTS_URL } from '@/app/(core)/endpoints'

export default function ActiveStatePage() {
  const pathname = usePathname()

  const isHome = pathname === HOME_URL
  const isQuests = pathname.startsWith(FAMILY_QUESTS_URL)

  return (
    <div>
      <nav>
        <a 
          href={HOME_URL} 
          className={isHome ? 'active' : ''}
        >
          ホーム
        </a>
        <a 
          href={FAMILY_QUESTS_URL} 
          className={isQuests ? 'active' : ''}
        >
          クエスト
        </a>
      </nav>
    </div>
  )
}
```

**ポイント**:
- **usePathname**: 現在のパス取得
- **完全一致**: pathname === URL
- **前方一致**: pathname.startsWith(URL)

---

## スタイリング統合

### 1. Tailwind CSS統合

```typescript
export default function TailwindPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">タイトル</h1>
      <p className="text-gray-600">説明文</p>
    </div>
  )
}
```

**ポイント**:
- **container**: コンテンツ幅の制限
- **レスポンシブ**: Tailwindのレスポンシブクラス使用可能
- **ダークモード**: dark:クラスで自動対応

---

### 2. Mantine UI統合

```typescript
import { Container, Title, Text } from '@mantine/core'

export default function MantinePage() {
  return (
    <Container size="xl" px="md" py="xl">
      <Title order={1} mb="md">タイトル</Title>
      <Text c="dimmed">説明文</Text>
    </Container>
  )
}
```

**ポイント**:
- **Containerコンポーネント**: Mantineのコンテナ
- **size**: xl（1280px）、lg（1024px）など
- **テーマ対応**: 自動的にダーク/ライト切り替え

---

### 3. カスタムテーマ統合

```typescript
"use client"

import { useTheme } from '@/app/(core)/_theme/useTheme'

export default function ThemedPage() {
  const { colors, isDark } = useTheme()

  return (
    <div 
      style={{
        backgroundColor: colors.backgroundColors.default,
        color: colors.textColors.primary,
      }}
    >
      <h1>テーマ対応ページ</h1>
      <p>現在のモード: {isDark ? 'ダーク' : 'ライト'}</p>
    </div>
  )
}
```

**ポイント**:
- **useTheme**: アプリ共通のテーマ情報
- **colors**: 定義済みカラーパレット
- **isDark**: ダークモード判定

---

## エラーハンドリング統合

### 1. エラー境界

```typescript
// app/(app)/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="error-container">
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <button onClick={reset}>再試行</button>
    </div>
  )
}
```

**ポイント**:
- **error.tsx**: Next.jsのエラー境界
- **AppShell内**: AppShellContentの中で表示
- **reset**: エラーリセット機能

---

### 2. カスタムエラー処理

```typescript
"use client"

import { appStorage } from '@/app/(core)/_sessionStorage/appStorage'
import { useRouter } from 'next/navigation'
import { LOGIN_URL } from '@/app/(core)/endpoints'

export default function PageWithErrorHandling() {
  const router = useRouter()

  const handleError = (error: Error) => {
    // フィードバックメッセージ登録
    appStorage.feedbackMessage.set({
      message: error.message,
      type: "error"
    })

    // エラー種類に応じて遷移
    if (error.message.includes("未認証")) {
      router.push(LOGIN_URL)
    }
  }

  return (
    <div>
      {/* ページコンテンツ */}
    </div>
  )
}
```

**ポイント**:
- **appStorage**: セッションストレージでメッセージ保存
- **タイプ別処理**: エラーメッセージに応じて処理分岐

---

## 認証統合パターン

### 1. ロールベース表示

```typescript
"use client"

import { useLoginUserInfo } from '@/app/(auth)/login/_hooks/useLoginUserInfo'

export default function RoleBasedPage() {
  const { isParent, isGuest } = useLoginUserInfo()

  return (
    <div>
      <h1>ページタイトル</h1>
      
      {/* 親専用コンテンツ */}
      {isParent && (
        <div>
          <h2>親専用セクション</h2>
          <p>管理機能</p>
        </div>
      )}

      {/* ゲスト以外 */}
      {!isGuest && (
        <div>
          <h2>メンバー専用セクション</h2>
          <p>通知設定</p>
        </div>
      )}
    </div>
  )
}
```

**ポイント**:
- **useLoginUserInfo**: ユーザー情報とロール判定
- **条件表示**: isParent、isGuestで制御
- **SideMenuと統一**: AppShellと同じロール判定ロジック

---

## 注意事項

1. **認証必須**: app/(app)/layout.tsxでgetAuthContext()必須
2. **useWindow**: レスポンシブ判定は必ずuseWindowフック使用
3. **endpoints.ts**: URL定数を使用（直接文字列記述禁止）
4. **FAB ID**: FABProviderで管理されるため、ユニークなID必須
5. **ローディング**: 非同期処理時はsetLoading使用
6. **ロール判定**: isParent、isGuestで条件分岐
7. **Suspense境界**: useSearchParams使用時は必須
8. **スタイリング**: TailwindとMantineどちらも使用可能
9. **エラー通知**: appStorage.feedbackMessageでメッセージ登録
10. **モーダル**: z-index競合なし、自動的に最前面表示
