# AppShell構造コンポーネントカタログ

**作成日: 2026年3月記載**

## 概要

AppShellContentは、アプリケーション全体のレイアウト構造を提供する最上位コンポーネントです。Mantine UIのAppShellをベースに、デスクトップとモバイルで最適化されたレイアウトを実現します。

---

## コンポーネント階層

```
App Layout Hierarchy
│
├── app/(app)/layout.tsx
│   └── AppShellContent
│       ├── FABProvider
│       ├── LoadingProvider
│       └── AppShellContentInner
│           ├── BackgroundWrapper
│           ├── LoadingIndicator
│           ├── AccessErrorHandler
│           ├── AppShell (Mantine UI)
│           │   ├── AppShell.Navbar
│           │   │   └── SideMenu
│           │   ├── AppShell.Footer
│           │   │   └── BottomBar
│           │   └── AppShell.Main
│           │       └── {children}
│           ├── NavigationFAB
│           └── NotificationModal
```

---

## 1. app/(app)/layout.tsx

### ファイルパス
`packages/web/app/(app)/layout.tsx`

### 責務
認証チェック後、AppShellContentでアプリケーションレイアウトをラップ

### コード
```typescript
export default async function AppLayout({ children }: {
  children: React.ReactNode
}) {
  // 認証チェック（未認証の場合はwithAuthでリダイレクト）
  await getAuthContext()

  return (
    <AppShellContent>
      {children}
    </AppShellContent>
  )
}
```

### 特徴
- **サーバーコンポーネント**: async function
- **認証ガード**: getAuthContext()で未認証をブロック
- **シンプル構造**: AppShellContentに全てを委譲

---

## 2. AppShellContent

### ファイルパス
`packages/web/app/(app)/_components/AppShellContent.tsx`

### 責務
FABとローディングのContext Providerでラップ

### コード
```typescript
export const AppShellContent = ({children}: {children: React.ReactNode}) => {
  return (
    <FABProvider>
      <LoadingProvider>
        <AppShellContentInner>{children}</AppShellContentInner>
      </LoadingProvider>
    </FABProvider>
  )
}
```

### 提供するContext
1. **FABProvider**: FAB（フローティングアクションボタン）の状態管理
2. **LoadingProvider**: ローディング状態の管理

---

## 3. AppShellContentInner

### ファイルパス
`packages/web/app/(app)/_components/AppShellContent.tsx`

### 責務
実際のレイアウト構造の実装

### 主要機能
- **レスポンシブレイアウト**: デスクトップ/モバイル自動切替
- **メニュー開閉制御**: useDisclosureフック使用
- **FAB管理**: NavigationFABとSubMenuFABの競合制御
- **スクロール検知**: スクロール位置に応じたFAB自動開閉
- **通知管理**: 通知モーダルの表示制御

### State管理
```typescript
const [opened, { toggle, close }] = useDisclosure()  // メニュー開閉
const [isNotificationOpen, setIsNotificationOpen] = useState(false)  // 通知モーダル
const lastScrollY = useRef(0)  // 前回のスクロール位置
```

### 使用フック
- `useDisclosure`: Mantineのメニュー開閉管理
- `useWindow`: レスポンシブ判定（isMobile, isDark）
- `useRouter`: Next.jsのルーター
- `usePathname`: 現在のパス取得
- `useLoginUserInfo`: ユーザー情報とロール判定
- `useFABContext`: FAB状態管理
- `useNotifications`: 通知データ取得

---

## 4. BackgroundWrapper

### ファイルパス
`packages/web/app/(app)/_components/BackgroundWrapper.tsx`

### 責務
アプリケーション全体の背景スタイル管理

### スタイル
```typescript
// ライトモード
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)

// ダークモード
background: linear-gradient(135deg, #1a1b1e 0%, #2c2e33 100%)
```

### 特徴
- **固定背景**: position: fixed
- **全画面**: width: 100vw, height: 100vh
- **テーマ対応**: useThemeフックでダーク/ライト切替

---

## 5. LoadingIndicator

### ファイルパス
`packages/web/app/(core)/_components/LoadingIndicator.tsx`

### 責務
グローバルローディング表示

### 表示位置
画面左上に固定表示

### 使用方法
```typescript
// LoadingContextでローディング状態管理
const { setLoading } = useLoading()

// ローディング開始
setLoading(true)

// ローディング終了
setLoading(false)
```

---

## 6. AccessErrorHandler

### ファイルパス
`packages/web/app/(core)/_components/AccessErrorHandler.tsx`

### 責務
URLクエリパラメータからエラー情報を読み取り、エラー通知を表示

### Suspense必須
```typescript
<Suspense fallback={null}>
  <AccessErrorHandler />
</Suspense>
```

### 理由
- useSearchParamsを使用
- クライアントサイドでのみ動作

---

## 7. AppShell (Mantine UI)

### ライブラリ
@mantine/core

