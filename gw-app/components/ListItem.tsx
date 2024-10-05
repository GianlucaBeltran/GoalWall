import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ListItemProps } from "./ListComponent";
import ChevronRightSVG from "./svg/ChevronRightSVG";
import { router } from "expo-router";

export default function ListItem({ item }: { item: ListItemProps }) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!item.navigation) return;
        router.navigate(item.navigation);
      }}
    >
      <View style={styles.container}>
        <Text style={styles.header}>{item.header}</Text>
        {item.clickable && <ChevronRightSVG />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 16,
    fontWeight: 500,
  },
});
