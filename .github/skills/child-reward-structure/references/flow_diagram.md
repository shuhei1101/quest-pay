# 子供個別の報酬設定画面 - フローダイアグラム

（2026年3月記載）

## 画面初期化フロー

### 編集画面 (children/[id]/reward)

```mermaid
graph TD
  A[ページアクセス] --> B[ChildRewardEditレンダリング]
  B --> C[useChildAgeRewardForm初期化]
  B --> D[useChildLevelRewardForm初期化]
  C --> E[React Query: getChildAgeRewardTable]
  D --> F[React Query: getChildLevelRewardTable]
  E --> G[年齢別報酬取得中 isLoading=true]
  F --> H[レベル別報酬取得中 isLoading=true]
  G --> I{取得完了?}
  H --> I
  I -->|No| J[null返却 画面非表示]
  I -->|Yes| K[フォームに値設定]
  K --> L[タブ表示 activeTab="age"]
  L --> M[ユーザー操作待ち]
```

### 閲覧画面 (children/[id]/reward/view)

```mermaid
graph TD
  A[ページアクセス] --> B[ChildRewardViewレンダリング]
  B --> C[データ取得]
  C --> D[タブ表示 activeTab="age"]
  D --> E[読み取り専用レイアウト表示]
```

## タブ切り替えフロー

```mermaid
graph TD
  A[タブクリック] --> B[setActiveTab更新]
  B --> C{activeTab値}
  C -->|"age"| D[AgeRewardEditLayout表示]
  C -->|"level"| E[LevelRewardEditLayout表示]
  D --> F[対応フォームデータ表示]
  E --> F
```

## フォーム編集フロー

```mermaid
graph TD
  A[ユーザー入力] --> B[フォーム値更新]
  B --> C[Zod Resolverバリデーション]
  C --> D{バリデーション}
  D -->|成功| E[errors = {}]
  D -->|失敗| F[errors更新]
  F --> G[フィールドエラー表示]
  E --> H[送信可能状態]
```

## 保存フロー

### お小遣いタブ保存

```mermaid
graph TD
  A[保存ボタンクリック] --> B{activeTab?}
  B -->|"age"| C[ageForm.handleSubmit]
  C --> D[バリデーション]
  D -->|失敗| E[エラー表示]
  D -->|成功| F[ageUpdateMutation.mutate]
  F --> G[putChildAgeRewardTable API]
  G --> H{API結果}
  H -->|成功| I[queryClient.invalidateQueries]
  I --> J[toast.success]
  J --> K[router.push 閲覧画面]
  H -->|失敗| L[toast.error]
```

### ランク報酬タブ保存

```mermaid
graph TD
  A[保存ボタンクリック] --> B{activeTab?}
  B -->|"level"| C[levelForm.handleSubmit]
  C --> D[バリデーション]
  D -->|失敗| E[エラー表示]
  D -->|成功| F[levelUpdateMutation.mutate]
  F --> G[putChildLevelRewardTable API]
  G --> H{API結果}
  H -->|成功| I[queryClient.invalidateQueries]
  I --> J[toast.success]
  J --> K[router.push 閲覧画面]
  H -->|失敗| L[toast.error]
```

## 破棄フロー

```mermaid
graph TD
  A[破棄ボタンクリック] --> B[window.confirm表示]
  B --> C{確認結果}
  C -->|キャンセル| D[何もしない]
  C -->|OK| E{activeTab?}
  E -->|"age"| F[ageForm.setForm fetchedAgeReward]
  E -->|"level"| G[levelForm.setForm fetchedLevelReward]
  F --> H[フォームリセット]
  G --> H
```

## 閲覧モード遷移フロー

```mermaid
graph TD
  A[閲覧ボタンクリック] --> B[router.push]
  B --> C[CHILD_REWARD_VIEW_URL childId]
  C --> D[閲覧画面表示]
```

## データ再取得フロー

```mermaid
graph TD
  A[更新成功] --> B[invalidateQueries]
  B --> C[該当queryKey無効化]
  C --> D[React Query自動再フェッチ]
  D --> E[最新データ取得]
  E --> F[フォーム更新]
```

## ローディング状態フロー

```mermaid
graph TD
  A[画面表示] --> B{ローディング判定}
  B -->|isLoading| C[null返却 非表示]
  B -->|!isLoading && isPending| D[LoadingOverlay表示]
  D --> E[ユーザー操作無効]
  B -->|!isLoading && !isPending| F[通常表示]
  F --> G[ユーザー操作可能]
```

## エラーハンドリングフロー

```mermaid
graph TD
  A[データ取得 or 更新] --> B{結果}
  B -->|成功| C[成功トースト]
  C --> D[画面遷移 or 状態更新]
  B -->|エラー| E[handleAppError or onError]
  E --> F[エラートースト]
  F --> G[ユーザーに再試行促す]
```
