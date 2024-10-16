import { Text, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Portal } from "react-native-portalize";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  AppActionType,
  AppContext,
  AppDispatchContext,
} from "@/app/context/appContext";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import AvatarImage from "./AvatarImage";
import { getAvatar } from "@/app/constants/avatars";

export default function PortalViewNotifications() {
  const dispatch = useContext(AppDispatchContext);
  const appData = useContext(AppContext);

  const [animationState, setAnimationState] = useState<
    "not started" | "coming down" | "coming up" | "done"
  >("not started");

  const safeArea = useSafeAreaInsets();

  const position = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: position.value }],
      position: "absolute",
      height: 50,
      width: "90%",
      backgroundColor: "black",
      opacity: 0.5,
      // justifyContent: "center",
      flexDirection: "row",
      // alignItems: "center",
      gap: 10,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 15,
      padding: 10,
    };
  });

  useEffect(() => {
    if (appData?.notifications?.length) {
      position.value = withTiming(
        safeArea?.top - 10 || 0,
        {
          duration: 700,
        },
        (finished) => {
          if (!dispatch) return;
          if (!finished) return;
          runOnJS(setAnimationState)("coming down");
        }
      );
    }
  }, [appData?.notifications]);

  useEffect(() => {
    if (animationState === "coming down") {
      if (!dispatch) return;
      setTimeout(() => {
        position.value = withTiming(
          -50,
          {
            duration: 700,
          },
          (finished) => {
            if (!finished) return;
            runOnJS(setAnimationState)("done");
          }
        );
      }, 5000);
    } else if (animationState === "done") {
      if (!dispatch) return;

      dispatch({ type: AppActionType.POP_NOTIFICATION, payload: null });
    }
  }, [animationState]);

  const getNotiTittle = () => {
    switch (appData?.notifications[0].type) {
      case "message":
        return (
          appData?.notifications[0].data.name +
          " " +
          appData?.notifications[0].data.lastName
        );
      case "messageRequest":
        return (
          "Message request: " +
          appData?.notifications[0].data.name +
          " " +
          appData?.notifications[0].data.lastName
        );
      case "messageRequestAccepted":
        return "Message request accepted";
      case "comment":
        return "New Comment";
      case "reaction":
        return "New Reaction";
    }
  };

  return (
    <>
      {appData?.notifications && appData.notifications.length > 0 && (
        <Portal>
          <SafeAreaView
            edges={["top"]}
            style={{
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                router.navigate("/messages");
              }}
              key={appData.notifications[0].data.id}
            >
              <Animated.View style={[animatedStyle]}>
                <AvatarImage
                  size={30}
                  avatarImage={
                    getAvatar(appData.notifications[0].data.avatarFileName)
                      ?.image
                  }
                />
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <Text style={{ fontSize: 12, color: "white" }}>
                    {getNotiTittle()}
                  </Text>
                  <Text style={{ color: "white" }} numberOfLines={1}>
                    {appData?.notifications[0].data.message}
                  </Text>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </Portal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
