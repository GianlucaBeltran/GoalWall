import BackgroundSVG from "@/components/svg/BackgroundSVG";
import ChevronLeftSVG from "@/components/svg/ChevronLeftSVG";
import { BlurView } from "expo-blur";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Button } from "react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Goal() {
  const navigation = useNavigation();

  const goal = {
    name: "Goal",
    description: "Description",
    date: new Date().toDateString(),
  };

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeftSVG />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        style={{
          height: "100%",
          width: "100%",
          flex: 1,
          position: "absolute",
        }}
      >
        {/* <BlurView
          intensity={50}
          style={{ position: "absolute", height: "100%", width: "100%" }}
          tint="systemChromeMaterial"
        > */}
        <BackgroundSVG />
        {/* </BlurView> */}
      </ImageBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.goalCircleContainer}>
          {/* <BlurView
            intensity={50}
            style={{ position: "absolute", height: "100%", width: "100%" }}
            tint="systemChromeMaterial"
          > */}
          <View style={styles.goalCircle}>
            <Text>{goal.name}</Text>
            <Text>{goal.description}</Text>
            <Text>{goal.date}</Text>
          </View>
          {/* </BlurView> */}
        </View>
        {/* <Button title="Edit" /> */}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity>
            <View style={styles.goalButton}>
              <Text style={{ fontWeight: 600 }}>Edit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  goalCircleContainer: {
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  goalCircle: {
    width: 340,
    height: 340,
    borderRadius: 340,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
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
