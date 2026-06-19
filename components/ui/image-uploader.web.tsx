import * as React from "react";
import { Pressable, type PressableProps } from "react-native";

import type { ImageUploadInput } from "@/features/images/types";

type ImageUploaderProps = Omit<PressableProps, "onPress"> & {
  onImagePicked: (file: ImageUploadInput) => void;
  accept?: string;
  children: React.ReactNode;
};

function ImageUploader({
  children,
  onImagePicked,
  accept = "image/*",
  ...pressableProps
}: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handlePress = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) {
        return;
      }
      onImagePicked(file);
    },
    [onImagePicked],
  );

  return (
    <>
      <Pressable
        {...pressableProps}
        onPress={handlePress}
      >
        {children}
      </Pressable>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </>
  );
}

export { ImageUploader };
export type { ImageUploaderProps };
