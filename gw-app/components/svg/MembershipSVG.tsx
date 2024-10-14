import Svg, { Path } from "react-native-svg";

export default function MembermshipSVG() {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24">
      <Path
        id="Vector"
        d="M22 12C22 8.229 22 6.343 20.828 5.172C19.656 4.001 17.771 4 14 4H10C6.229 4 4.343 4 3.172 5.172C2.001 6.344 2 8.229 2 12C2 15.771 2 17.657 3.172 18.828C4.344 19.999 6.229 20 10 20H14C17.771 20 19.657 20 20.828 18.828C21.482 18.175 21.771 17.3 21.898 16M10 16H6M14 16H12.5M2 10H7M22 10H11"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </Svg>
  );
}
