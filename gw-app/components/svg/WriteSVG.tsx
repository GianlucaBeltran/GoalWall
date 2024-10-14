import Svg, { Path } from "react-native-svg";

export default function WriteSVG({ stroke = "black" }: { stroke?: string }) {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24">
      <Path
        id="Vector"
        d="M7.72 16.456L9.481 15.948L20.084 5.218C20.1676 5.1323 20.2142 5.01713 20.2136 4.89738C20.2131 4.77764 20.1654 4.66291 20.081 4.578L19.446 3.936C19.405 3.89384 19.3559 3.86027 19.3018 3.83726C19.2477 3.81424 19.1895 3.80225 19.1306 3.80197C19.0718 3.80169 19.0135 3.81313 18.9591 3.83563C18.9048 3.85813 18.8554 3.89123 18.814 3.933L8.239 14.635L7.72 16.456ZM20.703 2.664L21.338 3.307C22.214 4.194 22.222 5.625 21.354 6.503L10.428 17.561L6.664 18.645C6.55021 18.677 6.43123 18.6862 6.31386 18.6722C6.1965 18.6582 6.08303 18.6213 5.97996 18.5634C5.87688 18.5056 5.78621 18.428 5.71313 18.3351C5.64004 18.2422 5.58597 18.1358 5.554 18.022C5.50496 17.857 5.50426 17.6814 5.552 17.516L6.647 13.676L17.544 2.647C17.7512 2.43836 17.9979 2.27306 18.2696 2.16075C18.5414 2.04844 18.8328 1.99137 19.1269 1.99286C19.4209 1.99435 19.7117 2.05437 19.9823 2.16943C20.2529 2.28448 20.4979 2.45327 20.703 2.664ZM9.184 3.817C9.68 3.817 10.082 4.224 10.082 4.726C10.0828 4.84467 10.0602 4.96233 10.0155 5.07225C9.97076 5.18218 9.90481 5.28221 9.82141 5.36663C9.73801 5.45105 9.63879 5.51821 9.52942 5.56426C9.42004 5.61031 9.30267 5.63434 9.184 5.635H5.592C4.6 5.635 3.796 6.449 3.796 7.452V18.358C3.796 19.362 4.6 20.176 5.592 20.176H16.368C17.36 20.176 18.165 19.362 18.165 18.358V14.723C18.165 14.221 18.567 13.814 19.063 13.814C19.559 13.814 19.961 14.221 19.961 14.724V18.358C19.961 20.366 18.352 21.994 16.368 21.994H5.592C3.608 21.994 2 20.366 2 18.358V7.452C2 5.445 3.608 3.817 5.592 3.817H9.184Z"
        fill={stroke}
      />
    </Svg>
  );
}
