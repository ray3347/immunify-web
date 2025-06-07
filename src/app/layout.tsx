"use client";
import { Inter } from "next/font/google";
import { App, ConfigProvider } from "antd";
import "@ant-design/v5-patch-for-react-19";
import themeConfig from "../theme/themeConfig";
import AntdAppProvider from "../../store/message";
import { useActiveSession } from "../utilities/zustand";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { getClinicById } from "../utilities";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeAccount, switchAccount } = useActiveSession();
  const router = useRouter();

  useEffect(() => {
    const accountId = localStorage.getItem("accountId");
    if (accountId) {
      getClinicById(accountId)
        .then((res) => {
          switchAccount(res);
        })
        .catch(() => {
          localStorage.removeItem("accountId");
          localStorage.setItem("isLoggedIn", "false");
          router.replace("/login");
        });
    } else {
      localStorage.removeItem("accountId");
      localStorage.setItem("isLoggedIn", "false");
      router.replace("/login");
    }
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className} style={{ margin: 0, padding: 0 }}>
        <App>
          <ConfigProvider theme={themeConfig}>
            <AntdAppProvider /> {/* Tambahkan ini */}
            {children}
          </ConfigProvider>
        </App>
      </body>
    </html>
  );
}
