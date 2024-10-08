import ListComponent from "@/components/ListComponent";
import ScreenView from "@/components/ScreenView";
import OthersSVG from "@/components/svg/OthersSVG";
import ShareSVG from "@/components/svg/ShareSVG";
import WriteSVG from "@/components/svg/WriteSVG";
import { useContext } from "react";
import { ImageBackground, Text, StyleSheet, View } from "react-native";
import { AppContext } from "./_layout";

export default function setGoals() {
  const appData = useContext(AppContext);
  console.log(appData?.editingData?.avatar, "avatar");

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
            navigation: "/sharedGoals",
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
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  goalWallButton: {
    width: "100%",
    height: 200,
    // backgroundColor: "grey",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 20,
  },
});
