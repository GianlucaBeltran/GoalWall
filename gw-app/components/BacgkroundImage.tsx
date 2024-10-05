import { ImageBackground } from "react-native";
import BackgroundSVG from "./svg/BackgroundSVG";

export default function BackgroundImage() {
  return (
    <ImageBackground
      style={{
        height: "100%",
        width: "100%",
        flex: 1,
        position: "absolute",
      }}
    >
      {/* <BlurView
          intensity={50}
          style={{ position: "absolute", height: "100%", width: "100%" }}
          tint="systemChromeMaterial"
        > */}
      <BackgroundSVG />
      {/* </BlurView> */}
    </ImageBackground>
  );
}
