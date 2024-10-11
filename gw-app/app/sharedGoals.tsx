import { router, useNavigation } from "expo-router";
import { useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

import ScreenView from "@/components/ScreenView";
import ExclamationSVG from "@/components/svg/ExclamationSVG";
import GoalSVG from "@/components/svg/GoalSVG";
import WriteSVG from "@/components/svg/WriteSVG";
import { AppActionType, AppContext, AppDispatchContext } from "./_layout";
import { getAvatar } from "./constants/avatars";
import EditSVG from "@/components/svg/EditSVG";
import CloseSVG from "@/components/svg/CloseSVG";
import { Goal } from "./types/goal.types";

export default function sharedGoals() {
  const navigation = useNavigation();

  const appData = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const handleEdit = (goal: Goal) => {
    if (!dispatch) return;
    console.log(goal.avatarFileName, "avatarFileName");
    dispatch({
      type: AppActionType.SET_EDITING_GOAL,
      payload: goal,
    });
    dispatch({
      type: AppActionType.SET_EDITING_AVATAR,
      payload: getAvatar(goal.avatarFileName),
    });

    router.navigate("/writeGoal");
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!appData || !appData.user) return;

    if (!dispatch) return;

    const requestBody = {
      goalId: goalId,
      userId: appData.user.uid,
    };

    console.log(requestBody, "requestBody");

    try {
      const response = await fetch(appData.api + "/goal", {
        method: "DELETE",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const user = await response.json();
      dispatch({
        type: AppActionType.SET_USER,
        payload: user.user,
      });
      dispatch({
        type: AppActionType.RESET_EDITING,
        payload: null,
      });
      return;
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <ScreenView title="Your shared goals">
      {appData?.user?.goals && appData.user?.goals.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 0.3 }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <ExclamationSVG />
              <GoalSVG width={92} height={92} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: 500 }}>
              You have no shared goals yet
            </Text>
          </View>
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => router.navigate("/writeGoal")}
          >
            <View
              style={{
                height: 74,
                width: "100%",
                borderColor: "#0A7E84",
                borderRadius: 15,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <WriteSVG />
              <Text style={{ fontSize: 20, fontWeight: 500, marginLeft: 8 }}>
                Share a new goal
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {appData?.user?.goals?.length !== 0 && (
        <View style={{ flex: 1, justifyContent: "space-evenly", gap: 20 }}>
          <View
            style={{
              flex: 0.2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GoalSVG width={90} height={90} />
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={appData?.user?.goals}
              renderItem={({ item }) => {
                const avatar = getAvatar(item.avatarFileName);
                return (
                  <View
                    style={{
                      width: "100%",
                      //   height: 50,
                      flexDirection: "row",
                      paddingTop: 10,
                      paddingBottom: 10,
                      gap: 10,
                      borderBottomWidth: 0.5,
                      borderColor: "#D0C8C8",
                    }}
                  >
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 50,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={avatar?.image}
                        style={{ width: 50, height: 50 }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "space-between",
                          flex: 1,
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16 }}>
                            {item.description}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            // flex: 1,
                            gap: 10,
                          }}
                        >
                          <TouchableOpacity onPress={() => handleEdit(item)}>
                            <EditSVG />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              handleDeleteGoal(item.id);
                            }}
                          >
                            <CloseSVG width={28} height={28} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 300,
                          textAlign: "right",
                        }}
                      >
                        {new Date(item.createdAt).toDateString()}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      )}
    </ScreenView>
  );
}

const styles = StyleSheet.create({});
