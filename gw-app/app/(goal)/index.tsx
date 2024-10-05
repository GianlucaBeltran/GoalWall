import BackgroundImage from "@/components/BacgkroundImage";
import ChevronLeftSVG from "@/components/svg/ChevronLeftSVG";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
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
  Defs,
  G,
  Path,
  TextPath,
  TSpan,
  Text as TextSVG,
  Circle,
} from "react-native-svg";

interface Goal {
  uid: number;
  title?: string;
  description?: string;
  date: string;
}

export default function Goal() {
  const [goal, setGoal] = useState<Goal | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [showDate, setShowDate] = useState(false);

  const navigation = useNavigation();

  const circleAnim = useRef(new Animated.Value(340)).current;
  const goalTextAnim = useRef(new Animated.Value(1)).current;

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
              <Animated.View
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
                    {showDate && (
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
                        <TextSVG fill="grey" fontSize="10">
                          <TextPath href="#circle" startOffset={210}>
                            <TSpan rotate={180}>
                              {goal && goal.date && reverseString(goal.date)}
                            </TSpan>
                          </TextPath>
                        </TextSVG>
                      </Svg>
                    )}
                    <Animated.View style={{ opacity: goalTextAnim }}>
                      <Text>{goal.title}</Text>
                      <Text>{goal.description}</Text>
                    </Animated.View>
                  </>
                )}
                {!isEditing && !goal && (
                  <Animated.View
                    style={{
                      opacity: goalTextAnim,
                    }}
                  >
                    <Text style={{ fontSize: 32, textAlign: "center" }}>
                      Set a goal and share it on the wall!
                    </Text>
                  </Animated.View>
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
              </Animated.View>
              {/* </BlurView> */}
            </View>
            {/* <Button title="Edit" /> */}
            <View
              style={{
                flex: 0.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ opacity: isEditing && !goalInput ? 0.2 : 1 }}
                onPress={() => {
                  if (!isEditing) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setShowDate(false);
                    Animated.timing(circleAnim, {
                      toValue: 20,
                      duration: 2000,
                      easing: Easing.out(Easing.circle),
                      useNativeDriver: true,
                    }).start();
                    Animated.timing(goalTextAnim, {
                      toValue: 0,
                      duration: 2000,
                      useNativeDriver: true,
                    }).start((result) => {
                      setIsEditing(true);
                    });
                  } else {
                    if (!goalInput) return;
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setGoal({
                      uid: 1,
                      description: goalInput,
                      date: new Date().toDateString(),
                    });
                    setIsEditing(false);
                    if (Keyboard.isVisible()) {
                      Keyboard.dismiss();
                    }
                    Animated.timing(circleAnim, {
                      toValue: 340,
                      duration: 2000,
                      useNativeDriver: true,
                    }).start();
                    Animated.timing(goalTextAnim, {
                      toValue: 1,
                      duration: 2000,
                      useNativeDriver: true,
                    }).start((result) => setShowDate(true));
                  }
                }}
              >
                <View style={styles.goalButton}>
                  <Text style={{ fontWeight: 600 }}>
                    {!isEditing && goal && "Edit"}
                    {!isEditing && !goal && "Set a goal!"}
                    {isEditing && "Submit"}
                  </Text>
                </View>
              </TouchableOpacity>
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
