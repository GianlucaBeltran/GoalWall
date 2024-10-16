import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  LayoutChangeEvent,
} from "react-native";
import React, { Dispatch, useContext, useEffect, useState } from "react";
import { Portal } from "react-native-portalize";
// import { BlurView } from "@react-native-community/blur";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import AvatarImage from "./AvatarImage";
import { getAvatar } from "@/app/constants/avatars";
import { formatedDate } from "@/app/helpers/dateFormating";
import EditSVG from "./svg/EditSVG";
import CloseSVG from "./svg/CloseSVG";
import SendSVG from "./svg/SendSVG";
import ExclamationSVG from "./svg/ExclamationSVG";
import {
  Chat,
  Comment,
  Goal,
  Reaction,
  SelectedItem,
} from "@/app/types/data.types";
import { router } from "expo-router";
import {
  AppActionType,
  AppContext,
  AppDispatchContext,
  ChatData,
} from "@/app/context/appContext";

const reactionOptions: { id: string; icon: "❤️" | "👏" | "💪" | "🔥" }[] = [
  {
    id: "0",
    icon: "❤️",
  },
  {
    id: "1",
    icon: "👏",
  },
  {
    id: "2",
    icon: "💪",
  },
  {
    id: "3",
    icon: "🔥",
  },
];

const ownedActionOptions = [
  {
    title: "Edit",
    icon: <EditSVG />,
    tint: "#000",
  },
  {
    title: "Delete",
    icon: <CloseSVG width={30} height={30} stroke="red" />,
    tint: "red",
  },
];

const actionOptions = [
  {
    title: "Send message request",
    icon: <SendSVG />,
    tint: "#000",
  },
  {
    title: "Report",
    icon: <ExclamationSVG height={30} width={30} stroke="red" />,
    tint: "red",
  },
];