### 設定
```typescript
<AppShell
  navbar={{
    width: opened ? 240 : 60,    // 通常モード/ミニモード
    breakpoint: 601,              // ブレークポイント
    collapsed: { 
      mobile: true,               // モバイルでNavbar非表示
      desktop: false,             // デスクトップでNavbar表示
    },
  }}
  footer={{
    height: 70,                   // モバイル用Footer高さ
    collapsed: {
      mobile: false,              // モバイルでFooter表示
      desktop: true,              // デスクトップでFooter非表示
    },
  }}
>
```

### 構成要素
1. **AppShell.Navbar**: サイドバー（デスクトップ）
2. **AppShell.Footer**: ボトムバー（モバイル）
3. **AppShell.Main**: メインコンテンツ

---

## 8. SideMenu

### ファイルパス
`packages/web/app/(app)/_components/SideMenu.tsx`

### 責務
- **デスクトップ**: サイドバーナビゲーション（通常/ミニモード）
- **モバイル**: ドロワーメニュー

### 2つの表示形式

#### 通常モード（240px幅）
- プロフィールカード
- フルメニュー表示
- 階層的なサブメニュー

#### ミニモード（60px幅）
- アイコンのみ表示
- 主要機能へのクイックアクセス

### 詳細
`app-shell-components`スキルの`references/component_catalog.md`参照

---

## 9. BottomBar

### ファイルパス
`packages/web/app/(app)/_components/BottomBar.tsx`

### 責務
モバイル専用のボトムナビゲーションバー

### 表示条件
- モバイルのみ（≤ 600px）
- デスクトップでは非表示

### ナビゲーション項目
- ホーム（IconHome2）
- クエスト（IconClipboard）
- メンバー（IconUsers、親のみ）
- メニュー（IconMenu2、ドロワー開閉）

### 詳細
`app-shell-components`スキルの`references/component_catalog.md`参照

---

## 10. NavigationFAB

### ファイルパス
`packages/web/app/(core)/_components/NavigationFAB.tsx`

### 責務
モバイル専用のフローティングアクションボタンナビゲーション

### 表示条件
- モバイルのみ（≤ 600px）
- 画面右下に固定表示

### 主要機能
- **展開/折りたたみ**: ボタンクリックで切替
- **スクロール連動**: トップ位置で自動展開、下スクロールで自動折りたたみ
- **未読バッジ**: 通知の未読数表示
- **アクティブ状態**: 現在のページをハイライト

### スクロール制御
```typescript
// トップ位置（scrollY=0）
→ NavigationFAB自動展開

// 下スクロール（scrollY>50）
→ NavigationFAB自動折りたたみ
```

---

## 11. NotificationModal

### ファイルパス
`packages/web/app/(app)/notifications/_components/NotificationModal.tsx`

### 責務
通知一覧のモーダル表示

### 表示条件
- ゲストユーザー以外（!isGuest）

### トリガー
- SideMenuの通知アイコンクリック
- NavigationFABの通知アイコンクリック

---

## レイアウトフロー図

### デスクトップ（> 600px）
```
┌────────────────────────────────────────────┐
│ BackgroundWrapper (固定背景)                │
│ ┌────────────────────────────────────────┐ │
│ │ LoadingIndicator (左上)                 │ │
│ │ AccessErrorHandler (エラー通知)         │ │
│ │ ┌──────────────┬─────────────────────┐ │ │
│ │ │ Navbar       │ Main                │ │ │
│ │ │ SideMenu     │ {children}          │ │ │
│ │ │ (240px/60px) │                     │ │ │
│ │ │              │                     │ │ │
│ │ └──────────────┴─────────────────────┘ │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### モバイル（≤ 600px）
```
┌────────────────────────────────────────────┐
│ BackgroundWrapper (固定背景)                │
│ ┌────────────────────────────────────────┐ │
│ │ LoadingIndicator (左上)                 │ │
│ │ AccessErrorHandler (エラー通知)         │ │
│ │ ┌────────────────────────────────────┐ │ │
│ │ │ Main                               │ │ │
│ │ │ {children}                         │ │ │
│ │ │                                    │ │ │
│ │ └────────────────────────────────────┘ │ │
│ │ ┌────────────────────────────────────┐ │ │
│ │ │ Footer: BottomBar (70px固定)       │ │ │
│ │ └────────────────────────────────────┘ │ │
│ │                                        │ │
│ │          [NavigationFAB] ← 右下固定   │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

---

## Context Providers

### FABProvider
```typescript
type FABState = {
  "navigation-fab": boolean
  "submenu-fab": boolean
}

// FAB状態管理API
const { openFab, closeFab, isOpen } = useFABContext()
```

### LoadingProvider
```typescript
// ローディング状態管理API
const { setLoading, isLoading } = useLoading()
```

---

## 注意事項

1. **AppShellContent**: 必ずFABProviderとLoadingProviderでラップ
2. **Suspense境界**: AccessErrorHandlerはSuspenseでラップ必須
3. **レスポンシブ判定**: useWindowフックを使用（isMobile: ≤600px）
4. **FAB競合制御**: NavigationFABとSubMenuFABは排他制御
5. **スクロール最適化**: passive: trueでイベントリスナー登録
6. **背景固定**: BackgroundWrapperはposition: fixed
7. **認証ガード**: layout.tsxでgetAuthContext()必須
