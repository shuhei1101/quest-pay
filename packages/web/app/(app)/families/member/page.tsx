"use client"
import { useEffect, useState, Suspense, useRef } from "react"
import { Tabs, Input, ActionIcon, Box, Paper, Text, Button } from "@mantine/core"
import { IconAdjustments, IconClipboard, IconClipboardOff, IconEdit, IconHome2, IconLogout, IconPencil, IconPlus, IconTrash, IconWorld } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion";
import { useConstants } from "@/app/(core)/useConstants"
import { useRouter } from "next/navigation"
import { useLoginUserInfo } from "@/app/login/_hooks/useLoginUserInfo"
import { ChildList } from "../families/member/_components/ChildList";
import { LOGIN_URL } from "@/app/(core)/constants";

function ChildrenContent() {
  const router = useRouter()

  /** ログインユーザ情報 */
  const { isGuest } = useLoginUserInfo()

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
  
  // const items = [
  //   { 
  //     icon: <IconAdjustments />, // 左
  //     x: -75, y: 10,
  //     onClick: () => router.push(FAMILY_QUEST_NEW_URL)
  //   },
  //   { 
  //     icon: <IconTrash />, // 左上
  //     x: -55, y: -55,
  //     onClick: () => router.push(FAMILY_QUEST_NEW_URL)
  //   },
  //   { 
  //     icon: <IconEdit />, // 上
  //     x: 10, y: -75,
  //     onClick: () => router.push(FAMILY_QUEST_NEW_URL)
  //   },
  // ];

    const GuestScreen = () => (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center">
      <Text className="text-lg mb-4">ログインが必要です。</Text>
      <Button
        onClick={() => router.push(`${LOGIN_URL}`)}
      >
        <>
          <Text>ログイン</Text>
          <IconLogout style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </>
      </Button>
    </div>
  )

  return (
      <>


      </>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <ChildrenContent />
    </Suspense>
  )
}
