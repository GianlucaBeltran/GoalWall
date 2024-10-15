import { View, Text, TouchableOpacity } from "react-native";
import { Chat, DirectMessage } from "../app/types/data.types";
import AvatarImage from "./AvatarImage";
import { getAvatar } from "@/app/constants/avatars";
import { formatedDate } from "@/app/helpers/dateFormating";
import ChevronRightSVG from "./svg/ChevronRightSVG";
import { AppActionType, AppDispatchContext } from "@/app/context/appContext";
import { useContext } from "react";
import { router } from "expo-router";

export default function MessageComponent({
  messageData,
}: {
  messageData: {
    message: DirectMessage;
    userId: string;
    userName: string;
    userLastName: string;
    userAvatarFileName: string;
    isOwner: boolean;
  };
}) {
  // const dispatch = useContext(AppDispatchContext);

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        gap: 10,
        // flex: 1,
        justifyContent: messageData.isOwner ? "flex-end" : "flex-start",
        marginBottom: 20,
        // height: 70,
        // alignItems: messageData.isOwner ? "flex-end" : "flex-start",
      }}
      // onPress={() => {
      //   if (!dispatch) return;
      //   dispatch({
      //     type: AppActionType.SET_CURRENT_CHAT,
      //     payload: {
      //       chat: chat,
      //       otherUserId: chat.users[otherIndex].userId,
      //       otherUserName:
      //         isCreator && chatStatus !== "accepted"
      //           ? ""
      //           : chat.users[otherIndex].userName,
      //       otherUserLastName:
      //         isCreator && chatStatus !== "accepted"
      //           ? ""
      //           : chat.users[otherIndex].userLastName,
      //       otherUserAvatar: chat.users[otherIndex].userAvatarFileName,
      //     },
      //   });
      //   router.navigate("/chat");
      // }}
      disabled
    >
      {!messageData.isOwner && (
        <AvatarImage
          size={39}
          avatarImage={getAvatar(messageData.userAvatarFileName)?.image}
          withShadow={false}
        />
      )}

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          paddingRight: 15,
          paddingLeft: 15,
          backgroundColor: messageData.isOwner ? "#3E3CDC" : "#F4F4F4",
          borderRadius: 25,
          maxWidth: "80%",
        }}
      >
        <Text
          style={{
            color: messageData.isOwner ? "white" : "black",
          }}
        >
          {messageData.message.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
