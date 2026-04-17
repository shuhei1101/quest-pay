"use client"

import { Card, Text, Button, Badge, Group, Stack, Tabs, Avatar, Progress, Box, Modal, Menu, NumberInput, Textarea, Radio, Divider } from "@mantine/core"
import { IconCoin, IconCheck, IconClock, IconX, IconUser, IconAlertTriangle, IconDots, IconEdit, IconTrash, IconArrowRight, IconList } from "@tabler/icons-react"
import { useState } from "react"
import { ScrollableTabs } from "@/app/(core)/_components/ScrollableTabs"
import dayjs from "dayjs"
import "dayjs/locale/ja"

dayjs.locale('ja')

/** モックデータ */
type QuestHistory = {
  id: string
  title: string
  amount: number
  rewardedAt: string
}

type ChildPayment = {
  id: string
  name: string
  age: number
  amount: number
  originalAmount?: number // 元の金額（減額時用）
  status: "unpaid" | "in_progress" | "completed" | "cancelled"
  iconColor: string
  cancelReason?: string // キャンセル理由
  histories?: QuestHistory[] // クエスト履歴（内訳）
}

type MonthData = {
  yearMonth: string
  label: string
  children: ChildPayment[]
  unpaidPreviousMonths?: { yearMonth: string, amount: number }[] // 未払いの過去月
}

/** 月別データ（モック） */
const mockMonthsData: MonthData[] = [
  {
    yearMonth: "2026-02",
    label: "2月",
    children: [
      {
        id: "1",
        name: "太郎",
        age: 12,
        amount: 800,
        status: "completed",
        iconColor: "#667eea",
        histories: [
          { id: "h1", title: "部屋の片付け", amount: 300, rewardedAt: "2026-02-05" },
          { id: "h2", title: "お皿洗い", amount: 500, rewardedAt: "2026-02-15" }
        ]
      },
      {
        id: "2",
        name: "花子",
        age: 10,
        amount: 600,
        status: "completed",
        iconColor: "#f59e0b",
        histories: [
          { id: "h3", title: "洗濯物たたみ", amount: 200, rewardedAt: "2026-02-10" },
          { id: "h4", title: "ゴミ出し", amount: 400, rewardedAt: "2026-02-20" }
        ]
      }
    ]
  },
  {
    yearMonth: "2026-03",
    label: "3月",
    children: [
      {
        id: "1",
        name: "太郎",
        age: 12,
        amount: 1200,
        status: "unpaid",
        iconColor: "#667eea",
        histories: [
          { id: "h5", title: "宿題の手伝い", amount: 400, rewardedAt: "2026-03-03" },
          { id: "h6", title: "お風呂掃除", amount: 800, rewardedAt: "2026-03-18" }
        ]
      },
      {
        id: "2",
        name: "花子",
        age: 10,
        amount: 900,
        status: "unpaid",
        iconColor: "#f59e0b",
        histories: [
          { id: "h7", title: "買い物の手伝い", amount: 300, rewardedAt: "2026-03-08" },
          { id: "h8", title: "料理の準備", amount: 600, rewardedAt: "2026-03-22" }
        ]
      },
      {
        id: "3",
        name: "次郎",
        age: 8,
        amount: 500,
        status: "unpaid",
        iconColor: "#10b981",
        histories: [
          { id: "h9", title: "靴磨き", amount: 500, rewardedAt: "2026-03-12" }
        ]
      }
    ]
  },
  {
    yearMonth: "2026-04",
    label: "今月",
    children: [
      {
        id: "1",
        name: "太郎",
        age: 12,
        amount: 1500,
        status: "unpaid",
        iconColor: "#667eea",
        histories: [
          { id: "h10", title: "窓拭き", amount: 600, rewardedAt: "2026-04-02" },
          { id: "h11", title: "庭の草むしり", amount: 900, rewardedAt: "2026-04-10" }
        ]
      },
      {
        id: "2",
        name: "花子",
        age: 10,
        amount: 1200,
        status: "in_progress",
        iconColor: "#f59e0b",
        histories: [
          { id: "h12", title: "ペットの世話", amount: 400, rewardedAt: "2026-04-05" },
          { id: "h13", title: "本棚の整理", amount: 800, rewardedAt: "2026-04-11" }
        ]
      },
      {
        id: "3",
        name: "次郎",
        age: 8,
        amount: 1000,
        status: "completed",
        iconColor: "#10b981",
        histories: [
          { id: "h14", title: "玄関の掃除", amount: 300, rewardedAt: "2026-04-03" },
          { id: "h15", title: "自転車の掃除", amount: 700, rewardedAt: "2026-04-09" }
        ]
      },
      {
        id: "4",
        name: "美咲",
        age: 6,
        amount: 800,
        status: "unpaid",
        iconColor: "#ec4899",
        histories: [
          { id: "h16", title: "おもちゃの片付け", amount: 300, rewardedAt: "2026-04-06" },
          { id: "h17", title: "弟の面倒を見る", amount: 500, rewardedAt: "2026-04-12" }
        ]
      }
    ],
    unpaidPreviousMonths: [
      { yearMonth: "2026-03", amount: 2600 }  // 3月の未払い分合計
    ]
  }
]

