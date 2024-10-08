import ListComponent from "@/components/ListComponent";
import ChevronLeftSVG from "@/components/svg/ChevronLeftSVG";
import OthersSVG from "@/components/svg/OthersSVG";
import ShareSVG from "@/components/svg/ShareSVG";
import WriteSVG from "@/components/svg/WriteSVG";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
// import CardView from "@/components/CardView";

export default function setGoals() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 24,
                height: 24,

                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ChevronLeftSVG />
            </TouchableOpacity>
          </View>
          <ImageBackground
            source={require("../assets/images/background.png")}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              marginTop: 20,
              marginBottom: 40,
            }}
          >
            <View style={styles.goalWallButton}>
              <Text style={{ fontSize: 32, fontWeight: 700 }}>Goal Wall</Text>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20 }}>Set your goal</Text>
                <Text style={{ fontSize: 20 }}>Share it on the wall</Text>
              </View>
            </View>
          </ImageBackground>
          <ListComponent
            data={[
              {
                id: "1",
                header: "Write a new goal",
                clickable: true,
                navigation: "/writeGoal",
                svg: <WriteSVG />,
              },
              {
                id: "2",
                header: "See your shared goals",
                clickable: true,
                navigation: "/setGoals",
                svg: <ShareSVG />,
              },
              {
                id: "3",
                header: "See other members' goals",
                clickable: true,
                navigation: "/setGoals",
                svg: <OthersSVG />,
              },
            ]}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "white",
    marginTop: 50,
    padding: 20,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  goalWallButton: {
    width: "100%",
    height: 200,
    // backgroundColor: "grey",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 20,
  },
});
