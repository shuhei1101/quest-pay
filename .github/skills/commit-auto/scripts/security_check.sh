#!/bin/bash
# security_check.sh
# コミット前にセキュリティ上の問題（APIキー、パスワード等）をチェックするスクリプト
#
# Usage: ./security_check.sh file1 [file2] [file3]...
#
# Exit codes:
#   0 - 問題なし
#   1 - セキュリティリスク検出

set -e

if [ $# -lt 1 ]; then
  echo "エラー: チェックするファイルを指定してください"
  exit 1
fi

FILES=("$@")
FOUND_ISSUE=0

echo "=== セキュリティチェック ==="

# チェックパターン定義
declare -A PATTERNS=(
  # AWS関連
  ["AWS Access Key"]="AKIA[0-9A-Z]{16}"
  ["AWS Secret Key"]="aws.{0,20}(secret|password|key).{0,20}['\"][0-9a-zA-Z/+=]{40}['\"]"
  
  # Google API
  ["Google API Key"]="AIza[0-9A-Za-z_-]{35}"
  ["Google OAuth"]="[0-9]+-[0-9A-Za-z_]{32}\.apps\.googleusercontent\.com"
  
  # GitHub
  ["GitHub Token"]="gh[pousr]_[0-9a-zA-Z]{36}"
  ["GitHub Classic Token"]="ghp_[0-9a-zA-Z]{36}"
  
  # Stripe
  ["Stripe Secret Key"]="sk_live_[0-9a-zA-Z]{24,}"
  ["Stripe Publishable Key"]="pk_live_[0-9a-zA-Z]{24,}"
  
  # Generic patterns
  ["Private Key"]="-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----"
  ["Password in Config"]="password\s*[:=]\s*['\"][^'\"]{8,}['\"]"
  ["Bearer Token"]="bearer\s+[a-zA-Z0-9_\-\.]{20,}"
  ["API Key Generic"]="api[_-]?key\s*[:=]\s*['\"][a-zA-Z0-9_\-]{20,}['\"]"
  ["Secret Generic"]="secret\s*[:=]\s*['\"][a-zA-Z0-9_\-]{20,}['\"]"
  
  # JWT Token
  ["JWT Token"]="eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"
)

# 除外パターン（false positiveを減らす）
EXCLUDE_PATTERNS=(
  "example"
  "sample"
  "test"
  "mock"
  "dummy"
  "placeholder"
  "your_api_key"
  "YOUR_API_KEY"
  "xxx"
  "XXX"
)

# 各ファイルをチェック
for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "⚠ スキップ: $file (ファイルではありません)"
    continue
  fi
  
  # バイナリファイルはスキップ
  if file "$file" | grep -q "binary"; then
    echo "✓ $file (バイナリファイル - スキップ)"
    continue
  fi
  
  FILE_HAS_ISSUE=0
  
  # 各パターンでチェック
  for pattern_name in "${!PATTERNS[@]}"; do
    pattern="${PATTERNS[$pattern_name]}"
    
    # パターンマッチング（大文字小文字を区別しない）
    matches=$(grep -iEn "$pattern" "$file" 2>/dev/null || true)
    
    if [ -n "$matches" ]; then
      # 除外パターンチェック
      is_excluded=0
      for exclude in "${EXCLUDE_PATTERNS[@]}"; do
        if echo "$matches" | grep -iq "$exclude"; then
          is_excluded=1
          break
        fi
      done
      
      if [ $is_excluded -eq 0 ]; then
        if [ $FILE_HAS_ISSUE -eq 0 ]; then
          echo ""
          echo "⚠️  セキュリティリスク検出: $file"
          FILE_HAS_ISSUE=1
          FOUND_ISSUE=1
        fi
        
        echo "  - $pattern_name 検出:"
        echo "$matches" | head -3 | sed 's/^/    /'
        
        # 行数が多い場合は省略
        match_count=$(echo "$matches" | wc -l)
        if [ "$match_count" -gt 3 ]; then
          echo "    ... (他 $((match_count - 3)) 件)"
        fi
      fi
    fi
  done
  
  if [ $FILE_HAS_ISSUE -eq 0 ]; then
    echo "✓ $file"
  fi
done

echo ""
if [ $FOUND_ISSUE -eq 1 ]; then
  echo "❌ セキュリティチェック失敗"
  echo ""
  echo "検出された問題:"
  echo "  - APIキー、パスワード、トークン等の機密情報が含まれている可能性があります"
  echo ""
  echo "推奨事項:"
  echo "  1. 機密情報を環境変数に移動 (.env ファイル)"
  echo "  2. .gitignore に .env を追加"
  echo "  3. シークレット管理サービスの使用を検討"
  echo "  4. false positive の場合は、このチェックを無視して続行可能です"
  echo ""
  exit 1
else
  echo "✅ セキュリティチェック完了（問題なし）"
fi

exit 0
