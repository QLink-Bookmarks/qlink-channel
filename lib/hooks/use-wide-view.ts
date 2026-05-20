import { useWindowDimensions } from "react-native";

const WIDE_VIEW_MIN_WIDTH = 768;

function useWideView() {
  const { width } = useWindowDimensions();

  return width >= WIDE_VIEW_MIN_WIDTH;
}

export { useWideView };
