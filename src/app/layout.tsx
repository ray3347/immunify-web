'use client';
import { Inter } from 'next/font/google';
import { App, ConfigProvider } from "antd";
import '@ant-design/v5-patch-for-react-19';
import themeConfig from '../theme/themeConfig';
import AntdAppProvider from '../../store/message';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
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
