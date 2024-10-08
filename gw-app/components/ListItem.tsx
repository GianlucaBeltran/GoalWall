import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ListItemProps } from "./ListComponent";
import ChevronRightSVG from "./svg/ChevronRightSVG";
import { router } from "expo-router";

export default function ListItem({
  item,
  svg,
}: {
  item: ListItemProps;
  svg?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!item.navigation) return;
        router.navigate(item.navigation);
      }}
    >
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {svg}
          <Text style={styles.header}>{item.header}</Text>
        </View>
        {item.clickable && <ChevronRightSVG />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingLeft: 0,
    paddingRight: 0,
    // paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 16,
    fontWeight: 500,
    marginLeft: 10,
  },
});
