import { View, Text, StyleSheet } from "react-native";
import ChevronLeftSVG from "./svg/ChevronLeftSVG";
import LogoutSVG from "./svg/LogoutSVG";
import CloseSVG from "./svg/CloseSVG";

export default function CardView({
  children,
  topNavigationHeader,
  topSectionComponent,
}: {
  children?: React.ReactNode;
  topNavigationHeader?: string;
  topSectionComponent?: React.ReactNode;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {topNavigationHeader && (
          <>
            <View style={styles.topNavigation}>
              <CloseSVG />
              <Text style={styles.navigationTitle}>Account</Text>
              <LogoutSVG />
            </View>
          </>
        )}
        {topSectionComponent}
      </View>
      <View style={styles.bottomSection}>
        {children}
        <View>
          <Text style={{ color: "grey" }}>Group 16 🦚</Text>
          <Text style={{ color: "grey" }}>Version 0.0.2</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 50,
  },
  topSection: {
    padding: 20,
    marginBottom: 1.5,
    backgroundColor: "white",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  topNavigation: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomSection: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingBottom: 50,
  },
  navigationTitle: {
    fontSize: 16,
    fontWeight: 500,
  },
});
