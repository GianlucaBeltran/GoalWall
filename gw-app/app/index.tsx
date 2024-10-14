import { router, useNavigation } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedView, {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  AppActionType,
  AppContext,
  AppDispatchContext,
} from "./context/appContext";
import { User } from "./types/data.types";
import { fetchUser } from "./constants/apiEndpoints";

export default function Home() {
  const navigation = useNavigation();

  const dispatch = useContext(AppDispatchContext);
  const appData = useContext(AppContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const buttonAnim = useSharedValue(firstName && lastName ? 200 : 0);
  const buttonAnimOpacity = useSharedValue(firstName && lastName ? 1 : 0);

  const refLastname = useRef<TextInput>(null);
  const focusOnPassword = () => {
    if (refLastname && refLastname.current) {
      refLastname.current.focus();
    }
  };

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  }

  useEffect(() => {
    changeScreenOrientation();
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    // if (animState.inProgress) return;
    setError("");
    if (firstName && lastName) {
      expandButton();
    } else {
      buttonAnim.value = 0;
      buttonAnimOpacity.value = 0;
    }
  }, [firstName, lastName]);

  function shrinkButton() {
    if (buttonAnim.value === 0) return;

    buttonAnim.value = withTiming(0, {
      duration: 100,
    });
    buttonAnimOpacity.value = withTiming(0, {
      duration: 100,
    });
  }
  function expandButton() {
    if (buttonAnim.value === 200) return;
    buttonAnim.value = withSpring(200, {
      duration: 1000,
    });
    buttonAnimOpacity.value = withTiming(1, {
      duration: 200,
    });
  }

  const validateUser = async () => {
    if (!firstName || !lastName) {
      return;
    }
    shrinkButton();

    const userLogin = {
      firstName,
      lastName,
    };
    console.log(appData?.api, "api");
    await fetchUser({
      url: appData?.api!,
      userLogin,
      dispatch: dispatch!,
      navigateCallBack: () => {
        router.navigate({
          pathname: "/account",
        });
      },
    });
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => {
          if (Keyboard.isVisible()) {
            Keyboard.dismiss();
          }
        }}
      >
        <View>
          <SafeAreaView>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View style={styles.container}>
                <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                  Goal Wall
                </Text>

                <View style={styles.loginContainer}>
                  <View style={styles.loginSection}>
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        marginBottom: 20,
                      }}
                    >
                      Log In
                    </Text>
                    <Text style={styles.inputTitle}>First Name</Text>
                    <TextInput
                      style={styles.inputContainer}
                      value={firstName}
                      onChangeText={(text) => setFirstName(text)}
                      returnKeyType="next"
                      enablesReturnKeyAutomatically={true}
                      autoCorrect={false}
                      autoComplete="off"
                      onSubmitEditing={focusOnPassword}
                    />
                  </View>
                  <View>
                    <Text style={styles.inputTitle}>Last Name</Text>
                    <TextInput
                      ref={refLastname}
                      style={styles.inputContainer}
                      value={lastName}
                      onChangeText={(text) => setLastName(text)}
                      onSubmitEditing={() => {
                        validateUser();
                      }}
                      returnKeyType="go"
                      enablesReturnKeyAutomatically={true}
                      autoCorrect={false}
                      autoComplete="off"
                    />
                  </View>
                  <Text
                    style={{ color: "red", marginTop: 10, textAlign: "center" }}
                  >
                    {error}
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                  <AnimatedView.View
                    style={{
                      width: buttonAnim,
                      opacity: !firstName && !lastName ? 0.2 : 1,
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
                      disabled={!firstName && !lastName}
                      onPress={() => {
                        validateUser();
                      }}
                    >
                      <AnimatedView.View
                        style={{
                          opacity:
                            !firstName && !lastName ? 0.2 : buttonAnimOpacity,
                        }}
                      >
                        <Text style={{ fontWeight: 600 }}>Log in</Text>
                      </AnimatedView.View>
                    </TouchableOpacity>
                  </AnimatedView.View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    width: "80%",
    // padding: 20,
    borderRadius: 20,
    // backgroundColor: "white",
  },
  loginSection: {
    marginBottom: 20,
  },
  inputTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    padding: 10,
    borderRadius: 10,
    color: "black",
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
  },
  buttonContainer: {
    marginTop: 20,
    flex: 0.2,
  },
});
