import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Dispatch, useContext, useEffect, useState } from "react";
import { Portal } from "react-native-portalize";

import { BlurView } from "expo-blur";

import {
  AppActionType,
  AppContext,
  AppDispatchContext,
} from "@/app/context/appContext";
import AvatarPicker from "./AvatarPicker";

export default function PortalViewAvatars({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useContext(AppDispatchContext);
  const appData = useContext(AppContext);

  const [avatars, setAvatars] = useState<string[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  const handleAvatarSelection = async (avatar: string) => {
    if (!dispatch) return;

    if (appData?.user?.avatarFileName === avatar) return;
    try {
      const body = {
        avatarFileName: avatar,
      };
      const response = await fetch(
        appData?.api + "/user/setAvatar/" + appData?.user?.uid,
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
              style={[
                styles.container,
                { justifyContent: "center", alignItems: "center", padding: 20 },
              ]}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flex: 0.5,
                  backgroundColor: "white",
                  borderRadius: 20,
                }}
              >
                <AvatarPicker handleAvatarSelection={handleAvatarSelection} />
              </TouchableOpacity>
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
