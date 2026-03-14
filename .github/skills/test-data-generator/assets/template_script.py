#!/usr/bin/env python3
"""
テストデータ生成スクリプトテンプレート

このスクリプトは、Supabaseデータベースにテストデータを投入する。
要件に応じてこのテンプレートをカスタマイズして使用すること。

使用方法:
    1. .envファイルからDATABASE_URLを取得
    2. 既存データをSELECT文で取得
    3. テストデータを生成
    4. INSERT文でデータを投入

依存関係:
    pip install psycopg2-binary faker python-dotenv
"""

import os
import uuid
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
import psycopg2
from psycopg2.extras import execute_batch
from faker import Faker
from dotenv import load_dotenv

# .envファイルを読み込み
# プロジェクトルートから.envファイルを探す
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..'))
env_local = os.path.join(project_root, 'packages/web/.env.local')
env_file = os.path.join(project_root, 'packages/web/.env')

if os.path.exists(env_local):
    load_dotenv(env_local)
    print(f"✅ .env.local を読み込みました: {env_local}")
elif os.path.exists(env_file):
    load_dotenv(env_file)
    print(f"✅ .env を読み込みました: {env_file}")
else:
    print(f"⚠️ .envファイルが見つかりません。環境変数DATABASE_URLを設定してください。")

# Faker初期化（日本語ロケール）
fake = Faker('ja_JP')

# Enum型の定義（packages/web/drizzle/schema.tsに定義されている）
# 必要に応じて最新のschema.tsを確認して追加・修正すること
USER_TYPES = ["parent", "child"]
QUEST_TYPES = ["template", "public", "family"]
CHILD_QUEST_STATUS = ["not_started", "in_progress", "pending_review", "completed"]
NOTIFICATION_TYPES = [
    "family_quest_review",
    "quest_report_rejected",
    "quest_report_approved",
    "quest_cleared",
    "quest_level_up",
    "quest_completed",
    "other"
]
REWARD_TYPES = ["quest", "age_monthly", "level_monthly", "other"]
FAMILY_TIMELINE_ACTION_TYPES = [
    "quest_created",
    "quest_completed",
    "quest_cleared",
    "quest_level_up",
    "child_joined",
    "parent_joined",
    "reward_received",
    "savings_updated",
    "savings_milestone_reached",
    "quest_milestone_reached",
    "comment_posted",
    "other"
]

# データベース接続
def get_db_connection():
    """データベース接続を取得"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URLが設定されていません")
    
    return psycopg2.connect(database_url)

# ユーティリティ関数
def generate_uuid() -> str:
    """UUIDを生成"""
    return str(uuid.uuid4())

def random_past_datetime(days_range: int = 365) -> datetime:
    """過去のランダムな日時を生成"""
    days_ago = random.randint(0, days_range)
    return datetime.now() - timedelta(days=days_ago)

def random_color() -> str:
    """ランダムな色コードを生成"""
    colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", 
              "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788"]
    return random.choice(colors)

# 既存データ取得
def fetch_existing_families(conn) -> List[Dict[str, Any]]:
    """既存の家族データを取得"""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT id, display_id, local_name, icon_id, icon_color
            FROM families
            ORDER BY created_at DESC
            LIMIT 10
        """)
        columns = [desc[0] for desc in cur.description]
        return [dict(zip(columns, row)) for row in cur.fetchall()]

def fetch_existing_icons(conn) -> List[Dict[str, Any]]:
    """既存のアイコンデータを取得"""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT id, name, category_id, size
            FROM icons
            WHERE id IN (SELECT DISTINCT icon_id FROM profiles)
            ORDER BY id
        """)
        columns = [desc[0] for desc in cur.description]
        return [dict(zip(columns, row)) for row in cur.fetchall()]

def fetch_existing_quest_categories(conn) -> List[Dict[str, Any]]:
    """既存のクエストカテゴリデータを取得"""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT id, name, icon_name, icon_color
            FROM quest_categories
            ORDER BY sort_order
        """)
        columns = [desc[0] for desc in cur.description]
        return [dict(zip(columns, row)) for row in cur.fetchall()]

