import { AppContext } from "@/app/context/appContext";
import { useContext } from "react";
import { View, Image, ImageSourcePropType } from "react-native";

export default function AvatarImage({
  avatarImage,
  size,
  withShadow = true,
}: {
  avatarImage: string;
  size: number;
  withShadow?: boolean;
}) {
  const appData = useContext(AppContext);

  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: withShadow ? 0.25 : 0,
        shadowRadius: withShadow ? 3.84 : 0,
        elevation: withShadow ? 5 : 0,
      }}
    >
      <Image
        source={{ uri: appData?.api + "/user/avatar/" + avatarImage }}
        style={{
          width: size,
          height: size,
          borderRadius: size,
        }}
      />
    </View>
  );
}
