import { DashboardLayout } from "../(components)/dashboard-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout isCompany={false}>
      {children}
    </DashboardLayout>
  );
}