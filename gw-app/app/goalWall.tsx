import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  LayoutChangeEvent,
  GestureResponderEvent,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { ImageBackground } from "expo-image";
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
import { formatedDate } from "./helpers/dateFormating";
import Animated, {
  cancelAnimation,
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
import ReactionsDisplay from "@/components/ReactionsDisplay";

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

function GoalItem({ goal }: { goal: Goal }) {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [itemCoordinates, setItemCoordinates] = useState({ x: 0, y: 0 });

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

  return (
    <View
      style={{
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          gap: 10,
          backgroundColor: "white",
          borderRadius: 20,
        }}
        onLongPress={(e) => onLongPress(e)}
      >
        <AvatarImage
          size={39}
          avatarImage={goal.avatarFileName!}
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
            <ReactionsDisplay reactions={goal.reactions} />
          </View>
        </View>
      </TouchableOpacity>
      <PortalViewPost
        selectedItem={selectedItem}
        itemCoordinates={itemCoordinates}
        setSelectedItem={setSelectedItem}
      />
    </View>
  );
}

function GoalPathContainer({
  goals,
  screenWidth,
}: {
  goals: Goal[];
  screenWidth: number;
}) {
  const [pathWidth, setPathWidth] = useState<number | undefined>();
  const [paused, setPaused] = useState(false);

  const goalStartPos = useSharedValue(100);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: goalStartPos.value }],
    gap: 100,
    flexDirection: "row",
    alignItems: "center",
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setPathWidth(width);
  };

  const startAnimation = () => {
    if (!pathWidth) return;

    goalStartPos.value = withRepeat(
      withTiming(-pathWidth - screenWidth - 100 * goals.length - 10, {
        duration: 40000 + goals.length / 100,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  };

  useEffect(() => {
    goalStartPos.value = screenWidth;
    startAnimation();
  }, [pathWidth]);

  return (
    <Animated.View
      style={[animatedStyles, { flex: 1, flexDirection: "row" }]}
      onLayout={onLayout}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (paused) {
            startAnimation();
            setPaused(false);
          } else {
            cancelAnimation(goalStartPos);
            setPaused(true);
          }
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 100,
          flex: 1,
        }}
      >
        {goals.length !== 0 &&
          goals.map((goal, index) => <GoalItem key={goal.id} goal={goal} />)}
      </TouchableOpacity>
    </Animated.View>
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
    (async () => {
      changeScreenOrientation(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      ).then(() =>
        setTimeout(() => setScreenWidth(Dimensions.get("screen").width), 1000)
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

  console.log(goals.length, "goals", paths.length, "paths", goalsPerPath);

  return (
    <ImageBackground
      source={appData?.api + "/user/background/" + "backgroundImageRotated.png"}
      style={styles.imageBackground}
    >
      <Host>
        <View style={styles.container}>
          <View
            style={{
              margin: 20,
              marginLeft: 60,
              marginBottom: 5,
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeftSVG />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("/othersGoals")}>
              <Text>See Goals List</Text>
            </TouchableOpacity>
          </View>
          {screenWidth && (
            <>
              {goals.length !== 0 && (
                <View style={styles.goalsContainer}>
                  <>
                    {paths.map((path, index) => (
                      <GoalPathContainer
                        key={index}
                        goals={path}
                        screenWidth={screenWidth}
                      />
                    ))}
                  </>
                </View>
              )}
            </>
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
