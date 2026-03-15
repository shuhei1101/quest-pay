"use client"

import { useState, useEffect } from "react"
import { Center, Loader, Card, Text, Stack, Badge, Group } from "@mantine/core"
import { useIntersection } from "@mantine/hooks"
import { logger } from "@/app/(core)/logger"

/** 無限スクロール検知テストページ */
export default function InfiniteScrollTestPage() {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const maxPage = 5

  /** 無限スクロール用 Intersection Observer */
  const { ref: sentinelRef, entry } = useIntersection({
    threshold: 0,
    rootMargin: '0px 0px 300px 0px',
  })

  /** 初回データ読み込み */
  useEffect(() => {
    loadData(1)
  }, [])

  /** スクロール検知 */
  useEffect(() => {
    logger.debug("スクロール検知", {
      isIntersecting: entry?.isIntersecting,
      page,
      maxPage,
      isLoading,
      hasNextPage: page < maxPage,
      rect: entry?.boundingClientRect,
      rootBounds: entry?.rootBounds,
      intersectionRatio: entry?.intersectionRatio,
    })

    if (entry?.isIntersecting && page < maxPage && !isLoading) {
      logger.info("次ページ読み込み開始", { page, nextPage: page + 1, maxPage })
      loadData(page + 1)
    }
  }, [entry?.isIntersecting, page, maxPage, isLoading])

  /** データ読み込み */
  const loadData = async (targetPage: number) => {
    setIsLoading(true)
    logger.info("データ読み込み開始", { targetPage })
    
    // 疑似的な非同期処理（500ms）
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newItems = Array.from({ length: 10 }, (_, i) => (targetPage - 1) * 10 + i + 1)
    setItems(prev => [...prev, ...newItems])
    setPage(targetPage)
    setIsLoading(false)
    
    logger.info("データ読み込み完了", { targetPage, itemsCount: newItems.length })
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card shadow="sm" p="lg" mb="lg">
        <Stack gap="md">
          <Text size="xl" fw={700}>🔽 無限スクロール検知テスト</Text>
          <Group>
            <Badge color="blue" size="lg">ページ: {page} / {maxPage}</Badge>
            <Badge color="green" size="lg">表示件数: {items.length}</Badge>
            {isLoading && <Badge color="orange" size="lg">読込中...</Badge>}
          </Group>
          <Text size="sm" c="dimmed">
            下にスクロールすると、センチネル要素が検知範囲に入った時点で次ページを自動読み込みします。
            <br />
            rootMargin: 300px（画面下部から300px手前で検知）
          </Text>
        </Stack>
      </Card>

      {/* アイテム一覧 */}
      <Stack gap="sm">
        {items.map(item => (
          <Card key={item} shadow="xs" p="md" withBorder>
            <Text>アイテム #{item}</Text>
          </Card>
        ))}
      </Stack>

      {/* センチネル要素 - 視認性重視 */}
      {page < maxPage && (
        <div 
          ref={sentinelRef} 
          style={{ 
            height: 150, 
            backgroundColor: 'rgba(255, 0, 0, 0.3)',
            border: '3px dashed red',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '40px 0',
            fontWeight: 'bold',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '18px' }}>🔍 センチネル検知エリア</div>
          <div style={{ fontSize: '14px', marginTop: '10px' }}>
            ページ: {page} / {maxPage}
          </div>
          <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
            ↓ ここから300px手前で次ページ読み込み開始 ↓
          </div>
        </div>
      )}

      {/* ローディング表示 */}
      {isLoading && (
        <Center my="xl">
          <Loader size="lg" type="dots" />
        </Center>
      )}

      {/* 完了メッセージ */}
      {page >= maxPage && (
        <Card shadow="sm" p="lg" mt="lg" bg="green.1">
          <Text ta="center" fw={700} c="green">
            ✓ すべてのページを読み込み完了しました！
          </Text>
          <Text ta="center" size="sm" c="dimmed" mt="sm">
            総表示件数: {items.length}件
          </Text>
        </Card>
      )}
    </div>
  )
}
