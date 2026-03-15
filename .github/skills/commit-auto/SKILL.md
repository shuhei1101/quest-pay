---
name: commit-auto
description: This skill should be used when the user requests to commit changes using phrases like "これでOK", "コミットして", "commit this", or similar approval statements. It automates the git workflow by staging changes and creating commits with self-generated meaningful commit messages.
---

# Commit Auto スキル

## 概要

ユーザーの承認フレーズを受けて、セッション中の変更を安全にコミットするスキルです。自動的にセキュリティチェックを実行し、意味のあるコミットメッセージを生成します。

## トリガーフレーズ

以下のようなフレーズでこのスキルを起動：
- "これでOK"
- "コミットして"
- "commit this"
- "変更をコミット"
- "OK, commit it"

## メインソースファイル

### スクリプト
- `scripts/commit_session_changes.sh`: コミット実行スクリプト
- `scripts/security_check.sh`: セキュリティチェックスクリプト

## 主要機能グループ

### 1. セッション変更の特定
- ツール履歴から変更ファイルを特定
- git status で状態確認

### 2. セキュリティチェック
- 機密情報の自動検出（APIキー、パスワード、トークン等）
- False positive の除外
- リスク検出時の警告

### 3. コミットメッセージ生成
- 変更内容を分析
- フォーマット: `{ドメイン名}、{ラベル}（{変更概要}）`
- 日本語で簡潔に要約

### 4. 安全なコミット実行
- 個別ファイル指定によるステージング
- セキュリティチェック済みファイルのみコミット
- セッション外のファイル混入を防止

## Reference Files Usage

### スクリプトの使用方法を確認する場合
コミットスクリプトの実行方法、引数、オプションを確認：
```
references/script_usage.md
```

### コミットメッセージフォーマットを確認する場合
フォーマット規則、良い例・悪い例、ラベル一覧を確認：
```
references/commit_format.md
```

### ワークフロー全体を理解する場合
ステップバイステップのワークフロー、エラーハンドリング、ベストプラクティスを確認：
```
references/workflow.md
```

## クイックスタート

1. **トリガー検出**: ユーザーの承認フレーズを検知
2. **変更特定**: `references/workflow.md` Step 1参照
3. **セキュリティチェック**: 自動実行される
4. **メッセージ生成**: `references/commit_format.md` 参照
5. **コミット実行**: `references/script_usage.md` の実行方法でスクリプト起動

## 実装上の注意点

### 必須パターン
- **スクリプト使用**: 必ず `scripts/commit_session_changes.sh` を使用
- **セキュリティチェック**: 自動実行される（スキップは `--skip-security`）
- **セッション限定**: ツール履歴から特定したファイルのみコミット
- **日本語メッセージ**: Quest Payプロジェクトでは日本語を使用

### 禁止事項
- **CRITICAL**: `git add -A`, `git add .`, `git add --all` は絶対に使用しない
- **CRITICAL**: `git push` は絶対に実行しない（pushはユーザーが行う）
- 手動でのコミット実行を行わない
- セッション外のファイルを含めない
- 自動プッシュは行わない（コミットのみ）

### セキュリティチェック対象
- AWS, Google, GitHub, Stripe の認証情報
- SSH秘密鍵
- パスワード、APIキー、Bearer Token, JWT

### コミットメッセージ構造
```
{ドメイン名}、{ラベル}（{変更概要}）
```

**例:**
- `共通コンポーネント、レイアウト調整（ページヘッダーのプロフィールアイコンサイズを縮小）`
- `家族クエスト一覧、バグ修正（完了済みクエストの表示エラーを修正）`
- `タイムライン、新規機能（コメント投稿機能を追加）`

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## Bundled Resources

### scripts/commit_session_changes.sh

Safe commit script that:
- **Generates commit message from 3 components**: `{ドメイン名}、{ラベル}（{変更概要}）`
- Validates file existence before staging
- **Executes security check automatically**
- Stages only specified files (prevents accidental commits)
- Provides clear feedback at each step
- Exits on any error
- Supports `--skip-security` option for false positives

**Arguments:**
1. Domain name (ドメイン名): e.g., "家族クエスト閲覧", "共通コンポーネント"
2. Label (ラベル): e.g., "新規機能", "バグ修正", "レイアウト調整"
3. Summary (変更概要): e.g., "ページヘッダーのアイコンサイズを縮小"
4. Files: List of files to commit

Usage documented in the workflow above.

### scripts/security_check.sh

Security validation script that:
- Scans files for API keys, passwords, tokens
- Uses regex patterns for common secret formats
- Excludes false positives (test/example data)
- Skips binary files automatically
- Provides detailed detection reports
- Exits with error code if risks found

Called automatically by `commit_session_changes.sh`.
