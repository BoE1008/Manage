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
              colorText: '#88B6F1',
              colorPrimary: "#32CD32",
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
