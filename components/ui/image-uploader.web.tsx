import * as React from "react";
import { Pressable, type PressableProps } from "react-native";

type ImageUploaderProps = Omit<PressableProps, "onPress"> & {
  onImagePicked: (dataUrl: string) => void;
  accept?: string;
  children: React.ReactNode;
};

// TODO(profile-avatar-upload): once the avatar upload API lands, swap the data-URL
// payload for an uploaded image URL and surface upload errors.
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
      // Reset so the same file can be picked again.
      event.target.value = "";
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onImagePicked(reader.result);
        }
      };
      reader.readAsDataURL(file);
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
