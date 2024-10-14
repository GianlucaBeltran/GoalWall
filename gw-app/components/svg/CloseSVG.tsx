import Svg, { Path } from "react-native-svg";

export default function CloseSVG({
  width = 24,
  height = 24,
  stroke = "black",
}: {
  width?: number;
  height?: number;
  stroke?: string;
}) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        id="Vector"
        d="M15.5 15.5L5.5 5.5M15.5 5.5L5.5 15.5"
        stroke={stroke}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
