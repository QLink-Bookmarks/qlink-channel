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
        <title>큐링크 QLink — 링크와 QR을 AI가 정리하는 스마트 북마크</title>
        <meta
          name="description"
          content="흩어진 링크와 QR을 저장하면 AI가 자동으로 분류·정리해줘요. 모든 북마크를 한 곳에. ✨"
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
          content="큐링크 QLink — AI가 정리하는 스마트 북마크"
        />
        <meta
          property="og:description"
          content="흩어진 링크와 QR을 저장하면 AI가 자동으로 분류·정리해줘요. 모든 북마크를 한 곳에. ✨"
        />
        <meta
          property="og:image"
          content="/app_icon.png"
        />
        <meta
          name="twitter:card"
          content="summary"
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
