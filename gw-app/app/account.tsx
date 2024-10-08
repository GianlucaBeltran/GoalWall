import AccountHeader from "@/components/AccountHeader";
import CardView from "@/components/CardView";
import ListComponent from "@/components/ListComponent";
import BackgroundSVG from "@/components/svg/BackgroundSVG";
import GoalSVG from "@/components/svg/GoalSVG";
import MembermshipSVG from "@/components/svg/MembershipSVG";
import { ThemeProvider } from "@react-navigation/native";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useEffect, useState } from "react";
import { ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  console.log(params, "params");

  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userUid, setUserUid] = useState("");

  useEffect(() => {
    console.log("In account useEffect");
    const fetchUser = async () => {
      const url = "http://130.229.169.183:3000/user/" + params.userId;
      console.log(url);
      try {
        const response = await fetch(url, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json, "In account");
        if (json.status === "user found") {
          console.log(json.user, "user");
          setUserName(json.user.name);
          setLastName(json.user.lastName);
          setUserUid(json.user.uid);
          // setError(json.message);
        }
        console.log(json);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      resizeMode="cover"
      style={{ flex: 1, justifyContent: "center" }}
    >
      <SafeAreaView edges={["top"]}>
        {/* {userName && lastName && userUid && ( */}
        <CardView
          topNavigationHeader="Account"
          topSectionComponent={
            <AccountHeader
              userName={userName}
              lastName={lastName}
              userUid={userUid}
            />
          }
        >
          <ListComponent
            data={[
              {
                id: "1",
                header: "Membership",
                clickable: true,
                navigation: "/goal",
                svg: <MembermshipSVG />,
              },
              {
                id: "2",
                header: "Set your goals",
                clickable: true,
                navigation: "/setGoals",
                svg: <GoalSVG />,
              },
            ]}
          />
        </CardView>
        {/* )} */}
      </SafeAreaView>
    </ImageBackground>
  );
}
