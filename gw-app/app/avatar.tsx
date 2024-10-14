import { router, useNavigation } from "expo-router";
import { Dispatch, useContext } from "react";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

import {
  AppAction,
  AppActionType,
  AppContext,
  AppDispatchContext,
} from "./context/appContext";
import ScreenView from "@/components/ScreenView";

import Avatars from "./constants/avatars";
import { Avatar } from "./types/avatar.types";

export function AvatarButton({
  dispatch,
  avatar,
  appDataAvatar,
  callBack,
}: {
  dispatch: Dispatch<AppAction> | null;
  avatar: Avatar;
  appDataAvatar: Avatar | null | undefined;
  callBack?: () => Promise<void>;
}) {
  const appData = useContext(AppContext);

  const handeSelectAvatar = (avatar: Avatar) => {
    if (!dispatch) return;

    if (callBack) {
      callBack();
      return;
    }

    dispatch({
      type: AppActionType.SET_EDITING_AVATAR,
      payload: avatar,
    });
    router.navigate("/writeGoal");
  };
  return (
    <TouchableOpacity
      activeOpacity={
        appData?.user?.avatarFileName === avatar.fileName ? 1 : 0.6
      }
      onPress={() => {
        handeSelectAvatar(avatar);
      }}
      key={avatar.id}
      disabled={appDataAvatar?.id === avatar.id}
    >
      <Image
        source={avatar.image}
        style={{
          width: 75,
          height: 75,
          borderRadius: 75,
          borderColor:
            appDataAvatar?.id === avatar.id ||
            appData?.user?.avatarFileName === avatar.fileName
              ? "black"
              : "",
          borderWidth:
            appDataAvatar?.id === avatar.id ||
            appData?.user?.avatarFileName === avatar.fileName
              ? 2
              : 0,
          opacity:
            appDataAvatar?.id === avatar.id ||
            appData?.user?.avatarFileName === avatar.fileName
              ? 0.6
              : 1,
        }}
      />
    </TouchableOpacity>
  );
}

export default function avatar() {
  const navigation = useNavigation();
  const dispatch = useContext(AppDispatchContext);
  const appData = useContext(AppContext);

  const isEditing =
    appData?.user?.avatarFileName || appData?.editingData?.avatar?.fileName;

  return (
    <ScreenView title={isEditing ? "Change avatar" : "Set your avatar"}>
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
        }}
      >
        <View style={styles.avatarsContainer}>
          {Avatars.slice(0, 2).map((avatar) => (
            <AvatarButton
              key={avatar.id}
              dispatch={dispatch}
              avatar={avatar}
              appDataAvatar={appData?.editingData?.avatar}
            />
          ))}
        </View>
        <View style={styles.avatarsContainer}>
          {Avatars.slice(2, 5).map((avatar) => (
            <AvatarButton
              key={avatar.id}
              dispatch={dispatch}
              avatar={avatar}
              appDataAvatar={appData?.editingData?.avatar}
            />
          ))}
        </View>
        <View style={styles.avatarsContainer}>
          {Avatars.slice(5, 7).map((avatar) => (
            <AvatarButton
              key={avatar.id}
              dispatch={dispatch}
              avatar={avatar}
              appDataAvatar={appData?.editingData?.avatar}
            />
          ))}
        </View>
      </View>
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
  avatarsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
