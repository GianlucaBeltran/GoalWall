import { useNavigation } from "expo-router";
import { useContext } from "react";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

import { AppActionType, AppContext, AppDispatchContext } from "./_layout";
import ScreenView from "@/components/ScreenView";

import Avatars from "./constants/avatars";
// import CardView from "@/components/CardView";

export default function setGoals() {
  const navigation = useNavigation();
  const dispatch = useContext(AppDispatchContext);
  const appData = useContext(AppContext);

  return (
    <ScreenView title="Set your avatar">
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
            <Text style={{ fontSize: 16, fontWeight: 500, color: "#8A8787" }}>
              or choose
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.avatarsContainer}>
        {Avatars.map((avatar) => (
          <TouchableOpacity
            onPress={() => {
              if (!dispatch) return;
              dispatch({
                type: AppActionType.SET_EDITING_AVATAR,
                payload: avatar,
              });
              navigation.goBack();
            }}
            key={avatar.id}
            style={{
              opacity:
                appData?.editingData?.avatar?.image === avatar.image ? 0.5 : 1,
            }}
            disabled={appData?.editingData?.avatar?.image === avatar.image}
          >
            <Image
              source={avatar.image}
              style={{
                width: 75,
                height: 75,
                borderRadius: 75,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

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
