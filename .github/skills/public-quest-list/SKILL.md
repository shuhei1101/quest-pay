---
name: public-quest-list
description: 公開クエスト一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、フック、処理フローを含む。
---

# 公開クエスト一覧 スキル

## 概要

公開クエスト一覧画面は、世界中のユーザーが公開したクエストを閲覧できる画面。いいね、コメント、検索、フィルタリング機能を提供。

## ファイル構成

### メインファイル
- `app/(app)/quests/public/page.tsx`: リダイレクト専用（サーバーコンポーネント）
- `app/(app)/quests/public/PublicQuestsScreen.tsx`: 一覧画面のメイン実装

### 関連コンポーネント
- `app/(app)/quests/public/_components/PublicQuestList.tsx`: 公開クエスト一覧表示コンポーネント
- `app/(app)/quests/public/_components/PublicQuestCard.tsx`: クエストカード
- `app/(app)/quests/public/_components/PublicQuestFilter.tsx`: フィルタコンポーネント

### フック
- `app/(app)/quests/public/_hooks/usePublicQuests.ts`: 公開クエストデータ取得フック

### API ルート
- `app/api/quests/public/route.ts`: 公開クエスト一覧取得API
- `app/api/quests/public/client.ts`: APIクライアント

## 主要コンポーネント

### PublicQuestsScreen
**責務:** 公開クエストの一覧表示とフィルタ管理

**主要機能:**
- クエスト検索・フィルタリング
- いいね・コメント表示
- ページネーション

## API エンドポイント

### 公開クエスト一覧取得
**パス:** `/api/quests/public`
**メソッド:** GET
**用途:** 公開クエストの一覧を取得

**クエリパラメータ:**
- `search`: 検索キーワード
- `categoryId`: カテゴリフィルタ
- `sortBy`: ソート基準
- `page`: ページ番号
- `pageSize`: 1ページあたりの件数

## 処理フロー

### 初期表示フロー
1. PublicQuestsScreen がマウント
2. usePublicQuests フックでデータ取得
3. 公開クエスト一覧を表示

### フィルタ・ソートフロー
1. ユーザーがフィルタ/ソート条件を変更
2. usePublicQuests フックが再実行
3. 新しいデータで一覧が再レンダリング

## 注意点

- 公開クエストは認証なしで閲覧可能
- いいね・コメントは認証ユーザーのみ可能
- 不適切なコンテンツの報告機能あり
