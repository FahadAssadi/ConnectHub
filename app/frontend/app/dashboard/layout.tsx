import { AppLayout } from "./(components)/dashboard-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout
      title="Dashboard"
      profileStatus="approved"
      notificationCount={3}
      companyName="Acme Corp"
    >
      {children}
    </AppLayout>
  )
}
