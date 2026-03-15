# AppShellコンポーネントカタログ

**作成日: 2026年3月記載**

## 概要

AppShell関連コンポーネントは、アプリケーション全体のナビゲーション構造を提供します。デスクトップとモバイルで異なるレイアウトを使用し、ユーザーロール（親/子）に応じたメニュー表示を行います。

---

## 1. AppShellContent

### ファイル
`packages/web/app/(app)/_components/AppShellContent.tsx`

### 責務
アプリケーション全体のレイアウト構造を管理

### 主要機能
- **レイアウト管理**: Mantine UIのAppShellを使用した構造定義
- **レスポンシブ対応**: デスクトップ(>600px)とモバイル(≤600px)で自動切替
- **FAB管理**: Navigation FABとSubMenu FABの状態管理
- **スクロール検知**: スクロール位置に応じたFABの自動開閉
- **背景管理**: BackgroundWrapperによる背景スタイル適用

### Props
```typescript
{
  children: React.ReactNode  // メインコンテンツ
}
```

### 使用例
```tsx
<AppShellContent>
  {children}
</AppShellContent>
```

---

## 2. SideMenu

### ファイル
`packages/web/app/(app)/_components/SideMenu.tsx`

### 責務
デスクトップ用サイドナビゲーション（通常表示）とモバイル用ドロワーメニュー

### 主要機能
- **ナビゲーションメニュー**: 階層的なメニュー構造
- **プロフィール表示**: ユーザー情報とアイコン表示
- **ロールベースメニュー**: 親と子供で異なるメニュー項目
- **通知機能**: 未読通知数のバッジ表示
- **ログアウト**: Supabase認証のサインアウト処理
- **テーマ切替**: ダーク/ライトモード切替ボタン
- **ミニモード**: デスクトップで折りたたんだ状態のアイコンメニュー

### Props
```typescript
{
  isMobile: boolean      // モバイルモードかどうか
  isDark: boolean        // ダークモードかどうか
  opened: boolean        // メニューが開いているか
  onClose: () => void    // メニューを閉じる
  onToggle: () => void   // メニューの開閉を切り替え
}
```

### メニュー構成

#### 共通メニュー
- **ホーム**: ホーム画面へ遷移
- **クエスト**: クエスト一覧（サブメニュー展開）
- **設定**: 設定画面（サブメニュー展開）
  - 全般設定
  - お小遣い設定（親のみ）
- **カラーパレット**: テーマ切替
- **通知**: 通知モーダル表示（ゲストユーザー以外）
- **ログアウト**: サインアウト（ゲストユーザー以外）
- **モック**: テスト画面（開発用）

#### 親専用メニュー
- **クエスト > 公開**: 公開クエスト一覧
- **クエスト > 家族**: 家族クエスト一覧
- **クエスト > お気に入り**: テンプレートクエスト一覧
- **メンバー**: 家族メンバー管理

### 使用例
```tsx
<SideMenu 
  isMobile={isMobile} 
  isDark={isDark}
  opened={opened}
  onClose={close}
  onToggle={toggle}
/>
```

---

## 3. BottomBar

### ファイル
`packages/web/app/(app)/_components/BottomBar.tsx`

### 責務
モバイル専用のボトムナビゲーションバー

### 主要機能
- **クイックアクセス**: 主要画面への直接遷移
- **ロールベース表示**: 親と子供で表示項目が異なる
- **メニュー開閉**: ハンバーガーメニューでSideMenuのドロワー表示

### Props
```typescript
{
  isDark: boolean              // ダークモードかどうか
  onToggleMenu: () => void     // メニュー開閉ハンドラ
}
```

### ナビゲーション項目
- **ホーム**: IconHome2
- **クエスト**: IconClipboard
- **メンバー**: IconUsers（親のみ）
- **メニュー**: IconMenu2（ドロワー開閉）

### 使用例
```tsx
<BottomBar 
  isDark={isDark}
  onToggleMenu={toggle}
/>
```

