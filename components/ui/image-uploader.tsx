import * as React from "react";
import { Pressable, type PressableProps } from "react-native";

import type { ImageUploadInput } from "@/features/images/types";

import * as ImagePicker from "expo-image-picker";

type ImageUploaderProps = Omit<PressableProps, "onPress"> & {
  onImagePicked: (file: ImageUploadInput) => void;
  accept?: string;
  children: React.ReactNode;
};

function ImageUploader({
  children,
  onImagePicked,
  accept: _accept,
  ...pressableProps
}: ImageUploaderProps) {
  const handlePress = React.useCallback(async () => {
    // iOS/Android use the system PHPicker, which runs out-of-process and needs no
    // photo-library permission prompt.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) {
      return;
    }
    const asset = result.assets[0];
    if (!asset) {
      return;
    }
    const type = asset.mimeType ?? "image/jpeg";
    const name = asset.fileName ?? `avatar.${type.split("/")[1] ?? "jpg"}`;
    onImagePicked({ uri: asset.uri, name, type });
  }, [onImagePicked]);

  return (
    <Pressable
      {...pressableProps}
      onPress={handlePress}
    >
      {children}
    </Pressable>
  );
}

export { ImageUploader };
export type { ImageUploaderProps };
