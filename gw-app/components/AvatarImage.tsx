import { View, Image, ImageSourcePropType } from "react-native";

export default function AvatarImage({
  avatarImage,
  size,
  withShadow = true,
}: {
  avatarImage: ImageSourcePropType;
  size: number;
  withShadow?: boolean;
}) {
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
        source={avatarImage}
        style={{
          width: size,
          height: size,
          borderRadius: size,
        }}
      />
    </View>
  );
}
