import {
  AppActionType,
  AppData,
  AppDispatchContext,
  ChatData,
} from "@/app/context/appContext";
import { formatedDate } from "@/app/helpers/dateFormating";
import {
  Chat,
  Comment,
  Goal,
  Reaction,
  SelectedItem,
} from "@/app/types/data.types";
import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import * as Haptics from "expo-haptics";
import AvatarImage from "./AvatarImage";
import ReactionSVG from "./svg/ReactionSVG";
import { router } from "expo-router";
import ReactionsDisplay from "./ReactionsDisplay";

export default function Post({
  postData,
  appData,
  onLongPress,
  onReply,
  origin,
}: {
  postData: { data: Comment | Goal; owned: boolean; type: "comment" | "goal" };
  appData: AppData;
  onLongPress?: (e: GestureResponderEvent, message: SelectedItem) => void;
  onReply?: (e: GestureResponderEvent, message: SelectedItem) => void;
  origin: "sharedGoals" | "othersGoals";
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const dispatch = useContext(AppDispatchContext);

  const handleViewComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    try {
      const response = await fetch(
        appData?.api +
          "/comment/" +
          postData.data.authorId +
          "/" +
          postData.data.id,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      console.log(data, "data");
      setComments(data.comments);
      setShowComments(true);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleLongPress = (
    e: GestureResponderEvent,
    reactionButton = false
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    if (!onLongPress) return;

    if (postData.type === "goal") {
      onLongPress(e, {
        owned: postData.owned,
        item: postData.data,
        isGoal: true,
        avatarFileName: postData.data.avatarFileName,
        origin,
        reactionButton,
      });
    } else if (postData.type === "comment") {
      onLongPress(e, {
        owned: postData.owned,
        item: postData.data,
        isGoal: false,
        avatarFileName: postData.data.avatarFileName,
        origin,
        reactionButton,
      });
    }
  };

  useEffect(() => {
    if (!appData) return;
    if (!showComments) return;
    console.log("fetching comments");
    (async () => {
      try {
        const response = await fetch(
          appData.api +
            "/comment/" +
            postData.data.authorId +
            "/" +
            postData.data.id,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        console.log(data, "data");
        setComments(data.comments);
      } catch (error) {
        console.log(error, "error");
      }
    })();
  }, [appData]);

  const postReactions = new Set(postData.data.reactions?.map((r) => r.type));

  const handleProfileTap = async () => {
    if (!dispatch) return;
    try {
      const response = await fetch(
        appData.api +
          "/chat/" +
          appData?.user?.uid +
          "/" +
          postData.data.authorId
      );
      const data: { chat: ChatData; newChat: boolean } = await response.json();

      dispatch({
        type: AppActionType.SET_CURRENT_CHAT,
        payload: data.chat,
      });

      router.navigate("/chat");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: postData.type !== "goal" ? 30 : 0,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          flex: 1,
          flexDirection: "row",
          paddingBottom: 10,
          gap: 10,
        }}
        onLongPress={(e) => handleLongPress(e)}
        disabled={!onLongPress}
      >
        <TouchableOpacity
          onPress={() => {
            handleProfileTap();
          }}
        >
          <AvatarImage
            size={postData.type === "goal" ? 39 : 30}
            avatarImage={postData.data.avatarFileName!}
            withShadow={false}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: "space-between", gap: 3 }}>
          <View>
            <Text
              style={{
                fontSize: postData.type === "goal" ? 20 : 15,
                fontWeight: postData.type === "goal" ? 700 : 500,
                fontStyle: postData.type === "goal" ? "italic" : "normal",
              }}
            >
              {postData.data.description}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#6E6E6E",
              }}
            >
              {formatedDate(postData.data.createdAt)}
            </Text>
            {!postData.owned && postData.type === "goal" && (
              <TouchableOpacity
                onPress={(e) => {
                  if (!onReply) return;
                  onReply(e, {
                    owned: postData.owned,
                    item: postData.data,
                    isGoal: postData.type === "goal",
                    avatarFileName: postData.data.avatarFileName,
                    parentGoalId:
                      postData.type === "goal"
                        ? (postData.data as Goal).id
                        : (postData.data as Comment).goalId,
                    origin,
                  });
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: 600, color: "#686868" }}
                >
                  Reply
                </Text>
              </TouchableOpacity>
            )}
            {postData.data.reactions && (
              <ReactionsDisplay reactions={postData.data.reactions} />
            )}
          </View>
        </View>
        {!postData.owned && (
          <View>
            <TouchableOpacity onPress={(e) => handleLongPress(e, true)}>
              <ReactionSVG />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
      {postData.type === "goal" &&
        (postData.data as Goal).comments?.length !== 0 && (
          <>
            {showComments &&
              comments
                .sort((a: Comment, b: Comment) => {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                })
                .map((comment) => {
                  return (
                    <View key={comment.id}>
                      <Post
                        postData={{
                          data: comment,
                          type: "comment",
                          owned: comment.authorId === appData.user?.uid,
                        }}
                        appData={appData}
                        onLongPress={onLongPress}
                        origin={origin}
                      />
                    </View>
                  );
                })}
            <View
              style={{
                flexDirection: "row",
                marginLeft: !showComments ? 0 : 30,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
                onPress={() => {
                  handleViewComments();
                }}
              >
                <View
                  style={{ width: 18, height: 1, backgroundColor: "#A0A0A0" }}
                />
                <Text
                  style={{ fontSize: 15, fontWeight: 500, color: "#818181" }}
                >
                  {!showComments
                    ? `View ${
                        (postData.data as Goal).comments?.length
                      } more replies`
                    : "Hide replies"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
    </View>
  );
}
