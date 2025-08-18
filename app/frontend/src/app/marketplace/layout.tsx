import MainNavigation from "@/components/navigation/main-navigation"

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MainNavigation />
      {children}
    </>
  )
}
