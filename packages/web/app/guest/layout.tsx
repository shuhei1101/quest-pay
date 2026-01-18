import { GuestAppShellContent } from './_components/GuestAppShellContent'

export default function GuestLayout({ children }: {
  children: React.ReactNode
}) {

  return (
    <GuestAppShellContent>
      {children}
    </GuestAppShellContent>
  )
}
