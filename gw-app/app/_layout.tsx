import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { createContext, useContext, useEffect, useReducer } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { User } from "./types/user.types";
import { Goal } from "./types/goal.types";
import { ImageSourcePropType } from "react-native";
import { Avatar } from "./constants/avatars";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

interface EditingData {
  goal?: Goal | null;
  avatar?: Avatar | null;
}

interface AppData {
  user: User | null;
  editingData: EditingData | null;
  isLoading: boolean;
}

export enum AppActionType {
  SET_USER,
  SET_EDITING_AVATAR,
  SET_EDITING_GOAL,
  RESET_EDITING,
  SET_LOADING,
}

export interface AppAction {
  type: AppActionType;
  payload: User | Goal | Avatar | boolean | string | null | EditingData;
}

export const AppContext = createContext<AppData | null>(null);
export const AppDispatchContext =
  createContext<React.Dispatch<AppAction> | null>(null);

// This hook can be used to access the user info.
export function useAppContext() {
  const value = useContext(AppContext);
  return value;
}

function appDataReducer(appData: AppData, action: AppAction): AppData {
  switch (action.type) {
    case AppActionType.SET_USER:
      return { ...appData, user: action.payload as User };
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
    case AppActionType.SET_LOADING:
      return { ...appData, isLoading: action.payload as boolean };
    default:
      return appData;
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appData, dispatch] = useReducer(appDataReducer, {
    user: null,
    editingData: null,
    isLoading: false,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppContext.Provider value={appData}>
      <AppDispatchContext.Provider value={dispatch}>
        <ThemeProvider
          value={colorScheme === "light" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="account" />
            <Stack.Screen name="goal" />
            <Stack.Screen name="setGoals" />
            <Stack.Screen name="writeGoal" />
            <Stack.Screen name="avatar" />
            <Stack.Screen name="sharedGoals" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}
