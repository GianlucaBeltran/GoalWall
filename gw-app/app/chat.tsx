import { useContext, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppContext } from "./context/appContext";
import ScreenView from "@/components/ScreenView";
import AvatarImage from "@/components/AvatarImage";
import SendDmSVG from "@/components/svg/SendDmSVG";

import MessageComponent from "@/components/MessageComponent";
import { DirectMessage } from "./types/data.types";

export default function ChatScreen() {
  const appData = useContext(AppContext);

  const [message, setMessage] = useState("");

  const scrolViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!scrolViewRef.current) return;
    scrolViewRef.current.scrollToEnd({ animated: true });
  }, [scrolViewRef.current]);

  const handleSendMessage = () => {
    if (!message) return;
    if (!appData?.socket) return;
    if (!appData?.socket.connected) return;

    scrolViewRef?.current?.scrollToEnd({ animated: true });

    if (appData?.currentChat?.chat.status === "new") {
      appData.socket.emit("messageRequest", {
        chat: {
          ...appData?.currentChat?.chat,
          status: "pending",
          messages: [
            {
              authorId: appData?.user?.uid,
              message: message.trim(),
              createdAt: new Date().toISOString(),
            },
          ],
        },
        userId: appData.user?.uid,
        recipientId: appData.currentChat.otherUserId,
      });
    } else if (appData?.currentChat?.chat.status === "pending") {
      if (appData.currentChat.chat.creatorId !== appData?.user?.uid) {
        appData.socket.emit("messageRequestAccepted", {
          chatId: appData?.currentChat?.chat.id,
          message: {
            authorId: appData?.user?.uid,
            message: message.trim(),
            createdAt: new Date().toISOString(),
          },
          userId: appData.user?.uid,
          recipientId: appData.currentChat.otherUserId,
        });
      } else {
        appData.socket.emit("message", {
          chatId: appData?.currentChat?.chat.id,
          message: {
            authorId: appData?.user?.uid,
            message: message.trim(),
            createdAt: new Date().toISOString(),
          },
          userId: appData.user?.uid,
          recipientId: appData.currentChat.otherUserId,
        });
      }
    } else if (appData?.currentChat?.chat.status === "accepted") {
      appData?.socket.emit("message", {
        chatId: appData?.currentChat?.chat.id,
        message: {
          authorId: appData?.user?.uid,
          message: message.trim(),
          createdAt: new Date().toISOString(),
        },
        userId: appData.user?.uid,
        recipientId: appData.currentChat.otherUserId,
      });
    }
    scrolViewRef.current?.scrollToEnd({ animated: true });
    Keyboard.dismiss();
    setMessage("");
  };

  const isOwner = appData?.currentChat?.chat.creatorId === appData?.user?.uid;

  const createMessageData = (message: DirectMessage) => {
    const newMessage = {
      message,
      userId:
        appData?.user?.uid === message.authorId
          ? message.authorId
          : message.recipientId,
      userName:
        appData?.user?.uid === message.authorId
          ? appData.user.name
          : appData?.currentChat?.otherUserName || "",
      userLastName:
        appData?.user?.uid === message.authorId
          ? appData.user.lastName
          : appData?.currentChat?.otherUserLastName || "",
      userAvatarFileName:
        appData?.user?.uid === message.authorId
          ? appData.user.avatarFileName
          : appData?.currentChat?.otherUserAvatar || "",
      isOwner: appData?.user?.uid === message.authorId,
    };

    return newMessage;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        marginRight: -20,
        marginLeft: -20,
      }}
    >
      <ScreenView title={"Chat"} touchableWithoutFeedback={false}>
        {appData?.socket?.connected && appData?.currentChat && (
          <View
            style={{
              flex: 1,
            }}
          >
            <ScrollView
              ref={scrolViewRef}
              style={{
                flex: 1,
                paddingRight: 20,
                paddingLeft: 20,
              }}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="interactive"
            >
              <View
                style={{
                  flex: 0.2,
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#EDECEC",
                  gap: 10,
                  paddingBottom: 10,
                  marginBottom: 10,
                }}
              >
                <AvatarImage
                  avatarImage={appData?.currentChat.otherUserAvatar}
                  size={80}
                  withShadow={false}
                />
                {(appData.currentChat.chat.status === "accepted" ||
                  !isOwner) && (
                  <Text>
                    {appData?.currentChat.otherUserName}{" "}
                    {appData.currentChat.otherUserLastName}
                  </Text>
                )}
              </View>
              {appData.currentChat.chat.status === "new" && (
                <View
                  style={{
                    paddingRight: 50,
                    paddingLeft: 50,
                    paddingBottom: 20,
                  }}
                >
                  <Text
                    style={{ fontSize: 16, opacity: 0.67, textAlign: "center" }}
                  >
                    By sending a message request, your real profile picture and
                    full name will be shown to the other member.
                  </Text>
                </View>
              )}

              {appData.currentChat.chat.status === "pending" && (
                <View
                  style={{
                    // maxWidth: 219,
                    paddingRight: 50,
                    paddingLeft: 50,
                    paddingBottom: 20,
                  }}
                >
                  <Text
                    style={{ fontSize: 16, opacity: 0.67, textAlign: "center" }}
                  >
                    {isOwner
                      ? "If the member chooses to accept your message request, their profile picture and full name will become visible to you."
                      : "If you reply, your profile picture and full name will become visible to the other member."}
                  </Text>
                </View>
              )}
              {appData.currentChat.chat.status === "accepted" && (
                <View
                  style={{
                    // maxWidth: 219,
                    paddingRight: 50,
                    paddingLeft: 50,
                    paddingBottom: 20,
                  }}
                >
                  <Text
                    style={{ fontSize: 16, opacity: 0.67, textAlign: "center" }}
                  >
                    This is the beginning of your conversation with{" "}
                    {appData.currentChat.otherUserName}{" "}
                    {appData.currentChat.otherUserLastName}.
                  </Text>
                </View>
              )}

              {appData.currentChat.chat.messages.map((message, index) => (
                <MessageComponent
                  key={index}
                  messageData={createMessageData(message)}
                />
              ))}
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                maxHeight: 100,
                gap: 10,
                marginRight: 20,
                marginLeft: 20,
                marginBottom: 0,
              }}
            >
              <TextInput
                value={message}
                onChangeText={(text) => {
                  if (text.length > 0 && text[0] !== "\n") {
                    setMessage(text);
                  } else if (text.length > 0 && text[0] === "\n") {
                    setMessage("");
                  } else {
                    setMessage("");
                  }
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#F8F8F8",
                  borderRadius: 15,
                  padding: 10,
                }}
                multiline
                placeholder="Message..."
                placeholderTextColor={"#6E6E6E"}
                onSubmitEditing={handleSendMessage}
              />
              {message && (
                <TouchableOpacity
                  onPress={() => {
                    handleSendMessage();
                  }}
                >
                  <SendDmSVG />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScreenView>
    </KeyboardAvoidingView>
  );
}
