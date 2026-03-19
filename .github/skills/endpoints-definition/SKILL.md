---
name: endpoints-definition
description: エンドポイント定義の知識を提供するスキル。endpoints.tsの構造と使用方法を含む。 Trigger Keywords: endpoints, API routes, URL definition, endpoints.ts, route paths
---

# エンドポイント定義 スキル

## 概要

このスキルは、Quest Payアプリケーションのすべてのエンドポイント（ページURL・API URL）を一元管理する`endpoints.ts`の知識を提供します。

## メインソースファイル

### エンドポイント定義
- `app/(core)/endpoints.ts`: すべてのURL定義を一元管理

## 主要機能グループ

### 1. ページURL管理
- 認証関連: ログイン、サインアップ、パスワードリセット
- メイン画面: ホーム、タイムライン
- クエスト画面: 家族クエスト、公開クエスト、テンプレートクエスト
- 管理画面: 家族管理、子供管理、報酬設定

### 2. API URL管理
- クエストAPI: 家族クエスト、公開クエスト、テンプレートクエスト
- 管理API: 家族、子供、ユーザー
- 操作API: いいね、コメント、フォロー

### 3. 動的URL生成
- 関数形式でIDを受け取りURLを生成
- 型安全なURL構築

## Reference Files Usage

### APIルート一覧を確認する場合
すべてのAPIエンドポイントとHTTPメソッドを確認：
```
references/api_routes.md
```

### ページルート一覧を確認する場合
すべてのページURLと画面遷移を確認：
```
references/page_routes.md
```

### 実装パターンを学ぶ場合
ルート定義のベストプラクティス、命名規則、使用例を確認：
```
references/route_patterns.md
```

## クイックスタート

1. **全体像の把握**: `references/page_routes.md`でページ構成確認
2. **API理解**: `references/api_routes.md`でAPIエンドポイント確認
3. **実装時**: `references/route_patterns.md`でパターン確認

## 実装上の注意点

### 必須パターン
1. **URL直書き禁止**: すべて`endpoints.ts`から参照
2. **動的URLは関数形式**: `QUEST_URL(id)`の形式で定義
3. **階層構造を保つ**: 親階層から順にURLを構築

### scripts/
Executable code (Python/Bash/etc.) that can be run directly to perform specific operations.

**Examples from other skills:**
- PDF skill: `fill_fillable_fields.py`, `extract_form_field_info.py` - utilities for PDF manipulation
- DOCX skill: `document.py`, `utilities.py` - Python modules for document processing

**Appropriate for:** Python scripts, shell scripts, or any executable code that performs automation, data processing, or specific operations.

**Note:** Scripts may be executed without loading into context, but can still be read by Claude for patching or environment adjustments.

### references/
Documentation and reference material intended to be loaded into context to inform Claude's process and thinking.

**Examples from other skills:**
- Product management: `communication.md`, `context_building.md` - detailed workflow guides
- BigQuery: API reference documentation and query examples
- Finance: Schema documentation, company policies

**Appropriate for:** In-depth documentation, API references, database schemas, comprehensive guides, or any detailed information that Claude should reference while working.

### assets/
Files not intended to be loaded into context, but rather used within the output Claude produces.

**Examples from other skills:**
- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