# テストデータ生成
def generate_family_quests(
    conn,
    family_id: str,
    icon_id: int,
    category_id: int,
    count: int = 10
) -> List[Dict[str, Any]]:
    """
    家族クエストのテストデータを生成
    
    Args:
        conn: データベース接続
        family_id: 家族ID
        icon_id: アイコンID
        category_id: カテゴリID
        count: 生成する件数
    
    Returns:
        生成したクエストデータのリスト
    """
    quests = []
    
    for i in range(count):
        quest_id = generate_uuid()
        quest_name = fake.catch_phrase()
        
        # questsテーブルへのINSERT
        quest_data = {
            'id': quest_id,
            'name': quest_name,
            'type': 'family',
            'category_id': category_id,
            'icon_id': icon_id,
            'icon_color': random_color(),
            'client': fake.name(),
            'request_detail': fake.text(max_nb_chars=100),
            'created_at': random_past_datetime(),
            'updated_at': random_past_datetime()
        }
        
        # family_questsテーブルへのINSERT
        family_quest_data = {
            'id': generate_uuid(),
            'quest_id': quest_id,
            'family_id': family_id,
            'created_at': quest_data['created_at'],
            'updated_at': quest_data['updated_at']
        }
        
        # quest_detailsテーブルへのINSERT（レベル1-3）
        quest_details = []
        for level in range(1, 4):
            quest_details.append({
                'id': generate_uuid(),
                'quest_id': quest_id,
                'level': level,
                'success_condition': f"レベル{level}の成功条件",
                'required_completion_count': level * 5,
                'reward': level * 100,
                'child_exp': level * 50,
                'required_clear_count': level * 10,
                'created_at': quest_data['created_at'],
                'updated_at': quest_data['updated_at']
            })
        
        quests.append({
            'quest': quest_data,
            'family_quest': family_quest_data,
            'quest_details': quest_details
        })
    
    return quests

def insert_family_quests(conn, quests_data: List[Dict[str, Any]]):
    """
    家族クエストデータをINSERT
    
    Args:
        conn: データベース接続
        quests_data: 生成したクエストデータ
    """
    with conn.cursor() as cur:
        # questsテーブルへINSERT
        quest_insert = """
            INSERT INTO quests (
                id, name, type, category_id, icon_id, icon_color,
                client, request_detail, created_at, updated_at
            ) VALUES (
                %(id)s, %(name)s, %(type)s, %(category_id)s, %(icon_id)s, %(icon_color)s,
                %(client)s, %(request_detail)s, %(created_at)s, %(updated_at)s
            )
        """
        
        quest_values = [q['quest'] for q in quests_data]
        execute_batch(cur, quest_insert, quest_values)
        
        # family_questsテーブルへINSERT
        family_quest_insert = """
            INSERT INTO family_quests (
                id, quest_id, family_id, created_at, updated_at
            ) VALUES (
                %(id)s, %(quest_id)s, %(family_id)s, %(created_at)s, %(updated_at)s
            )
        """
        
        family_quest_values = [q['family_quest'] for q in quests_data]
        execute_batch(cur, family_quest_insert, family_quest_values)
        
        # quest_detailsテーブルへINSERT
        quest_detail_insert = """
            INSERT INTO quest_details (
                id, quest_id, level, success_condition, required_completion_count,
                reward, child_exp, required_clear_count, created_at, updated_at
            ) VALUES (
                %(id)s, %(quest_id)s, %(level)s, %(success_condition)s, %(required_completion_count)s,
                %(reward)s, %(child_exp)s, %(required_clear_count)s, %(created_at)s, %(updated_at)s
            )
        """
        
        all_details = []
        for q in quests_data:
            all_details.extend(q['quest_details'])
        
        execute_batch(cur, quest_detail_insert, all_details)
        
        conn.commit()
        print(f"✅ {len(quests_data)}件の家族クエストを投入しました")

# メイン処理
def main():
    """メイン処理"""
    print("🚀 テストデータ生成を開始します...")
    
    conn = None
    try:
        # データベース接続
        conn = get_db_connection()
        print("✅ データベースに接続しました")
        
        # 既存データを取得
        families = fetch_existing_families(conn)
        icons = fetch_existing_icons(conn)
        categories = fetch_existing_quest_categories(conn)
        
        if not families:
            print("❌ 家族データが存在しません。先に家族データを作成してください。")
            return
        
        if not icons:
            print("❌ アイコンデータが存在しません。")
            return
        
        if not categories:
            print("❌ カテゴリデータが存在しません。")
            return
        
        print(f"📋 既存データ: 家族={len(families)}件, アイコン={len(icons)}件, カテゴリ={len(categories)}件")
        
        # ランダムに家族を選択
        target_family = random.choice(families)
        target_icon = random.choice(icons)
        target_category = random.choice(categories)
        
        print(f"🎯 対象家族: {target_family['local_name']} (ID: {target_family['id'][:8]}...)")
        
        # テストデータ生成
        # TODO: 要件に応じて生成数を変更
        quest_count = 100
        print(f"📝 {quest_count}件の家族クエストを生成中...")
        
        quests_data = generate_family_quests(
            conn,
            target_family['id'],
            target_icon['id'],
            target_category['id'],
            count=quest_count
        )
        
        # データベースに投入
        insert_family_quests(conn, quests_data)
        
        print("✅ テストデータ生成が完了しました")
        
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        if conn:
            conn.close()
            print("🔒 データベース接続を閉じました")

if __name__ == "__main__":
    main()
