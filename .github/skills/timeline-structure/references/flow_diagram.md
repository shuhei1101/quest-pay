# Timeline Structure - Flow Diagram

**記載日**: 2026年3月

## 概要

このドキュメントは、タイムライン画面のユーザーフローとデータフローを図解します。

## ページアクセスフロー

```
ユーザー: /timeline にアクセス
    ↓
page.tsx (エントリーポイント)
    ↓
authGuard({ guestNG: true }) 実行
    ↓
    ├── 認証済み → 次へ
    └── 未認証 → ログイン画面へリダイレクト
    ↓
TimelinesScreen コンポーネント読み込み
    ↓
初期化処理
    ├── useLoginUserInfo() でユーザー情報取得
    │   └── isChild フラグ確認
    ├── useState("family") でタブ状態初期化
    ├── useFamilyTimelines() でデータ取得開始
    └── usePublicTimelines() でデータ取得開始
    ↓
UIレンダリング
    ├── PageHeader 表示
    └── ScrollableTabs 表示
        ├── "家族"タブ（デフォルト選択）
        └── "公開"タブ（親ユーザーのみ）
    ↓
画面表示完了
```

## 家族タイムライン取得フロー

```
useFamilyTimelines() 実行
    ↓
React Query: queryKey ["familyTimelines"]
    ↓
    ├── キャッシュあり（5分以内）
    │   └── キャッシュデータを即座に返す
    │
    └── キャッシュなし or 期限切れ
        ↓
        getFamilyTimelines() 実行
        ↓
        fetch("/api/timeline/family", { method: "GET" })
        ↓
        サーバー処理
            ├── 認証チェック
            ├── DB クエリ実行
            │   ├── family_timelines テーブル
            │   └── profiles テーブ（JOIN）
            └── レスポンス返却
        ↓
        クライアント受信
        {
          timelines: [
            {
              family_timeline: {
                id: "...",
                message: "太郎さんがクエスト「お皿洗い」を完了しました",
                createdAt: "2026-03-15T10:30:00Z",
                url: "/families/123/quests/456"
              },
              profiles: {
                name: "太郎",
                iconColor: "blue"
              }
            }
          ]
        }
        ↓
        React Query がキャッシュに保存
        ↓
        data, isLoading 状態更新
        ↓
        コンポーネント再レンダリング
        ↓
        TimelineItem[] 表示
```

## 公開タイムライン取得フロー

```
usePublicTimelines() 実行
    ↓
React Query: queryKey ["publicTimelines"]
    ↓
    ├── キャッシュあり（5分以内）
    │   └── キャッシュデータを即座に返す
    │
    └── キャッシュなし or 期限切れ
        ↓
        getPublicTimelines() 実行
        ↓
        fetch("/api/timeline/public", { method: "GET" })
        ↓
        サーバー処理
            ├── 認証チェック
            ├── DB クエリ実行
            │   ├── public_timelines テーブル
            │   └── families テーブル（JOIN）
            └── レスポンス返却
        ↓
        クライアント受信
        {
          timelines: [
            {
              public_timeline: {
                id: "...",
                message: "田中家が新しいクエストを公開しました",
                createdAt: "2026-03-15T11:00:00Z",
                url: "/public/quests/789"
              },
              families: {
                onlineName: "田中家",
                iconColor: "green"
              }
            }
          ]
        }
        ↓
        React Query がキャッシュに保存
        ↓
        data, isLoading 状態更新
        ↓
        コンポーネント再レンダリング
        ↓
        PublicTimelineItem[] 表示
```

## タブ切り替えフロー

```
ユーザー: "公開"タブをクリック
    ↓
ScrollableTabs onChange イベント発火
    ↓
setActiveTab("public") 実行
    ↓
activeTab state 更新
    ↓
コンポーネント再レンダリング
    ↓
条件分岐
    ├── activeTab === "family" → 家族タイムライン表示
    └── activeTab === "public" → 公開タイムライン表示
    ↓
該当タブのコンテンツ表示
    ↓
    ├── isLoading === true
    │   └── Loader 表示
    │
    └── isLoading === false
        ├── data が空
        │   └── "タイムラインがありません" 表示
        │
        └── data あり
            └── タイムラインアイテム一覧表示
```