---

## 4. NavigationFAB

### ファイル
`packages/web/app/(core)/_components/NavigationFAB.tsx`

### 責務
モバイル専用のフローティングアクションボタンナビゲーション

### 主要機能
- **展開/折りたたみ**: ナビゲーションアイテムの表示切替
- **スクロール連動**: 自動開閉制御
- **未読バッジ**: 通知の未読数表示
- **アクティブ状態**: 現在のページをハイライト表示

### Props
```typescript
{
  items: FloatingActionItem[]  // ナビゲーションアイテム配列
  position?: {                 // FABの位置
    bottom?: number
    right?: number
  }
  selectedIndex?: number       // 選択中のインデックス
  onToggle?: (open: boolean) => void  // 開閉トグルハンドラ
}
```

### FloatingActionItem型
```typescript
{
  icon: React.ReactNode   // アイコン
  label: string          // ラベルテキスト
  onClick: () => void    // クリックハンドラ
}
```

---

## 5. BackgroundWrapper

### ファイル
`packages/web/app/(app)/_components/BackgroundWrapper.tsx`

### 責務
アプリケーション全体の背景スタイル管理

### 主要機能
- **グラデーション背景**: テーマに応じた背景色
- **ダークモード対応**: ライト/ダークの背景切替

---

## 6. ThemeToggleButton

### ファイル
`packages/web/app/(app)/_components/ThemeToggleButton.tsx`

### 責務
ダーク/ライトモードの切替ボタン

### 主要機能
- **テーマ切替**: useThemeフックによるテーマ変更
- **アイコン表示**: 太陽/月アイコンの切替

### Props
```typescript
{
  size?: number          // アイコンサイズ
  iconStroke?: number    // アイコンのストローク幅
}
```

---

## 関連フック

### useWindow
- ブレークポイント判定（isMobile: 600px以下）
- ダークモード判定（isDark）

### useLoginUserInfo
- ログインユーザー情報取得
- 親/子供判定（isParent）
- ゲストユーザー判定（isGuest）

### useNotifications
- 通知データ取得
- 未読数計算

### useFABContext
- FABの開閉状態管理
- 複数FABの競合制御

---

## コンポーネント連携フロー

```
AppShellContent
├── BackgroundWrapper（背景管理）
├── LoadingIndicator（ローディング表示）
├── AccessErrorHandler（エラーハンドリング）
├── AppShell（Mantine UI）
│   ├── Navbar（デスクトップ）
│   │   └── SideMenu（通常/ミニモード）
│   ├── Footer（モバイル）
│   │   └── BottomBar
│   └── Main（メインコンテンツ）
│       └── children
└── NavigationFAB（モバイル専用FAB）
    └── NotificationModal（通知モーダル）
```

---

## スタイリング

### メニューカラー
`packages/web/app/(core)/_theme/colors.ts` の `menuColors` で定義

- `home`: ホーム画面
- `quest`: クエスト
- `publicQuest`: 公開クエスト
- `familyQuest`: 家族クエスト
- `favoriteQuest`: お気に入り
- `members`: メンバー
- `settings`: 設定

### レスポンシブブレークポイント
- **デスクトップ**: > 600px
- **モバイル**: ≤ 600px

### AppShell設定
- **Navbar幅**: 
  - 開いた状態: 240px
  - 折りたたみ: 60px
- **Footer高さ**: 70px（モバイルのみ）
- **ブレークポイント**: 601px

---

## 注意事項

1. **ロールベース表示**: isParentフラグで親専用メニューを条件分岐
2. **ゲストユーザー**: isGuestフラグでログアウトと通知を非表示
3. **FAB競合防止**: NavigationFABとSubMenuFABは排他制御
4. **スクロール制御**: トップ位置でFAB自動展開、下スクロールで自動折りたたみ
5. **通知未読数**: バッジ表示は未読がある場合のみ
6. **モバイル専用**: BottomBarとNavigationFABはモバイルのみ表示
