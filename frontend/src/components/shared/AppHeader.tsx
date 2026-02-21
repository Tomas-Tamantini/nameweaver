import { ModeToggle } from '@/components/shared/ModeToggle'

function AppHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
        <h1 className="text-base font-semibold tracking-tight">Nameweaver</h1>
        <ModeToggle />
      </div>
    </header>
  )
}

export default AppHeader
