import * as React from "react";
import Animated, {
  Easing,
  Extrapolation,
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
const AnimatedLine = Animated.createAnimatedComponent(Line);

const GRADIENT_ID = "qlinkSplashGrey";
// Reflects theme `gradPrimary`: hsl(220 9% 46%) -> hsl(220 9% 64%) -> hsl(220 13% 84%).
const GREY_STOPS = ["#6B7280", "#9BA0AB", "#D1D4DC"] as const;

const HUB = { x: 48, y: 48 };
const SAT_R = 5;
const HUB_R = 11;

const SATELLITES = [
  { cx: 16, cy: 20, delay: 50 },
  { cx: 80, cy: 24, delay: 150 },
  { cx: 14, cy: 74, delay: 250 },
  { cx: 78, cy: 78, delay: 350 },
] as const;

const EDGES = [
  { x2: 16, y2: 20, delay: 550 },
  { x2: 80, y2: 24, delay: 650 },
  { x2: 14, y2: 74, delay: 750 },
  { x2: 78, y2: 78, delay: 850 },
] as const;

const fill = `url(#${GRADIENT_ID})`;

function SatNode({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 700, easing: Easing.bezier(0.34, 1.4, 0.5, 1) }),
    );
  }, [delay, progress]);

  const animatedProps = useAnimatedProps(() => ({
    r: interpolate(progress.value, [0, 1], [SAT_R * 0.4, SAT_R]),
    opacity: interpolate(progress.value, [0, 0.5], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      fill={fill}
      animatedProps={animatedProps}
    />
  );
}

function EdgeLine({ x2, y2, delay }: { x2: number; y2: number; delay: number }) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }),
    );
  }, [delay, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(progress.value, [0, 1], [60, 0]),
    opacity: interpolate(progress.value, [0, 1], [0, 0.55]),
  }));

  return (
    <AnimatedLine
      x1={HUB.x}
      y1={HUB.y}
      x2={x2}
      y2={y2}
      stroke={fill}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeDasharray={60}
      animatedProps={animatedProps}
    />
  );
}

function HubNode() {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withDelay(
      950,
      withTiming(1, { duration: 600, easing: Easing.bezier(0.34, 1.56, 0.5, 1) }),
    );
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    r: interpolate(progress.value, [0, 1], [0, HUB_R]),
    opacity: interpolate(progress.value, [0, 0.4], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <AnimatedCircle
      cx={HUB.x}
      cy={HUB.y}
      fill={fill}
      animatedProps={animatedProps}
    />
  );
}

function PulseRing() {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withDelay(
      1200,
      withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.ease) }), -1, false),
    );
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    r: interpolate(progress.value, [0, 1], [12, 26]),
    opacity: interpolate(progress.value, [0, 1], [0.5, 0]),
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
      {EDGES.map((edge) => (
        <EdgeLine
          key={`edge-${edge.x2}-${edge.y2}`}
          x2={edge.x2}
          y2={edge.y2}
          delay={edge.delay}
        />
      ))}
      {SATELLITES.map((sat) => (
        <SatNode
          key={`sat-${sat.cx}-${sat.cy}`}
          cx={sat.cx}
          cy={sat.cy}
          delay={sat.delay}
        />
      ))}
      <HubNode />
    </Svg>
  );
}

export { SplashGlyph };
