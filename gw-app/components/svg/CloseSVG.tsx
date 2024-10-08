import Svg, { Path } from "react-native-svg";

export default function CloseSVG() {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24">
      <Path
        id="Vector"
        d="M15.5 15.5L5.5 5.5M15.5 5.5L5.5 15.5"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
