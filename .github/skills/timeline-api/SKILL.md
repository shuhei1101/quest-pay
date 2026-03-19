---
name: timeline-api
description: タイムラインAPI操作の知識を提供するスキル。エンドポイント、リクエスト/レスポンス、DB操作を含む。 Trigger Keywords: タイムラインAPI、タイムライン操作、アクティビティタイムライン、タイムラインデータ
---

# タイムラインAPI スキル

## 概要

このスキルは、家族タイムラインと公開タイムラインのアクティビティフィード管理API群の知識を提供します。クエスト完了、報酬獲得、マイルストーン達成などのアクティビティを自動的に記録し、家族内および公開コミュニティで共有します。

## メインソースファイル

### API Routes
- `packages/web/app/api/timeline/family/route.ts`: 家族タイムライン一覧取得
- `packages/web/app/api/timeline/family/[id]/route.ts`: 家族タイムライン詳細取得
- `packages/web/app/api/timeline/public/route.ts`: 公開タイムライン一覧取得

### クライアント側
- `packages/web/app/api/timeline/family/client.ts`: 家族タイムラインAPIクライアント
- `packages/web/app/api/timeline/family/[id]/client.ts`: 家族タイムライン詳細APIクライアント
- `packages/web/app/api/timeline/public/client.ts`: 公開タイムラインAPIクライアント
- `packages/web/app/api/timeline/family/query.ts`: 家族タイムライン React Queryフック
- `packages/web/app/api/timeline/public/query.ts`: 公開タイムライン React Queryフック

### データベース
- `packages/web/app/api/timeline/db.ts`: DB操作関数
- `drizzle/schema.ts`: familyTimelines, publicTimelines, families, profiles

## 主要機能グループ

### 1. 家族タイムライン
- 家族内アクティビティの取得
- クエスト完了、報酬獲得、マイルストーン達成などの表示
- 家族メンバーのアクション追跡

### 2. 公開タイムライン
- 公開コミュニティアクティビティの取得
- クエスト公開、いいね・コメントマイルストーン達成の表示
- 複数家族の活動集約

### 3. タイムライン投稿作成
- insertFamilyTimeline: 家族タイムラインへの投稿
- insertPublicTimeline: 公開タイムラインへの投稿
- アクションタイプ別メッセージ自動生成

### 4. アクティビティ種別
- 即時投稿型: クエスト完了、報酬受け取り、メンバー参加
- 条件付き投稿型: マイルストーン達成（貯金額、クエスト回数、いいね数など）

## Reference Files Usage

### データベース構造を把握する場合
タイムライン関連テーブルのER図と主要リレーションを確認：
```
references/er_diagram.md
```

### タイムライン生成フローを理解する場合
クエスト完了から投稿作成、マイルストーン判定までのフローを確認：
```
references/flow_diagram.md
```

### API呼び出しフローを把握する場合
各エンドポイントの処理シーケンス、認証フローを確認：
```
references/sequence_diagram.md
```

### API仕様を詳細に確認する場合
リクエスト/レスポンス形式、アクションタイプ一覧、DB操作関数を確認：
```
references/api_endpoints.md
```

## クイックスタート

1. **全体像の把握**: `references/flow_diagram.md`でタイムライン生成フロー確認
2. **データ構造の理解**: `references/er_diagram.md`でテーブル関係確認
3. **実装時**: `references/api_endpoints.md`で詳細仕様確認
4. **デバッグ時**: `references/sequence_diagram.md`で処理フロー確認

## 実装上の注意点

### 必須パターン

#### 1. タイムライン投稿作成
```typescript
import { insertFamilyTimeline } from "@/app/api/timeline/db"

// クエスト完了時にタイムライン投稿
await insertFamilyTimeline({
  db,
  record: {
    familyId,
    type: "quest_completed",
    profileId: childProfileId,
    message: `${childName}がクエスト「${questName}」を完了しました`,
    url: `/quests/family/${questId}`
  }
})
```

#### 2. マイルストーン判定
```typescript
// 貯金額マイルストーン達成時
const milestones = [100, 500, 1000, 5000, 10000]
if (milestones.includes(newSavings)) {
  await insertFamilyTimeline({
    db,
    record: {
      familyId,
      type: "savings_milestone_reached",
      profileId: childProfileId,
      message: `${childName}の貯金額が${newSavings}円を突破しました！🎉`,
      url: `/children/${childId}`
    }
  })
}
```

