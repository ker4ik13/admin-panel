import { Header } from "@/shared/ui/Header/Header";
import { Sidebar } from "@/shared/ui/Sidebar/Sidebar";
import type { Metadata } from "next";
import "./styles";

export const metadata: Metadata = {
  title: "Админ панель",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="eaf2fb"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="18191b"
      />
      <body>
        <Header />
        <Sidebar />
        <main data-tag="main">{children}</main>
      </body>
    </html>
  );
}
