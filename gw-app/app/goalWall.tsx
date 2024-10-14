import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  LayoutChangeEvent,
  GestureResponderEvent,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { Dispatch, useContext, useEffect, useState } from "react";
import ChevronLeftSVG from "@/components/svg/ChevronLeftSVG";
import { router } from "expo-router";
import { Goal, SelectedItem } from "./types/data.types";
import { AppContext } from "./context/appContext";
import AvatarImage from "@/components/AvatarImage";
import { getAvatar } from "./constants/avatars";
import { formatedDate } from "./helpers/dateFormating";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Host } from "react-native-portalize";
import PortalViewPost from "@/components/PortalViewPosts";
import * as Haptics from "expo-haptics";

function GoalItem({
  goal,
  index,
  setFinishedGoal,
  startAnimation,
}: {
  goal: Goal;
  index: number;
  setFinishedGoal: Dispatch<React.SetStateAction<Goal | null>>;
  startAnimation?: boolean;
}) {
  const [goalWidth, setGoalWidth] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [itemCoordinates, setItemCoordinates] = useState({ x: 0, y: 0 });
  const [finished, setFinished] = useState(false);
  const offset = useSharedValue(Dimensions.get("screen").width + 30);

  const onLongPress = (e: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const { pageY, locationY } = e.nativeEvent;
    let y = pageY - locationY - 10;

    setItemCoordinates({
      x: 0,
      y: 0,
    });
    const selectedItem: SelectedItem = {
      item: goal,
      isGoal: true,
      owned: false,
      avatarFileName: goal.avatarFileName,
      origin: "goalWall",
    };
    setSelectedItem(selectedItem);
  };
  // const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
    position: "absolute",
    // flex: 1,
    justifyContent: "center",
    // width: 300,
    flexDirection: "row",
    alignItems: "center",
    // padding: 10,
    // gap: 10,
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;

    setGoalWidth(width);
  };

  useEffect(() => {
    if (!goalWidth) return;
    offset.value = Dimensions.get("screen").width + 30;
    if (!startAnimation) return;
    // setTimeout(() => {
    //   offset.value = withRepeat(
    //     withTiming(
    //       -Dimensions.get("screen").width,
    //       {
    //         duration: 15000,
    //         easing: Easing.linear,
    //       },
    //       (finished) => {
    //         if (finished) {
    //           // setGoalFinished(goal);
    //         }
    //       }
    //     ),
    //     -1,
    //     false
    //   );
    // }, Math.random() * 2000 + index * 5000 + goalWidth);
    setTimeout(() => {
      offset.value = withTiming(
        // -Dimensions.get("screen").width,
        -goalWidth,
        {
          duration: 15000,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            runOnJS(setFinishedGoal)(goal);
            runOnJS(setFinished)(true);
          }
        }
      );
    }, Math.random() * 2000 + index * 5000 + goalWidth);
  }, [goalWidth, startAnimation, setFinished]);

  const postReactions = new Set(goal.reactions.map((r) => r.type));

  return (
    <Animated.View style={animatedStyles} key={goal.id} onLayout={onLayout}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          gap: 10,
          backgroundColor: "white",
          borderRadius: 20,
          maxWidth: 500,
        }}
        onLongPress={(e) => onLongPress(e)}
        // disabled={!onLongPress}
      >
        <AvatarImage
          size={39}
          avatarImage={getAvatar(goal.avatarFileName)?.image}
          withShadow={false}
        />
        <View style={{ justifyContent: "space-between", gap: 3 }}>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontStyle: "italic",
              }}
            >
              {goal.description}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#6E6E6E",
              }}
            >
              {formatedDate(goal.createdAt)}
            </Text>
            {Array.from(postReactions).map((reaction: string, index) => {
              return (
                <View key={index}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#686868",
                    }}
                  >
                    {reaction}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        {/* {!postData.owned && (
              <View>
                <TouchableOpacity onPress={(e) => handleLongPress(e)}>
                  <ReactionSVG />
                </TouchableOpacity>
              </View>
            )} */}
      </TouchableOpacity>
      <PortalViewPost
        selectedItem={selectedItem}
        itemCoordinates={itemCoordinates}
        setSelectedItem={setSelectedItem}
      />
    </Animated.View>
  );
}

function GoalPathContainer({ goals }: { goals: Goal[] }) {
  const [goalWidth, setGoalWidth] = useState<number | null>(null);
  const [animatingGoals, setAnimatingGoals] = useState<Goal[]>(goals);
  const [finishedGoal, setGoalFinished] = useState<Goal | null>(null);
  const [currenIndex, setCurrentIndex] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setGoalWidth(width);
  };

  // useEffect(() => {
  //   if (goals.length > 3) {
  //     setAnimatingGoals(goals.slice(currenIndex, currenIndex + 3));
  //   } else {
  //     setAnimatingGoals(goals);
  //   }
  // }, []);

  useEffect(() => {
    if (!goalWidth) return;
    if (finishedGoal) {
      console.log("finishedGoal", finishedGoal.description);
      setAnimatingGoals((prev) => {
        const removedGoal = prev.shift();
        prev.push(removedGoal!);
        return prev;
      });

      setGoalFinished(null);
    }
  }, [finishedGoal]);

  return (
    <View style={{ flex: 1, flexDirection: "row" }} onLayout={onLayout}>
      {animatingGoals.map((goal, index) => (
        <GoalItem
          goal={goal}
          key={goal.id}
          index={index}
          setFinishedGoal={setGoalFinished}
          startAnimation={animatingGoals[0].id === goal.id}
        />
      ))}
    </View>
  );
}

export default function GoalWall() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  const appData = useContext(AppContext);

  async function changeScreenOrientation(
    direction: ScreenOrientation.OrientationLock
  ) {
    await ScreenOrientation.lockAsync(direction);
  }

  useEffect(() => {
    Dimensions.addEventListener("change", () => {
      setScreenWidth(Dimensions.get("screen").width);
    });
  }, []);

  useEffect(() => {
    (async () => {
      changeScreenOrientation(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );

      try {
        const response = await fetch(appData?.api + "/allGoals");
        const data = await response.json();
        setGoals(data.goals);
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      (async () => {
        await changeScreenOrientation(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      })();
    };
  }, []);

  const goalsPerPath = Math.round(goals.length / 4);

  const paths = Array.from({ length: 4 }, (_, i) => {
    return goals.slice(i * goalsPerPath, (i + 1) * goalsPerPath);
  });

  // if (goals.length % 4 !== 0) {
  //   paths[3] = paths[3].concat(goals.slice(paths[3].length * 4));
  // }

  return (
    <ImageBackground
      source={require("../assets/images/backgroundImageRotated.png")}
      style={styles.imageBackground}
    >
      {screenWidth && (
        <Host>
          <View style={styles.container}>
            <View style={{ margin: 20, marginLeft: 60, marginBottom: 5 }}>
              <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeftSVG />
              </TouchableOpacity>
            </View>
            {goals.length !== 0 && (
              <View style={styles.goalsContainer}>
                <GoalPathContainer goals={paths[0]} />
                <GoalPathContainer goals={paths[1]} />
                <GoalPathContainer goals={paths[2]} />
                <GoalPathContainer goals={paths[3]} />
              </View>
            )}
          </View>
        </Host>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
  },
  goalsContainer: {
    flex: 1,
    gap: 10,
    marginBottom: 20,
  },
});
