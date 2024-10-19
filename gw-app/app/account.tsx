import AccountHeader from "@/components/AccountHeader";
import CardView from "@/components/CardView";
import ListComponent from "@/components/ListComponent";
import GoalSVG from "@/components/svg/GoalSVG";
import MembermshipSVG from "@/components/svg/MembershipSVG";
import { useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { ImageBackground } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "./context/appContext";

export default function Home() {
  const navigation = useNavigation();

  const appData = useContext(AppContext);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ImageBackground
      source={appData?.api + "/user/background/" + "background.png"}
      contentFit="cover"
      style={{ flex: 1, justifyContent: "center" }}
    >
      <SafeAreaView edges={["top"]}>
        <CardView
          topNavigationHeader="Account"
          topSectionComponent={
            <AccountHeader
              userName={appData?.user?.name ? appData?.user?.name : ""}
              lastName={appData?.user?.lastName ? appData?.user?.lastName : ""}
              userUid={
                appData?.user?.userNumber
                  ? appData?.user?.userNumber.toString()
                  : " unknown"
              }
            />
          }
        >
          <ListComponent
            data={[
              {
                id: "1",
                header: "Membership",
                clickable: true,
                svg: <MembermshipSVG />,
              },
              {
                id: "2",
                header: "Set your goals",
                clickable: true,
                navigation: "/mainMenu",
                svg: <GoalSVG stroke="black" />,
              },
            ]}
          />
        </CardView>
      </SafeAreaView>
    </ImageBackground>
  );
}
