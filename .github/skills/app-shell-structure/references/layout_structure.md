# AppShell全体レイアウト構造

**作成日: 2026年3月記載**

## 概要

AppShellContentは、Mantine UIのAppShellコンポーネントをベースに、デスクトップとモバイルで最適化されたレイアウトを提供します。レスポンシブデザイン、FAB管理、スクロール制御を統合した包括的なレイアウトシステムです。

---

## 全体アーキテクチャ

### コンポーネントツリー
```
app/(app)/layout.tsx (Server Component)
└── AppShellContent (Client Component)
    ├── FABProvider
    │   └── FABContext: {navigation-fab, submenu-fab}
    │
    ├── LoadingProvider
    │   └── LoadingContext: {isLoading, setLoading}
    │
    └── AppShellContentInner
        │
        ├── BackgroundWrapper
        │   └── グラデーション背景（ライト/ダーク対応）
        │
        ├── LoadingIndicator
        │   └── 画面左上のローディング表示
        │
        ├── AccessErrorHandler（Suspense境界）
        │   └── URLクエリからエラー情報読み取り
        │
        ├── AppShell (Mantine UI)
        │   │
        │   ├── AppShell.Navbar（デスクトップのみ）
        │   │   ├── 通常モード: 240px幅
        │   │   ├── ミニモード: 60px幅
        │   │   └── SideMenu
        │   │       ├── プロフィールカード
        │   │       ├── ナビゲーションメニュー
        │   │       └── ユーザー操作（通知、ログアウト）
        │   │
        │   ├── AppShell.Footer（モバイルのみ）
        │   │   ├── 高さ: 70px固定
        │   │   └── BottomBar
        │   │       └── クイックナビゲーション
        │   │
        │   └── AppShell.Main
        │       └── {children} ← ページコンテンツ
        │
        ├── NavigationFAB（モバイルのみ）
        │   ├── 右下固定表示
        │   ├── 展開/折りたたみ機能
        │   └── スクロール連動
        │
        └── NotificationModal
            └── 通知一覧表示
```

---

## レスポンシブブレークポイント

### 定義
```typescript
// Mantine UI AppShell設定
navbar: {
  breakpoint: 601,  // 601px以上でデスクトップ
}

// useWindowフック
const isMobile = window.innerWidth <= 600  // 600px以下でモバイル
```

### デバイス判定
- **デスクトップ**: window.innerWidth > 600
- **モバイル**: window.innerWidth ≤ 600

---

## デスクトップレイアウト（> 600px）

### 構造図
```
┌─────────────────────────────────────────────────┐
│ [Background: gradient fixed]                    │
│ ┌─────────────────────────────────────────────┐ │
│ │ LoadingIndicator (左上固定)                  │ │
│ │                                             │ │
│ │ ┌──────────────┬────────────────────────────┐ │
│ │ │   Navbar     │      Main Content          │ │
│ │ │              │                            │ │
│ │ │   SideMenu   │      {children}            │ │
│ │ │              │                            │ │
│ │ │ (240px/60px) │                            │ │
│ │ │              │                            │ │
│ │ │              │                            │ │
│ │ └──────────────┴────────────────────────────┘ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Navbar詳細

#### 通常モード（opened=true）
- **幅**: 240px
- **内容**:
  - ヘッダー（アプリアイコン、名前、トグルボタン）
  - プロフィールカード（家族名、ユーザー名、アイコン）
  - フルメニュー（テキストラベル付き）
  - 階層的なサブメニュー展開

#### ミニモード（opened=false）
- **幅**: 60px
- **内容**:
  - トグルボタン
  - アイコンのみ表示
  - 主要機能へのクイックアクセス

### Navbarの動作
- **初期状態**: 通常モード（240px）
- **トグル**: ハンバーガーアイコンクリックで切替
- **アニメーション**: transition-durationで滑らかに変化
- **固定表示**: 常に表示（collapsed.desktop: false）

### Main Content
- **幅**: 画面幅 - Navbar幅
- **スクロール**: 縦スクロール可能
- **内容**: Next.jsのページコンポーネント

---

## モバイルレイアウト（≤ 600px）

### 構造図
```
┌─────────────────────────────────────────────────┐
│ [Background: gradient fixed]                    │
│ ┌─────────────────────────────────────────────┐ │
│ │ LoadingIndicator (左上固定)                  │ │
│ │                                             │ │
│ │ ┌─────────────────────────────────────────┐ │ │
│ │ │                                         │ │ │
│ │ │         Main Content                    │ │ │
│ │ │         {children}                      │ │ │
│ │ │                                         │ │ │
│ │ │                                         │ │ │
│ │ │                                         │ │ │
│ │ └─────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────┐ │ │
│ │ │ Footer: BottomBar (70px固定)            │ │ │
│ │ │ [🏠] [📋] [👥] [≡]                      │ │ │
│ │ └─────────────────────────────────────────┘ │ │
│ │                                             │ │
│ │                    [NavigationFAB]  ← 右下  │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Footer詳細
- **高さ**: 70px固定
- **位置**: 画面下部固定（position: fixed）
- **背景**: backdrop-filter: blur(8px)でガラスモーフィズム
- **シャドウ**: 上方向に影（0 -2px 6px）
- **内容**: BottomBar（クイックナビゲーション）

