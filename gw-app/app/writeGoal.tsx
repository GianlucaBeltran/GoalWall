import CategoryTag from "@/components/CategoryTag";
import ProfileIconSVG from "@/components/svg/ProfilIconSVG";
import { router, Stack, useNavigation } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

import { AppActionType, AppContext, AppDispatchContext } from "./_layout";
import { urlHome, urlSchool } from "./constants/apiEndpoints";
import { Goal } from "./types/goal.types";
import ScreenView from "@/components/ScreenView";

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

export default function setGoals() {
  const navigation = useNavigation();

  const dispatch = useContext(AppDispatchContext);
  const appData = useContext(AppContext);

  const [goalInput, setGoalInput] = useState("");

  const disableSubmit =
    goalInput.trim().length === 0 ||
    goalInput.trim().length > 50 ||
    !appData?.editingData?.avatar ||
    (appData.editingData.avatar.fileName ===
      appData?.editingData?.goal?.avatarFileName &&
      appData.editingData.goal.description === goalInput);

  const handleGoalInput = (text: string) => {
    if (text.trim().length > 50) return;
    if (text.trim().length === 0) {
      text = text.trim();
      setGoalInput(text);
    } else {
      setGoalInput(text);
    }
  };

  const shareGoal = async () => {
    if (
      !appData ||
      !appData.user ||
      !appData.user.goals ||
      !appData.editingData ||
      !appData.editingData.avatar
    )
      return;

    if (!dispatch) return;

    const goal: Goal = {
      description: goalInput,
      createdAt: appData.editingData.goal
        ? appData.editingData.goal.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: appData.editingData.goal
        ? appData.editingData.goal.id
        : (appData.user.goals.length + 1).toString(),
      avatarFileName: appData.editingData?.avatar?.fileName,
    };

    const requestBody = {
      goal,
      userId: appData.user.uid,
    };

    try {
      const response = await fetch(appData.api + "/goal", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const user = await response.json();
      dispatch({
        type: AppActionType.SET_USER,
        payload: user.user,
      });
      dispatch({
        type: AppActionType.RESET_EDITING,
        payload: null,
      });

      router.back();
      return;
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (!appData?.editingData || !appData.editingData.goal?.description) return;

    setGoalInput(appData.editingData.goal.description);
  }, []);

  useEffect(() => {
    const beforeRemove = () => {
      if (!dispatch) return;
      dispatch({
        type: AppActionType.RESET_EDITING,
        payload: null,
      });
    };
    navigation.addListener("beforeRemove", (e) => {
      beforeRemove();
    });

    return () => {
      navigation.removeListener("beforeRemove", (e) => {
        beforeRemove();
      });
    };
  }, []);

  return (
    <ScreenView title={appData?.editingData?.goal ? "Edit goal" : "New goal"}>
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
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => router.navigate("/avatar")}
        >
          {appData?.editingData?.avatar ? (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Change your avatar
              </Text>
              <View style={styles.avatarContainer}>
                <Image
                  source={appData.editingData.avatar.image}
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 90,
                  }}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                height: 74,
                width: "100%",
                borderColor: "#0A7E84",
                borderRadius: 15,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <ProfileIconSVG />
              <Text style={{ fontSize: 20, fontWeight: 500, marginLeft: 8 }}>
                Set your avatar
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 47,
            width: 200,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#EDEDED",
          }}
          disabled={disableSubmit ? true : false}
          onPress={() => shareGoal()}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 600,
              opacity: disableSubmit ? 0.3 : 1,
            }}
          >
            {appData?.editingData?.goal ? "Update and share" : "Share"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
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
    borderColor: "#0A7E84",
    padding: 10,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
