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

import {
  AppActionType,
  AppContext,
  AppDispatchContext,
} from "./context/appContext";
import { Goal } from "./types/data.types";
import ScreenView from "@/components/ScreenView";
import { getAvatar } from "./constants/avatars";
import AvatarImage from "@/components/AvatarImage";

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  {
    id: "0",
    name: "+ Create a category",
  },
  {
    id: "1",
    name: "Wellness",
  },
  {
    id: "2",
    name: "Strength",
  },
  {
    id: "3",
    name: "Flexibility",
  },
  {
    id: "4",
    name: "Mental health",
  },

  {
    id: "5",
    name: "Motivation",
  },
  {
    id: "6",
    name: "Recovery",
  },
];

export default function setGoals() {
  const navigation = useNavigation();

  const dispatch = useContext(AppDispatchContext);
  const appData = useContext(AppContext);
  const [goalInput, setGoalInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    appData?.editingData?.goal?.categories || []
  );

  const disableSubmit =
    goalInput.trim().length === 0 ||
    goalInput.trim().length > 50 ||
    (appData?.editingData?.goal?.description === goalInput &&
      selectedCategories.sort((a, b) => {
        return a.id < b.id ? -1 : 1;
      }) ===
        appData?.editingData?.goal?.categories?.sort((a, b) => {
          return a.id < b.id ? -1 : 1;
        }));

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
    if (!appData || !appData.user) return;

    if (!dispatch) return;

    const goal: Goal = {
      description: goalInput,
      createdAt: appData.editingData?.goal
        ? appData.editingData.goal.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      categories: selectedCategories,
      id: appData.editingData?.goal?.id || "",
      comments: appData.editingData?.goal?.comments || [],
      authorId: appData.user.uid,
      reactions: appData.editingData?.goal?.reactions || [],
    };

    const requestBody = {
      goal,
      userId: appData.user.uid,
      avatarFileName: appData.editingData?.avatar?.fileName
        ? appData.editingData.avatar.fileName
        : undefined,
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
      setSelectedCategories([]);

      router.dismiss(!appData.user.avatarFileName ? 2 : 1);
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
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => {
                setSelectedCategories((prev) => {
                  if (
                    prev.find(
                      (prevCategory) => prevCategory.name === category.name
                    )
                  ) {
                    return prev.filter(
                      (prevCategory) => prevCategory.name !== category.name
                    );
                  } else {
                    return [...prev, category];
                  }
                });
              }}
              disabled={!index}
            >
              <CategoryTag
                category={category.name}
                selected={
                  selectedCategories.find((selectedCategory) => {
                    return selectedCategory.name === category.name;
                  })
                    ? true
                    : false
                }
              />
            </TouchableOpacity>
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
        <AvatarImage
          avatarImage={
            appData?.editingData?.avatar?.image
              ? appData.editingData.avatar.image
              : getAvatar(appData?.user?.avatarFileName)?.image
          }
          size={100}
        />
        <TouchableOpacity
          style={{
            height: 47,
            width: 200,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            opacity: disableSubmit ? 0.5 : 1,
          }}
          disabled={disableSubmit ? true : false}
          onPress={() => shareGoal()}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "white",
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
    // justifyContent: "space-evenly",
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
