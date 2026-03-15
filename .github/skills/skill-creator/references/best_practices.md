(2026年3月記載)

# スキル作成 ベストプラクティス

## Progressive Disclosure（段階的開示）

### 原則

情報を3つのレベルに分割してコンテキスト効率を最大化します:

1. **メタデータ**: 常に表示（~100 words）
2. **SKILL.md**: スキル起動時にロード（<5k words）
3. **Bundled Resources**: 必要時のみロード（無制限*）

### 実装戦略

#### SKILL.mdを軽量に保つ

**含めるべき内容**:
- スキルの目的（数文）
- いつ使用すべきか
- 主要なワークフロー
- リソースへの参照方法

**含めるべきでない内容**:
- 詳細なAPI仕様 → `references/api_endpoints.md`
- データベーススキーマ → `references/er_diagram.md`
- フロー図 → `references/flow_diagram.md`
- 長いコード例 → `scripts/` または `assets/`

#### References ディレクトリの活用

```markdown
### API仕様を確認する場合
詳細なエンドポイント、リクエスト/レスポンス形式を確認:
\`\`\`
references/api_endpoints.md
\`\`\`

### データ構造を理解する場合
テーブル関係とER図を確認:
\`\`\`
references/er_diagram.md
\`\`\`
```

このパターンにより、Claudeは必要な情報のみを選択的にロードできます。

## トークン効率

### スクリプトの活用

**問題**: 同じコードを繰り返し生成するとトークンを浪費する

**解決策**: スクリプトファイルに保存

#### 例: PDF回転

❌ **悪い例**: 毎回コードを生成
```python
# Claudeが毎回50-100トークンを使ってこのコードを生成
from PyPDF2 import PdfReader, PdfWriter
# ... 残り30行のコード
```

✅ **良い例**: スクリプトに保存
```bash
# scripts/rotate_pdf.py を実行するだけ（5トークン）
scripts/rotate_pdf.py input.pdf 90
```

### 参照ファイルの分割

**問題**: 1つの巨大なファイルは常に全体をロードする必要がある

**解決策**: トピックごとにファイルを分割

#### 例: API ドキュメント

❌ **悪い例**: 1つの巨大ファイル
```
references/
└── complete_documentation.md  # 50,000 words
```

✅ **良い例**: トピックごとに分割
```
references/
├── api_endpoints.md          # 3,000 words
├── er_diagram.md             # 2,000 words
├── flow_diagram.md           # 2,000 words
└── sequence_diagram.md       # 2,000 words
```

### 重複の回避

**原則**: 同じ情報をSKILL.mdとreferencesの両方に記載しない

❌ **悪い例**:
```markdown
# SKILL.md
## API Endpoints
- POST /api/items - アイテム作成
- GET /api/items/:id - アイテム取得
- ...（100行）

# references/api_endpoints.md
## API Endpoints
- POST /api/items - アイテム作成
- GET /api/items/:id - アイテム取得
- ...（100行）
```

✅ **良い例**:
```markdown
# SKILL.md
## API Endpoints
詳細なエンドポイント仕様を確認:
\`\`\`
references/api_endpoints.md
\`\`\`

# references/api_endpoints.md
## API Endpoints
- POST /api/items - アイテム作成
- GET /api/items/:id - アイテム取得
- ...（100行）
```

## メタデータ品質

### Description の書き方

**目的**: Claudeがいつスキルを使うべきかを正確に判断できるようにする

#### 基本ルール

1. **三人称を使用**: "This skill should be used when..."
2. **具体的に**: 抽象的な説明を避ける
3. **トリガー条件を含める**: どんな質問やタスクで起動すべきか
4. **範囲を明確に**: 何を含み、何を含まないか

#### 例

❌ **悪い例**: 漠然としている
```yaml
description: データベース操作のスキル
```

✅ **良い例**: 具体的で明確
```yaml
description: This skill should be used when implementing database operations using Drizzle ORM and Supabase. It provides guidelines for query construction, transaction handling, and best practices for database access patterns.
```

❌ **悪い例**: 一人称/二人称
```yaml
description: Use this skill when you need to work with images.
```

✅ **良い例**: 三人称
```yaml
description: This skill should be used when editing, rotating, or manipulating image files. It provides image processing scripts and format conversion utilities.
```

### Name の命名規則

**形式**: kebab-case

**パターン**:
- 動詞-名詞: `edit-images`, `build-frontend`, `manage-database`
- 名詞-名詞: `pdf-editor`, `image-processor`, `data-validator`
- 複合名詞: `family-quest-api`, `child-reward-api`

