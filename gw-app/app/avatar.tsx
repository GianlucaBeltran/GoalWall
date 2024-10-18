import { useContext } from "react";
import { ImageBackground, Text, StyleSheet, View } from "react-native";

import {
  AppActionType,
  AppContext,
  AppDispatchContext,
} from "./context/appContext";
import ScreenView from "@/components/ScreenView";

import AvatarPicker from "@/components/AvatarPicker";
import { router } from "expo-router";

export default function avatar() {
  const appData = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const isEditing =
    appData?.user?.avatarFileName || appData?.editingData?.avatar;

  const handeSelectAvatar = (avatar: string) => {
    if (!dispatch) return;

    dispatch({
      type: AppActionType.SET_EDITING_AVATAR,
      payload: avatar,
    });
    router.navigate("/writeGoal");
  };

  return (
    <ScreenView
      title={isEditing ? "Change avatar" : "Set your avatar"}
      touchableWithoutFeedback={false}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ width: "70%" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 400,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Goals are shared anonymously, so choose an avatar to help identify
            your goal on the wall.
          </Text>
        </View>
        <View style={styles.costumeAvatar}>
          <ImageBackground
            source={require("../assets/images/costumeAvatar.png")}
            style={{
              width: 110,
              height: 110,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 600 }}>+</Text>
            <Text style={{ fontSize: 12, fontWeight: 500 }}>
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
            <Text style={{ fontSize: 16, fontWeight: 500, color: "#8A8787" }}>
              or choose
            </Text>
          </View>
        </View>
      </View>
      <AvatarPicker handleAvatarSelection={handeSelectAvatar} />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  costumeAvatar: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 173,
    overflow: "hidden",
    marginBottom: 30,
  },
});
