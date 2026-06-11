import * as React from "react";
import { Pressable, type PressableProps } from "react-native";

type ImageUploaderProps = Omit<PressableProps, "onPress"> & {
  onImagePicked: (dataUrl: string) => void;
  children: React.ReactNode;
};

// TODO(profile-avatar-upload): integrate expo-image-picker on native and call
// onImagePicked with the picked image (or a URL after server upload).
function ImageUploader({ children, ...pressableProps }: ImageUploaderProps) {
  const { onImagePicked: _onImagePicked, ...rest } = pressableProps;
  return <Pressable {...rest}>{children}</Pressable>;
}

export { ImageUploader };
export type { ImageUploaderProps };
