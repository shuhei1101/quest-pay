# AppShellレイアウト構造

**作成日: 2026年3月記載**

## 概要

AppShellは、Mantine UIのAppShellコンポーネントをベースに、デスクトップとモバイルで異なるレイアウト構造を提供します。

---

## レイアウト階層

### 全体構造

```
app/(app)/layout.tsx
└── AppShellContent
    ├── FABProvider（FAB状態管理）
    ├── LoadingProvider（ローディング状態管理）
    └── AppShellContentInner
        ├── BackgroundWrapper（背景スタイル）
        ├── LoadingIndicator（ローディング表示）
        ├── AccessErrorHandler（エラーハンドリング）
        ├── AppShell（Mantine UI）
        │   ├── AppShell.Navbar（デスクトップ: サイドバー）
        │   │   └── SideMenu
        │   │       ├── 通常モード（opened=true, 240px幅）
        │   │       └── ミニモード（opened=false, 60px幅）
        │   ├── AppShell.Footer（モバイル: 70px固定高）
        │   │   └── BottomBar
        │   └── AppShell.Main（メインコンテンツ）
        │       └── {children}
        ├── NavigationFAB（モバイル専用）
        └── NotificationModal（通知モーダル）
```

---

## デスクトップレイアウト（> 600px）

### 構造
```
┌─────────────────────────────────────┐
│ [Navbar: SideMenu]  │  Main Content │
│                     │               │
│  (240px / 60px)     │  (残りの幅)    │
│                     │               │
└─────────────────────────────────────┘
```

### 特徴
1. **サイドバー固定表示**: Navbar は常に表示
2. **2つのモード**:
   - **通常モード**: 幅240px、フルメニュー表示
   - **ミニモード**: 幅60px、アイコンのみ表示
3. **ブレークポイント**: 601px以上
4. **切替方法**: ハンバーガーアイコンでトグル

### SideMenuの表示モード

#### 通常モード（opened=true）
- プロフィールカード表示
- メニューテキストラベル表示
- 階層的なサブメニュー展開
- 各種設定項目の完全表示

#### ミニモード（opened=false）
- アイコンのみ表示
- ホバーでツールチップ表示（将来的に実装予定）
- 主要機能へのクイックアクセス

---

## モバイルレイアウト（≤ 600px）

### 構造
```
┌─────────────────────────────────────┐
│           Main Content              │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│         [Footer: BottomBar]         │
│  [Home] [Quest] [Members] [Menu]    │
└─────────────────────────────────────┘

     [NavigationFAB] ← 右下フローティング
```

### 特徴
1. **Navbar非表示**: デスクトップのサイドバーは完全非表示
2. **Footer固定表示**: 高さ70px、画面下部固定
3. **NavigationFAB**: 右下にフローティング表示
4. **ドロワーメニュー**: ハンバーガーアイコンで全メニュー表示

### モバイル専用機能

#### BottomBar
- **ホーム**: HOME_URLへ遷移
- **クエスト**: QUESTS_URLへ遷移
- **メンバー**: FAMILY_MEMBERS_URLへ遷移（親のみ）
- **メニュー**: SideMenuのドロワー表示

#### NavigationFAB
- **展開/折りたたみ**: ボタンクリックで切替
- **スクロール連動**: 
  - トップ位置（scrollY=0）: 自動展開
  - 下スクロール（scrollY>50）: 自動折りたたみ
- **ナビゲーション項目**:
  - ホーム（IconHome2）
  - クエスト（IconClipboard）
  - メンバー（IconUsers、親のみ）
  - 通知（IconBell、未読バッジ付き）

#### ドロワーメニュー
- **表示方法**: BottomBarのメニューアイコンクリック
- **内容**: SideMenuの通常モードと同じフルメニュー
- **閉じる**: 
  - 外側タップ
  - メニュー内の×ボタン
  - 画面遷移時

---

## レスポンシブ動作

### ブレークポイント
```typescript
// Mantine UIのAppShell設定
navbar: {
  width: opened ? 240 : 60,
  breakpoint: 601,           // ← 601px以上でデスクトップ
  collapsed: { 
    mobile: true,            // ← モバイルでNavbar非表示
    desktop: false,          // ← デスクトップでNavbar表示
  },
}

footer: {
  height: 70,
  collapsed: {
    mobile: false,           // ← モバイルでFooter表示
    desktop: true,           // ← デスクトップでFooter非表示
  },
}
```

### useWindowフック
```typescript
const { isMobile, isDark } = useWindow()

// isMobile: window.innerWidth <= 600
// isDark: colorScheme === 'dark'
```

### レイアウト切替タイミング
1. **初回レンダリング**: window.innerWidthで判定
2. **リサイズ時**: useEffect内でリサイズイベント監視
3. **画面回転時**: orientationchangeイベント

---

## FAB管理システム

### FABProvider
複数のFABの状態を一元管理

```typescript
type FABState = {
  "navigation-fab": boolean   // NavigationFABの開閉状態
  "submenu-fab": boolean      // SubMenuFABの開閉状態
}
```

### 競合制御ルール
1. **NavigationFAB優先**: 開く時はSubMenuFABを自動で閉じる
2. **画面遷移時**: NavigationFAB開く、SubMenuFAB閉じる
3. **スクロール時**: 両方閉じる（下スクロール時）

### FABContext API
```typescript
const { openFab, closeFab, isOpen } = useFABContext()

// FABを開く
openFab("navigation-fab")

// FABを閉じる
closeFab("navigation-fab")

// FABの状態確認
isOpen("navigation-fab")  // true/false
```

---

## スクロール制御

### スクロール検知ロジック
```typescript
useEffect(() => {
  if (!isMobile) return

  const handleScroll = () => {
    const currentScrollY = window.scrollY

    // トップ位置: NavigationFABを展開
    if (currentScrollY === 0) {
      openFab("navigation-fab")
    } 
    // 下スクロール: 両FABを閉じる
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
- **上スクロール**: 何もしない（現在の状態維持）
- **下スクロール（50px以上）**: FAB自動折りたたみ
- **トップ到達**: FAB自動展開

---

## 背景スタイル

### BackgroundWrapper
```typescript
// ライトモード
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)

// ダークモード
background: linear-gradient(135deg, #1a1b1e 0%, #2c2e33 100%)
```

### 適用範囲
- AppShellContentの全体背景
- スクロール時も背景固定

---

## パフォーマンス最適化

### Suspense境界
```tsx
<Suspense fallback={null}>
  <AccessErrorHandler />  {/* useSearchParams使用 */}
</Suspense>
```

### passive イベントリスナー
```typescript
window.addEventListener('scroll', handleScroll, { passive: true })
```
→ スクロールパフォーマンス向上

### useDisclosure
Mantine UIの最適化されたトグル管理フック
```typescript
const [opened, { toggle, close }] = useDisclosure()
```

---

## 注意事項

1. **ブレークポイント統一**: 
   - Mantine: 601px
   - useWindow: 600px
   - 実質的には同じ判定

2. **Navbar幅の動的変更**: 
   - opened状態で240pxと60pxを切替
   - transition-durationで滑らかなアニメーション

3. **モバイル判定**: 
   - window.innerWidth ≤ 600
   - タブレット横向きはデスクトップ扱い

4. **FAB表示条件**: 
   - モバイルのみ
   - デスクトップでは非表示

5. **Footer表示条件**: 
   - モバイルのみ
   - デスクトップでは非表示（collapsed: true）

6. **背景固定**: 
   - BackgroundWrapperはposition: fixed
   - スクロールしても背景は動かない