## タイムラインアイテム表示フロー

```
familyTimelines.map((timeline) => ...)
    ↓
各timelineについて
    ↓
TimelineItem コンポーネント生成
    ├── key={timeline.family_timeline.id}
    └── props展開
        ├── profileName={timeline.profiles?.name}
        ├── profileIconColor={timeline.profiles?.iconColor}
        ├── message={timeline.family_timeline.message}
        ├── createdAt={timeline.family_timeline.createdAt}
        └── url={timeline.family_timeline.url}
    ↓
Card レンダリング
    ├── onClick={handleClick} 設定
    └── cursor スタイル設定
        ├── url あり → "pointer"
        └── url なし → "default"
    ↓
Group レンダリング
    ├── Avatar 表示
    │   ├── color={profileIconColor || "blue"}
    │   └── IconUser アイコン
    └── Content 表示
        ├── プロフィール名（Text size="sm"）
        ├── メッセージ（Text size="md"）
        └── タイムスタンプ（getRelativeTime）
    ↓
アイテム完成
```

## アイテムクリックフロー

```
ユーザー: TimelineItem をクリック
    ↓
onClick イベント発火
    ↓
handleClick() 実行
    ↓
url 存在チェック
    ├── url あり → router.push(url) 実行
    │   ↓
    │   Next.js クライアントサイドルーティング
    │   ↓
    │   該当ページへ遷移
    │   ├── クエスト詳細ページ
    │   ├── プロフィールページ
    │   └── その他関連ページ
    │
    └── url なし → 何もしない
```

## ローディング状態フロー

```
初期ロード or データ再取得
    ↓
isLoading === true
    ↓
UI表示判定
    ↓
<Center h={200}>
  <Loader />
</Center>
    ↓
データ取得完了
    ↓
isLoading === false
    ↓
UI更新
    ↓
    ├── data.length > 0
    │   └── タイムラインアイテム一覧表示
    │
    └── data.length === 0
        └── "タイムラインがありません" 表示
```

## 相対時間更新フロー

```
TimelineItem 表示
    ↓
getRelativeTime(createdAt) 呼び出し
    ↓
現在時刻との差分計算
    ↓
    ├── < 1分 → "たった今"
    ├── < 1時間 → "○分前"
    ├── < 24時間 → "○時間前"
    ├── < 30日 → "○日前"
    ├── < 365日 → "○ヶ月前"
    └── ≥ 365日 → "○年前"
    ↓
相対時間文字列を返す
    ↓
Text コンポーネントに表示
```

## 権限制御フロー

```
TimelinesScreen 初期化
    ↓
useLoginUserInfo() 実行
    ↓
isChild フラグ取得
    ↓
タブ配列生成
    ├── 常に追加: "家族"タブ
    └── 条件付き追加: !isChild ? "公開"タブ : なし
    ↓
    ├── 子供ユーザー
    │   └── tabs = ["家族"]
    │
    └── 親ユーザー
        └── tabs = ["家族", "公開"]
    ↓
ScrollableTabs に渡す
    ↓
UI表示
    ├── 子供: "家族"タブのみ表示
    └── 親: "家族"と"公開"タブ表示
```

## エラーハンドリングフロー

```
API呼び出し
    ↓
    ├── 成功
    │   └── データ表示フローへ
    │
    └── エラー
        ↓
        React Query エラー状態
        ↓
        error オブジェクト生成
        ↓
        エラーUI表示
        ├── Toastメッセージ（将来実装）
        └── エラーバウンダリ（グローバル）
```

## キャッシュ管理フロー

