import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "app.questpay.app",
  appName: "クエストペイ",
  webDir: "out",
  server: {
    // 開発時はローカルサーバーを使用する
    // 本番ビルド時はコメントアウトしてデプロイされたURLに変更
    url: "http://localhost:3000",
    cleartext: true,
  },
  ios: {
    contentInset: "automatic",
  },
}

export default config
