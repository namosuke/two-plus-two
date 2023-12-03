import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/thumbnail.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@barley_ural" />
        <meta name="twitter:creator" content="@barley_ural" />
        <meta property="og:url" content="https://two-plus-two.deno.dev" />
        <meta
          property="og:title"
          content="2+2=5になる計算機 - Two Plus Two Equals Five Calculator"
        />
        <meta
          property="og:description"
          content="小説『1984年』に登場する「二足す二は五」が正しい世界線をイメージした不思議な電卓ツールです"
        />
        <meta
          property="og:image"
          content="https://two-plus-two.deno.dev/ogp.jpg"
        />
        <title>2+2=5になる計算機 - Two Plus Two Equals Five Calculator</title>
        <meta
          name="description"
          content="小説『1984年』に登場する「二足す二は五」が正しい世界線をイメージした不思議な電卓ツールです"
        />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sawarabi+Mincho&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
            .sawarabi {
              font-family: 'Sawarabi Mincho', serif;
            }
          `}
        </style>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
