# GitHub Copilot 向け指示書

## スキルとカスタムエージェントの活用

- **スキル**: 自動的にロードされ、コーディング規約やアーキテクチャの知識を提供
- **カスタムエージェント**: `@`で選択して対話的に作業（画面ごと、コードレビュー、説明など）

## アプリ概要
- **お小遣いクエストボード**: 親がクエストを登録、子供が実行してお小遣いを獲得
- **技術**: Next.js + MantineUI + Supabase
- **ファイルパス**: `drizzle/schema.ts`（DB）、`app/(core)/endpoints.ts`（エンドポイント）

## 開発ルール
- **コーディング**: `coding-standards`スキル参照（日本語、セミコロン禁止、type優先）
- **アーキテクチャ**: `architecture-guide`スキル参照（page.tsx→Screen→Layout構成）
- **DB操作**: `database-operations`スキル参照（Drizzle低レベルクエリ、排他制御）


