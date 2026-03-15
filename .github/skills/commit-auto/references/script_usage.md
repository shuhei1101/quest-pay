# commit-auto スクリプト使用方法

**最終更新:** 2026年3月記載

## スクリプト概要

`scripts/commit_session_changes.sh`は、セッション中の変更ファイルを安全にコミットするためのスクリプトです。

## 基本的な使用方法

```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh "<ドメイン名>" "<ラベル>" "<変更概要>" <file1> <file2> <file3>...
```

### 引数の説明

- **ドメイン名**: 変更対象のドメイン（家族クエスト閲覧、家族メンバー一覧など）
- **ラベル**: 変更の種類（機能追加、新規機能、バグ修正、レイアウト調整など）
- **変更概要**: 具体的な変更内容を一言で
- **file1, file2, ...**: コミットする実際のファイルパス（セッション中に変更したファイル）

### 実行例

```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh \
  "モック画面管理" \
  "新規機能" \
  "モック画面管理用エージェントを追加" \
  .github/agents/mock-agent.md \
  .github/skills/mock-list/SKILL.md
```

## セキュリティチェック

スクリプトは自動的にセキュリティチェック（`scripts/security_check.sh`）を実行します。

### セキュリティチェックスキップ

False positiveの場合、セキュリティチェックをスキップできます：

```bash
.github/skills/commit-auto/scripts/commit_session_changes.sh --skip-security \
  "<ドメイン名>" \
  "<ラベル>" \
  "<変更概要>" \
  <file1> <file2> <file3>...
```

**注意:** セキュリティチェックをスキップする場合は、機密情報が含まれていないことを確認してください。

## スクリプトの処理内容

1. **引数検証**: 最低4つの引数（ドメイン、ラベル、概要、ファイル）が必要
2. **ファイル存在確認**: 指定されたすべてのファイルが存在するか確認
3. **セキュリティチェック**: 機密情報（APIキー、パスワード等）の検出
4. **ステージング**: `git add <file>` で個別ファイルをステージング
5. **コミット**: コミットメッセージを生成してコミット実行
6. **確認**: コミット成功を報告

## 禁止事項

- **CRITICAL**: `git add -A`, `git add .`, `git add --all` は絶対に使用しない
- スクリプトを使わずに手動でコミットしない
- セッション外のファイルをコミットに含めない
- 意図していないファイルの混入を防ぐ

## エラーハンドリング

### ファイルが存在しない

```
Error: File not found: <filepath>
```

対処法: ファイルパスを確認し、正しいパスを指定してください。

### セキュリティリスク検出

```
Security check failed. Use --skip-security to bypass (not recommended).
```

対処法:
1. 検出された機密情報を環境変数に移動
2. `.env` ファイルに保存し、`.gitignore` に追加
3. テストデータ等の場合は `--skip-security` オプション使用

### コミット失敗

```
Commit failed
```

対処法:
1. git status で状況を確認
2. エラーメッセージを確認
3. 必要に応じて手動で `git reset` を実行
