(2026年3月15日 14:30記載)

# スキルパターン

## 概要

画面エージェントが使用するスキルの構造パターンと作成指針を定義する。

## スキルの基本構造

### ファイル構成
```
.github/skills/{screen-name}-{aspect}/
├── SKILL.md                # メインファイル（簡潔に）
├── references/             # 詳細ドキュメント
│   ├── {detail1}.md
│   ├── {detail2}.md
│   └── ...
├── scripts/                # 繰り返し実行コード
│   ├── {script1}.sh
│   └── {script2}.py
└── assets/                 # テンプレート・出力ファイル
    ├── {template1}.md
    └── {template2}.json
```

### YAMLフロントマター
```yaml
---
name: {screen-name}-{aspect}
description: {簡潔な1行説明}
---
```

### SKILL.md基本構造
```markdown
# {Screen Name} {Aspect} スキル

## 概要
このスキルの目的と提供する知識を簡潔に説明。

## メインソースファイル
関連する主要ファイルのリスト。

## 主要機能グループ
提供する機能を3-5個のグループに分類。

## Reference Files Usage
詳細情報へのナビゲーション。

## クイックスタート
初めて使う人向けの簡単な使い方。

## 実装上の注意点
開発時に注意すべきポイント。
```

## スキルタイプ別パターン

### タイプ1: 一覧画面スキル (-list)

**目的**: 一覧表示、検索、フィルタリング機能の知識提供

**SKILL.md構成**:
```markdown
---
name: {screen}-list
description: {Screen}一覧画面の構造知識を提供するスキル。ファイル構成、コンポーネント、処理フローを含む。
---

# {Screen}一覧 スキル

## 概要
{Screen}の一覧表示、検索、フィルタリング機能の知識を提供。

## メインソースファイル
### 画面
- `app/(app)/{screen}/page.tsx`: エントリーポイント
- `app/(app)/{screen}/{Screen}Screen.tsx`: 一覧画面実装

### コンポーネント
- `app/(app)/{screen}/_components/{Item}Card.tsx`: アイテムカード
- `app/(app)/{screen}/_components/{Screen}List.tsx`: リストコンポーネント

### Hooks
- `app/(app)/{screen}/_hooks/use{Screen}.ts`: データ取得フック

## 主要機能グループ
### 1. 一覧表示
データ取得、表示、ページネーション

### 2. 検索・フィルタリング
検索入力、フィルタ条件、絞り込み

### 3. ソート
並び替え、昇順/降順

### 4. アクション
新規作成、編集、削除

## Reference Files Usage
### 画面構造を把握する場合
```
references/screen_structure.md
```

### コンポーネント詳細を確認する場合
```
references/components.md
```

### 処理フローを理解する場合
```
references/data_flow.md
```
```

