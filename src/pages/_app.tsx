import "@/styles/globals.css";
import type { AppProps } from "next/app";
import AppLayout from "@/layout";
import { ConfigProvider } from "antd";
import locale from "antd/locale/zh_CN";

import "dayjs/locale/zh-cn";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <ConfigProvider
        locale={locale}
        theme={{
          token: {
            fontSize: 16,
            colorTextBase: "#000",
            colorBgBase: "#fff",
            colorPrimary: "#198348",
          },
          components: {
            Menu: {
              itemSelectedBg: "#fff",
            },
            Table: {
              colorText: "#000",
              colorTextHeading: "#000",
            },
            Modal: {
              colorBgBase: "#198348",
              colorBgContainer: "#198348",
            },
          },
        }}
      >
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ConfigProvider>
  );
}
