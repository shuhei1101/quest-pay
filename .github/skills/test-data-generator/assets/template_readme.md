# テストデータ生成スクリプト

このディレクトリには、Supabaseデータベースにテストデータを投入するスクリプトが含まれています。

## ファイル構成

```
test-data-{date}/
├── generate_data.py   # テストデータ生成スクリプト
├── .env.local         # 接続情報（Gitにコミットしない）
└── README.md          # このファイル
```

## セットアップ

### 1. 依存関係のインストール

```bash
pip install psycopg2-binary faker python-dotenv
```

### 2. 接続情報の設定

`.env.local`ファイルを作成し、以下の内容を記述：

```env
DATABASE_URL="postgresql://postgres.spmuuethhjpvpaxckfgx:6rjnLuhcIWptizI6@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres"
```

**注意**: `.env.local`はGitにコミットしないでください（tmpディレクトリは管理外です）

## 実行方法

```bash
cd packages/web/tmp/test-data-{date}
python3 generate_data.py
```

## スクリプトの内容

このスクリプトは以下のことを行います：

1. **既存データの取得**
   - 家族情報をSELECT
   - アイコン情報をSELECT
   - カテゴリ情報をSELECT

2. **テストデータの生成**
   - Fakerライブラリで仮データ生成
   - リレーションを保った整合性のあるデータ作成
   - Enum型の値を正しく使用

3. **データベースへの投入**
   - INSERT文でデータを投入
   - バッチINSERTで効率的に処理
   - トランザクション管理

## カスタマイズ

要件に応じてスクリプトを修正してください：

- **生成する件数**: `quest_count = 100` の部分を変更
- **対象家族**: `random.choice(families)` の部分で特定の家族を指定
- **データ内容**: `generate_family_quests()` 関数内のロジックを修正

## トラブルシューティング

### エラー: DATABASE_URLが設定されていません

`.env.local`ファイルが正しく配置されているか確認してください。

### エラー: psycopg2がインストールされていません

```bash
pip install psycopg2-binary
```

### エラー: 外部キー制約違反

既存データ（家族、アイコン、カテゴリ）が存在するか確認してください。

## 注意事項

- **データの削除**: テストデータは本番環境には投入しないでください
- **機密情報**: `.env.local`には機密情報が含まれるため、Gitにコミットしないでください
- **データ量**: 大量のデータを投入する場合は、バッチサイズを調整してください

## 参考リンク

- スキーマ定義: `drizzle/schema.ts` (常に最新の情報を参照)
