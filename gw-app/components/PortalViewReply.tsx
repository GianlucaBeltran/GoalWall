import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  LayoutChangeEvent,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import React, { Dispatch, useContext, useEffect, useState } from "react";
import { Portal } from "react-native-portalize";
import AvatarImage from "./AvatarImage";
import { getAvatar } from "@/app/constants/avatars";
import { formatedDate } from "@/app/helpers/dateFormating";
import SendSVG from "./svg/SendSVG";
import { Comment, Goal, SelectedItem } from "@/app/types/data.types";
import {
  AppActionType,
  AppContext,
  AppDispatchContext,
} from "@/app/context/appContext";

export default function PortalViewReply({
  selectedItem,
  setSelectedItem,
}: {
  selectedItem: SelectedItem | null;
  setSelectedItem: Dispatch<React.SetStateAction<SelectedItem | null>>;
}) {
  const [replyInput, setReplyInput] = useState("");

  const appData = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const handleSubmit = async () => {
    if (!replyInput || !dispatch) return;

    try {
      const newComment: Comment = {
        id: "",
        goalId: selectedItem?.isGoal
          ? selectedItem.item.id
          : (selectedItem?.item as Comment).goalId,
        authorId: appData?.user?.uid!,
        description: replyInput,
        createdAt: new Date().toISOString(),
        avatarFileName: appData?.user?.avatarFileName!,
        reactions: [],
      };

      const body = {
        comment: newComment,
        goalAuthorId: selectedItem?.item.authorId,
      };
      const response = await fetch(appData?.api + "/comment", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("handleSubmit data", data);

      if (data.error) {
        console.log("handleSubmit error", data.error);
        return;
      }

      const sortedGoals = data.goals.sort((a: Goal, b: Goal) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      dispatch({
        type: AppActionType.SET_SHARED_GOALS,
        payload: sortedGoals,
      });

      setSelectedItem(null);
      setReplyInput("");
    } catch (error) {
      console.log("handleSubmit error", error);
    }
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidHide", () => {
      setSelectedItem(null);
    });

    return () => {
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  return (
    <>
      {selectedItem && (
        <Portal>
          <TouchableWithoutFeedback onPress={() => setSelectedItem(null)}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={[
                styles.container,
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                },
              ]}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {!selectedItem.isGoal && (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      // top: itemCoordinates.y,
                      // left: itemCoordinates.x,
                      backgroundColor: "white",
                      marginLeft: 20,
                      marginRight: 20,
                      padding: 10,
                      borderRadius: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <AvatarImage
                        size={39}
                        avatarImage={
                          getAvatar(selectedItem.parentGoal?.avatarFileName)
                            ?.image
                        }
                        withShadow={false}
                      />

                      <View
                        style={{
                          flex: 1,
                          justifyContent: "space-between",
                          gap: 3,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: 700,
                              fontStyle: "italic",
                            }}
                          >
                            {selectedItem.parentGoal?.description}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#6E6E6E",
                            }}
                          >
                            {formatedDate(selectedItem.parentGoal?.createdAt)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    // top: itemCoordinates.y,
                    // left: itemCoordinates.x,
                    backgroundColor: "white",
                    marginLeft: 20,
                    marginRight: 20,
                    padding: 10,
                    borderRadius: 20,
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <AvatarImage
                      size={39}
                      avatarImage={
                        getAvatar(selectedItem.avatarFileName)?.image
                      }
                      withShadow={false}
                    />

                    <View
                      style={{
                        flex: 1,
                        justifyContent: "space-between",
                        gap: 3,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: selectedItem.isGoal ? 20 : 15,
                            fontWeight: selectedItem.isGoal ? 700 : 500,
                            fontStyle: selectedItem.isGoal
                              ? "italic"
                              : "normal",
                          }}
                        >
                          {selectedItem.item.description}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", gap: 10 }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#6E6E6E",
                          }}
                        >
                          {formatedDate(selectedItem.item.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    // top: itemCoordinates.y,
                    // left: itemCoordinates.x,
                    backgroundColor: "white",
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 10,
                    marginBottom: 10,
                    padding: 10,
                    borderRadius: 15,
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      gap: 10,
                      maxWidth: "100%",
                    }}
                    placeholder="Reply"
                    placeholderTextColor="#6E6E6E"
                    value={replyInput}
                    onChangeText={(text) => setReplyInput(text)}
                    autoFocus
                  />
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    disabled={!replyInput}
                  >
                    <SendSVG />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
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
