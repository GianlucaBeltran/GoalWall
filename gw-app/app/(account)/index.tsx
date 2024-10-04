import AccountHeader from "@/components/AccountHeader";
import CardView from "@/components/CardView";
import ListComponent from "@/components/ListComponent";
import BackgroundSVG from "@/components/svg/BackgroundSVG";
import { ThemeProvider } from "@react-navigation/native";
import { Stack, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View>
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
      <SafeAreaView edges={["top"]}>
        <CardView
          topNavigationHeader="Account"
          topSectionComponent={<AccountHeader />}
        >
          <ListComponent
            data={[
              { id: "1", header: "Membership", clickable: true },
              {
                id: "2",
                header: "Goals",
                clickable: true,
                navigation: "(goal)",
              },
            ]}
          />
        </CardView>
      </SafeAreaView>
    </View>
  );
}
