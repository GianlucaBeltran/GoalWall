import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useReducer, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack, usePathname } from "expo-router";
import { User, Goal, Comment, Chat } from "./types/data.types";
import { ImageSourcePropType } from "react-native";
import { urlHome, urlNgrok, urlSchool } from "./constants/apiEndpoints";
import NetInfo from "@react-native-community/netinfo";
import * as Location from "expo-location";
import { Avatar } from "./types/avatar.types";
import {
  AppActionType,
  AppContext,
  appDataReducer,
  AppDispatchContext,
  ChatData,
} from "./context/appContext";
import sharedGoals from "./othersGoals";
import { Host } from "react-native-portalize";
import PortalViewNotifications from "@/components/PortalViewNotifications";
import { Socket } from "socket.io-client";
import { connectSocket } from "./helpers/socket";
import { constructMessageDispatch } from "./helpers/chatHelpers";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathName = usePathname();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appData, dispatch] = useReducer(appDataReducer, {
    user: null,
    editingData: null,
    api: urlNgrok,
    isLoading: false,
    sharedGoals: [],
    myGoals: [],
    currentChat: null,
    notifications: [],
    chats: [],
    newMessages: false,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!appData?.user || !dispatch || appData.socket?.connected) return;

    const socket = connectSocket(appData?.user?.uid);
    dispatch({
      type: AppActionType.SET_SOCKET,
      payload: socket,
    });

    return () => {
      socket.disconnect();
      dispatch!({
        type: AppActionType.SET_CURRENT_CHAT,
        payload: null,
      });
    };
  }, [appData?.user]);

  useEffect(() => {
    if (!appData || !appData.socket) return;

    function getOtherUserAvatar(chat: Chat, userId: string) {
      return chat.users.find((user) => user.userId !== userId)
        ?.userAvatarFileName;
    }

    function getOtherUserNames(chat: Chat, userId: string) {
      return {
        name: chat.users.find((user) => user.userId !== userId)?.userName,
        lastName: chat.users.find((user) => user.userId !== userId)
          ?.userLastName,
      };
    }

    function onMessage(data: Chat) {
      if (!appData || !appData.user) return;
      if (pathName !== "/chat" && pathName !== "/messages") {
        dispatch!({
          type: AppActionType.SET_NEW_MESSAGE,
          payload: true,
        });
      }
      if (pathName !== "/chat") {
        console.log("pushing notification");
        const otherUser = getOtherUserNames(data, appData.user.uid);
        dispatch!({
          type: AppActionType.PUSH_NOTIFICATION,
          payload: {
            id: new Date().getTime().toString(),
            data: {
              message: data.messages[data.messages.length - 1].message,
              avatarFileName: getOtherUserAvatar(data, appData.user.uid),
              name: otherUser.name,
              lastName: otherUser.lastName,
            },
            type: "message",
          },
        });
      } else {
        dispatch({
          type: AppActionType.SET_CURRENT_CHAT,
          payload: constructMessageDispatch(data, appData.user.uid),
        });
      }
    }

    function onMessageRequestRecieved(data: Chat) {
      if (!appData || !appData.user) return;
      if (pathName !== "/chat" && pathName !== "/messages") {
        dispatch!({
          type: AppActionType.SET_NEW_MESSAGE,
          payload: true,
        });
      }

      if (pathName !== "/chat") {
        const otherUser = getOtherUserNames(data, appData.user.uid);
        dispatch!({
          type: AppActionType.PUSH_NOTIFICATION,
          payload: {
            id: new Date().getTime().toString(),
            data: {
              message: data.messages[data.messages.length - 1].message,
              avatarFileName: getOtherUserAvatar(data, appData.user.uid),
              name: otherUser.name,
              lastName: otherUser.lastName,
            },
            type: "messageRequest",
          },
        });
      } else {
        dispatch!({
          type: AppActionType.SET_CURRENT_CHAT,
          payload: constructMessageDispatch(data, appData.user.uid),
        });
      }
    }

    function onMessageRequestAccepted(data: Chat) {
      if (!appData || !appData.user) return;
      if (pathName !== "/chat" && pathName !== "/messages") {
        dispatch!({
          type: AppActionType.SET_NEW_MESSAGE,
          payload: true,
        });
      }
      if (pathName !== "/chat") {
        const otherUser = getOtherUserNames(data, appData.user.uid);
        dispatch!({
          type: AppActionType.PUSH_NOTIFICATION,
          payload: {
            id: new Date().getTime().toString(),
            data: {
              message: data.messages[data.messages.length - 1].message,
              avatarFileName: getOtherUserAvatar(data, appData.user.uid),
              name: otherUser.name,
              lastName: otherUser.lastName,
            },
            type: "messageRequestAccepted",
          },
        });
      } else {
        dispatch!({
          type: AppActionType.SET_CURRENT_CHAT,
          payload: constructMessageDispatch(data, appData.user.uid),
        });
      }
    }

    async function onFetchChats() {
      if (!appData || !appData.user) return;

      try {
        const response = await fetch(
          appData.api + "/chat/" + appData.user?.uid,
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (!data.messages) return;
        const sortedMessages = data.messages.sort((a: Chat, b: Chat) => {
          return (
            new Date(b.messages[b.messages.length - 1].createdAt).getTime() -
            new Date(a.messages[a.messages.length - 1].createdAt).getTime()
          );
        });
        dispatch!({
          type: AppActionType.SET_CHATS,
          payload: sortedMessages,
        });
      } catch (error) {
        console.log(error, "error");
      }
    }

    appData.socket.on("message", onMessage);
    appData.socket.on("messageRequestRecieved", onMessageRequestRecieved);
    appData.socket.on("messageRequestAccepted", onMessageRequestAccepted);
    appData.socket.on("fetchChats", onFetchChats);

    return () => {
      if (!appData?.socket) return;
      appData.socket.off("message", onMessage);
      appData.socket.off("messageRequestRecieved", onMessageRequestRecieved);
      appData.socket.off("messageRequestAccepted", onMessageRequestAccepted);
      appData.socket.off("fetchChats", onFetchChats);
    };
  }, [appData?.currentChat, appData?.socket, pathName]);

  if (!loaded) {
    return null;
  }

  return (
    <AppContext.Provider value={appData}>
      <AppDispatchContext.Provider value={dispatch}>
        <Host>
          <ThemeProvider
            value={colorScheme === "light" ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="account" />
              <Stack.Screen name="mainMenu" />
              <Stack.Screen name="goalWall" />
              <Stack.Screen name="writeGoal" />
              <Stack.Screen name="avatar" />
              <Stack.Screen name="sharedGoals" />
              <Stack.Screen name="othersGoals" />
              <Stack.Screen name="messages" />
              <Stack.Screen name="chat" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
          <PortalViewNotifications />
        </Host>
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}
