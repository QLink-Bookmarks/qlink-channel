import * as React from "react";
import { Pressable, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Text } from "@/components/ui/text";
import { DEV_AUTH_TOKEN } from "@/constants/auth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";

import { useKakaoLogin } from "../hooks/use-kakao-login";

type LoginButtonProps = {
  onPress?: () => void;
};

function LoginButton({
  onPress,
  children,
  containerClassName,
}: LoginButtonProps & {
  children: React.ReactNode;
  containerClassName: string;
}) {
  return (
    <Pressable
      className={cn(
        "h-12 w-full flex-row items-center justify-center gap-3 rounded-xl px-4 active:opacity-70 web:transition-colors",
        containerClassName,
      )}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

function KakaoLogo() {
  return (
    <Svg
      width={20}
      height={20}
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

function NaverLogo() {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
    >
      <Path
        fill="#FFFFFF"
        d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"
      />
    </Svg>
  );
}

function AppleLogo() {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
    >
      <Path
        fill="#FFFFFF"
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </Svg>
  );
}

function GoogleLogo() {
  return (
    <Svg
      width={18}
      height={18}
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

function AppleLoginButton(props: LoginButtonProps) {
  return (
    <LoginButton
      {...props}
      containerClassName="bg-black"
    >
      <AppleLogo />
      <Text className="text-base font-semibold text-white">애플 로그인</Text>
    </LoginButton>
  );
}

function NaverLoginButton(props: LoginButtonProps) {
  return (
    <LoginButton
      {...props}
      containerClassName="bg-[#03C75A]"
    >
      <NaverLogo />
      <Text className="text-base font-semibold text-white">네이버 로그인</Text>
    </LoginButton>
  );
}

function KakaoLoginButton(props: LoginButtonProps) {
  return (
    <LoginButton
      {...props}
      containerClassName="bg-[#FEE500]"
    >
      <KakaoLogo />
      <Text className="text-base font-semibold text-black/85">카카오 로그인</Text>
    </LoginButton>
  );
}

function GoogleLoginButton(props: LoginButtonProps) {
  return (
    <LoginButton
      {...props}
      containerClassName="bg-white border border-[#747775]"
    >
      <GoogleLogo />
      <Text className="text-base font-medium text-[#1F1F1F]">구글 로그인</Text>
    </LoginButton>
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
  const { handleKakaoLogin } = useKakaoLogin();
  return (
    <View className="w-full max-w-sm gap-3">
      <KakaoLoginButton onPress={handleKakaoLogin} />
      <NaverLoginButton />
      <GoogleLoginButton />
      <AppleLoginButton />
      <DevLoginButton />
    </View>
  );
}

export {
  AppleLoginButton,
  DevLoginButton,
  GoogleLoginButton,
  KakaoLoginButton,
  LoginButtonsStack,
  NaverLoginButton,
};