### NavigationFAB詳細
- **位置**: 右下固定（bottom: 80px, right: 16px）
- **表示条件**: モバイルのみ
- **状態**: 展開/折りたたみ
- **スクロール連動**: 自動開閉制御

### Main Content
- **幅**: 画面幅100%
- **高さ**: 画面高さ - Footer高さ(70px)
- **スクロール**: 縦スクロール可能

### ドロワーメニュー
- **トリガー**: BottomBarの[≡]アイコンクリック
- **表示**: 左からスライドイン（Mantine Drawer）
- **内容**: SideMenuの通常モードと同じフルメニュー
- **閉じる**: 外側タップ、×ボタン、画面遷移

---

## AppShell設定詳細

### Navbar設定
```typescript
navbar: {
  // 幅設定
  width: opened ? 240 : 60,
  
  // ブレークポイント（Desktop/Mobile切替）
  breakpoint: 601,
  
  // 表示/非表示設定
  collapsed: { 
    mobile: true,     // モバイルでNavbar非表示
    desktop: false,   // デスクトップでNavbar表示
  },
}
```

### Footer設定
```typescript
footer: {
  // 高さ設定
  height: 70,
  
  // 表示/非表示設定
  collapsed: {
    mobile: false,    // モバイルでFooter表示
    desktop: true,    // デスクトップでFooter非表示
  },
}
```

---

## Context Providers

### FABProvider
FAB（フローティングアクションボタン）の状態管理

```typescript
type FABState = {
  "navigation-fab": boolean   // NavigationFABの開閉状態
  "submenu-fab": boolean      // SubMenuFABの開閉状態
}

// Context API
const { openFab, closeFab, isOpen } = useFABContext()

// 使用例
openFab("navigation-fab")           // NavigationFAB開く
closeFab("submenu-fab")             // SubMenuFAB閉じる
isOpen("navigation-fab")            // 状態確認: true/false
```

### FAB競合制御ルール
1. **NavigationFAB優先**: 開く時はSubMenuFABを自動で閉じる
2. **画面遷移時**: NavigationFAB開く、SubMenuFAB閉じる
3. **スクロール時**: 両方閉じる（下スクロール時）

---

### LoadingProvider
グローバルローディング状態管理

```typescript
// Context API
const { setLoading, isLoading } = useLoading()

// 使用例
setLoading(true)   // ローディング開始
setLoading(false)  // ローディング終了
```

### 使用シーン
- API呼び出し中
- ページ遷移中
- データ取得中

---

## スクロール制御

### スクロール検知ロジック
```typescript
const lastScrollY = useRef(0)

useEffect(() => {
  if (!isMobile) return  // モバイルのみ有効

  const handleScroll = () => {
    const currentScrollY = window.scrollY

    // トップ位置（scrollY=0）: NavigationFAB展開
    if (currentScrollY === 0) {
      openFab("navigation-fab")
    } 
    // 下スクロール（50px以上）: 両FAB閉じる
    else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      closeFab("navigation-fab")
      closeFab("submenu-fab")
    }

    lastScrollY.current = currentScrollY
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [isMobile, openFab, closeFab])
```

