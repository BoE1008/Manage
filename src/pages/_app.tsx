import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import AppLayout from "@/layout";
import { ConfigProvider } from "antd";

export default function App({
  Component,
  pageProps,
  router: { asPath },
}: AppProps) {
  return (
    <RecoilRoot>
      {asPath === "/login" ? (
        <Component {...pageProps} />
      ) : (
        <ConfigProvider
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
                colorPrimaryTextHover: "#198348",
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
      )}
    </RecoilRoot>
  );
}
