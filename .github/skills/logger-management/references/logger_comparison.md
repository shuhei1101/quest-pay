# TypeScript Logger 比較

## 主要な Logger ライブラリ比較

### 1. loglevel ⭐ 推奨（このプロジェクト採用）

**特徴:**
- シンプルで軽量（約2KB）
- フロントエンド + バックエンド両対応
- ログレベル完全サポート
- 本番環境で不要なログを自動除去

**長所:**
- 学習コストが低い
- TypeScript サポート良好
- Next.js との相性抜群
- パフォーマンスオーバーヘッド最小

**短所:**
- 高度な機能は少ない（トランスポート等）
- ログをファイルに保存する機能なし

**使用例:**
```typescript
import log from 'loglevel'
log.info('メッセージ')
```

**導入:**
```bash
npm install loglevel
```

---

### 2. pino

**特徴:**
- 非常に高速（JSON ログ）
- 構造化ログ
- 豊富なトランスポート
- ブラウザ対応あり（pino-browser）

**長所:**
- 高パフォーマンス
- JSON形式で解析しやすい
- 本番環境に適している
- 子loggerサポート

**短所:**
- 設定がやや複雑
- ブラウザ対応は別パッケージ必要
- バンドルサイズが大きめ

**使用例:**
```typescript
import pino from 'pino'
const logger = pino()
logger.info({ userId: 1 }, 'ユーザーログイン')
```

**導入:**
```bash
npm install pino
npm install pino-pretty  # 開発用の読みやすいフォーマッター
```

---

### 3. winston

**特徴:**
- Node.js で最も人気
- トランスポート豊富（ファイル、DB、クラウド等）
- カスタマイズ性が高い

**長所:**
- 機能が豊富
- 多数のトランスポート対応
- エンタープライズ向け

**短所:**
- **Node.js 専用**（ブラウザ非対応）
- 学習コストが高い
- バンドルサイズが大きい

**使用例:**
```typescript
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})
```

**導入:**
```bash
npm install winston
```

---

### 4. debug

**特徴:**
- デバッグ専用
- 名前空間でフィルタリング
- Node.js + ブラウザ対応

**長所:**
- デバッグに特化
- 環境変数で簡単にON/OFF
- 軽量

**短所:**
- 本番環境向けではない
- ログレベルの概念がない（デバッグ専用）

**使用例:**
```typescript
import debug from 'debug'
const log = debug('app:server')
log('サーバー起動')
```

**導入:**
```bash
npm install debug
```

---

### 5. console（標準）

**特徴:**
- すべてのJavaScript環境に標準搭載
- 追加パッケージ不要

**長所:**
- セットアップゼロ
- すぐに使える
- 学習不要

**短所:**
- ログレベル管理が手動
- 本番環境で無効化が困難
- 構造化ログ非対応

**使用例:**
```typescript
console.log('情報')
console.error('エラー')
console.debug('デバッグ')
```

---

## 選択ガイド

### フロント + バック両対応が必要 → **loglevel** または **pino**

- シンプルさ重視: **loglevel** ✅
- 機能・パフォーマンス重視: **pino**

### Node.js のみ（API/バックエンド専用） → **winston** または **pino**

- 豊富なトランスポート必要: **winston**
- 高速・軽量: **pino**

### デバッグ用途のみ → **debug**

### 何も導入したくない → **console**

---

## このプロジェクトでの選択理由

**loglevel を採用:**

1. ✅ Next.js（フロント + バック両対応）
2. ✅ シンプルで学習コストが低い
3. ✅ debug, info, warn, error のレベル分け
4. ✅ 軽量（バンドルサイズ小）
5. ✅ 環境変数で簡単にレベル変更

高度な機能（ログファイル保存、外部サービス連携）が必要になったら、
将来的に **pino** への移行を検討可能。
