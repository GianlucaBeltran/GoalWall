import AccountHeader from "@/components/AccountHeader";
import BackgroundImage from "@/components/BacgkroundImage";
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
      <BackgroundImage />
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
