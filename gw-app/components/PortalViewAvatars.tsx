import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { Dispatch, useContext } from "react";
import { Portal } from "react-native-portalize";

import { BlurView } from "expo-blur";

import {
  AppActionType,
  AppContext,
  AppDispatchContext,
} from "@/app/context/appContext";
import { AvatarButton } from "@/app/avatar";
import Avatars from "@/app/constants/avatars";
import { Avatar } from "@/app/types/avatar.types";

export default function PortalViewAvatars({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useContext(AppDispatchContext);
  const appData = useContext(AppContext);

  const handleAvatarSelection = async (avatar: Avatar) => {
    if (!dispatch) return;

    if (appData?.user?.avatarFileName === avatar.fileName) return;
    try {
      const body = {
        avatarFileName: avatar.fileName,
      };
      const response = await fetch(
        appData?.api + "/setAvatar/" + appData?.user?.uid,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      dispatch({
        type: AppActionType.SET_USER,
        payload: data.user,
      });

      setEnabled(false);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <>
      {enabled && (
        <Portal>
          <BlurView style={styles.container} intensity={60}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setEnabled(false)}
              style={[styles.container]}
            >
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
                      callBack={() => handleAvatarSelection(avatar)}
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
                      callBack={() => handleAvatarSelection(avatar)}
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
                      callBack={() => handleAvatarSelection(avatar)}
                    />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          </BlurView>
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
});
