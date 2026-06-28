import Svg, { Path } from "react-native-svg";

type SocialProvider = "APPLE" | "KAKAO" | "NAVER" | "GOOGLE";

function KakaoLogo({ size = 20 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <Path
        fill="#000000"
        fillOpacity={0.85}
        d="M12 3C6.477 3 2 6.59 2 10.95c0 2.8 1.85 5.25 4.65 6.7l-1.2 4.45c-.1.4.35.7.7.5L11.7 19.4c.1 0 .2.02.3.02 5.523 0 10-3.59 10-7.95S17.523 3 12 3z"
      />
    </Svg>
  );
}

function NaverLogo({ size = 18 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <Path
        fill="#FFFFFF"
        d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"
      />
    </Svg>
  );
}

function AppleLogo({ size = 18 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <Path
        fill="#FFFFFF"
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </Svg>
  );
}

function GoogleLogo({ size = 18 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
    >
      <Path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <Path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
      />
      <Path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <Path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </Svg>
  );
}

type ProviderBrand = {
  provider: SocialProvider;
  loginLabel: string;
  connectLabel: string;
  containerClassName: string;
  chipClassName: string;
  textClassName: string;
  logoSize: number;
  Logo: ({ size }: { size?: number }) => React.JSX.Element;
};

const PROVIDER_BRANDS: Record<SocialProvider, ProviderBrand> = {
  // Apple HIG "Sign in with Apple": black button, white mark + label, brand
  // name untranslated, approved phrasing ("Apple로 로그인" / "Apple로 계속하기").
  APPLE: {
    provider: "APPLE",
    loginLabel: "Apple로 로그인",
    connectLabel: "Apple로 계속하기",
    containerClassName: "bg-black",
    chipClassName: "bg-black",
    textClassName: "font-semibold text-white",
    logoSize: 18,
    Logo: AppleLogo,
  },
  KAKAO: {
    provider: "KAKAO",
    loginLabel: "카카오 로그인",
    connectLabel: "카카오 계정 연결",
    containerClassName: "bg-[#FEE500]",
    chipClassName: "bg-[#FEE500]",
    textClassName: "font-semibold text-black/85",
    logoSize: 20,
    Logo: KakaoLogo,
  },
  NAVER: {
    provider: "NAVER",
    loginLabel: "네이버 로그인",
    connectLabel: "네이버 계정 연결",
    containerClassName: "bg-[#03C75A]",
    chipClassName: "bg-[#03C75A]",
    textClassName: "font-semibold text-white",
    logoSize: 18,
    Logo: NaverLogo,
  },
  // Google branding (neutral/white button): #FFFFFF background, #747775 border,
  // #1F1F1F medium label, full-color "G", brand name untranslated.
  GOOGLE: {
    provider: "GOOGLE",
    loginLabel: "Google로 로그인",
    connectLabel: "Google로 계속하기",
    containerClassName: "bg-white border border-[#747775]",
    chipClassName: "bg-white border border-[#747775]",
    textClassName: "font-medium text-[#1F1F1F]",
    logoSize: 18,
    Logo: GoogleLogo,
  },
};

const SOCIAL_PROVIDER_ORDER: SocialProvider[] = ["APPLE", "KAKAO", "NAVER", "GOOGLE"];

function normalizeSocialProvider(type: string): SocialProvider | null {
  const upper = type.toUpperCase();
  return (SOCIAL_PROVIDER_ORDER as string[]).includes(upper) ? (upper as SocialProvider) : null;
}

export {
  AppleLogo,
  GoogleLogo,
  KakaoLogo,
  NaverLogo,
  PROVIDER_BRANDS,
  SOCIAL_PROVIDER_ORDER,
  normalizeSocialProvider,
};
export type { ProviderBrand, SocialProvider };
