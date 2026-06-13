type HslTuple = readonly [number, number, number];

function parseHslString(value: string): HslTuple {
  const match = value.match(/hsl\(\s*([0-9.]+)\s+([0-9.]+)%\s+([0-9.]+)%\s*\)/i);
  if (!match) return [0, 0, 0];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function formatHsl(value: HslTuple): string {
  const [h, s, l] = value;
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpHsl(a: string, b: string, t: number): string {
  const [ha, sa, la] = parseHslString(a);
  const [hb, sb, lb] = parseHslString(b);
  let dh = hb - ha;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return formatHsl([(ha + dh * t + 360) % 360, lerp(sa, sb, t), lerp(la, lb, t)]);
}

export { lerpHsl };
