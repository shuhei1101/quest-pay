# 共通コンポーネント一覧

**最終更新:** 2026年3月記載

## コンポーネント配置場所

すべての共通コンポーネントは以下のディレクトリに配置されています：

```
app/(core)/_components/
```

## レイアウト関連コンポーネント

### SideMenu
**ファイル:** `SideMenu.tsx`
**用途:** サイドメニューの表示（デスクトップ）

**機能:**
- ナビゲーションアイテムの表示
- アクティブアイテムのハイライト
- アイコンとラベルの表示

### BottomBar
**ファイル:** `BottomBar.tsx`
**用途:** フッターの表示（モバイル）

**機能:**
- 下部固定ナビゲーション
- アイコンボタンの表示
- アクティブアイテムの強調表示

### NavigationItem
**ファイル:** `NavigationItem.tsx`
**用途:** ナビゲーションアイテムの表示

**機能:**
- アイコンとラベルのセット表示
- アクティブ状態の管理
- クリックイベントハンドリング

### UserInfo
**ファイル:** `UserInfo.tsx`
**用途:** ユーザー情報の表示

**機能:**
- ユーザー名の表示
- プロフィールアイコンの表示
- ロール情報の表示

### PageHeader
**ファイル:** `PageHeader.tsx`
**用途:** ページヘッダーの統一表示

**機能:**
- タイトル表示
- Paperコンポーネントでラップ（ボーダー・影付き）
- 右側にアクション配置可能
- プロフィールボタン自動表示（親：家族アイコン、子供：子供アイコン）
- マージンボトム（mb="md"）自動設定

## タブ関連コンポーネント

### ScrollableTabs
**ファイル:** `ScrollableTabs.tsx`
**用途:** スクロール可能なスティッキータブ

**機能:**
- タブヘッダー固定（スティッキー）
- 横スクロール対応
- マウスホイール横スクロール
- スワイプ対応（左右）
- タブ変更時の自動スクロール
- ダークモード対応

## クエスト関連コンポーネント

### QuestCard
**ファイル:** `QuestCard.tsx`
**用途:** クエストのカード表示

**機能:**
- クエスト情報の表示
- サムネイル表示
- ステータスバッジ表示
- クリックイベントハンドリング

### QuestDetail
**ファイル:** `QuestDetail.tsx`
**用途:** クエスト詳細の表示

**機能:**
- 詳細情報の表示
- 説明文の表示
- メタデータの表示

### QuestForm
**ファイル:** `QuestForm.tsx`
**用途:** クエストフォームの表示

**機能:**
- 入力フォームの表示
- バリデーション
- 送信処理

### QuestStatusBadge
**ファイル:** `QuestStatusBadge.tsx`
**用途:** ステータスバッジの表示

**機能:**
- ステータスに応じた色分け
- アイコン表示
- テキスト表示

## ボタン関連コンポーネント

### FloatingActionButton (基底コンポーネント)
**ファイル:** `FloatingActionButton.tsx`
**用途:** フローティングアクションボタンの基底実装

**機能:**
- カスタマイズ可能なFAB動作
- 展開方向の制御（radial-up, slide-right等）
- アニメーション制御

### NavigationFAB
**ファイル:** `NavigationFAB.tsx`
**用途:** ナビゲーション専用FAB

**機能:**
- 左下固定配置
- 右展開
- Appsアイコン使用
- アクティブアイテムの管理

### SubMenuFAB
**ファイル:** `SubMenuFAB.tsx`
**用途:** サブメニュー専用FAB

**機能:**
- 右下固定配置
- 上展開
- Menuアイコン使用
- カラー指定可能

### NavigationButton
**ファイル:** `NavigationButton.tsx`
**用途:** 画面遷移専用ボタン

**機能:**
- クリック時にローディング開始
- router.push実行
- 自動ローディング管理

### LoadingButton
**ファイル:** `LoadingButton.tsx`
**用途:** ローディング付きボタン

**機能:**
- クリック時に自動ローディング開始
- ローディング中はdisabled
- カスタムローディングメッセージ

### LikeButton
**ファイル:** `LikeButton.tsx`
**用途:** いいねボタン

**機能:**
- いいね状態の管理
- アニメーション効果
- いいね数の表示

### ReportButton
**ファイル:** `ReportButton.tsx`
**用途:** 完了報告ボタン

**機能:**
- 報告状態の管理
- 確認ダイアログ表示
- 送信処理

## ローディング関連コンポーネント

### LoadingContext
**ファイル:** `LoadingContext.tsx`
**用途:** グローバルローディング状態管理

**機能:**
- アプリ全体のローディング状態管理
- startLoading/stopLoading関数提供
- React Context利用

### LoadingIndicator
**ファイル:** `LoadingIndicator.tsx`
**用途:** 画面左上のローディング表示

**機能:**
- フローティング表示
- グローバルローディング状態に連動
- アニメーション効果

### ScreenWrapper
**ファイル:** `ScreenWrapper.tsx`
**用途:** 画面遷移完了検知ラッパー

**機能:**
- 画面遷移完了時にローディング停止
- 子コンポーネントのラップ
- 自動ローディング管理

## フィルター・検索コンポーネント

### SearchBar
**ファイル:** `SearchBar.tsx`
**用途:** 検索バーの表示

**機能:**
- 検索入力フィールド
- クリアボタン
- 検索アイコン表示

### FilterPopup
**ファイル:** `FilterPopup.tsx`
**用途:** フィルタポップアップ

**機能:**
- フィルタオプションの表示
- 複数選択対応
- 適用/リセット操作

### SortPopup
**ファイル:** `SortPopup.tsx`
**用途:** ソートポップアップ

**機能:**
- ソートオプションの表示
- 昇順/降順切り替え
- 適用操作

## その他コンポーネント

### LoadingSpinner
**ファイル:** `LoadingSpinner.tsx`
**用途:** ローディングスピナー

**機能:**
- ローディング中の表示
- カスタムサイズ指定
- カラー指定

### ErrorMessage
**ファイル:** `ErrorMessage.tsx`
**用途:** エラーメッセージ表示

**機能:**
- エラー内容の表示
- アイコン表示
- 再試行ボタン

### EmptyState
**ファイル:** `EmptyState.tsx`
**用途:** 空状態の表示

**機能:**
- 空状態のメッセージ表示
- イラストやアイコン表示
- アクションボタン表示

## コンポーネント分類

### UI基盤
- PageHeader
- SideMenu
- BottomBar
- NavigationItem
- UserInfo

### ナビゲーション
- NavigationFAB
- SubMenuFAB
- NavigationButton

### インタラクション
- FloatingActionButton
- LoadingButton
- LikeButton
- ReportButton

### データ表示
- QuestCard
- QuestDetail
- QuestStatusBadge
- EmptyState

### フォーム
- QuestForm
- SearchBar
- FilterPopup
- SortPopup

### フィードバック
- LoadingSpinner
- LoadingIndicator
- ErrorMessage
- LoadingContext
- ScreenWrapper

### レイアウトパターン
- ScrollableTabs
