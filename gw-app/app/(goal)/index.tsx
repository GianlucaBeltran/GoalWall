import BackgroundImage from "@/components/BacgkroundImage";
import ChevronLeftSVG from "@/components/svg/ChevronLeftSVG";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Svg, {
  G,
  TextPath,
  TSpan,
  Text as TextSVG,
  Circle,
} from "react-native-svg";
import AnimatedView, {
  withSpring,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
  AnimationCallback,
} from "react-native-reanimated";

interface Goal {
  uid: number;
  title?: string;
  description?: string;
  date: string;
}

interface AnimState {
  started: boolean;
  inProgress: boolean;
  ended: boolean;
}

export default function Goal() {
  const [goal, setGoal] = useState<Goal | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [animState, setAnimState] = useState<AnimState>({
    started: false,
    inProgress: false,
    ended: false,
  });
  const navigation = useNavigation();

  const circleAnim = useSharedValue(340);
  const goalTextAnim = useSharedValue(1);
  const buttonAnim = useSharedValue(200);
  const buttonAnimOpacity = useSharedValue(1);

  useEffect(() => {
    if (!goal?.description) return;
    setGoalInput(goal?.description);
  }, [goal]);

  function reverseString(string: string) {
    var reversedString = [];
    for (let index = string.length - 1; index > -1; index--) {
      reversedString.push(string[index]);
    }

    return reversedString.join("");
  }

  function expandCircle() {
    circleAnim.value = withTiming(20, {
      duration: 2000,
      easing: Easing.out(Easing.poly(3)),
    });
    goalTextAnim.value = withTiming(0, { duration: 2000 }, (finished) => {
      runOnJS(setIsEditing)(true);
      runOnJS(expandButton)();
      runOnJS(endAnimState)();
    });
  }

  function shrinkCircle() {
    circleAnim.value = withTiming(320, {
      duration: 2000,
      easing: Easing.in(Easing.linear),
    });
    goalTextAnim.value = withTiming(1, { duration: 2000 }, (finished) => {
      runOnJS(expandButton)();
      runOnJS(endAnimState)();
    });
  }

  function shrinkButton(
    buttonCallBack?: AnimationCallback,
    textCallBack?: AnimationCallback
  ) {
    buttonAnim.value = withTiming(
      0,
      {
        duration: 500,
      },
      buttonCallBack
    );
    buttonAnimOpacity.value = withTiming(
      0,
      {
        duration: 200,
      },
      textCallBack
    );
  }
  function expandButton(
    buttonCallBack?: AnimationCallback,
    textCallBack?: AnimationCallback
  ) {
    buttonAnim.value = withSpring(
      200,
      {
        duration: 2000,
      },
      buttonCallBack
    );
    buttonAnimOpacity.value = withTiming(
      1,
      {
        duration: 200,
      },
      textCallBack
    );
  }

  function startAnimState() {
    setAnimState({ started: true, inProgress: true, ended: false });
  }

  function endAnimState() {
    setAnimState({ started: true, inProgress: false, ended: true });
  }

  async function submitGoal() {
    setGoal({
      uid: 1,
      description: goalInput,
      date: new Date().toDateString(),
    });

    try {
      const response = await fetch("192.168.0.218/");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => {
        if (Keyboard.isVisible()) {
          Keyboard.dismiss();
        }
      }}
    >
      <View style={{ flex: 1 }}>
        <BackgroundImage />
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View
              style={{
                marginLeft: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: 35,
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ChevronLeftSVG />
              </TouchableOpacity>
            </View>
            <View style={styles.goalCircleContainer}>
              {/* <BlurView
            intensity={50}
            style={{ position: "absolute", height: "100%", width: "100%" }}
            tint="systemChromeMaterial"
          > */}
              <AnimatedView.View
                style={[
                  styles.goalCircle,
                  {
                    borderRadius: circleAnim,
                    // height: !isEditing ? 340 : 250,
                    justifyContent: !isEditing ? "center" : "flex-start",
                    alignItems: !isEditing ? "center" : "flex-start",
                    padding: isEditing ? 20 : 0,
                  },
                ]}
              >
                {!isEditing && goal && (
                  <>
                    {animState.ended && (
                      <Svg
                        height="100%"
                        width="100%"
                        style={{ position: "absolute" }}
                        viewBox="0 0 340 340"
                      >
                        <G id="circle">
                          <Circle
                            r={160}
                            x={170}
                            y={170}
                            fill="none"
                            stroke="none"
                          />
                        </G>
                        <TextSVG fill="black" fontSize="32" fontWeight={700}>
                          <TextPath href="#circle" startOffset={716}>
                            <TSpan rotate={0} y={20}>
                              Goal
                            </TSpan>
                          </TextPath>
                        </TextSVG>
                        <TextSVG fill="grey" fontSize="10">
                          <TextPath href="#circle" startOffset={210}>
                            <TSpan rotate={180}>
                              {goal && goal.date && reverseString(goal.date)}
                            </TSpan>
                          </TextPath>
                        </TextSVG>
                      </Svg>
                    )}
                    <AnimatedView.View style={{ opacity: goalTextAnim }}>
                      <Text>{goal.title}</Text>
                      <Text>{goal.description}</Text>
                    </AnimatedView.View>
                  </>
                )}
                {!isEditing && !goal && (
                  <AnimatedView.View
                    style={{
                      opacity: goalTextAnim,
                    }}
                  >
                    <Text style={{ fontSize: 32, textAlign: "center" }}>
                      Set a goal and share it on the wall!
                    </Text>
                  </AnimatedView.View>
                )}
                {isEditing && (
                  <>
                    <Text style={{ fontWeight: 700, fontSize: 32 }}>Goal</Text>
                    <TextInput
                      multiline
                      value={goalInput}
                      style={styles.goalInput}
                      onChangeText={(text) => setGoalInput(text)}
                      autoFocus
                    />
                  </>
                )}
              </AnimatedView.View>
              {/* </BlurView> */}
            </View>
            <View
              style={{
                flex: 0.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AnimatedView.View
                style={{
                  width: buttonAnim,
                  opacity: isEditing && !goalInput ? 0.2 : 1,
                  height: 50,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                  }}
                  disabled={(isEditing && !goalInput) || animState.inProgress}
                  onPress={() => {
                    if (!isEditing) {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      startAnimState();
                      shrinkButton();
                      expandCircle();
                    } else {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      startAnimState();
                      setIsEditing(false);

                      submitGoal();

                      if (Keyboard.isVisible()) {
                        Keyboard.dismiss();
                      }
                      shrinkCircle();
                      shrinkButton();
                    }
                  }}
                >
                  <AnimatedView.View
                    style={{
                      opacity:
                        isEditing && !goalInput ? 0.2 : buttonAnimOpacity,
                    }}
                  >
                    <Text style={{ fontWeight: 600 }}>
                      {!isEditing && goal && "Edit"}
                      {!isEditing && !goal && "Set a goal"}
                      {isEditing && "Submit"}
                    </Text>
                  </AnimatedView.View>
                </TouchableOpacity>
              </AnimatedView.View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  goalCircleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  goalCircle: {
    width: 340,
    // height: 340,
    maxHeight: 340,
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  goalInput: {
    flex: 1,
    width: "100%",
    borderRadius: 20,
  },
  goalButton: {
    width: 200,
    height: 50,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
