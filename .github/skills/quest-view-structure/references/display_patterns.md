# クエスト閲覧画面 データ表示パターン

**最終更新: 2026年3月記載**

## タブ別表示内容

### 条件タブ（QuestConditionTab）

**表示項目:**
```typescript
{
  level: number                         // クエストレベル（1-5）
  maxLevel?: number                     // 最大レベル（デフォルト5）
  category: string                      // カテゴリ名
  successCondition: string              // 達成条件
  requiredCompletionCount: number       // 必要完了回数
  currentCompletionCount?: number       // 現在の完了回数（進捗表示用）
  reward: number                        // 報酬額（円）
  exp: number                           // 獲得経験値
  type?: "parent" | "child" | "online"  // クエストタイプ
  currentClearCount?: number            // 現在のクリア回数
  requiredClearCount?: number           // 次レベルまでの必要クリア回数
  iconName?: string                     // アイコン名
  iconSize?: number                     // アイコンサイズ
  iconColor?: string                    // アイコン色
}
```

**表示フォーマット:**

#### レベル表示
```
レベル: ★★★☆☆ (3)
```
- 星マークでレベルを視覚化
- maxLevelに応じて星の総数を調整

#### カテゴリ
```
カテゴリ: 家事・手伝い
```

#### 達成条件
```
達成条件:
お部屋をきれいに片付ける。
掃除機をかけて、床を拭く。
```

#### 必要完了回数
```
必要完了回数: 3回
```
- currentCompletionCountが指定されている場合は進捗表示
```
進捗: 2/3回 完了
```

#### 報酬
```
報酬: 500円
```

#### 経験値
```
獲得経験値: 100XP
```

#### レベルアップ情報（該当する場合）
```
次のレベルまで: あと2回クリア
```

---

### 依頼情報タブ（QuestDetailTab）

**表示項目:**
```typescript
{
  client: string          // 依頼主
  requestDetail: string   // 依頼内容
}
```

**表示フォーマット:**

#### 依頼主
```
依頼主: お母さん
```

#### 依頼内容
```
依頼内容:
お部屋が散らかっているので、
おもちゃを片付けて、床を掃除してください。
しっかりやったら、お小遣いをあげます！
```
- 複数行対応
- Markdownフォーマット対応（将来拡張）

---

### その他タブ（QuestOtherTab）

**表示項目:**
```typescript
{
  tags: string[]            // タグリスト
  ageFrom?: number | null   // 推奨年齢（開始）
  ageTo?: number | null     // 推奨年齢（終了）
  monthFrom?: number | null // 推奨月齢（開始）
  monthTo?: number | null   // 推奨月齢（終了）
}
```

**表示フォーマット:**

#### タグ
```
タグ: #家事 #掃除 #お手伝い
```
- Badgeコンポーネントで表示
- タグがない場合は「タグなし」表示

#### 推奨年齢
```
推奨年齢: 5歳 〜 10歳
```
- ageFrom/ageToの有無に応じて表示パターンを切り替え
  - 両方あり: `{ageFrom}歳 〜 {ageTo}歳`
  - ageFromのみ: `{ageFrom}歳以上`
  - ageToのみ: `{ageTo}歳以下`
  - なし: 表示なし

#### 推奨月齢
```
推奨月齢: 12ヶ月 〜 24ヶ月
```
- monthFrom/monthToの有無に応じて表示パターンを切り替え
  - 両方あり: `{monthFrom}ヶ月 〜 {monthTo}ヶ月`
  - monthFromのみ: `{monthFrom}ヶ月以上`
  - monthToのみ: `{monthTo}ヶ月以下`
  - なし: 表示なし

---

## ヘッダー表示パターン（QuestViewHeader）

**表示項目:**
```typescript
{
  questName: string
  headerColor?: { light: string, dark: string }
}
```

**表示例:**
```
┌─────────────────────────────┐
│ お部屋の掃除クエスト         │ ← 背景色: headerColor
└─────────────────────────────┘
```

**カラーテーマ例:**
- デフォルト（青系）: `{ light: 'blue.2', dark: 'blue.8' }`
- 緑系: `{ light: 'emerald.2', dark: 'emerald.8' }`
- 赤系: `{ light: 'red.2', dark: 'red.8' }`

---

## アイコン表示パターン（QuestViewIcon）

**表示項目:**
```typescript
{
  iconName?: string      // Tabler Iconsのアイコン名
  iconSize?: number      // サイズ（px）
  iconColor?: string     // Mantineカラー
}
```

**表示例:**
```
🧹 (IconBroom, size: 48, color: blue)
```

**よく使われるアイコン:**
- `IconBroom`: 掃除
- `IconBook`: 勉強
- `IconHeart`: 家族
- `IconStar`: 特別なクエスト
- `IconTrophy`: 達成

---

## ステータスによる表示制御（子供クエスト）

### not_started（未開始）
- フッター: 「開始する」ボタン
- 進捗表示: なし

### in_progress（進行中）
- フッター: 「完了報告」ボタン
- 進捗表示: 開始日時表示

### pending_review（レビュー待ち）
- フッター: 「報告取消」ボタン
- 進捗表示: 「承認待ち」バッジ

### completed（完了）
- フッター: ボタン無効化
- 進捗表示: 「完了」バッジ + 完了日時

---

## レベル別表示パターン（家族クエスト）

**複数レベルがある場合:**
- SubMenuFABでレベル選択メニューを表示
- 選択レベルに応じて条件タブの内容が動的に変更

**レベル選択メニュー:**
```
┌─────────────────┐
│ レベル1         │
│ レベル2         │
│ レベル3   ← 選択中
│ レベル4         │
│ レベル5         │
└─────────────────┘
```

**選択レベルの強調表示:**
- 選択中のレベルは背景色を変更
- アイコンで選択状態を示す

---

## 権限による表示制御

### 親の場合（家族クエスト）
- 編集ボタン表示
- 削除ボタン表示（ParentQuestViewFooter）
- レベル選択可能（SubMenuFAB）

### 子供の場合（子供クエスト）
- 完了報告ボタン表示（ChildQuestViewFooter）
- 報告取消ボタン表示（pending_reviewの場合）
- 編集・削除不可

### 全ユーザー（公開クエスト）
- いいねボタン表示
- コメントボタン表示
- 編集・削除不可

### 全ユーザー（テンプレートクエスト）
- 採用ボタン表示
- 編集・削除不可

---

## レスポンシブ表示

### モバイル表示
- タブは横スクロール可能
- フッターは固定配置
- FABは右下固定

### タブレット・PC表示
- タブは全て表示
- フッターは画面下部
- FABは右下固定（画面サイズに応じた配置調整）

---

## エラー状態の表示

### データ取得失敗
```
クエストの読み込みに失敗しました。
```

### 権限エラー
```
このクエストを閲覧する権限がありません。
```

### 存在しないクエスト
```
クエストが見つかりません。
```