### スクロール動作
- **トップ到達**: NavigationFAB自動展開
- **上スクロール**: 何もしない（現在の状態維持）
- **下スクロール（50px以上）**: 両FAB自動折りたたみ

### passive イベントリスナー
```typescript
{ passive: true }  // スクロールパフォーマンス向上
```

---

## 背景スタイル管理

### BackgroundWrapper
```typescript
// ライトモード
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)

// ダークモード
background: linear-gradient(135deg, #1a1b1e 0%, #2c2e33 100%)
```

### スタイル詳細
- **position**: fixed（固定背景）
- **width**: 100vw（画面幅いっぱい）
- **height**: 100vh（画面高さいっぱい）
- **z-index**: -1（最背面）
- **スクロール**: 背景は動かない

---

## ローディング表示

### LoadingIndicator
- **位置**: 画面左上固定
- **表示条件**: isLoading === true
- **アニメーション**: スピナー表示
- **z-index**: 高（他のコンテンツより前面）

### 使用例
```typescript
const { setLoading } = useLoading()

// API呼び出し前
setLoading(true)

try {
  const result = await fetchData()
} finally {
  // API呼び出し後（成功/失敗問わず）
  setLoading(false)
}
```

---

## エラーハンドリング

### AccessErrorHandler
- **役割**: URLクエリパラメータからエラー情報読み取り
- **表示**: トースト通知でエラーメッセージ表示
- **Suspense必須**: useSearchParams使用のため

```typescript
<Suspense fallback={null}>
  <AccessErrorHandler />
</Suspense>
```

### エラーパラメータ例
```
/home?error=unauthorized&message=アクセス権限がありません
```

---

## 画面遷移時の動作

### useEffect（pathname監視）
```typescript
useEffect(() => {
  if (isMobile) {
    openFab("navigation-fab")    // NavigationFAB開く
    closeFab("submenu-fab")      // SubMenuFAB閉じる
  }
}, [pathname, isMobile, openFab, closeFab])
```

### 動作
1. **画面遷移検知**: pathnameが変更
2. **FAB初期化**: NavigationFAB展開、SubMenuFAB折りたたみ
3. **ユーザー体験**: 新しいページでナビゲーションをすぐに利用可能

---

## パフォーマンス最適化

### 1. Suspense境界
```tsx
<Suspense fallback={null}>
  <AccessErrorHandler />
</Suspense>
```
→ クライアントサイドレンダリングの最適化

### 2. passive イベントリスナー
```typescript
window.addEventListener('scroll', handleScroll, { passive: true })
```
→ スクロールパフォーマンス向上

### 3. useDisclosure
```typescript
const [opened, { toggle, close }] = useDisclosure()
```
→ Mantine UIの最適化されたトグル管理

### 4. useRef（スクロール位置保存）
```typescript
const lastScrollY = useRef(0)
```
→ 再レンダリングを引き起こさない状態管理

---

## 使用フック一覧

### アプリケーション独自フック
- **useWindow**: レスポンシブ判定（isMobile, isDark）
- **useLoginUserInfo**: ユーザー情報とロール判定
- **useNotifications**: 通知データ取得
- **useFABContext**: FAB状態管理
- **useLoading**: ローディング状態管理
- **useTheme**: テーマ情報取得

### Mantine UIフック
- **useDisclosure**: メニュー開閉管理

### Next.jsフック
- **useRouter**: ルーティング
- **usePathname**: 現在のパス取得

### Reactフック
- **useState**: ステート管理
- **useEffect**: 副作用処理
- **useRef**: 参照値保存

---

## 注意事項

1. **レスポンシブ判定**: isMobile（≤600px）を必ず使用
2. **FAB競合防止**: NavigationFABとSubMenuFABは排他制御
3. **Suspense境界**: useSearchParams使用コンポーネントは必須
4. **passive リスナー**: スクロールイベントは必ず{ passive: true }
5. **Navbar幅**: openedフラグで240px/60pxを動的変更
6. **Footer高さ**: モバイル時は70px固定
7. **背景固定**: BackgroundWrapperはposition: fixed
8. **ローディング**: 非同期処理時は必ずsetLoading使用
9. **認証ガード**: layout.tsxでgetAuthContext()必須
10. **Context Provider**: AppShellContentは必ずFABProviderとLoadingProviderでラ
