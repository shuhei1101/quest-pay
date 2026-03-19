#!/usr/bin/env python3
"""
すべてのスキルにトリガーキーワードを追加するスクリプト
"""
import os
import re
from pathlib import Path
from typing import Dict

# 各スキルのトリガーキーワードマッピング
TRIGGER_KEYWORDS: Dict[str, str] = {
    "app-shell-components": "AppShell, side menu, footer, app shell components, layout components",
    "app-shell-structure": "AppShell structure, app layout, shell content, application structure",
    "architecture-guide": "architecture, project structure, codebase navigation, module organization, design patterns",
    "child-management-api": "child API, child management, child CRUD, children endpoint",
    "child-management-edit": "child edit, edit child, child form, update child",
    "child-management-list": "child list, children list, child management screen",
    "child-quest-api": "child quest API, child quest operations, child quest CRUD",
    "child-quest-list": "child quest list, my quests, child quest screen",
    "child-quest-view": "child quest view, view child quest, quest details child, complete quest",
    "child-reward-api": "child reward API, individual reward, child allowance, reward settings child",
    "child-reward-structure": "child reward screen, reward settings screen, individual reward UI",
    "coding-standards": "coding style, TypeScript conventions, React style guide, code review standards, naming conventions",
    "comment-api": "comment API, comment CRUD, comment operations, post comment",
    "comment-list": "comment list, comment section, display comments, comment thread",
    "comment-post": "post comment, comment form, submit comment, write comment",
    "commit-auto": "git commit, commit message, auto commit, commit format, security check",
    "common-components-catalog": "common components, component catalog, reusable components, UI components list",
    "common-components-usage": "component usage, how to use components, component props, component examples",
    "common-structure": "screen structure, generate structure, analyze structure, structure script",
    "database-operations": "database, Drizzle ORM, Supabase, query, transaction, DB operations",
    "endpoints-definition": "endpoints, API routes, URL definition, endpoints.ts, route paths",
    "environment-variables": "environment variables, env vars, .env, configuration, Supabase config, Stripe config",
    "error-handling": "error handling, error classes, exception handling, error handler, error boundaries",
    "error-structure": "error screen, error page, global error, auth error, error UI",
    "family-api": "family API, family CRUD, family operations, family endpoint",
    "family-edit": "family edit, edit family, family form, update family",
    "family-list": "family list, families list, family management screen",
    "family-member-child-edit": "family member edit, edit member, member form, child member",
    "family-member-child-view": "family member view, view member, member details, invitation code",
    "family-member-list": "family member list, members list, two-pane layout, member management",
    "family-profile-view": "family profile, view family, family details, family information",
    "family-quest-api": "family quest API, family quest CRUD, family quest operations",
    "family-quest-edit": "family quest edit, edit quest, quest form, create quest, update quest",
    "family-quest-list": "family quest list, quest list, quest management screen",
    "family-quest-view": "family quest view, view quest, quest details, quest information",
    "family-view": "family view, view family, family profile screen",
    "home-api": "home API, home screen API, dashboard API, home data",
    "home-structure": "home screen, home page, dashboard, home UI",
    "logger-management": "logger, loglevel, logging, debug log, log management, log configuration",
    "login-api": "login API, authentication API, auth endpoint, login operations",
    "login-structure": "login screen, login page, login form, authentication UI, login type",
    "mock-creator": "mock screen, test screen, prototype, mock UI, test page, UI verification",
    "mock-list": "mock list, test list, test screen list, mock index",
    "notification-api": "notification API, notification CRUD, notification operations",
    "notification-list": "notification list, notifications screen, notification UI",
    "public-quest-api": "public quest API, public quest operations, community quest API",
    "public-quest-list": "public quest list, community quests, public quest screen",
    "public-quest-view": "public quest view, view public quest, quest details public, like comment",
    "quest-edit-layout-structure": "quest edit layout, edit layout structure, quest form layout",
    "quest-edit-layout-usage": "quest edit layout usage, how to use edit layout, layout props",
    "quest-list-layout-structure": "quest list layout, list layout structure, quest list UI",
    "quest-list-layout-usage": "quest list layout usage, how to use list layout, list layout props",
    "quest-view-api": "quest view API, quest details API, quest data fetch",
    "quest-view-structure": "quest view screen, quest details screen, view quest UI, quest display",
    "reward-api": "reward API, reward settings API, allowance API, reward CRUD",
    "reward-structure": "reward screen, reward settings screen, allowance settings UI",
    "schema-relations": "database schema, table relations, foreign keys, ER diagram, database relationships",
    "schema-structure": "database schema, table structure, column definitions, schema.ts, database design",
    "screen-agent-builder": "screen agent, custom agent, agent builder, skill builder, agent creation",
    "skill-creator": "create skill, skill creation, skill workflow, skill development, skill package",
    "template-quest-api": "template quest API, quest template API, template operations",
    "template-quest-list": "template quest list, quest templates, template screen",
    "template-quest-view": "template quest view, view template, template details, adopt template",
    "test-data-generator": "test data, generate data, Supabase data, test database, data generation",
    "timeline-api": "timeline API, timeline operations, activity timeline, timeline data",
    "timeline-structure": "timeline screen, timeline UI, activity feed, timeline display",
}

def update_skill_description(skill_path: Path, trigger_keywords: str) -> bool:
    """
    スキルのdescriptionフィールドにトリガーキーワードを追加
    
    Args:
        skill_path: SKILL.mdファイルのパス
        trigger_keywords: 追加するトリガーキーワード
    
    Returns:
        bool: 更新が成功したかどうか
    """
    try:
        with open(skill_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # descriptionフィールドを見つける
        pattern = r"(description:\s*['\"]?)([^'\"]+?)(['\"]?\s*\n---)"
        
        def replace_description(match):
            prefix = match.group(1)
            description = match.group(2)
            suffix = match.group(3)
            
            # すでにTrigger Keywordsが含まれているかチェック
            if "Trigger Keywords:" in description or "trigger keywords:" in description.lower():
                print(f"  ⏭️  Already has trigger keywords, skipping")
                return match.group(0)
            
            # トリガーキーワードを追加
            new_description = f"{description.strip()} Trigger Keywords: {trigger_keywords}"
            return f"{prefix}{new_description}{suffix}"
        
        new_content = re.sub(pattern, replace_description, content, flags=re.DOTALL)
        
        # 変更があった場合のみ書き込む
        if new_content != content:
            with open(skill_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        
        return False
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    """メイン処理"""
    skills_dir = Path("/home/shuhei2441/repo/quest-pay/.github/skills")
    
    if not skills_dir.exists():
        print(f"❌ Skills directory not found: {skills_dir}")
        return
    
    print("🔍 Updating skill descriptions with trigger keywords...\n")
    
    updated_count = 0
    skipped_count = 0
    error_count = 0
    
    for skill_name, keywords in TRIGGER_KEYWORDS.items():
        skill_md = skills_dir / skill_name / "SKILL.md"
        
        if not skill_md.exists():
            print(f"⚠️  {skill_name}: SKILL.md not found")
            error_count += 1
            continue
        
        print(f"📝 {skill_name}")
        print(f"   Keywords: {keywords}")
        
        if update_skill_description(skill_md, keywords):
            print(f"   ✅ Updated\n")
            updated_count += 1
        else:
            print(f"   ⏭️  Skipped (already has trigger keywords)\n")
            skipped_count += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Updated: {updated_count}")
    print(f"⏭️  Skipped: {skipped_count}")
    print(f"❌ Errors: {error_count}")
    print(f"Total: {updated_count + skipped_count + error_count}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
