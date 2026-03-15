# commit-auto ワークフロー

**最終更新:** 2026年3月記載

## ワークフロー概要

ユーザーの承認フレーズを受けて、セッション中の変更を自動的にコミットするまでのワークフロー。

## ステップバイステップガイド

### Step 1: トリガー検出

ユーザーが以下のようなフレーズを使用した場合、このスキルを起動：

**日本語:**
- これでOK
- コミットして
- 変更をコミット
- コミット実行

**英語:**
- commit this
- OK, commit it
- commit changes

### Step 2: セッション変更の特定

**重要:** ツール履歴から変更ファイルを正確に特定します。

#### ツール履歴の確認

このセッション中に実行した以下のツールをチェック：
- `replace_string_in_file`
- `multi_replace_string_in_file`
- `create_file`

#### ファイルパスの抽出

各ツールの実行履歴から `filePath` パラメータを抽出し、変更ファイルのリストを作成。

#### 変更状態の確認

```bash
git status --short
```

で実際の変更状態を確認し、ツール履歴と照合。

### Step 3: セキュリティチェック

スクリプトが自動的に `scripts/security_check.sh` を実行します。

#### 検出対象

- **AWS**: Access Key ID, Secret Access Key
- **Google**: API Key, OAuth credentials
- **GitHub**: Personal Access Token
- **Stripe**: Secret Key, Publishable Key
- **SSH**: RSA/EC/DSA Private Keys
- **Generic**: Password, API Key, Bearer Token, JWT

#### False Positive 除外

以下のキーワードを含む行は自動除外：
- example
- sample
- test
- mock
- dummy

#### セキュリティチェック結果の対応

**✅ 問題なし:**
```
Security check passed
```
→ コミットを続行

**⚠️ リスク検出:**
```
Security issue detected in <file>
Pattern: AWS_ACCESS_KEY_ID
```
→ ユーザーに警告を表示、対応方法を提示

**対応方法の提示:**
1. 機密情報を環境変数に移動
2. `.env` ファイルに保存
3. `.gitignore` に `.env` を追加
4. テストデータの場合は `--skip-security` オプション使用

### Step 4: コミットメッセージ生成

セッション中の変更内容を分析し、コミットメッセージを自動生成します。

#### 変更分析

1. **ファイルパスの分析**: 変更ファイルのパスからドメインを推測
2. **変更内容の分析**: ツールの実行内容から変更タイプを判定
3. **メッセージ構築**: `{ドメイン名}、{ラベル}（{変更概要}）` フォーマットで生成

#### 生成例

**変更内容:**
- ファイル: `.github/agents/mock-agent.md`
- ファイル: `.github/skills/mock-list/SKILL.md`
- 操作: 新規作成

**生成されるメッセージ:**
```
モック画面管理、新規機能（モック画面管理用エージェントを追加）
```

### Step 5: スクリプト実行

`scripts/commit_session_changes.sh` を使用してコミットを実行。

#### 実行コマンド

```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh \
  "モック画面管理" \
  "新規機能" \
  "モック画面管理用エージェントを追加" \
  .github/agents/mock-agent.md \
  .github/skills/mock-list/SKILL.md
```

#### スクリプトの内部処理

1. **引数検証**: 最低4つの引数が必要
2. **ファイル存在確認**: すべてのファイルが存在するか確認
3. **セキュリティチェック**: `--skip-security` でない場合のみ実行
4. **ステージング**: `git add <file>` で個別ファイルをステージング
5. **コミット**: `git commit -m "<message>"` でコミット実行
6. **確認**: コミット成功を確認

### Step 6: 結果報告

ユーザーにコミット成功を報告し、使用したコミットメッセージを表示。

**例:**
```
✅ コミット成功

コミットメッセージ:
モック画面管理、新規機能（モック画面管理用エージェントを追加）

変更ファイル:
- .github/agents/mock-agent.md
- .github/skills/mock-list/SKILL.md
```

## エラーハンドリング

### ファイルが見つからない

**エラー:**
```
Error: File not found: <filepath>
```

**対処法:**
1. ツール履歴を再確認
2. ファイルパスが正しいか確認
3. 必要に応じてファイルを再作成

### セキュリティチェック失敗

**エラー:**
```
Security check failed. Use --skip-security to bypass (not recommended).
```

**対処法:**
1. 検出された機密情報を確認
2. 環境変数に移動または削除
3. False positive の場合は `--skip-security` 使用

### コミット失敗

**エラー:**
```
Commit failed
```

**対処法:**
1. `git status` で状況確認
2. エラーメッセージを解読
3. 必要に応じて手動で対処
4. `git reset HEAD~1` でコミット取り消しも検討

## ベストプラクティス

### DO

- ✅ ツール履歴から正確にファイルを特定
- ✅ セキュリティチェックを信頼
- ✅ コミットメッセージは自動生成
- ✅ 1つの論理的な変更単位でコミット
- ✅ スクリプトを使用して安全にコミット

### DON'T

- ❌ `git add -A` や `git add .` を使用しない
- ❌ セッション外のファイルをコミットしない
- ❌ 手動でコミットメッセージを作成しない
- ❌ セキュリティチェックを無視しない
- ❌ 複数の無関係な変更を1つにまとめない

## トラブルシューティング

### Q: ツール履歴にないファイルがコミットされている

A: `git status` で確認し、意図しないファイルは `git reset HEAD <file>` で除外してください。

### Q: セキュリティチェックがテストデータに反応する

A: `--skip-security` オプションを使用してください。ただし、本当にテストデータであることを確認してください。

### Q: コミットメッセージが不適切

A: スクリプトの引数（ドメイン名、ラベル、変更概要）を見直してください。必要に応じて `git commit --amend` で修正できます。

### Q: 複数のドメインに変更が及ぶ

A: 別々のコミットに分割することを検討してください。1コミット1ドメインが理想です。
