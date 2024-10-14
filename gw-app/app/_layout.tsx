import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useReducer } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { User, Goal, Comment } from "./types/data.types";
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
} from "./context/appContext";
import sharedGoals from "./othersGoals";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appData, dispatch] = useReducer(appDataReducer, {
    user: null,
    editingData: null,
    api: urlHome,
    isLoading: false,
    sharedGoals: [],
    myGoals: [],
  });

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.log("Permission to access location was denied");
  //       return;
  //     }

  //     // const ipAddress = (await NetInfo.fetch()).details?.ipAddress;
  //     // console.log(ipAddress, "apiAdress");
  //     // dispatch({
  //     //   type: AppActionType.SET_API,
  //     //   payload: ipAddress.split(".")[0] === "192" ? urlHome : urlSchool,
  //     // });

  //     // dispatch({
  //     //   type: AppActionType.SET_API,
  //     //   payload: urlHome,
  //     // });
  //   })();
  // }, []);

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
            <Stack.Screen name="mainMenu" />
            <Stack.Screen name="goalWall" />
            <Stack.Screen name="writeGoal" />
            <Stack.Screen name="avatar" />
            <Stack.Screen name="sharedGoals" />
            <Stack.Screen name="othersGoals" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}