#### 3. React Query フック使用
```typescript
import { useFamilyTimelines } from "@/app/api/timeline/family/query"

const MyComponent = () => {
  const { data, isLoading, error } = useFamilyTimelines()
  
  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラー: {error.message}</div>
  
  return (
    <div>
      {data.timelines.map(timeline => (
        <TimelineItem key={timeline.id} timeline={timeline} />
      ))}
    </div>
  )
}
```

### 禁止パターン

1. **タイムライン投稿の手動作成禁止**
   - ❌ 直接SQLでfamily_timelineテーブルに挿入
   - ✅ insertFamilyTimeline関数を使用

2. **アクションタイプの誤使用禁止**
   - ❌ 家族タイムラインに公開アクションタイプを使用
   - ✅ family_timeline_action_type と public_timeline_action_type を正しく区別

3. **認証なしアクセス禁止**
   - ❌ 認証コンテキストなしでタイムライン取得
   - ✅ getAuthContextで認証確認後にアクセス

### referenceメンテナンス
**機能修正・改善時は必ず対応するreferenceファイルを更新してください:**
- コード構造変更時: `references/component_structure.md`, `references/flow_diagram.md` を更新
- API仕様変更時: `references/api_endpoints.md`, `references/sequence_diagram.md` を更新
- DB修正時: `references/er_diagram.md`, `references/table_details.md` を更新
- 記載年月日時を必ず更新: `(○○年○○月○○日 ○○:○○記載)` 形式で最新化


## データベース操作原則

### 読み取り専用API
- 家族タイムライン・公開タイムライン取得はすべて読み取り専用
- JOIN操作でprofiles, familiesと結合して詳細情報を取得

### 書き込み操作
- insertFamilyTimeline / insertPublicTimeline を使用
- 他のAPI（クエスト承認、報酬付与など）から呼び出される
- トランザクション内で実行推奨

### クエリ最適化
- created_at DESC で時系列順に取得
- 必要に応じてカーソルベースページネーション実装可能

## アクションタイプ一覧

### 家族タイムライン (family_timeline_action_type)

- `quest_created`: クエスト作成
- `quest_completed`: クエスト完了
- `quest_cleared`: クエストクリア
- `quest_level_up`: クエストレベルアップ
- `child_joined`: 子供が参加
- `parent_joined`: 親が参加
- `reward_received`: 報酬受け取り
- `savings_updated`: 貯金額更新
- `savings_milestone_reached`: 貯金額マイルストーン達成
- `quest_milestone_reached`: クエスト達成マイルストーン
- `comment_posted`: コメント投稿
- `other`: その他

### 公開タイムライン (public_timeline_action_type)

- `quest_published`: クエスト公開
- `likes_milestone_reached`: いいね数マイルストーン達成
- `posts_milestone_reached`: 投稿数マイルストーン達成
- `comments_milestone_reached`: コメント数マイルストーン達成
- `comment_posted`: コメント投稿
- `like_received`: いいね受け取り
- `other`: その他

## 他機能との連携

### クエスト承認時
クエスト承認APIが完了後、insertFamilyTimelineで投稿作成

### 報酬付与時
報酬履歴作成後、insertFamilyTimelineで報酬受け取りアクティビティ作成

### クエスト公開時
public_quests作成後、insertPublicTimelineで公開アクティビティ作成

## エラーハンドリング

### サーバー側
- withRouteErrorHandlingで自動エラー処理
- DatabaseErrorで適切なエラーメッセージ返却

### クライアント側
- AppError.fromResponseで構造化されたエラー処理
- React Queryのerrorオブジェクトでエラー状態管理

**Examples from other skills:**
- Brand styling: PowerPoint template files (.pptx), logo files
- Frontend builder: HTML/React boilerplate project directories
- Typography: Font files (.ttf, .woff2)

**Appropriate for:** Templates, boilerplate code, document templates, images, icons, fonts, or any files meant to be copied or used in the final output.

---

**Any unneeded directories can be deleted.** Not every skill requires all three types of resources.
