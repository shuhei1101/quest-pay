# 子供クエスト一覧 - フローダイアグラム

**2026年3月記載**

## 概要

子供クエスト一覧画面の初期表示から各種操作までの処理フローを説明します。

## 初期表示フロー

```
1. ページマウント（ChildQuestsScreen）
   ↓
2. useLoginUserInfo でログインユーザー情報取得
   ├─ 子供ユーザー → 3へ
   └─ 親ユーザー → アクセス不可（エラー）
   ↓
3. URLクエリパラメータを解析
   ├─ tags
   ├─ name
   └─ categoryId
   ↓
4. questFilter 状態を初期化
   ↓
5. useChildQuests フック実行
   ├─ childId: ログインユーザーの子供ID
   ├─ filter: questFilter
   ├─ sortColumn: "id"（デフォルト）
   ├─ sortOrder: "asc"（デフォルト）
   ├─ page: 1
   └─ pageSize: 30
   ↓
6. getChildQuests() API 呼び出し
   ↓
7. データ取得
   ├─ rows: クエスト一覧
   └─ totalRecords: 総件数
   ↓
8. QuestListLayout レンダリング
   ├─ ChildQuestFilter（検索条件）
   ├─ ChildQuestCardLayout × N（クエストカード）
   └─ Pagination（ページネーション）
   ↓
9. ユーザーに表示
```

## フィルター適用フロー

```
1. ユーザーがフィルター入力
   ├─ クエスト名入力
   └─ タグ追加/削除
   ↓
2. questFilter 状態を更新
   ↓
3. 「検索」ボタンクリック
   ↓
4. handleSearch() 実行
   ↓
5. URLクエリパラメータを構築
   ├─ name
   └─ tags（カンマ区切り）
   ↓
6. router.push() でURL更新
   ↓
7. searchParams 変更を検知
   ↓
8. questFilter を解析・更新
   ↓
9. searchFilter を更新
   ↓
10. useChildQuests が再実行
   ↓
11. 新しいフィルター条件でAPI呼び出し
   ↓
12. フィルター結果を表示
```

## ソート変更フロー

```
1. ユーザーがソートポップアップを開く
   ↓
2. ソート列・順を選択
   ├─ 列: id, name, categoryId, reward, deadline
   └─ 順: asc, desc
   ↓
3. sort 状態を更新
   ↓
4. useChildQuests が再実行
   ↓
5. 新しいソート条件でAPI呼び出し
   ↓
6. ソート結果を表示
```

## ページ変更フロー

```
1. ユーザーがページネーションをクリック
   ├─ 前へ
   ├─ 次へ
   └─ ページ番号
   ↓
2. handlePageChange() 実行
   ↓
3. page 状態を更新
   ↓
4. useChildQuests が再実行
   ↓
5. 新しいページ番号でAPI呼び出し
   ↓
6. 該当ページのクエストを表示
```

## クエストカードクリックフロー

```
1. ChildQuestCardLayout クリック
   ↓
2. onClick イベント発火
   ↓
3. CHILD_QUEST_VIEW_URL(questId, childId) 生成
   ↓
4. router.push() で詳細ページへ遷移
   ↓
5. `/quests/child/[id]` 表示
```

## 完了報告フロー

```
1. クエスト詳細画面で「完了報告」ボタンクリック
   ↓
2. 完了報告APIを呼び出し
   ├─ PUT /api/quests/family/[id]/review-request
   └─ childId を含む
   ↓
3. バリデーション
   ├─ ステータス = in_progress → 4へ
   └─ その他 → エラー表示
   ↓
4. DB の child_quests レコード更新
   ├─ status = "pending_review"
   └─ review_requested_at = 現在時刻
   ↓
5. 成功レスポンス
   ↓
6. 一覧画面に戻る
   ↓
7. refetchOnMount: "always" により自動再取得
   ↓
8. ステータスバッジが「完了報告中」に更新
```

## 承認待ちフロー

```
1. ステータス = "pending_review" のクエストを表示
   ↓
2. 親ユーザーが承認/却下
   ↓
3. 承認の場合
   ├─ status = "completed"
   ├─ completed_at = 現在時刻
   ├─ 報酬付与
   └─ 経験値加算
   ↓
4. 却下の場合
   ├─ status = "in_progress"
   └─ rejection_reason 記録
   ↓
5. 子供ユーザーが一覧画面に戻る
   ↓
6. refetchOnMount: "always" により自動再取得
   ↓
7. 最新ステータスを表示
   ├─ 承認 → "completed"
   └─ 却下 → "in_progress"
```

## タグ入力フロー

```
1. タグ入力フィールドに入力
   ↓
2. tagInputValue 状態を更新
   ↓
3. Enter キーまたは blur
   ↓
4. handleTag() 実行
   ↓
5. バリデーション
   ├─ 空白 → 処理終了
   ├─ 既存タグ → 処理終了
   └─ 新規タグ → 6へ
   ↓
6. filter.tags に追加
   ↓
7. tagInputValue をクリア
   ↓
8. タグ一覧に表示
```

## エラーハンドリングフロー

```
API エラー発生
   ↓
handleAppError() 実行
   ↓
エラータイプ判定
   ├─ 認証エラー → ログイン画面へリダイレクト
   ├─ 権限エラー → エラー画面表示
   └─ その他 → エラーメッセージ表示
```

## データ同期フロー

```
他の画面でのクエストデータ更新
   ↓
子供クエスト一覧画面に戻る
   ↓
refetchOnMount: "always" により自動再取得
   ↓
最新データ表示
```
