import { getAuthContext } from '../(core)/_auth/withAuth'
import { AppShellContent } from './_components/AppShellContent'

export default async function AppLayout({ children }: {
  children: React.ReactNode
}) {

  // 認証チェックを先に実行する（未認証の場合はwithAuthでリダイレクトされる）
  await getAuthContext()

  return (
    <AppShellContent>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
      {children}
      </div>
    </AppShellContent>
  )
}