/** ステータスバッジ */
const StatusBadge = ({ status }: { status: ChildPayment["status"] }) => {
  const config = {
    unpaid: { color: "gray", label: "未払い", icon: <IconClock size={14} /> },
    in_progress: { color: "yellow", label: "支払い中", icon: <IconCoin size={14} /> },
    completed: { color: "green", label: "完了", icon: <IconCheck size={14} /> },
    cancelled: { color: "red", label: "支払いなし", icon: <IconX size={14} /> }
  }

  const { color, label, icon } = config[status]

  return (
    <Badge color={color} variant="light" size="lg" leftSection={icon}>
      {label}
    </Badge>
  )
}

/** 月タブ+内訳モーダル対応版（キャンセル・減額機能付き）*/
const CardBasedLayoutWithMonthTabs = () => {
  const [selectedYearMonth, setSelectedYearMonth] = useState("2026-04")
  const [monthsData, setMonthsData] = useState(mockMonthsData)
  
  // 内訳モーダル
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [detailChild, setDetailChild] = useState<ChildPayment | null>(null)
  
  // 強制完了モーダル
  const [forceCompleteModalOpen, setForceCompleteModalOpen] = useState(false)
  
  // キャンセルモーダル
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("penalty")
  const [cancelNote, setCancelNote] = useState("")
  
  // 減額モーダル
  const [adjustModalOpen, setAdjustModalOpen] = useState(false)
  const [newAmount, setNewAmount] = useState<number>(0)
  const [adjustReason, setAdjustReason] = useState("")
  
  const [targetChildId, setTargetChildId] = useState<string | null>(null)

  const currentMonthData = monthsData.find(m => m.yearMonth === selectedYearMonth)
  const children = currentMonthData?.children || []
  const unpaidPrevious = currentMonthData?.unpaidPreviousMonths || []

  const handlePayment = (childId: string) => {
    setMonthsData(prev =>
      prev.map(month =>
        month.yearMonth === selectedYearMonth
          ? {
              ...month,
              children: month.children.map(child =>
                child.id === childId ? { ...child, status: "in_progress" as const } : child
              )
            }
          : month
      )
    )
  }

  const openDetailModal = (child: ChildPayment) => {
    setDetailChild(child)
    setDetailModalOpen(true)
  }

  const openForceCompleteModal = (childId: string) => {
    setTargetChildId(childId)
    setForceCompleteModalOpen(true)
  }

  const handleForceComplete = () => {
    if (!targetChildId) return
    setMonthsData(prev =>
      prev.map(month =>
        month.yearMonth === selectedYearMonth
          ? {
              ...month,
              children: month.children.map(child =>
                child.id === targetChildId ? { ...child, status: "completed" as const } : child
              )
            }
          : month
      )
    )
    setForceCompleteModalOpen(false)
    setTargetChildId(null)
  }

  const openCancelModal = (childId: string) => {
    setTargetChildId(childId)
    setCancelModalOpen(true)
    setCancelReason("penalty")
    setCancelNote("")
  }

  const handleCancel = () => {
    if (!targetChildId) return
    const reasonText = {
      penalty: "罰則・ペナルティ",
      family: "家庭の事情",
      child_request: "本人の希望",
      other: "その他"
    }[cancelReason]
    
    const fullReason = cancelNote ? `${reasonText}（${cancelNote}）` : reasonText
    
    setMonthsData(prev =>
      prev.map(month =>
        month.yearMonth === selectedYearMonth
          ? {
              ...month,
              children: month.children.map(child =>
                child.id === targetChildId 
                  ? { ...child, status: "cancelled" as const, cancelReason: fullReason } 
                  : child
              )
            }
          : month
      )
    )
    setCancelModalOpen(false)
    setTargetChildId(null)
  }

  const handleUndoCancel = (childId: string) => {
    setMonthsData(prev =>
      prev.map(month =>
        month.yearMonth === selectedYearMonth
          ? {
              ...month,
              children: month.children.map(child =>
                child.id === childId 
                  ? { ...child, status: "unpaid" as const, cancelReason: undefined } 
                  : child
              )
            }
          : month
      )
    )
  }

  const openAdjustModal = (childId: string) => {
    const child = children.find(c => c.id === childId)
    if (child) {
      setTargetChildId(childId)
      setNewAmount(child.amount)
      setAdjustReason("")
      setAdjustModalOpen(true)
    }
  }

  const handleAdjust = () => {
    if (!targetChildId) return
    setMonthsData(prev =>
      prev.map(month =>
        month.yearMonth === selectedYearMonth
          ? {
              ...month,
              children: month.children.map(child =>
                child.id === targetChildId 
                  ? { 
                      ...child, 
                      originalAmount: child.originalAmount || child.amount,
                      amount: newAmount,
                      cancelReason: adjustReason,
                      status: newAmount === 0 ? "cancelled" as const : child.status
                    } 
                  : child
              )
            }
          : month
      )
    )
    setAdjustModalOpen(false)
    setTargetChildId(null)
  }

  const totalAmount = children.reduce((sum, child) => sum + child.amount, 0)
  const paidAmount = children
    .filter(c => c.status === "completed")
    .reduce((sum, child) => sum + child.amount, 0)
  const progress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0

  const unpaidTotal = unpaidPrevious.reduce((sum, prev) => sum + prev.amount, 0)

  const targetChild = children.find(c => c.id === targetChildId)

  const isCurrentMonth = selectedYearMonth === "2026-04"

  return (
    <Stack gap="lg">
      {/* 内訳モーダル */}
      <Modal
        opened={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={
          <Group gap="xs">
            <IconList size={24} color="#3b82f6" />
            <Text size="lg" fw={700}>{detailChild?.name}さんの内訳</Text>
          </Group>
        }
        centered
        size="md"
      >
        <Stack gap="md">
          <Card padding="md" radius="md" style={{ backgroundColor: "#dbeafe" }}>
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">対象月</Text>
              <Badge color="blue" variant="light">
                {dayjs(selectedYearMonth).format('YYYY年M月')}
              </Badge>
            </Group>
            <Group>
              <Avatar color={detailChild?.iconColor} radius="xl" size="lg">
                <IconUser size={24} />
              </Avatar>
              <div>
                <Text fw={700} size="xl">{detailChild?.amount.toLocaleString()}円</Text>
                <Text size="sm" c="dimmed">{detailChild?.histories?.length || 0}件のクエスト</Text>
              </div>
            </Group>
          </Card>

          <Divider label="クエスト明細" labelPosition="center" />

          {detailChild?.histories && detailChild.histories.length > 0 ? (
            <Stack gap="xs">
              {detailChild.histories.map(h => (
                <Card key={h.id} padding="sm" radius="sm" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text fw={600}>{h.title}</Text>
                      <Text size="xs" c="dimmed">
                        {dayjs(h.rewardedAt).format('M月D日')}
                      </Text>
                    </div>
                    <Text fw={700} c="blue">{h.amount.toLocaleString()}円</Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          ) : (
            <Text c="dimmed" ta="center" py="md">クエスト履歴がありません</Text>
          )}

          <Button
            fullWidth
            variant="light"
            onClick={() => setDetailModalOpen(false)}
            style={{ minHeight: 44 }}
          >
            閉じる
          </Button>
        </Stack>
      </Modal>

      {/* 強制完了確認モーダル */}
      <Modal
        opened={forceCompleteModalOpen}
        onClose={() => setForceCompleteModalOpen(false)}
        title={
          <Group gap="xs">
            <IconAlertTriangle size={24} color="#f59e0b" />
            <Text size="lg" fw={700}>強制完了の確認</Text>
          </Group>
        }
        centered
        size="md"
      >
        <Stack gap="md">
          <Card padding="md" radius="md" style={{ backgroundColor: "#fef3c7" }}>
            <Text size="sm" c="dimmed" mb="xs">対象の子供</Text>
            <Group>
              {targetChild && (
                <>
                  <Avatar color={targetChild.iconColor} radius="xl" size="md">
                    <IconUser size={20} />
                  </Avatar>
                  <div>
                    <Text fw={600}>{targetChild.name}</Text>
                    <Text size="sm" c="dimmed">{targetChild.amount.toLocaleString()}円</Text>
                  </div>
                </>
              )}
            </Group>
          </Card>
          <Text size="sm" c="dimmed">
            子供が受け取り完了を押していない状態で、支払いを完了にします。
          </Text>
          <Text size="sm" fw={600} c="orange">
            本当に強制完了しますか？
          </Text>
          <Group gap="xs" mt="md">
            <Button
              flex={1}
              variant="light"
              color="gray"
              onClick={() => setForceCompleteModalOpen(false)}
              style={{ minHeight: 44 }}
            >
              キャンセル
            </Button>
            <Button
              flex={1}
              color="red"
              onClick={handleForceComplete}
              style={{ minHeight: 44 }}
            >
              強制完了する
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* キャンセル確認モーダル */}
      <Modal
        opened={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title={
          <Group gap="xs">
            <IconTrash size={24} color="#ef4444" />
            <Text size="lg" fw={700}>支払いのキャンセル</Text>
          </Group>
        }
        centered
        size="md"
      >
        <Stack gap="md">
          <Card padding="md" radius="md" style={{ backgroundColor: "#fee2e2" }}>
            <Text size="sm" c="dimmed" mb="xs">対象の子供</Text>
            <Group>
              {targetChild && (
                <>
                  <Avatar color={targetChild.iconColor} radius="xl" size="md">
                    <IconUser size={20} />
                  </Avatar>
                  <div>
                    <Text fw={600}>{targetChild.name}</Text>
                    <Text size="sm" c="dimmed">{targetChild.amount.toLocaleString()}円</Text>
                  </div>
                </>
              )}
            </Group>
          </Card>

          <div>
            <Text size="sm" fw={600} mb="xs">キャンセル理由</Text>
            <Radio.Group value={cancelReason} onChange={setCancelReason}>
              <Stack gap="xs">
                <Radio value="penalty" label="罰則・ペナルティ" />
                <Radio value="family" label="家庭の事情" />
                <Radio value="child_request" label="本人の希望" />
                <Radio value="other" label="その他" />
              </Stack>
            </Radio.Group>
          </div>

          <Textarea
            label="詳細（任意）"
            placeholder="キャンセル理由の詳細を入力..."
            value={cancelNote}
            onChange={(e) => setCancelNote(e.target.value)}
            minRows={2}
          />

          <Text size="sm" fw={600} c="red">
            本当にこの月の支払いをキャンセルしますか？
          </Text>

          <Group gap="xs" mt="md">
            <Button
              flex={1}
              variant="light"
              color="gray"
              onClick={() => setCancelModalOpen(false)}
              style={{ minHeight: 44 }}
            >
              戻る
            </Button>
            <Button
              flex={1}
              color="red"
              onClick={handleCancel}
              style={{ minHeight: 44 }}
            >
              キャンセル確定
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* 金額調整モーダル */}
      <Modal
        opened={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        title={
          <Group gap="xs">
            <IconEdit size={24} color="#3b82f6" />
            <Text size="lg" fw={700}>金額の変更</Text>
          </Group>
        }
        centered
        size="md"
      >
        <Stack gap="md">
          <Card padding="md" radius="md" style={{ backgroundColor: "#dbeafe" }}>
            <Text size="sm" c="dimmed" mb="xs">対象の子供</Text>
            <Group>
              {targetChild && (
                <>
                  <Avatar color={targetChild.iconColor} radius="xl" size="md">
                    <IconUser size={20} />
                  </Avatar>
                  <div>
                    <Text fw={600}>{targetChild.name}</Text>
                    <Text size="sm" c="dimmed">
                      元の金額: {(targetChild.originalAmount || targetChild.amount).toLocaleString()}円
                    </Text>
                  </div>
                </>
              )}
            </Group>
          </Card>

          <NumberInput
            label="変更後の金額"
            value={newAmount}
            onChange={(val) => setNewAmount(Number(val))}
            min={0}
            max={10000}
            step={100}
            suffix="円"
            size="lg"
          />

          {newAmount === 0 && (
            <Card padding="sm" radius="md" style={{ backgroundColor: "#fef3c7" }}>
              <Text size="sm" c="orange">
                ⚠️ 0円に設定すると、支払いをキャンセル（免除）したことになります
              </Text>
            </Card>
          )}

          <Textarea
            label="変更理由"
            placeholder="金額を変更する理由を入力..."
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            minRows={2}
          />

          <Group gap="xs" mt="md">
            <Button
              flex={1}
              variant="light"
              color="gray"
              onClick={() => setAdjustModalOpen(false)}
              style={{ minHeight: 44 }}
            >
              キャンセル
            </Button>
            <Button
              flex={1}
              color="blue"
              onClick={handleAdjust}
              style={{ minHeight: 44 }}
            >
              変更を確定
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* 月選択タブ */}
      <ScrollableTabs
        activeTab={selectedYearMonth}
        onChange={(value) => value && setSelectedYearMonth(value)}
        tabs={monthsData.map(m => ({
          value: m.yearMonth,
          label: m.label
        }))}
      >
        {monthsData.map(m => (
          <Tabs.Panel key={m.yearMonth} value={m.yearMonth}>
            <div />
          </Tabs.Panel>
        ))}
      </ScrollableTabs>

      {/* 未払い月セクション（今月タブのみ） */}
      {isCurrentMonth && unpaidPrevious.length > 0 && (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: "#fef3c7" }}>
          <Group justify="space-between" mb="sm">
            <Text fw={700} c="orange">⚠️ 未払いの月があります</Text>
            <Badge color="orange" size="lg">{unpaidTotal.toLocaleString()}円</Badge>
          </Group>
          <Stack gap="xs">
            {unpaidPrevious.map(prev => (
              <Group key={prev.yearMonth} justify="space-between">
                <Text size="sm">{dayjs(prev.yearMonth).format('YYYY年M月')}分</Text>
                <Text size="sm" fw={600}>{prev.amount.toLocaleString()}円</Text>
              </Group>
            ))}
          </Stack>
        </Card>
      )}

      {/* サマリーカード */}
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <div>
            <Text size="xl" fw={700} mb={4}>
              {isCurrentMonth ? "今月のお小遣い支払い" : `${dayjs(selectedYearMonth).format('YYYY年M月')}の支払い`}
            </Text>
            <Group gap="md">
              <Badge color="blue" size="lg" variant="light">
                {dayjs(selectedYearMonth).format('YYYY年M月')}分
              </Badge>
              {!isCurrentMonth && (
                <Badge color="gray" size="lg" variant="light">過去の記録</Badge>
              )}
            </Group>
          </div>
        </Group>
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">支払い進捗</Text>
          <Text size="sm" fw={600}>
            {paidAmount.toLocaleString()}円 / {totalAmount.toLocaleString()}円
          </Text>
        </Group>
        <Progress value={progress} size="lg" radius="xl" color="green" mb="xs" />
        <Text size="xs" c="dimmed" ta="right">
          {children.filter(c => c.status === "completed").length} / {children.length} 人完了
        </Text>
      </Card>

      {/* 子供カードリスト */}
      <Stack gap="md">
        {children.map(child => (
          <Card key={child.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <Group>
                <Avatar
                  color={child.iconColor}
                  radius="xl"
                  size="lg"
                  style={{ minWidth: 48, minHeight: 48 }}
                >
                  <IconUser size={24} />
                </Avatar>
                <div>
                  <Text size="lg" fw={600}>{child.name}</Text>
                  <Text size="sm" c="dimmed">{child.age}歳</Text>
                </div>
              </Group>

              <Stack gap="xs" align="flex-end">
                <Group gap="xs">
                  {child.originalAmount && child.originalAmount !== child.amount && (
                    <Text size="sm" c="dimmed" td="line-through">
                      {child.originalAmount.toLocaleString()}円
                    </Text>
                  )}
                  <Text size="xl" fw={700} c={child.iconColor}>
                    {child.amount.toLocaleString()}円
                  </Text>
                </Group>
                <StatusBadge status={child.status} />
              </Stack>
            </Group>

            {child.cancelReason && (
              <Card padding="sm" radius="md" style={{ backgroundColor: "#fef2f2" }} mt="md">
                <Text size="xs" c="dimmed" mb={4}>
                  {child.amount === 0 ? "キャンセル理由" : "変更理由"}
                </Text>
                <Text size="sm" c="red">{child.cancelReason}</Text>
              </Card>
            )}

            <Group mt="md" gap="xs">
              {isCurrentMonth ? (
                // 今月タブ: 操作可能
                <>
                  {child.status === "unpaid" && (
                    <>
                      <Button
                        flex={1}
                        color="blue"
                        size="md"
                        onClick={() => handlePayment(child.id)}
                        style={{ minHeight: 44 }}
                      >
                        支払う
                      </Button>
                      <Button
                        color="gray"
                        size="md"
                        variant="light"
                        onClick={() => openDetailModal(child)}
                        style={{ minHeight: 44 }}
                      >
                        <IconList size={20} />
                      </Button>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <Button
                            color="gray"
                            size="md"
                            variant="light"
                            style={{ minHeight: 44 }}
                          >
                            <IconDots size={20} />
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size={16} />}
                            onClick={() => openAdjustModal(child.id)}
                          >
                            金額を変更
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconTrash size={16} />}
                            color="red"
                            onClick={() => openCancelModal(child.id)}
                          >
                            支払いをキャンセル
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </>
                  )}
                  {child.status === "in_progress" && (
                    <>
                      <Button
                        flex={1}
                        color="yellow"
                        size="md"
                        disabled
                        style={{ minHeight: 44 }}
                      >
                        支払い中
                      </Button>
                      <Button
                        color="gray"
                        size="md"
                        variant="light"
                        onClick={() => openDetailModal(child)}
                        style={{ minHeight: 44 }}
                      >
                        <IconList size={20} />
                      </Button>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <Button
                            color="gray"
                            size="md"
                            variant="light"
                            style={{ minHeight: 44 }}
                          >
                            <IconDots size={20} />
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconAlertTriangle size={16} />}
                            color="orange"
                            onClick={() => openForceCompleteModal(child.id)}
                          >
                            強制完了
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconEdit size={16} />}
                            onClick={() => openAdjustModal(child.id)}
                          >
                            金額を変更
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconTrash size={16} />}
                            color="red"
                            onClick={() => openCancelModal(child.id)}
                          >
                            支払いをキャンセル
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </>
                  )}
                  {child.status === "completed" && (
                    <>
                      <Button flex={1} color="gray" size="md" disabled style={{ minHeight: 44 }}>
                        支払い済み
                      </Button>
                      <Button
                        color="gray"
                        size="md"
                        variant="light"
                        onClick={() => openDetailModal(child)}
                        style={{ minHeight: 44 }}
                      >
                        <IconList size={20} />
                      </Button>
                    </>
                  )}
                  {child.status === "cancelled" && (
                    <>
                      <Button
                        flex={1}
                        color="blue"
                        size="md"
                        variant="light"
                        onClick={() => handleUndoCancel(child.id)}
                        style={{ minHeight: 44 }}
                      >
                        キャンセルを取り消す
                      </Button>
                      <Button
                        color="gray"
                        size="md"
                        variant="light"
                        onClick={() => openDetailModal(child)}
                        style={{ minHeight: 44 }}
                      >
                        <IconList size={20} />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                // 過去月タブ: 閲覧のみ
                <Button
                  fullWidth
                  color="gray"
                  size="md"
                  variant="light"
                  onClick={() => openDetailModal(child)}
                  style={{ minHeight: 44 }}
                >
                  内訳を見る
                </Button>
              )}
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}

/** メインページ */
export default function MonthlyPaymentMockPage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Text size="2rem" fw={700} mb="xs">
        月のお小遣い支払い画面 - 月タブ+内訳対応版
      </Text>
      <Text size="sm" c="dimmed" mb="xl">
        月ごとにタブで表示、内訳モーダル、キャンセル・減額機能を統合
      </Text>

      <CardBasedLayoutWithMonthTabs />
    </div>
  )
}
