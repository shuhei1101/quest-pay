---
name: app-shell-structure
description: AppShellContentの構造知識を提供するスキル。サイドメニュー、フッター、レイアウト構造を含む。
---

# AppShellContent構造 スキル

## 概要

このスキルは、AppShellContentの全体構造と統合パターンの知識を提供します。Mantine UIのAppShellをベースに、Context Providers、レスポンシブレイアウト、FAB管理、スクロール制御を統合した包括的なレイアウトシステムです。

## メインソースファイル

### レイアウトファイル
- `packages/web/app/(app)/layout.tsx`: 認証ガード付きレイアウト
- `packages/web/app/(app)/_components/AppShellContent.tsx`: AppShell全体の構造管理

### Context Providers
- `packages/web/app/(core)/_components/FABContext.tsx`: FAB状態管理Provider
- `packages/web/app/(core)/_components/LoadingContext.tsx`: ローディング状態管理Provider

### コアコンポーネント
- `packages/web/app/(app)/_components/BackgroundWrapper.tsx`: 背景スタイル管理
- `packages/web/app/(core)/_components/LoadingIndicator.tsx`: ローディング表示
- `packages/web/app/(core)/_components/AccessErrorHandler.tsx`: エラーハンドリング

### ナビゲーション
- `packages/web/app/(app)/_components/SideMenu.tsx`: サイドメニュー
- `packages/web/app/(app)/_components/BottomBar.tsx`: ボトムバー
- `packages/web/app/(core)/_components/NavigationFAB.tsx`: フローティングナビゲーション

### 認証・ユーティリティ
- `packages/web/app/(core)/_auth/withAuth.ts`: 認証チェック
- `packages/web/app/(core)/useConstants.ts`: useWindowフック（レスポンシブ判定）

## 主要機能グループ

### 1. レイアウト管理
- **AppShellContent**: Mantine UIのAppShellベースのレイアウト構造
- **Context Providers**: FABとローディングの状態管理
- **BackgroundWrapper**: グラデーション背景のテーマ対応

### 2. レスポンシブ設計
- **デスクトップ（>600px）**: Navbar固定表示、Footer非表示
- **モバイル（≤600px）**: Navbar非表示、Footer + NavigationFAB表示
- **動的切替**: ブレークポイント601pxで自動切替

### 3. FAB管理システム
- **FABProvider**: 複数FABの状態一元管理
- **競合制御**: NavigationFABとSubMenuFABの排他制御
- **スクロール連動**: トップ位置で自動展開、下スクロールで自動折りたたみ

### 4. ローディング管理
- **LoadingProvider**: グローバルローディング状態管理
- **LoadingIndicator**: 画面左上にローディング表示
- **API統合**: 非同期処理中の自動表示

## Reference Files Usage

### コンポーネント階層を確認する場合
AppShellContentの全体構造とコンポーネントツリーを確認：
```
references/component_catalog.md
```

### レイアウト構造を理解する場合
デスクトップ/モバイルのレイアウト階層、レスポンシブ動作、FAB管理を確認：
```
references/layout_structure.md
```

### レイアウト統合を実装する場合
異なるページやレイアウトへのAppShell統合パターンを確認：
```
references/integration_guide.md
```

## クイックスタート

1. **全体構造の把握**: `references/component_catalog.md`でコンポーネント階層確認
2. **レイアウト理解**: `references/layout_structure.md`でレスポンシブ動作確認
3. **実装時**: `references/integration_guide.md`で統合パターン確認

## 実装上の注意点

### 必須パターン
- **認証ガード**: layout.tsxでgetAuthContext()必須
- **Context Provider**: FABProviderとLoadingProviderで必ずラップ
- **Suspense境界**: useSearchParams使用時は必須
- **useWindow**: レスポンシブ判定は必ず使用（isMobile: ≤600px）

### レイアウト設計
- **Navbar設定**: 
  - 幅: opened ? 240 : 60
  - ブレークポイント: 601px
  - collapsed: {mobile: true, desktop: false}
- **Footer設定**: 
  - 高さ: 70px
  - collapsed: {mobile: false, desktop: true}

### FAB管理
- **ユニークID**: FABごとにユニークなID必須
- **競合制御**: NavigationFAB開く時はSubMenuFAB自動で閉じる
- **スクロール制御**: passive: trueでパフォーマンス最適化

### Context使用
- **FABContext**: openFab/closeFab/isOpenでFAB状態管理
- **LoadingContext**: setLoading/isLoadingでローディング管理
- **統一管理**: 複数FABやローディングを一元管理

### 統合パターン
- **ネストレイアウト**: AppShellContentの中にさらにレイアウト配置可能
- **モーダル**: z-index競合なし、自動的に最前面表示
- **FAB追加**: SubMenuFABをページごとに追加可能
- **ロールベース**: isParent、isGuestで表示制御
