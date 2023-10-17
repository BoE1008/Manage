import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import AppLayout from "@/layout";
import { useRouter } from "next/router";
import { ConfigProvider } from "antd";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { asPath } = router;

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
