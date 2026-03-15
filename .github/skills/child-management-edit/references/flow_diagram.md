# 子供編集画面 - フローダイアグラム

（2026年3月記載）

## 画面初期化フロー

### 新規作成モード (children/new)

```mermaid
graph TD
  A[ページアクセス] --> B[ChildFormレンダリング]
  B --> C[useChildForm初期化]
  C --> D[デフォルト値設定]
  D --> E[フォーム表示]
  E --> F[ユーザー入力待ち]
```

### 編集モード (children/[id])

```mermaid
graph TD
  A[ページアクセス] --> B[ChildFormレンダリング]
  B --> C[useChildForm初期化]
  C --> D{childId存在?}
  D -->|Yes| E[React Query: getChild]
  E --> F[データ取得中 isLoading=true]
  F --> G[データ取得成功]
  G --> H[フォームに値設定 reset]
  H --> I[フォーム表示]
  I --> J[ユーザー入力待ち]
  D -->|No| K[デフォルト値設定]
  K --> J
```

## フォーム編集フロー

```mermaid
graph TD
  A[ユーザー入力] --> B{入力フィールド}
  B -->|名前| C[register name]
  B -->|アイコン| D[IconSelectPopup表示]
  D --> E[setValue iconId/iconColor]
  B -->|誕生日| F[DateInput変更]
  F --> G[setValue birthday]
  C --> H[リアルタイムバリデーション]
  E --> H
  G --> H
  H --> I[errors更新]
  I --> J[エラー表示]
```

## バリデーションフロー

```mermaid
graph TD
  A[フォーム入力] --> B[Zod Resolver]
  B --> C{バリデーション}
  C -->|成功| D[errors = {}]
  C -->|失敗| E[errors更新]
  E --> F[フィールド下にエラー表示]
  D --> G[送信可能状態]
```

## 送信フロー

### 新規作成

```mermaid
graph TD
  A[保存ボタンクリック] --> B[handleSubmit実行]
  B --> C[バリデーション]
  C -->|失敗| D[エラー表示]
  C -->|成功| E[handleRegister呼び出し]
  E --> F{id存在?}
  F -->|No| G[postChild API]
  G --> H[成功]
  H --> I[toast.success]
  I --> J[setId 新規ID]
  J --> K[router.push 一覧へ]
  G --> L[失敗]
  L --> M[toast.error]
```

### 更新

```mermaid
graph TD
  A[保存ボタンクリック] --> B[handleSubmit実行]
  B --> C[バリデーション]
  C -->|失敗| D[エラー表示]
  C -->|成功| E[handleRegister呼び出し]
  E --> F{id存在?}
  F -->|Yes| G[putChild API]
  G --> H[成功]
  H --> I[toast.success]
  I --> J[router.push 一覧へ]
  G --> K[失敗]
  K --> L[toast.error]
```

## エラーハンドリングフロー

```mermaid
graph TD
  A[API呼び出し] --> B{結果}
  B -->|成功| C[トースト成功メッセージ]
  C --> D[画面遷移]
  B -->|エラー| E[handleAppError]
  E --> F[エラー画面表示 or トースト]
```

## ローディング状態フロー

```mermaid
graph TD
  A[画面表示] --> B{isLoading or isSubmitting}
  B -->|true| C[LoadingOverlay表示]
  C --> D[フォーム入力無効化]
  B -->|false| E[通常表示]
  E --> F[フォーム入力可能]
```