### トリガー最適化

**問題**: Descriptionが不明確だとスキルが起動しない、または不適切に起動する

**解決策**: テストクエリを想定してdescriptionを書く

#### 例: 画像編集スキル

想定クエリ:
- "この画像を回転させて"
- "画像のサイズを変更したい"
- "画像形式をPNGからJPEGに変換して"

最適なdescription:
```yaml
description: This skill should be used when editing, rotating, resizing, or converting image files. It provides Python scripts for common image manipulation tasks including rotation, scaling, format conversion, and basic editing operations.
```

## 文体とフォーマット

### 命令形/不定詞形の使用

**ルール**: 動詞先の指示文を使用し、二人称を避ける

#### 例

❌ **悪い例**: 二人称
```markdown
You should read the API documentation when you need to understand the endpoints.
```

✅ **良い例**: 命令形/不定詞形
```markdown
To understand the endpoints, read the API documentation:
\`\`\`
references/api_endpoints.md
\`\`\`
```

❌ **悪い例**: 受動態
```markdown
The script can be executed to rotate PDFs.
```

✅ **良い例**: 能動態・命令形
```markdown
Execute the script to rotate PDFs:
\`\`\`bash
scripts/rotate_pdf.py input.pdf 90
\`\`\`
```

### セクション構造

#### 推奨構造

```markdown
# スキル名

## 概要
- スキルの目的（2-3文）
- 提供する主要機能

## メインソースファイル
- 関連ファイルのリスト

## 主要機能グループ
- 機能の分類と説明

## Reference Files Usage
- いつ、どのreferencesファイルを読むべきか

## クイックスタート
- 最初に何を読むべきか

## 実装上の注意点
- 必須パターン
- 権限管理
- エラーハンドリング
```

### コードブロックとファイルパス

#### ファイルパスの記述

```markdown
### データベース構造を把握する場合
テーブルのER図を確認:
\`\`\`
references/er_diagram.md
\`\`\`
```

#### コマンド例の記述

```markdown
### スクリプトの実行
PDF回転スクリプトを実行:
\`\`\`bash
scripts/rotate_pdf.py input.pdf 90
\`\`\`
```

## リソース管理

### Scripts 使用ガイドライン

#### 配置判断フローチャート

```
同じコードを3回以上書いている？
    ↓ Yes
決定論的な出力が必要？
    ↓ Yes
環境依存性は低い？
    ↓ Yes
→ scripts/ に配置
```

#### 良いスクリプトの特徴

1. **単一責任**: 1つのスクリプトは1つの明確なタスクを実行
2. **引数化**: ハードコードを避け、引数で動作を制御
3. **エラーハンドリング**: 適切なエラーメッセージとexit code
4. **ドキュメント**: スクリプト内にdocstringまたはコメント

#### 例: 良いスクリプト

```python
#!/usr/bin/env python3
"""
PDF回転スクリプト

Usage:
    scripts/rotate_pdf.py <input_pdf> <rotation_angle>

Args:
    input_pdf: 入力PDFファイルパス
    rotation_angle: 回転角度 (90, 180, 270)
"""
import sys
from PyPDF2 import PdfReader, PdfWriter

def rotate_pdf(input_path, angle):
    """PDFを指定角度回転する"""
    if angle not in [90, 180, 270]:
        raise ValueError(f"Invalid angle: {angle}")
    # ... 実装

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    
    try:
        rotate_pdf(sys.argv[1], int(sys.argv[2]))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
```

### References 使用ガイドライン

#### ファイル分割戦略

**トピックごとに分割**: 関連する情報をグループ化

```
references/
├── api_endpoints.md       # API仕様
├── er_diagram.md          # データ構造
├── flow_diagram.md        # ビジネスロジック
└── sequence_diagram.md    # 処理シーケンス
```

**ユースケースごとに分割**: 使用場面別に情報を整理

```
references/
├── getting_started.md     # 初心者向け
├── advanced_usage.md      # 上級者向け
├── troubleshooting.md     # トラブルシューティング
└── faq.md                 # よくある質問
```

#### 大きなファイルの扱い

**10,000 words以上のファイルの場合**:

1. **目次を追加**
```markdown
# 目次
- [セクション1](#セクション1)
- [セクション2](#セクション2)
```

2. **Grep検索パターンを提供**（SKILL.md内）
```markdown
### 特定エンドポイントを検索する場合
\`\`\`bash
grep "POST /api/items" references/api_endpoints.md
\`\`\`
```

