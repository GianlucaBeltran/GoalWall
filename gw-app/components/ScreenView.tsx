import { useNavigation } from "expo-router";
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChevronLeftSVG from "@/components/svg/ChevronLeftSVG";

export default function ScreenView({
  title,
  children,
  itemRight,
  touchableWithoutFeedback = true,
  edges = ["top"],
}: {
  title: string;
  children: React.ReactNode;
  itemRight?: React.ReactNode;
  touchableWithoutFeedback?: boolean;
  edges?: ("top" | "right" | "bottom" | "left")[];
}) {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            if (Keyboard.isVisible()) {
              Keyboard.dismiss();
            }
          }}
          disabled={!touchableWithoutFeedback}
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
              <Text style={{ fontSize: 16, fontWeight: 500 }}>{title}</Text>
              <View style={{ width: 24, height: 24 }}>{itemRight}</View>
            </View>
            {children}
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
});