```
タイムラインデータ取得
    ↓
React Query キャッシュに保存
    └── staleTime: 5分
    ↓
5分以内の再アクセス
    ├── キャッシュから即座に表示
    └── background refetch（設定可能）
    ↓
5分経過後の再アクセス
    └── 新規データ取得
```

## 典型的な使用シナリオ

### シナリオ1: 子供ユーザーの家族タイムライン確認

```
1. 子供: /timeline にアクセス
    ↓
2. 認証チェック → OK
    ↓
3. isChild === true → 家族タブのみ表示
    ↓
4. useFamilyTimelines() でデータ取得
    ↓
5. ローディング表示
    ↓
6. データ取得完了
    ├── "お姉ちゃんがクエスト「部屋の掃除」を完了しました"
    ├── "お母さんが新しいクエスト「洗濯物を畳む」を作成しました"
    └── "太郎さんがレベル5に到達しました！"
    ↓
7. タイムラインアイテム一覧表示
    ↓
8. "お姉ちゃんがクエスト...を完了しました" をクリック
    ↓
9. クエスト詳細ページへ遷移
```

### シナリオ2: 親ユーザーの公開タイムライン確認

```
1. 親: /timeline にアクセス
    ↓
2. 認証チェック → OK
    ↓
3. isChild === false → 家族タブと公開タブ表示
    ↓
4. デフォルトで"家族"タブ選択
    ↓
5. 家族タイムライン表示
    ↓
6. "公開"タブをクリック
    ↓
7. activeTab state 更新 → "public"
    ↓
8. usePublicTimelines() でデータ取得
    ↓
9. ローディング表示
    ↓
10. データ取得完了
    ├── "田中家が新しいクエストを公開しました"
    ├── "佐藤家が公開クエスト「お手伝い」を作成しました"
    └── "鈴木家の花子さんがクエストを完了しました"
    ↓
11. 公開タイムラインアイテム一覧表示
    ↓
12. "田中家が新しいクエスト..." をクリック
    ↓
13. 公開クエスト詳細ページへ遷移
```

### シナリオ3: リアルタイム更新（将来実装: WebSocket）

```
1. ユーザー: タイムライン画面を表示中
    ↓
2. 他の家族メンバーがクエストを完了
    ↓
3. サーバーで新しいタイムラインイベント生成
    ↓
4. WebSocket経由でクライアントに通知
    ↓
5. React Query のキャッシュを無効化
    ↓
6. 自動的に再取得
    ↓
7. 新しいタイムラインアイテムが追加表示
    ↓
8. 通知バッジ表示（新着数）
```

## データ整合性チェックフロー

```
タイムラインデータ受信
    ↓
各フィールドの存在チェック
    ├── family_timeline.id → 必須
    ├── family_timeline.message → 必須
    ├── family_timeline.createdAt → 必須
    ├── family_timeline.url → 任意（nullチェック）
    ├── profiles.name → 任意（|| "不明なユーザ"）
    └── profiles.iconColor → 任意（|| "blue"）
    ↓
    ├── 必須フィールド欠如
    │   └── エラーログ出力（開発環境）
    │       ※ 本番環境ではスキップ
    │
    └── OK
        └── TimelineItem レンダリング
```

## パフォーマンス最適化フロー

```
大量のタイムラインアイテム表示
    ↓
React Query キャッシング
    ├── 不要な再レンダリング防止
    └── 重複リクエスト防止
    ↓
key属性による最適化
    └── key={timeline.id} で効率的なDiff
    ↓
条件付きレンダリング
    ├── activeTab === "family" のみ家族タイムライン
    └── activeTab === "public" のみ公開タイムライン
    ↓
高速な画面表示とスムーズなタブ切り替え
```

## 無限スクロール実装フロー（将来）

```
1. useInfiniteQuery に移行
    ↓
2. 初期20件を取得
    ↓
3. 画面下部に到達（IntersectionObserver）
    ↓
4. fetchNextPage() 実行
    ↓
5. 次の20件を取得
    ↓
6. 既存データに追加
    ↓
7. hasNextPage === false になるまで繰り返し
```