export default function PortalViewPost({
  selectedItem,
  itemCoordinates,
  setSelectedItem,
}: {
  selectedItem: SelectedItem | null;
  itemCoordinates: { x: number; y: number };
  setSelectedItem: Dispatch<React.SetStateAction<SelectedItem | null>>;
}) {
  const dispatch = useContext(AppDispatchContext);
  const appData = useContext(AppContext);

  const [reaction, setReaction] = useState({ id: "", icon: "" });
  const [hasChatWithUser, setHasChatWithUser] = useState(false);
  const [postDimensions, setPostDimensions] = useState({ width: 0, height: 0 });
  const [actionMenuDimensions, setActionMenuDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [reactionDimensions, setReactionDimensions] = useState({
    width: 0,
    height: 0,
  });

  const actionOverflow = itemCoordinates.y + 300 > useWindowDimensions().height;

  const actionMenuCoordinatesY = actionOverflow
    ? -10 - actionMenuDimensions.height
    : 10 + postDimensions.height;

  const onLayoutPost = (e: LayoutChangeEvent) => {
    setPostDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const onLayoutActionMenu = (e: LayoutChangeEvent) => {
    setActionMenuDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const onLayoutReaction = (e: LayoutChangeEvent) => {
    setReactionDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const handleEdit = () => {
    if (!dispatch) return;

    if (!selectedItem?.isGoal) return;

    dispatch({
      type: AppActionType.SET_EDITING_GOAL,
      payload: selectedItem?.item as Goal,
    });

    setSelectedItem(null);
    router.navigate("/writeGoal");
  };

  const handleDelete = async (item: Goal | Comment) => {
    if (!dispatch || !appData) return;

    if (selectedItem?.isGoal) {
      try {
        const response = await fetch(appData.api + "/goal", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goalId: item.id,
            userId: appData.user?.uid,
          }),
        });
        const data = await response.json();
        dispatch({
          type: AppActionType.SET_USER,
          payload: data.user,
        });
        setSelectedItem(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleReaction = async (reactionType: "❤️" | "👏" | "💪" | "🔥") => {
    if (!dispatch || !appData) return;

    let reaction: Reaction | undefined = selectedItem?.item.reactions?.find(
      (r) => r.authorId === appData.user?.uid && r.type === reactionType
    );

    console.log("Reaction", appData.user?.reactions, reaction);

    const newReaction: Reaction = {
      reactionId: reaction ? reaction.reactionId : "",
      authorId: reaction ? reaction.authorId : appData.user?.uid!,
      postId: reaction ? reaction.postId : selectedItem?.item.id!,
      type: reaction ? reaction.type : reactionType,
    };

    const body = {
      reaction: newReaction,
      userId: appData.user?.uid!,
      origin: selectedItem?.origin,
    };

    try {
      const response = await fetch(appData.api + "/reaction", {
        method: !checkIfReactionIsUsers(reactionType) ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      const sortedGoals = data.goals.sort((a: Goal, b: Goal) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      if (selectedItem?.origin === "sharedGoals") {
        dispatch({
          type: AppActionType.SET_MY_GOALS,
          payload: sortedGoals,
        });
      } else {
        dispatch({
          type: AppActionType.SET_SHARED_GOALS,
          payload: sortedGoals,
        });
      }
      setSelectedItem(null);
    } catch (error) {
      console.log(error);
    }
  };

  const postReactions = new Set(
    selectedItem?.item.reactions?.map((r) => r.type)
  );

  const checkIfReactionIsUsers = (reactionType: "❤️" | "👏" | "💪" | "🔥") => {
    if (!appData) return false;

    return selectedItem?.item.reactions?.some(
      (r) => r.authorId === appData.user?.uid && r.type === reactionType
    );
  };

  const handleDirectMessage = async () => {
    if (!dispatch || !appData) return;

    console.log("handle directMessage");

    // dispatch({
    //   type: AppActionType.SET_CURRENT_CHAT,
    //   payload: data.chat,
    // });

    setSelectedItem(null);
    router.navigate("/chat");
  };

  useEffect(() => {
    if (!appData || !dispatch) return;
    (async () => {
      try {
        const response = await fetch(
          appData.api +
            "/chat/" +
            appData?.user?.uid +
            "/" +
            selectedItem?.item.authorId
        );
        const data: { chat: ChatData; newChat: boolean } =
          await response.json();

        if (data.newChat) {
          setHasChatWithUser(false);
        } else {
          setHasChatWithUser(true);
        }

        dispatch({
          type: AppActionType.SET_CURRENT_CHAT,
          payload: data.chat,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedItem]);

  return (
    <>
      {selectedItem && (
        <Portal>
          <BlurView style={styles.container} intensity={60}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setSelectedItem(null)}
              style={[
                styles.container,
                {
                  justifyContent:
                    selectedItem.origin === "goalWall"
                      ? "center"
                      : "flex-start",
                  alignItems:
                    selectedItem.origin === "goalWall"
                      ? "center"
                      : "flex-start",
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={1}
                onLayout={onLayoutPost}
                style={{
                  top: itemCoordinates.y,
                  left: itemCoordinates.x,
                  backgroundColor: "white",
                  marginLeft: 20,
                  marginRight: 20,
                  padding: 10,
                  borderRadius: 20,
                  flexDirection: "row",
                  maxWidth: 400,
                }}
              >
                {!selectedItem.owned && (
                  <View
                    onLayout={onLayoutReaction}
                    style={{
                      position: "absolute",
                      backgroundColor: "white",
                      top: actionOverflow
                        ? -20 -
                          actionMenuDimensions.height -
                          reactionDimensions.height
                        : -10 - reactionDimensions.height,
                      right: 0,
                      width: 200,
                      padding: 10,
                      borderRadius: 25,
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {reactionOptions.map((reaction) => (
                      <TouchableOpacity
                        key={reaction.id}
                        style={{
                          backgroundColor: checkIfReactionIsUsers(reaction.icon)
                            ? "#00A2FF"
                            : "white",
                          padding: 5,
                          borderRadius: 33,
                        }}
                        onPress={() => {
                          handleReaction(reaction.icon);
                          console.log("Reaction", reaction.icon);
                        }}
                      >
                        <Text style={{ fontSize: 24 }}>{reaction.icon}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                <View
                  onLayout={onLayoutActionMenu}
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                    top: actionMenuCoordinatesY,
                    right: 0,
                    width: selectedItem.owned ? 200 : 250,
                    padding: 10,
                    paddingTop: 0,
                    paddingBottom: 0,
                    borderRadius: 20,
                    justifyContent: "space-between",
                  }}
                >
                  {selectedItem.owned &&
                    ownedActionOptions.map((action, index) => (
                      <View key={index}>
                        <TouchableOpacity
                          key={action.title}
                          onPress={() => {
                            if (action.title === "Edit") {
                              handleEdit();
                            }
                            if (action.title === "Delete") {
                              handleDelete(selectedItem.item);
                            }
                          }}
                          style={{
                            flexDirection: "row",
                            height: 50,
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontSize: 18, color: action.tint }}>
                            {action.title}
                          </Text>
                          {action.icon}
                        </TouchableOpacity>
                        {index !== ownedActionOptions.length - 1 && (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: "#A0A0A0",
                              width: "100%",
                            }}
                          />
                        )}
                      </View>
                    ))}
                  {!selectedItem.owned &&
                    actionOptions.map((action, index) => (
                      <View key={index}>
                        <TouchableOpacity
                          key={action.title}
                          onPress={() => {
                            if (action.title === "Send message request") {
                              router.navigate("/chat");
                            }
                          }}
                          style={{
                            flexDirection: "row",
                            height: 50,
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontSize: 18, color: action.tint }}>
                            {hasChatWithUser &&
                            action.title === "Send message request"
                              ? "Open chat"
                              : action.title}
                          </Text>

                          {action.icon}
                        </TouchableOpacity>
                        {index !== actionOptions.length - 1 && (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: "#A0A0A0",
                              width: "100%",
                            }}
                          />
                        )}
                      </View>
                    ))}
                </View>
                <View
                  style={{
                    flex: 1,
                    // alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  {!selectedItem.owned && (
                    <AvatarImage
                      size={39}
                      avatarImage={
                        getAvatar(selectedItem.avatarFileName)?.image
                      }
                      withShadow={false}
                    />
                  )}
                  <View
                    style={{ flex: 1, justifyContent: "space-between", gap: 3 }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: selectedItem.isGoal ? 20 : 15,
                          fontWeight: selectedItem.isGoal ? 700 : 500,
                          fontStyle: selectedItem.isGoal ? "italic" : "normal",
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
                      {selectedItem.item.reactions && (
                        <>
                          {Array.from(postReactions).map(
                            (reaction: string, index) => {
                              return (
                                <View key={index}>
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: "#686868",
                                    }}
                                  >
                                    {reaction}
                                  </Text>
                                </View>
                              );
                            }
                          )}
                        </>
                      )}
                    </View>
                  </View>
                </View>
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
});
