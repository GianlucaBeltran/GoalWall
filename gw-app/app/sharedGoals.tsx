import { router, useNavigation } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  GestureResponderEvent,
} from "react-native";

import * as Haptics from "expo-haptics";

import ScreenView from "@/components/ScreenView";
import ExclamationSVG from "@/components/svg/ExclamationSVG";
import GoalSVG from "@/components/svg/GoalSVG";
import WriteSVG from "@/components/svg/WriteSVG";
import { AppContext } from "./context/appContext";
import { getAvatar } from "./constants/avatars";
import { Comment, Goal, Category, SelectedItem } from "./types/data.types";
import AvatarImage from "@/components/AvatarImage";
import { Host } from "react-native-portalize";
import PortalViewPosts from "@/components/PortalViewPosts";
import PortalViewAvatars from "@/components/PortalViewAvatars";
import OwnedGoal from "@/components/OwnedGoal";

export default function sharedGoals() {
  const [itemCoordinates, setItemCoordinates] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [avatarPortal, setAvatarPortal] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const appData = useContext(AppContext);

  const onLongPress = (e: GestureResponderEvent, item: SelectedItem) => {
    const { pageY, locationY } = e.nativeEvent;
    let y = pageY - locationY - 10;

    setItemCoordinates({
      x: 0,
      y,
    });
    setSelectedItem(item);
  };

  return (
    <Host>
      <ScreenView title="Your shared goals" touchableWithoutFeedback={false}>
        {appData?.user?.goals && appData.user?.goals.length === 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 0.3 }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <ExclamationSVG />
                <GoalSVG width={92} height={92} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                You have no shared goals yet
              </Text>
            </View>
          </View>
        )}
        {appData?.myGoals.length !== 0 && (
          <View style={{ flex: 1, justifyContent: "space-evenly", gap: 20 }}>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  setAvatarPortal(true);
                }}
              >
                <AvatarImage
                  avatarImage={getAvatar(appData?.user?.avatarFileName)?.image}
                  size={118}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  router.navigate(
                    appData?.user?.avatarFileName ? "/writeGoal" : "/avatar"
                  )
                }
              >
                <View
                  style={{
                    width: 216,
                    paddingTop: 15,
                    paddingBottom: 15,
                    paddingLeft: 25,
                    paddingRight: 25,
                    backgroundColor: "black",
                    borderRadius: 15,
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <WriteSVG stroke="white" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      // marginLeft: 8,
                      color: "white",
                    }}
                  >
                    Share a new goal
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                ref={flatListRef}
                data={appData?.myGoals.sort((a: Goal, b: Goal) => {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                })}
                renderItem={({ item }) => {
                  return (
                    <OwnedGoal
                      goal={item}
                      appData={appData!}
                      onLongPress={onLongPress}
                    />
                  );
                }}
              />
            </View>
          </View>
        )}
        {appData?.user?.goals?.length === 0 && (
          <TouchableOpacity
            style={{
              width: "100%",
              flex: appData?.user?.avatarFileName ? 0.2 : 0.4,
            }}
            onPress={() =>
              router.navigate(
                appData?.user?.avatarFileName ? "/writeGoal" : "/avatar"
              )
            }
          >
            <View
              style={{
                height: 74,
                width: "100%",
                borderColor: "black",
                borderRadius: 15,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <WriteSVG />
              <Text style={{ fontSize: 20, fontWeight: 500, marginLeft: 8 }}>
                Share a new goal
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <PortalViewPosts
          selectedItem={selectedItem}
          itemCoordinates={itemCoordinates}
          setSelectedItem={setSelectedItem}
        />
        <PortalViewAvatars
          enabled={avatarPortal}
          setEnabled={setAvatarPortal}
        />
      </ScreenView>
    </Host>
  );
}

const styles = StyleSheet.create({});