3. **分割を検討**
大きすぎる場合は複数ファイルに分割

### Assets 使用ガイドライン

#### 配置判断

**配置すべきファイル**:
- Claudeが読まない（コンテキストにロードしない）
- 出力で使用する（コピー、変更、参照）
- バイナリファイル（画像、フォント、バイナリ形式のドキュメント）

**配置すべきでないファイル**:
- Claudeが読む必要があるテキストドキュメント → references/
- 実行するスクリプト → scripts/

#### 使用例

**テンプレート使用**:
```markdown
## Frontend Template Usage

Bootstrap a new project using the template:
1. Copy `assets/frontend-template/` to project directory
2. Customize `app.tsx` and `styles.css`
3. Update `package.json` metadata
```

**画像・アセット使用**:
```markdown
## Brand Assets

Corporate logo is available at:
\`\`\`
assets/logo.png
\`\`\`

Use this logo in generated reports and presentations.
```

## 検証とテスト

### パッケージング前チェックリスト

#### 構造検証
- [ ] SKILL.md 存在確認
- [ ] YAMLフロントマター正しい形式
- [ ] name と description 存在確認
- [ ] 不要な例示ファイル削除済み

#### コンテンツ検証
- [ ] SKILL.md < 5,000 words
- [ ] 重複情報なし
- [ ] すべてのリソース参照済み
- [ ] Progressive Disclosure 実装済み

#### 機能検証
- [ ] スクリプトが実行可能
- [ ] ファイルパスが正しい
- [ ] 参照ファイルが適切に分割されている

### テスト戦略

#### 1. トリガーテスト

想定クエリでスキルが起動するか確認:
```
「PDFを回転させて」 → pdf-editor skill起動？
「データベースを作成して」 → database-operations skill起動？
```

#### 2. 機能テスト

各機能が正しく動作するか確認:
- スクリプトが実行できるか
- 参照ファイルが読み込めるか
- アセットファイルがアクセスできるか

#### 3. コンテキスト効率テスト

適切な情報のみがロードされるか確認:
- 不要な情報がSKILL.mdに含まれていないか
- 参照ファイルが適切に分割されているか
- スクリプトがコンテキスト効率に貢献しているか

## よくある間違い

### 1. SKILL.mdが大きすぎる

❌ **問題**: すべての情報をSKILL.mdに詰め込む（20,000 words）

✅ **解決**: references/に分割（SKILL.md 3,000 words + references 17,000 words）

### 2. 重複情報

❌ **問題**: 同じ情報がSKILL.mdとreferencesの両方にある

✅ **解決**: 情報は1箇所のみ。SKILL.mdはreferencesへの参照のみ

### 3. 不明確なDescription

❌ **問題**: `description: データベース操作`

✅ **解決**: `description: This skill should be used when implementing database operations using Drizzle ORM and Supabase. It provides guidelines for query construction, transaction handling, and best practices for database access patterns.`

### 4. 二人称の使用

❌ **問題**: "You should read the documentation..."

✅ **解決**: "To understand the API, read the documentation..."

### 5. スクリプト不使用

❌ **問題**: 同じコードを毎回生成する

✅ **解決**: スクリプトに保存して再利用

### 6. 参照ファイル未使用

❌ **問題**: すべてをSKILL.mdに記載し、references/が空

✅ **解決**: 詳細情報をreferences/に移動

### 7. Assets の誤用

❌ **問題**: API仕様をassetsに配置

✅ **解決**: API仕様はreferencesに配置。assetsは出力用ファイルのみ

## まとめ

### スキル作成の黄金律

1. **Progressive Disclosure**: 情報を3段階に分割
2. **トークン効率**: スクリプトと参照ファイルを活用
3. **明確なメタデータ**: 具体的で正確なdescription
4. **重複排除**: 情報は1箇所のみ
5. **命令形**: 動詞先の指示文を使用
6. **適切な分割**: scripts/references/assetsを正しく使い分け

### チェックリスト

スキルをパッケージングする前に:
- [ ] SKILL.md < 5,000 words
- [ ] description が具体的で明確
- [ ] 重複情報なし
- [ ] references/ に詳細情報を配置
- [ ] scripts/ に繰り返しコードを配置
- [ ] assets/ に出力用ファイルを配置
- [ ] 命令形/不定詞形を使用
- [ ] すべてのリソースがSKILL.mdで参照されている
