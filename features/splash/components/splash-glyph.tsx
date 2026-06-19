import * as React from "react";
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Line,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const GRADIENT_ID = "qlinkSplashGrey";
const GREY_STOPS = ["#6B7280", "#9BA0AB", "#D1D4DC"] as const;

const HUB = { x: 48, y: 48 };
const SAT_R = 5;
const HUB_R = 11;

const SATELLITES = [
  { cx: 16, cy: 20 },
  { cx: 80, cy: 24 },
  { cx: 14, cy: 74 },
  { cx: 78, cy: 78 },
] as const;

const fill = `url(#${GRADIENT_ID})`;

function PulseRing() {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withDelay(
      900,
      withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) }), -1, false),
    );
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    r: interpolate(progress.value, [0, 1], [HUB_R, 26]),
    opacity: interpolate(progress.value, [0, 1], [0.45, 0]),
  }));

  return (
    <AnimatedCircle
      cx={HUB.x}
      cy={HUB.y}
      fill="none"
      stroke={fill}
      strokeWidth={2}
      animatedProps={animatedProps}
    />
  );
}

function SplashGlyph({ size = 128 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
    >
      <Defs>
        <SvgLinearGradient
          id={GRADIENT_ID}
          x1="8"
          y1="8"
          x2="88"
          y2="88"
          gradientUnits="userSpaceOnUse"
        >
          <Stop
            offset="0"
            stopColor={GREY_STOPS[0]}
          />
          <Stop
            offset="0.5"
            stopColor={GREY_STOPS[1]}
          />
          <Stop
            offset="1"
            stopColor={GREY_STOPS[2]}
          />
        </SvgLinearGradient>
      </Defs>
      <PulseRing />
      {SATELLITES.map((sat) => (
        <Line
          key={`edge-${sat.cx}-${sat.cy}`}
          x1={HUB.x}
          y1={HUB.y}
          x2={sat.cx}
          y2={sat.cy}
          stroke={fill}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.55}
        />
      ))}
      {SATELLITES.map((sat) => (
        <Circle
          key={`sat-${sat.cx}-${sat.cy}`}
          cx={sat.cx}
          cy={sat.cy}
          r={SAT_R}
          fill={fill}
        />
      ))}
      <Circle
        cx={HUB.x}
        cy={HUB.y}
        r={HUB_R}
        fill={fill}
      />
    </Svg>
  );
}

export { SplashGlyph };
