import { formatedDate } from "@/app/helpers/dateFormating";
import { Goal, Comment, Reaction } from "@/app/types/data.types";
import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import * as Haptics from "expo-haptics";
import ThreeDotsSVG from "./svg/ThreeDotsSVG";
import { useEffect, useState } from "react";
import { AppData } from "@/app/context/appContext";
import Post from "./Post";

export default function OwnedGoal({
  goal,
  appData,
  onLongPress,
  onReply,
}: {
  goal: Goal;
  appData: AppData;
  onLongPress: (e: GestureResponderEvent, message: any) => void;
  onReply?: (e: GestureResponderEvent, message: any) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleViewComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    if (comments.length) {
      setShowComments(true);
      return;
    }

    try {
      const response = await fetch(
        appData?.api + "/comment/" + appData?.user?.uid + "/" + goal?.id,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setComments(data.comments);
      setShowComments(true);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleLongPress = (e: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    onLongPress(e, { owned: true, item: goal, isGoal: true });
  };

  useEffect(() => {
    if (!appData) return;
    if (!showComments) return;
    console.log("fetching comments");
    (async () => {
      try {
        const response = await fetch(
          appData?.api + "/comment/" + appData?.user?.uid + "/" + goal?.id,
          {
            method: "GET",
          }
        );
        console.log("ownedGoals");
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.log(error, "error");
      }
    })();
  }, [appData]);

  const postReactions = new Set(goal.reactions?.map((r) => r.type));

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#818181",
            textAlignVertical: "center",
          }}
        >
          {formatedDate(goal.createdAt)}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          {goal.reactions && (
            <>
              {Array.from(postReactions).map((reaction: string, index) => {
                return (
                  <View key={index}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#686868",
                      }}
                    >
                      {reaction}
                    </Text>
                  </View>
                );
              })}
            </>
          )}
          <TouchableOpacity onPress={(e) => handleLongPress(e)}>
            <ThreeDotsSVG />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          paddingBottom: 10,
          alignItems: "center",
        }}
        onLongPress={(e) => handleLongPress(e)}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 700,
            fontStyle: "italic",
          }}
        >
          {goal?.description}
        </Text>
      </TouchableOpacity>
      {goal.comments?.length !== 0 && (
        <>
          {showComments &&
            comments
              .sort((a, b) => {
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              })
              .map((comment) => {
                return (
                  <Post
                    key={comment.id}
                    postData={{
                      data: comment,
                      type: "comment",
                      owned: comment.authorId === appData.user?.uid,
                    }}
                    appData={appData}
                    onLongPress={onLongPress}
                    onReply={onReply}
                    origin="sharedGoals"
                  />
                );
              })}
          <View
            style={{
              flexDirection: "row",
              marginLeft: !showComments ? 0 : 20,
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
              <Text style={{ fontSize: 15, fontWeight: 500, color: "#818181" }}>
                {!showComments
                  ? `View ${goal.comments?.length} more replies`
                  : "Hide replies"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
