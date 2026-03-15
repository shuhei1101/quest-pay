(2026年3月記載)

# 出力フォーマット仕様

## 概要

スクリプトが生成する出力の詳細フォーマット仕様を定義する。

## 画面構造出力フォーマット

### 基本構造

```markdown
# 画面構造: {screen-path}

## ファイル構成
```
{file-list}
```

## メインファイル
{main-files}

## コンポーネント
{components}

## フック
{hooks}

## API クライアント
{api-clients}
```

### セクション詳細

#### 1. ファイル構成
すべての`.tsx`と`.ts`ファイルを相対パスでリスト表示。

**例**:
```
app/(app)/families/page.tsx
app/(app)/families/FamiliesScreen.tsx
app/(app)/families/[id]/page.tsx
app/(app)/families/[id]/FamilyEditScreen.tsx
app/(app)/families/_components/FamilyCard.tsx
app/(app)/families/_hooks/useFamilies.ts
```

**ソート順**: アルファベット順

#### 2. メインファイル
画面のエントリーポイントとメイン実装ファイル。

**検出パターン**:
- `page.tsx`: Next.jsのページファイル
- `*Screen.tsx`: 画面コンポーネント
- `layout.tsx`: レイアウトファイル

**例**:
```markdown
- `app/(app)/families/page.tsx`: ページエントリーポイント
- `app/(app)/families/FamiliesScreen.tsx`: メイン画面実装
```

#### 3. コンポーネント
`_components/` 配下のすべてのReactコンポーネント。

**例**:
```markdown
- `app/(app)/families/_components/FamilyCard.tsx`: FamilyCard コンポーネント
- `app/(app)/families/_components/FamilyForm.tsx`: FamilyForm コンポーネント
- `app/(app)/families/_components/FamilyList.tsx`: FamilyList コンポーネント
```

#### 4. フック
`_hooks/` 配下のすべてのカスタムフック。

**例**:
```markdown
- `app/(app)/families/_hooks/useFamilies.ts`: useFamilies フック
- `app/(app)/families/_hooks/useFamilyForm.ts`: useFamilyForm フック
```

#### 5. API クライアント
API通信に関連するファイル。

**検出パターン**:
- `client.ts`: APIクライアント関数
- `query.ts`: React Query フック

**例**:
```markdown
- `app/api/families/client.ts`: API クライアント
- `app/api/families/query.ts`: React Query フック
```

## API構造出力フォーマット

### 基本構造

```markdown
# API構造: {api-path}

## ファイル構成
```
{file-list}
```

## エンドポイント
{endpoints}

## クライアント
{clients}
```

### セクション詳細

#### 1. ファイル構成
APIディレクトリ内のすべてのファイルをツリー構造で表示。

**例**:
```
app/api/quests/family/
├── route.ts
├── client.ts
├── query.ts
└── [id]/
    ├── route.ts
    ├── publish/
    │   └── route.ts
    └── child/
        └── [childId]/
            ├── approve/
            │   └── route.ts
            └── reject/
                └── route.ts
```

#### 2. エンドポイント
各`route.ts`ファイルのHTTPメソッドとパス。

**検出方法**:
- ファイルパスからエンドポイントを推測
- 静的パス: そのまま表示
- 動的パス: `[id]` → `{id}` に変換

**例**:
```markdown
- `app/api/quests/family/route.ts`: GET（一覧）、POST（作成）
- `app/api/quests/family/[id]/route.ts`: GET（詳細）、PUT（更新）、DELETE（削除）
- `app/api/quests/family/[id]/publish/route.ts`: POST（公開）
```

#### 3. クライアント
APIクライアント関連ファイル。

**例**:
```markdown
- `app/api/quests/family/client.ts`: API クライアント関数
- `app/api/quests/family/query.ts`: React Query フック
```

## フォーマット規則

### パス表記
- 相対パス使用（`packages/web/` からの相対）
- バッククォート（`` ` ``）で囲む
- スラッシュ区切り（`/`）

### ファイル名表記
- 拡張子を含める（`.tsx`, `.ts`）
- 大文字小文字を保持

### 説明文
- 簡潔な1行説明
- 日本語を使用
- 専門用語は適切に使用

### コードブロック
- ファイルリストは ` ``` ` で囲む
- 言語指定なし（プレーンテキスト）

## エラー時の出力

### ディレクトリ不存在
```
エラー: ディレクトリが存在しません: {path}
```

### 引数不足
```
使用方法: bash generate_screen_structure.sh <screen-path>
例: bash generate_screen_structure.sh app/(app)/families
```

### ファイルなし
該当セクションを省略するか、以下を出力：
```markdown
## {セクション名}
（なし）
```
