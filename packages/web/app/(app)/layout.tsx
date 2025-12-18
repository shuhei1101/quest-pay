import { AppShellContent } from './_components/AppShellContent'

export default function AppLayout({ children }: {
  children: React.ReactNode
}) {

  return (
    <AppShellContent>
      {children}
    </AppShellContent>
  )
}