**References/**:
- `screen_structure.md`: ファイル構成、ディレクトリ構造
- `components.md`: 各コンポーネントのProps、役割
- `data_flow.md`: データ取得から表示までのフロー

### タイプ2: 閲覧画面スキル (-view)

**目的**: 詳細表示、関連データ表示の知識提供

**SKILL.md構成**:
```markdown
---
name: {screen}-view
description: {Screen}閲覧画面の構造知識を提供するスキル。表示内容、コンポーネントを含む。
---

# {Screen}閲覧 スキル

## 概要
{Screen}の詳細表示と関連データ表示の知識を提供。

## メインソースファイル
### 画面
- `app/(app)/{screen}/[id]/view/page.tsx`: エントリーポイント
- `app/(app)/{screen}/[id]/view/{Screen}ViewScreen.tsx`: 閲覧画面実装

### コンポーネント
- `_components/{Detail}Section.tsx`: 詳細セクション
- `_components/{Related}List.tsx`: 関連データリスト

## 主要機能グループ
### 1. 基本情報表示
タイトル、説明、ステータス

### 2. 詳細情報表示
追加データ、関連情報

### 3. 関連データ
子データ、履歴、コメント

### 4. アクション
編集、削除、その他操作

## Reference Files Usage
### 表示内容を確認する場合
```
references/display_sections.md
```

### 権限制御を理解する場合
```
references/permissions.md
```
```

**References/**:
- `display_sections.md`: 表示セクションの詳細
- `permissions.md`: 表示・操作の権限制御

### タイプ3: 編集画面スキル (-edit)

**目的**: フォーム管理、バリデーション、保存処理の知識提供

**SKILL.md構成**:
```markdown
---
name: {screen}-edit
description: {Screen}編集画面の構造知識を提供するスキル。フォーム管理、バリデーション、処理フローを含む。
---

# {Screen}編集 スキル

## 概要
{Screen}の作成・編集フォーム、バリデーション、保存処理の知識を提供。

## メインソースファイル
### 画面
- `app/(app)/{screen}/[id]/page.tsx`: 編集画面エントリー
- `app/(app)/{screen}/[id]/{Screen}EditScreen.tsx`: 編集画面実装
- `app/(app)/{screen}/new/page.tsx`: 新規作成エントリー

### コンポーネント
- `_components/{Screen}Form.tsx`: フォームコンポーネント

### Hooks
- `_hooks/use{Screen}Form.ts`: フォーム管理フック

## 主要機能グループ
### 1. フォーム管理
入力フィールド、状態管理

### 2. バリデーション
入力チェック、エラー表示

### 3. 保存処理
作成、更新、エラーハンドリング

### 4. キャンセル・削除
破棄、削除確認

## Reference Files Usage
### フォーム構造を把握する場合
```
references/form_structure.md
```

### バリデーションルールを確認する場合
```
references/validation_rules.md
```

### 保存処理フローを理解する場合
```
references/save_flow.md
```
```

**References/**:
- `form_structure.md`: フォームフィールド定義
- `validation_rules.md`: バリデーションルール詳細
- `save_flow.md`: 保存処理のシーケンス

### タイプ4: API操作スキル (-api)

**目的**: API エンドポイント、リクエスト/レスポンス、DB操作の知識提供

**SKILL.md構成**:
```markdown
---
name: {screen}-api
description: {Screen}API操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。
---

# {Screen}API スキル

## 概要
{Screen}のCRUD操作、アクション処理のAPI知識を提供。

## メインソースファイル
### API Routes
- `app/api/{resource}/route.ts`: 一覧取得、新規作成
- `app/api/{resource}/[id]/route.ts`: 詳細取得、更新、削除

### クライアント側
- `app/api/{resource}/client.ts`: APIクライアント関数
- `app/api/{resource}/query.ts`: React Queryフック

### データベース
- `drizzle/schema.ts`: {tables}

## 主要機能グループ
### 1. 基本CRUD
一覧取得、新規作成、詳細取得、更新、削除

### 2. アクション操作
特定のアクション処理

### 3. クエリ・フィルタ
検索、絞り込み、ソート

## Reference Files Usage
### データベース構造を把握する場合
```
references/er_diagram.md
```

### API仕様を詳細に確認する場合
```
references/api_endpoints.md
```

### 処理フローを把握する場合
```
references/sequence_diagram.md
```

## クイックスタート
1. **全体像の把握**: `references/flow_diagram.md`でフロー確認
2. **データ構造の理解**: `references/er_diagram.md` でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認

## 実装上の注意点
### 必須パターン
- **client.ts + route.ts**: セットで実装
- **React Query**: useQuery/useMutationでAPIアクセス
- **トランザクション**: 複数テーブル更新時は必須
- **Logger**: すべてのAPI処理でlogger使用

### 権限管理
- 各エンドポイントでの権限チェック
```

**References/**:
- `er_diagram.md`: テーブル構造とリレーション
- `flow_diagram.md`: ライフサイクル・ステータス遷移
- `sequence_diagram.md`: API処理シーケンス
- `api_endpoints.md`: 詳細なAPI仕様

### タイプ5: レイアウト構造スキル (-structure)

**目的**: レイアウトコンポーネントの構造知識提供

**SKILL.md構成**:
```markdown
---
name: {layout}-structure
description: {Layout}の構造知識を提供するスキル。コンポーネント構造を含む。
---

# {Layout}構造 スキル

## 概要
{Layout}の構造とコンポーネント構成の知識を提供。

## メインソースファイル
- `app/(core)/_components/{Layout}/{Layout}.tsx`: メインコンポーネント
- `app/(core)/_components/{Layout}/{SubComponent}.tsx`: サブコンポーネント

## 主要機能グループ
### 1. レイアウト構造
基本構造、グリッド配置

### 2. サブコンポーネント
各パーツの役割と配置

## Reference Files Usage
### 構造を把握する場合
```
references/layout_structure.md
```
```

**References/**:
- `layout_structure.md`: レイアウト詳細構造

### タイプ6: レイアウト使用方法スキル (-usage)

**目的**: レイアウトコンポーネントの使用方法提供

**SKILL.md構成**:
```markdown
---
name: {layout}-usage
description: {Layout}使用方法を提供するスキル。Props定義、使用例を含む。
---

# {Layout}使用方法 スキル

## 概要
{Layout}の使用方法とProps定義を提供。

## メインソースファイル
- `app/(core)/_components/{Layout}/{Layout}.tsx`

## 主要機能グループ
### 1. Props定義
必須Props、オプショナルProps

### 2. 使用例
典型的な使用パターン

## Reference Files Usage
### Props定義を確認する場合
```
references/props_definition.md
```

### 使用例を見る場合
```
references/usage_examples.md
```
```

**References/**:
- `props_definition.md`: Props詳細定義
- `usage_examples.md`: 具体的な使用例

## Progressive Disclosure原則

### SKILL.mdに記載すべき内容
- 概要（1-2文）
- メインソースファイル（5-10個）
- 主要機能グループ（3-5個）
- Reference Files Usage（ナビゲーション）
- クイックスタート（簡潔に）
- 実装上の注意点（重要な3-5点のみ）

### References/に記載すべき内容
- 詳細なAPI仕様
- 完全なコンポーネント定義
- ER図・フロー図・シーケンス図
- 詳細なバリデーションルール
- 完全な使用例

### Scripts/に配置すべきもの
- 繰り返し実行するコード
- 構造分析スクリプト
- テストデータ生成
- ドキュメント生成

### Assets/に配置すべきもの
- テンプレートファイル
- 出力用フォーマット
- サンプルデータ

## スキル命名規則

### 基本形式
```
{screen-name}-{aspect}
```

### アスペクト種別
- `list`: 一覧画面
- `view`: 閲覧画面
- `edit`: 編集画面
- `api`: API操作
- `structure`: 構造
- `usage`: 使用方法

### 具体例
- `family-quest-list`: 家族クエスト一覧スキル
- `family-quest-api`: 家族クエストAPIスキル
- `app-shell-structure`: AppShell構造スキル

## ベストプラクティス

### スキル作成
1. **簡潔に**: SKILL.mdは短く、詳細はreferences/
2. **ナビゲーション**: Reference Files Usageセクションで案内
3. **実行可能**: スクリプトで繰り返し作業を自動化

### スキル管理
1. **定期更新**: 構造変更時はスキルも更新
2. **参照整理**: 使われていないreferencesは削除
3. **スクリプト保守**: 動作確認と最適化
