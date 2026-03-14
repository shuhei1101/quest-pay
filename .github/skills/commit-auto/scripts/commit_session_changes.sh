#!/bin/bash
# commit_session_changes.sh
# セッション中に変更したファイルのみを安全にコミットするスクリプト
#
# Usage: ./commit_session_changes.sh "commit message" file1 [file2] [file3]...
#        ./commit_session_changes.sh --skip-security "commit message" file1 [file2] [file3]...
#
# Options:
#   --skip-security  セキュリティチェックをスキップ（false positiveの場合に使用）
#
# Example:
#   ./commit_session_changes.sh "feat: 新機能を追加" src/app.ts src/utils.ts

set -e  # エラー時に即座に終了

# スクリプトのディレクトリパスを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECURITY_CHECK_SCRIPT="$SCRIPT_DIR/security_check.sh"

# セキュリティチェックをスキップするかどうか
SKIP_SECURITY=0

# --skip-security オプションのチェック
if [ "$1" = "--skip-security" ]; then
  SKIP_SECURITY=1
  shift
fi

# 引数チェック
if [ $# -lt 2 ]; then
  echo "エラー: 引数が不足しています"
  echo "使用法: $0 [--skip-security] <コミットメッセージ> <ファイル1> [ファイル2] [ファイル3]..."
  echo ""
  echo "オプション:"
  echo "  --skip-security  セキュリティチェックをスキップ"
  echo ""
  echo "例:"
  echo "  $0 \"feat: 新機能を追加\" src/app.ts src/utils.ts"
  echo "  $0 --skip-security \"feat: 新機能を追加\" src/app.ts src/utils.ts"
  exit 1
fi

COMMIT_MESSAGE="$1"
shift  # 残りの引数はすべてファイルパス

FILES=("$@")

# ファイル存在確認
echo "=== ファイル確認 ==="
for file in "${FILES[@]}"; do
  if [ ! -e "$file" ]; then
    echo "エラー: ファイルが存在しません: $file"
    exit 1
  fi
  echo "✓ $file"
done

# セキュリティチェック
if [ $SKIP_SECURITY -eq 0 ]; then
  echo ""
  if [ -x "$SECURITY_CHECK_SCRIPT" ]; then
    "$SECURITY_CHECK_SCRIPT" "${FILES[@]}"
  else
    echo "⚠️  警告: セキュリティチェックスクリプトが実行可能ではありません"
    echo "  パス: $SECURITY_CHECK_SCRIPT"
    echo "  以下のコマンドで実行可能にしてください:"
    echo "    chmod +x $SECURITY_CHECK_SCRIPT"
    echo ""
    echo "続行しますか? (y/N): "
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
      echo "中止しました"
      exit 1
    fi
  fi
fi

# git statusで変更確認
echo ""
echo "=== 変更状態確認 ==="
git status --short "${FILES[@]}"

# ステージング
echo ""
echo "=== ステージング ==="
git add "${FILES[@]}"
echo "✓ ${#FILES[@]}個のファイルをステージングしました"

# コミット
echo ""
echo "=== コミット ==="
git commit -m "$COMMIT_MESSAGE"

echo ""
echo "✓ コミット完了"
