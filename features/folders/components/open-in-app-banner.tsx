type OpenInAppBannerProps = {
  token?: string | null;
  folderId?: string | null;
};

// Native already runs inside the app — nothing to prompt.
function OpenInAppBanner(_props: OpenInAppBannerProps) {
  return null;
}

export { OpenInAppBanner };
export type { OpenInAppBannerProps };
