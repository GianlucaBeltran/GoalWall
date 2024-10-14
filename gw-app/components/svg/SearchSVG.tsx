import Svg, { Path } from "react-native-svg";

export default function SearchSVG() {
  return (
    <Svg width={21} height={21} fill="none" viewBox="0 0 21 21">
      <Path
        id="Vector"
        d="M14.875 14.875L18.375 18.375M2.625 9.625C2.625 11.4815 3.3625 13.262 4.67525 14.5747C5.98801 15.8875 7.76848 16.625 9.625 16.625C11.4815 16.625 13.262 15.8875 14.5747 14.5747C15.8875 13.262 16.625 11.4815 16.625 9.625C16.625 7.76848 15.8875 5.98801 14.5747 4.67525C13.262 3.3625 11.4815 2.625 9.625 2.625C7.76848 2.625 5.98801 3.3625 4.67525 4.67525C3.3625 5.98801 2.625 7.76848 2.625 9.625Z"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
