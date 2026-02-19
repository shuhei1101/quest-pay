# GitHub Copilot 向け指示書

## スキルの活用

このプロジェクトでは、以下の専門スキルを活用してください。各スキルは特定のタスクに最適化されています。

### 利用可能なスキル
1. **coding-standards**: コーディング規約（セミコロン禁止、型の使い方、コメント規則など）
2. **architecture-guide**: アーキテクチャパターン（フロント/API設計、モジュール構成、フロー図）
3. **code-review**: コードレビューチェックリスト（規約違反の検出、よくある間違いパターン）
4. **database-operations**: データベース操作（Drizzle ORM、低レベルクエリ、排他制御）
5. **code-explainer**: コード解説（既存コードの目的・構造・処理フローの詳細解説）
6. **code-improver**: コード改善提案（複数の改善案を優先度・難易度付きで提示）

**使用方法**: コード作成時は`coding-standards`と`architecture-guide`、レビュー時は`code-review`、DB操作時は`database-operations`、コード理解時は`code-explainer`、改善検討時は`code-improver`を参照してください。

## アプリ概要
- アプリ名: `お小遣いクエストボード`
- アプリ概要: 
  - 親がクエストを登録し、子供がそのクエストを実行するとお小遣いが貰える仕組みをシステム化
  - オンライン機能により、世界中の家族が自身のクエストを共有できる
- ユーザタイプ:
  - 親: クエストの登録や編集、家族情報の変更、オンラインの公開クエストの閲覧が可能
  - 子供: 家族クエストの閲覧、受注が可能
- 技術:
  - フロントエンド: `Next.js`
    - UIコンポーネントライブラリ: `MantineUI`
  - バックエンド: `Next.js`
  - DB: `Supabase`
- 備考:
  - DB接続はSupabase Clientを使用
  - 複数テーブルの更新はSupabaseの`Database Functions`を使用
  - 基本的にバックエンド側は人間が作成し、フロントエンド部分をAIが担当する

## よく使うファイルパス
| 項目                       | パス                                       | 説明                                                               |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| DBスキーマ定義             | `drizzle/schema.ts`                        |                                                                    |
| アプリ内エンドポイント定数 | `app/(core)/endpoints.ts`                  | APIや画面のエンドポイントを定義する                                |
| セッションストレージ       | `app/(core)/_sessionStorage/appStorage.ts` | アプリ内で使用するセッションストレージをキーバリュー形式で定義する |
| 家族クエスト一覧           | `app/(core)/quests/family/`                |                                                                    |
| サイドバー サイドメニュー  | `app/(app)/_components/SideMenu.tsx`       |                                                                    |
| フッター                   | `app/(app)/_components/BottomBar.tsx`      | モバイル時のフッター                                               |

## コーディングルール

詳細は`coding-standards`スキルを参照してください。主要なルール:
- すべて日本語で記述
- セミコロン禁止
- YAGNI原則に従う
- `type`を優先（`interface`は拡張性が必要な場合のみ）
- 関数とコンポーネントは`const`で定義（page.tsx以外）
- Props定義はインライン
- 関数コメントは動詞形式（`~する`）

## アーキテクチャ

詳細は`architecture-guide`スキルを参照してください。主要なパターン:

### フロント構成
- `page.tsx`: リダイレクト担当（サーバーコンポーネント）
- `XxxScreen.tsx`: 画面実装（API呼び出し、レイアウト構成）
- `XxxLayout.tsx`: レイアウト専念（データ表示のみ、API呼び出し禁止）

### API構成
- `client.ts` → `route.ts`のセット必須
- フックは`client.ts`経由でAPI呼び出し
- フックは`useQuery`または`useMutation`を使用

### DB操作
詳細は`database-operations`スキルを参照してください:
- Drizzle低レベルクエリを使用（高レベルクエリ禁止）
- 排他制御が必要な場合は`db_helper.ts`を使用
