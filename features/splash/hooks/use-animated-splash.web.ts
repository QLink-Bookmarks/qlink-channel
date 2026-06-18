// Web has no native splash to bridge, so skip the animated overlay entirely.
function useAnimatedSplash() {
  return { visible: false, animatedStyle: undefined };
}

export { useAnimatedSplash };
