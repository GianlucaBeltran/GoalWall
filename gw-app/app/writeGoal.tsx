import CategoryTag from "@/components/CategoryTag";
import ChevronLeftSVG from "@/components/svg/ChevronLeftSVG";
import { useNavigation } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
// import CardView from "@/components/CardView";

export default function setGoals() {
  const navigation = useNavigation();

  const [goalInput, setGoalInput] = useState("");

  const categories = [
    {
      id: "0",
      name: "+ Create a category",
    },
    {
      id: "1",
      name: "Mental Health",
    },
    {
      id: "2",
      name: "Muscle gain",
    },
    {
      id: "3",
      name: "Weight loss",
    },
    {
      id: "4",
      name: "Weight gain",
    },
    {
      id: "5",
      name: "Mental health",
    },
    {
      id: "6",
      name: "Handstand",
    },
  ];

  const handleGoalInput = (text: string) => {
    if (text.length > 50) return;
    setGoalInput(text);
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            if (Keyboard.isVisible()) {
              Keyboard.dismiss();
            }
          }}
        >
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: 24,
                  height: 24,

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ChevronLeftSVG />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>New goal</Text>
              <View style={{ width: 24, height: 24 }} />
            </View>
            <View>
              <Text style={{ fontSize: 13, fontWeight: 400, color: "#818181" }}>
                Choose a category
              </Text>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <CategoryTag key={category.id} category={category.name} />
                ))}
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: 500 }}>
                  Specify your goal
                </Text>
                <View
                  style={{
                    width: 45,
                    height: 24,
                    borderRadius: 6,
                    backgroundColor: "#505050",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12, padding: 5 }}>
                    {goalInput.length}/50
                  </Text>
                </View>
              </View>
              <TextInput
                style={styles.textInput}
                value={goalInput}
                onChangeText={(text) => handleGoalInput(text)}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 74,
                  width: "100%",
                  borderRadius: 15,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: 500 }}>
                  Set your avatar
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  height: 47,
                  width: 187,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#EDEDED",
                }}
                disabled
              >
                <Text style={{ fontSize: 20, fontWeight: 600 }}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 50,
    padding: 20,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  categoryContainer: {
    height: 170,
    // padding: 20,
    marginTop: 20,
    // marginBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-evenly",
  },
  inputContainer: {
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    justifyContent: "space-evenly",
  },
  textInput: {
    height: 54,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "black",
    padding: 10,
  },
});
