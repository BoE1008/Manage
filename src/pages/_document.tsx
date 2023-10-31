import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link
        rel="preload"
        href="/fonts/SanJiLingYunZhangCao-2.ttf"
        as="font"
        type="font/ttf"
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
