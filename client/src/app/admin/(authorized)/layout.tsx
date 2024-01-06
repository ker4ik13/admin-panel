import "@/app/styles";
import { Header } from "@/shared/ui/Header/Header";
import { Sidebar } from "@/shared/ui/Sidebar/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админ панель",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body>
      <Header />
      <Sidebar />
      <main data-tag="main">{children}</main>
    </body>
  );
}
