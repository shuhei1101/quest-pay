#!/usr/bin/env python3
"""
ログ配置分析スクリプト

既存のTypeScriptファイルを解析し、ログが不足している箇所や
改善が必要な箇所を特定して提案する。
"""

import os
import re
from typing import List, Dict, Tuple
from pathlib import Path


class LogAnalyzer:
    """TypeScriptファイルのログ配置を分析するクラス"""
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.content = ""
        self.lines = []
        self.suggestions = []
        
    def load_file(self) -> None:
        """ファイルを読み込み"""
        with open(self.file_path, 'r', encoding='utf-8') as f:
            self.content = f.read()
            self.lines = self.content.split('\n')
    
    def has_logger_import(self) -> bool:
        """logger のインポートがあるか確認"""
        import_pattern = r"import.*from\s+['\"].*logger['\"]"
        return bool(re.search(import_pattern, self.content))
    
    def find_api_routes(self) -> List[Dict]:
        """API Route を検出"""
        suggestions = []
        
        # GET, POST, PUT, DELETE等のエクスポート関数を検出
        pattern = r"export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\("
        
        for i, line in enumerate(self.lines, 1):
            if re.search(pattern, line):
                # その関数内に logger.info があるか確認
                function_content = self._get_function_body(i - 1)
                
                if 'logger.info' not in function_content:
                    suggestions.append({
                        'line': i,
                        'type': 'api_entry_missing',
                        'severity': 'high',
                        'message': f'{line.strip()} - API エントリーポイントに logger.info がありません',
                        'suggestion': "logger.info('API リクエスト受信', { /* params */ })",
                    })
        
        return suggestions
    
    def find_try_catch_blocks(self) -> List[Dict]:
        """try-catch ブロックを検出し、catch にログがあるか確認"""
        suggestions = []
        
        in_try = False
        try_start = 0
        
        for i, line in enumerate(self.lines, 1):
            stripped = line.strip()
            
            if stripped.startswith('try'):
                in_try = True
                try_start = i
            
            elif stripped.startswith('catch') and in_try:
                in_try = False
                
                # catch ブロック内を確認
                catch_body = self._get_block_content(i - 1)
                
                if 'logger.error' not in catch_body and 'logger.warn' not in catch_body:
                    suggestions.append({
                        'line': i,
                        'type': 'error_log_missing',
                        'severity': 'high',
                        'message': f'Line {i}: catch ブロックに logger.error がありません',
                        'suggestion': "logger.error('エラー内容', { error })",
                    })
        
        return suggestions
    
    def find_db_operations(self) -> List[Dict]:
        """DB操作を検出"""
        suggestions = []
        
        # db.insert, db.update, db.delete, db.query等を検出
        db_patterns = [
            (r'db\.insert\(', 'insert'),
            (r'db\.update\(', 'update'),
            (r'db\.delete\(', 'delete'),
            (r'db\.select\(', 'select'),
            (r'\.findMany\(', 'findMany'),
            (r'\.findFirst\(', 'findFirst'),
        ]
        
        for i, line in enumerate(self.lines, 1):
            for pattern, operation in db_patterns:
                if re.search(pattern, line):
                    # 前後数行に logger.debug があるか確認
                    context = '\n'.join(self.lines[max(0, i-3):min(len(self.lines), i+3)])
                    
                    if 'logger.debug' not in context and 'logger.info' not in context:
                        suggestions.append({
                            'line': i,
                            'type': 'db_operation_log_missing',
                            'severity': 'medium',
                            'message': f'Line {i}: DB操作 ({operation}) の前後にログがありません',
                            'suggestion': f"logger.debug('{operation} 実行', {{ /* params */ }})",
                        })
        
        return suggestions
    
    def find_async_functions(self) -> List[Dict]:
        """async 関数を検出"""
        suggestions = []
        
        # export async function を検出（API Route以外）
        pattern = r"export\s+async\s+function\s+(\w+)\s*\("
        
        for i, line in enumerate(self.lines, 1):
            match = re.search(pattern, line)
            if match:
                func_name = match.group(1)
                
                # API Route メソッド名でないか確認
                if func_name not in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']:
                    function_content = self._get_function_body(i - 1)
                    
                    if 'logger' not in function_content:
                        suggestions.append({
                            'line': i,
                            'type': 'async_function_no_log',
                            'severity': 'low',
                            'message': f'Line {i}: async 関数 {func_name} にログがありません',
                            'suggestion': f"logger.info('{func_name} 開始', {{ /* params */ }})",
                        })
        
        return suggestions
    
    def find_useeffect_hooks(self) -> List[Dict]:
        """useEffect フックを検出"""
        suggestions = []
        
        pattern = r"useEffect\s*\("
        
        for i, line in enumerate(self.lines, 1):
            if re.search(pattern, line):
                effect_body = self._get_block_content(i - 1)
                
                # フロントエンドコンポーネントのマウント時ログ
                if 'logger.debug' not in effect_body and 'logger.info' not in effect_body:
                    suggestions.append({
                        'line': i,
                        'type': 'useeffect_no_log',
                        'severity': 'low',
                        'message': f'Line {i}: useEffect にログがありません',
                        'suggestion': "logger.debug('コンポーネントマウント', { /* context */ })",
                    })
        
        return suggestions
    
    def _get_function_body(self, start_line: int) -> str:
        """関数本体を取得（簡易実装）"""
        # 開始位置から関数の終わりまでを取得
        body_lines = []
        brace_count = 0
        started = False
        
        for i in range(start_line, min(start_line + 200, len(self.lines))):
            line = self.lines[i]
            
            if '{' in line:
                brace_count += line.count('{')
                started = True
            
            if '}' in line:
                brace_count -= line.count('}')
            
            if started:
                body_lines.append(line)
            
            if started and brace_count == 0:
                break
        
        return '\n'.join(body_lines)
    
    def _get_block_content(self, start_line: int) -> str:
        """ブロック内容を取得"""
        return self._get_function_body(start_line)
    
    def analyze(self) -> List[Dict]:
        """すべての分析を実行"""
        self.load_file()
        
        self.suggestions.extend(self.find_api_routes())
        self.suggestions.extend(self.find_try_catch_blocks())
        self.suggestions.extend(self.find_db_operations())
        self.suggestions.extend(self.find_async_functions())
        self.suggestions.extend(self.find_useeffect_hooks())
        
        # 重要度順にソート
        severity_order = {'high': 0, 'medium': 1, 'low': 2}
        self.suggestions.sort(key=lambda x: (severity_order[x['severity']], x['line']))
        
        return self.suggestions
    
    def print_report(self) -> None:
        """分析結果をレポート出力"""
        print(f"\n📊 ログ分析レポート: {self.file_path}\n")
        print("=" * 80)
        
        if not self.has_logger_import():
            print("\n⚠️  logger のインポートが見つかりません")
            print("    import { logger } from '@/app/(core)/logger'")
            print()
        
        if not self.suggestions:
            print("\n✅ 特に改善が必要な箇所は見つかりませんでした")
            return
        
        # 重要度別に集計
        high = [s for s in self.suggestions if s['severity'] == 'high']
        medium = [s for s in self.suggestions if s['severity'] == 'medium']
        low = [s for s in self.suggestions if s['severity'] == 'low']
        
        print(f"\n🔴 重要度 HIGH: {len(high)} 件")
        print(f"🟡 重要度 MEDIUM: {len(medium)} 件")
        print(f"🔵 重要度 LOW: {len(low)} 件")
        print(f"\n合計: {len(self.suggestions)} 件の提案\n")
        print("=" * 80)
        
        # 詳細表示
        for suggestion in self.suggestions:
            severity_icon = {
                'high': '🔴',
                'medium': '🟡',
                'low': '🔵',
            }[suggestion['severity']]
            
            print(f"\n{severity_icon} {suggestion['severity'].upper()}")
            print(f"   {suggestion['message']}")
            print(f"   💡 提案: {suggestion['suggestion']}")
        
        print("\n" + "=" * 80)
        print(f"\n📝 次のステップ:")
        print(f"   1. 重要度HIGHの項目から対応してください")
        print(f"   2. references/log_placement_guide.md を参照")
        print(f"   3. logger をインポート: import {{ logger }} from '@/app/(core)/logger'")


def main():
    """メイン実行"""
    import sys
    
    if len(sys.argv) < 2:
        print("使用方法: python3 analyze_logs.py <ファイルパス>")
        print()
        print("例:")
        print("  python3 analyze_logs.py packages/web/app/api/quests/route.ts")
        print("  python3 analyze_logs.py packages/web/app/(app)/quests/family/[id]/view/FamilyQuestViewScreen.tsx")
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    if not os.path.exists(file_path):
        print(f"❌ ファイルが見つかりません: {file_path}")
        sys.exit(1)
    
    analyzer = LogAnalyzer(file_path)
    analyzer.analyze()
    analyzer.print_report()


if __name__ == "__main__":
    main()
