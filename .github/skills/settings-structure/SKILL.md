---
name: settings-structure
description: '設定画面の構造知識を提供するスキル。iPhone風リスト形式、2ペイン構成、設定項目を含む。 Trigger Keywords: 設定画面、設定UI、設定項目、設定ページ、iPhone風リスト、設定レイアウト'
---

# 設定画面 スキル

このスキルは、Quest Payアプリの設定画面の知識を提供します。iPhone風のリスト形式、2ペイン構成（PC）、各種設定項目の管理を含みます。

## 概要

設定画面は、ユーザーのプロフィール、通知、プライバシーなどの各種設定を管理する画面です。モバイルではシングルペイン、PCでは2ペイン構成（左：一覧、右：詳細）でレスポンシブに表示されます。

## メインソースファイル (記述日: 2026年3月)

### レイアウト・ページ
- `packages/web/app/(app)/settings/layout.tsx`: 2ペインレスポンシブレイアウト
- `packages/web/app/(app)/settings/page.tsx`: 設定ルートページ（リダイレクト）

### 共通コンポーネント
- `packages/web/app/(app)/settings/_components/SettingsList.tsx`: 設定一覧（カテゴリ別）
- `packages/web/app/(app)/settings/_components/SettingsListItem.tsx`: iPhone風リストアイテム（button/switch/value型）

### 詳細ページ
- `packages/web/app/(app)/settings/profile/page.tsx`: プロフィール設定
- `packages/web/app/(app)/settings/notifications/page.tsx`: 通知設定
- `packages/web/app/(app)/settings/privacy/page.tsx`: プライバシー設定
- `packages/web/app/(app)/settings/about/page.tsx`: アプリ情報

## 主要機能グループ

### 1. 2ペインレスポンシブレイアウト
- **PC表示**: 左に設定一覧（w-1/3）、右に詳細（flex-1）
- **モバイル表示**: 一覧のみ表示 → 選択時に詳細へ遷移
- `useWindow`フックと`isTablet`で判定
- URLから選択中の設定を自動判定

### 2. iPhone風リストUI
#### SettingsListItem コンポーネント
3つのタイプをサポート：
- **button**: クリック可能な項目（矢印アイコン付き）
- **switch**: トグルスイッチ付き項目
- **value**: 現在値表示付き項目

Props:
- `icon`: TablerアイコンReactNode
- `label`: メインラベル
- `description`: 説明文（オプション）
- `type`: 'button' | 'switch' | 'value'
- `onClick`: クリックハンドラー（button型）
- `value`: 現在の値（switch/value型）
- `onChange`: 変更ハンドラー（switch型）
- `showArrow`: 矢印アイコン表示（デフォルトtrue）
- `danger`: 危険な操作の赤色表示（デフォルトfalse）

#### SettingsSection コンポーネント
カテゴリ別セクション：
- `title`: セクションタイトル
- `footer`: セクションフッター（補足説明）
- `children`: セクション内のリストアイテム

### 3. 設定カテゴリ
#### アカウント設定
- プロフィール（アバター、名前、自己紹介）
- メールアドレス変更
- パスワード変更

#### 通知設定
- プッシュ通知（ON/OFF）
- メール通知（ON/OFF）
- クエスト関連通知（完了通知、新規通知、報酬通知）

#### プライバシー設定
- プロフィール公開範囲
- アクティビティ共有
- データ共有設定

#### アプリ情報
- バージョン情報
- 技術スタック
- 利用規約/プライバシーポリシーへのリンク

## 処理フロー

### PC（2ペイン）表示フロー
1. layout.tsxが`isTablet`をチェック → PC判定
2. 左ペインに`SettingsList`、右ペインに`children`を並列表示
3. URLパスから選択中の設定を自動判定（getSelectedSettingFromPath）
4. 選択中の項目をハイライト表示

### モバイル（シングルペイン）表示フロー
1. layout.tsxが`isTablet`をチェック → モバイル判定
2. URLパスが`/settings`のみの場合：`SettingsList`を表示
3. URLパスが`/settings/xxx`の場合：詳細ページ（`children`）を表示

### 設定項目クリックフロー
1. ユーザーがリストアイテムをクリック
2. `router.push(SETTINGS_URL.xxx)`で詳細ページへ遷移
3. PC: 右ペインが切り替わる / モバイル: 詳細ページへ全画面遷移

## Reference Files

詳細なドキュメントは以下を参照：

- `references/layout_structure.md`: レイアウト構造の詳細（2ペイン切り替えロジック、レスポンシブ設計）
- `references/component_api.md`: コンポーネントAPI仕様（SettingsListItem/SettingsSectionの全Props）
- `references/flow_diagram.md`: 処理フローの図解（Mermaidシーケンス図）

## ベストプラクティス

### ✅ DO
- iPhone風の統一されたリストUIを使用
- `SettingsListItem`コンポーネントで3つのタイプ（button/switch/value）を使い分ける
- カテゴリごとに`SettingsSection`でグループ化
- PC/モバイルのレスポンシブ対応を維持

### ❌ DON'T
- カスタムリストUIを独自実装しない（一貫性が損なわれる）
- レスポンシブレイアウトを壊さない（layout.tsxパターン維持）
- `danger`プロパティを通常の設定に使用しない（削除/ログアウトのみ）

## 関連スキル

- `app-shell-components`: サイドメニュー、ヘッダー統合
- `endpoints-definition`: SETTINGS_URLエンドポイント定義
- `common-components-catalog`: 共通UIコンポーネント
