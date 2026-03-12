"use client"

import { Paper, Text, Group, Avatar, ActionIcon } from "@mantine/core"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { FAMILY_VIEW_URL, FAMILIES_MEMBERS_CHILD_VIEW_URL, TEST_URL } from "@/app/(core)/endpoints"
import { useRouter } from "next/navigation"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { IconFlask } from "@tabler/icons-react"

type PageHeaderProps = {
  /** ページタイトル */
  title: string
  /** 右側に配置する要素 */
  rightSection?: React.ReactNode
  /** プロフィールボタンを表示するかどうか（デフォルト: true） */
  showProfileButton?: boolean
}

/**
 * ページヘッダーを表示する共通コンポーネント
 * Paperでラップしボーダーと影を付けて表示する
 * 親の場合は家族プロフィールボタン、子供の場合は子供プロフィールボタンを右端に表示する
 */
export const PageHeader = ({ 
  title, 
  rightSection, 
  showProfileButton = true 
}: PageHeaderProps) => {
  const router = useRouter()
  const { userInfo, isLoading } = useLoginUserInfo()

  // プロフィールボタン押下時のハンドル
  const handleProfileClick = () => {
    if (!userInfo) return
    
    // 家族情報がある場合は家族プロフィール画面へ
    if (userInfo.families?.id) {
      router.push(FAMILY_VIEW_URL(userInfo.families.id))
    }
    // 子供情報がある場合は子供プロフィール画面へ
    else if (userInfo.children?.id) {
      router.push(FAMILIES_MEMBERS_CHILD_VIEW_URL(userInfo.children.id))
    }
  }

  // プロフィールボタンを表示するかどうか
  const shouldShowProfileButton = 
    showProfileButton && 
    !isLoading && 
    userInfo && 
    (userInfo.families?.id || userInfo.children?.id)

  // アイコン情報を取得
  const iconName = userInfo?.icons?.name
  const iconColor = userInfo?.profiles?.iconColor

  return (
    <Paper p="md" withBorder shadow="sm" mb="md">
      <Group justify="space-between" align="center">
        <Text size="xl" fw={700}>{title}</Text>
        <Group gap="xs">
          {rightSection && <div>{rightSection}</div>}
          {/* モック画面一覧へのリンクボタン */}
          <ActionIcon
            onClick={() => router.push(TEST_URL)}
            size="lg"
            variant="subtle"
            aria-label="モック画面一覧"
            title="モック画面一覧"
          >
            <IconFlask size={24} />
          </ActionIcon>
          {shouldShowProfileButton && (
            <Avatar 
              onClick={handleProfileClick} 
              size="md"
              radius="xl"
              aria-label="プロフィール"
              style={{
                cursor: "pointer",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              }}
            >
              <RenderIcon iconName={iconName} iconColor="#FFFFFF" size={20} />
            </Avatar>
          )}
        </Group>
      </Group>
    </Paper>
  )
}
