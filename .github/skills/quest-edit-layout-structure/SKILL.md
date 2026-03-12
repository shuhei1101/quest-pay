---
name: quest-edit-layout-structure
description: クエスト編集レイアウト構造の知識を提供するスキル。ファイル構成、コンポーネントを含む。
---

# クエスト編集レイアウト構造 スキル

## 概要

クエスト編集レイアウトは、クエスト編集フォームの共通レイアウトコンポーネント。タブベースのUIを提供し、基本設定・詳細設定・子供設定などの複数セクションを管理する。

## ファイル構成

### 関連コンポーネント
- `app/(app)/quests/_components/QuestEditLayout.tsx`: クエスト編集レイアウト

## 主要コンポーネント

### QuestEditLayout
**責務:** クエスト編集フォームのレイアウト管理

**主要機能:**
- タイトル表示（クエスト編集/クエスト登録の切り替え）
- ScrollableTabsによるタブベースのフォームレイアウト
  - タブヘッダーがスティッキー（上部固定）
  - 横スクロール対応
  - スワイプでのタブ切り替え対応
  - エラーアイコン表示（右側セクション）
- バリデーションエラー表示
- 保存・削除ボタン（アクションボタン）
- FAB（フローティングアクションボタン）対応
- ローディングオーバーレイ

**技術詳細:**
- `ScrollableTabs`コンポーネントを使用してタブ固定化
- `Tabs.Panel`でコンテンツ表示（詳細設定タブは自身でスクロール制御）
- `SubMenuFAB`でフローティングアクションボタン表示
- レスポンシブ対応（モバイル/デスクトップ）

**使用箇所:**
- `app/(app)/quests/family/[id]/FamilyQuestEdit.tsx`: 家族クエスト編集
- その他のクエスト編集画面（公開クエスト、テンプレートクエストなど）

## 注意点

- `ScrollableTabs`コンポーネントを使用してタブを固定化
- フォームのバリデーションは呼び出し側で実施
- タブ内のエラー表示は`hasErrors`プロップで制御
- 詳細設定タブは自身でスクロール制御するため、親では`overflow: hidden`を指定
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
