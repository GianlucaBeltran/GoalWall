import { useContext, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  GestureResponderEvent,
  TextInput,
  Keyboard,
} from "react-native";

import ScreenView from "@/components/ScreenView";
import ExclamationSVG from "@/components/svg/ExclamationSVG";
import GoalSVG from "@/components/svg/GoalSVG";
import {
  AppActionType,
  AppContext,
  AppDispatchContext,
} from "./context/appContext";
import { Goal, SelectedItem } from "./types/data.types";
import { Host } from "react-native-portalize";
import PortalViewPosts from "@/components/PortalViewPosts";
import Post from "@/components/Post";
import SearchSVG from "@/components/svg/SearchSVG";
import SortSVG from "@/components/svg/SortSVG";
import CloseSVG from "@/components/svg/CloseSVG";
import PortalViewReply from "@/components/PortalViewReply";

export default function sharedGoals() {
  const [itemCoordinates, setItemCoordinates] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  // const [othersGoals, setOtherGoals] = useState<Goal[] | null>(null);
  const [filteredGoals, setFilteredGoals] = useState<Goal[] | null>(null);
  const [search, setSearch] = useState("");
  const [replying, setReplying] = useState<SelectedItem | null>(null);

  const appData = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const onReply = (e: GestureResponderEvent, item: SelectedItem) => {
    const { pageY, locationY } = e.nativeEvent;
    let y = pageY - locationY - 10;

    setItemCoordinates({
      x: 0,
      y,
    });
    setReplying(item);
  };

  const onLongPress = (e: GestureResponderEvent, item: SelectedItem) => {
    const { pageY, locationY } = e.nativeEvent;
    let y = pageY - locationY - 10;

    setItemCoordinates({
      x: 0,
      y,
    });
    setSelectedItem(item);
  };

  useEffect(() => {
    if (!appData || !dispatch) return;

    (async () => {
      try {
        const response = await fetch(appData.api + "/goals", {
          method: "POST",
          body: JSON.stringify({ userId: appData.user?.uid }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!data.goals) return;
        const sortedGoals = data.goals.sort((a: Goal, b: Goal) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        dispatch({
          type: AppActionType.SET_SHARED_GOALS,
          payload: sortedGoals,
        });
      } catch (error) {
        console.log(error, "error");
      }
    })();
  }, []);

  useEffect(() => {
    if (!search) return;

    const filteredGoals = appData?.sharedGoals.filter((goal) => {
      return goal.description.toLowerCase().includes(search.toLowerCase());
    });

    setFilteredGoals(filteredGoals || []);
  }, [search]);

  return (
    <Host>
      <ScreenView title="Other members’ goals" touchableWithoutFeedback={false}>
        <View style={{ flex: 1 }}>
          {appData?.sharedGoals?.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View>
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
                  No other members’ have shared goals yet
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  paddingBottom: 20,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderRadius: 15,
                    flexDirection: "row",
                    paddingLeft: 11,
                    paddingTop: 7,
                    paddingBottom: 7,
                    minHeight: 40,
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <SearchSVG />
                  <TextInput
                    placeholder="Search"
                    placeholderTextColor="#6E6E6E"
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                    autoCorrect={false}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: "black",
                      paddingLeft: 5,
                      paddingRight: 5,
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                  }}
                  onPress={() => {
                    if (search) {
                      if (Keyboard.isVisible()) {
                        Keyboard.dismiss();
                      }
                      setFilteredGoals(null);
                      setSearch("");
                      return;
                    }
                  }}
                >
                  {!search ? (
                    <>
                      <SortSVG />
                      <Text
                        style={{
                          color: "6E6E6E",
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        Sort
                      </Text>
                    </>
                  ) : (
                    <CloseSVG />
                  )}
                </TouchableOpacity>
              </View>
              {search && filteredGoals && filteredGoals.length === 0 && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: 500 }}>
                    No goals found
                  </Text>
                </View>
              )}
              <FlatList
                data={search ? filteredGoals : appData?.sharedGoals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Post
                    postData={{
                      data: item,
                      type: "goal",
                      owned: false,
                    }}
                    appData={appData!}
                    onLongPress={onLongPress}
                    onReply={onReply}
                    origin="othersGoals"
                  />
                )}
              />
            </View>
          )}
        </View>
        <PortalViewPosts
          selectedItem={selectedItem}
          itemCoordinates={itemCoordinates}
          setSelectedItem={setSelectedItem}
        />
        <PortalViewReply
          selectedItem={replying}
          setSelectedItem={setReplying}
        />
      </ScreenView>
    </Host>
  );
}

const styles = StyleSheet.create({});
