---
name: guide
description: 'Quest Pay開発ガイドウィザード。実装・改修・バグ修正・E2Eテスト・仕様確認を対話形式でサポートする。「/guide」「実装したい」「バグ修正したい」という依頼で起動。機能選択→要件確認→フェーズ別実装の流れで進める。'
---

# Quest Pay 開発ガイド

Quest Payプロジェクトの開発をサポートするウィザードスキル。
実装内容を伝えると、関連リファレンスを読み込み、フェーズ別に実装を進める。

## このスキルの特徴

- **リファレンス駆動**: 機能ごとのリファレンスファイルを読み込んで実装
- **フェーズ分割**: DB → API → Mock → 画面 の順で実装
- **自動メンテナンス**: コード修正時にリファレンスをサブエージェントで更新
- **履歴保存**: 要件質問の内容をskill-memoryに保存

## リファレンス構造

```
references/
├── _phases/          ← 各フローの詳細ワークフロー
├── features/         ← 機能系リファレンス（家族クエスト・通知など）
├── core/             ← 共通技術リファレンス（DB・UI・ツールなど）
└── e2e/              ← E2Eテスト一覧・概要
```

---

## メインメニュー

起動時に以下を表示する:

```
Quest Pay 開発ガイド

1. 実装・改修   — 新機能追加・既存画面変更・API追加など
2. バグ修正     — 不具合の調査〜修正
3. E2Eテスト    — Playwrightテストの追加・変更・実行
4. 確認         — 仕様・構造の確認・質問
```

選択後、対応するフェーズファイルを読み込む:
- 1 → `references/_phases/01_impl.md`
- 2 → `references/_phases/02_bug.md`
- 3 → `references/_phases/03_e2e.md`
- 4 → `references/_phases/04_confirm.md`

---

## 共通ルール

### リファレンス読み込み
- 機能選択時: `references/features/{機能名}.md` を読み込む
- DB/API/共通技術が関わる場合: `references/core/` の該当ファイルを読み込む
- 複数機能にまたがり複雑と判断した場合: **サブエージェントで並列読み込み**し、結果のみメインに返す
  → ただし必ずユーザーに確認してから実行する

### スキル自動メンテナンス
コードを修正した際、関連するリファレンスファイルに変更が必要な場合は**サブエージェントで裏で実行**する（メインコンテキストを汚染しない）

### 要件質問の履歴保存
質問ループの内容は `~/.claude/skill-memory/guide/sessions/{YYYYMMDDHHMMSS}_{機能名}.md` に保存する

---

## フロー A: 実装・改修

詳細: `references/_phases/01_impl.md`

### 概要フロー

```
[A-1] 機能選択
  references/features/ と references/core/ の一覧をカテゴリー別に表示

[A-2] 実装内容の入力（自由記述）

[A-3] 作業種別を推定（サブエージェントで実行）
  リファレンスを読み込み、関連する種別を推定してメインに返す
  → 確認: 「DB変更 + API追加 + 画面新規 + E2E が関わりそうです。OK?」
  → 複数フェーズ & 複雑と判断した場合:
    「サブエージェントで並列処理しますか?」を確認してから実行

[A-4] 要件質問シート（無制限ループ、履歴保存）
  不明点をまとめて質問 → 回答 → まだあれば再質問
  最後の選択肢:
    ✅ この要件でOK → 実装フェーズへ
    🖼️ まずMockページを作る → Phase Mock へ
    📝 要件を修正する → 再質問

━━ 実装フェーズ（該当する種別のみ実行）━━

[Phase DB] DBスキーマ変更
  リファレンス: core/database.md, core/schema.md
  [DB-1] 現在のschema.tsを確認
  [DB-2] 変更設計を提示 → 承認
  [DB-3] schema.ts修正
  [DB-4] マイグレーションファイル作成
  [DB-5] 完了 → 次フェーズへ

[Phase API] API追加/変更/削除
  リファレンス: core/endpoints.md, features/{機能名}.md
  [API-1] エンドポイント設計（endpoints.tsへの追加）→ 確認
  [API-2] 5層実装方針を提示（route/service/query/db/client）→ 承認
  [API-3] 実装
  [API-4] 完了 → 次フェーズへ

[Phase Mock] Mockページ作成（画面新規実装時）
  リファレンス: core/mock.md
  [Mock-1] Mockページ作成
  [Mock-2] 確認 → 本実装フェーズへ

[Phase 画面] 画面実装
  リファレンス: features/{機能名}.md, core/common-components.md
  [Scr-1] ui-ux-pro-maxでUIイメージ提示（UI関連の場合）→ 確認
  [Scr-2] 3層実装方針を提示（page → Screen → Layout）→ 承認
  [Scr-3] 実装
  [Scr-4] 完了

[Phase E2E後処理]
  「E2Eテストを実行しますか?」→ 実行 or スキップ

━━ スキル自動メンテナンス（サブエージェントで裏で実行）━━
修正したファイルに関連するreferences/を更新
```

---

## フロー B: バグ修正

詳細: `references/_phases/02_bug.md`

```
[B-1] バグ内容の入力

[B-2] 関連リファレンス読み込み
  サブエージェントで推定・読み込み、結果のみメインに返す

[B-3] 原因調査（コード読み込み・分析）

[B-4] 原因候補を提示 → 質問シート（ループ、履歴保存）
  「以下が原因候補です。確認してください」
  → 回答 → 絞り込み → まだ不明なら再質問
  → 「この原因で確定しますか?」

[B-5] 修正方針を提示 → 承認

[B-6] 実装

[B-7] 「E2Eテストを実行しますか?」確認

━━ スキル自動メンテナンス（サブエージェントで裏で実行）━━
```

---

## フロー D: E2Eテスト

詳細: `references/_phases/03_e2e.md`

```
メニュー:
  1. 追加
  2. 変更
  3. 実行

[Phase 追加]
  [D-Add-1] 対象機能の入力
  [D-Add-2] references/e2e/index.md を読み込み
    → 現在のコードと差異があればユーザーに確認・修正提案
  [D-Add-3] テストシナリオ案を提示 → 確認
  [D-Add-4] 実装（packages/web/e2e/）
  [D-Add-5] 「実行しますか?」→ 実行 or スキップ
  ＋ references/e2e/index.md を自動更新（サブエージェント）

[Phase 変更]
  [D-Mod-1] 変更対象を選択（references/e2e/index.md の一覧から）
  [D-Mod-2] 対象ファイルを読み込み
    → references/e2e/index.md と差異があればユーザーに確認
  [D-Mod-3] 変更内容の入力 → 修正方針提示 → 確認
  [D-Mod-4] 実装
  [D-Mod-5] 「実行しますか?」→ 実行 or スキップ
  ＋ references/e2e/index.md を自動更新（サブエージェント）

[Phase 実行]
  [D-Run-1] references/e2e/index.md のテスト一覧を表示 → 選択
  [D-Run-2] Playwright 実行（packages/web/e2e/）
  [D-Run-3] 結果を表示
```

---

## フロー E: 確認

詳細: `references/_phases/04_confirm.md`

```
[E-1] 機能選択
  カテゴリー別に表示:
    ▶ 機能系: home / login / family / family-quest / ...
    ▶ コア: database / schema / common-components / app-shell / ...

[E-2] 何を確認しますか?（直接入力）
  → 選択した機能のリファレンスを読み込み → 回答
```
