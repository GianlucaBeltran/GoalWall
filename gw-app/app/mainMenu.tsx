import ListComponent from "@/components/ListComponent";
import ScreenView from "@/components/ScreenView";
import OthersSVG from "@/components/svg/OthersSVG";
import ShareSVG from "@/components/svg/ShareSVG";
import WriteSVG from "@/components/svg/WriteSVG";
import { useContext, useEffect, useState } from "react";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { AppContext } from "./context/appContext";
import ChevronRightSVG from "@/components/svg/ChevronRightSVG";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

export default function mainMenu() {
  const appData = useContext(AppContext);

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  }

  useEffect(() => {
    changeScreenOrientation();
  }, []);

  return (
    <ScreenView title="">
      <ImageBackground
        source={require("../assets/images/background.png")}
        style={{
          borderRadius: 20,
          overflow: "hidden",
          marginTop: 20,
          marginBottom: 40,
        }}
      >
        <TouchableOpacity
          style={styles.goalWallButton}
          onPress={() => {
            router.navigate("/goalWall");
          }}
        >
          <View style={{ width: 24 }} />
          <View style={{ alignItems: "center", gap: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: 600 }}>
              Live view of the
            </Text>
            <Text style={{ fontSize: 32, fontWeight: 700 }}>Goal Wall</Text>
          </View>
          <View>
            <ChevronRightSVG />
          </View>
        </TouchableOpacity>
      </ImageBackground>
      <ListComponent
        data={[
          {
            id: "1",
            header: "Write a new goal",
            clickable: true,
            navigation: appData?.user?.avatarFileName
              ? "/writeGoal"
              : "/avatar",
            svg: <WriteSVG />,
          },
          {
            id: "2",
            header: "My shared goals",
            clickable: true,
            navigation: "/sharedGoals",
            svg: <ShareSVG />,
          },
          {
            id: "3",
            header: "See other members' goals",
            clickable: true,
            navigation: "/othersGoals",
            svg: <OthersSVG />,
          },
        ]}
      />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  goalWallButton: {
    width: "100%",
    height: 200,
    gap: 10,
    // backgroundColor: "grey",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 20,
    padding: 40,
  },
});
