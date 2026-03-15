# 家族編集画面 - フローダイアグラム

（2026年3月記載）

## 画面初期化フロー

### 新規作成モード (families/new)

```mermaid
graph TD
  A[ページアクセス] --> B[FamilyNewScreenレンダリング]
  B --> C[useFamilyRegisterForm初期化]
  C --> D[デフォルト値設定]
  D --> E[テーマカラー適用]
  E --> F[フォーム表示]
  F --> G[ユーザー入力待ち]
```

## フォーム編集フロー

```mermaid
graph TD
  A[ユーザー入力] --> B{入力フィールド}
  B -->|ローカル家族名| C[register localName]
  B -->|オンライン家族名| D[register onlineName]
  B -->|家族ID| E[register displayId]
  B -->|家紋| F[familyIconOpen → IconSelectPopup]
  F --> G[setValue familyIconId/Color]
  B -->|親名| H[register parentName]
  B -->|親アイコン| I[parentIconOpen → IconSelectPopup]
  I --> J[setValue parentIconId/Color]
  B -->|親誕生日| K[DateInput変更]
  K --> L[setValue parentBirthday]
  C --> M[リアルタイムバリデーション]
  D --> M
  E --> M
  G --> M
  H --> M
  J --> M
  L --> M
  M --> N[errors更新]
  N --> O[エラー表示]
```

## アイコン選択フロー

### 家紋選択

```mermaid
graph TD
  A[家紋ActionIconクリック] --> B[openFamilyIcon実行]
  B --> C[familyIconOpened = true]
  C --> D[IconSelectPopup表示]
  D --> E[アイコン選択]
  E --> F[setFamilyValue familyIconId]
  E --> G[setFamilyValue familyIconColor]
  F --> H[closeFamilyIcon実行]
  G --> H
  H --> I[familyIconOpened = false]
  I --> J[ポップアップ閉じる]
  J --> K[選択アイコン表示更新]
```

### 親アイコン選択

```mermaid
graph TD
  A[親アイコンActionIconクリック] --> B[openParentIcon実行]
  B --> C[parentIconOpened = true]
  C --> D[IconSelectPopup表示]
  D --> E[アイコン選択]
  E --> F[setFamilyValue parentIconId]
  E --> G[setFamilyValue parentIconColor]
  F --> H[closeParentIcon実行]
  G --> H
  H --> I[parentIconOpened = false]
  I --> J[ポップアップ閉じる]
  J --> K[選択アイコン表示更新]
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
  E --> F[postFamily API]
  F --> G{API結果}
  G -->|成功| H[toast.success]
  H --> I[router.push FAMILIES_LIST_URL]
  I --> J[家族一覧画面へ遷移]
  G -->|失敗| K[toast.error]
  K --> L[エラーメッセージ表示]
```

## エラーハンドリングフロー

```mermaid
graph TD
  A[API呼び出し] --> B{結果}
  B -->|成功| C[トースト成功メッセージ]
  C --> D[画面遷移]
  B -->|エラー| E[catch処理]
  E --> F[toast.error]
  F --> G[エラーメッセージ表示]
  G --> H[ユーザーに再試行促す]
```

## ローディング状態フロー

```mermaid
graph TD
  A[画面表示] --> B{isSubmitting}
  B -->|true| C[LoadingOverlay表示 予定]
  C --> D[フォーム入力無効化]
  B -->|false| E[通常表示]
  E --> F[フォーム入力可能]
```

**注意**: 現時点では isSubmitting 状態が未実装。今後の拡張予定。

## 状態管理フロー

```mermaid
graph TD
  A[フォーム初期化] --> B[defaultFamily設定]
  B --> C[テーマカラー取得]
  C --> D[familyIconColor = theme.colors.blue5]
  C --> E[parentIconColor = theme.colors.blue5]
  D --> F[useForm初期化]
  E --> F
  F --> G[フォーム状態管理開始]
```

## 今後の拡張予定フロー

### 編集モード（未実装）

```mermaid
graph TD
  A[編集ページアクセス] --> B[家族ID取得]
  B --> C[React Query: getFamily]
  C --> D[データ取得]
  D --> E[フォーム初期化]
  E --> F[編集画面表示]
  F --> G[保存時はputFamily]
```
