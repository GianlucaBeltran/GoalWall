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
import {
  Dispatch,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ChevronLeftSVG from "@/components/svg/ChevronLeftSVG";
import { router } from "expo-router";
import { Goal, SelectedItem } from "./types/data.types";
import { AppContext } from "./context/appContext";
import AvatarImage from "@/components/AvatarImage";
import { getAvatar } from "./constants/avatars";
import { formatedDate } from "./helpers/dateFormating";
import Animated, {
  Easing,
  measure,
  runOnJS,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Host } from "react-native-portalize";
import PortalViewPost from "@/components/PortalViewPosts";
import * as Haptics from "expo-haptics";

const categories: Record<string, { id: string; name: string; color: string }> =
  {
    "+ Create a category": {
      id: "0",
      name: "+ Create a category",
      color: "red",
    },
    Wellness: {
      id: "1",
      name: "Wellness",
      color: "white",
    },
    Strength: {
      id: "2",
      name: "Strength",
      color: "#FF8C96",
    },
    Flexibility: {
      id: "3",
      name: "Flexibility",
      color: "#BAF3FF",
    },
    "Mental health": {
      id: "4",
      name: "Mental health",
      color: "#FFE681",
    },

    Motivation: {
      id: "5",
      name: "Motivation",
      color: "#FFC7E0",
    },
    Recovery: {
      id: "6",
      name: "Recovery",
      color: "#C3FF8B",
    },
  };

function GoalItem({
  goal,
  goalIndex,
  setFinishedGoal,
  setCanPushNew,
}: {
  goal: Goal;
  goalIndex: number;
  setFinishedGoal: Dispatch<React.SetStateAction<boolean>>;
  setCanPushNew: Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [itemCoordinates, setItemCoordinates] = useState({ x: 0, y: 0 });
  const [screenWidth, setScreenWidth] = useState<number | null>();

  const goalPosition = useSharedValue(1000);

  const [goalWidth, setGoalWidth] = useState<number | undefined>();
  const [pushed, setPushed] = useState(false);

  const goalColor =
    goal.categories &&
    goal.categories.length > 0 &&
    categories[goal.categories[0].name]
      ? categories[goal.categories[0].name].color
      : "#81ffd1";

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
    transform: [{ translateX: goalPosition.value }],
    position: "absolute",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    goalPosition.value = Dimensions.get("screen").width + 30;
    setScreenWidth(Dimensions.get("screen").width);
    setGoalWidth(width);
  };

  const postReactions = new Set(goal.reactions.map((r) => r.type));

  useFrameCallback((frameInfo) => {
    if (!goalWidth || !screenWidth) return;

    if (goalPosition.value > -(goalWidth + screenWidth)) {
      goalPosition.value -= 1;
    }
    if (pushed) return;
    if (goalPosition.value < -goalWidth) {
      runOnJS(setPushed)(true);
      runOnJS(setCanPushNew)(true);
    }
  });

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
  const [animatingGoals, setAnimatingGoals] = useState<Goal[]>([]);
  const [finishedGoal, setFinishedGoal] = useState<boolean>(false);
  const [canPushNew, setCanPushNew] = useState(false);
  const [currentIndex, setCurrenIndex] = useState(0);

  useEffect(() => {
    if (animatingGoals.length) return;
    setAnimatingGoals(goals.slice(0, 1));
    setCurrenIndex(1);
  }, [goals, animatingGoals]);

  useEffect(() => {
    if (finishedGoal) {
      setAnimatingGoals(animatingGoals.slice(1));
      setFinishedGoal(false);
    }
  }, [finishedGoal]);

  useEffect(() => {
    if (goals.length < 2) return;
    if (canPushNew) {
      console.log("pushing", goals[currentIndex % goals.length].description);
      setAnimatingGoals([
        ...animatingGoals,
        goals[currentIndex % goals.length],
      ]);
      setCanPushNew(false);
      setCurrenIndex((currentIndex % goals.length) + 1);
    }
  }, [canPushNew]);

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {animatingGoals.length !== 0 &&
        animatingGoals
          .slice(0, 1)
          .map((goal, index) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              setFinishedGoal={setFinishedGoal}
              setCanPushNew={setCanPushNew}
              goalIndex={index}
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
      ScreenOrientation.getOrientationAsync().then((value) => {
        if (value === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
          setScreenWidth(Dimensions.get("screen").width);
        }
      });
    });
  }, []);

  useEffect(() => {
    (async () => {
      await changeScreenOrientation(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );

      console.log("fetching goals");

      try {
        const response = await fetch(appData?.api + "/goal/allGoals");
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

  const numberOfPaths = goals.length < 4 ? goals.length : 4;
  const goalsPerPath = goals.length / numberOfPaths;
  console.log(goalsPerPath, "test", numberOfPaths, screenWidth, goals.length);
  const paths = Array.from({ length: numberOfPaths }, (_, i) => {
    return goals.slice(i * goalsPerPath, (i + 1) * goalsPerPath);
  });

  return (
    <ImageBackground
      source={require("../assets/images/backgroundImageRotated.png")}
      style={styles.imageBackground}
    >
      {/* {screenWidth && ( */}
      <Host>
        <View style={styles.container}>
          <View style={{ margin: 20, marginLeft: 60, marginBottom: 5 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeftSVG />
            </TouchableOpacity>
          </View>
          {goals.length !== 0 && (
            <View style={styles.goalsContainer}>
              <>
                {paths.map((path, index) => (
                  <GoalPathContainer key={index} goals={path} />
                ))}
              </>
            </View>
          )}
        </View>
      </Host>
      {/* )} */}
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
