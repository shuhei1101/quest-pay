---
name: schema-structure
description: DBスキーマ構造の知識を提供するスキル。テーブル定義、カラム型を含む。 Trigger Keywords: データベーススキーマ、テーブル構造、カラム定義、schema.ts、データベース設計
---

# DBスキーマ構造 スキル

## 概要

このスキルは、お小遣いクエストボードのデータベーススキーマ構造を提供します。Drizzle ORMとSupabaseを使用したテーブル定義、リレーション、データ型を網羅します。

## メインソースファイル

### スキーマ定義
- `drizzle/schema.ts`: 全テーブル定義、Enum型、リレーション定義

### マイグレーション
- `supabase/migrations/`: SQLマイグレーションファイル

## 主要テーブルグループ

### 1. 認証・プロフィール系
- `auth.users`: Supabase認証ユーザー
- `profiles`: ユーザープロフィール（家族メンバー共通）
- `parents`: 親ユーザー拡張
- `children`: 子供ユーザー拡張（レベル、経験値、貯金額含む）

### 2. 家族系
- `families`: 家族グループ
- `icons`, `icon_categories`: アイコンマスター

### 3. クエスト系
- `family_quests`: 家族クエスト本体
- `family_quest_details`: レベル別報酬設定
- `child_quests`: 子供の受注・進捗情報
- `public_quests`: 公開クエスト
- `template_quests`, `template_quest_details`: テンプレートクエスト
- `quest_categories`: カテゴリマスター

### 4. エンゲージメント系
- `public_quest_likes`: いいね
- `public_quest_comments`: コメント
- `comment_votes`: コメント投票

### 5. 報酬・通知系
- `reward_tables`: 家族ごとのレベル別報酬設定
- `reward_history`: 報酬受け取り履歴
- `notifications`: 通知
- `timeline_posts`: タイムライン投稿

## Reference Files Usage

### データベース全体構造を把握する場合
詳細なER図（Mermaid記法）とテーブルリレーションを確認：
```
references/er_diagram.md
```

### 特定テーブルの詳細定義を確認する場合
各テーブルのカラム定義、制約、Enum型、リレーションを確認：
```
references/table_details.md
```

## 使用技術

- **ORM**: Drizzle ORM（低レベルクエリ推奨）
- **データベース**: Supabase（PostgreSQL）
- **型安全**: TypeScript型推論（`$inferSelect`, `$inferInsert`）

## クイックスタート

1. **全体構造の把握**: `references/er_diagram.md`を読み込む
2. **テーブル定義の確認**: `references/table_details.md`をテーブル名で検索
3. **実装時**: `drizzle/schema.ts`から型定義をインポート

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
