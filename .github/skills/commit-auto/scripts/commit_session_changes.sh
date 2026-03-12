#!/bin/bash
# commit_session_changes.sh
# セッション中に変更したファイルのみを安全にコミットするスクリプト
#
# Usage: ./commit_session_changes.sh "commit message" file1 [file2] [file3]...
#
# Example:
#   ./commit_session_changes.sh "feat: 新機能を追加" src/app.ts src/utils.ts

set -e  # エラー時に即座に終了

# 引数チェック
if [ $# -lt 2 ]; then
  echo "エラー: 引数が不足しています"
  echo "使用法: $0 <コミットメッセージ> <ファイル1> [ファイル2] [ファイル3]..."
  echo ""
  echo "例:"
  echo "  $0 \"feat: 新機能を追加\" src/app.ts src/utils.ts"
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
