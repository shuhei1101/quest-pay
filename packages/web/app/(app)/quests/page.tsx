"use client"
import { useEffect, useState, Suspense, useRef } from "react"
import { Tabs, Input, ActionIcon, Box, Paper } from "@mantine/core"
import { FamilyQuests } from "./family/screen"
import { IconAdjustments, IconClipboard, IconClipboardOff, IconEdit, IconHome2, IconPencil, IconPlus, IconTrash, IconWorld } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion";
import { useConstants } from "@/app/(core)/useConstants"
import { useRouter } from "next/navigation"
import { FAMILY_QUEST_NEW_URL } from "@/app/(core)/constants"

function QuestsContent() {
  const router = useRouter()

  const [tabValue, setTabValue] = useState<string | null>('public');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  /** ブレークポイント */
  const { isMobile } = useConstants()
  // 外側クリックで閉じる
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;

      // 展開中 ＋ コンテナの外をクリックした場合
      if (open && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);
  
  const items = [
    { 
      icon: <IconAdjustments />, // 左
      x: -75, y: 10,
      onClick: () => router.push(FAMILY_QUEST_NEW_URL)
    },
    { 
      icon: <IconTrash />, // 左上
      x: -55, y: -55,
      onClick: () => router.push(FAMILY_QUEST_NEW_URL)
    },
    { 
      icon: <IconEdit />, // 上
      x: 10, y: -75,
      onClick: () => router.push(FAMILY_QUEST_NEW_URL)
    },
  ];
  return (
      <>
    <Tabs variant="pills" value={tabValue} onChange={setTabValue} color={
      tabValue == 'public' ? "rgb(96 165 250)" :
      tabValue == 'family' ? "rgb(74, 222, 128)" :
      tabValue == 'penalty' ? "rgb(252, 132, 132" :
      tabValue == 'template' ? "rgb(250 204 21)" : "blue"
    }  >
      <div className="flex flex-col gap-4">
      <Paper p="xs" withBorder>
        <Tabs.List>
          <div className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
            <Tabs.Tab value="public" leftSection={<IconWorld color={tabValue == 'public' ? "white" : "rgb(96 165 250)"} size={18} />}>
              公開クエスト
            </Tabs.Tab>
            <Tabs.Tab value="family" leftSection={<IconHome2 color={tabValue == 'family' ? "white" : "rgb(74, 222, 128)"} size={18} />}>
              家族クエスト
            </Tabs.Tab>
            <Tabs.Tab value="penalty" leftSection={<IconClipboardOff color={tabValue == 'penalty' ? "white" : "rgb(252, 132, 132)"} size={18} />}>
              違反リスト
            </Tabs.Tab>
            <Tabs.Tab value="template" leftSection={<IconClipboard color={tabValue == 'template' ? "white" : "rgb(250 204 21)"} size={18} />}>
              テンプレート
            </Tabs.Tab>
          </div>
          </Tabs.List>
      </Paper>

      <Paper p="xs" withBorder>

      <Tabs.Panel value="public">
        公開クエスト
      </Tabs.Panel>
      <Tabs.Panel value="family">
        <FamilyQuests />
      </Tabs.Panel>
      <Tabs.Panel value="penalty">
        違反リスト
      </Tabs.Panel>
      <Tabs.Panel value="template">
        テンプレート
      </Tabs.Panel>
    </Paper>
    </div>
    </Tabs>
    {/* フローティングボタン */}
      <div
        ref={containerRef}
        style={{
        position: "fixed",
        zIndex: 3000,
        right: isMobile ? "20px" : "40px",
        bottom: isMobile ? "80px" : "40px",
      }}
      >
      <AnimatePresence>
        {open &&
          items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x: item.x, y: item.y }}
              exit={{ opacity: 0, x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ position: "absolute" }}
            >
              <ActionIcon
                size="xl"
                radius="xl"
                variant="white"
                color="pink"
                onClick={item.onClick} 
                style={{
                  width: 50,
                  height: 50,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.18)" 
                }}
              >
                {item.icon}
              </ActionIcon>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* メインボタン */}
      <ActionIcon
        radius="xl"
        variant="filled"
        color="pink"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 60,
          height: 60,
          boxShadow: "0 8px 24px rgba(0,0,0,0.22)"
        }}
      >
        <IconPlus style={{ width: "70%", height: "70%" }} />
      </ActionIcon>
    </div>


    </>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <QuestsContent />
    </Suspense>
  )
}
