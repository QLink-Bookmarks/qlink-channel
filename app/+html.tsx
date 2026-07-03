import * as React from "react";

import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta
          httpEquiv="X-UA-Compatible"
          content="IE=edge"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>에이링크 ALink — AI가 도와주는 북마크 아카이브</title>
        <meta
          name="description"
          content="저장은 간편하게, 정리는 스마트하게 🧐 AI가 도와주는 북마크 아카이브"
        />
        <meta
          name="theme-color"
          content="#6B7280"
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:title"
          content="에이링크 ALink — AI가 도와주는 북마크 아카이브"
        />
        <meta
          property="og:description"
          content="저장은 간편하게, 정리는 스마트하게 🧐 AI가 도와주는 북마크 아카이브"
        />
        <meta
          property="og:image"
          content="/og-image.png"
        />
        <meta
          property="og:image:width"
          content="1200"
        />
        <meta
          property="og:image:height"
          content="630"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js"
          integrity="sha384-JpLApTkB8lPskhVMhT+m5Ln8aHlnS0bsIexhaak0jOhAkMYedQoVghPfSpjNi9K1"
          crossOrigin="anonymous"
        />
        <script
          src="https://accounts.google.com/gsi/client"
          async
        />
        <script
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          async
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
