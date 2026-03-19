---
name: app-shell-components
description: AppShell関連コンポーネントの知識を提供するスキル。サイドメニュー、フッターの実装詳細を含む。 Trigger Keywords: AppShell、サイドメニュー、フッター、アプリシェルコンポーネント、レイアウトコンポーネント
---

# AppShellコンポーネント スキル

## 概要

このスキルは、AppShell関連のナビゲーションコンポーネント群の知識を提供します。デスクトップとモバイルで最適化されたナビゲーション、ロールベース（親/子供）のメニュー表示、FAB管理を含みます。

## メインソースファイル

### コアコンポーネント
- `packages/web/app/(app)/_components/AppShellContent.tsx`: AppShell全体の構造管理
- `packages/web/app/(app)/_components/SideMenu.tsx`: サイドメニュー（デスクトップ/モバイルドロワー）
- `packages/web/app/(app)/_components/BottomBar.tsx`: モバイル用ボトムナビゲーション
- `packages/web/app/(app)/_components/BackgroundWrapper.tsx`: 背景スタイル管理
- `packages/web/app/(app)/_components/ThemeToggleButton.tsx`: テーマ切替ボタン

### ナビゲーション関連
- `packages/web/app/(core)/_components/NavigationFAB.tsx`: モバイル用フローティングナビゲーション
- `packages/web/app/(core)/_components/FABContext.tsx`: FAB状態管理Context
- `packages/web/app/(core)/_components/FloatingActionButton.tsx`: FABベースコンポーネント

### サポートコンポーネント
- `packages/web/app/(core)/_components/LoadingIndicator.tsx`: ローディング表示
- `packages/web/app/(core)/_components/AccessErrorHandler.tsx`: エラーハンドリング

### テーマとスタイル
- `packages/web/app/(core)/_theme/colors.ts`: メニューカラー定義
- `packages/web/app/(core)/_theme/useTheme.ts`: テーマフック

## 主要機能グループ

### 1. ナビゲーション管理
- **SideMenu**: デスクトップサイドバー（通常/ミニモード）、モバイルドロワー
- **BottomBar**: モバイル専用ボトムナビゲーション
- **NavigationFAB**: モバイル専用フローティングナビゲーション

### 2. ロールベース表示
- **親専用メニュー**: メンバー管理、クエスト管理（公開/家族/お気に入り）、報酬設定
- **共通メニュー**: ホーム、設定、通知、ログアウト
- **ゲスト制限**: ログアウトと通知の非表示

### 3. レスポンシブ対応
- **デスクトップ（>600px）**: サイドバー固定表示（240px/60px）
- **モバイル（≤600px）**: ボトムバー + NavigationFAB + ドロワーメニュー

### 4. 状態管理
- **FAB競合制御**: NavigationFABとSubMenuFABの排他制御
- **スクロール連動**: スクロール位置に応じたFAB自動開閉
- **通知バッジ**: 未読通知数のリアルタイム表示

## Reference Files Usage

### コンポーネント仕様を確認する場合
全AppShellコンポーネントの詳細仕様とProps定義を確認：
```
references/component_catalog.md
```

### レイアウト構造を理解する場合
デスクトップ/モバイルのレイアウト階層とレスポンシブ動作を確認：
```
references/layout_structure.md
```

### ナビゲーション実装を確認する場合
ルート処理、ロール判定、メニュー構成、状態管理を確認：
```
references/navigation_flow.md
```

## クイックスタート

1. **全体像の把握**: `references/layout_structure.md`でレイアウト構造確認
2. **コンポーネント理解**: `references/component_catalog.md`で各コンポーネント仕様確認
3. **実装時**: `references/navigation_flow.md`でナビゲーション実装パターン確認

## 実装上の注意点

### 必須パターン
- **useWindow**: レスポンシブ判定は必須（isMobile: ≤600px）
- **useLoginUserInfo**: ロール判定必須（isParent, isGuest）
- **endpoints.ts**: URL定数使用（直接文字列記述禁止）
- **FAB ID**: ユニークなID必須（navigation-fab, submenu-fab）

### レスポンシブ設計
- **ブレークポイント**: 600px/601pxで統一
- **デスクトップ**: Navbar常に表示、Footer非表示
- **モバイル**: Navbar非表示、Footer表示、NavigationFAB表示

### ロールベース表示
- **親のみ**: isParentでメニュー項目を条件分岐
- **ゲスト以外**: !isGuestでログアウトと通知を条件分岐
- **統一判定**: SideMenu、BottomBar、NavigationFABで同じロジック

### FAB管理
- **競合制御**: NavigationFAB開く時はSubMenuFAB閉じる
- **画面遷移**: NavigationFAB開く、SubMenuFAB閉じる
- **スクロール**: トップ位置で自動展開、下スクロールで自動折りたたみ

### スタイリング
- **メニューカラー**: `menuColors`で統一（home, quest, members, settings）
- **レスポンシブ**: Mantine UIのAppShellとuseWindowで連動
- **テーマ対応**: useThemeでダーク/ライト自動切替
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


