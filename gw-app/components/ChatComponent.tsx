import { View, Text, TouchableOpacity } from "react-native";
import { Chat } from "../app/types/data.types";
import AvatarImage from "./AvatarImage";
import { formatedDate } from "@/app/helpers/dateFormating";
import ChevronRightSVG from "./svg/ChevronRightSVG";
import { AppActionType, AppDispatchContext } from "@/app/context/appContext";
import { useContext } from "react";
import { router } from "expo-router";

export default function ChatComponent({
  chat,
  otherIndex,
  messageDisplayIndex,
}: {
  chat: Chat;
  otherIndex: number;
  messageDisplayIndex: number;
}) {
  const dispatch = useContext(AppDispatchContext);
  const chatStatus = chat.status;
  const isCreator = chat.creatorId !== chat.users[otherIndex].userId;
  const canAccept = chatStatus === "pending" && !isCreator;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        gap: 10,
        flex: 1,
        alignItems: "center",
        marginBottom: 20,
      }}
      onPress={() => {
        if (!dispatch) return;
        dispatch({
          type: AppActionType.SET_CURRENT_CHAT,
          payload: {
            chat: chat,
            otherUserId: chat.users[otherIndex].userId,
            otherUserName:
              isCreator && chatStatus !== "accepted"
                ? ""
                : chat.users[otherIndex].userName,
            otherUserLastName:
              isCreator && chatStatus !== "accepted"
                ? ""
                : chat.users[otherIndex].userLastName,
            otherUserAvatar: chat.users[otherIndex].userAvatarFileName,
          },
        });
        router.navigate("/chat");
      }}
    >
      <AvatarImage
        size={50}
        avatarImage={chat.users[otherIndex].userAvatarFileName!}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            justifyContent: "space-evenly",
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              {chatStatus === "accepted" || !isCreator ? (
                <Text style={{ color: "#6E6E6E", fontWeight: 600 }}>
                  {chat.users[otherIndex].userName}{" "}
                  {chat.users[otherIndex].userLastName}
                </Text>
              ) : (
                <Text style={{ color: "#6E6E6E", fontWeight: 600 }}>
                  Pending chat
                </Text>
              )}
              <Text style={{ color: "#6E6E6E", fontSize: 11 }}>
                {formatedDate(chat.messages[messageDisplayIndex].createdAt)}
              </Text>
            </View>
            {canAccept && (
              <View
                style={{
                  backgroundColor: "black",
                  borderRadius: 15,
                  padding: 5,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <Text style={{ color: "white" }}>Message request</Text>
              </View>
            )}
          </View>
          <View>
            <Text style={{ fontWeight: 700 }} numberOfLines={1}>
              {chat.messages[messageDisplayIndex].message}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <ChevronRightSVG />
        </View>
      </View>
    </TouchableOpacity>
  );
}
