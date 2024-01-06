import "@/app/styles";
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
      <main>{children}</main>
    </body>
  );
}
