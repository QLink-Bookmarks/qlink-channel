import * as React from "react";
import { Pressable, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Text } from "@/components/ui/text";
import { DEV_AUTH_TOKEN } from "@/constants/auth";
import { isDevLoginEnabled } from "@/lib/app-variant";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";

import { useAppleLogin } from "../hooks/use-apple-login";
import { useGoogleLogin } from "../hooks/use-google-login";
import { useKakaoLogin } from "../hooks/use-kakao-login";
import { useNaverLogin } from "../hooks/use-naver-login";
import { PROVIDER_BRANDS, type SocialProvider } from "../lib/provider-brand";
import { ReplayOnboardingButton } from "./replay-onboarding-button";

type LoginButtonProps = {
  onPress?: () => void;
};

function LoginButton({
  onPress,
  disabled,
  children,
  containerClassName,
}: LoginButtonProps & {
  disabled?: boolean;
  children: React.ReactNode;
  containerClassName: string;
}) {
  return (
    <Pressable
      className={cn(
        "h-12 w-full flex-row items-center justify-center gap-3 rounded-xl px-4 active:opacity-70 web:transition-colors",
        containerClassName,
      )}
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

function DevLogo() {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
    >
      <Path
        fill="#FFFFFF"
        d="m9.4 16.6 1.4-1.4-3.2-3.2 3.2-3.2L9.4 7.4 4.8 12zm5.2 0L19.2 12l-4.6-4.6-1.4 1.4 3.2 3.2-3.2 3.2z"
      />
    </Svg>
  );
}

function ProviderLoginButton({
  provider,
  onPress,
}: LoginButtonProps & { provider: SocialProvider }) {
  const brand = PROVIDER_BRANDS[provider];
  const Logo = brand.Logo;
  return (
    <LoginButton
      containerClassName={brand.containerClassName}
      onPress={onPress}
    >
      <Logo size={brand.logoSize} />
      <Text className={cn("text-base", brand.textClassName)}>{brand.loginLabel}</Text>
    </LoginButton>
  );
}

function AppleLoginButton(props: LoginButtonProps) {
  return (
    <ProviderLoginButton
      provider="APPLE"
      {...props}
    />
  );
}

function NaverLoginButton(props: LoginButtonProps) {
  return (
    <ProviderLoginButton
      provider="NAVER"
      {...props}
    />
  );
}

function KakaoLoginButton(props: LoginButtonProps) {
  return (
    <ProviderLoginButton
      provider="KAKAO"
      {...props}
    />
  );
}

function GoogleLoginButton(props: LoginButtonProps) {
  return (
    <ProviderLoginButton
      provider="GOOGLE"
      {...props}
    />
  );
}

function DevLoginButton({ onPress }: LoginButtonProps) {
  const authenticate = useAuthStore((state) => state.authenticate);
  const handlePress = React.useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }
    if (DEV_AUTH_TOKEN) {
      authenticate({ accessToken: DEV_AUTH_TOKEN, refreshToken: null });
    }
  }, [authenticate, onPress]);

  return (
    <LoginButton
      onPress={handlePress}
      containerClassName="bg-muted-foreground"
    >
      <DevLogo />
      <Text className="text-base font-semibold text-white">개발자 로그인</Text>
    </LoginButton>
  );
}

function LoginButtonsStack() {
  const { handleAppleLogin } = useAppleLogin();
  const { handleKakaoLogin } = useKakaoLogin();
  const { handleGoogleLogin } = useGoogleLogin();
  const { handleNaverLogin } = useNaverLogin();
  return (
    <View className="w-full max-w-sm gap-3">
      <AppleLoginButton onPress={handleAppleLogin} />
      <KakaoLoginButton onPress={handleKakaoLogin} />
      <NaverLoginButton onPress={handleNaverLogin} />
      <GoogleLoginButton onPress={handleGoogleLogin} />
      {isDevLoginEnabled ? <DevLoginButton /> : null}
      {isDevLoginEnabled ? <ReplayOnboardingButton /> : null}
    </View>
  );
}

export {
  AppleLoginButton,
  DevLoginButton,
  GoogleLoginButton,
  KakaoLoginButton,
  LoginButton,
  LoginButtonsStack,
  NaverLoginButton,
};
