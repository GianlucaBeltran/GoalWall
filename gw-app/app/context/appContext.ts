import { createContext, useContext } from "react";
import { Avatar } from "../types/avatar.types";
import { Goal, User } from "../types/data.types";

interface EditingData {
  goal?: Goal | null;
  avatar?: Avatar | null;
}

export interface AppData {
  user: User | null;
  sharedGoals: Goal[];
  myGoals: Goal[];
  editingData: EditingData | null;
  api: string;
  isLoading: boolean;
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
    | EditingData;
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
    default:
      return appData;
  }
}
