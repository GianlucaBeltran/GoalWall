import ChevronLeftSVG from "@/components/svg/ChevronLeftSVG";
import { useNavigation } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
// import CardView from "@/components/CardView";

export default function setGoals() {
  const navigation = useNavigation();

  const [avatar, setAvatar] = useState("");

  const avatars = [
    {
      id: "0",
      url: require("../assets/images/avatar1.png"),
    },
    {
      id: "1",
      url: require("../assets/images/avatar2.png"),
    },
    {
      id: "2",
      url: require("../assets/images/avatar3.png"),
    },
    {
      id: "3",
      url: require("../assets/images/avatar4.png"),
    },
    {
      id: "4",
      url: require("../assets/images/avatar5.png"),
    },
    {
      id: "5",
      url: require("../assets/images/avatar6.png"),
    },
    {
      id: "6",
      url: require("../assets/images/avatar7.png"),
    },
  ];

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            if (Keyboard.isVisible()) {
              Keyboard.dismiss();
            }
          }}
        >
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
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
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                Set your avatar
              </Text>
              <View style={{ width: 24, height: 24 }} />
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                // flex: 0.3,
              }}
            >
              <View style={styles.costumeAvatar}>
                <ImageBackground
                  source={require("../assets/images/costumeAvatar.png")}
                  style={{
                    width: 186.381,
                    height: 173,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 24, fontWeight: 600 }}>+</Text>
                  <Text style={{ fontSize: 16, fontWeight: 500 }}>
                    Create your own
                  </Text>
                </ImageBackground>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    borderWidth: 0.5,
                    borderColor: "#D0C8C8",
                    position: "absolute",
                  }}
                />
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 130,
                    backgroundColor: "white",
                  }}
                >
                  <Text
                    style={{ fontSize: 16, fontWeight: 500, color: "#8A8787" }}
                  >
                    or choose
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.avatarsContainer}>
              {avatars.map((avatar) => (
                // <View style={styles.avatar} key={avatar.id}>
                <TouchableOpacity
                  onPress={() => setAvatar(avatar.url)}
                  key={avatar.id}
                >
                  <Image
                    source={avatar.url}
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 75,
                      // overflow: "hidden",
                      // backgroundColor: "red",
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 50,
    padding: 20,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  costumeAvatar: {
    // width: "100%",
    // height: "100%",
    width: 173,
    height: 173,
    // backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 173,
    overflow: "hidden",
    marginBottom: 30,
  },
  avatarsContainer: {
    flex: 0.7,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "grey",
    gap: 30,
  },
  avatar: {
    width: 75,
    height: 75,
    // backgroundColor: "red",
    borderRadius: 75,
    overflow: "hidden",
  },
});
