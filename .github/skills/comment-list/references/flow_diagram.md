# コメント一覧 - フローダイアグラム

**2026年3月記載**

## 概要

コメント一覧画面の初期表示から各種操作までの処理フローを説明します。

## 初期表示フロー

```
1. 公開クエスト詳細画面からコメントリンクをクリック
   ↓
2. CommentsScreen マウント
   ↓
3. publicQuestId を取得
   ↓
4. useComments フック実行
   ↓
5. getComments(publicQuestId) API 呼び出し
   ↓
6. データ取得
   ├─ comments: 通常コメント一覧
   └─ pinnedComments: ピン留めコメント一覧
   ↓
7. CommentList レンダリング
   ├─ ピン留めコメント表示（最上部）
   └─ 通常コメント表示（投稿日時順）
   ↓
8. ユーザーに表示
```

## コメント投稿フロー

```
1. コメント入力フォームでコメント入力
   ↓
2. 「投稿」ボタンクリック
   ↓
3. バリデーション
   ├─ 空白 → エラーメッセージ表示
   ├─ 文字数超過 → エラーメッセージ表示
   └─ OK → 4へ
   ↓
4. postComment() API 呼び出し
   ├─ publicQuestId
   ├─ userId
   └─ content
   ↓
5. DB に comment レコード作成
   ↓
6. 成功レスポンス
   ↓
7. refetch() 実行
   ↓
8. 新しいコメントを含む一覧を再表示
```

## 高評価（いいね）フロー

```
1. ユーザーが「👍」ボタンクリック
   ↓
2. バリデーション
   ├─ 自分のコメント → エラー（ボタン非表示）
   ├─ 既に評価済み → 評価取り消し処理へ
   └─ 未評価 → 3へ
   ↓
3. 楽観的更新
   ├─ likeCount を +1
   └─ UI を即座に更新
   ↓
4. postLike() API 呼び出し
   ├─ publicQuestId
   └─ commentId
   ↓
5. DB に comment_like レコード作成
   ├─ likeType = "like"
   └─ userId
   ↓
6. comments.likeCount を +1
   ↓
7. 成功レスポンス
   ↓
8. refetch() または invalidateQueries で最新データ取得
   ↓
9. 最新の評価数を表示
```

## 低評価（よくないね）フロー

```
1. ユーザーが「👎」ボタンクリック
   ↓
2. バリデーション
   ├─ 自分のコメント → エラー（ボタン非表示）
   ├─ 既に評価済み → 評価取り消し処理へ
   └─ 未評価 → 3へ
   ↓
3. 楽観的更新
   ├─ dislikeCount を +1
   └─ UI を即座に更新
   ↓
4. postDislike() API 呼び出し
   ├─ publicQuestId
   └─ commentId
   ↓
5. DB に comment_like レコード作成
   ├─ likeType = "dislike"
   └─ userId
   ↓
6. comments.dislikeCount を +1
   ↓
7. 成功レスポンス
   ↓
8. refetch() または invalidateQueries で最新データ取得
   ↓
9. 最新の評価数を表示
```

## 評価取り消しフロー

```
1. ユーザーが既に評価したボタンを再度クリック
   ↓
2. 楽観的更新
   ├─ likeCount または dislikeCount を -1
   └─ UI を即座に更新
   ↓
3. deleteLike() API 呼び出し
   ├─ publicQuestId
   └─ commentId
   ↓
4. DB の comment_like レコード削除
   ↓
5. comments.likeCount または dislikeCount を -1
   ↓
6. 成功レスポンス
   ↓
7. refetch() または invalidateQueries で最新データ取得
   ↓
8. 最新の評価数を表示
```

## コメント削除フロー

```
1. ユーザーが「削除」ボタンクリック（自分のコメントのみ）
   ↓
2. 確認ダイアログ表示
   ├─ キャンセル → フロー終了
   └─ 確認 → 3へ
   ↓
3. deleteComment() API 呼び出し
   ├─ publicQuestId
   └─ commentId
   ↓
4. バリデーション
   ├─ 自分のコメント → 5へ
   └─ 他人のコメント → 権限エラー
   ↓
5. DB の comment レコード削除
   ↓
6. 成功レスポンス
   ↓
7. refetch() 実行
   ↓
8. 削除されたコメントを除く一覧を再表示
```

## ピン留めフロー

```
1. 公開者が「ピン留め」ボタンクリック
   ↓
2. バリデーション
   ├─ 公開者 → 3へ
   └─ 一般ユーザー → 権限エラー（ボタン非表示）
   ↓
3. pinComment() API 呼び出し
   ├─ publicQuestId
   └─ commentId
   ↓
4. DB の comments.isPinned を true に更新
   ↓
5. 成功レスポンス
   ↓
6. refetch() 実行
   ↓
7. ピン留めコメントが最上部に移動
```

## ピン留め解除フロー

```
1. 公開者が「ピン留め解除」ボタンクリック
   ↓
2. unpinComment() API 呼び出し
   ├─ publicQuestId
   └─ commentId
   ↓
3. DB の comments.isPinned を false に更新
   ↓
4. 成功レスポンス
   ↓
5. refetch() 実行
   ↓
6. コメントが通常の位置に移動
```

## 公開者いいねフロー

```
1. 公開者が「❤️」ボタンクリック
   ↓
2. バリデーション
   ├─ 公開者 → 3へ
   └─ 一般ユーザー → 権限エラー（ボタン非表示）
   ↓
3. creatorLikeComment() API 呼び出し
   ├─ publicQuestId
   └─ commentId
   ↓
4. DB の comments.hasCreatorLike を true に更新
   ↓
5. 成功レスポンス
   ↓
6. refetch() 実行
   ↓
7. 公開者いいねバッジを表示
```

## 不適切コメント報告フロー

```
1. ユーザーが「報告」ボタンクリック（自分のコメント以外）
   ↓
2. 報告理由選択ダイアログ表示
   ├─ スパム
   ├─ 不適切な内容
   ├─ 嫌がらせ
   └─ その他
   ↓
3. 報告理由を選択
   ↓
4. reportComment() API 呼び出し
   ├─ publicQuestId
   ├─ commentId
   └─ reason
   ↓
5. DB に comment_report レコード作成
   ├─ reportedBy = userId
   └─ reason
   ↓
6. 成功レスポンス
   ↓
7. 報告完了メッセージ表示
   ↓
8. （管理者によるモデレーション待ち）
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
   ├─ ネットワークエラー → エラーメッセージ表示
   └─ 楽観的更新エラー → ロールバック + エラーメッセージ
```

## データ同期フロー

```
他のユーザーがコメント投稿・評価
   ↓
コメント一覧画面に戻る
   ↓
refetchOnMount: "always" により自動再取得
   ↓
最新データ表示
```
