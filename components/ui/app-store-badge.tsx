type AppStoreBadgeProps = {
  className?: string;
};

// The badge is a web-only download prompt — inside the native app there is
// nothing to download.
function AppStoreBadge(_props: AppStoreBadgeProps) {
  return null;
}

export { AppStoreBadge };
export type { AppStoreBadgeProps };
