"use client"

import { Button, Card, Text, Title, Stack, Group, Badge } from "@mantine/core"
import { useState } from "react"

type Plan = {
  code: "free" | "lite"
  name: string
  priceMonthly: number
  priceYearly: number
  stripePriceIdMonthly?: string
  stripePriceIdYearly?: string
  features: string[]
}

const plans: Plan[] = [
  {
    code: "free",
    name: "無料プラン",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "家族クエスト: 10個まで",
      "公開クエスト: 3個まで",
      "テンプレート: 5個まで",
      "子供: 3人まで"
    ]
  },
  {
    code: "lite",
    name: "ライトプラン",
    priceMonthly: 500,
    priceYearly: 5000,
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_MONTHLY,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_LITE_YEARLY,
    features: [
      "家族クエスト: 50個まで",
      "公開クエスト: 10個まで",
      "テンプレート: 20個まで",
      "子供: 5人まで"
    ]
  }
]

export default function StripeTestPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (priceId: string, billingCycle: "monthly" | "yearly") => {
    setLoading(`${priceId}-${billingCycle}`)
    
    try {
      const response = await fetch("/api/test/stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, billingCycle })
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("エラーが発生しました")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("エラーが発生しました")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Title order={1} className="mb-2">Stripe テスト画面</Title>
      <Text c="dimmed" className="mb-8">
        サブスクリプション機能のテスト画面です
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card key={plan.code} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <div>
                <Group justify="space-between" align="center">
                  <Title order={3}>{plan.name}</Title>
                  {plan.code === "free" && <Badge color="gray">無料</Badge>}
                </Group>
              </div>

              <div>
                <Text size="xl" fw={700}>
                  {plan.priceMonthly === 0 ? "¥0" : `¥${plan.priceMonthly.toLocaleString()}`}
                  <Text size="sm" c="dimmed" span> / 月</Text>
                </Text>
                {plan.priceYearly > 0 && (
                  <Text size="sm" c="dimmed">
                    年額: ¥{plan.priceYearly.toLocaleString()} 
                    <Text span c="green"> (2ヶ月分お得)</Text>
                  </Text>
                )}
              </div>

              <Stack gap="xs">
                {plan.features.map((feature, index) => (
                  <Text key={index} size="sm">• {feature}</Text>
                ))}
              </Stack>

              {plan.code !== "free" && (
                <Stack gap="xs">
                  <Button
                    fullWidth
                    variant="filled"
                    loading={loading === `${plan.stripePriceIdMonthly}-monthly`}
                    disabled={loading !== null}
                    onClick={() => handleCheckout(plan.stripePriceIdMonthly!, "monthly")}
                  >
                    月額プランを購入
                  </Button>
                  <Button
                    fullWidth
                    variant="light"
                    loading={loading === `${plan.stripePriceIdYearly}-yearly`}
                    disabled={loading !== null}
                    onClick={() => handleCheckout(plan.stripePriceIdYearly!, "yearly")}
                  >
                    年額プランを購入
                  </Button>
                </Stack>
              )}

              {plan.code === "free" && (
                <Button fullWidth variant="default" disabled>
                  現在のプラン
                </Button>
              )}
            </Stack>
          </Card>
        ))}
      </div>

      <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-8">
        <Title order={4} className="mb-2">テスト情報</Title>
        <Stack gap="xs">
          <Text size="sm">• Stripeのテストモードで動作します</Text>
          <Text size="sm">• テストカード番号: 4242 4242 4242 4242</Text>
          <Text size="sm">• 有効期限: 任意の未来の日付</Text>
          <Text size="sm">• CVC: 任意の3桁</Text>
          <Text size="sm">• 郵便番号: 任意の数字</Text>
        </Stack>
      </Card>
    </div>
  )
}
