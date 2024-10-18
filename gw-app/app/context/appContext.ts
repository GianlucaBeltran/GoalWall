import { createContext, useContext } from "react";
import { Avatar } from "../types/avatar.types";
import { Chat, Goal, User, Notification } from "../types/data.types";
import { Socket } from "socket.io-client";

interface EditingData {
  goal?: Goal | null;
  avatar?: Avatar | null;
}

export interface ChatData {
  chat: Chat;
  otherUserId: string;
  otherUserName: string;
  otherUserLastName: string;
  otherUserAvatar: string;
}

export interface AppData {
  user: User | null;
  sharedGoals: Goal[];
  myGoals: Goal[];
  editingData: EditingData | null;
  api: string;
  isLoading: boolean;
  chats: Chat[];
  notifications: Notification[];
  socket?: Socket;
  currentChat: ChatData | null;
  newMessages: boolean;
}

export enum AppActionType {
  SET_USER,
  SET_SHARED_GOALS,
  SET_MY_GOALS,
  SET_EDITING_AVATAR,
  SET_EDITING_GOAL,
  RESET_EDITING,
  SET_API,
  SET_LOADING,
  SET_CURRENT_CHAT,
  SET_CHATS,
  PUSH_NOTIFICATION,
  POP_NOTIFICATION,
  SET_SOCKET,
  SET_NEW_MESSAGE,
}

export interface AppAction {
  type: AppActionType;
  payload:
    | User
    | Goal
    | Goal[]
    | Avatar
    | boolean
    | string
    | null
    | EditingData
    | ChatData
    | Notification
    | Chat[]
    | Socket;
}

export const AppContext = createContext<AppData | null>(null);
export const AppDispatchContext =
  createContext<React.Dispatch<AppAction> | null>(null);

// This hook can be used to access the user info.
export function useAppContext() {
  const value = useContext(AppContext);
  return value;
}

export function appDataReducer(appData: AppData, action: AppAction): AppData {
  switch (action.type) {
    case AppActionType.SET_USER:
      return {
        ...appData,
        user: action.payload as User,
        myGoals: (action.payload as User).goals,
      };
    case AppActionType.SET_SHARED_GOALS:
      return { ...appData, sharedGoals: action.payload as Goal[] };
    case AppActionType.SET_MY_GOALS:
      return { ...appData, myGoals: action.payload as Goal[] };
    case AppActionType.SET_EDITING_AVATAR:
      return {
        ...appData,
        editingData: {
          ...appData.editingData,
          avatar: action.payload as Avatar,
        },
      };
    case AppActionType.SET_EDITING_GOAL:
      return {
        ...appData,
        editingData: {
          ...appData.editingData,
          goal: action.payload as Goal,
        },
      };
    case AppActionType.RESET_EDITING:
      return { ...appData, editingData: null };
    case AppActionType.SET_API:
      return { ...appData, api: action.payload as string };
    case AppActionType.SET_LOADING:
      return { ...appData, isLoading: action.payload as boolean };
    case AppActionType.SET_CURRENT_CHAT:
      return { ...appData, currentChat: action.payload as ChatData };
    case AppActionType.SET_CHATS:
      return { ...appData, chats: action.payload as Chat[] };
    case AppActionType.PUSH_NOTIFICATION:
      return {
        ...appData,
        notifications: [
          ...appData.notifications,
          action.payload as Notification,
        ],
      };
    case AppActionType.POP_NOTIFICATION:
      return {
        ...appData,
        notifications: appData.notifications.slice(1),
      };
    case AppActionType.SET_NEW_MESSAGE:
      return {
        ...appData,
        newMessages: action.payload as boolean,
      };
    case AppActionType.SET_SOCKET:
      return { ...appData, socket: action.payload as Socket };
    default:
      return appData;
  }
}
